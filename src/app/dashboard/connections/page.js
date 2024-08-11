import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';

export const metadata = { title: `Blank | Dashboard | ${config.site.name}` };

export default function Page() {
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
            <Typography variant="h4">Connections</Typography>
          </Box>
          <div>
            <Button startIcon={<PlusIcon />} variant="contained">
              Add
            </Button>
          </div>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ width: '30%', textAlign: 'center' }}>
            <img src="/assets/workato.png" alt="Connection 1" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <Box sx={{ width: '30%', textAlign: 'center' }}>
            <img src="/assets/slack.png" alt="Connection 2" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <Box sx={{ width: '30%', textAlign: 'center' }}>
            <img src="/assets/teams.jpg" alt="Connection 3" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
