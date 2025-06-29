"use client";

import { useEffect, useState } from "react";

function formatDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

type Counter = {
  id: number;
  occupied: boolean;
  clientNumber: string | null;
};

export default function CounterQueuePage() {
  const [counterList, setCounterList] = useState<Counter[]>([
    { id: 1, occupied: false, clientNumber: null },
    { id: 2, occupied: false, clientNumber: null },
  ]);

  const [globalCounter, setGlobalCounter] = useState(1);
  const [waitingQueue, setWaitingQueue] = useState<string[]>([]);

  const handleGenerate = () => {
    const date = formatDate();
    const number = String(globalCounter).padStart(4, "0");
    const newClientNumber = `${date}-${number}`;
    setGlobalCounter((prev) => prev + 1);

    const updatedCounters = [...counterList];
    let assigned = false;

    for (const counter of updatedCounters) {
      if (!counter.occupied) {
        counter.occupied = true;
        counter.clientNumber = newClientNumber;
        assigned = true;
        break;
      }
    }

    setCounterList(updatedCounters);

    if (!assigned) {
      setWaitingQueue((prev) => [...prev, newClientNumber]);
    }
  };

  const handleDone = (counterId: number) => {
    const updatedCounters = counterList.map((c) =>
      c.id === counterId ? { ...c, occupied: false, clientNumber: null } : c
    );
    setCounterList(updatedCounters);
  };

  useEffect(() => {
    const updatedCounters = [...counterList];
    const newQueue = [...waitingQueue];
    let changed = false;

    updatedCounters.forEach((counter) => {
      if (!counter.occupied && newQueue.length > 0) {
        const nextClient = newQueue.shift()!;
        counter.occupied = true;
        counter.clientNumber = nextClient;
        changed = true;
      }
    });

    if (changed) {
      setCounterList(updatedCounters);
      setWaitingQueue(newQueue);
    }
  }, [waitingQueue, counterList]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col px-12 py-8 space-y-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4">
        Client Queue Management
      </h1>

      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          className="text-3xl px-10 py-5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 shadow-xl transition"
        >
          Generate Number
        </button>
      </div>

      <div className="flex flex-1 mt-10 gap-10 justify-center items-start">
        {/* Counters Section */}
        <div className="flex gap-8 flex-wrap justify-center max-w-[60%]">
          {counterList.map((counter) => (
            <div
              key={counter.id}
              className={`w-80 h-64 rounded-2xl shadow-2xl text-center flex flex-col justify-center items-center ${
                counter.occupied
                  ? "bg-red-200 text-red-900"
                  : "bg-green-200 text-green-900"
              }`}
            >
              <h2 className="text-4xl font-bold mb-4">Counter {counter.id}</h2>
              {counter.occupied ? (
                <>
                  <p className="text-2xl font-semibold">Busy</p>
                  <p className="text-lg font-mono mt-2">
                    {counter.clientNumber}
                  </p>
                  <button
                    onClick={() => handleDone(counter.id)}
                    className="mt-4 px-6 py-2 text-xl bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    Done
                  </button>
                </>
              ) : (
                <p className="text-2xl font-semibold">Available</p>
              )}
            </div>
          ))}
        </div>

        {/* Waiting List Section */}
        <div className="w-96 bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-700">
            Waiting List
          </h2>
          <div className="h-[500px] overflow-y-auto space-y-3">
            {waitingQueue.length === 0 ? (
              <p className="text-xl text-center text-gray-500">
                No clients in queue
              </p>
            ) : (
              waitingQueue.map((number, index) => (
                <div
                  key={number}
                  className="bg-gray-100 p-4 rounded-lg text-xl font-mono text-center shadow text-amber-600"
                >
                  {index + 1}. {number}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
