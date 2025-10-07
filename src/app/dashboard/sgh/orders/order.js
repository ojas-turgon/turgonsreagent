import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EmailDialog from './emaildialog';
import NotificationDialog from './notificationDialog';

const LoadingOverlay = () => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      position: 'absolute',
    }}
    open={true}
  >
    <LinearProgress color="inherit" sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
  </Backdrop>
);
const OrderCard = ({ order }) => {
  const company = order['Customer Name'];
  const poNumber = order['Customer PO Number'];
  const status = order['Status'];
  const summary = order['Comments'];
  const [open, setOpen] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showNotificationConfig, setShowNotificationConfig] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    from: '',
    cc: '',
    subject: '',
    content: '',
  });

  const handleClickOpen = async () => {
    setOpen(true);

    try {
      setIsLoading(true);
      const response = await fetch('https://turgon-corp.vercel.app/api/sghpo/genemail', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const responseEmailData = await response.json();
        setEmailData(responseEmailData);
      }
    } catch (error) {
      // console.error('Failed to generate email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAskAi = () => {
    if (!showAiResponse) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    setShowAiResponse(!showAiResponse);
  };

  const handleNotificationConfig = () => {
    setShowNotificationConfig(!showNotificationConfig);
  };

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 1000, width: '80%', margin: 'auto', mt: 2 }}>
        <CardContent>
          <TableContainer
            sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fffde7' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>PO#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Summary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{company}</TableCell>
                  <TableCell>{poNumber}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>{summary}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAskAi}>
              Ask AI
            </Button>
            <Button variant="contained" color="secondary" onClick={handleNotificationConfig}>
              Create Customer Notification
            </Button>
            <Button variant="contained" color="info" onClick={handleClickOpen}>
              Draft Customer Email
            </Button>
          </Box>
          <Box
            sx={{
              mt: 2,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-out',
              maxHeight: showAiResponse ? '1000px' : '0px',
            }}
          >
            {isLoading && <LoadingOverlay />}
            <Box sx={{ overflowX: 'hidden', overflowY: 'auto', minHeight: '600px', maxHeight: '800px' }}>
              {/* Warning: The following code contains unsafe elements and should not be used in production */}
              {/* Embedding external content via iframes and injecting scripts can pose security risks */}

              <div
                style={{ minHeight: '500px' }}
                dangerouslySetInnerHTML={{
                  __html: `
    <!-- Embed this line anywhere in your website to add the chatbot -->
    <iframe
      id="TurgonChatBot" 
      src="https://old.turgon.ai/cschat?id=${order.id}&endpoint=api/sghpo/cschat" 
      scrolling="yes"
      style="width: 100%; height: 600px;
             border: 0; background-color: transparent; overflow: scroll;"
    ></iframe>

    <script>
      const iframe = document.getElementById("TurgonChatBot");
      window.addEventListener("message", (event) => {
        const type = event.data.type;
        if (type === "resize") {
          iframe.style.height = event.data.h;
          iframe.style.width = event.data.w;
          iframe.style.minHeight = event.data.mh;
          iframe.style.minWidth = event.data.mw;
        }
      });
    </script>
  `,
                }}
              />
            </Box>
          </Box>

          <NotificationDialog open={showNotificationConfig} handleClose={handleNotificationConfig} />
        </CardContent>
      </Card>
      <EmailDialog open={open} handleClose={handleClose} emailData={emailData} isLoading={isLoading} />
    </>
  );
};

export default OrderCard;
