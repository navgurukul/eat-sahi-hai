import { useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Mobile-first layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Hero Section */}
        <div className="lg:flex-1 relative overflow-hidden">
          {/* Background with Food Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-success/70">
            {/* Food pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="text-6xl absolute top-10 left-10 rotate-12">
                🍎
              </div>
              <div className="text-4xl absolute top-32 right-20 -rotate-12">
                🥕
              </div>
              <div className="text-5xl absolute bottom-40 left-16 rotate-45">
                🥗
              </div>
              <div className="text-3xl absolute bottom-20 right-12 -rotate-45">
                🍇
              </div>
              <div className="text-4xl absolute top-1/2 left-1/3 rotate-12">
                🍊
              </div>
              <div className="text-5xl absolute top-1/3 right-1/3 -rotate-12">
                🥦
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-48 lg:h-full p-6 text-center">
            <div className="max-w-md">
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                Khana Track
              </h1>
              <p className="text-lg lg:text-xl text-white/90 mb-2">
                Track your daily nutrition
              </p>
              <p className="text-sm lg:text-base text-white/80">
                Pet bhar gaya? Let's keep track! 🍽️
              </p>

              {/* Feature highlights */}
              <div className="hidden lg:flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    🔥
                  </div>
                  <span>Track calories and nutrition</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    📊
                  </div>
                  <span>Monitor sugar levels</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    🥗
                  </div>
                  <span>Log your daily meals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="lg:flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {isSignUp ? (
              <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
            ) : (
              <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
