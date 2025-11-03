import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MyReferralsTable from "./components/MyReferralsTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import Fallbacks from 'utils/components/Fallbacks';

export default function MyReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Fetch My Referrals
  // --------------------------
  const fetchMyReferrals = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.myReferrals}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();

      if (data.success) {
        setReferrals(data.data?.data || data.data || []);
      } else {
        toast.warning(data.message || "Failed to fetch referrals");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReferrals();
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
  if (!referrals.length) {
    return (
      <PageContainer title="My Referrals" maxWidth="lg">

        <Fallbacks
          severity="evaluation"
          title="No Referral Found"
          description="Referrals will appear here once available."
          sx={{ paddingTop: 6 }}
        />
      </PageContainer>
    );
  }

  // --------------------------
  // Render Page
  // --------------------------
  return (
    <PageContainer title="My Referrals" maxWidth="lg">
      <MyReferralsTable referrals={referrals} onView={(r) => console.log("Referral:", r)} />
        <ToastContainer/>
    </PageContainer>
  );
}
