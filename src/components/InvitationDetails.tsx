import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Navigation,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InvitationDetails: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Wedding Date: January 24, 2027 10:30 AM IST
  useEffect(() => {
    const target = new Date("2027-01-24T10:30:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Vasudev & Aparna Wedding | വേളി");
    const details = encodeURIComponent(
      "Wedding Ceremony of Vasudev (S/o Santhosh Moothedam & Resmi Moothedam) with Aparna (D/o Ramachandran Naduviledam & Maya Naduviledam)."
    );
    const location = encodeURIComponent("MMO OSA Auditorium, Mukkam, Kerala");
    const dates = "20270124T050000Z/20270124T080000Z"; // 10:30 AM to 1:30 PM IST in UTC
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Google Maps navigation URL
  const getGoogleMapsUrl = () => {
    return "https://www.google.com/maps/search/?api=1&query=MMO+OSA+AUDITORIUM+MUKKAM";
  };

  // WhatsApp Wish / Share URL
  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      "Vasudev & Aparna are getting married! 💍✨\nDate: January 24, 2027 (10:30 AM)\nVenue: MMO OSA Auditorium, Mukkam\nView Wedding Card: " +
        window.location.href
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-30 w-full max-w-lg mx-auto px-4 py-12 space-y-6 text-amber-50">
      {/* Decorative separator */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50"></div>
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-heading tracking-widest text-amber-300 uppercase">
          Ceremony Details
        </span>
        <Sparkles className="w-4 h-4 text-amber-400" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50"></div>
      </div>

      {/* Countdown Card */}
      <Card className="border-amber-500/30 bg-gradient-to-b from-stone-950/90 to-stone-900/90 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <p className="text-xs uppercase tracking-widest text-amber-400/90 font-heading">
            Counting Down to the Sacred Muhurtham
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
              <span className="text-2xl font-bold font-heading text-amber-300">
                {timeLeft.days}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                Days
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
              <span className="text-2xl font-bold font-heading text-amber-300">
                {timeLeft.hours}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                Hours
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
              <span className="text-2xl font-bold font-heading text-amber-300">
                {timeLeft.minutes}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                Mins
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
              <span className="text-2xl font-bold font-heading text-amber-300">
                {timeLeft.seconds}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                Secs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Details Card */}
      <Card className="border-amber-500/30 bg-gradient-to-b from-stone-950/90 to-[#1e1009]/95 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-heading">
            Save The Date
          </span>
          <CardTitle className="text-2xl text-amber-100">
            Vasudev & Aparna
          </CardTitle>
          <p className="text-xs text-amber-200/70 font-serif-elegant italic">
            Request the honor of your presence and blessings
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Date & Time */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-black/30 border border-amber-500/20">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-200 font-heading">
                Sunday, 24th January 2027
              </h4>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                Ceremony: 10:30 AM – 11:30 AM
              </p>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-black/30 border border-amber-500/20">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-200 font-heading">
                MMO OSA AUDITORIUM
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Mukkam, Kozhikode, Kerala
              </p>
            </div>
          </div>


          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Button
              asChild
              variant="gold"
              className="w-full text-xs gap-1.5 h-11"
            >
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Calendar</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full text-xs gap-1.5 h-11 border-amber-500/40 text-amber-300"
            >
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </Button>
          </div>

          {/* Share & Copy Link */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              asChild
              variant="outline"
              className="w-full text-xs gap-1.5 h-10 border-stone-700 bg-black/40 text-stone-300 hover:text-white"
            >
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 className="w-3.5 h-3.5 text-green-400" />
                <span>Share via WhatsApp</span>
              </a>
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full text-xs gap-1.5 h-10 border-stone-700 bg-black/40 text-stone-300 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Blessing */}
      <div className="text-center pt-4 pb-12 space-y-2">
        <p className="text-xs text-amber-200/80 font-serif-elegant italic">
          "Two souls with but a single thought, two hearts that beat as one."
        </p>
        <p className="text-[11px] text-stone-400">
          Designed with love for Vasudev & Aparna's Wedding
        </p>
      </div>
    </div>
  );
};
