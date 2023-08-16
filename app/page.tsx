"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Head from "next/head";
import MessageList from "@/components/MessageList";

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
  const [countdown, setCountdown] = useState(0); //  figure out what number / way to store this — we will think about it later :))))
  const [currentPeriod, setCurrentPeriod] = useState(0);

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

  const updatePomodoroState = () => {
    const currentTime = new Date().getTime();
    const timeSinceReference = currentTime - referenceTime.getTime();
    const currentCycleTime = timeSinceReference % fullCycle;

    if (currentCycleTime < workPeriod) {
      if (chatOpen) {
        // if chat was previously open and now we are switching back to pomodoro — play a sound. this is just for testing purposes
        // playTimerSound();
      }
      // if in pomodoro period
      setChatOpen(false);
      // UNCOMMENT THE BELOW LINE FOR WORKING DEBUG ONLY:
      // setChatOpen(true);
      setCountdown(workPeriod - currentCycleTime);
    } else {
      // if in break period
      if (!chatOpen) {
        // if chat was previously closed, and now we are switching to open — play a timer sound
        // playTimerSound();
      }
      setChatOpen(true);
      setCountdown(fullCycle - currentCycleTime);
    }
  };

  // Updates pomodoro timer every second
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
  const [name, setName] = useState<string | null>(null);
  const [nameField, setNameField] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState("");
  const [numberOnline, setNumberOnline] = useState(1);

  // set up socket connection
  useEffect(() => {
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
      });

      // when more people join, add count
      socket.on("updateClientCount", (count) => {
        console.log("new online count: ", count);
        setNumberOnline(count);
      });
    };
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
      <Head>
        <title>🍅 pomo.chat 💬</title>
        <meta property="og:title" content="pomo.chat" />
        <meta property="og:description" content="25 min focus, 5 min chat" />
        <meta property="og:url" content="https://pomo.chat" />
        <meta property="og:image" content="/images/link-preview.png" />
        <meta
          property="og:image:secure_url"
          content="/images/link-preview.png"
        />
        <meta name="thumbnail" content="/images/link-preview.png" />

        {/* on favicon declarations:
         https://loqbooq.app/blog/add-favicon-modern-browser-guide */}

        <link rel="icon" href="/favicon_io/favicon.ico" />
        {/* for all browsers */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon_io/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io/favicon-32x32.png"
        />

        {/* for Android and Chrome */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon_io/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon_io/android-chrome-512x512.png"
        />

        {/* for Safari on Mac OS */}
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href="/favicon_io/apple-touch-icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="167x167"
          href="/favicon_io/apple-touch-icon-167x167.png"
        />
      </Head>
      {/* <main className="flex w-full h-screen flex-col items-center justify-between p-4  text-slate-900"> */}
      <main
        className="main-container flex flex-col items-center justify-between p-4 text-slate-900"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* TODO: need to have some sort of loading state */}
        {/* top header */}
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-black">pomo.chat</div>
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
        </div>
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
                    className="outline p-4 text-slate-900 w-full bg-transparent rounded-xl"
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
                    
                     text-slate-900 w-full bg-transparent rounded-xl"
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
            <div className="flex text-[40vw] sm:text-[16rem] md:text-[20vw] lg:text-[20rem] flex-col md:flex-row justify-center items-center w-full align-center text-black">
              <div className="time md:w-1/3 text-center pb-[4vh] sm:pb-4 md:pb-0 num-monospace">
                {minutesPadded}
              </div>
              <div className="w-full md:w-1/3 md:max-w-[20vw] lg:max-w-[300px] flex justify-center">
                <img
                  width="100%"
                  height="auto"
                  src="/images/tomato.png"
                  alt="watercolor illustration of a tomato"
                  className="w-1/2 md:w-full max-w-[300px] pb-[20px] lg:pb-[50px] -mt-20 -mb-20 md:mt-0 md:mb-0 z-10 object-cover"
                />
              </div>
              <div className="time md:w-1/3 text-center pt-[4vh] sm:pt-4 md:pt-0 num-monospace">
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
              className="outline p-4 text-slate-900 w-full bg-transparent rounded-xl"
              onChange={(e) => setNameField(e.target.value)}
              onKeyUp={handleNameKeypress}
            />
          </div>
        </>
      )} */}
        <p className="text-sm">
          made by{" "}
          <a
            href="https://www.tiktok.com/@kelin.online"
            target="_blank"
            className="font-semibold hover:underline"
          >
            kelin
          </a>
          <span className="mx-1">·</span>
          <a
            href="https://www.buymeacoffee.com/kelin"
            target="_blank"
            className="font-semibold hover:underline"
          >
            buy me a coffee?
          </a>
        </p>
      </main>
    </>
  );
}
