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
  Grid,
  Modal,
  CircularProgress,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import CardiovascularCreate from './CardiovascularCreate';
import CardiovascularEdit from './CardiovascularEdit';
import hasPermission from 'utils/auth/hasPermission';

const CardiovascularTabs = ({ visit }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [assessmentToEdit, setAssessmentToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Permission checks
  const canCreate = hasPermission('create_cardiovascular_assessment');
  const canEdit = hasPermission('update_cardiovascular_assessment');
  const canDelete = hasPermission('delete_cardiovascular_assessment');

  // ---------------- FETCH DATA ----------------
  const fetchAssessments = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.cardiovascularAssessments}?visit_id=${visit.visit_id}`;
    const header = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.data.data || []);
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // ---------------- DELETE ACTION ----------------
  const handleDelete = async (id) => {
    if (!canDelete) {
      toast.error('You do not have permission to delete assessments');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.cardiovascularAssessments}/${id}`;
    const header = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    setSubmitting(true);
    try {
      const response = await fetch(Api, { method: 'DELETE', headers: header });
      const data = await response.json();
      if (data.success) {
        toast.success('Assessment deleted successfully');
        fetchAssessments();
      } else {
        toast.error(data.data.message || 'Failed to delete assessment');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- EDIT ACTION ----------------
  const handleEditClick = (assessment) => {
    if (!canEdit) {
      toast.error('You do not have permission to edit assessments');
      return;
    }
    setAssessmentToEdit(assessment);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setAssessmentToEdit(null);
    fetchAssessments();
  };

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    fetchAssessments();
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

  // Slice assessments for pagination
  const paginatedAssessments = assessments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Cardiovascular Assessments
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
            >
              <Add />
            </IconButton>
          )}
        </Grid>
      </Grid>

      {assessments.length > 0 ? (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Assessment Date</TableCell>
                    <TableCell>S1/S2 Sound</TableCell>
                    <TableCell>Murmur</TableCell>
                    <TableCell>Rhythm</TableCell>
                    <TableCell>Heart Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{assessment.assessment_date || 'N/A'}</TableCell>
                      <TableCell>{assessment['s1/s2_sound'] || 'N/A'}</TableCell>
                      <TableCell>{assessment.murmur || 'N/A'}</TableCell>
                      <TableCell>{assessment.rhythm || 'N/A'}</TableCell>
                      <TableCell>{assessment.heart_rate || 'N/A'}</TableCell>
                      <TableCell>
                        {(canEdit || canDelete) && (
                          <>
                            {canEdit && (
                              <IconButton color="primary" onClick={() => handleEditClick(assessment)}>
                                <Edit />
                              </IconButton>
                            )}
                            {canDelete && (
                              <IconButton color="error" onClick={() => handleDelete(assessment.id)}>
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
              count={assessments.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No cardiovascular assessments available
          </Typography>
        </Box>
      )}

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
          <CardiovascularCreate visit={visit} onClose={handleCreateModalClose} />
        </Box>
      </Modal>

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
          {assessmentToEdit && (
            <CardiovascularEdit
              assessment={assessmentToEdit}
              onClose={handleEditModalClose}
            />
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default CardiovascularTabs;