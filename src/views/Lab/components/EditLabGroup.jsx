import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';

const EditLabGroup = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  groupId,
  initialData,
}) => {
  const [labTestGroup, setLabTestGroup] = useState({
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  // Load initial data when modal opens or groupId changes
  useEffect(() => {
    if (open && groupId) {
      if (initialData) {
        // Use provided initial data
        setLabTestGroup({
          name: initialData.name || '',
          description: initialData.description || '',
        });
      } else {
        // Fetch data from API if not provided
        fetchGroupData();
      }
    }
  }, [open, groupId, initialData]);

  const fetchGroupData = async () => {
    if (!groupId) return;

    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoryTestGroups}/${groupId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        const groupData = responseData.data;
        setLabTestGroup({
          name: groupData.name || '',
          description: groupData.description || '',
        });
      } else {
        toast.error(responseData.message || 'Failed to fetch group data');
      }
    } catch (error) {
      toast.error('Error fetching group data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLabTestGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!labTestGroup.name.trim() || !labTestGroup.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: labTestGroup.name,
      description: labTestGroup.description,
    };

    onSubmit(groupId, submitData);
  };

  const handleClose = () => {
    // Reset form on close
    setLabTestGroup({
      name: '',
      description: '',
    });
    onClose();
  };

  if (loading) {
    return (
      <DrogaFormModal
        open={open}
        title="Edit Lab Test Group"
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
      title="Edit Lab Test Group"
      handleClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      maxWidth="sm"
      fullWidth
    >
      <Grid container spacing={3}>
        {/* Group Information */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ScienceIcon color="primary" />
            <Typography variant="h6" color="primary">
              Edit Test Group Information
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Group Name"
            name="name"
            value={labTestGroup.name}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g., Ocular Surface & Tear Film Test"
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Group Description"
            name="description"
            value={labTestGroup.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
            placeholder="e.g., Specialized tests to evaluate tear production, tear film stability, and ocular surface health..."
            disabled={isSubmitting}
          />
        </Grid>

        {/* Read-only ID display */}
        {/* <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Group ID: {groupId}
          </Typography>
        </Grid> */}
      </Grid>
    </DrogaFormModal>
  );
};

EditLabGroup.propTypes = {
  open: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

EditLabGroup.defaultProps = {
  groupId: null,
  initialData: null,
};

export default EditLabGroup;
