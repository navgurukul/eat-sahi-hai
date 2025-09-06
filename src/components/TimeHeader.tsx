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
    <div className="relative h-24 rounded-3xl overflow-hidden mb-4 border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
      {/* Food pattern overlay */}
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.3'%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='51' cy='51' r='2'/%3E%3Ccircle cx='21' cy='21' r='1'/%3E%3Ccircle cx='39' cy='39' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
           }} 
      />
      
      {/* Main gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
      
      <div className="relative h-full flex items-center justify-between px-6">
        <div className="flex-1">
          <h2 className="text-lg font-fredoka font-bold text-primary mb-1">
            {getGreeting()}
          </h2>
          <p className="text-sm text-muted-foreground font-baloo font-medium">
            {currentTime.toLocaleDateString("en-IN", { 
              weekday: "long",
              day: "numeric", 
              month: "long" 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-fredoka font-bold text-primary">
            {formatTime()}
          </div>
        </div>
      </div>
    </div>
  );
}