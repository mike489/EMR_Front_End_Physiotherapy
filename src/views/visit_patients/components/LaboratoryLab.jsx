import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Paper,
  Button,
  Grid,
  Input,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const LaboratoryLab = ({ visit, goToResults }) => {
  const [labResults, setLabResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [testPayments, setTestPayments] = React.useState({});

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

  const handlePayLabTests = async () => {
    const selectedTestIds = Object.keys(testPayments).filter(
      (testId) => testPayments[testId] && testPayments[testId] !== '',
    );

    if (selectedTestIds.length === 0) {
      toast.warning('Please enter at least one test result');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.submitLaboratoriesResults}/${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    const formData = new FormData();
    selectedTestIds.forEach((id, index) => {
      formData.append(`patient_tests[${index}][id]`, id);
      formData.append(`patient_tests[${index}][result]`, testPayments[id]);
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
        setTestPayments({});
      } else {
        toast.error(responseData.data.message || 'Failed to create lab tests');
      }
    } catch (error) {
      toast.error('Error creating lab tests: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentChange = (testId, value) => {
    setTestPayments((prev) => ({
      ...prev,
      [testId]: value,
    }));
  };

  const getEnteredCount = () => {
    return Object.values(testPayments).filter((v) => v && v !== '').length;
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
            onClick={handlePayLabTests}
            disabled={submitting || getEnteredCount() === 0}
            sx={{ minWidth: 150 }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              `Create Laboratory (${getEnteredCount()})`
            )}
          </Button>
        </Grid>
      </Grid>

      {labResults.map((category) => (
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
                    backgroundColor: testPayments[test.id]
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
                            fontWeight: testPayments[test.id]
                              ? 'medium'
                              : 'normal',
                          }}
                        >
                          {test.test}
                        </Typography>
                      }
                    />

                    {!test.result ? (
                      <Input
                        type="text"
                        placeholder="Enter ..."
                        value={testPayments[test.id] || ''}
                        onChange={(e) =>
                          handlePaymentChange(test.id, e.target.value)
                        }
                        sx={{ width: 220, ml: 2 }}
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={goToResults}
                        sx={{ ml: 2 }}
                      >
                        View Result
                      </Button>
                    )}
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handlePayLabTests}
            disabled={submitting || getEnteredCount() === 0}
            sx={{ minWidth: 200 }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              `Create Laboratory (${getEnteredCount()})`
            )}
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default LaboratoryLab;
