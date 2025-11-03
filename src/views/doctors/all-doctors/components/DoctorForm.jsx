import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

export default function DoctorForm({ open, onClose, onSaved, editDoctor, specialties }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    speciality: "",
  
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editDoctor) {
      setFormData({
        name: editDoctor.name || "",
        email: editDoctor.email || "",
        phone: editDoctor.phone || "",
        username: editDoctor.username || "",
        password: "",
        speciality:
          typeof editDoctor.speciality === "object"
            ? editDoctor.speciality.id
            : specialties.find((s) => s.name === editDoctor.speciality)?.id || "",
    
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        speciality: "",

      });
    }
  }, [editDoctor, specialties]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const token = await GetToken();
    const Api = editDoctor
      ? `${Backend.auth}${Backend.doctors}/${editDoctor.id}`
      : `${Backend.auth}${Backend.doctors}`;
    const method = editDoctor ? "PUT" : "POST";

    if (!formData.name || !formData.email || !formData.speciality) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      ...(formData.password && { password: formData.password }),
      speciality: formData.speciality,
    
    };

    try {
      setSubmitting(true);
      const res = await fetch(Api, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editDoctor ? "Doctor updated successfully!" : "Doctor added successfully!");
        onSaved();
      } else {
        toast.warning(data.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editDoctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Username"
              fullWidth
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </Grid>
          {!editDoctor && (
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Specialty</InputLabel>
              <Select
                label="Specialty"
                value={formData.speciality}
                onChange={(e) => handleChange("speciality", e.target.value)}
              >
                {specialties.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : editDoctor ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
