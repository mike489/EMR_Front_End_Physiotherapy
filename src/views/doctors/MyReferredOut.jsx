import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from "@mui/material";
import PageContainer from "ui-component/MainPage";
import MyReferredOutTable from "./components/MyReferredOutTable";
import ReferredOutDetails from "./components/ReferredOutDetails";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import Fallbacks from "utils/components/Fallbacks";

export default function MyReferredOut() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [perPage, setPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  // --------------------------
  // Fetch with page + per_page
  // --------------------------
  const fetchMyReferredOut = async (page = 1, perPage = 10) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.myReferralsOut}?page=${page}&per_page=${perPage}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();

      if (data.success) {
        setReferrals(data.data?.data || []);
        setPagination({
          page: data.data?.current_page || 1,
          perPage: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          lastPage: data.data?.last_page || 1,
        });
      } else {
        toast.warning(data.message || "Failed to fetch referrals");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Initial load + perPage change
  useEffect(() => {
    fetchMyReferredOut(1, perPage);
  }, [perPage]);

  // --------------------------
  // Loading
  // --------------------------
  if (loading && referrals.length === 0) {
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
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Fallbacks
            severity="evaluation"
            title="No Referred Out Cases"
            description="You have not referred any patient out yet."
          />
        </Box>
        <ReferredOutDetails
          referral={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
        <ToastContainer />
      </PageContainer>
    );
  }

  // --------------------------
  // Main Render
  // --------------------------
  return (
    <PageContainer title="My Referred Out" maxWidth="lg">
      <MyReferredOutTable referrals={referrals} onView={setSelected} />

      {/* ---------- Custom Pagination ---------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Rows per page */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={perPage}
              onChange={(e) => {
                const newPerPage = e.target.value;
                setPerPage(newPerPage);
                // page resets via useEffect
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Page numbers */}
        <Pagination
          count={pagination.lastPage}
          page={pagination.page}
          onChange={(e, value) => fetchMyReferredOut(value, perPage)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

      <ReferredOutDetails
        referral={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
      <ToastContainer />
    </PageContainer>
  );
}