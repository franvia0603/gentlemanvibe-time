import DigitalClock from "@/components/DigitalClock";
import FullscreenHint from "@/components/FullscreenHint";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black px-8 pb-8 pt-24">
      <DigitalClock />
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
    </main>
  );
}
