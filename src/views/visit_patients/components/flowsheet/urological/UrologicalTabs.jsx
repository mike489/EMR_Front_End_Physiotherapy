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
  CircularProgress,
  IconButton,
  Modal,
  TablePagination,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import UrologicalCreate from './UrologicalCreate';
import UrologicalEdit from './UrologicalEdit';
import hasPermission from 'utils/auth/hasPermission';

const UrologicalTabs = ({ visit }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Permission checks
  const canCreate = hasPermission('create_urological_assessment');
  const canEdit = hasPermission('update_urological_assessment');
  const canDelete = hasPermission('delete_urological_assessment');


  // ---------------- FETCH DATA ----------------
  const fetchAssessments = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.urologicalAssessments}?visit_id=${visit.visit_id}`;
    const headers = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    try {
      setLoading(true);
      const response = await fetch(Api, { headers });
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
  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.urologicalAssessments}/${assessmentId}`;
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
  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenEditModal(true);
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Slice assessments for pagination
  const paginatedAssessments = assessments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Urological Assessments
        </Typography>
        {canCreate && (

        <IconButton
          color="primary"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark', color: 'white' },
          }}
          onClick={() => setOpenCreateModal(true)}
        >
          <Add />
        </IconButton>
        )}
      </Grid>

      {assessments.length ? (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Urinary Amount</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Electrolyte</TableCell>
                    <TableCell>Bacteria</TableCell>
                    <TableCell>Dialysis</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssessments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        {a.assessment_date
                          ? new Date(a.assessment_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{a.urinary_amount || 'N/A'}</TableCell>
                      <TableCell>{a.urinary_color || 'N/A'}</TableCell>
                      <TableCell>{a.electrolyte_status || 'N/A'}</TableCell>
                      <TableCell>{a.bacteria_status || 'N/A'}</TableCell>
                      <TableCell>{a.dialysis || 'N/A'}</TableCell>
                      <TableCell>
                         {(canEdit || canDelete) && (
                          <>
                            {canEdit && (
                              <IconButton color="primary" onClick={() => handleEdit(a)}>
                                <Edit />
                              </IconButton>
                            )}
                            {canDelete && (
                              <IconButton color="error" onClick={() => handleDelete(a.id)}>
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

            {/* ---------------- PAGINATION ---------------- */}
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
         <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Typography>No assessments found</Typography>
        </Box>
      )}

      {/* ---------------- CREATE MODAL ---------------- */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <UrologicalCreate
            visit={visit}
            onClose={() => {
              setOpenCreateModal(false);
              fetchAssessments();
            }}
          />
        </Box>
      </Modal>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedAssessment && (
            <UrologicalEdit
              assessment={selectedAssessment}
              onClose={() => {
                setOpenEditModal(false);
                fetchAssessments();
              }}
            />
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default UrologicalTabs;