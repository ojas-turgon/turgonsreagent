import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react';

const creatingNotificationOverlay = (
  <>
    <CircularProgress color="inherit" sx={{ marginRight: 2 }} />
    <Typography variant="body1">Creating Notification ...</Typography>
  </>
);

const doneCreatingNotificationOverlay = (
  <>
    <CheckCircleIcon color="green" sx={{ marginRight: 2, fontSize: 64 }} />
    <Typography variant="body1">Notification Created!</Typography>
  </>
);

const NotificationDialog = ({ open, handleClose }) => {
  const [creatingNotification, setCreatingNotification] = useState(false);
  const [doneCreatingNotification, setDoneCreatingNotification] = useState(false);
  const handleCreateNotification = () => {
    setCreatingNotification(true);
    setTimeout(() => {
      setCreatingNotification(false);
      setDoneCreatingNotification(true);
      setTimeout(() => {
        setDoneCreatingNotification(false);
        handleClose();
      }, 2000);
    }, 2000);
  };

  return (
    <Box
      sx={{
        mt: 2,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-out',
        maxHeight: open ? '1000px' : '0px',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Notification Config
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Notify me if:
      </Typography>
      <FormGroup>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <FormControlLabel control={<Checkbox />} label="Status is Changed" />
          <FormControlLabel control={<Checkbox />} label="Order is Cancelled" />
          <FormControlLabel control={<Checkbox />} label="Order is Delayed" />
        </Box>
        <TextField
          fullWidth
          placeholder="Or, add custom notification conditions..."
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </FormGroup>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateNotification}>
        Create Notification
      </Button>
      {creatingNotification && creatingNotificationOverlay}
      {doneCreatingNotification && doneCreatingNotificationOverlay}
    </Box>
  );
};

export default NotificationDialog;
