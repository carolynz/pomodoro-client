"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import MessageList from "@/components/MessageList";

// do we need this line?
let socket: Socket;

type Message = {
  author: string;
  message: string;
};

export default function Timer() {
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

  // mobile layout — avoid browser bar covering screen
  useEffect(() => {
    const setContainerHeight = () => {
      // Get the actual visible height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initial call
    setContainerHeight();

    // Listen for resizing events
    window.addEventListener("resize", setContainerHeight);

    // Cleanup
    return () => window.removeEventListener("resize", setContainerHeight);
  }, []);

  //  POMODORO LOGIC
  const [chatOpen, setChatOpen] = useState(false);
  const [prevChatOpen, setPrevChatOpen] = useState<boolean>(false);

  const [minutesPadded, setMinutesPadded] = useState("00");
  const [secondsPadded, setSecondsPadded] = useState("00");

  const workPeriod = 25 * 60 * 1000; // 25 minutes in milliseconds
  const breakPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
  const fullCycle = workPeriod + breakPeriod;

  const referenceTime = new Date(); // you can set this to any reference time
  referenceTime.setHours(0, 0, 0, 0); // set to midnight of the current day, for example

  const playTimerSound = () => {
    const audio = new Audio("/sounds/timer.mp3");
    audio.play();
    console.log("playing sound");
  };

  // Sets the page title to the current countdown
  const setTitle = (chat: boolean, minutes: string, seconds: string) => {
    document.title = `${chat ? "💬" : "🍅"} ${minutes}:${seconds}`;
  };

  const updatePomodoroState = () => {
    const currentTime = new Date().getTime();
    // reference time is midnight of current day
    const timeSinceReference = currentTime - referenceTime.getTime();
    // currentCycleTime is the time past :00 or :30 of the hour
    // fullCycle is 30min
    const currentCycleTime = timeSinceReference % fullCycle;

    let countdown;
    let newChatOpen;

    if (currentCycleTime < workPeriod) {
      // if in minute 0 to 25 of the hour — work period, chat is closed
      newChatOpen = false;
      countdown = workPeriod - currentCycleTime; // 0 to 25 minutes
    } else {
      // if in minute 25 to 30 of the hour — break period, chat is open
      newChatOpen = true;
      countdown = fullCycle - currentCycleTime; // 0 to 5 minutes
    }

    // time formatting
    const minutes = Math.floor(countdown / (60 * 1000));
    const seconds = Math.floor((countdown % (60 * 1000)) / 1000);
    const newMinutesPadded = String(minutes).padStart(2, "0");
    const newSecondsPadded = String(seconds).padStart(2, "0");
    setMinutesPadded(newMinutesPadded);
    setSecondsPadded(newSecondsPadded);

    setChatOpen(newChatOpen);
    // UNCOMMENT THE BELOW LINE FOR WORKING DEBUG ONLY:
    // setChatOpen(true);

    // Call setTitle after countdown and minutes/seconds have been updated
    setTitle(newChatOpen, newMinutesPadded, newSecondsPadded);
  };

  // Updates pomodoro timer every second
  useEffect(() => {
    const interval = setInterval(updatePomodoroState, 1000);
    console.log("new useEffect");
    return () => clearInterval(interval);
  }, []);

  // plays timer sound whenever chat opens
  // useEffect(() => {
  //   if (prevChatOpen === false && chatOpen === true) {
  //     // playTimerSound();
  //     console.log("playing sound");
  //   }
  //   setPrevChatOpen(chatOpen);
  // }, [chatOpen]);

  // CHAT + WEBSOCKETS LOGIC
  const [name, setName] = useState<string | null>(null);
  const [nameField, setNameField] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState("");
  const [numberOnline, setNumberOnline] = useState(1);

  // set up socket connection
  useEffect(() => {
    const socketInitializer = () => {
      socket = io("https://pomodoro-server-o0a9.onrender.com");
      // when receiving new message, add to message history
      socket.on("newIncomingMessage", (msg) => {
        // console.log("incoming message: ", msg);
        setMessages((currentMsg) => [
          ...currentMsg,
          { author: msg.author, message: msg.message },
        ]);
      });

      // when more people join, add count
      socket.on("updateClientCount", (count) => {
        // console.log("new online count: ", count);
        setNumberOnline(count);
      });
    };
    socketInitializer();

    // Cleanup: Disconnect the socket when the component is unmounted
    // prevents cases like re-renders leading to "58 people online"
    return () => {
      if (socket) {
        // console.log("disconnecting websocket");
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (name) {
      socket.emit("createdMessage", { author: name, message: myMessage });

      setMessages((currentMsg) => [
        ...currentMsg,
        { author: name, message: myMessage },
      ]);
      setMyMessage("");
    }
  };

  const handleMessageKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" && myMessage) {
      sendMessage();
    }
  };

  const handleNameKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nameField.length > 0) {
      setName(nameField);
    }
  };

  return (
    <>
      {/* <main className="flex w-full h-screen flex-col items-center justify-between p-4  text-ink"> */}
      <main
        className="main-container flex flex-col items-center justify-between p-4 text-ink"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* TODO: need to have some sort of loading state */}
        {/* top header */}
        <Header>
          <div className="flex flex-row justify-center">
            <div className="flex flex-row space-x-1 items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <p className="text-sm">{numberOnline} online</p>
            </div>
            {chatOpen && (
              <p className="text-sm">
                <span className="mx-1">·</span>Chat closes in{" "}
                <span className="num-monospace">
                  {minutesPadded}:{secondsPadded}
                </span>
              </p>
            )}
          </div>
        </Header>

        {chatOpen ? (
          // TODO: refactor into chat component?
          <>
            <div className="relative flex flex-col justify-end min-w-[300px] max-w-[600px] w-full h-[70vh] bg-white rounded-xl my-4">
              {/* chat header */}
              {/* <div className="flex flex-row p-4 justify-between ">
                
              </div> */}

              {/* chat body */}
              <MessageList messages={messages} />

              {/* msg input/name */}
              <div className="w-full ">
                {name ? (
                  // if user has name, let them input message
                  // TODO: add message filtering
                  <input
                    type="text"
                    placeholder="New message..."
                    value={myMessage}
                    className="outline p-4 text-ink w-full bg-transparent rounded-xl"
                    onChange={(e) => setMyMessage(e.target.value)}
                    onKeyUp={handleMessageKeypress}
                  />
                ) : (
                  // if user has not set name, cannot input message — must enter name first
                  // TODO make this more differentiated from input
                  // TODO: add name error handling
                  <>
                    <input
                      type="text"
                      placeholder="Enter your name to join the chat"
                      value={nameField}
                      className="p-4 outline focus:outline-2 focus:outline-slate-400 focus:outline-offset-4
                    
                     text-ink w-full bg-transparent rounded-xl"
                      onChange={(e) => setNameField(e.target.value)}
                      onKeyUp={handleNameKeypress}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          // TODO: refactor into timer component?
          <>
            {/*  */}
            <div className="timer-container justify-center items-center w-full align-center text-ink">
              <div className="time text-center num-monospace">
                {minutesPadded}
              </div>
              <div className="tomato w-full flex justify-center">
                <img
                  width="100%"
                  height="auto"
                  src="/images/tomato.png"
                  alt="watercolor illustration of a tomato"
                />
              </div>
              <div className="time text-center num-monospace">
                {secondsPadded}
              </div>
            </div>
          </>
        )}
        {/* if user has not entered name, include persistent floating prompt to enter name */}

        {/* {!name && (
        <>
          <div className="absolute bottom-20 w-[400px]">
            <input
              type="text"
              placeholder="enter your name to join the chat"
              value={nameField}
              className="outline p-4 text-ink w-full bg-transparent rounded-xl"
              onChange={(e) => setNameField(e.target.value)}
              onKeyUp={handleNameKeypress}
            />
          </div>
        </>
      )} */}
        <Footer />
      </main>
    </>
  );
}
