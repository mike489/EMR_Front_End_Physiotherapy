import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import GetToken from "utils/auth-token";
import Backend from "services/backend";
import { toast } from "react-toastify";
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import PageContainer from "ui-component/MainPage";


export default function MyPatientsTable({ doctorId, open, onClose, onView }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    if (!doctorId) return;
    const token = await GetToken();
    const Api = doctorId
      ? `${Backend.auth}${Backend.myPatients}?doctor_id=${doctorId}`
      : `${Backend.auth}${Backend.myPatients}`;

    try {
      setLoading(true);
      const res = await fetch(Api, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setPatients(data.data || []);
      else toast.warning(data.message || "Failed to fetch patients");
    } catch (err) {
      toast.error(err.message || "Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchPatients();
  }, [open, doctorId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>My Patients</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : patients.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>EMR Number</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.full_name}</TableCell>
                  <TableCell>{patient.emr_number || "—"}</TableCell>
                  <TableCell>{patient.phone || "—"}</TableCell>
                  <TableCell>{patient.gender || "—"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onView(patient)}>
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Fallbacks
              severity="evaluation"
              title="No Patients Found"
              description="Patients will appear here once available."
              sx={{ paddingTop: 6 }}
            />
          </Box>

        )}
      </DialogContent>
    </Dialog>
  );
}

