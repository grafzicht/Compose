import Docker from "dockerode";
import fs from "fs";

const docker = new Docker();

export const buildImage = async name => {
	const tag = `grafzicht-cron-${name.toLowerCase()}`;
	const dir = `${__dirname}/${name}/`;

	console.log(`Building ${name}`);
	let stream = await docker.buildImage({
		context: dir,
		src: fs.readdirSync(dir)
	}, {
		t: tag
	});

	await new Promise((resolve, reject) => {
		docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res), msg => {
			if (msg.error) {
				reject(msg.error);
			} else if (msg.stream && msg.stream.startsWith('Step')) {
				console.log('>>', msg.stream)
			}
		});
	});

	console.log(`Built ${name}`);
	return tag;
};

export const startImage = async name => {
	return docker.createContainer({
		Image: name,
	}).then(container => {
		container.attach({stream: true, stderr: true}, (err, stream) => {
			stream.pipe(process.stdout);
		});
		container.start();
	});
};