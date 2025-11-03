import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { toast } from 'react-toastify';
import { Search } from '@mui/icons-material';
import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Chip,
  IconButton,
  Badge,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import { DotMenu } from 'ui-component/menu/DotMenu';
import hasPermission from 'utils/auth/hasPermission';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import { format } from 'date-fns';
import StarIcon from '@mui/icons-material/Star';
import AdfScannerIcon from '@mui/icons-material/AdfScanner';
import {
  Science as ScienceIcon,
  LocalPharmacy as PharmacyIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentRequest = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [radiologyPayment, setRadiologyPayment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ date: null });
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  // Fetch payment requests when laboratory is selected
  const fetchPaymentRequests = async () => {
    if (selected !== 'laboratory') return;

    setLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }

    const Api = `${Backend.auth}${Backend.laboratoryPaymentRequests}?${params.toString()}`;
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
          responseData.message || 'Failed to fetch payment requests',
        );
      }

      if (responseData.success) {
        setPaymentRequests(responseData.data.data);
        setPagination({
          ...pagination,
          last_page: responseData.data.last_page,
          total: responseData.data.total,
        });
        setError(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRadiologyRequests = async () => {
    if (selected !== 'radiology') return;

    setLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }

    const Api = `${Backend.auth}${Backend.radiologyPaymentRequests}?${params.toString()}`;
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
          responseData.message || 'Failed to fetch radiology payment requests',
        );
      }

      if (responseData.success) {
        setRadiologyPayment(responseData.data.data);
        setPagination({
          ...pagination,
          last_page: responseData.data.last_page,
          total: responseData.data.total,
        });
        setError(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment or assignment action
  const handlePaymentClick = async (patient, action) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologyPaymentRequests}/${patient.visit_id}/action`; // Adjust endpoint as needed
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const payload = {
      action: action === 1 ? 'pay' : 'assign',
      visit_id: patient.visit_id,
    };

    try {
      setLoading(true);
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(`Successfully ${action === 1 ? 'paid' : 'assigned'} request`);
        fetchPaymentRadiologyRequests(); // Refresh the list
      } else {
        toast.error(responseData.message || 'Failed to process request');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected === 'laboratory') {
      fetchPaymentRequests();
    }
    if (selected === 'radiology') {
      fetchPaymentRadiologyRequests();
    }
  }, [selected, pagination.page, pagination.per_page, search, filters]);

  const handleCardClick = (type) => {
    setSelected(type);

    if (type === 'laboratory' || type === 'radiology') {
      return; // Data will be fetched in useEffect
    }

    const mockRequests = {
      pharmacy: ['Pharmacy Request 1', 'Pharmacy Request 2'],
    };
    setRequests(mockRequests[type] || []);
  };

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      ...pagination,
      per_page: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleSearchFieldChange = (event) => {
    setSearch(event.target.value);
  };

  const cardOptions = [
    {
      type: 'laboratory',
      title: 'Laboratory',
      description: 'View and manage laboratory payment requests',
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      type: 'pharmacy',
      title: 'Pharmacy',
      description: 'View and manage pharmacy payment requests',
      icon: <PharmacyIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      type: 'radiology',
      title: 'Radiology',
      description: 'View and manage radiology payment requests',
      icon: <AdfScannerIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.dark} 100%)`,
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {!selected ? (
        <Box>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 700,
              color: theme.palette.text.primary,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Payment Requests
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Select a category to view and manage payment requests
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {cardOptions.map((option) => (
              <Grid item xs={12} sm={6} md={5} key={option.type}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    background: option.gradient,
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${alpha(option.color, 0.3)}`,
                    },
                  }}
                  onClick={() => handleCardClick(option.type)}
                >
                  <Box
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha('#fff', 0.2),
                        mb: 3,
                      }}
                    >
                      {option.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{ fontWeight: 600, textAlign: 'center' }}
                    >
                      {option.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: 'center', opacity: 0.9 }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: alpha('#000', 0.1),
                      py: 2,
                      textAlign: 'center',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: 'white' }}
                    >
                      Click to explore
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : selected === 'laboratory' ? (
        <div>
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setSelected(null)}
            startIcon={<BackIcon />}
          >
            Back
          </Button>

          <Grid container>
            <Grid item xs={12} padding={3}>
              <Grid item xs={10} md={12} marginBottom={3}>
                <Typography variant="h4" gutterBottom>
                  Payment Requests - Laboratory
                </Typography>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  {loading ? (
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 4,
                        }}
                      >
                        <ActivityIndicator size={20} />
                      </Grid>
                    </Grid>
                  ) : error ? (
                    <ErrorPrompt
                      title="Server Error"
                      message="Unable to retrieve payment requests."
                    />
                  ) : paymentRequests.length === 0 ? (
                    <Fallbacks
                      severity="evaluation"
                      title="Payment Requests Not Found"
                      description="The list of payment requests will be listed here."
                      sx={{ paddingTop: 6 }}
                    />
                  ) : (
                    <TableContainer
                      sx={{
                        minHeight: '66dvh',
                        border: 0.4,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Table
                        aria-label="payment requests table"
                        sx={{ minWidth: 650 }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>EMR Number</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paymentRequests.map((patient) => (
                            <TableRow
                              key={patient.id}
                              sx={{
                                ':hover': {
                                  backgroundColor: 'grey.50',
                                },
                              }}
                            >
                              <TableCell sx={{ alignItems: 'center', gap: 1 }}>
                                <span>{patient.full_name}</span>
                                {['vip', 'emergency'].includes(
                                  patient.patient_category,
                                ) && (
                                    <StarIcon
                                      sx={{
                                        color:
                                          patient.patient_category === 'vip'
                                            ? 'primary.main'
                                            : 'error.main',
                                        width: 14,
                                        height: 14,
                                        mt: 1,
                                      }}
                                    />
                                  )}
                              </TableCell>
                              <TableCell>{patient.emr_number}</TableCell>
                              <TableCell>{patient.phone}</TableCell>
                              <TableCell>{patient.gender}</TableCell>
                              <TableCell>
                                {patient.is_card_expired ? (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handlePaymentClick(patient, 1)}
                                  >
                                    Pay
                                  </Button>
                                ) : (
                                  <>
                                    {[
                                      'Pending',
                                      'In Progress',
                                      'No Visits',
                                    ].includes(patient?.visit_status) && (
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          size="small"
                                          onClick={() => handlePaymentClick(patient, 2)}
                                          disabled={
                                            patient?.visit_status === 'In Progress'
                                          }
                                        >
                                          Assign
                                        </Button>
                                      )}
                                  </>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={patient?.visit_status || 'N/A'}
                                  sx={{
                                    bgcolor:
                                      (patient?.visit_status || 'N/A') === 'Completed'
                                        ? 'success.light'
                                        : (patient?.visit_status || 'N/A') === 'In Progress'
                                          ? 'info.light'
                                          : (patient?.visit_status || 'N/A') === 'No Visits'
                                            ? 'warning.light'
                                            : 'grey.300',
                                    color:
                                      (patient?.visit_status || 'N/A') === 'Completed'
                                        ? 'success.contrastText'
                                        : (patient?.visit_status || 'N/A') === 'In Progress'
                                          ? 'info.contrastText'
                                          : (patient?.visit_status || 'N/A') === 'No Visits'
                                            ? 'warning.contrastText'
                                            : 'text.primary',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <DotMenu
                                  onView={() =>
                                    navigate('/payement-request/view', {
                                      state: patient,
                                    })
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        onPageChange={handleChangePage}
                        rowsPerPage={pagination.per_page}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <ToastContainer />
        </div>
      ) : selected === 'radiology' ? (
        <div>
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setSelected(null)}
            startIcon={<BackIcon />}
          >
            Back
          </Button>

          <Grid container>
            <Grid item xs={12} padding={3}>
              <Grid item xs={10} md={12} marginBottom={3}>
                <Typography variant="h4" gutterBottom>
                  Payment Requests - Radiology
                </Typography>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  {loading ? (
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 4,
                        }}
                      >
                        <ActivityIndicator size={20} />
                      </Grid>
                    </Grid>
                  ) : error ? (
                    <ErrorPrompt
                      title="Server Error"
                      message="Unable to retrieve payment requests."
                    />
                  ) : radiologyPayment.length === 0 ? (
                    <Fallbacks
                      severity="evaluation"
                      title="Payment Requests Not Found"
                      description="The list of payment requests will be listed here."
                      sx={{ paddingTop: 6 }}
                    />
                  ) : (
                    <TableContainer
                      sx={{
                        minHeight: '66dvh',
                        border: 0.4,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Table
                        aria-label="payment requests table"
                        sx={{ minWidth: 650 }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>EMR Number</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {radiologyPayment.map((patient) => (
                            <TableRow
                              key={patient.id}
                              sx={{
                                ':hover': {
                                  backgroundColor: 'grey.50',
                                },
                              }}
                            >
                              <TableCell sx={{ alignItems: 'center', gap: 1 }}>
                                <span>{patient.full_name}</span>
                                {['vip', 'emergency'].includes(
                                  patient.patient_category,
                                ) && (
                                    <StarIcon
                                      sx={{
                                        color:
                                          patient.patient_category === 'vip'
                                            ? 'primary.main'
                                            : 'error.main',
                                        width: 14,
                                        height: 14,
                                        mt: 1,
                                      }}
                                    />
                                  )}
                              </TableCell>
                              <TableCell>{patient.emr_number}</TableCell>
                              <TableCell>{patient.phone}</TableCell>
                              <TableCell>{patient.gender}</TableCell>
                              <TableCell>
                                {patient.is_card_expired ? (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handlePaymentClick(patient, 1)}
                                  >
                                    Pay
                                  </Button>
                                ) : (
                                  <>
                                    {[
                                      'Pending',
                                      'In Progress',
                                      'No Visits',
                                    ].includes(patient?.visit_status) && (
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          size="small"
                                          onClick={() => handlePaymentClick(patient, 2)}
                                          disabled={
                                            patient?.visit_status === 'In Progress'
                                          }
                                        >
                                          Assign
                                        </Button>
                                      )}
                                  </>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={patient?.visit_status || 'N/A'}
                                  sx={{
                                    bgcolor:
                                      (patient?.visit_status || 'N/A') === 'Completed'
                                        ? 'success.light'
                                        : (patient?.visit_status || 'N/A') === 'In Progress'
                                          ? 'info.light'
                                          : (patient?.visit_status || 'N/A') === 'No Visits'
                                            ? 'warning.light'
                                            : 'grey.300',
                                    color:
                                      (patient?.visit_status || 'N/A') === 'Completed'
                                        ? 'success.contrastText'
                                        : (patient?.visit_status || 'N/A') === 'In Progress'
                                          ? 'info.contrastText'
                                          : (patient?.visit_status || 'N/A') === 'No Visits'
                                            ? 'warning.contrastText'
                                            : 'text.primary',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <DotMenu
                                  onView={() =>
                                    navigate('/payement-request/view', {
                                      state: patient,
                                    })
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        onPageChange={handleChangePage}
                        rowsPerPage={pagination.per_page}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <ToastContainer />
        </div>
      ) : (
        <div>
          <Typography variant="h4" gutterBottom>
            {selected.charAt(0).toUpperCase() + selected.slice(1)} Payment
            Requests
          </Typography>
          {requests.length > 0 ? (
            <ul>
              {requests.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          ) : (
            <Typography>No payment requests found.</Typography>
          )}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setSelected(null)}
            startIcon={<BackIcon />}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentRequest;