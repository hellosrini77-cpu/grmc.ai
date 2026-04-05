import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Success() {
  const { currentUser, checkSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function refresh() {
      if (currentUser) {
        // Wait a moment for webhook to process
        await new Promise(r => setTimeout(r, 3000));
        await checkSubscription(currentUser.uid);
        navigate('/');
      }
    }
    refresh();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-green-400 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400">Setting up your account, redirecting you now...</p>
      </div>
    </div>
  );
}
