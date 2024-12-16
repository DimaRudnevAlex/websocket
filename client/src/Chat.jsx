import React, {useEffect, useRef, useState} from 'react';

const Chat = () => {
	const [messages, setMessages] = useState([])
	const [inputValue, setInputValue] = useState("")

	const socket = useRef(null);
	const [connected, setConnected] = useState(false)

	const [username, setUsername] = useState("")

	function closeConnection() {
		socket.current.close()
	}

	useEffect(() => {
		console.log("Установленно")
		window.addEventListener("unload", closeConnection)
		return () => {
			console.log("Удаленно")
			window.removeEventListener("unload", closeConnection)
		}
	}, [])

	function connection() {
		socket.current = new WebSocket("ws://localhost:5000");

		socket.current.onopen = () => {
			setConnected(true)
			const message = {
				event: "connection",
				username: username,
				id: Date.now(),
			}
			socket.current.send(JSON.stringify(message));
			console.log("LOL соединение в wss установлено")
		}

		socket.current.onmessage = (event) => {
			const message = JSON.parse(event.data)
			setMessages((prevMessages) => [message, ...prevMessages])
		}
		socket.current.onclose = () => {
			console.log("Socket closed")
		}
		socket.current.onerror = () => {
			console.log("Socket error")

		}
	}

	if (!connected) {
		return (
			<div className="center">
				<div className="form">
					<input type="text"
					       value={username}
					       placeholder="Введите имя пользователя"
					       onChange={(e) => setUsername(e.target.value)}/>
					<button onClick={connection}>Войти</button>
				</div>
			</div>
		)
	}

	const sendMessage = async () => {
		const message = {
			username: username,
			message: inputValue,
			id: Date.now(),
			event: "message",
		}
		socket.current.send(JSON.stringify(message));
		setInputValue("")
	}


	return (
		<div className="center">
			<div className="form">
				<input type="text"
				       value={inputValue}
				       onChange={(e) => setInputValue(e.target.value)}/>
				<button onClick={sendMessage}>Отправить</button>
			</div>
			<div className="messages">
				{
					messages.map((mess) => {
						return (
							<div key={mess.id}>
								{mess.event === "connection"
									? <div className="message--connection">Пользователь {mess.username} подключился</div>
									: <div className="message">{mess.username}. {mess.message}</div>
								}
							</div>
						)
					})
				}
			</div>
		</div>
	);
};

export default Chat;