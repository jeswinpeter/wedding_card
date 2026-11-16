import { useState } from "react";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { AudioPlayer } from "@/components/AudioPlayer";
import { WeddingCardCanvas } from "@/components/WeddingCardCanvas";
import { InvitationDetails } from "@/components/InvitationDetails";

export function App() {
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  const handleWelcomeEnter = (playMusic: boolean) => {
    setWelcomeDismissed(true);
    if (playMusic) {
      setAutoPlayAudio(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1a0f0a] text-stone-100 selection:bg-amber-600/30 font-body">
      {/* Auspicious Welcome Entrance Modal */}
      {!welcomeDismissed && <WelcomeOverlay onEnter={handleWelcomeEnter} />}

      {/* Floating Background Audio Player */}
      <AudioPlayer autoPlayTriggered={autoPlayAudio} />

      {/* Smooth Image Sequence Wedding Card Experience */}
      <main className="w-full">
        <WeddingCardCanvas />

        {/* Extended Invitation & Event Details */}
        <section className="bg-gradient-to-b from-[#1a0f0a] via-[#140b07] to-[#0d0704]">
          <InvitationDetails />
        </section>
      </main>
    </div>
  );
}

export default App;
