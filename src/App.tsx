import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Opportunities } from './pages/Opportunities';

// Stub components for remaining pages
const Analytics = () => (
  <div className="fade-in">
    <h1 className="text-3xl font-bold text-[#f8fafc]">Market Analytics</h1>
    <p className="mt-1 text-[#94a3b8]">Detailed market performance and predictive insights.</p>
    <div className="mt-12 flex flex-col items-center justify-center p-20 rounded-2xl border-2 border-dashed border-[#2e3244] bg-[#161821]/50">
      <p className="text-[#94a3b8]">Analytics visualization module currently under development.</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="fade-in">
    <h1 className="text-3xl font-bold text-[#f8fafc]">System Settings</h1>
    <p className="mt-1 text-[#94a3b8]">Manage your account, preferences, and security.</p>
    <div className="mt-8 grid grid-cols-1 gap-6 max-w-2xl">
      {['Profile Information', 'Notification Preferences', 'API Keys', 'Security & Authentication'].map((item) => (
        <div key={item} className="flex items-center justify-between p-6 rounded-2xl border border-[#2e3244] bg-[#161821] hover:bg-[#1e212d] transition-colors cursor-pointer">
          <span className="font-medium">{item}</span>
          <span className="text-[#94a3b8]">→</span>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
