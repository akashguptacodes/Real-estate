import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../apiRequest";
import { format } from "timeago.js";
import { io } from "socket.io-client";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../notificationStore";


function Chat({chats}) {
  console.log(chats);
  
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);  
  const { socket } = useContext(SocketContext);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    console.log("inside speechrecognition");
    
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    console.log({recognition});
    

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
    setListening(true);
  };
  const decrease = useNotificationStore((state) => state.decrease);

  const messageEndRef = useRef();
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);


  const handleOpenChat = async (chatId, receiver) => {
    try {
      const res = await apiRequest.get(`/api/v1/chats/getchat/${chatId}`);
      if (res?.data?.chat?.seenBy.includes(currentUser._id)) {
        decrease();
      }
      setChat({ ...res?.data?.chat, receiver });
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inptext = formData.get("inptext");
    if (!inptext) return;
    try {
      const res = await apiRequest.post(`/api/v1/messages/addmessage/${chat._id}`, { inptext });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res?.data] }));
      console.log(res);

      e.target.reset();
      setText("");
      socket.emit("sendMessage", {
        receiverId: chat?.receiver?._id,
        data: res?.data,
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/api/v1/chats/readchat/${chat._id}`);
      }
      catch (error) {
        console.log(error);
      }
    }

    if (socket && chat) {
      socket.on("getMessage", (data) => {
        if (chat._id == data.chat) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket?.off("getMessage");
    }
  }, [socket, chat])

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {
          chats?.map((c) => (
            <div className="message" key={c?._id}
              style={{
        
                backgroundColor: c?.seenBy.includes(currentUser?._id) || chat?._id === c._id ? "white" : "#4fed5c",
              }}
              onClick={() => handleOpenChat(c?._id, c?.receiver)}>
              {
                c?.receiver?.image ? (
                  <img
                    src={c?.receiver?.image}
                    alt=""
                  />
                ) : (
                  <CgProfile />
                )
              }

              <span>{c?.receiver?.userName}</span>
              <p>{c?.lastMessage}</p>
            </div>
          ))
        }
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat?.receiver?.image}
                alt=""
              />
              {chat?.receiver?.userName}
            </div>
            <span className="close"
              onClick={() => {
                setChat(null);
                window.location.reload()
                }}>X</span>
          </div>
          <div className="center">
            {
              chat?.messages?.map((message) => (
                <div className="chatMessage"
                  key={message._id}
                  style={{
                    alignSelf: message.userId === currentUser._id ? "flex-end" : "flex-start",
                    textAlign: message.userId === currentUser._id ? "right" : "left",
                    backgroundColor: message.userId === currentUser._id ? "#99ff66" : "white",

                  }}>
                  <p>{message?.text}</p>
                  <span>{format(message?.createdAt)}</span>
                </div>
              ))
            }
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea
              value={text}
              onChange={(e) => {setText(e.target.value)}}
              name="inptext"
            ></textarea>
            <button type="button" onClick={startListening} className="mike">
              {listening ? "Listening..." : "🎤"}
            </button>
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;