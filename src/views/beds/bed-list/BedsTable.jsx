import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Edit,
  Delete,
  AssignmentInd,
  SwapHoriz,
  ExitToApp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import Fallbacks from 'utils/components/Fallbacks';
import hasPermission from 'utils/auth/hasPermission';

const BedTable = ({ beds, onEdit, onDelete, refreshBeds, patientBeds }) => {
  const [assignDialog, setAssignDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [transferBed, setTransferBed] = useState('');
  const [notes, setNotes] = useState('');

  // -------------------------
  // Fetch Patients List
  // -------------------------
  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.patients}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers });
      const data = await response.json();
      if (data.success) {
        setPatients(data.data?.data || data.data || []);
      } else {
        toast.warning('Failed to fetch patients');
      }
    } catch (error) {
      toast.error('Error fetching patients');
    }
  };

  // -------------------------
  // Assign Patient Handler
  // -------------------------
  const handleAssignPatient = async () => {
    if (!selectedPatient || !notes) {
      toast.warning('Please select a patient and add notes');
      return;
    }

    const token = await GetToken();
    // Use the bed_id from the patient bed assignment, not the assignment id
    const bedId = selectedBed.bed_id || selectedBed.id;
    const Api = `${Backend.auth}${Backend.beds}/${bedId}/assign`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      patient_id: selectedPatient,
      notes: notes,
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Patient assigned successfully!');
        refreshBeds();
        setAssignDialog(false);
        setSelectedPatient('');
        setNotes('');
        setSelectedBed(null);
      } else {
        toast.warning(
          data.message || data.data?.message || 'Assignment failed',
        );
      }
    } catch (error) {
      toast.error(error.data.message || 'Error assigning patient');
    }
  };

  // -------------------------
  // Transfer Bed Handler
  // -------------------------
  const handleTransferBed = async () => {
    if (!transferBed) {
      toast.warning('Please select a bed to transfer to');
      return;
    }

    const token = await GetToken();
    // Use the bed_id from the patient bed assignment, not the assignment id
    const currentBedId = selectedBed.bed_id || selectedBed.id;
    const Api = `${Backend.auth}${Backend.beds}/${currentBedId}/transfer`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      new_bed_id: transferBed,
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Patient transferred successfully!');
        refreshBeds();
        setTransferDialog(false);
        setTransferBed('');
        setSelectedBed(null);
      } else {
        toast.warning(
          data.data.message || data.data?.message || 'Transfer failed',
        );
      }
    } catch (error) {
      toast.error(error.data.message || 'Error transferring patient');
    }
  };

  // -------------------------
  // Release Bed Handler
  // -------------------------

  const handleReleaseBed = async (bed) => {
    try {
      const token = await GetToken();
      const bedId = bed.id;

      const Api = `${Backend.auth}${Backend.beds}/${bedId}/release`;

      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const response = await fetch(Api, { method: 'POST', headers });
      const data = await response.json();

      if (data.success) {
        toast.success('Bed released successfully!');
        refreshBeds();
      } else {
        toast.warning(data.data.message || 'Release failed');
      }
    } catch (error) {
      toast.error(error.data.message || 'Error releasing bed');
    }
  };

  // Helper function to get bed status
  const getBedStatus = (bed) => {
    if (bed.patient && bed.released_at === null) {
      return { status: 'Occupied', color: 'error' };
    } else if (bed.patient && bed.released_at) {
      return { status: 'Not Occupied', color: 'success' };
    } else {
      return { status: 'Available', color: 'success' };
    }
  };

  // Get available beds for transfer (filter out occupied beds)
  const getAvailableBeds = () => {
    return beds.filter((bed) => {
      // Check if this bed has any active patient assignment
      const isOccupied = patientBeds.some(
        (patientBed) =>
          patientBed.bed_id === bed.id &&
          patientBed.patient &&
          patientBed.released_at === null,
      );
      return !isOccupied && bed.id !== (selectedBed?.bed_id || selectedBed?.id);
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Bed Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, border: '1px solid #ddd' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Bed Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ward</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>EMR Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assigned At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientBeds.length > 0 ? (
              patientBeds.map((bed) => {
                const statusInfo = getBedStatus(bed);
                return (
                  <TableRow key={bed.id} hover>
                    <TableCell>{bed.bed_number}</TableCell>
                    <TableCell>{bed.ward?.name}</TableCell>
                    <TableCell>
                      {bed.patient?.full_name || 'Unassigned'}
                    </TableCell>
                    <TableCell>{bed.patient?.emr_number || 'N/A'}</TableCell>
                    <TableCell>
                      {bed.assigned_at
                        ? new Date(bed.assigned_at).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.status}
                        color={statusInfo.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* Assign Patient Button */}
                      {!bed.patient &&
                        hasPermission('create_bed_assignment') && (
                          <Tooltip title="Assign Patient">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedBed(bed);
                                fetchPatients();
                                setAssignDialog(true);
                              }}
                            >
                              <AssignmentInd />
                            </IconButton>
                          </Tooltip>
                        )}

                      {/* Transfer Button - Only show if bed is occupied */}
                      {bed.patient &&
                        bed.released_at === null &&
                        hasPermission('create_bed_assignment') && (
                          <Tooltip title="Transfer">
                            <IconButton
                              color="info"
                              onClick={() => {
                                setSelectedBed(bed);
                                setTransferDialog(true);
                              }}
                            >
                              <SwapHoriz />
                            </IconButton>
                          </Tooltip>
                        )}
                      {bed.patient &&
                        bed.released_at === null &&
                        hasPermission('create_bed_assignment') && (
                          <Tooltip title="Release">
                            <IconButton
                              color="error"
                              onClick={() => handleReleaseBed(bed)}
                            >
                              <ExitToApp />
                            </IconButton>
                          </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Fallbacks
                    severity="evaluation"
                    title="No Beds Found"
                    description="Beds will appear here once available."
                    sx={{ paddingTop: 6 }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Patient Dialog */}
      <Dialog
        open={assignDialog}
        onClose={() => {
          setAssignDialog(false);
          setSelectedBed(null);
          setSelectedPatient('');
          setNotes('');
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assign Patient to Bed</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Assigning to: <strong>{selectedBed?.bed_number}</strong> in{' '}
            <strong>{selectedBed?.ward?.name}</strong>
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              label="Patient"
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.full_name || `${p.first_name} ${p.last_name}`}
                  {p.emr_number ? ` (${p.emr_number})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Notes</Typography>
          <ReactQuill
            theme="snow"
            value={notes}
            onChange={setNotes}
            style={{
              height: '150px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAssignDialog(false);
              setSelectedBed(null);
              setSelectedPatient('');
              setNotes('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignPatient}
            disabled={!hasPermission('create_bed_assignment')}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Bed Dialog */}
      <Dialog
        open={transferDialog}
        onClose={() => {
          setTransferDialog(false);
          setSelectedBed(null);
          setTransferBed('');
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Transfer Patient to Another Bed</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Transferring <strong>{selectedBed?.patient?.full_name}</strong> from{' '}
            <strong>{selectedBed?.bed_number}</strong> to:
          </Typography>

          <FormControl fullWidth>
            <InputLabel>New Bed</InputLabel>
            <Select
              value={transferBed}
              onChange={(e) => setTransferBed(e.target.value)}
              label="New Bed"
            >
              {getAvailableBeds().map((bed) => (
                <MenuItem key={bed.id} value={bed.id}>
                  {bed.bed_number} ({bed.ward?.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTransferDialog(false);
              setSelectedBed(null);
              setTransferBed('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTransferBed}
            disabled={!hasPermission('create_bed_assignment')}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BedTable;
