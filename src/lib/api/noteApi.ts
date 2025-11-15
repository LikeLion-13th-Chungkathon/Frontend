import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  DailyNote,
  Highlight, // ⬅️ (추가) HighlightRenderer를 위해
  CreateTextNoteDTO,
  ApiMemo, // ⬅️ (추가) 타입 분리
  ApiTagging, // ⬅️ (추가) 타입 분리
  MemoCreateResponse, // ⬅️ (추가) 타입 분리
  TaggingCreateResponse, // ⬅️ (추가) 타입 분리
} from "../../types";

//Api 응답 타입 요청

import { useModalActions } from "../../store/useModalStore";
import axios from "../axiosInstance";
import { tagStyleToCategory, categoryToTagStyle } from "../utils/tagHelpers";

// 특정 날짜의 모든 노트(Memo) 조회 (GET/memos) 하이라이트 포함x
export const useNotesByDateQuery = (projectId: string | null, date: string) => {
  return useQuery<DailyNote[]>({
    queryKey: ["notes", projectId, date], // 날짜별로 캐싱
    queryFn: async () => {
      const { data } = await axios.get<{ results: ApiMemo[] }>("/memos/", {
        params: { project_id: projectId, date },
      });
      console.log(data);
      // Apimemo -> DailyNote 용으로 변환
      return data.results.map((memo) => ({
        id: String(memo.id),
        date: memo.date,
        content: memo.contents,
        projectId: String(memo.project),
        createdAt: memo.created_at,
        updatedAt: memo.modified_at,
        highlights: [], // ⬅️ 목록에서는 하이라이트 미포함
      }));
    },
    enabled: !!projectId,
  });
};

// 텍스트 전용 노트 생성 뮤테이션 (POST/memos/)
export const useCreateTextNoteMutation = () => {
  const queryClient = useQueryClient();
  const { openLogAcquiredModal } = useModalActions();

  return useMutation({
    mutationFn: async (noteData: CreateTextNoteDTO) => {
      const payload = {
        project: Number(noteData.projectId),
        contents: noteData.content,
        date: new Date().toISOString().split("T")[0], // 오늘 날짜 추가
      };
      const { data } = await axios.post<MemoCreateResponse>("/memos/", payload);
      console.log("post/memos/데이터결과: ", data);
      return data;
    },
    onSuccess: (data) => {
      // 텍스트 생성 성공 시, 홈의 노트 목록을 갱신
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (data.log_result?.success) {
        openLogAcquiredModal("이 프로젝트");
      }
    },
  });
};

type NoteByIdQueryKey = readonly (string | null)[];
// React Query 옵션 타입을 정의
type UseNoteByIdQueryOptions = Omit<
  UseQueryOptions<DailyNote, Error, DailyNote, NoteByIdQueryKey>,
  "queryKey" | "queryFn"
>;

// 특정 ID의 노트 상세 정보를 가져오는 쿼리 (모달용)
// (GET /memos/{id} + GET /taggings/memo/{id})
export const useNoteByIdQuery = (
  noteId: string | null,
  options?: UseNoteByIdQueryOptions
) => {
  return useQuery<DailyNote, Error, DailyNote, NoteByIdQueryKey>({
    queryKey: ["notes", noteId], // ⬅️ ['notes', 'note-123']
    queryFn: async () => {
      // api 병렬호출
      const [memoRes, taggingRes] = await Promise.all([
        axios.get<{ results: ApiMemo }>(`/memos/${noteId}/`),
        axios.get<{ results: ApiTagging[] }>(`/taggings/memo/${noteId}/`),
      ]);

      const memo = memoRes.data.results;
      const taggings = taggingRes.data.results;
      console.log("get/memos/id 텍스트값: ", memo);
      console.log("get/taggings/memo/id 태깅값: ", taggings);

      // api 두개 -> DailyNote 1개로 조합
      const highlights: Highlight[] = taggings.map((tag) => ({
        id: String(tag.id),
        category: tagStyleToCategory(tag.tag_style),
        startIndex: tag.offset_start,
        endIndex: tag.offset_end,
        text: tag.tag_contents,
      }));

      return {
        id: String(memo.id),
        date: memo.date,
        content: memo.contents,
        projectId: String(memo.project),
        createdAt: memo.created_at,
        updatedAt: memo.modified_at,
        highlights: highlights,
      };
    },
    enabled: !!noteId,
    staleTime: 1000 * 60,
    ...options,
  });
};

// 노트 수정(하이라이팅) 뮤테이션 두개

// 노트 텍스트 수정 (PUT /memos/{id})
// (NoteDetailModal에서 텍스트가 변경되었을 때 호출)
export const useUpdateMemoMutation = (noteId: string) => {
  const queryClient = useQueryClient();
  // (참고: PUT은 전체 객체를 보내야 해서,
  //  fetchNoteById로 원본을 받아와서 content만 바꾸는 게 안전합니다.)
  return useMutation({
    mutationFn: async (payload: { content: string; memo: DailyNote }) => {
      const apiPayload = {
        project: Number(payload.memo.projectId),
        date: payload.memo.date,
        contents: payload.content, // ⬅️ 변경된 텍스트
      };
      const { data } = await axios.put<ApiMemo>(
        `/memos/${noteId}/`,
        apiPayload
      );
      console.log("put/memos/id 노트텍스트 수정값: ", data);
      return data;
    },
    onSuccess: (_data, variables) => {
      // 텍스트 수정 성공 시 관련 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["notes", noteId] });
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.memo.projectId, variables.memo.date],
      });
    },
  });
};

// 하이라이트(태깅) 생성(POST /taggings/memo/{id})
// (NoteDetailModal에서 하이라이트가 추가될 때마다 호출)
export const useCreateTaggingMutation = (memoId: string) => {
  const queryClient = useQueryClient();
  const { openLogAcquiredModal } = useModalActions();

  return useMutation({
    mutationFn: async (highlight: Omit<Highlight, "id">) => {
      const payload = {
        tag_contents: highlight.text,
        offset_start: highlight.startIndex,
        offset_end: highlight.endIndex,
        tag_style: categoryToTagStyle(highlight.category),
      };
      const { data } = await axios.post<TaggingCreateResponse>(
        `/taggings/memo/${memoId}/`,
        payload
      );
      console.log("POST /taggings/memo/{id} 태깅 값", data);
      return data;
    },
    onSuccess: (data) => {
      // (수정) "통나무 획득" 로직은 여기! (Swagger 기준)
      if (data.log_result?.success) {
        openLogAcquiredModal("이 프로젝트");
      }

      // 태깅 성공 시 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["notes", memoId] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// 하이라이트(태깅) "수정" (PUT /taggings/{tagging_id}/)
export const useUpdateTaggingMutation = (taggingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (highlight: Omit<Highlight, "id">) => {
      const payload = {
        tag_contents: highlight.text,
        offset_start: highlight.startIndex,
        offset_end: highlight.endIndex,
        tag_style: categoryToTagStyle(highlight.category),
      };
      const { data } = await axios.put(`/taggings/${taggingId}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// 하이라이트(태깅) "삭제" (DELETE /taggings/{tagging_id}/)

export const useDeleteTaggingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { memoId: string; taggingId: string }>({
    mutationFn: async ({ taggingId }) => {
      await axios.delete(`/taggings/${taggingId}/`);
    },
    onSuccess: (_, variables) => {
      // 1. (중요) 'notes' 쿼리 키에 memoId가 포함된 모든 것을 무효화
      queryClient.invalidateQueries({ queryKey: ["notes", variables.memoId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["reviews"] }); // 리뷰 갱신
    },
  });
};
