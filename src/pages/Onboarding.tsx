import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Activity, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Icons & Images
import maleIcon from "@/assets/male-icon.png";
import femaleIcon from "@/assets/female-icon.png";
import MalesedentaryImg from "@/assets/male-sedentary.png";
import FemalesedentaryImg from "@/assets/female-sedentary.png";
import MalelightActivityImg from "@/assets/male-light.png";
import FemalelightActivityImg from "@/assets/female-light.png";
import MalemoderateActivityImg from "@/assets/male-mod.png";
import FemalemoderateActivityImg from "@/assets/female-mod.png";
import MaleactiveImg from "@/assets/male-active.png";
import FemaleactiveImg from "@/assets/female-active.png";
import MaleveryActiveImg from "@/assets/male-gym.png";
import FemaleveryActiveImg from "@/assets/female-gym.png";
import MaleloseWeightImg from "@/assets/male-loose.png";
import FemaleloseWeightImg from "@/assets/female-loose.png";
import MalemaintainWeightImg from "@/assets/male-fit.png";
import FemalemaintainWeightImg from "@/assets/female-fit.png";
import MalegainWeightImg from "@/assets/male-gain.png";
import FemalegainWeightImg from "@/assets/female-gain.png";
import AgeIcon from "@/assets/age.png";
import HeightIcon from "@/assets/height.png";
import WeightIcon from "@/assets/weight.png";

interface OnboardingData {
    gender: string;
    age: string;
    height: string;
    weight: string;
    activity: string;
    goal: string;
}

const steps = [
    { id: 1, title: "Gender", key: "gender" },
    { id: 2, title: "Age", key: "age" },
    { id: 3, title: "Height", key: "height" },
    { id: 4, title: "Weight", key: "weight" },
    { id: 5, title: "Activity Level", key: "activity" },
    { id: 6, title: "Fitness Goal", key: "goal" },
    { id: 7, title: "Summary", key: "summary" },
];

const genderOptions = [
    { value: "male", label: "Male", icon: User, image: maleIcon },
    { value: "female", label: "Female", icon: User, image: femaleIcon },
];

const activityOptions = [
    { value: "sedentary", label: "Sedentary", description: "Little or no exercise", multiplier: 1.2 },
    { value: "light", label: "Light", description: "Exercise 1-3 days/week", multiplier: 1.375 },
    { value: "moderate", label: "Moderate", description: "Exercise 3-5 days/week", multiplier: 1.55 },
    { value: "active", label: "Active", description: "Exercise 6-7 days/week", multiplier: 1.725 },
    { value: "very-active", label: "Very Active", description: "Hard exercise daily", multiplier: 1.9 },
];

const goalOptions = [
    { value: "lose", label: "Lose Weight", description: "Create a calorie deficit", icon: TrendingUp },
    { value: "maintain", label: "Maintain", description: "Keep current weight", icon: Activity },
    { value: "gain", label: "Gain Weight", description: "Build muscle mass", icon: Target },
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        gender: "",
        age: "",
        height: "",
        weight: "",
        activity: "",
        goal: "",
    });

    const progress = (currentStep / steps.length) * 100;
    const handleNext = () => {
        // Step 3: Height conversion
        if (currentStep === 3) {
            if (heightUnit === "ft") {
                const totalCm = (parseFloat(heightFeet) || 0) * 30.48 + (parseFloat(heightInch) || 0) * 2.54;
                updateData("height", totalCm.toFixed(2));
            }
        }

        // Step 4: Weight conversion
        if (currentStep === 4) {
            if (weightUnit === "lbs") {
                const weightKg = (parseFloat(weightLbs) || 0) * 0.453592;
                updateData("weight", weightKg.toFixed(2));
            }
        }

        // Move to next step
        if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    };
    const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    const updateData = (key: keyof OnboardingData, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const calculateCalories = () => {
        const age = parseInt(data.age) || 0;

        // Height in cm - use the current state values
        let heightInCm;
        if (heightUnit === "cm") {
            heightInCm = parseFloat(data.height) || 0;
        } else {
            // Use the feet/inches values from state
            heightInCm = (parseFloat(heightFeet) || 0) * 30.48 + (parseFloat(heightInch) || 0) * 2.54;
        }

        // Weight in kg - use the current state values
        let weightInKg;
        if (weightUnit === "kg") {
            weightInKg = parseFloat(data.weight) || 0;
        } else {
            // Use the lbs value from state
            weightInKg = (parseFloat(weightLbs) || 0) * 0.453592;
        }

        // Validate all required fields
        if (!age || !heightInCm || !weightInKg || !data.gender || !data.activity) {
            console.log("Missing data:", { age, heightInCm, weightInKg, gender: data.gender, activity: data.activity });
            return 0;
        }

        // Mifflin-St Jeor Equation
        let bmr =
            data.gender === "male"
                ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
                : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;

        const activityMultiplier =
            activityOptions.find((a) => a.value === data.activity)?.multiplier || 1.2;

        let tdee = bmr * activityMultiplier;

        // Adjust for goal
        if (data.goal === "lose") tdee -= 500;
        else if (data.goal === "gain") tdee += 500;

        return Math.round(tdee);
    };



    const isStepValid = () => {
        const step = steps[currentStep - 1];

        switch (step.key) {
            case "age":
                return data.age !== "";
            case "height":
                if (heightUnit === "cm") return data.height !== "";
                else return heightFeet !== "" || heightInch !== "";
            case "weight":
                if (weightUnit === "kg") return data.weight !== "";
                else return weightLbs !== "";
            case "gender":
                return data.gender !== "";
            case "activity":
                return data.activity !== "";
            case "goal":
                return data.goal !== "";
            case "summary":
                return true;
            default:
                return false;
        }
    };



    const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
    const [heightFeet, setHeightFeet] = useState(""); // for ft input
    const [heightInch, setHeightInch] = useState(""); // for inches input
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [weightLbs, setWeightLbs] = useState("");
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-slide-in text-center">
                        <h2 className="text-3xl font-bold">What's your gender?</h2>
                        <p className="text-muted-foreground">Help us personalize your experience</p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
                            {genderOptions.map(option => (
                                <Card
                                    key={option.value}
                                    className={cn(
                                        "p-6 cursor-pointer transition-smooth hover:shadow-elegant-lg hover:scale-105 border-2 overflow-hidden",
                                        data.gender === option.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    )}
                                    onClick={() => updateData("gender", option.value)}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <img src={option.image} alt={option.label} className="h-24 w-24 object-contain" />
                                        <span className="font-semibold text-lg">{option.label}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-slide-in">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold">How old are you?</h2>
                            <p className="text-muted-foreground">This helps calculate your metabolic rate</p>
                        </div>

                        {/* Conditional Image */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={AgeIcon}
                                alt={data.gender || "User"}
                                className="h-32 w-32 object-contain"
                            />
                        </div>

                        {/* Input Field */}
                        <div className="max-w-sm mx-auto relative">
                            <Input
                                type="number"
                                placeholder="Enter your age"
                                value={data.age}
                                onChange={(e) => updateData("age", e.target.value)}
                                className="text-center text-2xl h-16 border-2 focus:border-primary"
                            />
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                years
                            </span>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-slide-in text-center">
                        <h2 className="text-3xl font-bold">What's your height?</h2>
                        <p className="text-muted-foreground">We'll use this for accurate calculations</p>

                        {/* Conditional Image */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={HeightIcon}
                                alt={"User"}
                                className="h-32 w-32 object-contain"
                            />
                        </div>

                        {/* Unit Selection */}
                        <div className="flex justify-center gap-4 mb-2">
                            <button
                                className={cn(
                                    "px-4 py-2 border rounded-lg",
                                    heightUnit === "cm" ? "bg-primary text-white" : "bg-card"
                                )}
                                onClick={() => setHeightUnit("cm")}
                            >
                                cm
                            </button>
                            <button
                                className={cn(
                                    "px-4 py-2 border rounded-lg",
                                    heightUnit === "ft" ? "bg-primary text-white" : "bg-card"
                                )}
                                onClick={() => setHeightUnit("ft")}
                            >
                                ft
                            </button>
                        </div>

                        {/* Input Fields */}
                        {heightUnit === "cm" ? (
                            <div className="max-w-sm mx-auto relative">
                                <Input
                                    type="number"
                                    placeholder="Enter your height in cm"
                                    value={data.height}
                                    onChange={(e) => updateData("height", e.target.value)}
                                    className="text-center text-2xl h-16 border-2 focus:border-primary"
                                />
                                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    cm
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-4 max-w-sm mx-auto">
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        placeholder="Feet"
                                        value={heightFeet}
                                        onChange={(e) => setHeightFeet(e.target.value)}
                                        className="text-center text-2xl h-16 border-2 focus:border-primary"
                                    />
                                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        ft
                                    </span>
                                </div>
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        placeholder="Inches"
                                        value={heightInch}
                                        onChange={(e) => setHeightInch(e.target.value)}
                                        className="text-center text-2xl h-16 border-2 focus:border-primary"
                                    />
                                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        in
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                );


            case 4:
                return (
                    <div className="space-y-6 animate-slide-in text-center">
                        <h2 className="text-3xl font-bold">What's your weight?</h2>
                        <p className="text-muted-foreground">Current weight for personalized goals</p>

                        {/* Conditional Image */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={WeightIcon}
                                alt={"User"}
                                className="h-32 w-32 object-contain"
                            />
                        </div>

                        {/* Unit Selection */}
                        <div className="flex justify-center gap-4 mb-2">
                            <button
                                className={cn(
                                    "px-4 py-2 border rounded-lg",
                                    weightUnit === "kg" ? "bg-primary text-white" : "bg-card"
                                )}
                                onClick={() => setWeightUnit("kg")}
                            >
                                kg
                            </button>
                            <button
                                className={cn(
                                    "px-4 py-2 border rounded-lg",
                                    weightUnit === "lbs" ? "bg-primary text-white" : "bg-card"
                                )}
                                onClick={() => setWeightUnit("lbs")}
                            >
                                lbs
                            </button>
                        </div>

                        {/* Input Field */}
                        <div className="max-w-sm mx-auto relative">
                            {weightUnit === "kg" ? (
                                <>
                                    <Input
                                        type="number"
                                        placeholder="Enter your weight in kg"
                                        value={data.weight}
                                        onChange={(e) => updateData("weight", e.target.value)}
                                        className="text-center text-2xl h-16 border-2 focus:border-primary"
                                    />
                                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        kg
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Input
                                        type="number"
                                        placeholder="Enter your weight in lbs"
                                        value={weightLbs}
                                        onChange={(e) => setWeightLbs(e.target.value)}
                                        className="text-center text-2xl h-16 border-2 focus:border-primary"
                                    />
                                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        lbs
                                    </span>
                                </>
                            )}
                        </div>

                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6 animate-slide-in text-center">
                        <h2 className="text-3xl font-bold">Activity Level</h2>
                        <p className="text-muted-foreground">How active are you typically?</p>
                        <div className="grid gap-3 max-w-lg mx-auto mt-4">
                            {activityOptions.map(option => {
                                let imgSrc;
                                if (data.gender === "male") {
                                    imgSrc = option.value === "sedentary" ? MalesedentaryImg
                                        : option.value === "light" ? MalelightActivityImg
                                            : option.value === "moderate" ? MalemoderateActivityImg
                                                : option.value === "active" ? MaleactiveImg
                                                    : MaleveryActiveImg;
                                } else {
                                    imgSrc = option.value === "sedentary" ? FemalesedentaryImg
                                        : option.value === "light" ? FemalelightActivityImg
                                            : option.value === "moderate" ? FemalemoderateActivityImg
                                                : option.value === "active" ? FemaleactiveImg
                                                    : FemaleveryActiveImg;
                                }
                                return (
                                    <Card
                                        key={option.value}
                                        className={cn(
                                            "p-4 cursor-pointer transition-smooth hover:shadow-elegant border-2 overflow-hidden",
                                            data.activity === option.value
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                        onClick={() => updateData("activity", option.value)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img src={imgSrc} alt={option.label} className="h-16 w-16 object-cover rounded-lg flex-shrink-0" />
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold">{option.label}</h3>
                                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6 animate-slide-in text-center">
                        <h2 className="text-3xl font-bold">Fitness Goal</h2>
                        <p className="text-muted-foreground">What do you want to achieve?</p>
                        <div className="grid gap-4 max-w-lg mx-auto mt-4">
                            {goalOptions.map(option => {
                                let imgSrc;
                                if (data.gender === "male") {
                                    imgSrc = option.value === "lose" ? MaleloseWeightImg
                                        : option.value === "maintain" ? MalemaintainWeightImg
                                            : MalegainWeightImg;
                                } else {
                                    imgSrc = option.value === "lose" ? FemaleloseWeightImg
                                        : option.value === "maintain" ? FemalemaintainWeightImg
                                            : FemalegainWeightImg;
                                }
                                return (
                                    <Card
                                        key={option.value}
                                        className={cn(
                                            "p-6 cursor-pointer transition-smooth hover:shadow-elegant-lg hover:scale-[1.02] border-2 overflow-hidden",
                                            data.goal === option.value
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                        onClick={() => updateData("goal", option.value)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img src={imgSrc} alt={option.label} className="h-20 w-20 object-cover rounded-lg flex-shrink-0" />
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold text-lg">{option.label}</h3>
                                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );

            case 7:
                const calories = calculateCalories();
                return renderSummary(calories);

            default:
                return null;
        }
    };

    const renderInputStep = (key: keyof OnboardingData, title: string, subtitle: string, icon: string, unit: string) => (
        <div className="space-y-6 animate-slide-in text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>

            <div className="flex justify-center mb-4">
                <img src={icon} alt="User" className="h-32 w-32 object-contain" />
            </div>

            <div className="max-w-sm mx-auto relative">
                <Input
                    type="number"
                    placeholder={`Enter your ${key}`}
                    value={data[key]}
                    onChange={(e) => updateData(key, e.target.value)}
                    className="text-center text-2xl h-16 border-2 focus:border-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">{unit}</span>
            </div>
        </div>
    );

    const renderSummary = (calories: number) => (
        <div className="space-y-6 animate-fade-in text-center">
            <h2 className="text-3xl font-bold">Your Fitness Profile</h2>
            <p className="text-muted-foreground">Here's your personalized summary</p>

            <Card className="max-w-lg mx-auto p-8 gradient-fitness">
                <div className="text-center space-y-2 mb-6">
                    <p className="text-white/90 text-sm font-medium">Daily Calorie Target</p>
                    <p className="text-6xl font-bold text-white">"hii"</p>
                    <p className="text-white/80 text-sm">calories per day</p>
                </div>
            </Card>

            <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
                <Card className="p-4 shadow-elegant">
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-semibold text-lg capitalize">{data.gender}</p>
                </Card>
                <Card className="p-4 shadow-elegant">
                    <p className="text-sm text-muted-foreground mb-1">Age</p>
                    <p className="font-semibold text-lg">{data.age} years</p>
                </Card>
                <Card className="p-4 shadow-elegant">
                    <p className="text-sm text-muted-foreground mb-1">Height</p>
                    <p className="font-semibold text-lg">{data.height} cm</p>
                </Card>
                <Card className="p-4 shadow-elegant">
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <p className="font-semibold text-lg">{data.weight} kg</p>
                </Card>
                <Card className="p-4 shadow-elegant col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Activity Level</p>
                    <p className="font-semibold capitalize">{activityOptions.find(a => a.value === data.activity)?.label}</p>
                </Card>
                <Card className="p-4 shadow-elegant col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Goal</p>
                    <p className="font-semibold">{goalOptions.find(g => g.value === data.goal)?.label}</p>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Progress Bar */}
            <div className="sticky top-0 z-10 bg-card shadow-md">
                <div className="container max-w-4xl mx-auto px-4 py-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Step {currentStep} of {steps.length}
                            </span>
                            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-smooth",
                                        index < currentStep
                                            ? "bg-primary"
                                            : index === currentStep - 1
                                                ? "bg-primary scale-150"
                                                : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 container max-w-4xl mx-auto px-4 py-12">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 bg-card shadow-lg border-t">
                <div className="container max-w-4xl mx-auto px-4 py-6 flex justify-between gap-4">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="min-w-[120px]">
                        Back
                    </Button>
                    <Button onClick={handleNext} disabled={!isStepValid()} className="min-w-[120px] gradient-fitness border-0">
                        {currentStep === steps.length ? "Finish" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
