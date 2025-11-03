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
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import WardTable from "./components/WardTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from 'utils/auth/hasPermission';
import { Add } from "@mui/icons-material";


export default function WardIndex() {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", capacity: "" });
    const [selectedWard, setSelectedWard] = useState(null);

    // -------------------------
    // Fetch Wards
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
            setLoading(true);
            const response = await fetch(Api, { method: "GET", headers });
            const responseData = await response.json();

            if (responseData.success) {
                setWards(responseData.data?.data || responseData.data || []);
            } else {
                toast.warning(responseData.message || "Failed to fetch wards");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while fetching wards");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchingWards();
    }, []);

    // -------------------------
    // Open Add/Edit Dialog
    // -------------------------
    const handleOpenDialog = (ward = null) => {
        if (ward) {
            setEditMode(true);
            setSelectedWard(ward);
            setFormData({
                name: ward.name,
                description: ward.description,
                capacity: ward.capacity,
            });
        } else {
            setEditMode(false);
            setFormData({ name: "", description: "", capacity: "" });
            setSelectedWard(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ name: "", description: "", capacity: "" });
        setSelectedWard(null);
        setEditMode(false);
    };


    // -------------------------
    // Handle Form Submit
    // -------------------------
    const handleSubmit = async () => {
        const token = await GetToken();
        const Api = editMode
            ? `${Backend.auth}${Backend.wards}/${selectedWard.id}`
            : `${Backend.auth}${Backend.wards}`;
        const headers = {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
        };

        const payload = {
            name: formData.name,
            description: formData.description,
            capacity: Number(formData.capacity),
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
                    editMode ? "Ward updated successfully!" : "Ward added successfully!"
                );
                handleFetchingWards();
                handleCloseDialog();
            } else {
                toast.warning(responseData.message || "Operation failed");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // Delete Ward
    // -------------------------
    const handleDelete = async (id) => {
        const token = await GetToken();
        const Api = `${Backend.auth}${Backend.wards}/${id}`;
        const headers = {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(Api, { method: "DELETE", headers });
            const responseData = await response.json();

            if (responseData.success) {
                toast.success("Ward deleted successfully!");
                handleFetchingWards();
            } else {
                toast.warning(responseData.message || "Failed to delete ward");
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
        <PageContainer title="Ward Management" maxWidth="lg" sx={{ mt: 4, mb: 4 }} rightOption={hasPermission('create_ward') && (
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2} // Optional spacing
            >

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                    onClick={() => handleOpenDialog()}
                >
                    Add Ward
                </Button>
            </Box>
        )}>
            <WardTable
                wards={wards}
                onEdit={(ward) => handleOpenDialog(ward)}
                onDelete={(id) => handleDelete(id)}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? "Edit Ward" : "Add Ward"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Ward Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Capacity"
                                type="number"
                                fullWidth
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editMode ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer/>
        </PageContainer>
    );
}
