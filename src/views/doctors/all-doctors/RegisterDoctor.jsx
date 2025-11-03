import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

export default function RegisterDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    speciality: "",
  });

  const [specialties, setSpecialties] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch specialties from backend
  const fetchSpecialties = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.specialties}`;
    try {
      const res = await fetch(Api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSpecialties(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to load specialties");
      }
    } catch (err) {
      toast.error("Error fetching specialties");
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.doctors}`;

    if (!formData.name || !formData.email || !formData.speciality) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      password: formData.password,
      speciality: formData.speciality,
    };

    try {
      setSubmitting(true);
      const res = await fetch(Api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json", 
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Doctor registered successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          username: "",
          password: "",
          speciality: "",
        });
      } else {
        toast.warning(data.data.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Register Doctor
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </Grid>
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
