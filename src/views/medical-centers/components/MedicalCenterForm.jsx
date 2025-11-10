import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box } from "@mui/material";
import GetToken from "utils/auth-token";
import Backend from "services/backend";
import { toast } from "react-toastify";

export default function MedicalCenterForm({ editMode, center, onClose, refreshList }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    code: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && center) setFormData(center);
  }, [editMode, center]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !formData.code) {
      toast.warning("Name, type, and code are required");
      return;
    }

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.medicalCenters}/${center.id}`
      : `${Backend.auth}${Backend.medicalCenters}`;

    try {
      setLoading(true);
      const res = await fetch(Api, {
        method: editMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editMode ? "Updated!" : "Created!");
        refreshList();
        onClose();
      } else toast.warning(data.message || "Operation failed");
    } catch (err) {
      toast.error(err.message || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name" fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <MenuItem value="clinic">Clinic</MenuItem>
              <MenuItem value="hospital">Hospital</MenuItem>
              <MenuItem value="health_center">Health Center</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}><TextField label="Code" fullWidth value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Email" fullWidth value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Phone" fullWidth value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Address" fullWidth multiline value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>{editMode ? "Update" : "Add"}</Button>
      </Box>
    </Box>
  );
}
