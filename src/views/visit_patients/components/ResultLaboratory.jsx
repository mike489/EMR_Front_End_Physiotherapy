import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const ResultLaboratory = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState('');
  const [labResults, setLabResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Fetch all visits
  const fetchVisits = async () => {
    setLoading(true);
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
        const visitData = Array.isArray(data.data?.data) ? data.data.data : [];
        setVisits(visitData);
        if (visitData.length) setSelectedVisit(visitData[0].visit_id);
      } else {
        toast.warning(data.message || 'No visits found');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching visits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch lab results for selected visit
const fetchLabResults = async (visitId) => {
  setLoading(true);
  try {
    const token = await GetToken();

    if (!visitId) {
      // All Patients: fetch lab results for all visits
      const allResults = [];
      for (const visit of visits) {
        const Api = `${Backend.auth}${Backend.patientLaboratories}/${visit.visit_id}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        };
        const response = await fetch(Api, { method: 'GET', headers });
        const data = await response.json();
        if (data.success) {
          allResults.push(...(data.data || []));
        }
      }
      setLabResults(allResults);
      setFilteredResults(allResults);
    } else {
      // Single visit
      const Api = `${Backend.auth}${Backend.patientLaboratories}/${visitId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers });
      const data = await response.json();
      if (data.success) {
        setLabResults(data.data || []);
        setFilteredResults(data.data || []);
      } else {
        setLabResults([]);
        setFilteredResults([]);
        toast.warning(data.message || 'No laboratory results found');
      }
    }
  } catch (error) {
    toast.error(error.message || 'Error fetching laboratory results');
  } finally {
    setLoading(false);
  }
};


  // Handle visit selection
  const handleVisitChange = (e) => {
    const visitId = e.target.value;
    setSelectedVisit(visitId);
    fetchLabResults(visitId);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = labResults
      .map((category) => ({
        ...category,
        tests: (category.tests || []).filter((test) =>
          test.test.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.tests.length > 0);

    setFilteredResults(filtered);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (selectedVisit) fetchLabResults(selectedVisit);
  }, [selectedVisit]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: theme.palette.primary.light }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header with Visit Select & Search */}
      <Box mb={4}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Laboratory Results
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Review test results from your laboratory visits
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box display="flex" flexDirection="column" gap={2} flex={0.5}>
          <TextField
            select
            label="Select Visit"
            value={selectedVisit}
            onChange={handleVisitChange}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>All Patients</em>
            </MenuItem>
            {visits.map((visit) => (
              <MenuItem key={visit.visit_id || visit.id} value={visit.visit_id || visit.id}>
                {visit.patient_name || `Visit ${visit.visit_id}`}
              </MenuItem>
            ))}
          </TextField>

        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

        </Stack>


      </Box>

      {/* Lab Results */}
      {filteredResults.length ? (
        filteredResults.map((category, index) => (
          <Card
            key={index}
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: 'grey.100',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.dark',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  {category.group_name}
                </Typography>
                <Chip
                  label={`${category.tests.length} tests`}
                  size="small"
                  sx={{ ml: 2, backgroundColor: 'primary.light', color: 'white', fontSize: '0.7rem' }}
                />
              </Box>

              <Divider sx={{ my: 2, backgroundColor: 'grey.100' }} />

              <List dense disablePadding>
                {category.tests.map((test) => (
                  <Paper
                    key={test.id}
                    elevation={0}
                    sx={{
                      mb: 1.5,
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: 'grey.50',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'primary.lighter',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <ListItem alignItems="flex-start" disableGutters>
                      <ListItemText
                        primary={<Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>{test.test}</Typography>}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, minWidth: '70px' }}>
                                Result:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark', ml: 1 }}>
                                {test.result}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, minWidth: '70px' }}>
                                Technician:
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {test.technician}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, minWidth: '70px' }}>
                                Date:
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {new Date(test.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      ) : (
        <Box textAlign="center" py={6} sx={{ backgroundColor: 'grey.50', borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchQuery ? 'No results match your search' : 'No laboratory results available for this visit'}
          </Typography>
        </Box>
      )}

      <ToastContainer />
    </Box>
  );
};

export default ResultLaboratory
