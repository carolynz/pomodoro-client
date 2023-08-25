// component of messages in chat

import { useState, useRef, useEffect } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

type Message = {
  author: string;
  message: string;
};

interface props {
  messages: Message[];
}
export default function MessageList({ messages }: props) {
  const [showScrollToBottomPill, setShowScrollToBottomPill] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO: hide new messages pill upon scroll if scrolled to bottom
  /* Checks whether the chat is scrolled to the bottom 
  and updates showScrollToBottomPill accordingly. */
  const handleScroll = () => {
    const messageListDiv = messageListRef.current;
    const isScrolledToBottom = messageListDiv
      ? messageListDiv.scrollHeight -
          messageListDiv.scrollTop -
          messageListDiv.clientHeight <
        5
      : false;
    setShowScrollToBottomPill(!isScrolledToBottom);
  };

  useEffect(() => {
    const messageListDiv = messageListRef.current;
    messageListDiv?.addEventListener("scroll", handleScroll);
    return () => {
      messageListDiv?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scrolls to bottom of chatbox when new message is received
  useEffect(() => {
    if (!showScrollToBottomPill) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, showScrollToBottomPill]);
  return (
    <>
      <div
        ref={messageListRef}
        className="text-left h-full px-4 overflow-y-scroll"
      >
        {messages.map((msg, i) => {
          return (
            <div className="w-full py-2" key={i}>
              <p className="text-slate-500">{msg.author}</p>
              <p className="text-ink">{msg.message}</p>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-4" />
      </div>
      {showScrollToBottomPill && (
        <div className="absolute bottom-[70px] right-[16px]">
          <div
            onClick={() => {
              bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
              setShowScrollToBottomPill(false);
            }}
            className="bg-white rounded-full shadow-xl border-slate-300 mx-auto p-2 border border-slate-200 hover:cursor-pointer"
          >
            <ArrowDownIcon className="w-4 h-4 text-slate-400 " />
          </div>
        </div>
      )}
    </>
  );
}
