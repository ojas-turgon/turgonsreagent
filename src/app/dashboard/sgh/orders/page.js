'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
        const { data: ordersList, error } = await supabaseClient.from('orders').select('*').eq('Status', status);
        if (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
          return;
        }
        setOrders(ordersList || []);
      } else {
        const { data: ordersList, error } = await supabaseClient.from('orders').select('*');
        if (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
          return;
        }
        setOrders(ordersList || []);
      }
    };
    fetchOrders();
  }, [status]);

  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
        background: 'linear-gradient(to bottom, #9FB1DA, #DDB7D2)',
        minHeight: '100vh', // This sets the minimum height to the full viewport height
      }}
    >
      <Link href="/dashboard/sgh" passHref>
        <Typography
          component="a"
          variant="body1"
          sx={{
            color: 'black',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
            marginLeft: '20px',
            marginTop: '20px',
          }}
        >
          &lt; Back to Dashboard
        </Typography>
      </Link>

      <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: '20px', marginLeft: '20%' }}>
        I have found {orders.length} {status ? status.toLowerCase() : ''} orders:
      </Typography>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Stack>
  );
}
