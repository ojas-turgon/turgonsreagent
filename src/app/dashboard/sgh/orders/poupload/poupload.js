'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, createTheme, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import SGHDemoModal from './SghDemoModal';
import SnackBar from './snackbar';
import { getValueOnlyPO, initialPoDetails, valueOnlySchema } from './ZodSchema';

// type ItemSchema = z.infer<typeof valueOnlySchema.shape.items.element>;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// interface PoUploadForm {
//   file: FileList;
// }

export default function PoUpload(params) {
  let { topMargin, clearParentTextBoxOnUpload } = params;
  if (!topMargin) {
    topMargin = '25vh';
  }
  const [pdfFile, setPdfFile] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState('error');
  const [snackBarAlertMessage, setSnackBarAlertMessage] = useState('');
  const [pdfExtracted, setPdfExtracted] = useState(false);
  const [pdfExtractionInProgress, setPdfExtractionInProgress] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (clearParentTextBoxOnUpload) {
      const textBox = document.getElementById(clearParentTextBoxOnUpload);
      if (textBox) {
        textBox.innerHTML = '';
      }
    }
    setPdfExtractionInProgress(true);
    const formData = new FormData();
    formData.append('file', data.file[0]);
    setPdfFile(data.file[0]);

    try {
      const response = await fetch('https://www.turgon.ai/api/sghpo', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        const isPO = responseData.extractedPo?.isPurchaseOrder;
        const extractedPO = getValueOnlyPO(responseData.extractedPo);
        resetPOForm(extractedPO);
        // resetPOForm(data.extractedPo);
        setOpenSnackBar(true);
        if (isPO) {
          setSnackBarAlertSeverity('success');
          setSnackBarAlertMessage('Purchase order uploaded successfully!');
        } else {
          setSnackBarAlertSeverity('error');
          setSnackBarAlertMessage(
            'The uploaded document does not look like a valid Purchase Order. However, we have extracted the fields probabilistically.  Please check the form details carefully before adding to SAP.'
          );
        }
        setPdfExtracted(true);
      } else {
        setOpenSnackBar(true);
        setSnackBarAlertSeverity('error');
        setSnackBarAlertMessage('Failed to upload purchase order.');
      }
    } catch (error) {
      setOpenSnackBar(true);
      setSnackBarAlertSeverity('error');
      setSnackBarAlertMessage('Error uploading file.');
    }
    setPdfExtractionInProgress(false);
  };

  const {
    control,
    handleSubmit: handleZodSubmit,
    formState: { errors: zodErrors },
    reset: resetPOForm,
  } = useForm({
    defaultValues: initialPoDetails,
    resolver: zodResolver(valueOnlySchema),
    mode: 'onTouched',
  });

  // Set up field array with control
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmitZodForm = (data) => {
    //compiler complains if data is unused
    //form hook sends data as part of this function
    //so hack it by using this useless if statement
    if (data) {
      setModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const renderZodFields = () => {
    return Object.keys(valueOnlySchema.shape).map((key) => {
      if (key !== 'items') {
        return (
          <Controller
            key={key}
            name={key}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                //   key={key}
                {...field}
                margin="normal"
                fullWidth
                label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                variant="outlined"
                error={!!zodErrors[key]}
                helperText={zodErrors[key] ? `${key.replace(/_/g, ' ')} is required` : ''}
              />
            )}
          />
        );
      } else {
        return (
          <Box sx={{ pl: 4 }}>
            <Typography variant="h6" gutterBottom>
              Items Ordered
            </Typography>
            {fields.map((field, index) => (
              <Box key={`ItemBox${index}`} sx={{ mb: 2 }}>
                <Typography key={`ItemTypography${index}`} variant="subtitle1" gutterBottom>
                  Item {index + 1}.
                </Typography>
                {Object.keys(field)
                  .filter((itemKey) => itemKey !== 'id')
                  .map((itemKey) => (
                    <Controller
                      key={`items.${index}.${itemKey}`}
                      name={`items.${index}.${itemKey}`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="normal"
                          fullWidth
                          label={itemKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          variant="outlined"
                          error={!!zodErrors.items?.[index]?.[itemKey]}
                          helperText={zodErrors.items?.[index]?.[itemKey]?.message || ''}
                        />
                      )}
                    />
                  ))}
              </Box>
            ))}
          </Box>
        );
      }
    });
  };

  return (
    <Stack spacing={1} marginTop={topMargin}>
      <ThemeProvider theme={darkTheme}>
        <SnackBar
          openSnackBar={openSnackBar}
          setOpenSnackBar={setOpenSnackBar}
          snackBarAlertSeverity={snackBarAlertSeverity}
          snackBarAlertMessage={snackBarAlertMessage}
        />
        {!pdfExtracted && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh" marginTop="20vh">
            <Paper elevation={3} style={{ padding: '20px', width: '500px' }}>
              <Typography variant="h5" component="h1" gutterBottom>
                Upload New Purchase Order
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  margin="normal"
                  fullWidth
                  type="file"
                  variant="outlined"
                  {...register('file', {
                    required: 'Please Upload a Purchase Order in PDF file format',
                    validate: {
                      isPdf: (fileList) => fileList[0]?.type === 'application/pdf' || 'Only PDF files are allowed',
                    },
                  })}
                  error={!!errors.file}
                  helperText={errors.file ? errors.file.message || 'Error in file upload' : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    accept: 'application/pdf',
                  }}
                />
                <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
                  {pdfExtracted || !pdfExtractionInProgress ? 'Upload' : 'Extracting ...'}
                </Button>
              </form>
              {pdfExtractionInProgress && <LinearProgress color="success" />}
            </Paper>
          </Box>
        )}

        {pdfFile && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            sx={{ '& > *': { width: '100%' } }}
          >
            <Box display="flex" width="100%">
              <Box width="60%" p={2}>
                <iframe src={URL.createObjectURL(pdfFile)} width="100%" height="1200px"></iframe>{' '}
              </Box>
              <Box width="40%" p={2} display="flex" justifyContent="center" alignItems="top" minHeight="100vh">
                {pdfExtracted ? (
                  <Paper elevation={3} style={{ padding: '20px', width: '500px' }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                      Extracted Purchase Order
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                      Please verify the extracted fields from the purchase order. If any field is incorrect, please
                      update it below. When satisfied, click submit to send the order to SAP.
                    </Typography>
                    <form onSubmit={handleZodSubmit(onSubmitZodForm)} noValidate>
                      {renderZodFields()}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                        // onClick={() => {
                        //   console.log("Submit clicked");
                        //   setModalOpen(true);
                        // }}
                      >
                        Send to SAP
                      </Button>
                    </form>
                  </Paper>
                ) : (
                  <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>
        )}
        <SGHDemoModal state={modalOpen} setState={setModalOpen} />
      </ThemeProvider>
    </Stack>
  );
}
