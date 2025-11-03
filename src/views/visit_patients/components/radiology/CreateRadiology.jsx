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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
  Zoom,
  Collapse,
  IconButton,
  Grid,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CancelIcon from '@mui/icons-material/Cancel';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';

const CreateRadiology = ({ visit, open, onClose }) => {
  const [radiology, setRadiology] = React.useState([]);
  const [filteredRadiology, setFilteredRadiology] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedRadiology, setSelectedRadiology] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notes, setNotes] = React.useState({});
  const [expandedNotes, setExpandedNotes] = React.useState({});
  const [data, setData] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [selectedPatientId, setSelectedPatientId] = React.useState('');
  const [selectedVisit, setSelectedVisit] = React.useState('');
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

  const handleFetchingRadiology = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getScans}`;
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
        const data = responseData.data || [];
        setRadiology(data);
        setFilteredRadiology(data);
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

  const handlePatientVisitChange = (event) => {
    const selectedPatientId = event.target.value;
    const selectedVisitData = data.find(
      (item) => item.id === selectedPatientId,
    );

    setSelectedPatientId(selectedPatientId);
    setSelectedVisit(selectedVisitData?.visit_id || '');
  };

  const handleCreateRadiology = async () => {
    // Check if a visit is selected
    if (!selectedVisit) {
      toast.warning('Please select a patient visit first');
      return;
    }

    const selectedRadiologyIds = Object.keys(selectedRadiology).filter(
      (testId) => selectedRadiology[testId],
    );

    if (selectedRadiologyIds.length === 0) {
      toast.warning('Please select at least one test');
      return;
    }

    const scans = selectedRadiologyIds.map((id) => ({
      id,
      note: notes[id]?.trim() || '',
    }));

    const token = await GetToken();
    // Use the selectedVisit instead of visit.visit_id
    const Api = `${Backend.auth}${Backend.patientRadiologies}/${selectedVisit}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setSubmitting(true);
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({ scans }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Radiology created successfully!');
        setSelectedRadiology({});
        setNotes({});
        setExpandedNotes({});
        setSearchQuery('');
        setSelectedPatientId('');
        setSelectedVisit('');
        onClose();
      } else {
        toast.error(responseData.data.message || 'Failed to create radiology');
      }
    } catch (error) {
      toast.error('Error creating radiology: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRadiologySelection = (testId) => {
    setSelectedRadiology((prev) => {
      const newState = { ...prev, [testId]: !prev[testId] };
      if (!newState[testId]) {
        const updatedNotes = { ...notes };
        const updatedExpanded = { ...expandedNotes };
        delete updatedNotes[testId];
        delete updatedExpanded[testId];
        setNotes(updatedNotes);
        setExpandedNotes(updatedExpanded);
      }
      return newState;
    });
  };

  const handleSelectAll = () => {
    const allSelected =
      Object.keys(selectedRadiology).length === radiology.length &&
      Object.values(selectedRadiology).every(Boolean);

    const newSelected = {};
    if (!allSelected) {
      radiology.forEach((test) => {
        newSelected[test.id] = true;
      });
    }
    setSelectedRadiology(newSelected);
    setExpandedNotes({}); // Reset expanded notes when selecting/deselecting all
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = radiology.filter((test) =>
      test.name.toLowerCase().includes(query),
    );
    setFilteredRadiology(filtered);
  };

  const handleToggleNotes = (testId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const handleCancelNotes = (testId) => {
    // Clear notes and deselect the test
    const updatedNotes = { ...notes };
    const updatedExpanded = { ...expandedNotes };
    const updatedSelected = { ...selectedRadiology };
    delete updatedNotes[testId];
    delete updatedExpanded[testId];
    delete updatedSelected[testId];
    setNotes(updatedNotes);
    setExpandedNotes(updatedExpanded);
    setSelectedRadiology(updatedSelected);
  };

  const getSelectedCount = () => {
    return Object.values(selectedRadiology).filter(Boolean).length;
  };

  React.useEffect(() => {
    if (open) {
      handleFetchingRadiology();
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="create-radiology-dialog-title"
      TransitionComponent={Zoom}
      transitionDuration={300}
    >
      <DialogTitle id="create-radiology-dialog-title">
        Create Radiology Request
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#f5f5f5' }}>
        {/* Patient Visit Selection Card */}
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
                  aria-label="Patient visit selection for all radiology tests"
                  disabled={dataLoading}
                >
                  {dataLoading ? (
                    <MenuItem value="" disabled>
                      Loading visits...
                    </MenuItem>
                  ) : (
                    data.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.patient_name}
                        {option.date &&
                          ` - ${format(new Date(option.date), 'MMM dd, yyyy')}`}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              {!selectedVisit && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ mt: 1 }}
                  >
                    Please select a patient visit to enable test selection
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search radiology ..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', borderRadius: 3 }}
            aria-label="Search radiology tests"
            disabled={!selectedVisit} // Disable search if no visit selected
          />
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress aria-label="Loading radiology tests" />
          </Box>
        ) : (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                  Radiology Tests
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        Object.keys(selectedRadiology).length ===
                          radiology.length &&
                        Object.values(selectedRadiology).every(Boolean)
                      }
                      onChange={handleSelectAll}
                      color="primary"
                      disabled={!selectedVisit} // Disable select all if no visit selected
                    />
                  }
                  label="Select All"
                  sx={{ mr: 1 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Warning message when no visit selected */}
              {!selectedVisit && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="warning.main">
                    Please select a patient visit above to enable test selection
                  </Typography>
                </Box>
              )}

              <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                <List dense>
                  {filteredRadiology.map((test) => (
                    <Tooltip
                      key={test.id}
                      title={test.description}
                      placement="right"
                      arrow
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          mb: 1,
                          border: '1px solid',
                          borderColor: selectedRadiology[test.id]
                            ? 'primary.main'
                            : '#dddee0',
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          opacity: selectedVisit ? 1 : 0.6,
                          '&:hover': {
                            transform: selectedVisit
                              ? 'translateY(-2px)'
                              : 'none',
                            boxShadow: selectedVisit
                              ? '0 6px 12px rgba(0,0,0,0.15)'
                              : 'none',
                          },
                        }}
                      >
                        <ListItem
                          secondaryAction={
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedRadiology[test.id] || false}
                                  onChange={() =>
                                    handleRadiologySelection(test.id)
                                  }
                                  color="primary"
                                  inputProps={{
                                    'aria-label': `Select ${test.name}`,
                                  }}
                                  disabled={!selectedVisit} // Disable checkbox if no visit selected
                                />
                              }
                              label=""
                            />
                          }
                        >
                          <ListItemText
                            sx={{ p: 1 }}
                            primary={
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: selectedRadiology[test.id]
                                    ? 'bold'
                                    : 'normal',
                                  color: selectedRadiology[test.id]
                                    ? 'primary.main'
                                    : 'text.primary',
                                }}
                              >
                                {test.name}
                              </Typography>
                            }
                          />
                        </ListItem>

                        {/* Expandable Note Editor */}
                        <Collapse
                          in={
                            selectedRadiology[test.id] && expandedNotes[test.id]
                          }
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}
                              >
                                Notes for {test.name}
                              </Typography>
                              <Box>
                                <IconButton
                                  onClick={() => handleCancelNotes(test.id)}
                                  size="small"
                                  aria-label={`Cancel notes for ${test.name}`}
                                  sx={{ mr: 1 }}
                                >
                                  <CancelIcon color="error" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleToggleNotes(test.id)}
                                  size="small"
                                  aria-label={
                                    expandedNotes[test.id]
                                      ? `Collapse notes for ${test.name}`
                                      : `Expand notes for ${test.name}`
                                  }
                                >
                                  {expandedNotes[test.id] ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                </IconButton>
                              </Box>
                            </Box>
                            <ReactQuill
                              value={notes[test.id] || ''}
                              onChange={(value) =>
                                setNotes((prev) => ({
                                  ...prev,
                                  [test.id]: value,
                                }))
                              }
                              placeholder="Enter notes here... (optional)"
                              style={{ height: '120px', marginBottom: '10px' }}
                            />
                          </Box>
                        </Collapse>

                        {/* Collapsed Notes Indicator */}
                        {selectedRadiology[test.id] &&
                          !expandedNotes[test.id] && (
                            <Box
                              sx={{
                                p: 1,
                                bgcolor: '#e3f2fd',
                                borderTop: '1px solid #bbdefb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="primary.main"
                                sx={{ fontStyle: 'italic' }}
                              >
                                Notes {notes[test.id] ? '(Saved)' : '(Empty)'}
                              </Typography>
                              <IconButton
                                onClick={() => handleToggleNotes(test.id)}
                                size="small"
                                aria-label={`Expand notes for ${test.name}`}
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </Box>
                          )}
                      </Paper>
                    </Tooltip>
                  ))}
                </List>
              </Box>
              {filteredRadiology.length === 0 && (
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" color="text.secondary">
                    {searchQuery
                      ? 'No radiology tests match your search'
                      : 'No radiology tests available'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f5f5f5', p: 3 }}>
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            Selected: {getSelectedCount()} Request
            {getSelectedCount() !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
          aria-label="Cancel radiology request"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRadiology}
          disabled={submitting || getSelectedCount() === 0 || !selectedVisit}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          aria-label={`Create radiology request with ${getSelectedCount()} test(s) for visit ${selectedVisit}`}
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

export default CreateRadiology;
