import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LocalHospital as TestIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';

const EditRadiology = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  testId,
  initialData,
  groupId,
}) => {
  const [radiology, setRadiologyTest] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  // Load initial data when modal opens or testId changes
  useEffect(() => {
    if (open && testId) {
      if (initialData) {
        // Use provided initial data
        setRadiologyTest({
          name: initialData.name || '',
          price: initialData.price || '',
          description: initialData.description || '',
        });
      } else {
        // Fetch data from API if not provided
        fetchTestData();
      }
    }
  }, [open, testId, initialData]);

  const fetchTestData = async () => {
    if (!testId) return;

    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologyDepartments}/${testId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        const testData = responseData.data;
        setRadiologyTest({
          name: testData.name || '',
          price: testData.price || '',
          description: testData.description || '',
        });
      } else {
        toast.error(responseData.message || 'Failed to fetch radiology data');
      }
    } catch (error) {
      toast.error('Error fetching radiology data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRadiologyTest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!radiology.name.trim() || !radiology.price || !radiology.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (isNaN(radiology.price) || parseFloat(radiology.price) <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: radiology.name,
      price: parseFloat(radiology.price),
      description: radiology.description,
      group_id: groupId, // Include group ID if needed for the API
    };

    onSubmit(testId, submitData);
  };

  const handleClose = () => {
    // Reset form on close
    setRadiologyTest({
      name: '',
      price: '',
      description: '',
    });
    onClose();
  };

  if (loading) {
    return (
      <DrogaFormModal
        open={open}
        title="Edit Lab Radiology"
        handleClose={handleClose}
        onCancel={handleClose}
        submitting={isSubmitting}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      </DrogaFormModal>
    );
  }

  return (
    <DrogaFormModal
      open={open}
      title="Edit Radiology"
      handleClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      maxWidth="sm"
      fullWidth
    >
      <Grid container spacing={3}>
        {/* Radiology Information */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TestIcon color="primary" />
            <Typography variant="h6" color="primary">
              Edit Radiology Information
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Radiology Name"
            name="name"
            value={radiology.name}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g., Schirmer's Radiology"
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Price "
            name="price"
            type="number"
            value={radiology.price}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            placeholder="e.g., 100"
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Radiology Description"
            name="description"
            value={radiology.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            placeholder="e.g., Measures tear production using filter paper strips..."
            disabled={isSubmitting}
          />
        </Grid>

      
      </Grid>
    </DrogaFormModal>
  );
};

EditRadiology.propTypes = {
  open: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  testId: PropTypes.string,
  groupId: PropTypes.string,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
  }),
};

EditRadiology.defaultProps = {
  testId: null,
  groupId: null,
  initialData: null,
};

export default EditRadiology;
