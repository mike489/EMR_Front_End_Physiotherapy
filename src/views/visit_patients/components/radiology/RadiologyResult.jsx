import React from 'react';
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
  useTheme,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const RadiologyResult = ({ visit }) => {
  const [radiologyResults, setRadiologyResults] = React.useState([]);
  const [filteredResults, setFilteredResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  const theme = useTheme();

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
        const data = responseData.data || [];
        setRadiologyResults(data);
        setFilteredResults(data);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = radiologyResults.filter((test) =>
      test.radiology_name.toLowerCase().includes(query),
    );
    setFilteredResults(filtered);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage('');
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
        <CircularProgress aria-label="Loading radiology Result" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#fafafa' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            Radiology Results
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Review results from your radiology visits
          </Typography>
        </Box>
        <Box>
          <TextField
            variant="outlined"
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
          />
        </Box>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          bgcolor: 'white',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={`${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                ml: 2,
                backgroundColor: 'primary.light',
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          </Box>
          <Divider sx={{ mb: 2, backgroundColor: 'grey.100' }} />
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <List dense disablePadding>
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
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItem alignItems="flex-start" disablePadding>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
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
                          {test.result && (
                            <Chip
                              label="Completed"
                              size="small"
                              sx={{
                                ml: 2,
                                backgroundColor: 'success.main',
                                color: 'white',
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {/* Result */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                minWidth: '70px',
                              }}
                            >
                              Result:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: test.result
                                  ? 'text.primary'
                                  : 'text.secondary',
                                ml: 1,
                              }}
                              dangerouslySetInnerHTML={{
                                __html: test.result || 'Pending',
                              }}
                            />
                            {test.description && (
                              <Tooltip
                                title={test.description}
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{ ml: 1 }}
                                  aria-label={`Description for ${test.radiology_name}`}
                                >
                                  <InfoOutlinedIcon
                                    fontSize="small"
                                    color="action"
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>

                          {/* File preview / download */}
                          {test.file && (
                            <Box sx={{ mt: 1 }}>
                              {test.file?.mime_type?.startsWith('image/') ? (
                                <Box
                                  component="img"
                                  src={test.file.url}
                                  alt={test.radiology_name}
                                  onClick={() =>
                                    handleImageClick(test.file.url)
                                  }
                                  sx={{
                                    maxWidth: 200,
                                    maxHeight: 200,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    mt: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.8,
                                    },
                                  }}
                                />
                              ) : test.file?.mime_type === 'application/pdf' ? (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <a
                                    href={test.file.url}
                                    target="_blank" // Opens in a new tab
                                    rel="noopener noreferrer" // Security best practice
                                    style={{
                                      color: '#1976d2',
                                      textDecoration: 'none',
                                      fontWeight: 500,
                                    }}
                                  >
                                    📄 View PDF
                                  </a>
                                </Typography>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  No file type found
                                </Typography>
                              )}
                            </Box>
                          )}

                          {/* Technician */}
                          {test.technician && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  minWidth: '70px',
                                }}
                              >
                                Technician:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                {test.technician}
                              </Typography>
                            </Box>
                          )}

                          {/* Date */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                minWidth: '70px',
                              }}
                            >
                              Date:
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {test.created_at}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
          {filteredResults.length === 0 && (
            <Box
              textAlign="center"
              py={4}
              sx={{
                backgroundColor: 'grey.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {searchQuery
                  ? 'No results match your search'
                  : 'No radiology results available'}
              </Typography>
              {!searchQuery && (
                <Typography variant="body2" color="text.secondary">
                  Radiology results will appear here once they are available.
                </Typography>
              )}
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
        BackdropProps={{
          timeout: 500,
        }}
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
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Fade>
      </Modal>
      <ToastContainer />
    </Box>
  );
};

export default RadiologyResult;
