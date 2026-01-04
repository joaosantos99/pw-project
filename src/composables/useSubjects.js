import { get, post, put, del } from "@/utils/api";
import { API_URL } from "@/constants/env";

export function useSubjects() {
  const getSubjects = async (userId) => {
    const subjects = await get(API_URL, `subjects?user_id=${userId}`);
    return subjects;
  }

  const createSubject = async (userId, { name, color }) => {
    return post(API_URL, "subjects", {
      user_id: userId,
      name,
      color,
    });
  }

  const updateSubject = async (subjectId, { name, color }) => {
    return put(API_URL, `subjects/${subjectId}`, {
      name,
      color,
    });
  }

  const deleteSubject = async (subjectId) => {
    return del(API_URL, `subjects/${subjectId}`);
  }

  return {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  }
}

