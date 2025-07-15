'use client';
import Link from "next/link";
import { useState } from "react";

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "normal", label: "Normal" },
  { value: "hard", label: "Hard" },
];
const times = [15, 30, 60, "infinite"] as const;

export default function Home() {
  const [difficulty, setDifficulty] = useState("easy");
  const [time, setTime] = useState<number | string>(30);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-6">Click Bubble Game</h1>
      <p className="mb-8">泡をクリック/タップして消すシンプルなゲームです。</p>

      <div className="mb-6 flex flex-col gap-4 w-64">
        <div>
          <label className="block mb-1 font-semibold">難易度</label>
          <div className="flex gap-4">
            {difficulties.map((d) => (
              <label key={d.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="difficulty"
                  value={d.value}
                  checked={difficulty === d.value}
                  onChange={() => setDifficulty(d.value)}
                />
                {d.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold">制限時間</label>
          <div className="flex gap-4">
            {times.map((t) => (
              <label key={t} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="time"
                  value={t}
                  checked={time === t}
                  onChange={() => setTime(t)}
                />
                {t === "infinite" ? "無限" : `${t}秒`}
              </label>
            ))}
          </div>
        </div>
      </div>

      <Link href={`/game?difficulty=${difficulty}&time=${time}`}>
        <button className="px-8 py-4 bg-blue-500 text-white rounded-full text-xl font-semibold shadow hover:bg-blue-600 transition">
          ゲーム開始
        </button>
      </Link>
    </main>
  );
}
