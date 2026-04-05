import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import MainApp, { AnalyzeTool } from './MainApp';
import Blog from './Blog';
import Post1 from './Post1';
import Post2 from './Post2';
import Post3 from './Post3';
import Post4 from './Post4';
import Post5 from './Post5';
import Post6 from './Post6';
import Post7 from './Post7';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />

          {/* Blog routes - public */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/compliance-consulting-cost-myth" element={<Post7 />} />
          <Route path="/blog/grmc-ai-ranks-number-1-compliance-visibility" element={<Post1 />} />
          <Route path="/blog/gdpr-article-28-checklist-vendor-contracts" element={<Post2 />} />
          <Route path="/blog/why-clms-fall-short-compliance" element={<Post3 />} />
          <Route path="/blog/gdpr-contract-compliance-gaps" element={<Post4 />} />
          <Route path="/blog/soc2-audit-contract-compliance" element={<Post5 />} />
          <Route path="/blog/ai-contract-analysis-beyond-hype" element={<Post6 />} />

          {/* Protected main app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AnalyzeTool />
              </ProtectedRoute>
            }
          />

          {/* Public landing page */}
          <Route path="/" element={<MainApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
