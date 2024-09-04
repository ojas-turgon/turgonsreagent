'use client';

import * as React from 'react';
import RouterLink from 'next/link';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
// import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowCircleDownRight } from '@phosphor-icons/react/dist/ssr/ArrowCircleDownRight';
import { ArrowCircleUp } from '@phosphor-icons/react/dist/ssr/ArrowCircleUp';
import { ArrowCircleUpRight } from '@phosphor-icons/react/dist/ssr/ArrowCircleUpRight';
import { Briefcase as BriefcaseIcon } from '@phosphor-icons/react/dist/ssr/Briefcase';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Code as CodeIcon } from '@phosphor-icons/react/dist/ssr/Code';
import { TreePalm as TreePalmIcon } from '@phosphor-icons/react/dist/ssr/TreePalm';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { Repeat as RepeatIcon } from '@phosphor-icons/react/dist/ssr/Repeat';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';

import { useOrdersSelection } from './orders-selection-context';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider } from '@mui/material';


const columns = [
  {
    formatter: (row) => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-level1)',
            borderRadius: 1.5,
            flex: '0 0 auto',
            p: '4px 8px',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption">{dayjs(row.createdAt).format('MMM').toUpperCase()}</Typography>
          <Typography variant="h6">{dayjs(row.createdAt).format('D')}</Typography>
        </Box>
      </Stack>
    ),
    name: 'Date',
    width: '30px',
  },
  {
    formatter: (row) => {
      const [dialogOpen, setDialogOpen] = React.useState(false);
      return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.orders.details(row.id)}
              sx={{ cursor: 'pointer' }}
              variant="subtitle2"
            >
              {row.issueid}
            </Link>

            {/* <Typography color="text.secondary" variant="body2">
            {row.lineItems} products •{' '}
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.totalAmount)}
            </Box>
          </Typography> */}
          </div>{' '}
          <Chip icon={<RepeatIcon />} label={row.numoccur} color="error" />
          <Chip icon={<TreePalmIcon />} label={row.cascadingerrors ? row.cascadingerrors.split('\n').length : 0} color="success" onClick={() => setDialogOpen(true)} />
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Cascading Errors</DialogTitle>
            <DialogContent>
              <DialogContentText>
                These cascading errors followed the original error, and have a root cause that is this issue. Once we fix the orignal issue, these errors will automatically be fixed. They do not need independent remidiation.   They are therefore lumped together under this issue.
              </DialogContentText>
              <Divider sx={{ my: 2 }} />
              {/* Add content for cascading errors here */}
              <Typography variant="body1">
                {row.cascadingerrors.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          </Stack>
      );
    },
    name: 'Issue ID',
    width: '150px',
  },
  {
    formatter: (row) => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="subtitle2">{row.recipe}</Typography>        
      </Stack>
    ),
    name: 'Recipe',
    width: '100px',
  },
  {
    formatter: (row) => {
      const mapping = {
        'In Progress': {
          label: 'In Progress',
          icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
        },
        New: {
          label: 'New',
          icon: <MinusIcon color="var(--mui-palette-error-main)" weight="fill" />,
        },
        Fixed: { label: 'Fixed', icon: <CheckCircleIcon color="var(--mui-palette-success-main)" /> },
        Verified: {
          label: 'Verified',
          icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
        },
      };
      const { label, icon } = mapping[row.status] ?? { label: 'Unknown', icon: null };

      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Status',
    width: '100px',
  },
  {
    formatter: (row) => {
      const mapping = {
        Technical_Info: {
          label: 'Technical_Info',
          icon: <CodeIcon color="var(--mui-palette-warning-main)" weight="fill" />,
        },
        Technical_Critical: {
          label: 'Technical_Critical',
          icon: <CodeIcon color="var(--mui-palette-error-main)" weight="fill" />,
        },
        Bussiness_Info: { label: 'Bussiness_Info', icon: <BriefcaseIcon color="var(--mui-palette-warning-main)" /> },
        Bussiness_Critical: {
          label: 'Bussiness_Critical',
          icon: <BriefcaseIcon color="var(--mui-palette-error-main)" weight="fill" />,
        },
        Super_Admin: {
          label: 'Super_Admin',
          icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
        },
      };
      const { label, icon } = mapping[row.category] ?? { label: 'Unknown', icon: null };

      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Category',
    width: '100px',
  },
  {
    formatter: (row) => {
      const mapping = {
        P0: { label: 'P0', icon: <ArrowCircleUp color="var(--mui-palette-error-main)" weight="fill" /> },
        P1: {
          label: 'P1',
          icon: <ArrowCircleUpRight color="var(--mui-palette-error-main)" weight="fill" />,
        },
        P2: { label: 'P2', icon: <ArrowCircleDownRight color="var(--mui-palette-warning-main)" weight="fill" /> },
        P3: { label: 'P3', icon: <MinusIcon color="var(--mui-palette-success-main)" /> },
      };
      const { label, icon } = mapping[row.priority] ?? { label: 'Unknown', icon: null };

      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Priority',
    width: '100px',
    align: 'right',
  },
  {
    formatter: (row) => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="subtitle2">{row.description}</Typography>
      </Stack>
    ),
    name: 'Description',
    width: '300px',
  },
];

export function OrdersTable({ rows }) {
  const { selected, deselectAll, deselectOne, selectAll, selectOne } = useOrdersSelection();

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id);
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id);
        }}
        rows={rows}
        selectable
        selected={selected}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No orders found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
