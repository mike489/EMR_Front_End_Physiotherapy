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

const LaboratoryPaymentsTab = ({ visit }) => {
  const [labResults, setLabResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedTests, setSelectedTests] = React.useState({});

  const handleFetchingLab = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientLaboratories}/${visit.visit_id}`;
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
        setLabResults(responseData.data || []);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabTest = async () => {
    const selectedTestIds = Object.keys(selectedTests).filter(
      (testId) => selectedTests[testId],
    );

    if (selectedTestIds.length === 0) {
      toast.warning('Please select at least one test');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoriesPayment}/${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    // Build FormData so it sends test_ids[] properly
    const formData = new FormData();
    selectedTestIds.forEach((id) => {
      formData.append('patient_tests[]', id);
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
        toast.success('Lab tests created successfully!');
        setSelectedTests({});
        handleFetchingLab();
      } else {
        toast.error(responseData.data.message || 'Failed to create lab tests');
      }
    } catch (error) {
      toast.error('Error creating lab tests: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestSelection = (testId) => {
    // Only allow selection if payment is not completed
    const test = findTestById(testId);
    if (test && !test.is_payment_completed) {
      setSelectedTests((prev) => ({
        ...prev,
        [testId]: !prev[testId],
      }));
    }
  };

  // Helper function to find a test by ID
  const findTestById = (testId) => {
    for (const category of labResults) {
      const foundTest = category.tests.find((test) => test.id === testId);
      if (foundTest) return foundTest;
    }
    return null;
  };

  const getSelectedCount = () => {
    return Object.values(selectedTests).filter(Boolean).length;
  };

  const getSelectedTotalAmount = () => {
    let total = 0;

    labResults.forEach((category) => {
      category.tests.forEach((test) => {
        if (selectedTests[test.id]) {
          // Convert amount string to number and add to total
          total += Number(test.amount) || 0;
        }
      });
    });

    return total;
  };

  React.useEffect(() => {
    handleFetchingLab();
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
            Laboratory Tests
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateLabTest}
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

      {labResults.map((category, index) => (
        <Card key={category.id} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'medium', color: 'primary.main' }}
            >
              {category.group_name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {category.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List dense>
              {category.tests.map((test) => (
                <Paper
                  key={test.id}
                  elevation={1}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: test.is_payment_completed
                      ? 'success.light'
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
                            fontWeight: selectedTests[test.id]
                              ? 'medium'
                              : 'normal',
                            color: test.is_payment_completed
                              ? 'success.dark'
                              : 'inherit',
                          }}
                        >
                          {test.test} - ETB{test.amount}
                          {test.is_payment_completed && ' - Completed'}
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            test.is_payment_completed ||
                            selectedTests[test.id] ||
                            false
                          }
                          onChange={() => handleTestSelection(test.id)}
                          color={
                            test.is_payment_completed ? 'success' : 'primary'
                          }
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
      ))}

      {labResults.length === 0 && !loading && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            No laboratory tests available
          </Typography>
        </Box>
      )}

      {labResults.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {getSelectedCount() > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight="medium"
              >
                Selected: {getSelectedCount()} tests | Total: ETB
                {getSelectedTotalAmount()}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateLabTest}
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

export default LaboratoryPaymentsTab;
