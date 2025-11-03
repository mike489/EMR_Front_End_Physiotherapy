import React, { useState, useEffect } from 'react';
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

const CardiovascularEdit = ({ assessment, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assessment_date: '',
    's1/s2_sound': '',
    murmur: '',
    rhythm: '',
    heart_rate: '',
  });
  const [errors, setErrors] = useState({
    assessment_date: '',
    's1/s2_sound': '',
    murmur: '',
    rhythm: '',
    heart_rate: '',
  });

  // Options for select fields
  const s1s2SoundOptions = ['normal', 'abnormal'];
  const murmurOptions = ['none', 'soft', 'loud'];
  const rhythmOptions = ['regular', 'irregular'];

  useEffect(() => {
    if (assessment) {
      setFormData({
        assessment_date: assessment.assessment_date
          ? assessment.assessment_date.split('T')[0]
          : '',
        's1/s2_sound': assessment['s1/s2_sound'] || '',
        murmur: assessment.murmur || '',
        rhythm: assessment.rhythm || '',
        heart_rate: assessment.heart_rate || '',
      });
    }
  }, [assessment]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {
      assessment_date: '',
      's1/s2_sound': '',
      murmur: '',
      rhythm: '',
      heart_rate: '',
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

    // S1/S2 Sound validation
    if (!formData['s1/s2_sound']) {
      newErrors['s1/s2_sound'] = 'S1/S2 sound is required';
      valid = false;
    } else if (!s1s2SoundOptions.includes(formData['s1/s2_sound'])) {
      newErrors['s1/s2_sound'] = 'Invalid S1/S2 sound selected';
      valid = false;
    }

    // Murmur validation
    if (!formData.murmur) {
      newErrors.murmur = 'Murmur is required';
      valid = false;
    } else if (!murmurOptions.includes(formData.murmur)) {
      newErrors.murmur = 'Invalid murmur selected';
      valid = false;
    }

    // Rhythm validation
    if (!formData.rhythm) {
      newErrors.rhythm = 'Rhythm is required';
      valid = false;
    } else if (!rhythmOptions.includes(formData.rhythm)) {
      newErrors.rhythm = 'Invalid rhythm selected';
      valid = false;
    }

    // Heart Rate validation
    if (!formData.heart_rate) {
      newErrors.heart_rate = 'Heart rate is required';
      valid = false;
    } else if (isNaN(formData.heart_rate) || formData.heart_rate === '') {
      newErrors.heart_rate = 'Heart rate must be a number';
      valid = false;
    } else {
      const hr = parseInt(formData.heart_rate, 10);
      if (hr < 30 || hr > 220) {
        newErrors.heart_rate = 'Heart rate must be between 30 and 220 bpm';
        valid = false;
      } else if (!/^\d+$/.test(formData.heart_rate)) {
        newErrors.heart_rate = 'Heart rate must be an integer';
        valid = false;
      }
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
    const Api = `${Backend.auth}${Backend.cardiovascularAssessments}/${assessment.id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      assessment_date: formData.assessment_date,
      's1/s2_sound': formData['s1/s2_sound'],
      murmur: formData.murmur,
      rhythm: formData.rhythm,
      heart_rate: Number(formData.heart_rate),
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
        toast.success('Cardiovascular assessment updated successfully!');
        setErrors({
          assessment_date: '',
          's1/s2_sound': '',
          murmur: '',
          rhythm: '',
          heart_rate: '',
        });
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors({
          assessment_date: data.data.errors.assessment_date?.[0] || '',
          's1/s2_sound': data.data.errors['s1/s2_sound']?.[0] || '',
          murmur: data.data.errors.murmur?.[0] || '',
          rhythm: data.data.errors.rhythm?.[0] || '',
          heart_rate: data.data.errors.heart_rate?.[0] || '',
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
        Edit Cardiovascular Assessment
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
            label="S1/S2 Sound"
            name="s1/s2_sound"
            value={formData['s1/s2_sound']}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors['s1/s2_sound']}
            helperText={errors['s1/s2_sound'] || 'Select S1/S2 sound'}
            required
          >
            {s1s2SoundOptions.map((option) => (
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
            label="Murmur"
            name="murmur"
            value={formData.murmur}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.murmur}
            helperText={errors.murmur || 'Select murmur status'}
            required
          >
            {murmurOptions.map((option) => (
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
            label="Rhythm"
            name="rhythm"
            value={formData.rhythm}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.rhythm}
            helperText={errors.rhythm || 'Select heart rhythm'}
            required
          >
            {rhythmOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Heart Rate (bpm)"
            name="heart_rate"
            value={formData.heart_rate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.heart_rate}
            helperText={errors.heart_rate || 'Enter heart rate (e.g., 80)'}
            inputProps={{ step: 1, min: 30, max: 220 }}
            required
          />
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
            {submitting ? <CircularProgress size={24} /> : 'Update Assessment'}
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

export default CardiovascularEdit;