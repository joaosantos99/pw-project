/**
 * Normalizes date to YYYY-MM-DD format
 */
export function normalizeDate(date) {
	const d = new Date(date);
	if (isNaN(d.getTime())) return null;
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Parses duration string to hours
 */
export function parseDurationToHours(durationStr) {
	if (!durationStr) return 0;

	let totalMinutes = 0;
	const hourMatch = durationStr.match(/(\d+)h/);
	const minuteMatch = durationStr.match(/(\d+)m/);
	const secondMatch = durationStr.match(/(\d+)s/);

	if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
	if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
	if (secondMatch) totalMinutes += parseInt(secondMatch[1]) / 60;

	return totalMinutes / 60;
}

/**
 * Parses duration string to minutes
 */
export function parseDurationToMinutes(duration) {
	if (!duration) return 0;
	let totalMinutes = 0;
	const hourMatch = duration.match(/(\d+)h/);
	const minuteMatch = duration.match(/(\d+)m/);
	const secondMatch = duration.match(/(\d+)s/);
	if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
	if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
	if (secondMatch) totalMinutes += parseInt(secondMatch[1]) / 60;
	return totalMinutes;
}
