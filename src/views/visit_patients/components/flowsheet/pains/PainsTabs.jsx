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
import PainsCreate from './PainsCreate';
import PainsEdit from './PainsEdit';
import hasPermission from 'utils/auth/hasPermission';

const PainsTabs = ({ visit }) => {
  const [pains, setPains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPain, setSelectedPain] = useState(null);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Permission checks
  const canCreate = hasPermission('create_pain');
  const canEdit = hasPermission('update_pain');
  const canDelete = hasPermission('delete_pain');


  // ---------------- FETCH DATA ----------------
  const fetchPains = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.pains}?visit_id=${visit.visit_id}`;
    const headers = { Authorization: `Bearer ${token}`, accept: 'application/json' };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();
      if (data.success) {
        setPains(data.data.data || []);
      } else {
        toast.warning(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPains();
  }, []);

  // ---------------- DELETE ACTION ----------------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pain record?')) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.pains}/${id}`;
    try {
      const res = await fetch(Api, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Deleted successfully');
        fetchPains();
      } else {
        toast.error(data.data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------------- EDIT ACTION ----------------
  const handleEdit = (pain) => {
    setSelectedPain(pain);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Slice pains for pagination
  const paginatedPains = pains.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Pain Assessments
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

      {pains.length ? (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Score</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Assessment</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Orientation</TableCell>
                    <TableCell>Onset</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Clinical Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
               <TableBody>
  {paginatedPains.map((p) => (
    <TableRow key={p.id}>
      <TableCell>{p.pain_score }</TableCell>
      <TableCell>{p.pain_location }</TableCell>

      {/* Render HTML safely */}
      <TableCell>
        {p.pain_assessment ? (
          <span dangerouslySetInnerHTML={{ __html: p.pain_assessment }} />
        ) : (
          ''
        )}
      </TableCell>

      <TableCell>{p.pain_type }</TableCell>
      <TableCell>{p.orientation }</TableCell>
      <TableCell>{p.pain_onset }</TableCell>
      <TableCell>{p.pain_frequency }</TableCell>

      {/* Render HTML safely */}
      <TableCell>
        {p.clinical_progress ? (
          <span dangerouslySetInnerHTML={{ __html: p.clinical_progress }} />
        ) : (
          ''
        )}
      </TableCell>

      <TableCell>
        {(canEdit || canDelete) && (
          <>
            {canEdit && (
              <IconButton color="primary" onClick={() => handleEdit(p)}>
                <Edit />
              </IconButton>
            )}
            {canDelete && (
              <IconButton color="error" onClick={() => handleDelete(p.id)}>
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
              count={pains.length}
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
          <Typography>No pain assessments found</Typography>
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
            maxHeight: '100%',   // limit modal height
            overflowY: 'auto',
          }}
        >
          <PainsCreate
            visit={visit}
            onClose={() => {
              setOpenCreate(false);
              fetchPains();
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
            maxHeight: '100%',   // limit modal height
            overflowY: 'auto',
          }}
        >
          {selectedPain && (
            <PainsEdit
              assessment={selectedPain}
              onClose={() => {
                setOpenEdit(false);
                fetchPains();
              }}
            />
          )}
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default PainsTabs;