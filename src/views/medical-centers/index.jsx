import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Pagination } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import PageContainer from "ui-component/MainPage";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import hasPermission from "utils/auth/hasPermission";
import MedicalCentersTable from "./components/MedicalCentersTable";
import MedicalCenterFormDialog from "./components/MedicalCenterFormDialog";

export default function MedicalCentersIndex() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const fetchCenters = async (page = 1, perPage = 10) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.medicalCenters}?page=${page}&per_page=${perPage}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();
      if (data.success) {
        const list = data.data?.data || [];
        setCenters(list);
        setPagination({
          page: data.data?.current_page || 1,
          perPage: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          lastPage: data.data?.last_page || 1,
        });
      } else {
        toast.warning(data.message || "Failed to fetch centers");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters(pagination.page, pagination.perPage);
  }, []);

  const handleOpenDialog = (center = null) => {
    if (center) {
      setEditMode(true);
      setSelectedCenter(center);
    } else {
      setEditMode(false);
      setSelectedCenter(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medical center?")) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.medicalCenters}/${id}`;
    try {
      const res = await fetch(Api, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted successfully");
        fetchCenters(pagination.page, pagination.perPage);
      } else {
        toast.warning(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.message || "Delete error");
    }
  };

  if (loading && centers.length === 0) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <PageContainer
      title="Medical Centers Management"
      maxWidth="lg"
      rightOption={
        hasPermission("create_medical_center") && (
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Medical Center
          </Button>
        )
      }
    >
      <MedicalCentersTable centers={centers} onEdit={handleOpenDialog} onDelete={handleDelete} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Pagination
          count={pagination.lastPage}
          page={pagination.page}
          onChange={(e, value) => fetchCenters(value, pagination.perPage)}
          color="primary"
          shape="rounded"
        />
      </Box>

      <MedicalCenterFormDialog
        open={openDialog}
        editMode={editMode}
        center={selectedCenter}
        onClose={handleCloseDialog}
        refreshList={() => fetchCenters(pagination.page, pagination.perPage)}
      />

      <ToastContainer />
    </PageContainer>
  );
}
