import { useQuery } from "@tanstack/react-query";
import type { DailyNote } from "../../types";
import { fakeFetch } from "./projectApi";
import { DUMMY_NOTES } from "./_dummyData";

// 특정 날짜의 모든 노트를 가져오는 훅
export const useNotesByDateQuery = (date: string) => {
  return useQuery<DailyNote[]>({
    queryKey: ["notes", date], // 날짜별로 캐싱
    queryFn: async () => {
      const allNotes = await fakeFetch(DUMMY_NOTES);
      return allNotes.filter((note) => note.date === date);
    },
  });
};
