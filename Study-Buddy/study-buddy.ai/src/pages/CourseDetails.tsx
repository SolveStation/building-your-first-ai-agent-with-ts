import { useState } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'materials' | 'outline' | 'schedule' | 'chat';

const materials = [
  {
    id: 1,
    title: 'Chapter 1: Foundations of Psychology',
    type: 'PDF',
  },
  {
    id: 2,
    title: 'Lecture Notes: Cognitive Processes',
    type: 'PDF',
  },
  {
    id: 3,
    title: 'Research Article: Memory and Learning',
    type: 'PDF',
  },
];

export default function CourseDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('materials');

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
            <h1 className="text-xl font-bold text-gray-900">Course Details</h1>
          </div>
        </div>
      </div>

      <div className="mobile-container">
        {/* Course Title */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-gray-900">Introduction to Psychology</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === 'materials'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Materials
            {activeTab === 'materials' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === 'outline'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Outline
            {activeTab === 'outline' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === 'schedule'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Schedule
            {activeTab === 'schedule' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === 'chat'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Chat
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Materials Tab Content */}
        {activeTab === 'materials' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Uploaded Materials</h3>
            <div className="space-y-3 mb-8">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{material.title}</h4>
                    <p className="text-sm text-gray-500">{material.type}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/course/summary')}
                className="btn-primary w-full"
              >
                Trigger Session Resources
              </button>
              <button 
                onClick={() => navigate('/course/chat')}
                className="btn-secondary w-full"
              >
                Chat about this Course
              </button>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'outline' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Outline content coming soon</p>
          </div>
        )}
        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Schedule content coming soon</p>
          </div>
        )}
        {activeTab === 'chat' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chat content coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
