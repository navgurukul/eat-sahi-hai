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
      morning: "Nashta time! Subah ka fresh khana! 🍳",
      afternoon: "Lunch time! Dopahar ka mazedaar khana! 🍛", 
      evening: "Chai time! Shaam ka light snack! 🫖",
      night: "Dinner time! Raat ka tasty khana! 🍽️",
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
      className="relative h-36 bg-cover bg-center rounded-3xl overflow-hidden mb-6 border-3 border-accent/30"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      <div className="relative h-full flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-fredoka font-bold text-white drop-shadow-lg mb-2">
            {getGreeting()}
          </h2>
          <p className="text-sm text-white/95 drop-shadow font-baloo font-medium">
            {currentTime.toLocaleDateString("en-IN", { 
              weekday: "long",
              day: "numeric", 
              month: "long" 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-fredoka font-bold text-white drop-shadow-lg">
            {formatTime()}
          </div>
        </div>
      </div>
    </div>
  );
}