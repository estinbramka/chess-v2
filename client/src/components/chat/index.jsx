import { useEffect, useRef, useState } from 'react';
import './chat-styles.css'
import { socket } from '../../socket';

export default function Chat({ user }) {

    const chatListRef = useRef(null);
    const [chatMessages, setChatMessages] = useState([
        {
            author: {},
            message: `Welcome! You can invite friends to watch or play by sharing the link above. Have fun!`
        }
    ]);
    useEffect(() => {
        const chatList = chatListRef.current;
        if (!chatList) return;
        chatList.scrollTop = chatList.scrollHeight;
    }, [chatMessages]);
    useEffect(() => {
        function chat(message){
            addMessage(message);
        }

        socket.on("chat", chat);

        return () => {
            socket.off("chat", chat);
        };
    }, []);
    function chatClickSend(e) {
        e.preventDefault();

        const target = e.target;
        const input = target.elements.namedItem("chatInput");
        if (!input.value || input.value.length === 0) return;
        sendChat(input.value);
        input.value = "";
    }
    function sendChat(message) {
        if (!user) return;

        socket.emit("chat", message);
        addMessage({ author: user, message });
    }

    function chatKeyUp(e) {
        e.preventDefault();
        if (e.key === "Enter") {
            const input = e.target;
            if (!input.value || input.value.length === 0) return;
            sendChat(input.value);
            input.value = "";
        }
    }
    function addMessage(message) {
        setChatMessages((prev) => [...prev, message]);
    }

    return (
        <div className="chat-box">
            <ul
                className="chat-display"
                ref={chatListRef}
            >
                {chatMessages.map((m, i) => (
                    <li
                        className={
                            "max-w-[30rem]" +
                            (!m.author.id && m.author.name === "server"
                                ? " bg-base-content text-base-300 p-2"
                                : "")
                        }
                        key={i}
                    >
                        <span>
                            {m.author.id && (
                                <span>{/* eslint-disable-next-line*/}
                                    <a
                                        className={
                                            "font-bold" +
                                            (typeof m.author.id === "number"
                                                ? " text-primary link-hover"
                                                : " cursor-default")
                                        }
                                        href={
                                            typeof m.author.id === "number" ? `/user/${m.author.name}` : undefined
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {m.author.name}
                                    </a>
                                    :{" "}
                                </span>
                            )}
                            <span>{m.message}</span>
                        </span>
                    </li>
                ))}
            </ul>
            <form className="input-group mt-auto" onSubmit={chatClickSend}>
                <input
                    type="text"
                    placeholder="Chat here..."
                    className="input input-bordered flex-grow"
                    name="chatInput"
                    id="chatInput"
                    onKeyUp={chatKeyUp}
                    required
                />
                <button className="btn btn-secondary ml-1" type="submit">
                    send
                </button>
            </form>
        </div>
    );
}