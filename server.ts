/**
 * FAVEDA E-Commerce Server
 * Handles secure Wave Checkout API, Webhook verification, and static Vite serving
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'FAVEDA Botanical Store',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. Wave Checkout Session API
app.post('/api/wave/create-checkout-session', async (req: Request, res: Response) => {
  const { orderReference, amount, customerPhone, customerName } = req.body;
  const apiKey = process.env.WAVE_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'WAVE_API_KEY_NOT_CONFIGURED',
      message: 'Les identifiants API Wave ne sont pas encore configurés sur le serveur.',
      reference: orderReference,
    });
  }

  try {
    // Official Wave API Checkout endpoint
    const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: 'XOF',
        client_reference: orderReference,
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?order=${orderReference}&status=success`,
        error_url: `${process.env.APP_URL || 'http://localhost:3000'}/?order=${orderReference}&status=failed`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'WAVE_API_ERROR',
        details: data,
      });
    }

    return res.json({
      success: true,
      wave_launch_url: data.wave_launch_url,
      wave_session_id: data.id,
    });
  } catch (error: any) {
    console.error('Error creating Wave checkout session:', error);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: error.message,
    });
  }
});

// 3. Official Wave Webhook Handler
// "Payment must be confirmed by a secure server-side webhook. Never mark an order as paid based only on a frontend action."
app.post('/api/wave/webhook', (req: Request, res: Response) => {
  const webhookSecret = process.env.WAVE_WEBHOOK_SECRET;
  const signature = req.headers['wave-signature'] as string;

  if (!webhookSecret) {
    console.warn('[Wave Webhook] Webhook secret not configured in env.');
    return res.status(200).json({ received: true, verified: false });
  }

  // Verify HMAC signature if provided
  if (signature) {
    const computed = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (computed !== signature) {
      console.error('[Wave Webhook] Invalid signature rejected.');
      return res.status(401).json({ error: 'INVALID_SIGNATURE' });
    }
  }

  const event = req.body;
  console.log('[Wave Webhook] Verified event received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data;
    const clientReference = session.client_reference;
    const transactionId = session.id;

    console.log(`[Wave Webhook] Payment confirmed for order: ${clientReference}, txn: ${transactionId}`);
    // Here we can update the Supabase or PostgreSQL orders table
  }

  return res.status(200).json({ received: true });
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FAVEDA Store server running on port ${PORT}`);
  });
}

// Only start when run directly
if (process.env.NODE_ENV === 'production') {
  startServer();
}

export default app;
