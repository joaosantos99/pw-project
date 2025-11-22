export const debounce = (func, delay = 300) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), delay);
	};
};

export const throttle = (func, delay = 300) => {
	let lastCall = 0;
	return (...args) => {
		const now = Date.now();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		func.apply(this, args);
	};
};
