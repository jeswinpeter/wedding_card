# വേളി (Veeli) — Wedding Invitation Website

A mobile-first wedding invitation website built with **Node.js**, **TypeScript**, **shadcn/ui**, **Tailwind CSS**, and **Vite**.

It showcases the wedding card sequence using an Apple-style smooth scrolling image scrub, accompanied by background wedding music and interactive ceremony details.

---

## ✨ Features

- **Mobile-First Design**: Optimized for smartphones with safe-area padding, touch gestures, and high-DPI canvas rendering.
- **Smooth Scroll Transition**: Scrubs through 118 high-resolution wedding card animation frames smoothly using linear interpolation (`lerp`) and `requestAnimationFrame`.
- **Auspicious Welcome Entrance**: "Open with Music" button designed to comply with iOS and Android browser audio autoplay security policies.
- **Background Music Player**:
  - Plays South Indian classical wedding nadaswaram BGM (`/public/audio/wedding-bgm.mp3`).
  - Floating vinyl disc badge with equalizer animation and mute/unmute control.
- **Interactive Control Deck**:
  - Touch slider scrubber for direct frame scrubbing without scrolling.
  - Auto Play / Replay button.
  - View mode toggle ("Fill Screen" vs "Full Frame").
  - Skip to Card shortcut.
- **Festive Petal Celebration**: Confetti bursts golden and marigold flower petals when the card finishes unfolding.
- **Comprehensive Ceremony Card**:
  - Live Muhurtham Countdown Timer to January 24, 2027.
  - One-click **Add to Google Calendar**.
  - One-click **Get Directions** to MMO OSA Auditorium, Mukkam on Google Maps.
  - **WhatsApp Share** & **Copy Invitation Link**.

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

The site will be available at:
- Local: [http://localhost:3000](http://localhost:3000)
- Mobile Network (on same Wi-Fi): `http://<your-ip>:3000`

---

## 🎵 Customizing Background Music

To change the background song:
1. Replace `public/audio/wedding-bgm.mp3` with your favorite audio file (e.g. your preferred wedding song).
2. The website will automatically play your audio upon entrance.

---

## 📱 Project Structure

```
├── public/
│   ├── audio/wedding-bgm.mp3         # Background audio track
│   └── frames/ezgif-frame-*.jpg      # 118 sequence frames
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn UI components (button, card, dialog, slider)
│   │   ├── AudioPlayer.tsx           # Floating audio player with sound bars
│   │   ├── InvitationDetails.tsx     # Calendar, maps, countdown & RSVP
│   │   ├── WeddingCardCanvas.tsx     # High-DPI canvas frame scrubber
│   │   └── WelcomeOverlay.tsx        # Entrance screen & autoplay unlock
│   ├── App.tsx                       # Main page layout
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind & wedding theme styles
└── package.json
```
