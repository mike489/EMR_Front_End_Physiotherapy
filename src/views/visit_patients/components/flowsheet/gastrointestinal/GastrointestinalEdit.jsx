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

const GastrointestinalEdit = ({ assessment, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assessment_date: '',
    last_bowel_movement: '',
    consistency: '',
    vomiting: '',
    stool_character: '',
  });
  const [errors, setErrors] = useState({});

  // Options for select fields
  const consistencyOptions = ['solid', 'semi-solid', 'liquid'];
  const vomitingOptions = ['yes', 'no'];
  const stoolCharacterOptions = ['normal', 'watery', 'mucous', 'bloody'];

  useEffect(() => {
    if (assessment) {
      setFormData({
        assessment_date: assessment.assessment_date
          ? assessment.assessment_date.split('T')[0]
          : '',
        last_bowel_movement: assessment.last_bowel_movement
          ? assessment.last_bowel_movement.slice(0, 16)
          : '',
        consistency: assessment.consistency || '',
        vomiting: assessment.vomiting || '',
        stool_character: assessment.stool_character || '',
      });
    }
  }, [assessment]);

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

    // Last Bowel Movement validation
    if (!formData.last_bowel_movement) {
      newErrors.last_bowel_movement = 'Last bowel movement is required';
      valid = false;
    } else {
      const lbmDate = new Date(formData.last_bowel_movement);
      const today = new Date();
      const minDate = new Date('1900-01-01');
      if (isNaN(lbmDate.getTime())) {
        newErrors.last_bowel_movement = 'Invalid datetime format';
        valid = false;
      } else if (lbmDate > today) {
        newErrors.last_bowel_movement = 'Last bowel movement cannot be in the future';
        valid = false;
      } else if (lbmDate < minDate) {
        newErrors.last_bowel_movement = 'Last bowel movement is too far in the past';
        valid = false;
      } else if (
        formData.assessment_date &&
        new Date(formData.assessment_date) < new Date(formData.last_bowel_movement.split('T')[0])
      ) {
        newErrors.last_bowel_movement = 'Last bowel movement cannot be after assessment date';
        valid = false;
      }
    }

    // Consistency validation
    if (!formData.consistency) {
      newErrors.consistency = 'Consistency is required';
      valid = false;
    } else if (!consistencyOptions.includes(formData.consistency)) {
      newErrors.consistency = 'Invalid consistency selected';
      valid = false;
    }

    // Vomiting validation
    if (!formData.vomiting) {
      newErrors.vomiting = 'Vomiting status is required';
      valid = false;
    } else if (!vomitingOptions.includes(formData.vomiting)) {
      newErrors.vomiting = 'Invalid vomiting status selected';
      valid = false;
    }

    // Stool Character validation
    if (!formData.stool_character) {
      newErrors.stool_character = 'Stool character is required';
      valid = false;
    } else if (!stoolCharacterOptions.includes(formData.stool_character)) {
      newErrors.stool_character = 'Invalid stool character selected';
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
    const Api = `${Backend.auth}${Backend.gastrointestinalAssessments}/${assessment.id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    const payload = {
      assessment_date: formData.assessment_date,
      last_bowel_movement: formData.last_bowel_movement,
      consistency: formData.consistency,
      vomiting: formData.vomiting,
      stool_character: formData.stool_character,
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
        toast.success('Gastrointestinal assessment updated successfully!');
        setErrors({});
        if (onClose) onClose();
      } else if (data.status === 422 && data.data?.errors) {
        setErrors(data.data.errors);
        toast.error(data.data.message || 'Validation failed');
      } else {
        toast.error(data.data?.message || 'Failed to update assessment');
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Edit Gastrointestinal Assessment
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
            type="datetime-local"
            label="Last Bowel Movement"
            name="last_bowel_movement"
            value={formData.last_bowel_movement}
            onChange={handleInputChange}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            error={!!errors.last_bowel_movement}
            helperText={errors.last_bowel_movement || 'Select last bowel movement datetime'}
            inputProps={{
              max: new Date().toISOString().slice(0, 16),
              min: '1900-01-01T00:00',
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Consistency"
            name="consistency"
            value={formData.consistency}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.consistency}
            helperText={errors.consistency || 'Select stool consistency'}
            required
          >
            {consistencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Vomiting"
            name="vomiting"
            value={formData.vomiting}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.vomiting}
            helperText={errors.vomiting || 'Select vomiting status'}
            required
          >
            {vomitingOptions.map((option) => (
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
            label="Stool Character"
            name="stool_character"
            value={formData.stool_character}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.stool_character}
            helperText={errors.stool_character || 'Select stool character'}
            required
          >
            {stoolCharacterOptions.map((option) => (
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

export default GastrointestinalEdit;