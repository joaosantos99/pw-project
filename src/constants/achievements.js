import { TIMES_PERSETS } from "./times";
import { GOALS_TABS } from "./goals";

export const ACHIEVEMENT_CATEGORIES = {
	TIME_PRESET: "time_preset",
	SESSION_COUNT: "session_count",
	DURATION: "duration",
	CONSISTENCY: "consistency",
	GOAL_COMPLETION: "goal_completion",
	MILESTONE: "milestone",
};

export const ACHIEVEMENTS = [
	// Time Preset Achievements
	{
		id: "classic_master",
		name: "Classic Master",
		category: ACHIEVEMENT_CATEGORIES.TIME_PRESET,
		preset: TIMES_PERSETS.CLASSIC,
		threshold: 10,
		xpReward: 100,
	},
	{
		id: "extended_warrior",
		name: "Extended Warrior",
		category: ACHIEVEMENT_CATEGORIES.TIME_PRESET,
		preset: TIMES_PERSETS.EXTENDED,
		threshold: 5,
		xpReward: 150,
	},
	{
		id: "deep_work_expert",
		name: "Deep Work Expert",
		category: ACHIEVEMENT_CATEGORIES.TIME_PRESET,
		preset: TIMES_PERSETS.DEEP_WORK,
		threshold: 3,
		xpReward: 200,
	},
	{
		id: "quick_session_pro",
		name: "Quick Session Pro",
		category: ACHIEVEMENT_CATEGORIES.TIME_PRESET,
		preset: TIMES_PERSETS.QUICK_SESSION,
		threshold: 20,
		xpReward: 120,
	},

	// Session Count Achievements
	{
		id: "first_steps",
		name: "First Steps",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 1,
		xpReward: 50,
	},
	{
		id: "getting_started",
		name: "Getting Started",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 5,
		xpReward: 100,
	},
	{
		id: "dedicated_learner",
		name: "Dedicated Learner",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 10,
		xpReward: 150,
	},
	{
		id: "committed_student",
		name: "Committed Student",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 25,
		xpReward: 250,
	},
	{
		id: "study_enthusiast",
		name: "Study Enthusiast",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 50,
		xpReward: 500,
	},
	{
		id: "study_master",
		name: "Study Master",
		category: ACHIEVEMENT_CATEGORIES.SESSION_COUNT,
		threshold: 100,
		xpReward: 1000,
	},

	// Duration Achievements
	{
		id: "hour_explorer",
		name: "Hour Explorer",
		category: ACHIEVEMENT_CATEGORIES.DURATION,
		threshold: 60, // minutes
		xpReward: 100,
	},
	{
		id: "time_investor",
		name: "Time Investor",
		category: ACHIEVEMENT_CATEGORIES.DURATION,
		threshold: 600, // minutes
		xpReward: 300,
	},
	{
		id: "dedication_champion",
		name: "Dedication Champion",
		category: ACHIEVEMENT_CATEGORIES.DURATION,
		threshold: 3000, // minutes
		xpReward: 750,
	},
	{
		id: "time_legend",
		name: "Time Legend",
		category: ACHIEVEMENT_CATEGORIES.DURATION,
		threshold: 6000, // minutes
		xpReward: 1500,
	},

	// Consistency Achievements
	{
		id: "day_one",
		name: "Day One",
		category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
		threshold: 1,
		xpReward: 50,
	},
	{
		id: "week_warrior",
		name: "Week Warrior",
		category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
		threshold: 7,
		xpReward: 200,
	},
	{
		id: "two_week_streak",
		name: "Two Week Streak",
		category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
		threshold: 14,
		xpReward: 400,
	},
	{
		id: "month_master",
		name: "Month Master",
		category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
		threshold: 30,
		xpReward: 800,
	},
	{
		id: "weekly_consistency",
		name: "Weekly Consistency",
		category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
		threshold: 5,
		weekly: true,
		xpReward: 150,
	},

	// Goal Completion Achievements
	{
		id: "daily_goal_achiever",
		name: "Daily Goal Achiever",
		category: ACHIEVEMENT_CATEGORIES.GOAL_COMPLETION,
		timePeriod: GOALS_TABS.DAILY,
		threshold: 1,
		xpReward: 100,
	},
	{
		id: "weekly_goal_achiever",
		name: "Weekly Goal Achiever",
		category: ACHIEVEMENT_CATEGORIES.GOAL_COMPLETION,
		timePeriod: GOALS_TABS.WEEKLY,
		threshold: 1,
		xpReward: 200,
	},
	{
		id: "monthly_goal_achiever",
		name: "Monthly Goal Achiever",
		category: ACHIEVEMENT_CATEGORIES.GOAL_COMPLETION,
		timePeriod: GOALS_TABS.MONTHLY,
		threshold: 1,
		xpReward: 300,
	},
	{
		id: "goal_master",
		name: "Goal Master",
		category: ACHIEVEMENT_CATEGORIES.GOAL_COMPLETION,
		threshold: 10,
		xpReward: 500,
	},

	// Milestone Achievements
	{
		id: "early_bird",
		name: "Early Bird",
		category: ACHIEVEMENT_CATEGORIES.MILESTONE,
		timeBased: true,
		xpReward: 75,
	},
	{
		id: "night_owl",
		name: "Night Owl",
		category: ACHIEVEMENT_CATEGORIES.MILESTONE,
		timeBased: true,
		xpReward: 75,
	},
	{
		id: "marathon_session",
		name: "Marathon Session",
		category: ACHIEVEMENT_CATEGORIES.MILESTONE,
		durationBased: true,
		threshold: 180, // minutes
		xpReward: 250,
	},
];