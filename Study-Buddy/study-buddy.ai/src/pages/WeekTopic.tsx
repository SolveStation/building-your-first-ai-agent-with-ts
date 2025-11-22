import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WeekTopic() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mobile-container">
          <div className="flex items-center justify-center relative py-4">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Week 1 - Topic Intro</h1>
          </div>
        </div>
      </div>

      <div className="mobile-container">
        {/* Materials Section */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Materials</h2>

          {/* Empty State */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No materials yet
              </h3>
              <p className="text-gray-600">
                Generate materials to start studying.
              </p>
            </div>
            <button className="btn-secondary inline-flex items-center justify-center px-6">
              Generate Materials
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/course/chat')}
              className="btn-primary flex-1"
            >
              Open Chat
            </button>
            <button 
              onClick={() => navigate('/course/quiz')}
              className="btn-secondary flex-1"
            >
              Quiz Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
