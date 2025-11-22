import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import InfoScreen from './pages/InfoScreen';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import CourseChat from './pages/CourseChat';
import CourseDetails from './pages/CourseDetails';
import SummaryResources from './pages/SummaryResources';
import Quiz from './pages/Quiz';
import WeekTopic from './pages/WeekTopic';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/info" element={<InfoScreen />} />
        
        {/* Protected routes with bottom navigation */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Course sub-screens (without bottom navigation) */}
        <Route path="/course/chat" element={<CourseChat />} />
        <Route path="/course/details" element={<CourseDetails />} />
        <Route path="/course/summary" element={<SummaryResources />} />
        <Route path="/course/quiz" element={<Quiz />} />
        <Route path="/course/week/:id" element={<WeekTopic />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
