import {setDriftlessInterval} from 'driftless';
import fs from 'fs';
import YAML from 'yaml';
import normalizeSchedule from './normalize';
import {buildImage, startImage} from "./docker";

const textSchedule = fs.readFileSync('./schedule.yaml', 'utf8');
const parsedSchedule = YAML.parse(textSchedule);
const normalizedSchedule = normalizeSchedule(parsedSchedule);

(async () => {
	//Build images
	for (let job in normalizedSchedule) {
		let name = await buildImage(job);
		normalizedSchedule[job].container = name;
	}
	console.log(`Built schedule with ${Object.keys(normalizedSchedule).length} jobs`);

	for (let job of normalizedSchedule) {
		if(job.onLaunch){
			startImage(job.container);
		}
	}

	runContainers();
	setDriftlessInterval(runContainers, 60000);
})();

function runContainers() {
	const date = new Date();
	for (let job in normalizedSchedule) {
		const schedule = normalizedSchedule[job];

		if (schedule.minute.indexOf(date.getMinutes()) === -1) continue;
		if (schedule.hour.indexOf(date.getHours()) === -1) continue;
		if (schedule.day.indexOf(date.getDate()) === -1) continue;
		if (schedule.month.indexOf(date.getMonth()) === -1) continue;
		if (schedule.weekday.indexOf(date.getDay()) === -1) continue;

		const hour = date.getHours().toString().padStart(2, '0');
		const minute = date.getMinutes().toString().padStart(2, '0');
		const second = date.getSeconds().toString().padStart(2, '0');
		console.log(`[${hour}:${minute}:${second}] Starting '${job}'`);
		startImage(schedule.container);
	}
}