import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

export default function NurseForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.username) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.nurses}`; 

    try {
      setSubmitting(true);
      const res = await fetch(Api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 302) {
        toast.error(
          "Backend is redirecting (302) — check authentication middleware or token."
        );
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Nurse added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          username: "",
          password: "",
        });
      } else {
        toast.warning(data.data.message || "Failed to add nurse");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Register Nurse
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Register"}
          </Button>
        </Box>
      </Paper>
      <ToastContainer/>
    </Container>
  );
}
