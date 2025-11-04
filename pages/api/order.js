// pages/api/order.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { product_id, customer_name, customer_email, quantity = 1, note } = req.body;

  const { data, error } = await supabase
    .from('orders')
    .insert([{ product_id, customer_name, customer_email, quantity, note }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.redirect('/?ordered=1');
}
