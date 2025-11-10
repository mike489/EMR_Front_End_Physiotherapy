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
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Modal,
  Backdrop,
  Fade,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const RadiologyResult = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState('');
  const [radiologyResults, setRadiologyResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch all patient visits
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
        if (visitData.length) setSelectedVisit(visitData[0].visit_id); // default first visit
      } else {
        toast.warning(data.message || 'No visits found');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching visits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch radiology results for selected visit
 const fetchRadiologyResults = async (visitId) => {
  setLoading(true);
  try {
    const token = await GetToken();

    if (!visitId) {
      // All Patients: fetch results for every visit
      const allResults = [];
      for (const v of visits) {
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
      setRadiologyResults(allResults);
      setFilteredResults(allResults);
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
        const resultsArray = Array.isArray(data.data) ? data.data : [];
        setRadiologyResults(resultsArray);
        setFilteredResults(resultsArray);
      } else {
        setRadiologyResults([]);
        setFilteredResults([]);
        toast.warning(data.message || 'No radiology results found');
      }
    }
  } catch (error) {
    toast.error(error.message || 'Error fetching radiology results');
  } finally {
    setLoading(false);
  }
};

  // Handle visit selection change
  const handleVisitChange = (e) => {
    const visitId = e.target.value;
    setSelectedVisit(visitId);
    fetchRadiologyResults(visitId);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = radiologyResults.filter((test) =>
      test.radiology_name.toLowerCase().includes(query)
    );
    setFilteredResults(filtered);
  };

  // Open image modal
  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage('');
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (selectedVisit) fetchRadiologyResults(selectedVisit);
  }, [selectedVisit]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#fafafa' }}>
      <Box mb={4}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Radiology Results
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Review results by visit
        </Typography>
      </Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>

        {/* Visit Dropdown */}
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
          sx={{ minWidth: 200 }}
        />

       </Stack>
        {/* Search */}
      </Box>

      {/* Radiology Results List */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
        <CardContent sx={{ p: 2 }}>
          <Chip
            label={`${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ mb: 2, backgroundColor: 'primary.light', color: 'white' }}
          />
          <Divider sx={{ mb: 2, backgroundColor: 'grey.200' }} />

          {filteredResults.length ? (
            <List dense disablePadding sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredResults.map((test) => (
                <Paper
                  key={test.id}
                  elevation={0}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: test.result ? 'success.main' : 'grey.300',
                    bgcolor: 'white',
                  }}
                >
                  <ListItem alignItems="flex-start" disablePadding>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: test.result ? 'bold' : 'medium', color: test.result ? 'success.dark' : 'text.primary' }}
                          >
                            {test.radiology_name}
                          </Typography>
                          {test.result && (
                            <Chip label="Completed" size="small" sx={{ ml: 2, backgroundColor: 'success.main', color: 'white', fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: test.result || 'Pending' }} />
                        </Box>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery ? 'No results match your search' : 'No radiology results available for this visit'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <img
              src={selectedImage}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
            />
          </Box>
        </Fade>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default RadiologyResult;
