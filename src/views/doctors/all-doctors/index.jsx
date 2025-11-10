// src/views/doctors/AllDoctors.jsx
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import hasPermission from "utils/auth/hasPermission";
import DoctorsTable from "./components/DoctorsTable";
import DoctorForm from "./components/DoctorForm";
import MyPatientsTable from "../components/MyPatientsTable";
import Fallbacks from "utils/components/Fallbacks";

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [openForm, setOpenForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [openPatients, setOpenPatients] = useState(false);

  // ---------------- View Patients ----------------
  const handleViewPatients = (doctor) => {
    setSelectedDoctorId(doctor.id);
    setOpenPatients(true);
  };

  const handleClosePatients = () => {
    setOpenPatients(false);
    setSelectedDoctorId(null);
  };

  // ---------------- Fetch Doctors with Pagination ----------------
  const fetchDoctors = async (page = 1) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.paginatedDoctors}?page=${page}`;
    try {
      setLoading(true);
      const res = await fetch(Api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data?.data || []);
        setPagination({
          current_page: data.data?.current_page || 1,
          last_page: data.data?.last_page || 1,
          per_page: data.data?.per_page || 10,
          total: data.data?.total || 0,
        });
      } else {
        toast.warning(data.message || "Failed to fetch doctors");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Specialties ----------------
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
      }
    } catch (err) {
      toast.error("Error fetching specialties");
    }
  };

  useEffect(() => {
    fetchDoctors(1);
    fetchSpecialties();
  }, []);

  // ---------------- CRUD Handlers ----------------
  const handleAddDoctor = () => {
    setEditDoctor(null);
    setOpenForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditDoctor(doctor);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditDoctor(null);
  };

  const handleDoctorSaved = () => {
    fetchDoctors(pagination.current_page);
    handleCloseForm();
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.doctors}/${id}`;
    try {
      const res = await fetch(Api, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Doctor deleted successfully!");
        fetchDoctors(pagination.current_page);
      } else {
        toast.warning(data.message || "Failed to delete doctor");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------------- Loading ----------------
  if (loading && doctors.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ---------------- Empty State ----------------
  if (!doctors.length) {
    return (
      <PageContainer title="Doctors Management" maxWidth="lg">
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Fallbacks
            severity="evaluation"
            title="No Doctors Found"
            description="Add a doctor to get started."
          />
        </Box>
        <ToastContainer />
      </PageContainer>
    );
  }

  // ---------------- Main Render ----------------
  return (
    <PageContainer
      title="Doctors Management"
      maxWidth="lg"
      rightOption={
        hasPermission("create_doctor") && (
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={handleAddDoctor}
          >
            Add Doctor
          </Button>
        )
      }
    >
      <DoctorsTable
        doctors={doctors}
        pagination={pagination}
        onPageChange={fetchDoctors}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
        onViewPatients={handleViewPatients}
      />

      {/* Add/Edit Form */}
      <DoctorForm
        open={openForm}
        onClose={handleCloseForm}
        onSaved={handleDoctorSaved}
        editDoctor={editDoctor}
        specialties={specialties}
      />

      {/* View Patients Modal */}
      {selectedDoctorId && (
        <MyPatientsTable
          doctorId={selectedDoctorId}
          open={openPatients}
          onClose={handleClosePatients}
          onView={(patient) => console.log("View patient:", patient)}
        />
      )}

      <ToastContainer />
    </PageContainer>
  );
}