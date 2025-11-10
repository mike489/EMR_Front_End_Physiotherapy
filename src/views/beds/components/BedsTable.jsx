import React, { useState } from "react";
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
} from "@mui/material";
import {
  Edit,
  Delete,
  AssignmentInd,
  SwapHoriz,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import GetToken from "utils/auth-token";
import Backend from "services/backend";
import Fallbacks from 'utils/components/Fallbacks';
import hasPermission from "utils/auth/hasPermission";


const BedTable = ({ beds, onEdit, onDelete, refreshBeds }) => {
  const [assignDialog, setAssignDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [transferBed, setTransferBed] = useState("");
  const [notes, setNotes] = useState("");

  // -------------------------
  // Fetch Patients List
  // -------------------------
  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.patients}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const response = await fetch(Api, { method: "GET", headers });
      const data = await response.json();
      if (data.success) {
        setPatients(data.data?.data || data.data || []);
      } else {
        toast.warning("Failed to fetch patients");
      }
    } catch (error) {
      toast.error("Error fetching patients");
    }
  };

  // -------------------------
  // Assign Patient Handler
  // -------------------------
  const handleAssignPatient = async () => {
    if (!selectedPatient || !notes) {
      toast.warning("Please select a patient and add notes");
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.beds}/${selectedBed.id}/assign`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };
    const payload = {
      patient_id: selectedPatient,
      notes: notes,
    };

    try {
      const response = await fetch(Api, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Patient assigned successfully!");
        refreshBeds();
        setAssignDialog(false);
        setSelectedPatient("");
        setNotes("");
      } else {
        toast.warning(data.data.message || "Assignment failed");
      }
    } catch (error) {
      toast.error(error.message || "Error assigning patient");
    }
  };

  // -------------------------
  // Transfer Bed Handler
  // -------------------------
  const handleTransferBed = async () => {
    if (!transferBed) {
      toast.warning("Please select a bed to transfer to");
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.beds}/${selectedBed.id}/transfer`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };
    const payload = {
      new_bed_id: transferBed,
    };

    try {
      const response = await fetch(Api, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Patient transferred successfully!");
        refreshBeds();
        setTransferDialog(false);
        setTransferBed("");
      } else {
        toast.warning(data.data.message || "Transfer failed");
      }
    } catch (error) {
      toast.error(error.message || "Error transferring patient");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Bed Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, border: "1px solid #ddd" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Bed Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ward</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beds.length > 0 ? (
              beds.map((bed) => (
                <TableRow key={bed.id} hover>
                  <TableCell>{bed.bed_number}</TableCell>
                  <TableCell>{bed.ward?.name}</TableCell>
                  <TableCell>{bed.status}</TableCell>
                  <TableCell align="center">
                    {hasPermission("create_bed_assignment") && (
                      <Tooltip title="Assign Patient">
                        <IconButton
                          color="success"
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

                    {hasPermission("update_bed") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(bed)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {hasPermission("delete_bed") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(bed.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <Fallbacks
          severity="evaluation"
          title="No Bed Found"
          description="Beds will appear here once available."
          sx={{ paddingTop: 6 }}
        />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Patient Dialog */}
      <Dialog
        open={assignDialog}
        onClose={() => setAssignDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assign Patient to Bed</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
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
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>Notes</Typography>
          <ReactQuill
            theme="snow"
            value={notes}
            onChange={setNotes}
            style={{
              height: "150px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignPatient}
            disabled={!hasPermission("create_bed_assignment")}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default BedTable;
