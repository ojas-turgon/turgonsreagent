'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { FirstAid as ShoppingCartSimpleIcon } from '@phosphor-icons/react/dist/ssr/FirstAid';
import { Headset as HeadsetIcon } from '@phosphor-icons/react/dist/ssr/Headset';
import { Notepad as TimerIcon } from '@phosphor-icons/react/dist/ssr/Notepad';
import { Radical as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/Radical';
import { createClient } from '@supabase/supabase-js';

import { paths } from '@/paths';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';

import Skeleton from './skeleton';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// export const metadata = { title: `Details | Orders | Dashboard | ${config.site.name}` };

async function getRCA(data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_SERVER}/getWorkaktoRCA?id=${data.data.id}`, {
    method: 'GET',
  });
  const rcaData = await response.json();
  return rcaData;
}
export default function Page({ params }) {
  const { orderId } = params;

  const [order, setOrder] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    supabaseClient
      .from('workatosre')
      .select('*')
      .eq('id', orderId)
      .single()
      .then((data) => {
        setOrder(data.data);
        if (!data.data.rca) {
          getRCA(data).then((rcaData) => {
            // eslint-disable-next-line no-console -- Debugging purpose
            console.error('Got RCA:', rcaData);
            data.data.rca = rcaData.root_cause;
            data.data.rcaproblem = rcaData.problem_statement;
            data.data.rcasymptom = rcaData.symptoms;
            data.data.remediation = rcaData.remediation;
            data.data.category = rcaData.category;
            data.data.priority = rcaData.priority;
            setOrder(data.data);
          });
        }
      });
  }, [orderId]);
  setTimeout(() => setShowSkeleton(false), 2000);

  return (
    <>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.overview}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              Back to Dashboard
            </Link>
          </div>
          <div>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {order && order.issueid}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={order && order.status} color="primary" />
                  <Chip label={order && order.recipe} color="warning" />
                  <Chip label={order && order.category} color="success" />
                </Stack>
              </Box>
              <div>
                <Button endIcon={<CaretDownIcon />} variant="contained">
                  Action
                </Button>
              </div>
            </Stack>
          </div>

          <Grid container spacing={4}>
            <Grid md={6} xs={12}>
              <Stack spacing={4}>
                <Card>
                  <CardHeader
                    // action={
                    //   // <Button color="secondary" startIcon={<PencilSimpleIcon />}>
                    //   //   Edit
                    //   // </Button>
                    // }
                    avatar={
                      <Avatar>
                        <CreditCardIcon
                          fontSize="var(--Icon-fontSize)"
                          // color="var(--mui-palette-primary-main)"
                          weight="bold"
                        />
                      </Avatar>
                    }
                    title="Root Cause Analysis"
                  />
                  <CardContent>
                    {showSkeleton && <Skeleton />}
                    {!showSkeleton && (
                      <Card sx={{ borderRadius: 1 }} variant="outlined">
                        <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '12px 24px' }}>
                          {[
                            {
                              key: 'Problem Statement',
                              value: <Typography variant="subtitle2">{order && order.rcaproblem}</Typography>,
                            },
                            {
                              key: 'Symptoms',
                              value: <Typography variant="subtitle2">{order && order.rcasymptom}</Typography>,
                            },
                            {
                              key: 'Potential Root Causes',
                              value: <Typography variant="subtitle2">{order && order.rca}</Typography>,
                            },
                          ].map((item) => (
                            <PropertyItem key={item.key} name={item.key} value={item.value} />
                          ))}
                        </PropertyList>
                      </Card>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar>
                        <ShoppingCartSimpleIcon
                          fontSize="var(--Icon-fontSize)"
                          // color="var(--mui-palette-primary-main)"
                          weight="bold"
                        />
                      </Avatar>
                    }
                    title="Remediation"
                  />
                  <CardContent>
                    {showSkeleton && <Skeleton />}
                    {!showSkeleton && (
                      <Typography variant="subtitle2" style={{ whiteSpace: 'pre-line' }}>
                        {order && order.remediation}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid md={6} xs={12}>
              <Stack spacing={4}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar>
                        <TimerIcon
                          fontSize="var(--Icon-fontSize)"
                          // color="var(--mui-palette-primary-main)"
                          weight="bold"
                        />
                      </Avatar>
                    }
                    title="Logs"
                  />
                  <CardContent>
                    {order && (
                      <Box sx={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '400px' }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {JSON.stringify(order.errormsg, null, 2)}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <Card sx={{ minHeight: '600px' }}>
                  <CardHeader
                    avatar={
                      <Avatar>
                        <HeadsetIcon
                          fontSize="var(--Icon-fontSize)"
                          // color="var(--mui-palette-primary-main)"
                          weight="bold"
                        />
                      </Avatar>
                    }
                    title="Chat with Turgon AI SRE Agent"
                  />
                  <CardContent>
                    {order && (
                      <Box sx={{ overflowX: 'hidden', overflowY: 'auto', minHeight: '600px', maxHeight: '800px' }}>
                        {/* Warning: The following code contains unsafe elements and should not be used in production */}
                        {/* Embedding external content via iframes and injecting scripts can pose security risks */}

                        <div
                          style={{ minHeight: '600px' }}
                          dangerouslySetInnerHTML={{
                            __html: `
    <!-- Embed this line anywhere in your website to add the chatbot -->
    <iframe
      id="TurgonChatBot" 
      src="http://localhost:3001/cschat?id=${orderId}" 
      scrolling="yes"
      style="width: 100%; height: 600px;
             border: 0; background-color: transparent; overflow: scroll;"
    ></iframe>

    <script>
      const iframe = document.getElementById("TurgonChatBot");
      window.addEventListener("message", (event) => {
        const type = event.data.type;
        if (type === "resize") {
          iframe.style.height = event.data.h;
          iframe.style.width = event.data.w;
          iframe.style.minHeight = event.data.mh;
          iframe.style.minWidth = event.data.mw;
        }
      });
    </script>
  `,
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
