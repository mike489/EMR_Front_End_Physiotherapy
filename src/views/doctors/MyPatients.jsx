import React, { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MyPatientsTable from "./components/MyPatientsTable";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";

export default function MyPatients() {
  const [doctorId, setDoctorId] = useState(null);
  const [loadingId, setLoadingId] = useState(true);

  // -------------------------------------------------
  // Get the logged-in doctor's ID from the JWT payload
  // -------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const token = await GetToken();                 // JWT string
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Adjust the key name to whatever your token uses
        setDoctorId(payload.doctor_id ?? payload.id ?? payload.sub);
      } catch (e) {
        console.error(e);
        toast.error("Failed to read user info");
      } finally {
        setLoadingId(false);
      }
    })();
  }, []);

  if (loadingId) {
    return (
      <PageContainer title="My Patients" maxWidth="lg">
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Patients" maxWidth="lg">
      {/* Pass the id and force the table to be visible */}
      <MyPatientsTable
        doctorId={doctorId}
        open={true}
        onClose={() => {}}
        onView={() => {}}
      />
      <ToastContainer />
    </PageContainer>
  );
}