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
import BedTable from "./components/BedsTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from "utils/auth/hasPermission";
import { Add } from "@mui/icons-material";

export default function BedsIndex() {
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [formData, setFormData] = useState({
    ward_id: "",
    bed_number: "",
  });

  // -------------------------
  // Fetch Beds
  // -------------------------
  const handleFetchingBeds = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.beds}`;
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
        setBeds(responseData.data?.data || responseData.data || []);
      } else {
        toast.warning(responseData.message || "Failed to fetch beds");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching beds");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Fetch Wards for dropdown
  // -------------------------
  const handleFetchingWards = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.wards}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(Api, { method: "GET", headers });
      const responseData = await response.json();

      if (responseData.success) {
        setWards(responseData.data?.data || responseData.data || []);
      } else {
        toast.warning(responseData.message || "Failed to fetch wards");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching wards");
    }
  };

  useEffect(() => {
    handleFetchingBeds();
    handleFetchingWards();
  }, []);

  // -------------------------
  // Open Add/Edit Dialog
  // -------------------------
  const handleOpenDialog = (bed = null) => {
    if (bed) {
      setEditMode(true);
      setSelectedBed(bed);
      setFormData({
        ward_id: bed.ward?.id || "", // Use nested ward id
        bed_number: bed.bed_number || "",
      });
    } else {
      setEditMode(false);
      setFormData({ ward_id: wards[0]?.id || "", bed_number: "" }); // Default to first ward if exists
      setSelectedBed(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ ward_id: "", bed_number: "" });
    setSelectedBed(null);
    setEditMode(false);
  };

  // -------------------------
  // Handle Form Submit
  // -------------------------
  const handleSubmit = async () => {
    if (!formData.ward_id || !formData.bed_number) {
      toast.warning("Please select a ward and enter bed number");
      return;
    }

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.beds}/${selectedBed.id}`
      : `${Backend.auth}${Backend.beds}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const payload = {
      ward_id: formData.ward_id,
      bed_number: formData.bed_number,
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
          editMode ? "Bed updated successfully!" : "Bed added successfully!"
        );
        handleFetchingBeds();
        handleCloseDialog();
      } else {
        toast.warning(responseData.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while submitting");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete Bed
  // -------------------------
  const handleDelete = async (id) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.beds}/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(Api, { method: "DELETE", headers });
      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Bed deleted successfully!");
        handleFetchingBeds();
      } else {
        toast.warning(responseData.message || "Failed to delete bed");
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
      title="Beds Management"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission("create_bed") && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ borderRadius: 2, textTransform: "none" }}
              onClick={() => handleOpenDialog()}
              disabled={wards.length === 0} // Wait for wards to load
            >
              Add Bed
            </Button>
          </Box>
        )
      }
    >
      <BedTable
        beds={beds}
        onEdit={(bed) => handleOpenDialog(bed)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Bed" : "Add Bed"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Ward</InputLabel>
                <Select
                  label="Ward"
                  value={formData.ward_id}
                  onChange={(e) =>
                    setFormData({ ...formData, ward_id: e.target.value })
                  }
                >
                  {wards.length > 0 ? (
                    wards.map((ward) => (
                      <MenuItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No wards available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Bed Number"
                fullWidth
                value={formData.bed_number}
                onChange={(e) =>
                  setFormData({ ...formData, bed_number: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.ward_id || !formData.bed_number}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </PageContainer>
  );
}
