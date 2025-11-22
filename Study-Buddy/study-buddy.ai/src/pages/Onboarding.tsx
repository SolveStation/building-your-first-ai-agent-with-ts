import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Brain, Target } from 'lucide-react';

const onboardingSteps = [
  {
    icon: BookOpen,
    title: 'Learn Smarter',
    description: 'AI-powered study tools that adapt to your learning style and help you master any subject faster.',
  },
  {
    icon: Brain,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics and personalized insights.',
  },
  {
    icon: Target,
    title: 'Achieve Goals',
    description: 'Set study goals and let our AI help you stay on track to achieve academic success.',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center p-4">
      <div className="mobile-container max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Skip button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip
            </button>
          </div>

          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {step.title}
          </h1>
          <p className="text-gray-600 text-lg mb-12">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
