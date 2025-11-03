import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const InfectionsEdit = ({ assessment, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    precaution: [],
  });
  const [errors, setErrors] = useState({
    precaution: '',
  });

  // Options for precaution multi-select
  const precautionOptions = ['Gown', 'Mask', 'Gloves'];

  useEffect(() => {
    if (assessment) {
      setFormData({
        precaution: Array.isArray(assessment.precaution) ? assessment.precaution : [],
      });
    }
  }, [assessment]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = { precaution: '' };
    let valid = true;

    // Precaution validation
    if (!formData.precaution || formData.precaution.length === 0) {
      newErrors.precaution = 'At least one precaution is required';
      valid = false;
    } else if (
      !formData.precaution.every((item) => precautionOptions.includes(item))
    ) {
      newErrors.precaution = 'Invalid precaution selected';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = () => {
    validateForm(); // Validate on blur for immediate feedback
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.infectious}/${assessment.id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      precaution: formData.precaution,
    };

    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Infections assessment updated successfully!');
        setErrors({ precaution: '' });
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors({
          precaution: data.data.errors.precaution?.[0] || '',
        });
        toast.error(data.data.message || 'Validation failed');
      } else {
        toast.error(data.data?.message || 'Failed to update assessment');
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
        Edit Infections Assessment
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Edit Assessment" />
        {/* Add more tabs here if needed, e.g., for viewing history */}
      </Tabs>
      {tabValue === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              SelectProps={{ multiple: true }}
              label="Precautions"
              name="precaution"
              value={formData.precaution}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={!!errors.precaution}
              helperText={errors.precaution || 'Select one or more precautions'}
              required
            >
              {precautionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            { onClose && (

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={submitting}
              sx={{ minWidth: 120, mr: 2 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Update Assessment'}
            </Button>
            )
            }
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
      )}
    </Box>
  );
};

export default InfectionsEdit;