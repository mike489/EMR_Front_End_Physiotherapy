import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import SpecialtiesTable from "./components/SpecialtiesTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from "utils/auth/hasPermission";
import { Add } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SpecialtiesIndex() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // -------------------------
  // Fetch Specialties
  // -------------------------
  const handleFetchingSpecialties = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.specialties}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: "GET", headers });
      const responseData = await response.json();

      if (responseData.success) {
        setSpecialties(responseData.data?.data || responseData.data || []);
      } else {
        toast.warning(responseData.message || "Failed to fetch specialties");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching specialties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchingSpecialties();
  }, []);

  // -------------------------
  // Open Add/Edit Dialog
  // -------------------------
  const handleOpenDialog = (specialty = null) => {
    if (specialty) {
      setEditMode(true);
      setSelectedSpecialty(specialty);
      setFormData({
        name: specialty.name || "",
        description: specialty.description || "",
      });
    } else {
      setEditMode(false);
      setFormData({ name: "", description: "" });
      setSelectedSpecialty(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", description: "" });
    setSelectedSpecialty(null);
    setEditMode(false);
  };

  // -------------------------
  // Handle Form Submit
  // -------------------------
  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.warning("Please enter name and description");
      return;
    }

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.specialties}/${selectedSpecialty.id}`
      : `${Backend.auth}${Backend.specialties}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
      setLoading(true);
      const response = await fetch(Api, {
        method: editMode ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(
          editMode
            ? "Specialty updated successfully!"
            : "Specialty added successfully!"
        );
        handleFetchingSpecialties();
        handleCloseDialog();
      } else {
        toast.warning(responseData.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete Specialty
  // -------------------------
  const handleDelete = async (id) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.specialties}/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(Api, { method: "DELETE", headers });
      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Specialty deleted successfully!");
        handleFetchingSpecialties();
      } else {
        toast.warning(responseData.message || "Failed to delete specialty");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while deleting");
    }
  };

  // -------------------------
  // Loading Spinner
  // -------------------------
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // -------------------------
  // Render Page
  // -------------------------
  return (
    <PageContainer
      title="Specialties Management"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission("create_speciality") && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ borderRadius: 2, textTransform: "none" }}
              onClick={() => handleOpenDialog()}
            >
              Add Specialty
            </Button>
          </Box>
        )
      }
    >
      <SpecialtiesTable
        specialties={specialties}
        onEdit={(specialty) => handleOpenDialog(specialty)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? "Edit Specialty" : "Add Specialty"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Specialty Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
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
            disabled={!formData.name || !formData.description}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </PageContainer>
  );
}
