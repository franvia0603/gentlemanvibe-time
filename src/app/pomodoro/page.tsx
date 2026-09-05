import type { Metadata } from "next";
import PomodoroDial from "@/components/PomodoroDial";

export const metadata: Metadata = {
  title: "Pomodoro Dial Preview — GentlemanVibe Time",
};

export default function PomodoroPreviewPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black p-8">
      <div className="aspect-square w-full max-w-[460px]">
        <PomodoroDial />
      </div>
    </main>
  );
}
