import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react/dist/ssr/ListChecks';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { OrderModal } from '@/components/dashboard/order/order-modal';
import { OrdersFilters } from '@/components/dashboard/order/orders-filters';
import { OrdersPagination } from '@/components/dashboard/order/orders-pagination';
import { OrdersSelectionProvider } from '@/components/dashboard/order/orders-selection-context';
import { OrdersTable } from '@/components/dashboard/order/orders-table';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { Summary } from '@/components/dashboard/overview/summary';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` };
const orders = [
  {
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    id: 'ORD-005',
    category: 'validation',
    recipe: 'SAP-SFDC-04',
    status: 'pending',
    priority: 'P0',
  },
  {
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    id: 'ORD-004',
    category: 'validation',
    recipe: 'SAP-SFDC-04',
    status: 'completed',
    priority: 'P1',
    description: 'This is a test description',
  },
  {
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    id: 'ORD-003',
    category: 'validation',
    recipe: 'SAP-SFDC-04',
    status: 'canceled',
    priority: 'P2',
  },
  {
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    id: 'ORD-002',
    category: 'validation',
    recipe: 'SAP-SFDC-04',
    status: 'rejected',
    priority: 'P3',
  },
  {
    createdAt: dayjs().subtract(3, 'hour').toDate(),
    id: 'ORD-001',
    category: 'validation',
    recipe: 'SAP-SFDC-04',
    status: 'completed',
    priority: 'P4',
  },
];
export default function Page({ searchParams }) {
  const { customer, id, previewId, sortDir, status } = searchParams;

  const sortedOrders = applySort(orders, sortDir);
  const filteredOrders = applyFilters(sortedOrders, { customer, id, status });

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
            <Summary amount={31} diff={15} icon={ListChecksIcon} title="Recipies" trend="up" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={240} diff={5} icon={UsersIcon} title="Open Issues" trend="down" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={21} diff={12} icon={WarningIcon} title="TBD" trend="up" />
          </Grid>
          <Grid md={12} xs={12}>
            <AppUsage
              data={[
                { name: 'W1May24', v1: 193, v2: 101 },
                { name: 'W2May24', v1: 189, v2: 91 },
                { name: 'W3May24', v1: 172, v2: 90 },
                { name: 'W4May24', v1: 168, v2: 80 },
                { name: 'W1Jun24', v1: 156, v2: 75 },
                { name: 'W2Jun24', v1: 139, v2: 73 },
                { name: 'W3Jun24', v1: 134, v2: 64 },
                { name: 'W4Jun24', v1: 117, v2: 62 },
                { name: 'W1Jul24', v1: 112, v2: 54 },
                { name: 'W2Jul24', v1: 96, v2: 51 },
                { name: 'W3Jul24', v1: 89, v2: 43 },
                { name: 'W4Jul24', v1: 77, v2: 37 },
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

function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function applyFilters(row, { customer, id, status }) {
  return row.filter((item) => {
    if (customer) {
      if (!item.customer?.name?.toLowerCase().includes(customer.toLowerCase())) {
        return false;
      }
    }

    if (id) {
      if (!item.id?.toLowerCase().includes(id.toLowerCase())) {
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
