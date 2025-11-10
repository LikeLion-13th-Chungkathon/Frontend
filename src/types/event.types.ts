// 달력에 표시될 이벤트 또는 프로젝트

export interface ProjectEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  memberCount: number;
}
