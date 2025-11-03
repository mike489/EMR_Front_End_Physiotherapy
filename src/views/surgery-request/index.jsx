import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import SurgeryRequestTable from "./components/SurgeryRequestTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from "utils/auth/hasPermission";
import { Add } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RequestIndex() {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    notes: "",
  });

  // ======================
  // Fetch Data
  // ======================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.surgeryRequests}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch requests");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.patients}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setPatients(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch patients");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.doctors}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchPatients();
    fetchDoctors();
  }, []);

  // ======================
  // Dialog handlers
  // ======================
  const handleOpenDialog = (referral = null) => {
    if (referral) {
      setEditMode(true);
      setSelectedRequests(referral);
      setFormData({
        patient_id: referral.patient?.id || "",
        doctor_id: referral.doctor?.id || referral.doctor?.user?.id || "",
        notes: referral.notes || "",
      });
    } else {
      setEditMode(false);
      setFormData({ patient_id: "", doctor_id: "", notes: "" });
      setSelectedRequests(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ patient_id: "", doctor_id: "", notes: "" });
    setEditMode(false);
    setSelectedRequests(null);
  };

  // ======================
  // Submit handler
  // ======================
  const handleSubmit = async () => {
    // Strip HTML tags from notes to validate empty content
    const notesText = formData.notes.replace(/<(.|\n)*?>/g, "").trim();

    if (!formData.patient_id || !formData.doctor_id || !notesText) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = await GetToken();
      const Api = editMode
        ? `${Backend.auth}${Backend.surgeryRequests}/${selectedRequests.id}`
        : `${Backend.auth}${Backend.surgeryRequests}`;
      const res = await fetch(Api, {
        method: editMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          editMode
            ? "Referral updated successfully!"
            : "Referral added successfully!"
        );
        fetchRequests();
        handleCloseDialog();
      } else {
        // Handle validation errors
        if (data.status === 422 && data.data?.errors) {
          Object.entries(data.data.errors).forEach(([field, messages]) => {
            toast.error(`${field}: ${messages.join(", ")}`);
          });
        } else {
          toast.warning(data.message || "Operation failed");
        }
      }
    } catch (error) {
      toast.error(error.message || "Error submitting referral");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Delete Referral
  // ======================
  const handleDelete = async (id) => {
    try {
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.requests}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Referral deleted successfully!");
        fetchRequests();
      } else {
        toast.warning(data.message || "Failed to delete referral");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting referral");
    }
  };

  // ======================
  // Loading Spinner
  // ======================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ======================
  // Render
  // ======================
  return (
    <PageContainer
      title="Surgery Request Management"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission("create_surgery_request") && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ borderRadius: 2, textTransform: "none" }}
              onClick={() => handleOpenDialog()}
            >
              Add Request
            </Button>
          </Box>
        )
      }
    >
      <SurgeryRequestTable
        requests={requests}
        onEdit={(req) => handleOpenDialog(req)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? "Edit Request" : "Add Request"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                >
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.full_name || patient.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No patients found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={formData.doctor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor_id: e.target.value })
                  }
                >
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <MenuItem
                        key={doctor.id || doctor.user?.id}
                        value={doctor.id || doctor.user?.id}
                      >
                        {doctor.full_name ||
                          doctor.name ||
                          doctor.user?.full_name ||
                          "Unnamed Doctor"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No doctors found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Notes
              </Typography>
              <ReactQuill
                theme="snow"
                value={formData.notes}
                onChange={(value) =>
                  setFormData({ ...formData, notes: value })
                }
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </PageContainer>
  );
}
