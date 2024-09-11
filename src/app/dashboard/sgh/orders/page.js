'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { createClient } from '@supabase/supabase-js';

import OrderCard from './order';

const supabaseUrl = process.env.NEXT_PUBLIC_SGH_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SGH_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default function Page({ searchParams }) {
  const status = searchParams ? searchParams.status : null;
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!supabaseUrl || !supabaseKey) {
        return;
      }
      if (status) {
        const { data: ordersList } = await supabaseClient.from('orders').select('*').eq('Status', status);
        setOrders(ordersList);
      } else {
        const { data: ordersList } = await supabaseClient.from('orders').select('*');
        setOrders(ordersList);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%', background: 'linear-gradient(to bottom, #9FB1DA, #DDB7D2)' }}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Stack>
  );
}
