"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// do we need this line?
let socket: Socket;

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
  const [currentPeriod, setCurrentPeriod] = useState(0);

  const workPeriod = 25 * 60 * 1000; // 25 minutes in milliseconds
  const breakPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
  const fullCycle = workPeriod + breakPeriod;

  const referenceTime = new Date(); // you can set this to any reference time
  referenceTime.setHours(0, 0, 0, 0); // set to midnight of the current day, for example

  const updatePomodoroState = () => {
    const currentTime = new Date().getTime();
    const timeSinceReference = currentTime - referenceTime.getTime();
    const currentCycleTime = timeSinceReference % fullCycle;

    if (currentCycleTime < workPeriod) {
      // if in pomodoro period
      setChatOpen(false);
      setCountdown(workPeriod - currentCycleTime);
    } else {
      // if in break period
      setChatOpen(true);
      setCountdown(fullCycle - currentCycleTime);
    }
  };

  // Call this function regularly to update the state
  // setInterval(updatePomodoroState, 1000);
  useEffect(() => {
    const interval = setInterval(updatePomodoroState, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(countdown / (60 * 1000));
  const seconds = Math.floor((countdown % (60 * 1000)) / 1000);
  // pad the min/sec with a leading zero if necessary
  const minutesPadded = String(minutes).padStart(2, "0");
  const secondsPadded = String(seconds).padStart(2, "0");

  // CHAT + WEBSOCKETS LOGIC
  const [chatOpen, setChatOpen] = useState(false);
  const [name, setName] = useState("default");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState("");
  const [numberOnline, setNumberOnline] = useState(1);

  // set up socket connection
  useEffect(() => {
    socketInitializer();

    // Cleanup: Disconnect the socket when the component is unmounted
    // prevents cases like re-renders leading to "58 people online"
    return () => {
      if (socket) {
        console.log("disconnecting websocket");
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = () => {
    socket = io("https://pomodoro-server-o0a9.onrender.com");
    console.log("new socket:", socket);

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
    if (e.key === "Enter") {
      if (myMessage) {
        sendMessage();
      }
    }
  };

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-4">
      {/* TODO: need to have some sort of loading state */}
      <div className="text-xl font-bold mb-6">pomo.chat</div>
      {/* {chatOpen ? ( */}
      {/* <>
        <div className="relative flex flex-col justify-end h-[40rem] bg-white min-w-[90%] rounded-xl">
          <div className="flex flex-row p-4 justify-between ">
            <div className="flex flex-row space-x-1 items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <p className="text-xs">{numberOnline} here</p>
            </div>
            <div className="text-xs">
              Chat closes in {minutesPadded}:{secondsPadded}
            </div>
          </div>
          <div className="h-full pl-4 last:border-b-0 overflow-y-scroll">
            {messages.map((msg, i) => {
              return (
                <div className="w-full py-2" key={i}>
                  <p className="text-slate-500">{msg.author}</p>
                  <p>{msg.message}</p>
                </div>
              );
            })}
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="New message..."
              value={myMessage}
              className="outline-none p-4 text-slate-900"
              onChange={(e) => setMyMessage(e.target.value)}
              onKeyUp={handleKeypress}
            />
          </div>
        </div>
      </> */}
      {/* ) : ( */}
      <>
        <div className="absolute flex w-full h-full items-center justify-center">
          {/* <Image
            src="/images/tomato.png"
            alt="watercolor illustration of a tomato"
            width={250}
            height={250}
            // fill
            // sizes="20vw"
            // style={{
            //   objectFit: "contain",
            // }}
          /> */}
          <img
            width="40%"
            height="auto"
            src="/images/tomato.png"
            alt="watercolor illustration of a tomato"
            style={{ "max-width": "300px" }}
          />
        </div>
        <div className="flex text-[10rem] sm:text-[20rem] flex-col md:flex-row justify-center items-center w-full align-center">
          <div className="time flex-1 text-center md:text-right pb-10 md:pb-0 md:pr-24">
            {minutesPadded}
          </div>
          <div className="time flex-1 text-center md:text-left pt-10 md:pt-0 md:pl-24">
            {secondsPadded}
          </div>
        </div>
      </>
      {/* )} */}
      <div className="flex flex-row space-x-1 items-center mt-6">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
        <p className="text-xs">{numberOnline} here</p>
      </div>
    </main>
  );
}
