import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import CreateRadiology from '../components/radiology/CreateRadiology';

const RadiologyTab = ({ visit, goToResults }) => {
  const [visitPatients, setVisitPatients] = useState([]);
  const [patientRadiology, setPatientRadiology] = useState([]);
  const [filteredRadiology, setFilteredRadiology] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [openRadiologyModal, setOpenRadiologyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPatient, setSelectedPatient] = useState({
    patient_id: '',
    visit_id: '',
  });

  // Fetch visits/patients
  const handleFetchingVisitPatients = async () => {
    setPatientsLoading(true);
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.getVisits}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers });
      const data = await response.json();
      if (data.success) {
        // Extract the array safely
        const visitsArray = Array.isArray(data.data?.data) ? data.data.data : [];
        setVisitPatients(visitsArray);
      } else {
        toast.warning(data.message || 'Failed to fetch visits');
      }
    } catch (error) {
      toast.error(error.message || 'Network error while fetching visits');
    } finally {
      setPatientsLoading(false);
    }
  };

  // Fetch patient radiology tests
const handleFetchingPatientRadiology = async (visitId) => {
  setLoading(true);
  try {
    const token = await GetToken();

    if (!visitId) {
      // All Patients: fetch radiology for all visits
      const allResults = [];
      for (const v of visitPatients) {
        const Api = `${Backend.auth}${Backend.patientRadiologies}/${v.visit_id}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        };
        const response = await fetch(Api, { method: 'GET', headers });
        const data = await response.json();
        if (data.success) {
          allResults.push(...(Array.isArray(data.data) ? data.data : []));
        }
      }
      setPatientRadiology(allResults);
      setFilteredRadiology(allResults);
    } else {
      // Single visit
      const Api = `${Backend.auth}${Backend.patientRadiologies}/${visitId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers });
      const data = await response.json();
      if (data.success) {
        const radiologyArray = Array.isArray(data.data) ? data.data : [];
        setPatientRadiology(radiologyArray);
        setFilteredRadiology(radiologyArray);
      } else {
        setPatientRadiology([]);
        setFilteredRadiology([]);
        toast.warning(data.message || 'No radiology found');
      }
    }
  } catch (error) {
    toast.error(error.message || 'Network error while fetching radiology');
  } finally {
    setLoading(false);
  }
};

  // Handle patient selection
  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const selected = visitPatients.find((v) => v.id === patientId);
    setSelectedPatient({
      patient_id: patientId,
      visit_id: selected?.visit_id || '',
    });
    // Fetch radiology for the selected visit
    handleFetchingPatientRadiology(selected?.visit_id);
  };

  // Handle radiology search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patientRadiology.filter((test) =>
      test.radiology_name.toLowerCase().includes(query)
    );
    setFilteredRadiology(filtered);
  };

  useEffect(() => {
    handleFetchingVisitPatients();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Radiology
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        sx={{ mb: 3 }}
      >

        <Box display="flex" flexDirection="column" gap={2} flex={0.5}>

          <TextField
            select
            label="Select Patient / Visit"
            value={selectedPatient.patient_id}
            onChange={handlePatientChange}
            size="small"
            sx={{ minWidth: 100 }}
            disabled={patientsLoading}
          // helperText={
          //   patientsLoading ? 'Loading patients...' : 'Filter by patient'
          // }
          >
            <MenuItem value="">
              <em>All Patients</em>
            </MenuItem>
            {Array.isArray(visitPatients) &&
              visitPatients.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.patient_name}
                </MenuItem>
              ))}
          </TextField>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search radiology ..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', sm: 200, md: 300 } }}
          />
          <IconButton
            color="primary"
            onClick={() => setOpenRadiologyModal(true)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'white',
              },
            }}
            aria-label="Create new radiology request"
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Radiology List */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper' }}>
          <CardContent>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              <List disablePadding>
                {Array.isArray(filteredRadiology) && filteredRadiology.length > 0 ? (
                  filteredRadiology.map((test) => (
                    <Paper
                      key={test.id}
                      elevation={0}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        borderColor: test.result ? 'success.main' : 'grey.200',
                        bgcolor: 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <ListItem
                        disablePadding
                        secondaryAction={
                          test.result && (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => goToResults('radiology')}
                              sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                              View Result
                            </Button>
                          )
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: test.result ? 'bold' : 'medium',
                                color: test.result ? 'success.dark' : 'text.primary',
                              }}
                            >
                              {test.radiology_name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Technician: {test.technician || 'Not assigned'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery
                        ? 'No results match your search'
                        : 'No radiology tests ordered'}
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Create Radiology Modal */}
      <CreateRadiology
        visit={visit}
        open={openRadiologyModal}
        onClose={() => {
          setOpenRadiologyModal(false);
          if (selectedPatient.visit_id) handleFetchingPatientRadiology(selectedPatient.visit_id);
        }}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default RadiologyTab;
