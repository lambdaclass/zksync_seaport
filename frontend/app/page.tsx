"use client";

import React, { useState, useEffect } from "react";
import ListErc from "./scripts/list-erc721";

export default function Home() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message !== "") {
      getEstimate();
    }
  }, [message]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  async function getEstimate() {
    
    let gasEstimate = await ListErc(message);
    
  }

  return (
    <main>
      <input
        type="text"
        id="listing-price"
        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Enter listing price"
        onChange={handleInputChange}
      />
    </main>
  );
}
