import React from "react";
import {
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
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ReferralForm({
  open,
  onClose,
  onSubmit,
  editMode,
  formData,
  setFormData,
  patients = [],
  medicalCenters = [],
}) {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editMode ? "Edit Referral" : "Add Referral"}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Patient */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Patient</InputLabel>
              <Select
                label="Patient"
                value={formData.patient_id || ""}
                onChange={(e) => handleChange("patient_id", e.target.value)}
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

          {/* To Medical Center */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>To Medical Center</InputLabel>
              <Select
                label="To Medical Center"
                value={formData.to_id || ""}
                onChange={(e) => handleChange("to_id", e.target.value)}
              >
                {medicalCenters.length > 0 ? (
                  medicalCenters.map((center) => (
                    <MenuItem key={center.id} value={center.id}>
                      {center.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No medical centers found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Reason */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Reason for Referral
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.reason || ""}
              onChange={(value) => handleChange("reason", value)}
              style={{ height: "120px", marginBottom: "40px" }}
            />
          </Grid>

          {/* History / Examination */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              History / Examination
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.history_exam || ""}
              onChange={(value) => handleChange("history_exam", value)}
              style={{ height: "120px", marginBottom: "40px" }}
            />
          </Grid>

          {/* Physiotherapy Diagnosis */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Physiotherapy Diagnosis
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.physiotherapy_diagnosis || ""}
              onChange={(value) =>
                handleChange("physiotherapy_diagnosis", value)
              }
              style={{ height: "120px", marginBottom: "40px" }}
            />
          </Grid>

          {/* Medical Diagnosis */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Medical Diagnosis
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.medical_diagnosis || ""}
              onChange={(value) => handleChange("medical_diagnosis", value)}
              style={{ height: "120px", marginBottom: "40px" }}
            />
          </Grid>

          {/* Treatment Given */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Treatment Given
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.treatment_given || ""}
              onChange={(value) => handleChange("treatment_given", value)}
              style={{ height: "120px", marginBottom: "40px" }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!formData.patient_id || !formData.reason}
        >
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
