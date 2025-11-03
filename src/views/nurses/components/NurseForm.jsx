import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function NurseForm({ open, onClose, onSaved, editNurse }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (editNurse) {
      setFormData({
        name: editNurse.name || "",
        email: editNurse.email || "",
        phone: editNurse.phone || "",
        username: editNurse.username || "",
        password: "", // don't prefill password
      });
    } else {
      setFormData({ name: "", email: "", phone: "", username: "", password: "" });
    }
  }, [editNurse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editNurse) {
      onSaved({ ...formData }); // for edit
    } else {
      onSaved({ ...formData }); // for add
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editNurse ? "Edit Nurse" : "Add Nurse"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        {!editNurse && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editNurse ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
