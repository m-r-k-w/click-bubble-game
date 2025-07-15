'use client';
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = Number(searchParams.get("score")) || 0;
  const difficulty = searchParams.get("difficulty") || "easy";
  const time = Number(searchParams.get("time")) || 30;

  const handleRetry = () => {
    router.push(`/game?difficulty=${difficulty}&time=${time}`);
  };
  const handleTop = () => {
    router.push("/");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-4">リザルト画面</h1>
      <div className="mb-6 flex flex-col gap-2 items-center">
        <span className="text-xl">スコア: <span className="font-bold text-2xl">{score}</span></span>
        <span>難易度: {difficulty}</span>
        <span>制限時間: {time}秒</span>
      </div>
      <div className="flex gap-6">
        <button onClick={handleRetry} className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-600 transition">
          もう一度プレイ
        </button>
        <button onClick={handleTop} className="px-6 py-3 bg-gray-400 text-white rounded-full text-lg font-semibold shadow hover:bg-gray-500 transition">
          Topへ戻る
        </button>
      </div>
    </main>
  );
} 