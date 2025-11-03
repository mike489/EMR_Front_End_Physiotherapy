import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import { useNavigate } from 'react-router-dom';
import DrogaButton from 'ui-component/buttons/DrogaButton';

const Doctorlistt = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [pagination, setPagination] = useState({ page: 0, per_page: 10, total: 0 });

  const handleChangePage = (event, newPage) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const per = parseInt(event.target.value, 10);
    setPagination({ page: 0, per_page: per, total: pagination.total });
  };

  const fetchDoctors = async () => {
    setLoading(true);
    const token = await GetToken();
    const params = new URLSearchParams();
    params.append('per_page', pagination.per_page);
    params.append('page', pagination.page + 1);
    const Api = `${Backend.auth}${Backend.doctorsPaginate}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'Failed to fetch doctors');

      if (responseData.success) {
        const payload = responseData?.data;
        const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        setDoctors(rows || []);
        setPagination((p) => ({ ...p, total: payload?.total || rows.length }));
        setError(false);
      } else {
        toast.warning(responseData.message || 'Unable to load doctors');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page]);

  return (
    <PageContainer title="Doctors">
      <Grid container>
        <Grid item xs={12} padding={3}>
          {loading ? (
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}
              >
                <ActivityIndicator size={20} />
              </Grid>
            </Grid>
          ) : error ? (
            <ErrorPrompt title="Server Error" message="Unable to retrieve doctors." />
          ) : doctors.length === 0 ? (
            <Fallbacks
              severity="evaluation"
              title="No Doctors Found"
              description="Doctors will appear here once available."
              sx={{ paddingTop: 6 }}
            />
          ) : (
            <TableContainer sx={{ border: 0.4, borderColor: 'divider', borderRadius: 2 }}>
              <Table aria-label="doctors table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <Typography>{doctor.name || doctor.full_name || 'Unnamed Doctor'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{doctor.email || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{doctor.phone || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {doctor.created_at ? format(new Date(doctor.created_at), 'yyyy-MM-dd') : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const isActive = String(doctor.status || '').toLowerCase() === 'active';
                          return isActive ? (
                            <Chip label="Active" sx={{ backgroundColor: '#d8edd9', color: 'green' }} />
                          ) : (
                            <Chip label="Inactive" sx={{ backgroundColor: '#f7e4e4', color: 'red' }} />
                          );
                        })()}
                      </TableCell>
                      <TableCell align="right">
                        <DrogaButton 
                          title="View" 
                          size="small"  
                          onPress={() => navigate('/doctors/view', { state: doctor })} 
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
      
     

      {/* <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Box sx={{ px: 2, py: 1.5, minWidth: 220 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="set-availability-label">Set availability</InputLabel>
            <Select
              labelId="set-availability-label"
              label="Set availability"
              value={availability[activeDoctorId] || ''}
              onChange={handleAvailabilityChange}
            >
              <option value="" />
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="busy">Busy</option>
            </Select>
          </FormControl>
        </Box>
      </Menu> */}

      <ToastContainer />
    </PageContainer>
  );
};

export default Doctorlistt;
