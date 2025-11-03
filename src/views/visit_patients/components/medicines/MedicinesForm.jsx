import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Grid,
  IconButton,
  Divider,
  Typography,
  Fade,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from '@mui/icons-material/Delete';

const MedicinesForm = ({
  open,
  onClose,
  visit,
  onSubmitSuccess,
  medicines,
}) => {
  const [medicinesOptions, setMedicinesOptions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ date: null });
  const [error, setError] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [formData, setFormData] = useState([
    { medicine_id: '', quantity: '', frequency: '', note: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill for update
  useEffect(() => {
    if (medicines && medicines.length > 0) {
      setFormData(
        medicines.map((med) => ({
          id: med.id,
          medicine_id: med.medicine_id,
          quantity: med.quantity,
          frequency: med.frequency,
          note: med.note || '',
        })),
      );
    } else {
      setFormData([{ medicine_id: '', quantity: '', frequency: '', note: '' }]);
    }
  }, [medicines, open]);

  // Fetch available medicines
  const fetchMedicinesOptions = async () => {
    try {
      setLoading(true);
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.getMedicines}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMedicinesOptions(data.data.data || []);
      } else {
        toast.warning(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchingVisitPatients = async () => {
    setDataLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }

    const Api = `${Backend.auth}${Backend.getVisits}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }

      if (responseData.success) {
        setData(responseData.data.data);
        setPagination({
          ...pagination,
          last_page: responseData.data.last_page,
          total: responseData.data.total,
        });
        setError(false);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
      setError(true);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedicinesOptions();
      handleFetchingVisitPatients();
    }
  }, [open]);

  const handleChange = (index, field, value) => {
    setFormData((prev) => {
      const newFormData = [...prev];
      newFormData[index] = { ...newFormData[index], [field]: value };
      return newFormData;
    });
  };

  const addMedicine = () => {
    setFormData((prev) => [
      ...prev,
      { medicine_id: '', quantity: '', frequency: '', note: '' },
    ]);
  };

  const removeMedicine = (index) => {
    if (formData.length > 1) {
      setFormData((prev) => prev.filter((_, i) => i !== index));
    } else {
      toast.warning('At least one medicine entry is required');
    }
  };

  const handleSubmit = async () => {
    // if (!visit?.visit_id) {
    //   toast.error('Invalid visit ID');
    //   console.error('Visit object:', visit);
    //   return;
    // }
    if (formData.length === 0) {
      toast.warning('At least one medicine is required');
      return;
    }
    for (const med of formData) {
      if (!med.medicine_id || !med.quantity || !med.frequency) {
        toast.warning('All fields are required for each medicine');
        return;
      }
    }

    try {
      setSubmitting(true);
      const token = await GetToken();
      const payload = {
        medicines: formData.map((med) => ({
          id: med.id, // Include id for updates
          visit_id: med.visit_id, // Include visit_id in each medicine
          medicine_id: med.medicine_id,
          quantity: Number(med.quantity), // Convert to number
          frequency: med.frequency,
          note: med.note || '',
        })),
      };

      console.log('Request Details:', {
        url:
          medicines && medicines.length > 0
            ? `${Backend.auth}${Backend.orderMedicines}/${visit.visit_id}`
            : `${Backend.auth}${Backend.orderMedicines}`,
        method: medicines && medicines.length > 0 ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      });

      let url = `${Backend.auth}${Backend.orderMedicines}`;
      let method = 'POST';
      if (medicines && medicines.length > 0) {
        url = `${Backend.auth}${Backend.orderMedicines}/${visit.visit_id}`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('Backend response:', data);
      if (data.success) {
        toast.success(
          medicines && medicines.length > 0
            ? 'Medicines updated successfully!'
            : 'Medicines added successfully!',
        );
        onSubmitSuccess();
      } else {
        toast.error(data.data?.message || data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="medicines-form-title"
      PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
    >
      <DialogTitle id="medicines-form-title">
        <Typography variant="h5" fontWeight="bold">
          {medicines && medicines.length > 0
            ? 'Update Medicines'
            : 'Add Medicines'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        {submitting && (
          <Fade in={submitting}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          </Fade>
        )}
        {loading ? (
          <Box sx={{ my: 4 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Loading medicines...
            </Typography>
            <Box sx={{ mt: 2 }}>
              <CircularProgress size={30} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            {formData.map((med, index) => (
              <Box
                key={index}
                sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Medicine {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                    {formData.length > 1 && (
                      <IconButton
                        onClick={() => removeMedicine(index)}
                        color="error"
                        aria-label={`Remove Medicine ${index + 1}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Patient"
                      value={med.patient_id}
                      onChange={(e) => {
                        const selectedPatientId = e.target.value;
                        const selectedVisit = data.find(
                          (item) => item.id === selectedPatientId,
                        );
                        handleChange(index, 'patient_id', selectedPatientId);
                        handleChange(
                          index,
                          'visit_id',
                          selectedVisit?.visit_id || '',
                        );
                      }}
                      fullWidth
                      margin="normal"
                      helperText="Select a patient from the list"
                      aria-label={`Patient selection for medicine ${index + 1}`}
                    >
                      {data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.patient_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Medicine"
                      value={med.medicine_id}
                      onChange={(e) =>
                        handleChange(index, 'medicine_id', e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      helperText="Select a medicine from the list"
                      aria-label={`Medicine selection for medicine ${index + 1}`}
                    >
                      {medicinesOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Quantity"
                      value={med.quantity}
                      onChange={(e) =>
                        handleChange(index, 'quantity', e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      type="number"
                      inputProps={{ min: 1 }}
                      helperText="Enter quantity (e.g., 10)"
                      aria-label={`Quantity for medicine ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Frequency"
                      value={med.frequency}
                      onChange={(e) =>
                        handleChange(index, 'frequency', e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      helperText="E.g., Once daily"
                      aria-label={`Frequency for medicine ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Notes
                    </Typography>
                    <ReactQuill
                      value={med.note}
                      onChange={(value) => handleChange(index, 'note', value)}
                      theme="snow"
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        // border: "1px solid",
                        borderColor: 'grey.300',
                      }}
                      aria-label={`Notes for medicine ${index + 1}`}
                    />
                  </Grid>
                </Grid>
                {index < formData.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={addMedicine}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'primary.light', color: 'white' },
              }}
              aria-label="Add another medicine"
            >
              Add Another Medicine
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          disabled={submitting}
          sx={{ textTransform: 'none', fontWeight: 'medium' }}
          aria-label="Cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting}
          sx={{ textTransform: 'none', fontWeight: 'bold', px: 3 }}
          aria-label={
            medicines && medicines.length > 0
              ? 'Update medicines'
              : 'Add medicines'
          }
        >
          {submitting ? (
            <CircularProgress size={20} />
          ) : medicines && medicines.length > 0 ? (
            'Update Medicines'
          ) : (
            'Submit Medicines'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicinesForm;
