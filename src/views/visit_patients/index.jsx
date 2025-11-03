import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  Tooltip,
  Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { DotMenu } from 'ui-component/menu/DotMenu';
import { format } from 'date-fns';
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import { Print, MoreVert, Edit, Check, Visibility } from '@mui/icons-material';
import { IconAdjustments } from '@tabler/icons-react';
import RightSlideIn from 'ui-component/modal/RightSlideIn';
import { useNavigate } from 'react-router-dom';
import FilterPatients from 'views/patients/componenets/FilterPatients';
import { date } from 'yup';
import SendToRoomModal from 'views/patients/componenets/SendToRoomModal';
import hasPermission from 'utils/auth/hasPermission';

const VisitPatients = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [add, setAdd] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [assign, setAssign] = useState(false);
  const [visit, setVisit] = useState({});
  const [visitStatus, setVisitStatus] = useState('');
  const statuses = ['Pending', 'In Progress', 'Completed'];

  const navigate = useNavigate();

  //  ------------ FILTER EMPLOYEES ----------- START -------

  const initialFilterState = {
    id: 'asc',
    name: 'asc',
    gender: 'All',
    rooms: 'All',
    full_name: 'All',
    sort_by: '',
    sort_order: '',
    eligibility: 'All',
    created_at: 'asc',
    date: '',
  };
  const [filters, setFilters] = useState(initialFilterState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenSendModal = async (patient) => {
    await handleFetchingRooms();
    await handleFetchingDoctors();
    setSelectedPatient(patient);
    setOpenSendModal(true);
  };

  const handleCloseSendModal = () => {
    setOpenSendModal(false);
    setSelectedPatient(null);
    setAssign(false);
  };

  const handleRoomSelect = (room) => {
    // Here you would typically make an API call to assign the patient to the room
    toast.success(`${selectedPatient.full_name} sent to ${room.name}`);
    handleCloseSendModal();
  };

  const handleSorting = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      sort_by: name,
      sort_order: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      ...initialFilterState,
      date: '',
    });
  };

  const handleOpeningFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleClosingFilterModal = () => {
    setOpenFilterModal(false);
  };

  useEffect(() => {
    const isFilterApplied = Object.keys(initialFilterState).some(
      (key) => filters[key] !== initialFilterState[key],
    );

    setFilterApplied(isFilterApplied);
  }, [filters]);

  //  ------------ FILTER EMPLOYEES ----------- END -------

  // Pagination and search handlers
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

  const handleFetchingVisitPatients = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleFetchingRooms = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.rooms}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setRooms(responseData.data);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleFetchingDoctors = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getDoctors}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setDoctors(responseData.data);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handlePatientModalClose = () => {
    setAdd(false);
  };

  const handlePatientUpdate = (visitData) => {
    setSelectedRow(visitData);
    setUpdate(true);
  };

  const handleUpdatePatientClose = () => {
    setUpdate(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingVisitPatients();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search, filters.date]);

  useEffect(() => {
    if (mounted) {
      handleFetchingVisitPatients();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  const handleStatusUpdate = async (visit) => {
    if (!visit?.id) {
      toast.error('Visit ID is missing');
      return;
    }

    // Allow update only if current status is Pending
    if (visit.status !== 'Pending') {
      toast.warning('Only visits with status "Pending" can be accepted.');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.acceptPatient}/${visit.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({ status: 'In Progress' }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Patient visit status updated to In Progress');
        handleFetchingVisitPatients(); // refresh table
      } else {
        toast.error(responseData.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    }
  };

  const handleStatusFinish = async (visit) => {
    if (!visit?.id) {
      toast.error('Visit ID is missing');
      return;
    }

    // Allow update only if current status is In Progress
    if (visit.status !== 'In Progress') {
      toast.warning('Only visits with status "In Progress" can be finished.');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.finishPatient}/${visit.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({ status: 'In Progress' }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Patient visit status updated to In Progress');
        handleFetchingVisitPatients();
      } else {
        toast.error(responseData.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    }
  };

  return (
    <PageContainer title="Visits">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Grid item xs={10} md={12} marginBottom={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Search
                  title="Filter Visits"
                  value={search}
                  onChange={(event) => handleSearchFieldChange(event)}
                  filter={false}
                />

                <IconButton
                  sx={{ ml: 1.2, p: 1.2, backgroundColor: 'grey.50' }}
                  onClick={() => handleOpeningFilterModal()}
                >
                  <IconAdjustments size="1.4rem" stroke="1.8" />
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      display: filterApplied ? 'flex' : 'none',
                      position: 'absolute',
                      top: 12,
                      right: 11,
                    }}
                    badgeContent={
                      <Box
                        sx={{
                          position: 'relative',
                          width: 5,
                          height: 5,
                          ml: 0.6,
                          backgroundColor: 'red',
                          borderRadius: '50%',
                          animation: 'pulse 4s infinite ease-out',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.4)',
                              opacity: 0.6,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 0.8,
                            },
                          },
                        }}
                      />
                    }
                  />
                </IconButton>
              </Box>
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
                  message="Unable to retrieve visits."
                />
              ) : data.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="Visits Not Found"
                  description="The list of visits will be listed here."
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
                  <Table aria-label="visits table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>EMR Number</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Visit Date</TableCell>
                        {/* <TableCell>Created By</TableCell> */}
                        <TableCell>Status </TableCell>
                        {/* <TableCell>Created At</TableCell> */}
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((visit) => (
                        <TableRow
                          key={visit.id}
                          sx={{
                            ':hover': {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell>{visit?.emr_number}</TableCell>
                          <TableCell>{visit.patient_name}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={visit?.visit_type}
                              color={
                                visit.visit_type === 'Consultation'
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                          </TableCell> */}
                          <TableCell>{visit?.visit_date}</TableCell>
                          {/* <TableCell>{visit?.created_by}</TableCell> */}
                          <TableCell>
                            <Chip
                              label={visit?.status || 'Unknown'}
                              sx={{
                                bgcolor:
                                  visit?.status === 'Completed'
                                    ? 'success.light'
                                    : visit?.status === 'In Progress'
                                      ? 'info.light'
                                      : 'secondary.light',
                                color:
                                  visit?.status === 'Completed'
                                    ? 'success.contrastText'
                                    : visit?.status === 'In Progress'
                                      ? 'info.contrastText'
                                      : 'secondary.contrastText',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>
                          {/* <TableCell>
                            {visit?.created_at && (
                              <span>
                                {format(new Date(visit?.created_at), 'MM/dd/yyyy HH:mm')}
                              </span>
                            )}
                          </TableCell> */}
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {/* Edit button */}
                              {hasPermission('update_visit') && (
                                <IconButton
                                  onClick={() => handlePatientUpdate(visit)}
                                  sx={{
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                  }}
                                >
                                  <Tooltip title="Edit Visit">
                                    <Edit fontSize="small" />
                                  </Tooltip>
                                </IconButton>
                              )}

                              {/* Accept / Status button */}
                              {visit.status === 'Pending' && (
                                <IconButton
                                  onClick={() => handleStatusUpdate(visit)}
                                  sx={{
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                  }}
                                >
                                  <Tooltip title="Accept Visit">
                                    <Check fontSize="small" />
                                  </Tooltip>
                                  {/* Optional red dot */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -2,
                                      right: -2,
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      backgroundColor: 'red',
                                      animation: 'blink 1.5s infinite',
                                      '@keyframes blink': {
                                        '0%, 100%': {
                                          opacity: 1,
                                          transform: 'scale(1)',
                                        },
                                        '50%': {
                                          opacity: 0.4,
                                          transform: 'scale(1.3)',
                                        },
                                      },
                                    }}
                                  />
                                </IconButton>
                              )}

                              {/* Finish / Status button */}
                              {visit.status === 'In Progress' && (
                                <IconButton
                                  onClick={() => handleStatusFinish(visit)}
                                  sx={{
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{ ml: 0.5 }}
                                  >
                                    Finish
                                  </Typography>
                                </IconButton>
                              )}

                              {/* View button */}
                              <IconButton
                                onClick={() =>
                                  navigate('/visit_patients/view', {
                                    state: visit,
                                  })
                                }
                                sx={{
                                  '&:hover': { backgroundColor: '#f5f5f5' },
                                }}
                              >
                                <Tooltip title="View Visit">
                                  <Visibility fontSize="small" />
                                </Tooltip>
                              </IconButton>
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

      <SendToRoomModal
        open={openSendModal}
        onClose={handleCloseSendModal}
        patient={selectedPatient}
        rooms={rooms}
        doctors={doctors}
        onRoomSelect={handleRoomSelect}
      />
      <RightSlideIn
        title="Filter Patients"
        open={openFilterModal}
        handleClose={handleClosingFilterModal}
      >
        <FilterPatients
          filters={filters}
          onInputChange={handleChange}
          onReset={handleReset}
          onSort={(name, value) => handleSorting(name, value)}
        />
      </RightSlideIn>
    </PageContainer>
  );
};

export default VisitPatients;
