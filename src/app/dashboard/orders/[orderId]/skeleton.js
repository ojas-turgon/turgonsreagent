import React from 'react'; // Add this line

import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function page() {
  return (
    <Stack spacing={1} sx={{ width: '80%' }}>
      <LinearProgress />

      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
  );
}
