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
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { DotMenu } from 'ui-component/menu/DotMenu';
import { format } from 'date-fns';
import PageContainer from 'ui-component/MainPage';
import { Print, MoreVert, Edit, Visibility } from '@mui/icons-material';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StarIcon from '@mui/icons-material/Star';
// import ChangePassword from './componenets/ChangePassword';
import AddButton from 'ui-component/buttons/AddButton';

import { IconAdjustments } from '@tabler/icons-react';
import RightSlideIn from 'ui-component/modal/RightSlideIn';
import { useNavigate } from 'react-router-dom';
import hasPermission from 'utils/auth/hasPermission';
import FilterPatients from 'views/patients/componenets/FilterPatients';

const OutPatients = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isAssign, setIsAssign] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [add, setAdd] = useState(false);
  const [assign, setAssign] = useState(false);
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
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

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

  //// drop down for the room ///////
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

  //// drop down for the room ///////

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
    setFilters({ ...initialFilterState, date: '' });
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

  const handleFetchingPatients = async () => {
    setLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }
    const Api = `${Backend.auth}${Backend.patientsOutPatients}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch patients');
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
            'Failed to fetch patients',
        );
      }
    } catch (error) {
      toast.error('Failed to fetch patients');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientModalClose = () => {
    setAdd(false);
  };

  const handlePatientUpdate = (patientData) => {
    setSelectedRow(patientData);
    setUpdate(true);
  };

  const handleUpdatePatientClose = () => {
    setUpdate(false);
    setSelectedRow(null);
  };

  const handleChangePasswordClose = () => {
    setChange(false);
    setSelectedRow(null);
  };

  const handleAddPatientClick = () => {
    handleFetchingDoctors();
    handleFetchingRooms();
    // setAdd(true);
    navigate('/patients/add');
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingPatients();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search, filters.date]);

  useEffect(() => {
    if (mounted) {
      handleFetchingPatients();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  const handlePaymentClick = (patient, step) => {
    console.log('handlePaymentClick:', {
      patientId: patient.id,
      initialStep: step,
      isCardExpired: patient.is_card_expired,
    }); // Debug log
    navigate('/patients/add', {
      state: { patientId: patient.id, initialStep: step, patient },
    });
  };
  return (
    <PageContainer title="Out Patients">
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
                  title="Filter Out Patients"
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
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                            '0%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.4)', opacity: 0.6 },
                            '100%': { transform: 'scale(1)', opacity: 0.8 },
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
                  message="Unable to retrieve Out Patients."
                />
              ) : data.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="Out Patients Not Found"
                  description="The list of Out Patients will be listed here."
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
                  <Table aria-label="patients table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>EMR Number</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Gender</TableCell>
                        {/* <TableCell>Payment</TableCell> */}
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((patient) => (
                        <TableRow
                          key={patient.id}
                          sx={{
                            ':hover': {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell sx={{ alignItems: 'center', gap: 1 }}>
                            <span>{patient.full_name}</span>
                            {['vip', 'emergency'].includes(
                              patient.patient_category,
                            ) && (
                              <Chip
                                label={patient?.patient_category}
                                size="small"
                                sx={{
                                  bgcolor: 'success.light',
                                  color: 'success.dark',
                                  fontWeight: 500,
                                  borderRadius: '5px',
                                  ml: 1,
                                }}
                              />
                            )}
                          </TableCell>

                          <TableCell>{patient.emr_number}</TableCell>
                          <TableCell>{patient.phone}</TableCell>

                          <TableCell>{patient.gender}</TableCell>

                          {/* <TableCell>
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
                                    onClick={() =>
                                      handlePaymentClick(patient, 2)
                                    }
                                    disabled={
                                      patient?.visit_status === 'In Progress'
                                    } // only disabled
                                  >
                                    Assign
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell> */}

                          <TableCell>
                            <Chip
                              label={patient?.visit_status || 'N/A'}
                              sx={{
                                bgcolor:
                                  (patient?.visit_status || 'N/A') ===
                                  'Completed'
                                    ? 'success.light'
                                    : (patient?.visit_status || 'N/A') ===
                                        'In Progress'
                                      ? 'info.light'
                                      : (patient?.visit_status || 'N/A') ===
                                          'No Visits'
                                        ? 'warning.light'
                                        : 'grey.300',
                                color:
                                  (patient?.visit_status || 'N/A') ===
                                  'Completed'
                                    ? 'success.contrastText'
                                    : (patient?.visit_status || 'N/A') ===
                                        'In Progress'
                                      ? 'info.contrastText'
                                      : (patient?.visit_status || 'N/A') ===
                                          'No Visits'
                                        ? 'warning.contrastText'
                                        : 'text.primary',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {hasPermission('update_patient') && (
                                <IconButton
                                  onClick={() => handlePatientUpdate(patient)}
                                  sx={{
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                  }}
                                >
                                  <Tooltip title="Edit Patient">
                                    <Edit fontSize="small" />
                                  </Tooltip>
                                </IconButton>
                              )}

                              {/* View button */}
                              <IconButton
                                onClick={() =>
                                  navigate('/patients/view', { state: patient })
                                }
                                sx={{
                                  '&:hover': { backgroundColor: '#f5f5f5' },
                                }}
                              >
                                <Tooltip title="View Patient">
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

export default OutPatients;
