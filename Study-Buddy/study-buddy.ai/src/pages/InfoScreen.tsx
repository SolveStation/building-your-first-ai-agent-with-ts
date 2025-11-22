import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Target, Clock } from 'lucide-react';

const educationLevels = [
  'High School',
  'Undergraduate',
  'Graduate',
  'Professional',
  'Self-Learning',
];

const studyGoals = [
  'Exam Preparation',
  'Skill Development',
  'Career Advancement',
  'Personal Growth',
  'Academic Excellence',
];

const studyTimes = [
  '15-30 minutes/day',
  '30-60 minutes/day',
  '1-2 hours/day',
  '2+ hours/day',
];

export default function InfoScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    educationLevel: '',
    studyGoal: '',
    studyTime: '',
  });
  const navigate = useNavigate();

  const handleSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // TODO: Save user preferences
      navigate('/home');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepComplete = () => {
    if (step === 1) return formData.educationLevel !== '';
    if (step === 2) return formData.studyGoal !== '';
    if (step === 3) return formData.studyTime !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="mobile-container max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {step} of 3
              </span>
              <span className="text-sm font-medium text-primary-600">
                {Math.round((step / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Education Level */}
          {step === 1 && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                What's your education level?
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Help us personalize your learning experience
              </p>
              <div className="space-y-3">
                {educationLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSelect('educationLevel', level)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium ${
                      formData.educationLevel === level
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Study Goal */}
          {step === 2 && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                What's your main goal?
              </h2>
              <p className="text-gray-600 text-center mb-8">
                We'll tailor content to help you achieve it
              </p>
              <div className="space-y-3">
                {studyGoals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleSelect('studyGoal', goal)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium ${
                      formData.studyGoal === goal
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Study Time */}
          {step === 3 && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                How much time can you dedicate?
              </h2>
              <p className="text-gray-600 text-center mb-8">
                We'll create a study plan that fits your schedule
              </p>
              <div className="space-y-3">
                {studyTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleSelect('studyTime', time)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium ${
                      formData.studyTime === time
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button onClick={handleBack} className="btn-secondary flex-1">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`flex-1 ${
                isStepComplete()
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
