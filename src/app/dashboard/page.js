'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react/dist/ssr/ListChecks';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';
import { createClient } from '@supabase/supabase-js';

import { OrderModal } from '@/components/dashboard/order/order-modal';
import { OrdersFilters } from '@/components/dashboard/order/orders-filters';
import { OrdersPagination } from '@/components/dashboard/order/orders-pagination';
import { OrdersSelectionProvider } from '@/components/dashboard/order/orders-selection-context';
import { OrdersTable } from '@/components/dashboard/order/orders-table';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { Summary } from '@/components/dashboard/overview/summary';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` };
// const orders = [
//   {
//     createdAt: dayjs().subtract(3, 'hour').toDate(),
//     id: 'ORD-005',
//     category: 'validation',
//     recipe: 'SAP-SFDC-04',
//     status: 'pending',
//     priority: 'P0',
//   },
//   {
//     createdAt: dayjs().subtract(3, 'hour').toDate(),
//     id: 'ORD-004',
//     category: 'validation',
//     recipe: 'SAP-SFDC-04',
//     status: 'completed',
//     priority: 'P1',
//     description: 'This is a test description',
//   },
//   {
//     createdAt: dayjs().subtract(3, 'hour').toDate(),
//     id: 'ORD-003',
//     category: 'validation',
//     recipe: 'SAP-SFDC-04',
//     status: 'canceled',
//     priority: 'P2',
//   },
//   {
//     createdAt: dayjs().subtract(3, 'hour').toDate(),
//     id: 'ORD-002',
//     category: 'validation',
//     recipe: 'SAP-SFDC-04',
//     status: 'rejected',
//     priority: 'P3',
//   },
//   {
//     createdAt: dayjs().subtract(3, 'hour').toDate(),
//     id: 'ORD-001',
//     category: 'validation',
//     recipe: 'SAP-SFDC-04',
//     status: 'completed',
//     priority: 'P4',
//   },
// ];
export default function Page({ searchParams }) {
  const { customer, id, previewId, sortDir, status } = searchParams;
  const [issues, setIssues] = useState([]);

  // const sortedOrders = applySort(issues, sortDir);
  const filteredOrders = applyFilters(issues, { customer, id, status });

  useEffect(() => {
    const getIssues = async () => {
      try {
        const { data: fetchedIssues, error } = await supabaseClient.from('workatosre').select('*').order('id', { ascending: true });

        if (error) {
          // eslint-disable-next-line no-console -- Debugging purpose
          console.error('Error fetching issues:', error);
          return;
        }

        setIssues(fetchedIssues);
      } catch (error) {
        // eslint-disable-next-line no-console -- Debugging purpose
        console.error('Error fetching issues:', error);
      }
    };

    getIssues();
  }, []);

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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Overview</Typography>
          </Box>
          {/* <div>
            <Button startIcon={<PlusIcon />} variant="contained">
              Dashboard
            </Button>
          </div> */}
        </Stack>
        <Grid container spacing={4}>
          <Grid md={4} xs={12}>
            <Summary amount={106} diff={15} icon={ListChecksIcon} title="Recipies" trend="up" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={94} diff={28} icon={UsersIcon} title="Open Issues" trend="down" amount_subtitle="condensed from 100K+ logs" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={23} diff={52} icon={WarningIcon} title="Critical Issues" trend="down" />
          </Grid>
          <Grid md={12} xs={12}>
            <AppUsage
              data={[
                { name: 'W1May24', v1: 86, v2: 180 },
                { name: 'W2May24', v1: 84, v2: 165},
                { name: 'W3May24', v1: 78, v2: 143},
                { name: 'W4May24', v1: 72, v2: 132 },
                { name: 'W1Jun24', v1: 63, v2: 122 },
                { name: 'W2Jun24', v1: 58, v2: 112 },
                { name: 'W3Jun24', v1: 54, v2: 94 },
                { name: 'W4Jun24', v1: 48, v2: 84 },
                { name: 'W1Jul24', v1: 42, v2: 84 },
                { name: 'W2Jul24', v1: 36, v2: 82 },
                { name: 'W3Jul24', v1: 27, v2: 75 },
                { name: 'W4Jul24', v1: 23, v2: 69 },
              ]}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            maxWidth: 'var(--Content-maxWidth)',
            m: 'var(--Content-margin)',
            p: 'var(--Content-padding)',
            width: 'var(--Content-width)',
          }}
        >
          <Stack spacing={4}>
            <OrdersSelectionProvider orders={filteredOrders}>
              <Card>
                <OrdersFilters filters={{ customer, id, status }} sortDir={sortDir} />
                <Divider />
                <Box sx={{ overflowX: 'auto' }}>
                  <OrdersTable rows={filteredOrders} />
                </Box>
                <Divider />
                <OrdersPagination count={filteredOrders.length} page={0} />
              </Card>
            </OrdersSelectionProvider>
          </Stack>
        </Box>
        <OrderModal open={Boolean(previewId)} />
      </Stack>
    </Box>
  );
}

// Sorting and filtering has to be done on the server.

// function applySort(row, sortDir) {
//   return row.sort((a, b) => {
//     // Convert Supabase timestamptz to JavaScript Date object
//     const dateA = new Date(a.createdAt);
//     const dateB = new Date(b.createdAt);
//     if (sortDir === 'asc') {
//       return dateA.getTime() - dateB.getTime();
//     }

//     return dateB.getTime() - dateA.getTime();
//   });
// }

function applyFilters(row, { customer, id, status }) {
  return row.filter((item) => {
    if (customer) {
      if (!item.priority?.toLowerCase().includes(customer.toLowerCase())) {
        return false;
      }
    }

    if (id) {
      if (item.id !== id) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    return true;
  });
}
