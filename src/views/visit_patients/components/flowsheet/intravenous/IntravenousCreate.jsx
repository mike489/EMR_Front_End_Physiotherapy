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

const IntravenousCreate = ({ visit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    site_inspection: '',
    infiltration: '',
    tubing: '',
    rate: '',
    fluid_overload: '',
  });
  const [errors, setErrors] = useState({
    date: '',
    site_inspection: '',
    infiltration: '',
    tubing: '',
    rate: '',
    fluid_overload: '',
  });

  // Options for select fields
  const siteInspectionOptions = ['normal', 'abnormal'];
  const infiltrationOptions = ['none', 'mild', 'moderate', 'severe'];
  const tubingOptions = ['in_place', 'dislodged'];
  const fluidOverloadOptions = ['none', 'mild', 'moderate', 'severe'];

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {
      date: '',
      site_inspection: '',
      infiltration: '',
      tubing: '',
      rate: '',
      fluid_overload: '',
    };
    let valid = true;

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
      valid = false;
    } else {
      const date = new Date(formData.date);
      const today = new Date();
      const minDate = new Date('1900-01-01');
      if (isNaN(date.getTime())) {
        newErrors.date = 'Invalid date format';
        valid = false;
      } else if (date > today) {
        newErrors.date = 'Date cannot be in the future';
        valid = false;
      } else if (date < minDate) {
        newErrors.date = 'Date is too far in the past';
        valid = false;
      }
    }

    // Site Inspection validation
    if (!formData.site_inspection) {
      newErrors.site_inspection = 'Site inspection is required';
      valid = false;
    } else if (!siteInspectionOptions.includes(formData.site_inspection)) {
      newErrors.site_inspection = 'Invalid site inspection selected';
      valid = false;
    }

    // Infiltration validation
    if (!formData.infiltration) {
      newErrors.infiltration = 'Infiltration status is required';
      valid = false;
    } else if (!infiltrationOptions.includes(formData.infiltration)) {
      newErrors.infiltration = 'Invalid infiltration status selected';
      valid = false;
    }

    // Tubing validation
    if (!formData.tubing) {
      newErrors.tubing = 'Tubing status is required';
      valid = false;
    } else if (!tubingOptions.includes(formData.tubing)) {
      newErrors.tubing = 'Invalid tubing status selected';
      valid = false;
    }

    // Rate validation
    if (!formData.rate) {
      newErrors.rate = 'Rate is required';
      valid = false;
    } else if (isNaN(formData.rate) || formData.rate === '') {
      newErrors.rate = 'Rate must be a number';
      valid = false;
    } else {
      const rateNum = parseInt(formData.rate, 10);
      if (rateNum < 0 || rateNum > 1000) {
        newErrors.rate = 'Rate must be between 0 and 1000 mL/hr';
        valid = false;
      } else if (!/^\d+$/.test(formData.rate)) {
        newErrors.rate = 'Rate must be an integer';
        valid = false;
      }
    }

    // Fluid Overload validation
    if (!formData.fluid_overload) {
      newErrors.fluid_overload = 'Fluid overload status is required';
      valid = false;
    } else if (!fluidOverloadOptions.includes(formData.fluid_overload)) {
      newErrors.fluid_overload = 'Invalid fluid overload status selected';
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

  const handleBlur = () => {
    validateForm(); // Validate on blur for immediate feedback
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.intravenousTherapies}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      visit_id: visit.visit_id,
      date: formData.date,
      site_inspection: formData.site_inspection,
      infiltration: formData.infiltration,
      tubing: formData.tubing,
      rate: Number(formData.rate),
      fluid_overload: formData.fluid_overload,
    };

    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Intravenous therapy assessment created successfully!');
        setFormData({
          date: '',
          site_inspection: '',
          infiltration: '',
          tubing: '',
          rate: '',
          fluid_overload: '',
        });
        setErrors({
          date: '',
          site_inspection: '',
          infiltration: '',
          tubing: '',
          rate: '',
          fluid_overload: '',
        });
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors({
          date: data.data.errors.date?.[0] || '',
          site_inspection: data.data.errors.site_inspection?.[0] || '',
          infiltration: data.data.errors.infiltration?.[0] || '',
          tubing: data.data.errors.tubing?.[0] || '',
          rate: data.data.errors.rate?.[0] || '',
          fluid_overload: data.data.errors.fluid_overload?.[0] || '',
        });
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
        Create Intravenous Therapy Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date || 'Select assessment date'}
            inputProps={{ max: new Date().toISOString().split('T')[0], min: '1900-01-01' }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Site Inspection"
            name="site_inspection"
            value={formData.site_inspection}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.site_inspection}
            helperText={errors.site_inspection || 'Select site inspection status'}
            required
          >
            {siteInspectionOptions.map((option) => (
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
            label="Infiltration"
            name="infiltration"
            value={formData.infiltration}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.infiltration}
            helperText={errors.infiltration || 'Select infiltration status'}
            required
          >
            {infiltrationOptions.map((option) => (
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
            label="Tubing"
            name="tubing"
            value={formData.tubing}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.tubing}
            helperText={errors.tubing || 'Select tubing status'}
            required
          >
            {tubingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Rate (mL/hr)"
            name="rate"
            value={formData.rate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.rate}
            helperText={errors.rate || 'Enter rate (e.g., 100)'}
            inputProps={{ step: 1, min: 0, max: 1000 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Fluid Overload"
            name="fluid_overload"
            value={formData.fluid_overload}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.fluid_overload}
            helperText={errors.fluid_overload || 'Select fluid overload status'}
            required
          >
            {fluidOverloadOptions.map((option) => (
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

export default IntravenousCreate;