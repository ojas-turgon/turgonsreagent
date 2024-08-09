import * as React from 'react';
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
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { FirstAid as ShoppingCartSimpleIcon } from '@phosphor-icons/react/dist/ssr/FirstAid';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Radical as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/Radical';
import { Timer as TimerIcon } from '@phosphor-icons/react/dist/ssr/Timer';

import { config } from '@/config';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';
import { EventsTimeline } from '@/components/dashboard/order/events-timeline';
import { LineItemsTable } from '@/components/dashboard/order/line-items-table';

export const metadata = { title: `Details | Orders | Dashboard | ${config.site.name}` };

const lineItems = [
  {
    id: 'LI-001',
    product: 'Erbology Aloe Vera',
    image: '/assets/product-1.png',
    quantity: 1,
    currency: 'USD',
    unitAmount: 24,
    totalAmount: 24,
  },
  {
    id: 'LI-002',
    product: 'Lancome Rouge',
    image: '/assets/product-2.png',
    quantity: 1,
    currency: 'USD',
    unitAmount: 35,
    totalAmount: 35,
  },
];

const events = [
  {
    id: 'EV-004',
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    type: 'note_added',
    author: { name: 'Fran Perez', avatar: '/assets/avatar-5.png' },
    note: 'Customer states that the products have been damaged by the courier.',
  },
  {
    id: 'EV-003',
    createdAt: dayjs().subtract(12, 'hour').toDate(),
    type: 'shipment_notice',
    description: 'Left the package in front of the door',
  },
  {
    id: 'EV-002',
    createdAt: dayjs().subtract(18, 'hour').toDate(),
    type: 'items_shipped',
    carrier: 'USPS',
    trackingNumber: '940011189',
  },
  { id: 'EV-001', createdAt: dayjs().subtract(21, 'hour').toDate(), type: 'order_created' },
];

export default function Page({ params }) {
  const { orderId } = params;

  return (
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
              <Typography variant="h5">ORD-001</Typography>
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
                      <CreditCardIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Root Cause Analysis"
                />
                <CardContent>
                  <Card sx={{ borderRadius: 1 }} variant="outlined">
                    <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '12px 24px' }}>
                      {[
                        { key: 'Problem Statement', value: <Link variant="subtitle2">Miron Vitold</Link> },
                        {
                          key: 'Symptoms',
                          value: (
                            <Typography variant="subtitle2">
                              1721 Bartlett Avenue
                              <br />
                              Southfield, Michigan, United States
                              <br />
                              48034
                            </Typography>
                          ),
                        },
                        {
                          key: 'Potential Root Causes',
                          value: dayjs().subtract(3, 'hour').format('MMMM D, YYYY hh:mm A'),
                        },
                      ].map((item) => (
                        <PropertyItem key={item.key} name={item.key} value={item.value} />
                      ))}
                    </PropertyList>
                  </Card>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar>
                      <ShoppingCartSimpleIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Remediation"
                />
                <CardContent></CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid md={6} xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    <TimerIcon fontSize="var(--Icon-fontSize)" />
                  </Avatar>
                }
                title="Logs"
              />
              <CardContent></CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
