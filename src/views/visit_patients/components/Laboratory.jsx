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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';

const Laboratory = ({ visit, open, onClose }) => {
  const [labResults, setLabResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedTests, setSelectedTests] = React.useState({});
  const [data, setData] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [selectedVisit, setSelectedVisit] = React.useState('');
  const [selectedPatientId, setSelectedPatientId] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({
    date: null,
  });

  const handleFetchingLab = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratories}`;
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

  const handleFetchingVisitPatients = async () => {
    setDataLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }

    const Api = `${Backend.auth}${Backend.getVisits}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }

      if (responseData.success) {
        setData(responseData.data.data);
        setPagination({
          ...pagination,
          last_page: responseData.data.last_page,
          total: responseData.data.total,
        });
        setError(false);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
      setError(true);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateLabTest = async () => {
    // Check if a visit is selected
    if (!selectedVisit) {
      toast.warning('Please select a patient visit first');
      return;
    }

    const selectedTestIds = Object.keys(selectedTests).filter(
      (testId) => selectedTests[testId],
    );

    if (selectedTestIds.length === 0) {
      toast.warning('Please select at least one test');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientLaboratory}/${selectedVisit}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    const formData = new FormData();
    selectedTestIds.forEach((id) => {
      formData.append('test_ids[]', id);
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
        setSelectedVisit('');
        setSelectedPatientId('');
        onClose(); // close modal after success
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
    setSelectedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const handlePatientVisitChange = (event) => {
    const selectedPatientId = event.target.value;
    const selectedVisitData = data.find(
      (item) => item.id === selectedPatientId,
    );

    setSelectedPatientId(selectedPatientId);
    setSelectedVisit(selectedVisitData?.visit_id || '');
  };

  const getSelectedCount = () => {
    return Object.values(selectedTests).filter(Boolean).length;
  };

  React.useEffect(() => {
    if (open) {
      handleFetchingLab();
      handleFetchingVisitPatients();
    }
  }, [open]);

  React.useEffect(() => {
    // If a visit is passed as prop, set it as selected
    if (visit && visit.visit_id) {
      setSelectedVisit(visit.visit_id);
      // Try to find the corresponding patient in the data
      const foundPatient = data.find(
        (item) => item.visit_id === visit.visit_id,
      );
      if (foundPatient) {
        setSelectedPatientId(foundPatient.id);
      }
    }
  }, [visit, data]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Laboratory Tests</DialogTitle>
      <DialogContent dividers>
        {/* Global Patient/Visit Selection */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Patient Selection
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Patient Visit"
                  value={selectedPatientId}
                  onChange={handlePatientVisitChange}
                  fullWidth
                  margin="normal"
                  helperText="Select a patient visit - this will apply to all selected tests"
                  aria-label="Patient visit selection for all laboratory tests"
                >
                  {data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.patient_name}
                      {option.date &&
                        ` - ${format(new Date(option.date), 'MMM dd, yyyy')}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* {selectedVisit && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    Selected Visit ID: <strong>{selectedVisit}</strong>
                  </Typography>
                </Grid>
              )} */}
            </Grid>
          </CardContent>
        </Card>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {labResults.map((category) => (
              <Card
                key={category.id}
                sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'medium', color: 'primary.main' }}
                  >
                    {category.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {category.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Show warning if no visit selected */}
                  {!selectedVisit && (
                    <Typography
                      variant="body2"
                      color="warning.main"
                      sx={{ mb: 2 }}
                    >
                      Please select a patient visit above to enable test
                      selection
                    </Typography>
                  )}

                  <List dense>
                    {category.tests.map((test) => (
                      <Paper
                        key={test.id}
                        elevation={0}
                        sx={{
                          mb: 1,
                          borderRadius: 1,
                          backgroundColor: selectedTests[test.id]
                            ? 'action.selected'
                            : 'background.paper',
                          opacity: selectedVisit ? 1 : 0.6,
                        }}
                      >
                        <ListItem
                          secondaryAction={
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedTests[test.id] || false}
                                  onChange={() => handleTestSelection(test.id)}
                                  color="primary"
                                  disabled={!selectedVisit}
                                />
                              }
                              label=""
                            />
                          }
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: selectedTests[test.id]
                                    ? 'medium'
                                    : 'normal',
                                }}
                              >
                                {test.name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {test.description || 'No description available'}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}

            {labResults.length === 0 && (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary">
                  No laboratory tests available
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateLabTest}
          disabled={submitting || getSelectedCount() === 0 || !selectedVisit}
        >
          {submitting ? (
            <CircularProgress size={20} />
          ) : (
            `Create (${getSelectedCount()})`
          )}
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default Laboratory;
