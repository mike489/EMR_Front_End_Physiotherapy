import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MySurgeryRequestsTable from "./components/MySurgeryRequestsTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import Fallbacks from 'utils/components/Fallbacks';
export default function MySurgeryRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Fetch My Surgery Requests
  // --------------------------
  const fetchMySurgeryRequests = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.mySurgeryRequests}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();

      if (data.success) {
        setRequests(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch surgery requests");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching surgery requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySurgeryRequests();
  }, []);

  // --------------------------
  // Loading Spinner
  // --------------------------
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // --------------------------
  // Empty State
  // --------------------------
  if (!requests.length) {
    return (
      <PageContainer title="My Surgery Requests" maxWidth="lg">

        <Fallbacks
          severity="evaluation"
          title="No Surgery Request Found"
          description="Surgery Requests will appear here once available."
          sx={{ paddingTop: 6 }}
        />
        <ToastContainer/>
      </PageContainer>
    );
  }

  // --------------------------
  // Render Table
  // --------------------------
  return (
    <PageContainer title="My Surgery Requests" maxWidth="lg">
      <MySurgeryRequestsTable
        requests={requests}
        onView={(req) => console.log("View Surgery Request:", req)}
      />
    </PageContainer>
  );
}
