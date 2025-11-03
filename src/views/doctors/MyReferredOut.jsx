import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MyReferredOutTable from "./components/MyReferredOutTable";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import Fallbacks from 'utils/components/Fallbacks';

export default function MyReferredOut() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Fetch My Referred Out
  // --------------------------
  const fetchMyReferredOut = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.myReferralsOut}`;
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
        toast.warning(data.message || "Failed to fetch referred out records");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching referred out list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReferredOut();
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
      <PageContainer title="My Referred Out" maxWidth="lg">
         <Fallbacks
                 severity="evaluation"
                 title="No Referral out Found"
                 description="Referrals will appear here once available."
                 sx={{ paddingTop: 6 }}
               />

      </PageContainer>
    );
  }

  // --------------------------
  // Render Table
  // --------------------------
  return (
    <PageContainer title="My Referred Out" maxWidth="lg">
      <MyReferredOutTable
        referrals={referrals}
        onView={(r) => console.log("Referral Out:", r)}
      />
      <ToastContainer/>
    </PageContainer>
  );
}
