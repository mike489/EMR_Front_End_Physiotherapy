
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

import Backend from "services/backend";
import GetToken from "utils/auth-token";
import hasPermission from "utils/auth/hasPermission";

import PageContainer from "ui-component/MainPage";
import MedicalCertificatesTable from "./components/MedicalCertificatesTable";
import MedicalCertificateForm from "./components/MedicalCertificateForm";
import MedicalCertificateView from "./components/MedicalCertificateView";

export default function MedicalCertificatesIndex() {
  const [certificates, setCertificates] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: "",
    diagnosis: "",
    injury_description: "",
    recommendations: "",
    date_of_examination: "",
    rest_days: 0,
    remarks: "",
    status: "issued",
  });

  // Fetch all certificates
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const token = await GetToken();
      const response = await fetch(`${Backend.auth}${Backend.medicalCertificates}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // Handle non-JSON (like redirects)
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid response from server: ${text}`);
      }

      if (data.success) setCertificates(data.data?.data || []);
      else toast.warning(data.message || "Failed to fetch certificates");
    } catch (err) {
      toast.error(err.message || "Error fetching certificates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const response = await fetch(`${Backend.auth}${Backend.patients}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid response from server: ${text}`);
      }

      if (data.success) setPatients(data.data?.data || []);
      else toast.warning(data.message || "Failed to fetch patients");
    } catch (err) {
      toast.error(err.message || "Error fetching patients");
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchPatients();
  }, []);

  // Open add/edit form
 const handleOpenForm = (cert = null) => {
  if (cert) {
    setEditMode(true);
    setSelectedCertificate(cert);
    setFormData({
      patient_id: cert.patient?.id || "",
      diagnosis: cert.diagnosis || "",
      injury_description: cert.injury_description || "",
      recommendations: cert.recommendations || "",
      date_of_examination: cert.date_of_examination || "",
      rest_days: cert.rest_days || 0,
      remarks: cert.remarks || "",
      status: cert.status || "issued",
    });
  } else {
    setEditMode(false);
    setFormData({
      patient_id: "",
      diagnosis: "",
      injury_description: "",
      recommendations: "",
      date_of_examination: "",
      rest_days: 0,
      remarks: "",
      status: "issued",
    });
  }
  setOpenForm(true); 
};


  const handleCloseForm = () => {
    setOpenForm(false);
    setEditMode(false);
    setSelectedCertificate(null);
  };

  const handleOpenView = (cert) => {
    setSelectedCertificate(cert);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedCertificate(null);
  };

  return (
    <PageContainer
      title="Medical Certificates"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission("create_medical_certificate") && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
          >
            Add Certificate
          </Button>
        )
      }
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MedicalCertificatesTable
          certificates={certificates}
          onEdit={handleOpenForm}
          onDelete={fetchCertificates} 
          onView={handleOpenView}
        />
      )}

      <MedicalCertificateForm
        open={openForm}
        onClose={handleCloseForm}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        patients={patients}
        refreshList={fetchCertificates}
        selectedCertificate={selectedCertificate}
      />

      <MedicalCertificateView
        open={openViewDialog}
        onClose={handleCloseView}
        certificate={selectedCertificate}
      />

      <ToastContainer />
    </PageContainer>
  );
}
