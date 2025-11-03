import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import ReferralTable from "./components/ReferralTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from "utils/auth/hasPermission";
import { Add } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ReferralIndex() {
  const [referrals, setReferrals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: "",
    to_doctor_id: "",
    reason: "",
  });

  // ======================
  // Fetch Data
  // ======================
  const fetchReferrals = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.referrals}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { method: "GET", headers });
      const data = await res.json();
      if (data.success) {
        setReferrals(data.data?.data || data.data || []);
      } else {
        toast.warning("Failed to fetch referrals");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching referrals");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchDoctors = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.getDoctors}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const response = await fetch(Api, { method: "GET", headers });
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data?.data || data.data || []);
      } else {
        toast.warning("Failed to fetch doctors");
      }
    } catch (error) {
      toast.error("Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchReferrals();
    fetchPatients();
    fetchDoctors();
  }, []);

  // ======================
  // Dialog handlers
  // ======================
  const handleOpenDialog = (referral = null) => {
    if (referral) {
      setEditMode(true);
      setSelectedReferral(referral);
      setFormData({
        patient_id: referral.patient?.id || "",
        to_doctor_id: referral.to_doctor?.id || "",
        reason: referral.reason || "",
      });
    } else {
      setEditMode(false);
      setFormData({ patient_id: "", to_doctor_id: "", reason: "" });
      setSelectedReferral(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ patient_id: "", to_doctor_id: "", reason: "" });
    setEditMode(false);
    setSelectedReferral(null);
  };

  // ======================
  // Submit handler
  // ======================
  const handleSubmit = async () => {
    if (!formData.patient_id || !formData.to_doctor_id || !formData.reason) {
      toast.warning("Please fill all required fields");
      return;
    }

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.referrals}/${selectedReferral.id}`
      : `${Backend.auth}${Backend.referrals}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const payload = {
      patient_id: formData.patient_id,
      to_doctor_id: formData.to_doctor_id,
      reason: formData.reason,
    };

    try {
      setLoading(true);
      const response = await fetch(Api, {
        method: editMode ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(
          editMode
            ? "Referral updated successfully!"
            : "Referral added successfully!"
        );
        fetchReferrals();
        handleCloseDialog();
      } else {
        toast.warning(data.data.message || "Operation failed");
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
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.referrals}/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(Api, { method: "DELETE", headers });
      const data = await response.json();
      if (data.success) {
        toast.success("Referral deleted successfully!");
        fetchReferrals();
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
      title="Referral Management"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission("create_referral") && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ borderRadius: 2, textTransform: "none" }}
              onClick={() => handleOpenDialog()}
            >
              Add Referral
            </Button>
          </Box>
        )
      }
    >
      <ReferralTable
        referrals={referrals}
        onEdit={(ref) => handleOpenDialog(ref)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? "Edit Referral" : "Add Referral"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  label="Patient"
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
                  label="Doctor"
                  value={formData.to_doctor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, to_doctor_id: e.target.value })
                  }
                >
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.full_name || doctor.name}
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
                Reason for Referral
              </Typography>
              <ReactQuill
                theme="snow"
                value={formData.reason}
                onChange={(value) =>
                  setFormData({ ...formData, reason: value })
                }
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.patient_id || !formData.to_doctor_id || !formData.reason
            }
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </PageContainer>
  );
}
