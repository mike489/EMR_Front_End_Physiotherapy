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
  IconButton,
  Modal,
  CircularProgress,
  Grid,
  TablePagination,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import IntravenousCreate from './IntravenousCreate';
import IntravenousEdit from './IntravenousEdit';
import hasPermission from 'utils/auth/hasPermission';

const IntravenousTabs = ({ visit }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const canCreate = hasPermission('create_intravenous_therapy');
  const canEdit = hasPermission('update_intravenous_therapy');
  const canDelete = hasPermission('delete_intravenous_therapy');

  // ---------------- FETCH DATA ----------------
  const fetchAssessments = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.intravenousTherapies}?visit_id=${visit.visit_id}`;
    const headers = { Authorization: `Bearer ${token}`, accept: 'application/json' };
    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();
      if (data.success) {
        setAssessments(data.data.data || []);
      } else {
        toast.warning(data.message || 'No assessments found');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // ---------------- DELETE ACTION ----------------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.intravenousTherapies}/${id}`;
    try {
      const res = await fetch(Api, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Intravenous therapy assessment deleted successfully');
        fetchAssessments();
      } else {
        toast.error(data.data?.message || 'Failed to delete assessment');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  // ---------------- EDIT ACTION ----------------
  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenEdit(true);
  };

  // ---------------- PAGINATION HANDLERS ----------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Slice assessments for pagination
  const paginatedAssessments = assessments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Intravenous Therapy Assessments
        </Typography>
        {canCreate && (

        <IconButton
          color="primary"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark', color: 'white' },
          }}
          onClick={() => setOpenCreate(true)}
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
                    <TableCell>Site Inspection</TableCell>
                    <TableCell>Infiltration</TableCell>
                    <TableCell>Tubing</TableCell>
                    <TableCell>Rate (mL/hr)</TableCell>
                    <TableCell>Fluid Overload</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssessments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        {a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{a.site_inspection || 'N/A'}</TableCell>
                      <TableCell>{a.infiltration || 'N/A'}</TableCell>
                      <TableCell>{a.tubing || 'N/A'}</TableCell>
                      <TableCell>{a.rate || 'N/A'}</TableCell>
                      <TableCell>{a.fluid_overload || 'N/A'}</TableCell>
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
        <Typography>No Intravenous Therapy assessments found</Typography>
        </Box>
      )}

      {/* ---------------- CREATE MODAL ---------------- */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <IntravenousCreate
            visit={visit}
            onClose={() => {
              setOpenCreate(false);
              fetchAssessments();
            }}
          />
        </Box>
      </Modal>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          {selectedAssessment && (
            <IntravenousEdit
              assessment={selectedAssessment}
              onClose={() => {
                setOpenEdit(false);
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

export default IntravenousTabs;