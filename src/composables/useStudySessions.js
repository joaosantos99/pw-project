import { get, del } from "@/utils/api";
import { API_URL } from "@/constants/env";

export function useStudySessions() {
  const getStudySessions = async (userId) => {
    const sessions = await get(API_URL, `studySessions?user_id=${userId}`);
    return sessions;
  }

  const deleteStudySession = async (sessionId) => {
    return del(API_URL, `studySessions/${sessionId}`);
  }

  return {
    getStudySessions,
    deleteStudySession,
  }
}

