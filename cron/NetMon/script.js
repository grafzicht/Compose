import {InfluxDB} from 'influx';
import IPCIDR from 'ip-cidr';
import ping from 'ping';

const subnet = '192.168.178.0/24';

let cidr = new IPCIDR(subnet);

if (!cidr.isValid()) throw new Error(`CIDR is invalid`);

let hosts = [];
cidr.loop(ip => hosts.push(ip));

const database = new InfluxDB({
	host: 'grafzicht.nl',
	database: 'grafzicht'
});

const pingHost = async (ip) => await ping.promise.probe(ip);

(async () => {
	let availability = (await Promise.all(hosts.map(pingHost)))
		.filter(({host}) => host !== 'unknown');

	let available = availability.filter(({alive}) => !alive).length;
	let unavailable = availability.filter(({alive}) => alive).length;

	console.log(
		available,
		unavailable
	);

	database.writePoints([{
		measurement: 'network',
		fields: {
			available,
			unavailable
		}
	}])
})();