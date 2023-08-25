import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, onValue } from "firebase/database";
import MessageList from "./MessageList";

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
      <div className="relative flex flex-col justify-end min-w-[300px] max-w-[600px] w-full h-[70vh] bg-white rounded-xl my-4">
        {/* chat body */}
        <MessageList messages={messages} />

        {/* msg input */}
        <div className="w-full ">
          <input
            type="text"
            placeholder="new message..."
            value={myMessage}
            className="outline p-4 text-ink w-full bg-transparent rounded-xl"
            onChange={(e) => setMyMessage(e.target.value)}
            onKeyUp={handleMessageKeypress}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
