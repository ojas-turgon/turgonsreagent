'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SGH_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SGH_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default function Page() {
  const [ordercounts, setOrderCounts] = useState({
    newOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
    delayedOrders: 0,
  });
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchOrderCounts = async () => {
      if (!supabaseUrl || !supabaseKey) {
        return;
      }
      //   const { data: allOrders, error: allOrdersError } = await supabaseClient.from('orders').select('*');
      //   if (allOrdersError) {
      //     console.error('Error fetching all orders:', allOrdersError);
      //     return;
      //   }
      //   console.log('All Orders:', allOrders);
      const { data: newOrders } = await supabaseClient
        .from('orders')
        .select('Status', { count: 'exact' })
        .eq('Status', 'New');
      const { data: shippedOrders } = await supabaseClient
        .from('orders')
        .select('Status', { count: 'exact' })
        .eq('Status', 'Shipped');
      const { data: cancelledOrders } = await supabaseClient
        .from('orders')
        .select('Status', { count: 'exact' })
        .eq('Status', 'Cancelled');
      const { data: delayedOrders } = await supabaseClient
        .from('orders')
        .select('Status', { count: 'exact' })
        .eq('Status', 'Delayed');
      //   console.log(newOrders, shippedOrders, cancelledOrders, delayedOrders);
      //   console.log(newOrders.length, shippedOrders.length, cancelledOrders.length, delayedOrders.length);
      setOrderCounts({
        newOrders: newOrders.length,
        shippedOrders: shippedOrders.length,
        cancelledOrders: cancelledOrders.length,
        delayedOrders: delayedOrders.length,
      });
    };
    const fetchNotifications = async () => {
      const { data: notifications } = await supabaseClient.from('notifications').select('*');
      setNotifications(notifications);
    };
    fetchOrderCounts();
    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom sx={{ marginBottom: 3, marginTop: 3 }}>
        Good Morning, Ankur!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          marginBottom: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="How can I help you ?"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" sx={{ marginLeft: 1 }}>
          Go
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Daily Briefing
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 2 }}>
                There are <Chip label={`${ordercounts.newOrders} New Orders`} color="success" />{' '}
                <Chip label={`${ordercounts.shippedOrders} Orders Shipped`} color="success" />{' '}
                <Chip label={`${ordercounts.delayedOrders} Delays`} color="warning" />{' '}
                <Chip label={`${ordercounts.cancelledOrders} Cancelled Orders`} color="error" /> since your last log in.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ marginTop: 5 }}>
                <Link href="/dashboard/sgh/orders?status=New" passHref>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: '#f1f1f7',
                      backgroundSize: 'cover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100,
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '80%',
                        marginTop: 2,
                      }}
                    >
                      <Button variant="contained" color="primary">
                        View Cancelled Orders
                      </Button>
                    </Box>
                  </Box>
                </Link>
                <Link href="/dashboard/sgh/orders?status=Delayed" passHref>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: 'lightyellow',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100,
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '80%',
                        marginTop: 2,
                      }}
                    >
                      <Button variant="contained" color="primary">
                        View Delayed Orders
                      </Button>
                    </Box>
                  </Box>
                </Link>
                <Link href="/dashboard/sgh/orders?status=Shipped" passHref>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: 'lightgreen',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100,
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '80%',
                        marginTop: 2,
                      }}
                    >
                      <Button variant="contained" color="primary">
                        View Shipped Orders
                      </Button>
                    </Box>
                  </Box>
                </Link>
              </Stack>
            </Card>
            <Link href="/dashboard/sgh/orders/poupload">
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                  cursor: 'pointer',
                }}
              >
                <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                  Process New Order
                </Typography>

                <Box
                  sx={{
                    backgroundColor: '#d3d3d3',
                    border: '1px dashed black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 1,
                    padding: 2,
                    width: '80%',
                    height: '80%',
                  }}
                >
                  <UploadIcon size={128} />
                </Box>
              </Card>
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Notifications
            </Typography>
            {notifications.map((notification) => (
              <Card sx={{ padding: 3, backgroundColor: '#f1f1f1', marginBottom: 2, marginTop: 2 }}>
                <Typography variant="h6" component="h3">
                  {notification.text}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(notification.timestamp).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton>
                    <CheckIcon />
                  </IconButton>
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
