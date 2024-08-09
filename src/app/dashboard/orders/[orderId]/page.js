import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { FirstAid as ShoppingCartSimpleIcon } from '@phosphor-icons/react/dist/ssr/FirstAid';
import { Radical as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/Radical';
import { Timer as TimerIcon } from '@phosphor-icons/react/dist/ssr/Timer';

import { config } from '@/config';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';

export const metadata = { title: `Details | Orders | Dashboard | ${config.site.name}` };

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
              <Typography variant="h5">ORD-001 ({orderId})</Typography>
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
