import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Auth endpoints
app.post('/make-server-d3c2102d/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      created_at: new Date().toISOString(),
      settings: {
        theme: 'light',
        notifications: {
          portfolio: true,
          transactions: true,
          priceAlerts: false,
          aiInsights: true
        }
      }
    });

    return c.json({ user: data.user }, 201);
  } catch (error) {
    console.log('Signup server error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-d3c2102d/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Note: Sign in should be handled on the client side with supabase.auth.signInWithPassword
    // This endpoint is for validation or additional server-side logic if needed
    return c.json({ message: 'Use client-side auth for sign in' }, 200);
  } catch (error) {
    console.log('Signin server error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Portfolio endpoints
app.get('/make-server-d3c2102d/portfolio', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's portfolio data
    const portfolioData = await kv.get(`portfolio:${user.id}`) || {
      totalValue: 0,
      totalPnl: 0,
      totalPnlPct: 0,
      tokens: [],
      weeklyData: []
    };

    return c.json(portfolioData);
  } catch (error) {
    console.log('Portfolio fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-d3c2102d/portfolio', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolioData = await c.req.json();
    
    await kv.set(`portfolio:${user.id}`, {
      ...portfolioData,
      updated_at: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Portfolio update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Wallet endpoints
app.get('/make-server-d3c2102d/wallets', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const wallets = await kv.get(`wallets:${user.id}`) || [];
    return c.json(wallets);
  } catch (error) {
    console.log('Wallets fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-d3c2102d/wallets', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { wallet } = await c.req.json();
    
    const existingWallets = await kv.get(`wallets:${user.id}`) || [];
    const updatedWallets = [...existingWallets, {
      ...wallet,
      id: `${wallet.type}-${Date.now()}`,
      connected_at: new Date().toISOString()
    }];
    
    await kv.set(`wallets:${user.id}`, updatedWallets);

    return c.json({ wallet: updatedWallets[updatedWallets.length - 1] });
  } catch (error) {
    console.log('Wallet connect error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete('/make-server-d3c2102d/wallets/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const walletId = c.req.param('id');
    const existingWallets = await kv.get(`wallets:${user.id}`) || [];
    const updatedWallets = existingWallets.filter(w => w.id !== walletId);
    
    await kv.set(`wallets:${user.id}`, updatedWallets);

    return c.json({ success: true });
  } catch (error) {
    console.log('Wallet disconnect error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Transactions endpoints
app.get('/make-server-d3c2102d/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await kv.get(`transactions:${user.id}`) || [];
    return c.json(transactions);
  } catch (error) {
    console.log('Transactions fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-d3c2102d/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { transactions } = await c.req.json();
    
    await kv.set(`transactions:${user.id}`, transactions);

    return c.json({ success: true });
  } catch (error) {
    console.log('Transactions update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// AI Chat endpoints
app.get('/make-server-d3c2102d/ai/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const messages = await kv.get(`ai_messages:${user.id}`) || [{
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI portfolio assistant. I can help you analyze your holdings, identify trends, and suggest optimizations. What would you like to know about your portfolio?',
      timestamp: new Date().toISOString()
    }];

    return c.json(messages);
  } catch (error) {
    console.log('AI messages fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-d3c2102d/ai/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message } = await c.req.json();
    
    const existingMessages = await kv.get(`ai_messages:${user.id}`) || [];
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Generate AI response (simple mock for now)
    const aiResponses = [
      "Based on your portfolio analysis, I can see you have a well-diversified crypto portfolio. Your current allocation shows good risk management.",
      "Your top performers are showing strong momentum. Consider taking some profits if you're looking to rebalance your portfolio.",
      "I notice significant exposure to Ethereum ecosystem tokens. You might want to diversify into other Layer 1 blockchains for better risk distribution.",
      "Your current position shows some unrealized losses. This could be a good opportunity for dollar-cost averaging if you believe in long-term growth.",
      "For tax optimization, consider harvesting losses on underperforming assets. This strategy can help reduce your tax liability."
    ];

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...existingMessages, userMessage, aiMessage];
    
    await kv.set(`ai_messages:${user.id}`, updatedMessages);

    return c.json({ messages: updatedMessages });
  } catch (error) {
    console.log('AI message processing error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User settings endpoints
app.get('/make-server-d3c2102d/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-d3c2102d/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const existingProfile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-d3c2102d/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

serve(app.fetch);