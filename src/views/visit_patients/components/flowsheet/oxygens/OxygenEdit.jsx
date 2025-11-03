import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const OxygenEdit = ({ assessment, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    spo2_level: '',
    spo2_measurement: '',
    pulse_oximetry_type: '',
    therapy_type: '',
  });
  const [errors, setErrors] = useState({});

  // Options for select fields
  const pulseOximetryTypeOptions = ['finger', 'earlobe', 'forehead'];
  const therapyTypeOptions = ['oxygen-therapy', 'ventilator', 'cpap'];

  useEffect(() => {
    if (assessment) {
      setFormData({
        spo2_level: assessment.spo2_level || '',
        spo2_measurement: assessment.spo2_measurement || '',
        pulse_oximetry_type: assessment.pulse_oximetry_type || '',
        therapy_type: assessment.therapy_type || '',
      });
    }
  }, [assessment]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // SpO2 Level validation
    if (!formData.spo2_level) {
      newErrors.spo2_level = 'SpO2 level is required';
      valid = false;
    } else if (isNaN(formData.spo2_level) || formData.spo2_level === '') {
      newErrors.spo2_level = 'SpO2 level must be a number';
      valid = false;
    } else {
      const level = parseInt(formData.spo2_level, 10);
      if (level < 0 || level > 100) {
        newErrors.spo2_level = 'SpO2 level must be between 0 and 100%';
        valid = false;
      } else if (!/^\d+$/.test(formData.spo2_level)) {
        newErrors.spo2_level = 'SpO2 level must be an integer';
        valid = false;
      }
    }

    // SpO2 Measurement validation
    if (!formData.spo2_measurement) {
      newErrors.spo2_measurement = 'SpO2 measurement is required';
      valid = false;
    } else if (isNaN(formData.spo2_measurement) || formData.spo2_measurement === '') {
      newErrors.spo2_measurement = 'SpO2 measurement must be a number';
      valid = false;
    } else {
      const measurement = parseInt(formData.spo2_measurement, 10);
      if (measurement < 0 || measurement > 100) {
        newErrors.spo2_measurement = 'SpO2 measurement must be between 0 and 100%';
        valid = false;
      } else if (!/^\d+$/.test(formData.spo2_measurement)) {
        newErrors.spo2_measurement = 'SpO2 measurement must be an integer';
        valid = false;
      }
      // Optional: Validate that spo2_measurement is close to spo2_level
      // if (formData.spo2_level && Math.abs(level - measurement) > 5) {
      //   newErrors.spo2_measurement = 'SpO2 measurement should be within 5% of SpO2 level';
      //   valid = false;
      // }
    }

    // Pulse Oximetry Type validation
    if (!formData.pulse_oximetry_type) {
      newErrors.pulse_oximetry_type = 'Pulse oximetry type is required';
      valid = false;
    } else if (!pulseOximetryTypeOptions.includes(formData.pulse_oximetry_type)) {
      newErrors.pulse_oximetry_type = 'Invalid pulse oximetry type selected';
      valid = false;
    }

    // Therapy Type validation
    if (!formData.therapy_type) {
      newErrors.therapy_type = 'Therapy type is required';
      valid = false;
    } else if (!therapyTypeOptions.includes(formData.therapy_type)) {
      newErrors.therapy_type = 'Invalid therapy type selected';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    validateForm(); // Validate on blur for immediate feedback
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.oxygens}/${assessment.id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const payload = {
      spo2_level: Number(formData.spo2_level),
      spo2_measurement: Number(formData.spo2_measurement),
      pulse_oximetry_type: formData.pulse_oximetry_type,
      therapy_type: formData.therapy_type,
    };

    setSubmitting(true);
    try {
      const res = await fetch(Api, { method: 'PUT', headers, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success('Oxygen record updated successfully');
        setErrors({});
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors(data.data.errors);
        toast.error(data.data.message || 'Validation failed');
      } else {
        toast.error(data.data?.message || 'Failed to update record');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Edit Oxygen Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="SpO2 Level (%)"
            name="spo2_level"
            value={formData.spo2_level}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.spo2_level}
            helperText={errors.spo2_level || 'Enter SpO2 level (e.g., 98)'}
            inputProps={{ min: 0, max: 100, step: 1 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="SpO2 Measurement (%)"
            name="spo2_measurement"
            value={formData.spo2_measurement}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.spo2_measurement}
            helperText={errors.spo2_measurement || 'Enter SpO2 measurement (e.g., 97)'}
            inputProps={{ min: 0, max: 100, step: 1 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Pulse Oximetry Type"
            name="pulse_oximetry_type"
            value={formData.pulse_oximetry_type}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pulse_oximetry_type}
            helperText={errors.pulse_oximetry_type || 'Select pulse oximetry type'}
            required
          >
            {pulseOximetryTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Therapy Type"
            name="therapy_type"
            value={formData.therapy_type}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.therapy_type}
            helperText={errors.therapy_type || 'Select therapy type'}
            required
          >
            {therapyTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          {onClose && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={submitting}
            sx={{ minWidth: 120, mr: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Update Oxygen Assessment'}
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

export default OxygenEdit;