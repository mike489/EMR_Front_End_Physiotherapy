import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Pagination,
  Select,
  MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import BedTable from './BedsTable';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import PageContainer from 'ui-component/MainPage';
import hasPermission from 'utils/auth/hasPermission';
import { Add } from '@mui/icons-material';

export default function BedsIndex() {
  const [beds, setBeds] = useState([]);
  const [patientBeds, setPatientBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* --------------------------------------------------------------------- */
  // FETCH BEDS (with pagination)
  /* --------------------------------------------------------------------- */
  const handleFetchingPatientBeds = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientBeds}?page=${page}&per_page=${perPage}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers });
      const responseData = await response.json();

      if (responseData.success) {
        // Properly access the nested data based on your backend response structure
        const bedData = responseData.data?.data || []; // This matches your response structure

        setPatientBeds(bedData);

        // Determine total pages if available
        const pagination = responseData.data || {};
        setTotalPages(pagination.last_page || 1);
      } else {
        toast.warning(responseData.message || 'Failed to fetch beds');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching beds');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchingBeds = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.beds}?page=${page}&per_page=${perPage}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers });
      const responseData = await response.json();

      if (responseData.success) {
        const bedData =
          responseData.data?.data?.data ||
          responseData.data?.data ||
          responseData.data ||
          [];

        setBeds(bedData);

        // Determine total pages if available
        const pagination = responseData.data?.data || responseData.data || {};
        setTotalPages(pagination.last_page || 1);
      } else {
        toast.warning(responseData.message || 'Failed to fetch beds');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching beds');
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------------------- */
  // FETCH WARDS
  /* --------------------------------------------------------------------- */
  const handleFetchingWards = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.wards}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers });
      const responseData = await response.json();

      if (responseData.success) {
        setWards(responseData.data?.data || responseData.data || []);
      } else {
        toast.warning(responseData.message || 'Failed to fetch wards');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching wards');
    }
  };

  // Handler functions for edit and delete
  const handleEditBed = (bed) => {
    // Implement edit functionality
    console.log('Edit bed:', bed);
  };

  const handleDeleteBed = (bed) => {
    // Implement delete functionality
    console.log('Delete bed:', bed);
  };

  useEffect(() => {
    handleFetchingBeds();
    handleFetchingPatientBeds();
  }, [page, perPage]); // refresh when pagination changes

  useEffect(() => {
    handleFetchingWards();
  }, []);

  /* --------------------------------------------------------------------- */
  // LOADING STATE
  /* --------------------------------------------------------------------- */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* --------------------------------------------------------------------- */
  // RENDER
  /* --------------------------------------------------------------------- */
  return (
    <PageContainer
      title="Patient Beds"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission('create_bed') && (
          <Button variant="contained" startIcon={<Add />}>
            Add Bed
          </Button>
        )
      }
    >
      <BedTable
        beds={beds}
        patientBeds={patientBeds}
        wards={wards}
        onEdit={handleEditBed}
        onDelete={handleDeleteBed}
        refreshBeds={handleFetchingBeds}
      />

      {/* Pagination Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
          px: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <Select
            size="small"
            value={perPage}
            onChange={(e) => {
              setPerPage(e.target.value);
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <ToastContainer />
    </PageContainer>
  );
}
