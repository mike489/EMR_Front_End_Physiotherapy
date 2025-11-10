// src/views/specialties/SpecialtiesIndex.jsx
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
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
  const [allSpecialties, setAllSpecialties] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: "",
  });
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // Pagination state
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  // -------------------------
  // Fetch Specialties with Pagination
  // -------------------------
  const fetchSpecialties = async () => {
  const token = await GetToken();
  const Api = `${Backend.auth}${Backend.specialties}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept : "application/json"
  };

  try {
    setLoading(true);
    const response = await fetch(Api, { method: "GET", headers });
    const data = await response.json();

    if (data.success) {
      const list = data.data || [];

      setAllSpecialties(list); 
    } else {
      toast.warning(data.message || "Failed to fetch specialties");
    }
  } catch (error) {
    toast.error(error.message || "Error fetching specialties");
  } finally {
    setLoading(false);
  }
};

  const fetchPaginateSpecialties = async (page = 1, perPage = 10) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.paginatedSpecialty}?page=${page}&per_page=${perPage}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept : "application/json"
    };


    try {
      setLoading(true);
      const response = await fetch(Api, { method: "GET", headers });
      const data = await response.json();

      if (data.success) {
        const list = data.data?.data || [];
        setSpecialties(list);
        
        setPagination({
          page: data.data?.current_page || 1,
          perPage: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          lastPage: data.data?.last_page || 1,
        });
      } else {
        toast.warning(data.message || "Failed to fetch specialties");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching specialties");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpecialties();
    fetchPaginateSpecialties(1, perPage)
  }, [perPage]);

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
        parent_id: specialty.parent_id || "",
      });
    } else {
      setEditMode(false);
      setFormData({ name: "", description: "", parent_id: "" });
      setSelectedSpecialty(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", description: "", parent_id: "" });
    setSelectedSpecialty(null);
    setEditMode(false);
  };

  // -------------------------
  // Handle Form Submit
  // -------------------------
  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.warning("Name and description are required");
      return;
    }

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.specialties}/${selectedSpecialty.id}`
      : `${Backend.auth}${Backend.specialties}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept : "application/json"
    };

    const payload = {
      name: formData.name,
      description: formData.description,
      parent_id: formData.parent_id || null,
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
        toast.success(editMode ? "Updated!" : "Added!");
        fetchSpecialties(pagination.page, perPage);
        handleCloseDialog();
      } else {
        toast.warning(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete Specialty
  // -------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this specialty?")) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.specialties}/${id}`;

    try {
      const response = await fetch(Api, { method: "DELETE", headers });
      const data = await response.json();

      if (data.success) {
        toast.success("Deleted!");
        fetchSpecialties(pagination.page, perPage);
      } else {
        toast.warning(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -------------------------
  // Loading
  // -------------------------
  if (loading && specialties.length === 0) {
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
      rightOption={
        hasPermission("create_speciality") && (
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => handleOpenDialog()}
          >
            Add Specialty
          </Button>
        )
      }
    >
      <SpecialtiesTable
        specialties={specialties}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* ---------- Custom Pagination ---------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Rows per page */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
            >
              {[5, 10, 20, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Page numbers */}
        <Pagination
          count={pagination.lastPage}
          page={pagination.page}
          onChange={(e, value) => fetchSpecialties(value, perPage)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Parent Specialty</InputLabel>
                <Select
                  value={formData.parent_id}
                  label="Parent Specialty"
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allSpecialties
                    .filter((s) => (editMode ? s.id !== selectedSpecialty.id : true))
                    .map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
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

      <ToastContainer />
    </PageContainer>
  );
}