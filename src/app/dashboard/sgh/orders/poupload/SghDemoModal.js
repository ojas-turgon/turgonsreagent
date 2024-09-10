import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { CheckCircle as CheckCircleOutlineIcon } from '@phosphor-icons/react';

import SnackBar from './snackbar';

export default function UploadDocumentsForm(props) {
  const [modalOpen, setModalOpen] = React.useState(props.state);
  const [progress, setProgress] = React.useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState('error');
  const [snackBarAlertMessage, setSnackBarAlertMessage] = useState('');

  //   const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    props.setState(false);
  };
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  React.useEffect(() => {
    setModalOpen(props.state);
    setProgress(progress + 1);
  }, [props.state]);

  React.useEffect(() => {
    if (!modalOpen) {
      return () => {};
    }
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          setOpenSnackBar(true);
          setSnackBarAlertSeverity('success');
          setSnackBarAlertMessage('Purchase order inserted into SAP !');

          setInterval(() => {
            window.location.reload();
            handleModalClose();
          }, 5000);

          return 100;
        }
        if (oldProgress >= 85) {
          document.getElementById('modalCheckCircleOutlineIcon3').style.display = 'block';
          document.getElementById('modalCircularProgress3').style.display = 'none';
        } else if (oldProgress >= 60) {
          document.getElementById('modalCheckCircleOutlineIcon2').style.display = 'block';
          document.getElementById('modalCircularProgress2').style.display = 'none';
          document.getElementById('modal-modal-description3').style.display = 'block';
          document.getElementById('modalCircularProgress3').style.display = 'block';
        } else if (oldProgress >= 30) {
          document.getElementById('modalCircularProgress1').style.display = 'none';
          document.getElementById('modalCheckCircleOutlineIcon1').style.display = 'block';
          document.getElementById('modal-modal-description2').style.display = 'block';
          document.getElementById('modalCircularProgress2').style.display = 'block';
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <>
      <SnackBar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        snackBarAlertSeverity={snackBarAlertSeverity}
        snackBarAlertMessage={snackBarAlertMessage}
      />

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Stack spacing={1} marginTop={'1vh'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Inserting Purchse Order into SAP
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography variant="body1">Status:</Typography>
              <Typography variant="body2">{Math.round(progress)}% Complete</Typography>
              <Button onClick={handleModalClose}>Close</Button>
            </Box>

            <LinearProgress variant="determinate" value={progress} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <CircularProgress id="modalCircularProgress1" />
              <CheckCircleOutlineIcon id="modalCheckCircleOutlineIcon1" sx={{ color: green[500], display: 'none' }} />
              <Typography id="modal-modal-description" sx={{ mt: 2, ml: 2 }}>
                Mapping Purchase Order Fields to SAP VA01 Fields
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <CircularProgress id="modalCircularProgress2" sx={{ display: 'none' }} />
              <CheckCircleOutlineIcon id="modalCheckCircleOutlineIcon2" sx={{ color: green[500], display: 'none' }} />
              <Typography id="modal-modal-description2" sx={{ mt: 2, ml: 2, display: 'none' }}>
                Connecting to SAP Server
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <CircularProgress id="modalCircularProgress3" sx={{ display: 'none' }} />
              <CheckCircleOutlineIcon id="modalCheckCircleOutlineIcon3" sx={{ color: green[500], display: 'none' }} />
              <Typography
                id="modal-modal-description3"
                sx={{ mt: 2, ml: 2, display: 'none' }} // Added margin left (ml) with a value of 2
              >
                Inserting Purchase Order into SAP
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
