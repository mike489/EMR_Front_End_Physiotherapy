import React, { useEffect, useMemo, useState } from 'react';
import PageContainer from 'ui-component/MainPage';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const DAY_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const PERIOD_OPTIONS = [
  { value: 'Weekdays', label: 'Weekdays' },
  { value: 'Weekends', label: 'Weekends' },
  { value: 'Everyday', label: 'Everyday' },
  { value: 'Custom', label: 'Custom' },
];

const ScheduleDoctor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctor = state?.doctor || {};

  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [visitPatients, setVisitPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [period, setPeriod] = useState('Weekdays');
  const [customDays, setCustomDays] = useState([]);
  const [customDates, setCustomDates] = useState(['']);
  const [timeSlots, setTimeSlots] = useState([
    { start_time: '', end_time: '' },
  ]);
  const [selectedPatient, setSelectedPatient] = useState({
    patient_id: '',
    visit_id: '',
    patient_name: '',
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

  const toSqlDate = (local) => {
    if (!local) return '';
    const [datePart] = local.split('T');
    return datePart || '';
  };

  const fetchExisting = async () => {
    if (!doctor?.id) return;
    try {
      const token = await GetToken();
      const params = new URLSearchParams();
      params.append('doctor', doctor.id);
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.DocAvailabilities}?${params.toString()}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const res = await fetch(Api, { method: 'GET', headers: header });
      const data = await res.json();
      const payload = Array.isArray(data?.data)
        ? data.data
        : data?.data?.data || [];
      setExisting(payload);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchExisting();
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id]);

  // Handle patient selection
  const handlePatientChange = (e) => {
    const selectedPatientId = e.target.value;
    const selectedPatientData = visitPatients.find(
      (patient) => patient.id === selectedPatientId,
    );

    if (selectedPatientData) {
      setSelectedPatient({
        patient_id: selectedPatientId,
        visit_id: selectedPatientData.visit_id || '',
        patient_name: selectedPatientData.patient_name || '',
      });
    } else {
      setSelectedPatient({
        patient_id: '',
        visit_id: '',
        patient_name: '',
      });
    }
  };

  const handleAddSlot = () => {
    setTimeSlots((s) => [...s, { start_time: '', end_time: '' }]);
  };

  const handleRemoveSlot = (idx) => {
    setTimeSlots((s) => s.filter((_, i) => i !== idx));
  };

  const handleSlotChange = (idx, field, value) => {
    setTimeSlots((s) =>
      s.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)),
    );
  };

  const findExistingMatch = () => {
    if (!Array.isArray(existing)) return null;

    // Normalize time slots for comparison
    const normalizeTimeSlots = (slots) => {
      return (slots || [])
        .map((slot) => ({
          start_time: slot.start_time || '',
          end_time: slot.end_time || '',
        }))
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .map((slot) => `${slot.start_time}-${slot.end_time}`)
        .join('|');
    };

    const currentTimeSlots = normalizeTimeSlots(timeSlots);

    if (period !== 'Custom') {
      return (
        existing.find((row) => {
          if ((row.period || '').toLowerCase() !== period.toLowerCase())
            return false;
          const existingTimeSlots = normalizeTimeSlots(row.time_slots);
          return existingTimeSlots === currentTimeSlots;
        }) || null
      );
    }

    // For Custom, match by identical day set AND identical time slots
    const norm = (arr) =>
      (arr || [])
        .map((d) => String(d).toLowerCase())
        .sort()
        .join(',');
    const target = norm(customDays);
    if (!target) return null;

    return (
      existing.find((row) => {
        if (norm(row.days) !== target) return false;
        const existingTimeSlots = normalizeTimeSlots(row.time_slots);
        return existingTimeSlots === currentTimeSlots;
      }) || null
    );
  };

  const validate = () => {
    setError('');

    // Validate patient selection
    if (!selectedPatient.patient_id || !selectedPatient.visit_id) {
      return 'Please select a patient with a valid visit';
    }

    if (!doctor?.id) return 'Doctor not provided';
    if (!period) return 'Select a period';
    if (period === 'Custom') {
      const validDates = (customDates || [])
        .map((d) => d && toSqlDate(d))
        .filter((d) => !!d);
      if (validDates.length === 0)
        return 'Select at least one date for custom period';
    }
    if (timeSlots.length === 0) return 'Add at least one time slot';
    for (const slot of timeSlots) {
      if (!slot.start_time || !slot.end_time)
        return 'Each slot needs start and end time';
      if (slot.end_time <= slot.start_time)
        return 'End time must be after start time';
    }

    // Check for duplicate availability (same period AND same time slots)
    const duplicate = findExistingMatch();
    if (duplicate) {
      return `${period} availability with the same time slots already exists for this doctor. Please choose different time slots or edit the existing one.`;
    }

    return '';
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }

    setLoading(true);
    setSuccess('');
    try {
      const token = await GetToken();
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.DocAvailabilities}/${doctor.id}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };

      // Include patient and visit information in the payload
      const basePayload = {
        doctor_id: doctor.id,
        patient_id: selectedPatient.patient_id,
        visit_id: selectedPatient.visit_id,
        patient_name: selectedPatient.patient_name,
      };

      if (period === 'Custom') {
        const validDates = (customDates || [])
          .map((d) => d && toSqlDate(d))
          .filter((d) => !!d);
        const customPayload = validDates.map((dateStr) => ({
          date: dateStr,
          time_slots: timeSlots,
        }));
        const body = {
          ...basePayload,
          period: 'Custom',
          custom_dates: customPayload,
        };
        const res = await fetch(Api, {
          method: 'POST',
          headers: header,
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          const msg =
            data?.data?.message ||
            data?.message ||
            'Failed to create availability';
          throw new Error(msg);
        }
      } else {
        const body = {
          ...basePayload,
          period,
          time_slots: timeSlots,
        };
        const res = await fetch(Api, {
          method: 'POST',
          headers: header,
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          const msg =
            data?.data?.message ||
            data?.message ||
            'Failed to create availability';
          throw new Error(msg);
        }
      }

      setSuccess('Availability created successfully');
      toast.success('Availability created successfully ✅');

      window.dispatchEvent(new CustomEvent('availabilityUpdated'));
      navigate('/doctors/view', { state: { ...state, doctor, initialTab: 1 } });
    } catch (e) {
      const message = e?.message || 'Failed to create availability';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer back={true} title="Schedule Doctor">
      <Card sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Patient Selection Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Patient"
              value={selectedPatient.patient_id}
              onChange={handlePatientChange}
              disabled={patientsLoading}
              helperText={
                patientsLoading
                  ? 'Loading patients...'
                  : 'Select a patient to associate with this availability'
              }
            >
              <MenuItem value="">
                <em>Select a patient</em>
              </MenuItem>
              {visitPatients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.patient_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              size="small"
              label="Period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {period === 'Custom' && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Custom Dates
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customDates.map((d, idx) => (
                  <Box
                    key={`date-${idx}`}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <TextField
                      type="date"
                      label={`Date ${idx + 1}`}
                      size="small"
                      value={d}
                      onChange={(e) =>
                        setCustomDates((arr) =>
                          arr.map((v, i) => (i === idx ? e.target.value : v)),
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        setCustomDates((arr) => arr.filter((_, i) => i !== idx))
                      }
                      disabled={customDates.length === 1}
                    >
                      <Remove />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => setCustomDates((arr) => [...arr, ''])}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Time Slots
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {timeSlots.map((slot, idx) => (
                <Box
                  key={`slot-${idx}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={2} sx={{ flex: 1 }}>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="Start Time"
                        fullWidth
                        size="small"
                        value={slot.start_time}
                        onChange={(e) =>
                          handleSlotChange(idx, 'start_time', e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="End Time"
                        fullWidth
                        size="small"
                        value={slot.end_time}
                        onChange={(e) =>
                          handleSlotChange(idx, 'end_time', e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveSlot(idx)}
                    disabled={timeSlots.length === 1}
                    sx={{
                      border: '1px solid #d32f2f',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      ml: 1,
                    }}
                  >
                    <Remove />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddSlot}
                variant="outlined"
                sx={{
                  alignSelf: 'flex-start',
                  borderColor: '#567837',
                  color: '#567837',
                  '&:hover': {
                    borderColor: '#567837',
                    backgroundColor: '#567837',
                    color: 'white',
                  },
                }}
              >
                Add Slot
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading || !selectedPatient.patient_id}
              >
                {loading ? 'Saving…' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <ToastContainer />
    </PageContainer>
  );
};

export default ScheduleDoctor;
