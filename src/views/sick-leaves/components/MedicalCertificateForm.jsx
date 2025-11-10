import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { mt } from 'date-fns/locale';

const MedicalCertificateForm = ({
  open,
  onClose,
  editMode,
  formData,
  setFormData,
  patients,
  refreshList,
  selectedCertificate,
}) => {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.patient_id || !formData.diagnosis)
      return toast.warning('Please fill required fields');

    const token = await GetToken();
    const apiUrl = editMode
      ? `${Backend.auth}${Backend.medicalCertificates}/${selectedCertificate.id}`
      : `${Backend.auth}${Backend.medicalCertificates}`;

    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editMode ? 'Certificate updated!' : 'Certificate added!');
        refreshList();
        onClose();
      } else {
        toast.warning(data.data?.message || 'Operation failed');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting form');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editMode ? 'Edit Certificate' : 'Add Certificate'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Patient"
              value={formData.patient_id}
              fullWidth
              onChange={(e) => handleChange('patient_id', e.target.value)}
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.full_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <TextField
              label="Diagnosis"
              value={formData.diagnosis}
              fullWidth
              onChange={(e) => handleChange('diagnosis', e.target.value)}
            />
          </Grid> */}

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <label>
                <strong>Diagnosis</strong>
              </label>
            </Box>
            <ReactQuill
              theme="snow"
              value={formData.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <label>
                <strong>Injury Description</strong>
              </label>
            </Box>
            <ReactQuill
              theme="snow"
              value={formData.injury_description}
              onChange={(value) => handleChange('injury_description', value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <label>
                <strong>Recommendations</strong>
              </label>
            </Box>
            <ReactQuill
              theme="snow"
              value={formData.recommendations}
              onChange={(value) => handleChange('recommendations', value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <label>
                <strong>Remarks</strong>
              </label>
            </Box>
            <ReactQuill
              theme="snow"
              value={formData.remarks}
              onChange={(value) => handleChange('remarks', value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Examination"
              type="date"
              fullWidth
              value={formData.date_of_examination}
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                handleChange('date_of_examination', e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Rest Days"
              type="number"
              fullWidth
              value={formData.rest_days}
              onChange={(e) => handleChange('rest_days', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="issued">Issued</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalCertificateForm;
