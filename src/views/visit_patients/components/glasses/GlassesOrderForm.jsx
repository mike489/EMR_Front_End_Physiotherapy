import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

const GlassesOrderForm = ({
  orderId,
  initialData = {
    lens_type_id: '',
    other_lens_type: '',
    lens_material_id: '',
    size: '',
    color: '#000000',
    frame_description: '',
    description: '',
  },
  lensTypes = [],
  lensMaterials = [],
  visits = [], // Changed from single visit to array of visits
  patients = [], // Add patients prop
  dataLoading,
  data,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!orderId;
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [customLensType, setCustomLensType] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorInput, setColorInput] = useState(initialData.color);
  const [selectedPatient, setSelectedPatient] = useState('');

  const sizeOptions = ['Small', 'Medium', 'Large', 'Other'];
  const presetColors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFD700',
    '#C0C0C0',
    '#8B4513',
  ];

  useEffect(() => {
    setFormData(initialData);
    setColorInput(initialData.color);
    if (initialData.other_lens_type)
      setCustomLensType(initialData.other_lens_type);
    if (initialData.size && !sizeOptions.includes(initialData.size))
      setCustomSize(initialData.size);

    // Set selected patient if editing and visit_id exists
    if (isEditMode && initialData.visit_id) {
      const visit = visits.find((v) => v.visit_id === initialData.visit_id);
      if (visit) {
        setSelectedPatient(visit.visit_id);
      }
    }
  }, [initialData, isEditMode, visits]);

  const handlePatientChange = (e) => {
    const visitId = e.target.value;
    setSelectedPatient(visitId);
    setFormData((prev) => ({
      ...prev,
      visit_id: visitId,
    }));
    setErrors((prev) => ({ ...prev, visit_id: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'lens_type_id' && value !== 'Other'
        ? { other_lens_type: '' }
        : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'lens_type_id' && value !== 'Other') setCustomLensType('');
    if (name === 'size' && value !== 'Other') setCustomSize('');
  };

  const handleCustomLensTypeChange = (e) => {
    const value = e.target.value;
    setCustomLensType(value);
    setFormData((prev) => ({
      ...prev,
      lens_type_id: 'Other',
      other_lens_type: value.trim(),
    }));
    setErrors((prev) => ({ ...prev, other_lens_type: '' }));
  };

  const handleCustomSizeChange = (e) => {
    const value = e.target.value;
    setCustomSize(value);
    setFormData((prev) => ({ ...prev, size: value }));
    setErrors((prev) => ({ ...prev, size: '' }));
  };

  const handleColorChange = (color) => {
    const hex = color.hex.toUpperCase();
    setFormData((prev) => ({ ...prev, color: hex }));
    setColorInput(hex);
    setErrors((prev) => ({ ...prev, color: '' }));
  };

  const handleColorInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setColorInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setFormData((prev) => ({ ...prev, color: value }));
      setErrors((prev) => ({ ...prev, color: '' }));
    } else {
      setErrors((prev) => ({ ...prev, color: 'Invalid hex color' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    setErrors((prev) => ({ ...prev, description: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Only require visit_id for new orders, not edits
    if (!isEditMode && !formData.visit_id) {
      newErrors.visit_id = 'Patient selection is required';
    }

    if (
      formData.lens_type_id === 'Other' &&
      (!formData.other_lens_type || formData.other_lens_type.trim() === '')
    ) {
      newErrors.other_lens_type = 'Custom lens type must be a non-empty string';
    }
    if (!formData.lens_material_id)
      newErrors.lens_material_id = 'Lens material is required';
    if (!formData.color || !/^#[0-9A-F]{6}$/i.test(formData.color))
      newErrors.color = 'Valid hex color is required';
    if (!formData.description || formData.description.trim() === '')
      newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    let payload = { ...formData };

    if (formData.lens_type_id === 'Other') {
      delete payload.lens_type_id;
      payload.other_lens_type = formData.other_lens_type?.trim() || '';
    } else if (!formData.lens_type_id) {
      delete payload.lens_type_id;
      delete payload.other_lens_type;
    } else {
      delete payload.other_lens_type;
    }

    console.log('Submitting Payload:', payload);
    onSubmit(payload, isEditMode);
  };

  const enhancedLensTypes = [
    { id: '', name: 'None' },
    ...lensTypes,
    { id: 'Other', name: 'Other' },
  ];

  // Format patients for dropdown - using visit data
  const patientOptions = visits.map((visit) => ({
    visit_id: visit.visit_id,
    patient_name: visit.patient?.name || `Patient ${visit.visit_id}`,
    visit_date: visit.visit_date || 'No date',
  }));

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        {isEditMode ? 'Edit Glasses Order' : 'Create Glasses Order'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {!isEditMode && (
            <Grid item xs={12}>
              <TextField
                select
                label="Patient"
                value={formData.visit_id || ''}
                onChange={(e) => {
                  const visitId = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    visit_id: visitId,
                  }));
                  setSelectedPatient(visitId);
                }}
                fullWidth
                margin="normal"
                helperText="Select a patient from the list"
              >
                {visits.map((option) => (
                  <MenuItem key={option.visit_id} value={option.visit_id}>
                    {option.patient_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {/* Lens Type */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Lens Type"
              name="lens_type_id"
              value={
                !formData.lens_type_id
                  ? ''
                  : !lensTypes.some((t) => t.id === formData.lens_type_id)
                    ? 'Other'
                    : formData.lens_type_id
              }
              onChange={handleChange}
              error={!!errors.lens_type_id}
              helperText={errors.lens_type_id}
              sx={{
                backgroundColor: '#ffffff',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: 1,
                  },
                },
              }}
            >
              {enhancedLensTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Rest of your existing form fields remain the same */}
          {formData.lens_type_id === 'Other' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Custom Lens Type"
                value={customLensType}
                onChange={handleCustomLensTypeChange}
                error={!!errors.other_lens_type}
                helperText={errors.other_lens_type}
                sx={{
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: 1,
                    },
                  },
                }}
              />
            </Grid>
          )}

          {/* Lens Material */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Lens Material"
              name="lens_material_id"
              value={formData.lens_material_id}
              onChange={handleChange}
              error={!!errors.lens_material_id}
              helperText={errors.lens_material_id}
              sx={{
                backgroundColor: '#ffffff',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: 1,
                  },
                },
              }}
            >
              {lensMaterials.map((material) => (
                <MenuItem key={material.id} value={material.id}>
                  {material.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Frame Group: Size, Color, Frame Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Frame
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: 1,
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e0e0e0',
                gap: 2,
              }}
            >
              <Grid container spacing={2} direction="column">
                {/* Size */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Size"
                    name="size"
                    value={formData.size}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, size: value }));
                      setErrors((prev) => ({ ...prev, size: '' }));
                    }}
                    error={!!errors.size}
                    helperText={errors.size}
                    sx={{
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderRadius: 1,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Color */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      border: '1px solid #ccc',
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">Color:</Typography>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: formData.color,
                        border: errors.color
                          ? '2px solid red'
                          : '1px solid #ccc',
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => setColorPickerOpen(true)}
                    />
                    <TextField
                      value={colorInput}
                      onChange={handleColorInputChange}
                      label="Hex"
                      size="small"
                      error={!!errors.color}
                      helperText={errors.color}
                      sx={{
                        width: 100,
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderRadius: 1,
                          },
                        },
                      }}
                    />
                  </Box>
                  <Dialog
                    open={colorPickerOpen}
                    onClose={() => setColorPickerOpen(false)}
                  >
                    <DialogTitle>
                      Select Color
                      <IconButton
                        aria-label="close"
                        onClick={() => setColorPickerOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent>
                      <ChromePicker
                        color={formData.color}
                        onChangeComplete={handleColorChange}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setColorPickerOpen(false)}
                        color="primary"
                      >
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>

                {/* Frame Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Frame Description"
                    name="frame_description"
                    value={formData.frame_description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    sx={{
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderRadius: 1,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Description (required) */}
          <Grid item xs={12} mb={2}>
            <InputLabel shrink sx={{ mb: 1 }}>
              Description <span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              theme="snow"
              style={{ height: '200px', marginBottom: '16px' }}
            />
            {errors.description && (
              <Typography color="error">{errors.description}</Typography>
            )}
          </Grid>

          {/* Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isEditMode ? 'Update Order' : 'Create Order'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

GlassesOrderForm.propTypes = {
  orderId: PropTypes.string,
  initialData: PropTypes.shape({
    lens_type_id: PropTypes.string,
    other_lens_type: PropTypes.string,
    lens_material_id: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    frame_description: PropTypes.string,
    description: PropTypes.string,
    visit_id: PropTypes.string, // Add visit_id to propTypes
  }),
  lensTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  lensMaterials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  visits: PropTypes.arrayOf(
    // Update visits propType to array
    PropTypes.shape({
      visit_id: PropTypes.string.isRequired,
      patient: PropTypes.shape({
        name: PropTypes.string,
      }),
      visit_date: PropTypes.string,
    }),
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dataLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
};

export default GlassesOrderForm;
