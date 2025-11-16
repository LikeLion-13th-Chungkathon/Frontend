export const calculateProgress = (startDate: string, endDate: string): number => {
    const today = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const totalDuration = end - start;
    if (totalDuration <= 0) return 0; // 기간 설정 오류 방지

    const elapsedDuration = today - start;

    const progress = (elapsedDuration / totalDuration) * 100;

    // 0% 미만, 100% 초과 방지
    return Math.max(0, Math.min(100, progress));
};