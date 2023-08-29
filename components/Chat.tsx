import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, onValue } from "firebase/database";
import MessageList from "./MessageList";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

type Message = {
  author: string;
  message: string;
  sentAt: string;
};

interface Props {
  name: string;
}

const Chat: React.FC<Props> = ({ name }) => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState("");

  const getChatroomId = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    // Assuming your cycle is 30 minutes, periods are 0-29 and 30-59 minutes past the hour
    const halfHourPeriod = date.getUTCMinutes() < 30 ? 1 : 2;
    return `${date.getUTCFullYear()}-${
      date.getUTCMonth() + 1
    }-${date.getUTCDate()}-${hour}-${halfHourPeriod}`;
  };
  const [chatroomId, setChatroomId] = useState<string>(getChatroomId());

  const loadChatHistory = (chatroomId: string) => {
    const chatroomRef = ref(db, `chatrooms/${chatroomId}`);

    // return the function so useEffect can detach it on unmount
    const unsubscribe = onValue(chatroomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages: Message[] = Object.values(data);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    return unsubscribe;
  };

  // load past chats when component loads
  useEffect(() => {
    const unsubscribe = loadChatHistory(chatroomId);

    return () => {
      unsubscribe();
    };
  }, [chatroomId]);
  const sendMessage = async () => {
    if (name && myMessage) {
      const timestamp = new Date().toISOString();

      const messageObj = {
        author: name,
        message: myMessage,
        sentAt: timestamp,
      };

      const chatroomRef = ref(db, `chatrooms/${chatroomId}`);
      await push(chatroomRef, messageObj);

      setMyMessage("");
    }
  };

  const handleMessageKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" && myMessage) {
      sendMessage();
    }
  };

  return (
    <>
      <div
        className="relative flex flex-col justify-end
      min-w-[300px] max-w-[600px] w-full h-[70vh]
      bg-transparent outline outline-ink rounded-xl my-4
      text-xl"
      >
        {/* chat body */}
        {/* <p className="text-sm">What did you do during the last pomodoro?</p> */}
        <MessageList messages={messages} />

        {/* msg input */}
        <div className="w-full relative ">
          <input
            type="text"
            placeholder="what did you do during the last pomodoro?"
            value={myMessage}
            className="outline outline-ink focus:outline-ink
            w-full p-4 pr-16
            text-ink placeholder:text-ink/30
            bg-transparent rounded-br-xl rounded-bl-xl"
            onChange={(e) => setMyMessage(e.target.value)}
            onKeyUp={handleMessageKeypress}
          />
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2
            flex items-center justify-center p-3 mr-[5px] rounded-lg
            bg-ink text-cream
            disabled:bg-transparent disabled:text-ink/50"
            onClick={sendMessage}
            disabled={!myMessage}
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
