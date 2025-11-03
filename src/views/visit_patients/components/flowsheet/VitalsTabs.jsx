import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Modal,
  CircularProgress,
  IconButton,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Edit, Delete } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import CreateVitals from './CreateVitals';
import EditVitals from './EditVitals';
import hasPermission from 'utils/auth/hasPermission';

const VitalsTabs = ({ visit }) => {
  const [vitalResults, setVitalResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVitals, setSelectedVitals] = useState({});
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [vitalToEdit, setVitalToEdit] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

   const canCreate = hasPermission('create_vital_sign');
    const canEdit = hasPermission('update_vital_sign');
    const canDelete = hasPermission('delete_vital_sign');
  

  // ---------------- FETCH VITALS ----------------
  const handleFetchingVitals = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.vitalSigns}?visit_id=${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setVitalResults(responseData.data.data || []);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchingVitals();
  }, []);

  // ---------------- SELECT VITALS ----------------
  const handleVitalSelection = (vitalId) => {
    const vital = vitalResults.find((v) => v.id === vitalId);
    if (vital && !vital.is_payment_completed) {
      setSelectedVitals((prev) => ({
        ...prev,
        [vitalId]: !prev[vitalId],
      }));
    }
  };

  const getSelectedTotalAmount = () => {
    return vitalResults.reduce((total, vital) => {
      if (selectedVitals[vital.id]) total += Number(vital.amount) || 0;
      return total;
    }, 0);
  };

  // ---------------- CREATE PAYMENT ----------------
  const handleCreateVitalPayment = async () => {
    const selectedVitalIds = Object.keys(selectedVitals).filter((v) => selectedVitals[v]);
    if (selectedVitalIds.length === 0) {
      toast.warning('Please select at least one vital');
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.vitalsPayment}/${visit.visit_id}`;
    const header = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    const formData = new FormData();
    selectedVitalIds.forEach((id) => formData.append('patient_vitals[]', id));

    setSubmitting(true);
    try {
      const response = await fetch(Api, { method: 'POST', headers: header, body: formData });
      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Vital payment created successfully!');
        setSelectedVitals({});
        handleFetchingVitals();
      } else {
        toast.error(responseData.data.message || 'Failed to create vital payment');
      }
    } catch (error) {
      toast.error('Error creating vital payment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

   const handleDelete = async (vitalId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.vitalSigns}/${vitalId}`;
    const headers = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    try {
      const response = await fetch(Api, { method: 'DELETE', headers });
      const data = await response.json();
      if (data.success) {
        toast.success('Assessment deleted successfully');
        fetchAssessments();
      } else {
        toast.error(data.data.message || 'Failed to delete assessment');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- EDIT ACTION ----------------
  const handleEditClick = (vital) => {
    setVitalToEdit(vital);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setVitalToEdit(null);
    handleFetchingVitals();
  };
  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    // setVitalToCreate(null);
    handleFetchingVitals();
  };
  // ---------------- PAGINATION HANDLERS ----------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const paginatedVitals = vitalResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Vital Signs
          </Typography>
        </Grid>
        <Grid item>
          {canCreate && (
          <IconButton
            color="primary"
            onClick={() => setOpenCreateModal(true)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark', color: 'white' },
            }}
            aria-label="Create new Vitals"
          >
            <AddIcon />
          </IconButton>

          )}
        </Grid>
      </Grid>

      {vitalResults.length > 0 ? (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Temperature (°C)</TableCell>
                    <TableCell>Oxygen Saturation</TableCell>

                    <TableCell>Heart Rate (bpm)</TableCell>
                    <TableCell>Respiration Rate</TableCell>
                    <TableCell>Blood Pressure</TableCell>
                    <TableCell>BP Method</TableCell>
                    <TableCell>BP Location</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVitals.map((vital) => (
                    <TableRow key={vital.id}>
                      <TableCell>{vital.temperature }</TableCell>
                      <TableCell>{vital.oxygen_saturation }</TableCell>
                      <TableCell>{vital.heart_rate }</TableCell>
                      <TableCell>{vital.respiratory_rate }</TableCell>
                      <TableCell>{vital.blood_pressure }</TableCell>
                      <TableCell>{vital.bp_method }</TableCell>
                      <TableCell>{vital.bp_location }</TableCell>
                      <TableCell>
                         {(canEdit || canDelete) && (
                          <>
                            {canEdit && (
                              <IconButton color="primary" onClick={() => handleEditClick(vital)}>
                                <Edit />
                              </IconButton>
                            )}
                            {canDelete && (
                              <IconButton color="error" onClick={() => handleDelete(vital.id)}>
                                <Delete />
                              </IconButton>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={vitalResults.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      ) : (
         <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Typography variant="h6" color="text.secondary">
            No vitals available
          </Typography>
        </Box>
      )}

      {vitalResults.length > 0 && getSelectedTotalAmount() > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="primary.main" fontWeight="medium" sx={{ mb: 2 }}>
            Total: ETB{getSelectedTotalAmount()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateVitalPayment}
            disabled={submitting || Object.values(selectedVitals).filter(Boolean).length === 0}
            sx={{ minWidth: 200 }}
          >
            {submitting
              ? <CircularProgress size={24} />
              : `Create Selected Vitals - ETB${getSelectedTotalAmount()}`}
          </Button>
        </Box>
      )}

      {/* CREATE VITAL MODAL */}
      <Modal open={openCreateModal} onClose={handleCreateModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '600px' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <CreateVitals visit={visit} onClose={handleCreateModalClose} />
        </Box>
      </Modal>

      {/* EDIT VITAL MODAL */}
      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '600px' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {vitalToEdit && <EditVitals visit={visit} vital={vitalToEdit} onClose={handleEditModalClose} />}
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default VitalsTabs;
