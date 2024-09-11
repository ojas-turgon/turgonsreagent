import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EmailDialog from './emaildialog';

const OrderCard = ({ order }) => {
  const company = order['Customer Name'];
  const poNumber = order['Customer PO Number'];
  const status = order['Status'];
  const summary = order.comments;
  const [open, setOpen] = useState(false);
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
      const response = await fetch('https://www.turgon.ai/api/sghpo/genemail', {
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

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 600, width: '100%', margin: 'auto', mt: 2 }}>
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
            <Button variant="contained" color="primary">
              Ask AI
            </Button>
            <Button variant="contained" color="secondary">
              Create Customer Notification
            </Button>
            <Button variant="contained" color="info" onClick={handleClickOpen}>
              Draft Customer Email
            </Button>
          </Box>
        </CardContent>
      </Card>
      <EmailDialog open={open} handleClose={handleClose} emailData={emailData} isLoading={isLoading} />
    </>
  );
};

export default OrderCard;
