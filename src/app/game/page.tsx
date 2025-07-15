'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// 泡の型
interface Bubble {
  id: string;
  x: number;
  y: number;
}

type Difficulty = "easy" | "normal" | "hard";

// 難易度ごとのパラメータ
const DIFFICULTY_PARAMS: Record<Difficulty, { color: string; interval: number; maxBubbles: number }> = {
  easy:   { color: "bg-blue-200", interval: 1200, maxBubbles: 2 },
  normal: { color: "bg-blue-400", interval: 800,  maxBubbles: 3 },
  hard:   { color: "bg-blue-700", interval: 500,  maxBubbles: 4 },
};

function getRandomPosition() {
  const size = 80;
  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size - 100) + 60;
  return { x, y };
}

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get("difficulty");
  const time = searchParams.get("time");

  // パラメータ未指定時はTopへリダイレクト
  useEffect(() => {
    if (!difficulty || !time) {
      router.replace("/");
    }
  }, [difficulty, time, router]);

  const diffValue = (difficulty as Difficulty) || "easy";
  const isInfinite = time === "infinite";
  const timeValue = isInfinite ? undefined : Number(time) || 30;
  const params = DIFFICULTY_PARAMS[diffValue] || DIFFICULTY_PARAMS.easy;

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(timeValue ?? 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 泡生成
  useEffect(() => {
    function addBubble() {
      setBubbles((prev) => {
        if (prev.length >= params.maxBubbles) return prev;
        const id = Math.random().toString(36).slice(2);
        const pos = getRandomPosition();
        return [...prev, { id, ...pos }];
      });
    }
    intervalRef.current = setInterval(addBubble, params.interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [params.interval, params.maxBubbles]);

  // タイマー（無限以外のみ）
  useEffect(() => {
    if (isInfinite) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInfinite]);

  // タイマー終了時の処理（リザルト画面へ遷移、無限は遷移しない）
  useEffect(() => {
    if (isInfinite) return;
    if (timer <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      router.push(`/result?score=${score}&difficulty=${diffValue}&time=${timeValue}`);
    }
  }, [timer, router, score, diffValue, timeValue, isInfinite]);

  // 泡クリックで消去＆スコア加算＋音再生
  const handleBubbleClick = (id: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
    // 音再生
    const audio = new Audio("/pop.mp3");
    audio.currentTime = 0;
    audio.play();
  };

  // やめるボタン押下時
  const handleQuit = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* 上部情報バー */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/80 z-20 shadow">
        <div className="text-lg font-semibold">残り時間: <span className="font-mono">{isInfinite ? '無限' : timer}</span>{!isInfinite && '秒'}</div>
        <div className="text-lg font-semibold">スコア: <span className="font-mono">{score}</span></div>
        <button onClick={handleQuit} className="px-4 py-2 bg-gray-400 text-white rounded-full font-semibold shadow hover:bg-gray-500 transition">やめる</button>
      </div>
      <div className="absolute inset-0 pointer-events-none select-none" style={{zIndex:0}} />
      {bubbles.map((b) => (
        <button
          key={b.id}
          className={`absolute ${params.color} rounded-full shadow-lg border-2 border-white pointer-events-auto`}
          style={{ left: b.x, top: b.y, width: 80, height: 80, zIndex: 10 }}
          onClick={() => handleBubbleClick(b.id)}
        />
      ))}
    </main>
  );
} 