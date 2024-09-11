import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { PaperPlaneRight as SendIcon } from '@phosphor-icons/react';

const LoadingOverlay = () => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      position: 'absolute',
    }}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

const EmailDialog = ({ open, handleClose, emailData, isLoading }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Draft Customer Email</DialogTitle>
      <DialogContent>
        {isLoading && <LoadingOverlay />}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TextField
            autoFocus
            margin="dense"
            id="to"
            label="To"
            type="email"
            variant="outlined"
            style={{ flex: 1, marginRight: '8px' }}
            value={emailData.to}
          />
          <TextField
            margin="dense"
            id="cc"
            label="CC"
            type="email"
            variant="outlined"
            style={{ flex: 1 }}
            value={emailData.cc}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TextField
            margin="dense"
            id="from"
            label="From"
            type="email"
            variant="outlined"
            style={{ flex: 1, marginRight: '8px' }}
            value={emailData.from}
          />
          <TextField
            margin="dense"
            id="subject"
            label="Subject"
            type="text"
            variant="outlined"
            style={{ flex: 1 }}
            value={emailData.subject}
          />
        </div>
        <TextField
          margin="dense"
          id="content"
          label="Email Content"
          multiline
          rows={12}
          fullWidth
          variant="outlined"
          value={emailData.content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleClose}
          color="success"
          variant="contained"
          size="large"
          startIcon={<SendIcon />}
          sx={{
            fontWeight: 'bold',
            padding: '12px 24px',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#2e7d32',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;
