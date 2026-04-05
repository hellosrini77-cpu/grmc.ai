import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = getFirestore();

export const config = { api: { bodyParser: false } };

async function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const session = event.data.object;
  const uid = session?.metadata?.uid || session?.subscription?.metadata?.uid;

  if (!uid) return res.status(200).json({ received: true });

  const subRef = db.collection('subscriptions').doc(uid);

  switch (event.type) {
    case 'checkout.session.completed':
      await subRef.set({
        status: 'active',
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        createdAt: new Date().toISOString()
      }, { merge: true });
      break;

    case 'customer.subscription.updated':
      await subRef.set({
        status: session.status,
        currentPeriodEnd: new Date(session.current_period_end * 1000).toISOString()
      }, { merge: true });
      break;

    case 'customer.subscription.deleted':
      await subRef.set({ status: 'cancelled' }, { merge: true });
      break;
  }

  return res.status(200).json({ received: true });
}
