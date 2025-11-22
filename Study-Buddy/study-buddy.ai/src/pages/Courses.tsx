import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const studyPlans = [
  {
    id: 1,
    title: 'Calculus II',
    subtitle: 'Next session: Chapter 3 Review',
    bgColor: 'bg-teal',
  },
  {
    id: 2,
    title: 'Organic Chemistry',
    subtitle: 'Progress: 60%',
    bgColor: 'bg-sage',
  },
  {
    id: 3,
    title: 'Linear Algebra',
    subtitle: 'Next session: Practice Exam',
    bgColor: 'bg-orange',
  },
];

export default function Courses() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Study Plans</h1>
          </div>
        </div>

        {/* Study Plans List */}
        <div className="space-y-6 mb-8">
          {studyPlans.map((plan) => (
            <div key={plan.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {plan.title}
                </h3>
                <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                <button 
                  onClick={() => navigate('/course/details')}
                  className="btn-outline flex items-center gap-2"
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className={`w-32 h-32 ${plan.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <div className="w-24 h-28 bg-white rounded-lg shadow-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Course Button */}
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Course
        </button>
      </div>
    </div>
  );
}
