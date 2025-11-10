import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Modal,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import GlassesTable from './GlassesTable';
import GlassesOrderForm from './GlassesOrderForm';

const GlassesTab = ({ visit }) => {
  const [glassesOrders, setGlassesOrders] = useState([]);
  const [lensTypes, setLensTypes] = useState([]);
  const [lensMaterials, setLensMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    date: null,
  });
  const [error, setError] = useState(false);

  const fetchGlassesOrders = async () => {
    const token = await GetToken();
    const api = `${Backend.auth}${Backend.glasses}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(api, { method: 'GET', headers });
      const responseData = await response.json();
      if (responseData.success) {
        setGlassesOrders(responseData.data || []);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error('Error fetching glasses orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchingVisitPatients = async () => {
    setDataLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    params.append('page', pagination.page + 1);
    params.append('per_page', pagination.per_page);

    if (search) params.append('search', search);
    if (filters.date) {
      params.append('date', format(new Date(filters.date), 'yyyy-MM-dd'));
    }

    const Api = `${Backend.auth}${Backend.getVisits}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }

      if (responseData.success) {
        setData(responseData.data.data);
        setPagination({
          ...pagination,
          last_page: responseData.data.last_page,
          total: responseData.data.total,
        });
        setError(false);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch visits',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
      setError(true);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchLensTypes = async () => {
    try {
      const response = await fetchItems(Backend.lensTypes);
      if (response.success) {
        setLensTypes(response.data || []);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error('Error fetching lens types: ' + error.message);
    }
  };

  const fetchLensMaterials = async () => {
    try {
      const response = await fetchItems(Backend.lensMaterials);
      if (response.success) {
        setLensMaterials(response.data || []);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error('Error fetching lens materials: ' + error.message);
    }
  };

  const fetchItems = async (endpoint) => {
    const token = await GetToken();
    const api = `${Backend.auth}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await fetch(api, { method: 'GET', headers });
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    return await response.json();
  };

  const handleSubmit = async (formData, isEditMode) => {
    const token = await GetToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const api = isEditMode
      ? `${Backend.auth}${Backend.glasses}/${editOrder.id}`
      : `${Backend.auth}${Backend.glasses}`;
    try {
      const response = await fetch(api, {
        method: isEditMode ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success(
          isEditMode
            ? 'Order updated successfully!'
            : 'Order created successfully!',
        );
        setFormOpen(false);
        setEditOrder(null);
        fetchGlassesOrders();
      } else {
        toast.error(responseData.message || 'Failed to save order');
      }
    } catch (error) {
      toast.error('Error saving order: ' + error.message);
    }
  };

  const handleDelete = async (orderId) => {
    const token = await GetToken();
    const api = `${Backend.auth}${Backend.glasses}/${orderId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    };

    try {
      const response = await fetch(api, { method: 'DELETE', headers });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Order deleted successfully!');
        fetchGlassesOrders();
      } else {
        toast.error(responseData.message || 'Failed to delete order');
      }
    } catch (error) {
      toast.error('Error deleting order: ' + error.message);
    }
  };

  useEffect(() => {
    fetchGlassesOrders();
    fetchLensTypes();
    fetchLensMaterials();
    handleFetchingVisitPatients();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto', p: 3 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Grid item>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Glasses Prescriptions
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditOrder(null);
              setFormOpen(true);
            }}
            sx={{ minWidth: 150 }}
          >
            Create Glasses Order
          </Button>
        </Grid>
      </Grid>

      <GlassesTable
        glassesOrders={glassesOrders}
        onEdit={(order) => {
          setEditOrder(order);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
        visit={visit}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        aria-labelledby="glasses-order-form-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            maxHeight: '100vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            // boxShadow: 24,
          }}
        >
          <GlassesOrderForm
            orderId={editOrder?.id}
            initialData={
              editOrder || {
                lens_type_id: '',
                other_lens_type: null,
                lens_material_id: '',
                frame: '',
                size: '',
                color: '#000000',
                frame_description: '',
                description: '',
              }
            }
            visits={data}
            lensTypes={lensTypes}
            lensMaterials={lensMaterials}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            dataLoading={dataLoading}
            data={data}
          />
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default GlassesTab;
