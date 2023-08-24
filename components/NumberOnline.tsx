"use client";

import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, onValue, set, onDisconnect } from "firebase/database";

export default function NumberOnline() {
  const connectionsRef = ref(db, "connections");
  const connectedRef = ref(db, ".info/connected");
  const [numberOnline, setNumberOnline] = useState(1);

  useEffect(() => {
    console.log("in useEffect to get number of online users");

    // add a listener to the # of people online (# items in connections)
    const handleValueChange = onValue(connectionsRef, (snap) => {
      setNumberOnline(snap.size);
    });

    // Handle the current user's connection status
    onValue(connectedRef, (snap) => {
      // if client is currently connected
      if (snap.val() === true) {
        const con = push(connectionsRef); //creates a new child node under connections with a unique ID
        set(con, true); // sets the value of this new child node to true, effectively marking a new user as online.
        onDisconnect(con).remove(); //when the client disconnects, the child node we just created is removed from the database.
      }
    });

    // Cleanup the listeners on unmount
    return () => {
      handleValueChange();
    };
  }, []);
  return (
    <>
      <div className="flex flex-row space-x-1 justify-center items-center">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
        <p className="text-sm">{numberOnline} online</p>
      </div>
    </>
  );
}
