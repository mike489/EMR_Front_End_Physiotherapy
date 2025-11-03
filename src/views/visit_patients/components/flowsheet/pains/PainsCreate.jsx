import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

// Utility to strip HTML tags for validation
const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const PainsCreate = ({ visit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pain_score: '',
    pain_location: '',
    pain_assessment: '',
    pain_type: '',
    orientation: '',
    pain_onset: '',
    pain_frequency: '',
    clinical_progress: '',
  });
  const [errors, setErrors] = useState({});

  // Options for select fields
  const painTypeOptions = ['acute', 'chronic'];
  const orientationOptions = ['alert', 'drowsy', 'unresponsive'];
  const painOnsetOptions = ['sudden', 'gradual'];
  const painFrequencyOptions = ['constant', 'intermittent', 'occasional'];

  // Quill modules for toolbar configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Pain Score validation
    if (!formData.pain_score) {
      newErrors.pain_score = 'Pain score is required';
      valid = false;
    } else if (isNaN(formData.pain_score) || formData.pain_score === '') {
      newErrors.pain_score = 'Pain score must be a number';
      valid = false;
    } else {
      const score = parseInt(formData.pain_score, 10);
      if (score < 0 || score > 10) {
        newErrors.pain_score = 'Pain score must be between 0 and 10';
        valid = false;
      } else if (!/^\d+$/.test(formData.pain_score)) {
        newErrors.pain_score = 'Pain score must be an integer';
        valid = false;
      }
    }

    // Pain Location validation
    if (!formData.pain_location) {
      newErrors.pain_location = 'Pain location is required';
      valid = false;
    } else if (formData.pain_location.trim().length === 0) {
      newErrors.pain_location = 'Pain location cannot be empty';
      valid = false;
    } else if (formData.pain_location.length > 100) {
      newErrors.pain_location = 'Pain location must be 100 characters or less';
      valid = false;
    } else if (!/^[a-zA-Z0-9\s,-]+$/.test(formData.pain_location)) {
      newErrors.pain_location = 'Pain location can only contain letters, numbers, spaces, commas, and hyphens';
      valid = false;
    }

    // Pain Assessment validation
    const painAssessmentText = stripHtml(formData.pain_assessment);
    if (!painAssessmentText || formData.pain_assessment === '<p><br></p>') {
      newErrors.pain_assessment = 'Pain assessment is required';
      valid = false;
    } else if (painAssessmentText.length > 500) {
      newErrors.pain_assessment = 'Pain assessment must be 500 characters or less';
      valid = false;
    }

    // Pain Type validation
    if (!formData.pain_type) {
      newErrors.pain_type = 'Pain type is required';
      valid = false;
    } else if (!painTypeOptions.includes(formData.pain_type)) {
      newErrors.pain_type = 'Invalid pain type selected';
      valid = false;
    }

    // Orientation validation
    if (!formData.orientation) {
      newErrors.orientation = 'Orientation is required';
      valid = false;
    } else if (!orientationOptions.includes(formData.orientation)) {
      newErrors.orientation = 'Invalid orientation selected';
      valid = false;
    }

    // Pain Onset validation
    if (!formData.pain_onset) {
      newErrors.pain_onset = 'Pain onset is required';
      valid = false;
    } else if (!painOnsetOptions.includes(formData.pain_onset)) {
      newErrors.pain_onset = 'Invalid pain onset selected';
      valid = false;
    }

    // Pain Frequency validation
    if (!formData.pain_frequency) {
      newErrors.pain_frequency = 'Pain frequency is required';
      valid = false;
    } else if (formData.pain_frequency.trim().length === 0) {
      newErrors.pain_frequency = 'Pain frequency cannot be empty';
      valid = false;
    } else if (formData.pain_frequency.length > 100) {
      newErrors.pain_frequency = 'Pain frequency must be 100 characters or less';
      valid = false;
    } else if (!/^[a-zA-Z0-9\s,-]+$/.test(formData.pain_frequency)) {
      newErrors.pain_frequency = 'Pain frequency can only contain letters, numbers, spaces, commas, and hyphens';
      valid = false;
    }

    // Clinical Progress validation
    const clinicalProgressText = stripHtml(formData.clinical_progress);
    if (!clinicalProgressText || formData.clinical_progress === '<p><br></p>') {
      newErrors.clinical_progress = 'Clinical progress is required';
      valid = false;
    } else if (clinicalProgressText.length > 500) {
      newErrors.clinical_progress = 'Clinical progress must be 500 characters or less';
      valid = false;
    }

    console.log('Validation errors:', newErrors, 'Valid:', valid, 'FormData:', formData); // Debugging
    setErrors(newErrors);
    return valid;
  };

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`); // Debugging
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleQuillChange = (name) => (value) => {
    console.log(`Quill change for ${name}:`, value); // Debugging
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = () => {
    validateForm();
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      console.log('Validation failed, stopping submission'); // Debugging
      return;
    }

    const token = await GetToken();
    if (!token) {
      toast.error('Authentication token is missing');
      setSubmitting(false);
      return;
    }

    if (!visit?.visit_id) {
      toast.error('Visit ID is missing');
      setSubmitting(false);
      return;
    }

    const Api = `${Backend.auth}${Backend.pains}`;
    const payload = {
      visit_id: visit.visit_id,
      pain_score: Number(formData.pain_score),
      pain_location: formData.pain_location,
      pain_assessment: formData.pain_assessment,
      pain_type: formData.pain_type,
      orientation: formData.orientation,
      pain_onset: formData.pain_onset,
      pain_frequency: formData.pain_frequency,
      clinical_progress: formData.clinical_progress,
    };

    console.log('Submitting to API:', Api, 'Payload:', payload, 'Token:', token); // Debugging
    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('API response:', data); // Debugging

      if (data.success) {
        toast.success('Pain record created successfully');
        setFormData({
          pain_score: '',
          pain_location: '',
          pain_assessment: '',
          pain_type: '',
          orientation: '',
          pain_onset: '',
          pain_frequency: '',
          clinical_progress: '',
        });
        setErrors({});
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors(data.data.errors);
        toast.error(data.data.message || 'Validation failed');
      } else {
        toast.error(data.data?.message || 'Failed to create pain record');
      }
    } catch (error) {
      console.error('Submission error:', error); // Debugging
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Create Pain Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Pain Score (0-10)"
            name="pain_score"
            value={formData.pain_score}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pain_score}
            helperText={errors.pain_score || 'Enter pain score (e.g., 7)'}
            inputProps={{ min: 0, max: 10, step: 1 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pain Location"
            name="pain_location"
            value={formData.pain_location}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pain_location}
            helperText={errors.pain_location || 'Enter pain location (e.g., Lower back)'}
            inputProps={{ maxLength: 100 }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Pain Assessment *
          </Typography>
          <ReactQuill
            value={formData.pain_assessment}
            onChange={handleQuillChange('pain_assessment')}
            onBlur={handleBlur}
            modules={quillModules}
            style={{
              minHeight: '150px',
              border: errors.pain_assessment ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Typography
            variant="caption"
            color={errors.pain_assessment ? 'error' : 'textSecondary'}
            sx={{ mt: 1, display: 'block' }}
          >
            {errors.pain_assessment || 'Enter pain assessment details (max 500 characters)'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Pain Type"
            name="pain_type"
            value={formData.pain_type}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pain_type}
            helperText={errors.pain_type || 'Select pain type'}
            required
          >
            <MenuItem value="" disabled>
              Select Pain Type
            </MenuItem>
            {painTypeOptions.map((option) => (
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
            label="Orientation"
            name="orientation"
            value={formData.orientation}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.orientation}
            helperText={errors.orientation || 'Select orientation'}
            required
          >
            <MenuItem value="" disabled>
              Select Orientation
            </MenuItem>
            {orientationOptions.map((option) => (
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
            label="Pain Onset"
            name="pain_onset"
            value={formData.pain_onset}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pain_onset}
            helperText={errors.pain_onset || 'Select pain onset'}
            required
          >
            <MenuItem value="" disabled>
              Select Pain Onset
            </MenuItem>
            {painOnsetOptions.map((option) => (
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
            label="Pain Frequency"
            name="pain_frequency"
            value={formData.pain_frequency}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.pain_frequency}
            helperText={errors.pain_frequency || 'Select pain frequency'}
            required
          >
            <MenuItem value="" disabled>
              Select Pain Frequency
            </MenuItem>
            {painFrequencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Clinical Progress *
          </Typography>
          <ReactQuill
            value={formData.clinical_progress}
            onChange={handleQuillChange('clinical_progress')}
            onBlur={handleBlur}
            modules={quillModules}
            style={{
              minHeight: '150px',
              border: errors.clinical_progress ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Typography
            variant="caption"
            color={errors.clinical_progress ? 'error' : 'textSecondary'}
            sx={{ mt: 1, display: 'block' }}
          >
            {errors.clinical_progress || 'Enter clinical progress details (max 500 characters)'}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={submitting}
            sx={{ minWidth: 120, mr: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create Pain Record'}
          </Button>
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
      <ToastContainer />
    </Box>
  );
};

export default PainsCreate;