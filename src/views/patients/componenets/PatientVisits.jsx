import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  TablePagination,
  Button,
  Collapse,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Event as EventIcon,
  MedicalServices as VisitTypeIcon,
  History as LogIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { getStatusColor } from 'utils/function';

const PatientVisits = ({ patient }) => {
  const [patientVisits, setPatientVisits] = useState([]);
  const [expandedVisitId, setExpandedVisitId] = useState(null);
  const [visitLogs, setVisitLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingLogs, setLoadingLogs] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleFetchingPatientVisits = async () => {
    const token = await GetToken();

    const Api = `${Backend.auth}${Backend.patientVisits}/${patient.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setPatientVisits(responseData.data.data);
      } else {
        setError(responseData.message || 'Failed to fetch patient visits');
      }
    } catch (error) {
      setError(
        error.message || 'An error occurred while fetching patient visits',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchVisitLogs = async (visitId) => {
    // If logs are already loaded, just toggle the expand
    if (visitLogs[visitId]) {
      setExpandedVisitId(expandedVisitId === visitId ? null : visitId);
      return;
    }

    // Set loading state for this specific visit
    setLoadingLogs((prev) => ({ ...prev, [visitId]: true }));

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getVisitLogs}/${visitId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setVisitLogs((prev) => ({
          ...prev,
          [visitId]: responseData.data.data || [],
        }));
        setExpandedVisitId(visitId);
      } else {
        setError(responseData.message || 'Failed to fetch visit logs');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching visit logs');
    } finally {
      setLoadingLogs((prev) => ({ ...prev, [visitId]: false }));
    }
  };

  const toggleExpand = (visitId) => {
    if (expandedVisitId === visitId) {
      setExpandedVisitId(null);
    } else {
      handleFetchVisitLogs(visitId);
    }
  };

  useEffect(() => {
    handleFetchingPatientVisits();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading patient visits...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <PersonIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight="600">
            Patient Visits
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Total Visits: {patientVisits.length}
          </Typography>
        </Box>
      </Paper>

      {patientVisits.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Patient Name
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Visit Type
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Visit Date
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientVisits
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((visit) => (
                    <React.Fragment key={visit.id}>
                      <TableRow
                        sx={{
                          '&:nth-of-type(even)': { bgcolor: 'grey.50' },
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {visit.full_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <VisitTypeIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {visit.visit_type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <EventIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {formatDate(visit.visit_date)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={visit.visit_status}
                            sx={getStatusColor(visit.visit_status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex">
                            <IconButton
                              color="primary"
                              onClick={() => toggleExpand(visit.id)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              {expandedVisitId === visit.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={expandedVisitId === visit.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                margin: 2,
                                p: 2,
                                bgcolor: 'grey.50',
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" mb={2}>
                                <LogIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Visit Logs</Typography>
                                {loadingLogs[visit.id] && (
                                  <CircularProgress size={20} sx={{ ml: 2 }} />
                                )}
                              </Box>

                              {visitLogs[visit.id] &&
                              visitLogs[visit.id].length > 0 ? (
                                <Card variant="outlined">
                                  <CardContent sx={{ p: 0 }}>
                                    <List>
                                      {visitLogs[visit.id].map((log, index) => (
                                        <React.Fragment key={index}>
                                          <ListItem alignItems="flex-start">
                                            <ListItemText
                                              primary={log.event}
                                              secondary={
                                                <React.Fragment>
                                                  <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                  >
                                                    Status: {log.status}
                                                  </Typography>
                                                  {` — ${formatDateTime(log.created_at)}`}
                                                </React.Fragment>
                                              }
                                            />
                                          </ListItem>
                                          {index <
                                            visitLogs[visit.id].length - 1 && (
                                            <Divider
                                              variant="inset"
                                              component="li"
                                            />
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </List>
                                  </CardContent>
                                </Card>
                              ) : (
                                !loadingLogs[visit.id] && (
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    No logs available for this visit.
                                  </Typography>
                                )
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={patientVisits.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}
        >
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No visits found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            There are no visits recorded for this patient.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/visits/schedule')}
          >
            Schedule New Visit
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PatientVisits;
