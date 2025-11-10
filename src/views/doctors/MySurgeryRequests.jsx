// MySurgeryRequests.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from '@mui/material';
import PageContainer from 'ui-component/MainPage';
import MySurgeryRequestsTable from './components/MySurgeryRequestsTable';
import SurgeryRequestDetails from './components/SurgeryRequestDetails';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import Fallbacks from 'utils/components/Fallbacks';

export default function MySurgeryRequests() {
  const [requests, setRequests] = useState([]);
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
  // Fetch with Pagination
  // --------------------------
  const fetchMySurgeryRequests = async (page = 1, perPage = 10) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.mySurgeryRequests}?page=${page}&per_page=${perPage}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { headers });
      const data = await res.json();

      if (data.success) {
        setRequests(data.data?.data || []);
        setPagination({
          page: data.data?.current_page || 1,
          perPage: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          lastPage: data.data?.last_page || 1,
        });
      } else {
        toast.warning(data.message || 'Failed to fetch surgery requests');
      }
    } catch (err) {
      toast.error(err.message || 'Network error');
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
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const res = await fetch(Api, { method: 'POST', headers });
      const data = await res.json();
      if (data.success) {
        toast.success('Request accepted successfully');
        fetchMySurgeryRequests();
      } else {
        toast.warning(data.message || 'Failed to accept request');
      }
    } catch (error) {
      toast.error(error.message || 'Error accepting request');
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
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const res = await fetch(Api, { method: 'POST', headers });
      const data = await res.json();
      if (data.success) {
        toast.success('Request rejected successfully');
        fetchMySurgeryRequests();
      } else {
        toast.warning(data.message || 'Failed to reject request');
      }
    } catch (error) {
      toast.error(error.message || 'Error rejecting request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySurgeryRequests(1, perPage);
  }, [perPage]);

  // --------------------------
  // Loading
  // --------------------------
  if (loading && requests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
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
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Fallbacks
            severity="evaluation"
            title="No Surgery Request Found"
            description="Surgery requests will appear here once available."
          />
        </Box>
        <SurgeryRequestDetails
          request={selected}
          onAccept={onAccept}
          onReject={onReject}
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
    <PageContainer title="My Surgery Requests" maxWidth="lg">
      <MySurgeryRequestsTable requests={requests} onView={setSelected} />

      {/* ---------- Custom Pagination ---------- */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
            >
              {[5, 10, 20, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Pagination
          count={pagination.lastPage}
          page={pagination.page}
          onChange={(e, value) => fetchMySurgeryRequests(value, perPage)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

      <SurgeryRequestDetails
        request={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
      <ToastContainer />
    </PageContainer>
  );
}
