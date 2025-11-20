import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import nutritionHero from "@/assets/nutrition-hero.png";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Green Header Section - Mobile First */}
      <div className="bg-green-500 text-white text-center px-6 py-16">
        <h1 className="text-4xl font-medium mb-4">Khana Track</h1>
        <p className="text-xl mb-2">Track your daily nutrition</p>
        <p className="text-base mb-3">
          Understand your meals with smart calorie and glycemic load insights.
        </p>
        <p className="text-lg opacity-90">
          Pet bhar gaya? Let's keep track! 🍽️
        </p>
      </div>

      {/* Main Content Area - Overlapping Card */}
      <div className="flex-1 flex items-start justify-center px-4 -mt-20">
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
            {/* Nutrition Hero Image - Larger Size */}
            <div className="flex justify-center pt-8 pb-4">
              <img
                src={nutritionHero}
                alt="Nutrition tracking illustration"
                className="w-64 h-48 object-contain"
              />
            </div>

            <CardHeader className="text-center px-8 pb-2">
              <CardTitle className="text-2xl font-medium text-gray-900 mb-3">
                Welcome to Khana Track
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sign in with your Google account to start tracking your
                nutrition
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <GoogleLoginButton />
              <p className="text-center text-gray-700 mt-4 text-sm">
                Healthy rehna hai? Chalo{" "}
                <span className="font-bold text-green-500">track karein</span>
              </p>
            </CardContent>
          </Card>

       
        </div>
      </div>
    </div>
  );
};

export default Auth;
