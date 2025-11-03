import React, { useEffect, useState } from "react";
import PageContainer from "ui-component/MainPage";
import { useLocation } from "react-router-dom";
import { Card, Box, CircularProgress, Typography } from "@mui/material";
import SurgeryRequestDetails from "./components/SurgeryRequestDetails";
import { toast } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

const ViewRequests = () => {
  const { state } = useLocation();
  const requestFromState = state || null;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch single request by ID
  const fetchRequest = async () => {
    if (!requestFromState?.id) return;
    try {
      setLoading(true);
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.surgeryRequests}/${requestFromState.id}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const res = await fetch(Api, { method: "GET", headers });
      const data = await res.json();
      if (data.success && data.data?.request) {
        setRequest(data.data.request);
      } else {
        toast.warning("Failed to fetch request");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching request");
    } finally {
      setLoading(false);
    }
  };

  // Accept request
  const onAccept = async (requestId) => {
    try {
      setLoading(true);
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.surgeryRequests}/${requestId}/accept`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const res = await fetch(Api, { method: "POST", headers });
      const data = await res.json();
      if (data.success) {
        toast.success("Request accepted successfully");
        fetchRequest();
      } else {
        toast.warning(data.message || "Failed to accept request");
      }
    } catch (error) {
      toast.error(error.message || "Error accepting request");
    } finally {
      setLoading(false);
    }
  };

  // Reject request
  const onReject = async (requestId) => {
    try {
      setLoading(true);
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.surgeryRequests}/${requestId}/reject`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const res = await fetch(Api, { method: "POST", headers });
      const data = await res.json();
      if (data.success) {
        toast.success("Request rejected successfully");
        fetchRequest();
      } else {
        toast.warning(data.message || "Failed to reject request");
      }
    } catch (error) {
      toast.error(error.message || "Error rejecting request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer
      back={true}
      title={"Surgery Request Details"}
    >
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
        //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          background: "linear-gradient(to bottom right, #f9f9f9, #ffffff)",
        }}
      >
        <Box sx={{ width: "100%", mt: 1 }}>
          {request ? (
            <SurgeryRequestDetails
              request={request}
              onAccept={onAccept}
              onReject={onReject}
            />
          ) : (
            <Typography>No request data available</Typography>
          )}
        </Box>
      </Card>
    </PageContainer>
  );
};

export default ViewRequests;
