import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';

const WebsiteRequests = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleSearchFieldChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setPagination({ ...pagination, page: 0 });
  };

  const handleFetchingAppointments = async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.appointments}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch appointments');
      }

      if (responseData.success && responseData.data) {
        const payload = responseData.data;
        setData(Array.isArray(payload.data) ? payload.data : []);
        setPagination({
          ...pagination,
          last_page: payload.last_page || 1,
          total:
            payload.total ||
            (Array.isArray(payload.data) ? payload.data.length : 0),
          per_page: payload.per_page || pagination.per_page,
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

  const handleView = (row) => {
    navigate('/patientapp/view', { state: row });
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingAppointments();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingAppointments();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  return (
    <PageContainer title="Website Requests">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Grid item xs={10} md={12} marginBottom={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Search
                title="Search Website Requests"
                value={search}
                onChange={handleSearchFieldChange}
                filter={false}
              />
            </Box>
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
                  message="Unable to retrieve website requests."
                />
              ) : data.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="No Website Requests Found"
                  description="Website requests will be listed here."
                  sx={{ paddingTop: 6 }}
                />
              ) : (
                <TableContainer
                  sx={{
                    minHeight: '66dvh',
                    border: 0.4,
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                  }}
                >
                  <Table
                    aria-label="website requests table"
                    sx={{ minWidth: 650 }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Appointment Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((appointment) => (
                        <TableRow
                          key={appointment.id}
                          sx={{
                            ':hover': {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell>{appointment.patient_name}</TableCell>
                          <TableCell>{appointment.phone_number}</TableCell>
                          <TableCell>
                            {appointment.appointment_date
                              ? format(
                                  new Date(appointment.appointment_date),
                                  'yyyy-MM-dd',
                                )
                              : ''}
                          </TableCell>
                          <TableCell>
                            {appointment.start_time && appointment.end_time
                              ? `${appointment.start_time} - ${appointment.end_time}`
                              : ''}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <IconEye
                                size={20}
                                color={theme.palette.primary.main}
                              />
                              <Typography
                                variant="body2"
                                onClick={() => handleView(appointment)}
                                sx={{
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                View
                              </Typography>
                            </Box>
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
    </PageContainer>
  );
};

export default WebsiteRequests;
