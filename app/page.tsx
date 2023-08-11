"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket; //i hope it will be happy with this

type Message = {
  author: string;
  message: string;
};

export default function Home() {
  /* functionality!
/ 1. global pomodoro time:
  - see how many people are online
  - everyone is on same clock
    - 12:00 - 12:25 you can't talk to anyone
    - 12:25 - 12:30 you can chat in global chat
    - 12:30 - 12:55 you can't talk to anyone
    - 12:55 - 1:00 you can chat in global chat
  2. chat functionality
    - normal global chat
    - enter name in order to chat, but you don't need to enter name in order to use the pomodoro timer
      - TBD, MIGHT CHANGE ORDER OF NAME-ASKING  
    - not stored after the 5 minute mark is up
    
*/

  //  POMODORO LOGIC
  const [countdown, setCountdown] = useState(0); //  figure out what number / way to store this — we will think about it later :))))

  const workPeriod = 25 * 60 * 1000; // 25 minutes in milliseconds
  const breakPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
  const fullCycle = workPeriod + breakPeriod;
  const progress = (countdown / fullCycle) * 100;

  const referenceTime = new Date(); // you can set this to any reference time
  referenceTime.setHours(0, 0, 0, 0); // set to midnight of the current day, for example

  const updatePomodoroState = () => {
    const currentTime = new Date().getTime();
    const timeSinceReference = currentTime - referenceTime.getTime();
    const currentCycleTime = timeSinceReference % fullCycle;

    setChatOpen(currentCycleTime >= workPeriod);
    setCountdown(fullCycle - currentCycleTime);
  };

  // Call this function regularly to update the state
  setInterval(updatePomodoroState, 1000);

  // render pomodoro progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - progress) / 100) * circumference;

  const progressCircleStyle = {
    transition: "stroke-dashoffset 0.35s",
    transformOrigin: "0% 50%",
  };

  // const progressTextStyle = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   fontSize: "1rem",
  // };

  const minutes = Math.floor(countdown / (60 * 1000));
  const seconds = Math.floor((countdown % (60 * 1000)) / 1000);
  const secondsPadded = String(seconds).padStart(2, "0"); // This pads the seconds with a leading zero if necessary

  // CHAT + WEBSOCKETS LOGIC
  const [chatOpen, setChatOpen] = useState(false);
  const [name, setName] = useState("default");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState("");
  const [numberOnline, setNumberOnline] = useState(1);

  // set up socket connection
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = () => {
    // We just call it because we don't need anything else out of it
    //await fetch("/api/socket");

    socket = io("https://pomodoro-server-o0a9.onrender.com");

    // when receiving new message, add to message history
    socket.on("newIncomingMessage", (msg) => {
      console.log("incoming message: ", msg);
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
      console.log(messages);
    });

    // when more people join, add count
    socket.on("updateClientCount", (count) => {
      console.log("new online count: ", count);
      setNumberOnline(count);
    });
  };

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: name, message: myMessage });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: name, message: myMessage },
    ]);
    setMyMessage("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (myMessage) {
        sendMessage();
      }
    }
  };

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-center">
      {/* TODO: need to have some sort of loading state */}
      {chatOpen ? (
        <>
          <div className="flex flex-col justify-end bg-black text-green-400 h-[40rem] min-w-[90%] shadow-md ">
            <div className="h-full last:border-b-0 overflow-y-scroll">
              {messages.map((msg, i) => {
                return (
                  <div className="w-full py-1 px-2" key={i}>
                    {msg.author} : {msg.message}
                  </div>
                );
              })}
            </div>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="New message..."
                value={myMessage}
                className="outline-none py-2 px-2 rounded-bl-md flex-1 bg-black text-green-400"
                onChange={(e) => setMyMessage(e.target.value)}
                onKeyUp={handleKeypress}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* progress countdown */}

          <div className="text-5xl">
            {minutes}:{secondsPadded}
          </div>
          <div className="flex flex-row space-x-1 items-center mt-6">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
            <p className="text-xs">{numberOnline} here</p>
          </div>
        </>
      )}
    </main>
  );
}
