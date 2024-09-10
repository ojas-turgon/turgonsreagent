import React from 'react';
import { IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import { X as CloseIcon } from '@phosphor-icons/react';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SnackBar(props) {
  const {
    openSnackBar,
    setOpenSnackBar,
    snackBarAlertSeverity,
    snackBarAlertMessage,
    vertical = 'top',
    horizontal = 'right',
  } = props;

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };

  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={5000}
      anchorOrigin={{ vertical, horizontal }}
      onClose={handleSnackBarClose}
      TransitionComponent={SlideTransition}
    >
      <Alert
        variant="filled"
        severity={snackBarAlertSeverity}
        sx={{ width: '100%', fontSize: '1.25rem' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {snackBarAlertMessage}
      </Alert>
    </Snackbar>
  );
}
