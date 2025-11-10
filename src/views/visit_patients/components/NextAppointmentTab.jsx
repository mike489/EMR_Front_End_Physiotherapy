import React, { useEffect, useState } from 'react';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import DrogaButton from 'ui-component/buttons/DrogaButton';
import { getStatusColor } from 'utils/function';

const NextAppointmentTab = ({ visit }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [addOpen, setAddOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    appointment_date: '',
    time: '',
    patient_id: '',
    visit_id: '',
  });
  const [visitPatients, setVisitPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({
    patient_id: '',
    visit_id: '',
  });

  // Fetch patients for dropdown
  const fetchPatients = async () => {
    setPatientsLoading(true);
    const token = await GetToken();

    const Api = `${Backend.auth}${Backend.getVisits}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setVisitPatients(responseData.data.data || []);
      } else {
        toast.warning('Failed to fetch patients');
      }
    } catch (error) {
      toast.error('An error occurred while fetching patients');
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleFetchAppointments = async (visitId = null) => {
    // Use provided visitId, selected patient's visit_id, or fall back to the visit prop
    const actualVisitId =
      visitId ||
      selectedPatient.visit_id ||
      visit?.visit_id ||
      visit?.id ||
      visit?.visit?.id;
    if (!actualVisitId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const token = await GetToken();

    const Api = `${Backend.auth}${Backend.nextVisitAppointments}/${actualVisitId}?page=${pagination.page + 1}&per_page=${pagination.per_page}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        const payload = result.data;
        setData(Array.isArray(payload.data) ? payload.data : []);
        setPagination({
          ...pagination,
          last_page: payload.last_page || 1,
          total: payload.total || 0,
        });
        setError(false);
      } else {
        toast.warning('Unable to load next appointments');
        setData([]);
      }
    } catch (err) {
      toast.error(err.message);
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle patient selection from the main dropdown
  const handleMainPatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const selectedPatientData = visitPatients.find(
      (patient) => patient.id === selectedPatientId,
    );

    const newSelection = {
      patient_id: selectedPatientId,
      visit_id: selectedPatientData?.visit_id || '',
    };

    setSelectedPatient(newSelection);

    // Update form with the same selection
    setForm({
      ...form,
      ...newSelection,
    });
  };

  // Handle patient selection in the modal
  const handleModalPatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const selectedPatientData = visitPatients.find(
      (patient) => patient.id === selectedPatientId,
    );

    setForm({
      ...form,
      patient_id: selectedPatientId,
      visit_id: selectedPatientData?.visit_id || '',
    });
  };

  useEffect(() => {
    // Fetch patients when component mounts
    fetchPatients();
  }, []);

  useEffect(() => {
    // Fetch appointments when selected patient changes
    if (
      selectedPatient.visit_id ||
      visit?.visit_id ||
      visit?.id ||
      visit?.visit?.id
    ) {
      handleFetchAppointments();
    }
  }, [
    selectedPatient.visit_id,
    visit?.id,
    pagination.page,
    pagination.per_page,
  ]);

  const handleOpenAdd = () => {
    // Pre-fill the modal with the currently selected patient, or reset if none
    setForm({
      appointment_date: '',
      time: '',
      patient_id: selectedPatient.patient_id || '',
      visit_id: selectedPatient.visit_id || '',
    });
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  const handleCreateNextVisit = async () => {
    // Use the visit_id from form, or fall back to the selected patient
    const visitId = form.visit_id || selectedPatient.visit_id;

    if (!visitId) {
      toast.error('Please select a patient with a valid visit');
      return;
    }

    if (!form.appointment_date || !form.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    const token = await GetToken();
    const Api = `${Backend.auth}next-visit-appointment/${visitId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const payload = {
      appointment_date: form.appointment_date,
      time: form.time,
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(
          result?.data?.message || result?.message || 'Created successfully',
        );
        setAddOpen(false);
        setConfirmOpen(false);
        setPagination((p) => ({ ...p, page: 0 }));
        await handleFetchAppointments(visitId);
      } else {
        throw new Error(
          result?.data?.message || result?.message || 'Failed to create',
        );
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* Header Section with Patient Dropdown */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            gap: 2,
            flex: 1,
          }}
        >
          <Typography variant="h3">Next Visit Appointments</Typography>

          {/* Patient Dropdown - Outside */}
          <TextField
            select
            label="Select Patient"
            value={selectedPatient.patient_id}
            onChange={handleMainPatientChange}
            sx={{ minWidth: 250 }}
            disabled={patientsLoading}
            size="small"
            helperText={
              patientsLoading ? 'Loading patients...' : 'Filter by patient'
            }
          >
            <MenuItem value="">
              <em>All Patients</em>
            </MenuItem>
            {visitPatients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.patient_name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <IconButton
          color="primary"
          aria-label="add appointment"
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: 'white',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Data Display */}
      {loading ? (
        <Grid container justifyContent="center" padding={4}>
          <ActivityIndicator size={20} />
        </Grid>
      ) : error ? (
        <ErrorPrompt
          title="Server Error"
          message="Unable to retrieve next visit appointments"
        />
      ) : data.length === 0 ? (
        <Fallbacks
          severity="appointments"
          title="No Next Appointments"
          description={
            selectedPatient.patient_id
              ? 'No next appointments found for the selected patient'
              : 'Select a patient to view their next appointments'
          }
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.patient_name || '-'}</TableCell>
                    <TableCell>{row.phone_number || '-'}</TableCell>
                    <TableCell>{row.email || '-'}</TableCell>
                    <TableCell>{row.age ?? '-'}</TableCell>
                    <TableCell>{row.gender || '-'}</TableCell>
                    <TableCell>
                      {row.appointment_date
                        ? format(new Date(row.appointment_date), 'yyyy-MM-dd')
                        : '-'}
                    </TableCell>
                    <TableCell>{row.time || '-'}</TableCell>
                    <TableCell>
                      <DrogaButton
                        variant="text"
                        title={row.status || '-'}
                        onPress={() => {}}
                        sx={{
                          color: getStatusColor(row.status || ''),
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Add Next Visit Modal */}
      <Dialog open={addOpen} onClose={handleCloseAdd} fullWidth maxWidth="sm">
        <DialogTitle>Add Next Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Patient Dropdown in Modal */}
            <TextField
              select
              label="Patient"
              value={form.patient_id}
              onChange={handleModalPatientChange}
              fullWidth
              disabled={patientsLoading}
              helperText={
                patientsLoading
                  ? 'Loading patients...'
                  : 'Select a patient for the appointment'
              }
            >
              {visitPatients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.patient_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Appointment Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.appointment_date}
              onChange={(e) =>
                setForm({ ...form, appointment_date: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <DrogaButton title="Cancel" variant="text" onPress={handleCloseAdd} />
          <DrogaButton
            title="Create"
            onPress={() => setConfirmOpen(true)}
            disabled={
              !form.patient_id ||
              !form.visit_id ||
              !form.appointment_date ||
              !form.time
            }
          />
        </DialogActions>
      </Dialog>

      {/* Confirm Create Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Creation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to create the next visit appointment?
          </Typography>
          {form.visit_id && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Visit ID: {form.visit_id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <DrogaButton
            title="No"
            variant="text"
            onPress={() => setConfirmOpen(false)}
          />
          <DrogaButton
            title="Yes, Create"
            loading={creating}
            onPress={handleCreateNextVisit}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NextAppointmentTab;
