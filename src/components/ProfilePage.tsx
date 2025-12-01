import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  email: string;
  fullName: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setUserProfile({
        email: user.email || "",
        fullName:
          user.user_metadata?.full_name ||
          user.user_metadata?.display_name ||
          "User",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Successfully logged out!");
      navigate("/auth");
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("An unexpected error occurred during logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-fredoka font-medium text-foreground">
            Profile 👤
          </h1>
          <p className="text-sm text-muted-foreground font-quicksand">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-fredoka font-medium text-foreground">
            Profile 👤
          </h1>
          <p className="text-sm text-muted-foreground font-quicksand">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-fredoka font-medium text-foreground">
          Profile 👤
        </h1>
        <p className="text-sm text-muted-foreground font-quicksand">
          Your account information
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl font-medium bg-primary text-primary-foreground">
                {getInitials(userProfile.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-fredoka">
            {userProfile.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            {/* <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base font-medium">{userProfile.fullName}</p>
              </div>
            </div> */}

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base font-medium">{userProfile.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full justify-center"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}



// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { User, Activity, Heart, Flame } from "lucide-react";

// export default function ProfilePage() {
//   const [profile, setProfile] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     height: "",
//     weight: "",
//     activityLevel: "",
//     goal: "",
//   });

//   const activityOptions = [
//     "Sedentary",
//     "Lightly Active",
//     "Moderately Active",
//     "Very Active",
//     "Super Active",
//   ];

//   const goalOptions = [
//     "Lose Weight",
//     "Maintain Weight",
//     "Gain Weight",
//   ];

//   const handleChange = (e: any) => {
//     setProfile({
//       ...profile,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = () => {
//     console.log("Saved profile:", profile);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex justify-center">
//       <Card className="w-full max-w-xl shadow-xl rounded-2xl">
//         <CardContent className="p-6 space-y-6">

//           {/* Header */}
//           <div className="text-center space-y-2">
//             <h2 className="text-3xl font-bold">Your Fitness Profile</h2>
//             <p className="text-muted-foreground text-sm">
//               Personal details that help calculate your fitness metrics
//             </p>
//           </div>

//           {/* Personal Details */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               <User className="h-5 w-5" /> Personal Info
//             </h3>

//             <Input
//               placeholder="Name"
//               name="name"
//               value={profile.name}
//               onChange={handleChange}
//             />

//             <Input
//               placeholder="Age"
//               name="age"
//               type="number"
//               value={profile.age}
//               onChange={handleChange}
//             />

//             <Input
//               placeholder="Gender"
//               name="gender"
//               value={profile.gender}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Body Measurements */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               <Activity className="h-5 w-5" /> Body Measurements
//             </h3>

//             <Input
//               placeholder="Height (cm)"
//               name="height"
//               type="number"
//               value={profile.height}
//               onChange={handleChange}
//             />

//             <Input
//               placeholder="Weight (kg)"
//               name="weight"
//               type="number"
//               value={profile.weight}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Activity Level */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               <Heart className="h-5 w-5" /> Activity Level
//             </h3>

//             <select
//               name="activityLevel"
//               value={profile.activityLevel}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-3"
//             >
//               <option value="">Select activity level</option>
//               {activityOptions.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Fitness Goal */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               <Flame className="h-5 w-5" /> Fitness Goal
//             </h3>

//             <select
//               name="goal"
//               value={profile.goal}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-3"
//             >
//               <option value="">Select goal</option>
//               {goalOptions.map((goal) => (
//                 <option key={goal} value={goal}>
//                   {goal}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Save Button */}
//           <Button
//             onClick={handleSave}
//             className="w-full py-3 text-lg rounded-xl"
//           >
//             Save Profile
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
