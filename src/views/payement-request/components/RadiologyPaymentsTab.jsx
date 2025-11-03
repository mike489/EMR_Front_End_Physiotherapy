import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const RadiologyPaymentsTab = ({ visit }) => {
  const [radiologyResults, setRadiologyResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedTests, setSelectedTests] = React.useState({});

  const handleFetchingRadiology = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientRadiologies}/${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setRadiologyResults(responseData.data || []);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRadiologyTest = async () => {
    const selectedTestIds = Object.keys(selectedTests).filter(
      (testId) => selectedTests[testId],
    );

    if (selectedTestIds.length === 0) {
      toast.warning('Please select at least one test');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologiesPayment}/${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    const formData = new FormData();
    selectedTestIds.forEach((id) => {
      formData.append('patient_scans[]', id);
    });

    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Radiology payment created successfully!');
        setSelectedTests({});
        handleFetchingRadiology(); // Refresh the list
      } else {
        toast.error(responseData.data.message || 'Failed to create radiology payment');
      }
    } catch (error) {
      toast.error('Error creating radiology payment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestSelection = (testId) => {
    const test = findTestById(testId);
    if (test && !test.is_payment_completed) {
      setSelectedTests((prev) => ({
        ...prev,
        [testId]: !prev[testId],
      }));
    }
  };

  const findTestById = (testId) => {
    return radiologyResults.find((test) => test.id === testId) || null;
  };

  const getSelectedCount = () => {
    return Object.values(selectedTests).filter(Boolean).length;
  };

  const getSelectedTotalAmount = () => {
    let total = 0;
    radiologyResults.forEach((test) => {
      if (selectedTests[test.id]) {
        total += Number(test.amount) || 0;
      }
    });
    return total;
  };

  React.useEffect(() => {
    handleFetchingRadiology();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Grid item>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Radiology
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRadiologyTest}
            disabled={submitting || getSelectedCount() === 0}
            sx={{ minWidth: 120 }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              `Create (${getSelectedCount()}) - ETB${getSelectedTotalAmount()}`
            )}
          </Button>
        </Grid>
      </Grid>

      {radiologyResults.length > 0 ? (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <List dense>
              {radiologyResults.map((test) => (
                <Paper
                  key={test.id}
                  elevation={1}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: test.is_payment_completed
                      ? 'background.paper'
                      : selectedTests[test.id]
                        ? 'action.selected'
                        : 'background.paper',
                  }}
                >
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          component="span"
                          sx={{
                            fontWeight: selectedTests[test.id] ? 'medium' : 'normal',
                            color: test.is_payment_completed
                              ? 'success.dark'
                              : 'inherit',
                          }}
                        >
                          {test.radiology_name} - ETB{test.amount}
                          {test.is_payment_completed && ' - Completed'}
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            test.is_payment_completed || selectedTests[test.id] || false
                          }
                          onChange={() => handleTestSelection(test.id)}
                          color={test.is_payment_completed ? 'success' : 'primary'}
                          disabled={test.is_payment_completed}
                        />
                      }
                      label={test.is_payment_completed ? 'Completed' : ''}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            No radiology available
          </Typography>
        </Box>
      )}

      {radiologyResults.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {getSelectedCount() > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight="medium"
              >
                Selected: {getSelectedCount()} | Total: ETB{getSelectedTotalAmount()}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateRadiologyTest}
            disabled={submitting || getSelectedCount() === 0}
            sx={{ minWidth: 200 }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              `Create Selected Tests (${getSelectedCount()}) - ETB${getSelectedTotalAmount()}`
            )}
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default RadiologyPaymentsTab;