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

const EditLabTest = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  testId,
  initialData,
  groupId,
}) => {
  const [labTest, setLabTest] = useState({
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
        setLabTest({
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
    const Api = `${Backend.auth}${Backend.laboratoryTests}/${testId}`;
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
        setLabTest({
          name: testData.name || '',
          price: testData.price || '',
          description: testData.description || '',
        });
      } else {
        toast.error(responseData.message || 'Failed to fetch test data');
      }
    } catch (error) {
      toast.error('Error fetching test data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLabTest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!labTest.name.trim() || !labTest.price || !labTest.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (isNaN(labTest.price) || parseFloat(labTest.price) <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: labTest.name,
      price: parseFloat(labTest.price),
      description: labTest.description,
      group_id: groupId, // Include group ID if needed for the API
    };

    onSubmit(testId, submitData);
  };

  const handleClose = () => {
    // Reset form on close
    setLabTest({
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
        title="Edit Lab Test"
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
      title="Edit Lab Test"
      handleClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      maxWidth="sm"
      fullWidth
    >
      <Grid container spacing={3}>
        {/* Test Information */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TestIcon color="primary" />
            <Typography variant="h6" color="primary">
              Edit Test Information
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Test Name"
            name="name"
            value={labTest.name}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g., Schirmer's Test"
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Price (ETB)"
            name="price"
            type="number"
            value={labTest.price}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            placeholder="e.g., 100"
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Test Description"
            name="description"
            value={labTest.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            placeholder="e.g., Measures tear production using filter paper strips..."
            disabled={isSubmitting}
          />
        </Grid>

        {/* Read-only ID display */}
        {/* <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Test ID: {testId}
          </Typography>
          {groupId && (
            <Typography variant="body2" color="text.secondary">
              Group ID: {groupId}
            </Typography>
          )}
        </Grid> */}
      </Grid>
    </DrogaFormModal>
  );
};

EditLabTest.propTypes = {
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

EditLabTest.defaultProps = {
  testId: null,
  groupId: null,
  initialData: null,
};

export default EditLabTest;
