const range = (min, max) => new Array(max - min + 1).fill(0).map((_, i) => min + i);

const allowableValues = {
	minute: range(0, 59),
	hour: range(0, 23),
	day: range(0, 30),
	month: range(0, 11),
	weekday: range(0, 6)
};

const decodeIndicator = (indicator, allowables) => {
	if (Array.isArray(indicator)) {
		return indicator;
	} else if (indicator === '*') {
		return allowables
	} else if (indicator.startsWith('*/')) {
		let divisor = indicator.split('/')[1];
		return allowables.filter(v => v % divisor === 0)
	} else {
		throw new Error(`Cannot decode time indicator '${indicator}`)
	}
};

const normalizeSchedule = schedule => {
	for (const key in schedule) {
		const time = schedule[key];

		schedule[key] = {
			minute: decodeIndicator(time.minute, allowableValues.minute),
			hour: decodeIndicator(time.hour, allowableValues.hour),
			day: decodeIndicator(time.day, allowableValues.day),
			month: decodeIndicator(time.month, allowableValues.month),
			weekday: decodeIndicator(time.weekday, allowableValues.weekday),
			onLaunch: time['@launch'],
		};
	}

	return schedule
};

export default normalizeSchedule;