import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Grid,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Hidden input style for file upload
const VisuallyHiddenInput = (props) => (
  <input
    style={{
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    }}
    {...props}
  />
);

// API constants
const API_ENDPOINTS = {
  patientRadiologies: (visitId) =>
    `${Backend.auth}${Backend.patientRadiologies}/${visitId}`,
  submitResults: (visitId) =>
    `${Backend.auth}${Backend.submitRadiologiesResult}/${visitId}`,
};

const RadiologyTab = ({ visit, goToResults }) => {
  const [patientRadiology, setPatientRadiology] = useState([]);
  const [filteredRadiology, setFilteredRadiology] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultInput, setResultInput] = useState({});
  const [expandedTests, setExpandedTests] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const navigate = useNavigate();

  const getAuthHeaders = useCallback(async () => {
    const token = await GetToken();
    return {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }, []);

  // Fetch patient radiology
  const fetchPatientRadiology = useCallback(async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const response = await fetch(
        API_ENDPOINTS.patientRadiologies(visit.visit_id),
        {
          method: 'GET',
          headers,
        },
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to fetch radiology data',
        );
      }

      const data = responseData.data || [];
      setPatientRadiology(data);
      setFilteredRadiology(data);
      setResultInput({});
      setExpandedTests({});
      setUploadedFiles({});
    } catch (error) {
      toast.error(error.message || 'Failed to fetch radiology data');
    } finally {
      setLoading(false);
    }
  }, [visit.visit_id, getAuthHeaders]);

  // Handle search
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      const filtered = patientRadiology.filter((test) =>
        test.radiology_name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredRadiology(filtered);
    },
    [patientRadiology],
  );

  // Handle file upload
  const handleFileUpload = (testId, files) => {
    const newFiles = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
    );
    if (newFiles.length !== files.length) {
      toast.warning('Only JPEG, PNG, and PDF files are supported for preview');
    }
    setUploadedFiles((prev) => ({
      ...prev,
      [testId]: [...(prev[testId] || []), ...newFiles],
    }));
  };

  // Remove file
  const handleRemoveFile = (testId, fileIndex) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [testId]: prev[testId].filter((_, idx) => idx !== fileIndex),
    }));
  };

  // Handle notes cancel
  const handleCancelNotes = (testId) => {
    setResultInput((prev) => {
      const newInput = { ...prev };
      delete newInput[testId];
      return newInput;
    });
    setExpandedTests((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[testId];
      return newExpanded;
    });
  };

  // Submit results
  const handleSubmitAllResults = useCallback(async () => {
    try {
      setLoading(true);

      const token = await GetToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        // DO NOT set Content-Type manually for FormData
      };

      const pendingTests = filteredRadiology.filter((test) => !test.result);

      if (pendingTests.length === 0) {
        toast.warning('No results to submit');
        return;
      }

      const formData = new FormData();

      pendingTests.forEach((test, index) => {
        const result = resultInput[test.id] || '';
        const files = uploadedFiles[test.id] || [];

        // Always append id
        formData.append(`patient_radiology_scans[${index}][id]`, test.id);

        // Append result if available
        if (result) {
          formData.append(`patient_radiology_scans[${index}][result]`, result);
        }

        // Append **only the first file** per scan (backend expects a single file)
        if (files.length > 0) {
          formData.append(`patient_radiology_scans[${index}][file]`, files[0]);
        }
      });

      const response = await fetch(
        API_ENDPOINTS.submitResults(visit.visit_id),
        {
          method: 'POST',
          headers,
          body: formData,
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.data?.message ||
            responseData.message ||
            'Failed to submit results',
        );
      }

      toast.success('Results submitted successfully');
      await fetchPatientRadiology();
    } catch (error) {
      toast.error(error.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }, [
    filteredRadiology,
    resultInput,
    uploadedFiles,
    visit.visit_id,
    fetchPatientRadiology,
  ]);

  const { pendingTests, completedCount } = useMemo(() => {
    const pending = filteredRadiology.filter((test) => !test.result);
    const completed = Object.values(resultInput).filter(Boolean).length;
    return { pendingTests: pending, completedCount: completed };
  }, [filteredRadiology, resultInput]);

  useEffect(() => {
    fetchPatientRadiology();
  }, [fetchPatientRadiology]);

  // File preview component
  const FilePreview = ({ file, testId, index }) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const fileURL = URL.createObjectURL(file);

    return (
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
        {isImage ? (
          <img
            src={fileURL}
            alt={file.name}
            style={{
              maxWidth: '100px',
              maxHeight: '100px',
              marginRight: '10px',
            }}
          />
        ) : isPDF ? (
          <Box sx={{ mr: 2 }}>
            <Typography variant="body2" color="text.secondary">
              📄{' '}
              <a href={fileURL} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            📎 {file.name}
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={() => handleRemoveFile(testId, index)}
          aria-label={`Remove ${file.name}`}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        aria-label="Loading radiology data"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Radiology
        </Typography>
        <TextField
          label="Search Radiology"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Card
        sx={{ borderRadius: 2, border: '1px solid #ddd', bgcolor: 'white' }}
      >
        <CardContent sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <List dense disablePadding>
              {filteredRadiology.map((test) => (
                <Paper
                  key={test.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    border: `1px solid ${test.result ? '#4caf50' : '#e0e0e0'}`,
                    bgcolor: test.result ? 'white' : 'white',
                    '&:hover': {
                      bgcolor: test.result ? 'white' : 'grey.100',
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
                          sx={{ textTransform: 'none' }}
                          aria-label={`View result for ${test.radiology_name}`}
                        >
                          View Result
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            setExpandedTests((prev) => ({
                              ...prev,
                              [test.id]: !prev[test.id],
                            }))
                          }
                          sx={{ textTransform: 'none' }}
                          aria-label={
                            expandedTests[test.id]
                              ? `Hide result for ${test.radiology_name}`
                              : `Add result for ${test.radiology_name}`
                          }
                        >
                          {expandedTests[test.id]
                            ? 'Hide Result'
                            : 'Add Result'}
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={test.radiology_name}
                      secondary={
                        test.technician && `Technician: ${test.technician}`
                      }
                      primaryTypographyProps={{
                        fontWeight: test.result ? 'bold' : 'medium',
                        color: test.result ? 'success.dark' : 'text.primary',
                      }}
                      secondaryTypographyProps={{
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>

                  {/* Expandable Result Input + File Upload */}
                  <Collapse
                    in={expandedTests[test.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box
                      sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, mt: 1 }}
                    >
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
                          Result Notes for {test.radiology_name}
                        </Typography>
                        <Box>
                          <Tooltip title="Cancel and clear notes">
                            <IconButton
                              size="small"
                              onClick={() => handleCancelNotes(test.id)}
                              aria-label={`Cancel notes for ${test.radiology_name}`}
                            >
                              <CancelIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <ReactQuill
                        theme="snow"
                        value={resultInput[test.id] || ''}
                        onChange={(value) =>
                          setResultInput((prev) => ({
                            ...prev,
                            [test.id]: value,
                          }))
                        }
                        placeholder="Enter radiology result..."
                        style={{ height: '150px', marginBottom: '20px' }}
                      />

                      <Box
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: 2,
                          p: 2,
                          mt: 4,
                          textAlign: 'center',
                          bgcolor: '#f5f5f5',
                          '&:hover': { bgcolor: '#e0e0e0' },
                        }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{ textTransform: 'none', mb: 1 }}
                          aria-label={`Upload files for ${test.radiology_name}`}
                        >
                          Upload Files (JPEG, PNG, PDF)
                          <VisuallyHiddenInput
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(event) =>
                              handleFileUpload(test.id, event.target.files)
                            }
                          />
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                          Drag and drop files here or click to upload
                        </Typography>
                      </Box>

                      {uploadedFiles[test.id]?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 'bold', mb: 1 }}
                          >
                            Uploaded Files
                          </Typography>
                          {uploadedFiles[test.id].map((file, idx) => (
                            <FilePreview
                              key={idx}
                              file={file}
                              testId={test.id}
                              index={idx}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Paper>
              ))}
            </List>
          </Box>

          {!filteredRadiology.length && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery
                  ? 'No matching radiology tests'
                  : 'No radiology tests ordered'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {pendingTests.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Completed: {completedCount} / {pendingTests.length}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAllResults}
            disabled={
              (completedCount === 0 &&
                !Object.values(uploadedFiles).some(
                  (files) => files.length > 0,
                )) ||
              loading
            }
            sx={{ textTransform: 'none' }}
            aria-label={`Submit ${completedCount} result(s)`}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              `Submit Results (${completedCount})`
            )}
          </Button>
        </Box>
      )}

      <ToastContainer />
    </Box>
  );
};

export default RadiologyTab;
