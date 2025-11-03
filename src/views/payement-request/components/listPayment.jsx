import { Search } from '@mui/icons-material';
import {
  Box,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Backend from 'services/backend';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import PageContainer from 'ui-component/MainPage';
import { DotMenu } from 'ui-component/menu/DotMenu';
import GetToken from 'utils/auth-token';
import hasPermission from 'utils/auth/hasPermission';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';

const listPayment = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
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

  const fetchPaymentRequests = async () => {
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
        throw new Error(responseData.message || 'Failed to fetch patients');
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

  useEffect(() => {
    fetchPaymentRequests();
  }, [pagination.page, pagination.per_page, search, filters]);
  return (
    <PageContainer title="Patients">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Grid item xs={10} md={12} marginBottom={3}>
            {/* <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Search
                  title="Filter Patients"
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

              {hasPermission('create_patient') && (
                <AddButton
                  title="Add Patient"
                  onPress={handleAddPatientClick}
                />
              )}
            </Box> */}
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
                  message="Unable to retrieve patients."
                />
              ) : paymentRequests.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="Patients Not Found"
                  description="The list of patients will be listed here."
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
                        {/* <TableCell>Email</TableCell> */}
                        <TableCell>Phone</TableCell>
                        {/* <TableCell>Category</TableCell> */}
                        {/* <TableCell>Date of Birth</TableCell> */}
                        <TableCell>Gender</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Status</TableCell>
                        {/* <TableCell>Assign </TableCell> */}
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentRequests.map((patient) => (
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
                          {/* <TableCell>{patient.email || 'N/A'}</TableCell> */}
                          <TableCell>{patient.phone}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={patient.patient_category}
                              color={
                                patient.patient_category === 'regular'
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                          </TableCell> */}

                          {/* <TableCell>
                            {format(
                              new Date(patient.date_of_birth),
                              'MM/dd/yyyy',
                            )}
                            </TableCell> */}
                          <TableCell>{patient.gender}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={patient.is_card_expired ? 'Pay' : 'Paid'}
                              color={patient.is_card_expired ? 'primary' : 'secondary'}
                              onClick={() => handlePaymentClick(patient)}
                              clickable={patient.is_card_expired}
                              sx={{ cursor: patient.is_card_expired ? 'default' : 'pointer' }}
                            />
                          </TableCell> */}
                          {/* <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handlePaymentClick(patient)}
                              disabled={!patient.is_card_expired} // disable if already assigned
                            >
                              {patient.is_card_expired ? 'Pay' : 'Send'}
                            </Button>
                          </TableCell> */}
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
                          </TableCell>

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
                            <DotMenu
                              onEdit={
                                hasPermission('update_patient')
                                  ? () => handlePatientUpdate(patient)
                                  : null
                              }
                              onView={() =>
                                navigate('/patients/view', { state: patient })
                              }
                              // onDelete={
                              //   hasPermission('update_patient')
                              //     ? () => handleDeletePatient(patient.id)
                              //     : null
                              // }
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

export default listPayment;
