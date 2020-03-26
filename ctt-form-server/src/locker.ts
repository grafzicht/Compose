import WebSocket from "ws";

class Locker {
	private static socketName(socket: WebSocket): string {
		// @ts-ignore
		return `${socket._socket.remoteAddress}:${socket._socket.remotePort}`;
	}

	private locks: { [key: string]: string } = {};

	public claim(socket: WebSocket, section: string): boolean {
		let owner: string = Locker.socketName(socket);

		//Check owner has no other locks
		if (this.locks[owner]) return false;

		//Check if no-one else has claimed this section
		if (Object.values(this.locks).indexOf(section) > -1) return false;

		//Claim the section
		this.locks[owner] = section;
		return true;
	}

	public release(socket: WebSocket, section: string): boolean {
		let owner: string = Locker.socketName(socket);

		if (this.locks[owner] !== section) return false;

		delete this.locks[owner];
		return true;
	}

	public has(socket: WebSocket, section: string): boolean {
		let owner: string = Locker.socketName(socket);
		return (
			owner in this.locks &&
			this.locks[owner] === section
		)
	}

	public forceRelease(socket: WebSocket): void {
		let owner: string = Locker.socketName(socket);
		delete this.locks[owner];
	}

	public toObject(): { [key: string]: string } {
		return this.locks;
	}
}

export default Locker;