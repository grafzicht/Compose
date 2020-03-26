import readline from 'readline';
import {Server} from 'ws';
import Document from "./document";
import {addDocument, getDocument, removeDocument} from "./database";

(async () => {
	await Document.connect();
	Document.loadAll();
	const server = new Server({port: 1337});
	server.on('connection', async (socket, rq) => {
		let id = rq.url?.split('/')[1];
		if (!id) {
			let documents = Document.getAll().map(({id, name}) => ({id, name}));
			socket.send(JSON.stringify(documents));
			socket.close(1001);
		} else if (id === 'add') {
			socket.onmessage = async ({data}) => {
				let result = await addDocument({name: data});
				socket.send(result.insertedId.toString());
				Document.loadAll();
			};
		} else if (id === 'remove') {
			socket.onmessage = async ({data}) => {
				let result = await removeDocument(data.toString());
				let response = (result.deletedCount !== undefined && result.deletedCount > 0) ? "OK" : "ERR";
				socket.send(response);
				Document.loadAll();
			}
		} else {
			let doc = Document.byId(id);
			if (doc === null) {
				socket.send('{"error":"not found"}');
				socket.close(1001);
				return;
			}

			doc.addSocket(socket);
		}
	});
})();