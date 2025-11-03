import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';

import PageContainer from 'ui-component/MainPage';
import NursesTable from './components/NursesTable';
import NurseForm from './components/NurseForm';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import Fallbacks from 'utils/components/Fallbacks';

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editNurse, setEditNurse] = useState(null);

  const fetchNurses = async (page = 1) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.nurses}?page=${page}`;
    try {
      setLoading(true);
      const res = await fetch(Api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNurses(data.data?.data || []);
        setPagination({
          current_page: data.data?.current_page,
          last_page: data.data?.last_page,
          per_page: data.data?.per_page,
          total: data.data?.total,
        });
      } else {
        toast.warning(data.message || 'Failed to fetch nurses');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const handleAdd = () => {
    setEditNurse(null);
    setOpenForm(true);
  };

  const handleEdit = (nurse) => {
    setEditNurse(nurse);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.nurses}/${id}`;
    try {
      const res = await fetch(Api, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Nurse deleted successfully!');
        fetchNurses(pagination.current_page);
      } else {
        toast.warning(data.message || 'Failed to delete nurse');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaved = async (payload) => {
    const token = await GetToken();
    const isEdit = !!editNurse;
    const Api = isEdit
      ? `${Backend.auth}${Backend.nurses}/${editNurse.id}`
      : `${Backend.auth}${Backend.nurses}`;

    try {
      console.log(' Sending to:', Api);
      console.log(' Payload:', payload);
      console.log(' Token:', token);

      const res = await fetch(Api, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        redirect: 'manual',
      });

      console.log(' Response Status:', res.status);
      console.log(' Redirect location:', res.headers.get('location'));

      if (res.status === 302) {
        toast.error(
          'Backend is redirecting (302) — check authentication middleware or token.',
        );
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success(`Nurse ${isEdit ? 'updated' : 'added'} successfully`);
        fetchNurses(pagination.current_page);
        setOpenForm(false);
        setEditNurse(null);
      } else {
        toast.warning(data.message || 'Failed to save nurse');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <PageContainer
      title="Nurses Management"
      maxWidth="lg"
      rightOption={
        <Button startIcon={<Add />} variant="contained" onClick={handleAdd}>
          Add Nurse
        </Button>
      }
    >
      {nurses.length > 0 ? (
        <NursesTable
          nurses={nurses}
          pagination={pagination}
          onPageChange={fetchNurses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fallbacks
            severity="evaluation"
            title="No Nurses Found"
            description="Nurses will appear here once available."
            sx={{ paddingTop: 6 }}
          />
        </Box>
      )}
      <NurseForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSaved={handleSaved}
        editNurse={editNurse}
      />
      <ToastContainer />
    </PageContainer>
  );
}
