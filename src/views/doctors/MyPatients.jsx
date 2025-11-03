import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MyPatientsTable from "./components/MyPatientsTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
export default function MyPatients() {
  return (
    <PageContainer title="My Patients" maxWidth="lg">
      <MyPatientsTable />
      <ToastContainer/>
    </PageContainer>
  );
}

