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
import Fallbacks from 'utils/components/Fallbacks';

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

  // Triggered from "View My Patients" button
  const handleViewPatients = (doctor) => {
    setSelectedDoctorId(doctor.id);
    setOpenPatients(true);
  };

  const handleClosePatients = () => {
    setOpenPatients(false);
    setSelectedDoctorId(null);
  };
  // ---------------- Fetch Doctors ----------------
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
          current_page: data.data?.current_page,
          last_page: data.data?.last_page,
          per_page: data.data?.per_page,
          total: data.data?.total,
        });
      } else {
        toast.warning(data.message || "Failed to fetch doctors");
      }
    } catch (err) {
      toast.error(err.message);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doctors.length){
      return (
        <PageContainer title="My Referrals" maxWidth="lg">
  
          <Fallbacks
            severity="evaluation"
            title="No Doctors Found"
            description="Doctors will appear here once available."
            sx={{ paddingTop: 6 }}
          />
        </PageContainer>
      );
    }


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
        onPageChange={(p) => fetchDoctors(p)}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
        onViewPatients={handleViewPatients} // ✅ Pass the new function
      />


      <DoctorForm
        open={openForm}
        onClose={handleCloseForm}
        onSaved={handleDoctorSaved}
        editDoctor={editDoctor}
        specialties={specialties}
      />
      {selectedDoctorId && (
        <MyPatientsTable
          doctorId={selectedDoctorId}
          open={openPatients}
          onClose={handleClosePatients}
          onView={(patient) => console.log("Viewing patient:", patient)}
        />

      )}
<ToastContainer/>
    </PageContainer>
  );
}
