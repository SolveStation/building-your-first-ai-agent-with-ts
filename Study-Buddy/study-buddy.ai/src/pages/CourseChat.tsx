import { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  name?: string;
}

export default function CourseChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi there! How can I help you with Calculus 101 today?',
      sender: 'ai',
      name: 'StudyBuddy AI',
    },
    {
      id: 2,
      text: 'Can you help me understand derivatives?',
      sender: 'user',
      name: 'Ethan',
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement message sending
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mobile-container flex items-center justify-center relative py-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Calculus 101</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 mobile-container py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {msg.sender === 'ai' ? (
                <div className="w-full h-full bg-orange/20 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`flex-1 max-w-[75%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
              {msg.sender === 'ai' && (
                <p className="text-xs text-gray-500 mb-1">{msg.name}</p>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <p className="text-xs text-gray-500 mt-1 text-right">{msg.name}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="mobile-container py-4">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Tabs */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-900 hover:bg-gray-200 transition-colors">
              Course
            </button>
            <button className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-900 hover:bg-gray-200 transition-colors">
              Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
