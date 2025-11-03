import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import MedicinesTable from './MedicinesTable';
import MedicinesForm from './MedicinesForm'; // modal form

const MedicinesTab = ({ visit }) => {
  const [medicinesData, setMedicinesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Fetch medicines for the visit
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = await GetToken();
      const res = await fetch(`${Backend.auth}${Backend.orderMedicines}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMedicinesData(data.data || []);
      } else {
        toast.warning(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh table after creating a new medicine
  const handleAfterSubmit = () => {
    fetchMedicines();
    setModalOpen(false);
  };

  useEffect(() => {
    fetchMedicines();
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
    <Box sx={{ p: 3 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Medicines
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Add Medicine
          </Button>
        </Grid>
      </Grid>

      {/* Medicines Table */}
      <MedicinesTable
        data={medicinesData}
        visit={visit}
        onEdit={(medicine) => {
          setEditingMedicine(medicine); // set the selected medicine
          setModalOpen(true); // open the modal
        }}
      />

      {/* Medicine Modal Form */}
      <MedicinesForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMedicine(null);
        }}
        visit={visit}
        medicines={editingMedicine ? [editingMedicine] : []} // pass as array if editing
        onSubmitSuccess={handleAfterSubmit}
      />
      <ToastContainer />
    </Box>
  );
};

export default MedicinesTab;
