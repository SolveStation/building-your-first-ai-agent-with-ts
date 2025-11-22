import {
  Zap,
} from 'lucide-react';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            StudyBuddy AI
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Hi, Awwal 👋
          </h2>
        </div>

        {/* Next Session Card */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Session</h3>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Math 101</p>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Chapter 3 Review</h4>
                <p className="text-sm text-gray-600">Today, 2:00 PM - 3:00 PM</p>
              </div>
              <div className="w-20 h-20 bg-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-16 h-16 bg-orange/30 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="btn-primary flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Start Session
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat with StudyBuddy
          </button>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 py-3 border-b border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">History 202: Essay Due</p>
                <p className="text-sm text-gray-500">Tomorrow</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3 border-b border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Science 101: Lab Report</p>
                <p className="text-sm text-gray-500">In 3 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">English 301: Presentation</p>
                <p className="text-sm text-gray-500">In 5 days</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
