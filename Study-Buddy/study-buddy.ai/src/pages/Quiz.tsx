import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quizData = {
  totalQuestions: 5,
  currentQuestion: 1,
  question: 'What is the main function of the cell membrane?',
  image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop',
  options: [
    { id: 1, text: 'To control what enters and exits the cell', correct: true },
    { id: 2, text: 'To produce energy for the cell', correct: false },
    { id: 3, text: 'To store genetic material', correct: false },
    { id: 4, text: 'To synthesize proteins', correct: false },
  ],
};

export default function Quiz() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const progress = (quizData.currentQuestion / quizData.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mobile-container">
          <div className="flex items-center justify-center relative py-4">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Quiz</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 mobile-container py-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {quizData.currentQuestion} of {quizData.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Image */}
        <div className="mb-6">
          <div className="w-full h-48 bg-gradient-to-br from-teal to-sage rounded-2xl overflow-hidden">
            <img
              src={quizData.image}
              alt="Question"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {quizData.question}
          </h2>
          <p className="text-sm text-gray-500">Select the best answer.</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {quizData.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedAnswer(option.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                selectedAnswer === option.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedAnswer === option.id
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium text-gray-900">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Check Answer Button */}
        <button
          disabled={selectedAnswer === null}
          className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
            selectedAnswer !== null
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
      </div>
    </div>
  );
}
