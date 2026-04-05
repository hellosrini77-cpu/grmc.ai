import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const { currentUser, isSubscribed } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!currentUser) {
      navigate('/signup');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentUser.uid, email: currentUser.email })
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const features = [
    '11 compliance frameworks analyzed',
    'GDPR, SOC 2, CCPA, HIPAA, ISO 27001',
    'SOX, CMMC, NIST 800-171, PCI DSS',
    'FedRAMP, NIST AI RMF',
    'Gap analysis with replacement clauses',
    'PDF contract upload',
    'Unlimited analyses',
    'Priority support'
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">GRMC.ai Pricing</h1>
          <p className="text-gray-400 mt-3">AI-powered contract compliance for legal and compliance teams</p>
        </div>

        <div className="bg-gray-900 border border-blue-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">Annual Plan</span>
            <div className="mt-4">
              <span className="text-5xl font-bold text-white">$99</span>
              <span className="text-gray-400 ml-2">/year</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">Less than $8.25/month. Cancel anytime.</p>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {isSubscribed ? (
            <button
              onClick={() => navigate('/')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              You're subscribed — Go to App
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Redirecting to checkout...' : 'Subscribe Now'}
            </button>
          )}

          <p className="text-center text-gray-500 text-xs mt-4">
            Secure payment via Stripe. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
