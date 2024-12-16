const ws = require("ws");
const wss = new ws.Server({
	port: 5000,
}, () => console.log(`Server started ${5000} port`));

wss.on("connection", function connection(ws) {

	ws.on("message", function (msg) {
		msg = JSON.parse(msg);
		switch (msg.event) {
			case "message":
				broadcastMessage(msg);
				break;
			case "connection":
				broadcastMessage(msg)
				break;
		}
	})
})

function broadcastMessage(msg) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(msg));
	})
}