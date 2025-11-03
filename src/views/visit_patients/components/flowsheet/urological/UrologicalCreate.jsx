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

const UrologicalCreate = ({ visit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assessment_date: '',
    urinary_amount: '',
    urinary_color: '',
    electrolyte_status: '',
    bacteria_status: '',
    dialysis: '',
  });
  const [errors, setErrors] = useState({});

  // Options for select fields
  const urinaryColorOptions = ['amber', 'yellow', 'clear', 'dark'];
  const electrolyteStatusOptions = ['normal', 'abnormal'];
  const bacteriaStatusOptions = ['none', 'positive'];
  const dialysisOptions = ['yes', 'no'];

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Assessment Date validation
    if (!formData.assessment_date) {
      newErrors.assessment_date = 'Assessment date is required';
      valid = false;
    } else {
      const date = new Date(formData.assessment_date);
      const today = new Date();
      const minDate = new Date('1900-01-01');
      if (isNaN(date.getTime())) {
        newErrors.assessment_date = 'Invalid date format';
        valid = false;
      } else if (date > today) {
        newErrors.assessment_date = 'Assessment date cannot be in the future';
        valid = false;
      } else if (date < minDate) {
        newErrors.assessment_date = 'Assessment date is too far in the past';
        valid = false;
      }
    }

    // Urinary Amount validation
    if (!formData.urinary_amount) {
      newErrors.urinary_amount = 'Urinary amount is required';
      valid = false;
    } else if (isNaN(formData.urinary_amount) || formData.urinary_amount === '') {
      newErrors.urinary_amount = 'Urinary amount must be a number';
      valid = false;
    } else {
      const amount = parseInt(formData.urinary_amount, 10);
      if (amount < 0 || amount > 5000) {
        newErrors.urinary_amount = 'Urinary amount must be between 0 and 5000 ml';
        valid = false;
      } else if (!/^\d+$/.test(formData.urinary_amount)) {
        newErrors.urinary_amount = 'Urinary amount must be an integer';
        valid = false;
      }
    }

    // Urinary Color validation
    if (!formData.urinary_color) {
      newErrors.urinary_color = 'Urinary color is required';
      valid = false;
    } else if (!urinaryColorOptions.includes(formData.urinary_color)) {
      newErrors.urinary_color = 'Invalid urinary color selected';
      valid = false;
    }

    // Electrolyte Status validation
    if (!formData.electrolyte_status) {
      newErrors.electrolyte_status = 'Electrolyte status is required';
      valid = false;
    } else if (!electrolyteStatusOptions.includes(formData.electrolyte_status)) {
      newErrors.electrolyte_status = 'Invalid electrolyte status selected';
      valid = false;
    }

    // Bacteria Status validation
    if (!formData.bacteria_status) {
      newErrors.bacteria_status = 'Bacteria status is required';
      valid = false;
    } else if (!bacteriaStatusOptions.includes(formData.bacteria_status)) {
      newErrors.bacteria_status = 'Invalid bacteria status selected';
      valid = false;
    }

    // Dialysis validation
    if (!formData.dialysis) {
      newErrors.dialysis = 'Dialysis status is required';
      valid = false;
    } else if (!dialysisOptions.includes(formData.dialysis)) {
      newErrors.dialysis = 'Invalid dialysis status selected';
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

  const handleCreate = async () => {
    if (!validateForm()) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.urologicalAssessments}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      visit_id: visit.visit_id,
      assessment_date: formData.assessment_date,
      urinary_amount: Number(formData.urinary_amount),
      urinary_color: formData.urinary_color,
      electrolyte_status: formData.electrolyte_status,
      bacteria_status: formData.bacteria_status,
      dialysis: formData.dialysis,
    };

    setSubmitting(true);
    try {
      const response = await fetch(Api, { method: 'POST', headers, body: JSON.stringify(payload) });
      const data = await response.json();

      if (data.success) {
        toast.success('Urological assessment created successfully!');
        setFormData({
          assessment_date: '',
          urinary_amount: '',
          urinary_color: '',
          electrolyte_status: '',
          bacteria_status: '',
          dialysis: '',
        });
        setErrors({});
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors(data.data.errors);
        toast.error(data.data.message || 'Validation failed');
      } else {
        toast.error(data.data?.message || 'Failed to create assessment');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Create Urological Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Assessment Date"
            name="assessment_date"
            fullWidth
            value={formData.assessment_date}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.assessment_date}
            helperText={errors.assessment_date || 'Select assessment date'}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0], min: '1900-01-01' }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            label="Urinary Amount (ml)"
            name="urinary_amount"
            fullWidth
            value={formData.urinary_amount}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.urinary_amount}
            helperText={errors.urinary_amount || 'Enter urinary amount (e.g., 500)'}
            required
            inputProps={{ min: 0, max: 5000, step: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Urinary Color"
            name="urinary_color"
            fullWidth
            select
            value={formData.urinary_color}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.urinary_color}
            helperText={errors.urinary_color || 'Select urinary color'}
            required
          >
            {urinaryColorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Electrolyte Status"
            name="electrolyte_status"
            fullWidth
            select
            value={formData.electrolyte_status}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.electrolyte_status}
            helperText={errors.electrolyte_status || 'Select electrolyte status'}
            required
          >
            {electrolyteStatusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Bacteria Status"
            name="bacteria_status"
            fullWidth
            select
            value={formData.bacteria_status}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.bacteria_status}
            helperText={errors.bacteria_status || 'Select bacteria status'}
            required
          >
            {bacteriaStatusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Dialysis"
            name="dialysis"
            fullWidth
            select
            value={formData.dialysis}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.dialysis}
            helperText={errors.dialysis || 'Select dialysis status'}
            required
          >
            {dialysisOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          {onClose && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={submitting}
            sx={{ minWidth: 120, mr: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create Assessment'}
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

export default UrologicalCreate;