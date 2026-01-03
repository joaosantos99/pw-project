import { get, post, put, del } from "@/utils/api";
import { API_URL } from "@/constants/env";

export function useGoals() {
  const getGoals = async (userId, timePeriod) => {
    const goals = await get(API_URL, `goals?user_id=${userId}&time_period=${timePeriod}`);
    return goals;
  }

  const createGoal = async (userId, { title, timePeriod, unit, value }) => {
    return post(API_URL, "goals", {
      user_id: userId,
      title,
      time_period: timePeriod,
      unit,
      value,
    });
  }

  const updateGoal = async (goalId, { title, timePeriod, unit, value }) => {
    return put(API_URL, `goals/${goalId}`, {
      title,
      time_period: timePeriod,
      unit,
      value,
    });
  }

  const deleteGoal = async (goalId) => {
    return del(API_URL, `goals/${goalId}`);
  }

  return {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  }
}
