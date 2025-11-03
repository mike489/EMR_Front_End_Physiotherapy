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
  Tooltip,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreateRadiology from '../components/radiology/CreateRadiology';

const RadiologyTab = ({ visit, goToResults }) => {
  const [patientRadiology, setPatientRadiology] = useState([]);
  const [filteredRadiology, setFilteredRadiology] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openLabModal, setOpenRadiologyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch ordered radiology
  const handleFetchingPatientRadiology = async () => {
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
        const data = responseData.data || [];
        setPatientRadiology(data);
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

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patientRadiology.filter((test) =>
      test.radiology_name.toLowerCase().includes(query),
    );
    setFilteredRadiology(filtered);
  };

  useEffect(() => {
    handleFetchingPatientRadiology();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        bgcolor="background.default"
      >
        <CircularProgress aria-label="Loading radiology data" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            // fontSize: { xs: "1.5rem", md: "1.75rem" },
          }}
        >
          Radiology
        </Typography>
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
            aria-label="Search radiology"
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
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Divider sx={{ mb: 2, borderColor: 'grey.200' }} />
          <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
            <List disablePadding>
              {filteredRadiology.map((test) => (
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
                      test.result ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => goToResults('radiology')}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 2,
                            '&:hover': { bgcolor: 'primary.light' },
                          }}
                          aria-label={`View result for ${test.radiology_name}`}
                        >
                          View Result
                        </Button>
                      ) : null
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: test.result ? 'bold' : 'medium',
                              color: test.result
                                ? 'success.dark'
                                : 'text.primary',
                            }}
                          >
                            {test.radiology_name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', mt: 0.5 }}
                        >
                          {`Technician: ${test.technician || 'Not assigned'}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
          {filteredRadiology.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery
                  ? 'No results match your search'
                  : 'No radiology tests ordered'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Radiology Modal */}
      <CreateRadiology
        visit={visit}
        open={openLabModal}
        onClose={() => {
          setOpenRadiologyModal(false);
          handleFetchingPatientRadiology();
        }}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default RadiologyTab;
