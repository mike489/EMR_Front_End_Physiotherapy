import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  IconButton,
  Paper,
  Divider,
  Chip,
  FormHelperText
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

const LensForm = ({ 
  open, 
  onClose, 
  onSave, 
  initialData = null,
  title = "Item Details",
  maxWidth = "sm",
  loading = false,
  validationRules = {}
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || ''
        });
        setErrors({});
        setTouched({});
      } else {
        setFormData({ name: '', description: '' });
        setErrors({});
        setTouched({});
      }
    }
  }, [open, initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (validationRules.name?.required && !formData.name.trim()) {
      newErrors.name = validationRules.name?.message || 'Name is required';
    } else if (validationRules.name?.minLength && formData.name.length < validationRules.name.minLength) {
      newErrors.name = `Name must be at least ${validationRules.name.minLength} characters`;
    }
    
    // Description validation (optional)
    if (validationRules.description?.required && !formData.description.trim()) {
      newErrors.description = validationRules.description?.message || 'Description is required';
    } else if (validationRules.description?.maxLength && formData.description.length > validationRules.description.maxLength) {
      newErrors.description = `Description must be less than ${validationRules.description.maxLength} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      
      onSave(submitData);
      onClose();
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Check if form has changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData || { name: '', description: '' });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" component="div">
          {initialData ? 'Edit' : 'Add New'} Lens Material
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ p: 3 }}>
          {/* Name Field */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              required
              autoFocus={!initialData}
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              placeholder={`Enter ${title.toLowerCase()}`}
            />
          </Box>

          {/* Description Field */}
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
            placeholder="Enter description or additional notes..."
          />

          {/* Character counter for description */}
          {formData.description.length > 0 && (
            <FormHelperText sx={{ textAlign: 'right', mt: 0.5 }}>
              {formData.description.length}/500 characters
            </FormHelperText>
          )}

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {Object.values(errors).map((error, index) => (
                  <li key={index} style={{ margin: '4px 0', fontSize: '0.875rem' }}>
                    {error}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

        
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - Cancel button */}
            <Button
              onClick={handleClose}
              startIcon={<CancelIcon />}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>

            {/* Right side - Save button with status */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
         
              <LoadingButton
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                loading={loading}
                loadingPosition="start"
                disabled={!hasChanges || loading}
                size="small"
              >
                {initialData ? 'Update' : 'Create'}
              </LoadingButton>
            </Box>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LensForm;