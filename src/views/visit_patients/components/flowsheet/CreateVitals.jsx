import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const CreateVitals = ({ visit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [vitalData, setVitalData] = useState({
    temperature: '',
    heart_rate: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    blood_pressure: '',
    bp_method: '',
    bp_location: '',
  });
  const [errors, setErrors] = useState({});

  // Options for bp_method and bp_location (example values, adjust as needed)
  const bpMethodOptions = ['Manual', 'Automatic', 'Digital'];
  const bpLocationOptions = ['Left Arm', 'Right Arm', 'Left Wrist', 'Right Wrist'];

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Temperature validation
    if (!vitalData.temperature) {
      newErrors.temperature = 'Temperature is required';
      isValid = false;
    } else if (isNaN(vitalData.temperature) || vitalData.temperature === '') {
      newErrors.temperature = 'Temperature must be a number';
      isValid = false;
    } else {
      const temp = parseFloat(vitalData.temperature);
      if (temp < 30.0 || temp > 42.0) {
        newErrors.temperature = 'Temperature must be between 30.0 and 42.0°C';
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(vitalData.temperature)) {
        newErrors.temperature = 'Temperature can have up to 2 decimal places';
        isValid = false;
      }
    }

    // Heart Rate validation
    if (!vitalData.heart_rate) {
      newErrors.heart_rate = 'Heart Rate is required';
      isValid = false;
    } else if (isNaN(vitalData.heart_rate) || vitalData.heart_rate === '') {
      newErrors.heart_rate = 'Heart Rate must be a number';
      isValid = false;
    } else {
      const hr = parseInt(vitalData.heart_rate, 10);
      if (hr < 30 || hr > 200) {
        newErrors.heart_rate = 'Heart Rate must be between 30 and 200 bpm';
        isValid = false;
      } else if (!/^\d+$/.test(vitalData.heart_rate)) {
        newErrors.heart_rate = 'Heart Rate must be an integer';
        isValid = false;
      }
    }

    // Respiratory Rate validation
    if (!vitalData.respiratory_rate) {
      newErrors.respiratory_rate = 'Respiratory Rate is required';
      isValid = false;
    } else if (isNaN(vitalData.respiratory_rate) || vitalData.respiratory_rate === '') {
      newErrors.respiratory_rate = 'Respiratory Rate must be a number';
      isValid = false;
    } else {
      const rr = parseInt(vitalData.respiratory_rate, 10);
      if (rr < 12 || rr > 60) {
        newErrors.respiratory_rate = 'Respiratory Rate must be between 12 and 60 breaths per minute';
        isValid = false;
      } else if (!/^\d+$/.test(vitalData.respiratory_rate)) {
        newErrors.respiratory_rate = 'Respiratory Rate must be an integer';
        isValid = false;
      }
    }

    // Oxygen Saturation validation
    if (!vitalData.oxygen_saturation) {
      newErrors.oxygen_saturation = 'Oxygen Saturation is required';
      isValid = false;
    } else if (isNaN(vitalData.oxygen_saturation) || vitalData.oxygen_saturation === '') {
      newErrors.oxygen_saturation = 'Oxygen Saturation must be a number';
      isValid = false;
    } else {
      const spo2 = parseInt(vitalData.oxygen_saturation, 10);
      if (spo2 < 0 || spo2 > 100) {
        newErrors.oxygen_saturation = 'Oxygen Saturation must be between 0 and 100%';
        isValid = false;
      } else if (!/^\d+$/.test(vitalData.oxygen_saturation)) {
        newErrors.oxygen_saturation = 'Oxygen Saturation must be an integer';
        isValid = false;
      }
    }

    // Blood Pressure validation
    if (!vitalData.blood_pressure) {
      newErrors.blood_pressure = 'Blood Pressure is required';
      isValid = false;
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(vitalData.blood_pressure)) {
      newErrors.blood_pressure = 'Blood Pressure must be in the format XXX/YY (e.g., 120/80)';
      isValid = false;
    } else {
      const [systolic, diastolic] = vitalData.blood_pressure.split('/').map(Number);
      if (systolic < 70 || systolic > 200) {
        newErrors.blood_pressure = 'Systolic pressure must be between 70 and 200 mmHg';
        isValid = false;
      } else if (diastolic < 40 || diastolic > 120) {
        newErrors.blood_pressure = 'Diastolic pressure must be between 40 and 120 mmHg';
        isValid = false;
      } else if (systolic <= diastolic) {
        newErrors.blood_pressure = 'Systolic pressure must be greater than diastolic pressure';
        isValid = false;
      }
    }

    // BP Method validation (optional, but must be non-empty if provided)
    if (vitalData.bp_method && vitalData.bp_method.trim() === '') {
      newErrors.bp_method = 'BP Method cannot be empty if provided';
      isValid = false;
    }

    // BP Location validation (optional, but must be non-empty if provided)
    if (vitalData.bp_location && vitalData.bp_location.trim() === '') {
      newErrors.bp_location = 'BP Location cannot be empty if provided';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitalData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateForm(); // Validate on blur for immediate feedback
  };

  const handleCreateVital = async () => {
    if (!validateForm()) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.vitalSigns}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const payload = {
      visit_id: visit.visit_id,
      heart_rate: Number(vitalData.heart_rate),
      temperature: Number(vitalData.temperature),
      respiratory_rate: Number(vitalData.respiratory_rate),
      oxygen_saturation: Number(vitalData.oxygen_saturation),
      blood_pressure: vitalData.blood_pressure,
      bp_method: vitalData.bp_method || null,
      bp_location: vitalData.bp_location || null,
    };

    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success('Vital created successfully!');
        setVitalData({
          temperature: '',
          heart_rate: '',
          respiratory_rate: '',
          oxygen_saturation: '',
          blood_pressure: '',
          bp_method: '',
          bp_location: '',
        });
        setErrors({});
        if (onClose) onClose();
      } else {
        toast.error(responseData.data.message || 'Failed to create vital');
      }
    } catch (error) {
      toast.error('Error creating vital: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
        Create Vital
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Temperature (°C)"
            name="temperature"
            type="number"
            step="0.01"
            min="35.0"
            max="42.0"
            value={vitalData.temperature}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.temperature}
            helperText={errors.temperature || 'Enter temperature (e.g., 36.6)'}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Heart Rate (bpm)"
            name="heart_rate"
            type="number"
            step="1"
            min="30"
            max="200"
            value={vitalData.heart_rate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.heart_rate}
            helperText={errors.heart_rate || 'Enter heart rate (e.g., 72)'}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Respiratory Rate (breaths/min)"
            name="respiratory_rate"
            type="number"
            step="1"
            min="12"
            max="60"
            value={vitalData.respiratory_rate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.respiratory_rate}
            helperText={errors.respiratory_rate || 'Enter respiratory rate (e.g., 16)'}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Oxygen Saturation (%)"
            name="oxygen_saturation"
            type="number"
            step="1"
            min="0"
            max="100"
            value={vitalData.oxygen_saturation}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.oxygen_saturation}
            helperText={errors.oxygen_saturation || 'Enter oxygen saturation (e.g., 98)'}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Blood Pressure (mmHg)"
            name="blood_pressure"
            type="text"
            value={vitalData.blood_pressure}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.blood_pressure}
            helperText={errors.blood_pressure || 'Enter blood pressure (e.g., 120/80)'}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="BP Method"
            name="bp_method"
            value={vitalData.bp_method}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.bp_method}
            helperText={errors.bp_method || 'Select BP method (optional)'}
          >
            <MenuItem value="">None</MenuItem>
            {bpMethodOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="BP Location"
            name="bp_location"
            value={vitalData.bp_location}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.bp_location}
            helperText={errors.bp_location || 'Select BP location (optional)'}
          >
            <MenuItem value="">None</MenuItem>
            {bpLocationOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          {onClose && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateVital}
              disabled={submitting}
              sx={{ minWidth: 120, mr: 2 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Create Vital'}
            </Button>
          )}
          {onClose && (
            <Button
              variant="outlined"
              color="primary"
              onClick={onClose}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>

    </Box>
  );
};

export default CreateVitals;