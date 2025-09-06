import { useEffect, useState } from "react";
import morningImg from "@/assets/morning-header.jpg";
import afternoonImg from "@/assets/afternoon-header.jpg";
import eveningImg from "@/assets/evening-header.jpg";
import nightImg from "@/assets/night-header.jpg";

export function TimeHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = {
      morning: "Subah ho gayi! Good Morning",
      afternoon: "Dopahar ka samay! Good Afternoon", 
      evening: "Shaam ho gayi! Good Evening",
      night: "Raat ka samay! Good Night",
    };
    return greetings[timeOfDay];
  };

  const getBackgroundImage = () => {
    const timeOfDay = getTimeOfDay();
    const images = {
      morning: morningImg,
      afternoon: afternoonImg,
      evening: eveningImg,
      night: nightImg,
    };
    return images[timeOfDay];
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div 
      className="relative h-24 bg-cover bg-center rounded-2xl overflow-hidden mb-6"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      <div className="relative h-full flex items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-comico font-bold text-white drop-shadow-lg">
            {getGreeting()}
          </h2>
          <p className="text-sm text-white/90 drop-shadow font-zodiak">
            {currentTime.toLocaleDateString("en-IN", { 
              weekday: "long",
              day: "numeric", 
              month: "long" 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-comico font-bold text-white drop-shadow-lg">
            {formatTime()}
          </div>
        </div>
      </div>
    </div>
  );
}