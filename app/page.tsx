"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Landing from "@/components/Landing";
import Timer from "@/components/Timer";
import Chat from "@/components/Chat";

export default function Home() {
  // Basic app states
  const [chatOpen, setChatOpen] = useState(false); // if chatOpen = true, user is in chat
  const [appOpen, setAppOpen] = useState(false); // if appOpen = true, user has entered name and is in the pomo/chat

  // user name
  const [name, setName] = useState<string>("");
  const [nameField, setNameField] = useState<string>("");
  // Prefill user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    if (savedName) {
      setNameField(savedName);
    }
  }, []);

  // "cycle" = 30 minute unit for the whole app logic
  // each hour has 2 cycles, which starts at :00 and :30 (UTC time)
  // each cycle consists of the "work" part (25min)
  // and the "chat" part (5min)
  const workMinutes = 25;
  const chatMinutes = 5;
  const cycleMinutes = workMinutes + chatMinutes;

  const [minutesPadded, setMinutesPadded] = useState("00");
  const [secondsPadded, setSecondsPadded] = useState("00");

  const playTimerSound = () => {
    const audio = new Audio("/sounds/timer.mp3");
    audio.play();
    console.log("playing sound");
  };

  // Sets the page title to the current countdown
  const setTitle = (chat: boolean, minutes: string, seconds: string) => {
    document.title = `${chat ? "💬" : "🍅"} ${minutes}:${seconds}`;
  };

  // manages timer & chatOpen state
  const updatePomodoroState = () => {
    const date = new Date();
    const currentMinutes = date.getUTCMinutes();
    const currentSeconds = date.getUTCSeconds();
    const timePassedInCycleMinutes = currentMinutes % cycleMinutes; // time since the start of the cycle, in minutes
    const timePassedInCycleMillis =
      (timePassedInCycleMinutes * 60 + currentSeconds) * 1000; // time since the start of the cycle, in milliseconds

    let partTotalMillis;
    let timePassedInPartMillis;
    let newChatOpen;

    // determine if we're in chat part or work part of the cycle

    if (
      timePassedInCycleMillis < 25 * 60 * 1000 ||
      (timePassedInCycleMillis >= 30 * 60 * 1000 &&
        timePassedInCycleMillis < 55 * 60 * 1000)
    ) {
      // we are in work part of cycle
      partTotalMillis = workMinutes * 60 * 1000; // duration of work part in milliseconds
      timePassedInPartMillis = timePassedInCycleMillis % partTotalMillis;
      newChatOpen = false;
    } else {
      // we are in chat part of cycle
      partTotalMillis = chatMinutes * 60 * 1000; // duration of chat part in milliseconds
      timePassedInPartMillis = timePassedInCycleMillis % partTotalMillis;
      newChatOpen = true;
    }

    // plays sounds when we switch btwn chat <> timer
    // doing it this way bc the state-change-based way was unreliable... at least for me...
    // also, only play sound when user is in the core app experience
    if (currentSeconds === 0 && appOpen) {
      // Check if it's the start of a new minute
      if (
        currentMinutes === 0 ||
        currentMinutes === 25 ||
        currentMinutes === 30 ||
        currentMinutes === 55
      ) {
        playTimerSound();
      }
    }

    // Determine the remaining time in the cycle by subtracting the elapsed time from the total time for that cycle
    const remainingMillis = partTotalMillis - timePassedInPartMillis;
    // Convert this remaining time from milliseconds to minutes and seconds to be displayed
    const remainingMinutes = Math.floor(remainingMillis / (60 * 1000));
    const remainingSeconds = Math.floor((remainingMillis % (60 * 1000)) / 1000);
    const newMinutesPadded = String(remainingMinutes).padStart(2, "0");
    const newSecondsPadded = String(remainingSeconds).padStart(2, "0");
    setMinutesPadded(newMinutesPadded);
    setSecondsPadded(newSecondsPadded);

    setChatOpen(newChatOpen);
    // UNCOMMENT THE BELOW LINE FOR WORKING DEBUG ONLY:
    // setChatOpen(true);

    // Call setTitle after countdown and minutes/seconds have been updated
    setTitle(newChatOpen, newMinutesPadded, newSecondsPadded);
  };

  // Check for state updates/timer updates every second
  useEffect(() => {
    const interval = setInterval(updatePomodoroState, 1000);
    // console.log("new useEffect");
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main
        className="main-container flex flex-col items-center justify-between 
        p-4 text-ink text-center"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        <Header
          appOpen={appOpen}
          chatOpen={chatOpen}
          minutes={minutesPadded}
          seconds={secondsPadded}
        />
        {appOpen ? (
          chatOpen ? (
            <>
              <Chat name={name} />
            </>
          ) : (
            <>
              <Timer minutes={minutesPadded} seconds={secondsPadded} />
            </>
          )
        ) : (
          <>
            <Landing
              nameField={nameField}
              setNameField={setNameField}
              setName={setName}
              setAppOpen={setAppOpen}
            />
          </>
        )}

        <Footer />
      </main>
    </>
  );
}
