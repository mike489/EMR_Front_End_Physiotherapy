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

const NeurologicalCreate = ({ visit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assessment_date: '',
    mental_status: '',
    extremities: '',
    sensation: '',
    spinal_arrangement: '',
    movement: '',
  });
  const [errors, setErrors] = useState({
    assessment_date: '',
    mental_status: '',
    extremities: '',
    sensation: '',
    spinal_arrangement: '',
    movement: '',
  });

  // Options for select fields (adjust based on API requirements)
  const statusOptions = ['alert','normal', 'abnormal'];

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {
      assessment_date: '',
      mental_status: '',
      extremities: '',
      sensation: '',
      spinal_arrangement: '',
      movement: '',
    };
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

    // Mental Status validation
    if (!formData.mental_status) {
      newErrors.mental_status = 'Mental status is required';
      valid = false;
    } else if (!statusOptions.includes(formData.mental_status)) {
      newErrors.mental_status = 'Invalid mental status selected';
      valid = false;
    }

    // Extremities validation
    if (!formData.extremities) {
      newErrors.extremities = 'Extremities status is required';
      valid = false;
    } else if (!statusOptions.includes(formData.extremities)) {
      newErrors.extremities = 'Invalid extremities status selected';
      valid = false;
    }

    // Sensation validation
    if (!formData.sensation) {
      newErrors.sensation = 'Sensation status is required';
      valid = false;
    } else if (!statusOptions.includes(formData.sensation)) {
      newErrors.sensation = 'Invalid sensation status selected';
      valid = false;
    }

    // Spinal Arrangement validation
    if (!formData.spinal_arrangement) {
      newErrors.spinal_arrangement = 'Spinal arrangement status is required';
      valid = false;
    } else if (!statusOptions.includes(formData.spinal_arrangement)) {
      newErrors.spinal_arrangement = 'Invalid spinal arrangement status selected';
      valid = false;
    }

    // Movement validation
    if (!formData.movement) {
      newErrors.movement = 'Movement status is required';
      valid = false;
    } else if (!statusOptions.includes(formData.movement)) {
      newErrors.movement = 'Invalid movement status selected';
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
    const Api = `${Backend.auth}${Backend.neurologicalAssessments}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      visit_id: visit.visit_id,
      assessment_date: formData.assessment_date,
      mental_status: formData.mental_status,
      extremities: formData.extremities,
      sensation: formData.sensation,
      spinal_arrangement: formData.spinal_arrangement,
      movement: formData.movement,
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
        toast.success('Neurological assessment created successfully!');
        setFormData({
          assessment_date: '',
          mental_status: '',
          extremities: '',
          sensation: '',
          spinal_arrangement: '',
          movement: '',
        });
        setErrors({
          assessment_date: '',
          mental_status: '',
          extremities: '',
          sensation: '',
          spinal_arrangement: '',
          movement: '',
        });
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors({
          assessment_date: data.data.errors.assessment_date?.[0] || '',
          mental_status: data.data.errors.mental_status?.[0] || '',
          extremities: data.data.errors.extremities?.[0] || '',
          sensation: data.data.errors.sensation?.[0] || '',
          spinal_arrangement: data.data.errors.spinal_arrangement?.[0] || '',
          movement: data.data.errors.movement?.[0] || '',
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
        Create Neurological Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Assessment Date"
            name="assessment_date"
            value={formData.assessment_date}
            onChange={handleInputChange}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            error={!!errors.assessment_date}
            helperText={errors.assessment_date || 'Select assessment date'}
            inputProps={{ max: new Date().toISOString().split('T')[0], min: '1900-01-01' }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Mental Status"
            name="mental_status"
            value={formData.mental_status}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.mental_status}
            helperText={errors.mental_status || 'Select mental status'}
            required
          >
            {statusOptions.map((option) => (
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
            label="Extremities"
            name="extremities"
            value={formData.extremities}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.extremities}
            helperText={errors.extremities || 'Select extremities status'}
            required
          >
            {statusOptions.map((option) => (
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
            label="Sensation"
            name="sensation"
            value={formData.sensation}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.sensation}
            helperText={errors.sensation || 'Select sensation status'}
            required
          >
            {statusOptions.map((option) => (
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
            label="Spinal Arrangement"
            name="spinal_arrangement"
            value={formData.spinal_arrangement}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.spinal_arrangement}
            helperText={errors.spinal_arrangement || 'Select spinal arrangement status'}
            required
          >
            {statusOptions.map((option) => (
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
            label="Movement"
            name="movement"
            value={formData.movement}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.movement}
            helperText={errors.movement || 'Select movement status'}
            required
          >
            {statusOptions.map((option) => (
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

export default NeurologicalCreate;