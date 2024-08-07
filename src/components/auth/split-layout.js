import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function SplitLayout({ children }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 800px' }, minHeight: '100vh' }}>
      <Box
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--mui-palette-background-level1)',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          p: 3,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: '700px' }}>
          <Stack alignItems="center" spacing={2}>
            <Box
              component="img"
              src="/assets/turgonlogo.png"
              alt="Turgon AI Logo"
              sx={{
                width: '200px',
                height: 'auto',
                maxWidth: '100%'
              }}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h4">Welcome to Turgon AI SRE Agent for Workato</Typography>
            <Typography color="text.secondary">
              This autonomous AI agent is designed to help you manage your Workato integrations. It continuously
              monitors your workato logs, processes them into human readable format and suggests remediation steps.
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ boxShadow: 'var(--mui-shadows-8)', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: '420px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
