import WebSocket from "ws";
import {connect, getDocument, listDocuments, updateDocument} from "./database";
import Locker from "./locker";

class Document {
	private static documents: Document[] = [];

	private static socketName(socket: WebSocket): string {
		// @ts-ignore
		return `${socket._socket.remoteAddress}:${socket._socket.remotePort}`;
	}

	public static async connect() {
		return connect();
	}

	public static loadAll() {
		listDocuments()
			.then(documents => {
				let ids = documents.map(({_id}) => _id.toString());

				ids.forEach(id => {
					if (Document.byId(id) === null) {
						new Document(id);
					}
				});

				Document.documents.forEach(doc => {
					if (ids.indexOf(doc.id) === -1) {
						let dIdx = Document.documents.map(({id}) => id).indexOf(doc.id);
						Document.documents.splice(dIdx, 1);
					}
				})
			});
	}

	public static getAll() {
		return Document.documents;
	}

	public static byId(id: string): Document | null {
		for (let document of Document.documents) {
			if (document.id === id) {
				return document;
			}
		}
		return null;
	}

	readonly id: string;

	private _name: string = "";
	private _document: object = {name: null};
	private _locks: Locker = new Locker();
	private _names: { [key: string]: string } = {};
	private _sockets: WebSocket[] = [];

	constructor(id: string) {
		this.id = id;
		this.update().then(() => {
			Document.documents.push(this)
		});
	}

	get name() {
		return this._name;
	}

	private async update(): Promise<void> {
		this._document = await getDocument(this.id);
		if (!this._document) return;
		if ('name' in this._document) {
			this._name = (this._document as { name: '' }).name;
		}
		this.broadcast({
			type: "document",
			document: this._document
		})
	}

	public addSocket(socket: WebSocket) {
		socket.onclose = () => {
			let idx = this._sockets.indexOf(socket);
			if (idx > -1) {
				this._sockets.splice(idx, 1);
			}
			this._locks.forceRelease(socket);
		};
		socket.onmessage = ({data}) => {
			let message = JSON.parse(data.toString());
			if (message.type === 'lock-claim') {
				if (this._locks.claim(socket, message.section)) {
					socket.send(JSON.stringify({type: "result", section: message.section, value: true}));
					this.broadcastLocks();
				} else {
					socket.send(JSON.stringify({type: "result", section: message.section, value: false}));
				}
			} else if (message.type === 'lock-release') {
				if (this._locks.release(socket, message.section)) {
					this.broadcastLocks();
				} else {
					socket.send(JSON.stringify({error: "Cannot release"}));
				}
			} else if (message.type === 'update') {
				if (this._locks.has(socket, message.section)) {
					updateDocument(this.id, {[message.section]: message.content})
						.then(() => this.update())
				} else {
					socket.send(JSON.stringify({error: "Has no lock"}));
				}
			} else if (message.type === 'name') {
				this._names[Document.socketName(socket)] = message.name;
				this.broadcastNames();
			}
		};
		this._sockets.push(socket);
		socket.send(JSON.stringify({
			type: "document",
			document: this._document
		}));
		this.broadcastLocks();
		this.broadcastNames();
	}

	private broadcast(data: any) {
		if (typeof data !== 'string') {
			data = JSON.stringify(data)
		}

		this._sockets.forEach(socket => {
			socket.send(data);
		})
	}

	private broadcastLocks() {
		console.log(this._locks.toObject());
		this.broadcast({
			type: "locks",
			locks: this._locks.toObject()
		});
	}

	private broadcastNames() {
		this.broadcast({
			type: "names",
			names: this._names
		});
	}
}

export default Document;