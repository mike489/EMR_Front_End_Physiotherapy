import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Button,
  Pagination,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Add } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import hasPermission from 'utils/auth/hasPermission';
import PageContainer from 'ui-component/MainPage';
import ReferralTable from './components/ReferralTable';
import ReferralForm from './components/ReferralForm';

const stripHtml = (html) => {
  if (!html) return null;
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.trim().slice(0, 1000);
};

export default function ReferralIndex() {
  const [referrals, setReferrals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [medicalCenters, setMedicalCenters] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    patient_id: '',
    from_id: '',
    reason: '',
    history_exam: '',
    physiotherapy_diagnosis: '',
    medical_diagnosis: '',
    treatment_given: '',
  });

  /* --------------------------------------------------------------------- */
  // FETCH REFERRALS with pagination + type=internal
  /* --------------------------------------------------------------------- */
  const fetchReferrals = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getReferralsIn}?type=internal&page=${page}&per_page=${perPage}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { method: 'GET', headers });
      const data = await res.json();

      if (data.success) {
        const refData =
          data.data?.data?.data || data.data?.data || data.data || [];
        setReferrals(refData);

        // Handle pagination info (Laravel-style or custom)
        const pagination = data.data?.data || data.data || {};
        setTotalPages(pagination.last_page || 1);
      } else {
        toast.warning('Failed to fetch referrals');
      }
    } catch (error) {
      toast.error('Error fetching referrals');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.patients}`;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(Api, { method: 'GET', headers });
      const data = await response.json();
      if (data.success) setPatients(data.data?.data || data.data || []);
    } catch {
      toast.error('Error fetching patients');
    }
  };

  const fetchMedicalCenters = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.allMedicalCenter}`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(Api, { method: 'GET', headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setMedicalCenters(data.data); // ✅ this matches your response
      } else {
        setMedicalCenters([]);
        toast.warning('No medical centers found');
      }
    } catch (error) {
      toast.error('Error fetching medical centers: ' + error.message);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [page, perPage]);

  useEffect(() => {
    fetchPatients();
    fetchMedicalCenters();
  }, []);

  /* --------------------------------------------------------------------- */
  // DIALOG HANDLERS
  /* --------------------------------------------------------------------- */
  const handleOpenDialog = (referral = null) => {
    if (referral) {
      setEditMode(true);
      setSelectedReferral(referral);
      setFormData({
        patient_id: referral.patient?.id || '',
        from_id: referral.medical_center?.id || '',
        reason: referral.reason || '',
        history_exam: referral.history_exam || '',
        physiotherapy_diagnosis: referral.physiotherapy_diagnosis || '',
        medical_diagnosis: referral.medical_diagnosis || '',
        treatment_given: referral.treatment_given || '',
      });
    } else {
      setEditMode(false);
      setFormData({
        patient_id: '',
        from_id: '',
        reason: '',
        history_exam: '',
        physiotherapy_diagnosis: '',
        medical_diagnosis: '',
        treatment_given: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedReferral(null);
  };

  /* ---------------------------------------------------------- */
  /* Submit Handler                                              */
  /* ---------------------------------------------------------- */
  const handleSubmit = async () => {
    const {
      patient_id,
      from_id,
      reason,
      history_exam,
      physiotherapy_diagnosis,
      medical_diagnosis,
      treatment_given,
    } = formData;

    if (!patient_id || !from_id || !reason) {
      return toast.warning('Please fill all required fields');
    }

    const payload = {
      patient_id,
      from_id,
      reason,
      history_exam,
      physiotherapy_diagnosis,
      medical_diagnosis,
      treatment_given,
    };

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.createReferralsIn}/${selectedReferral.id}`
      : `${Backend.auth}${Backend.createReferralsIn}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, {
        method: editMode ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editMode ? 'Referral updated!' : 'Referral created!');
        fetchReferrals();
        handleCloseDialog();
      } else {
        toast.warning(data.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  /* --------------------------------------------------------------------- */
  // RENDER
  /* --------------------------------------------------------------------- */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer
      title="Referrals In"
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      rightOption={
        hasPermission('create_referral') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Referral
          </Button>
        )
      }
    >
      <ReferralTable
        referrals={referrals}
        onEdit={(ref) => handleOpenDialog(ref)}
        onDelete={() => {}}
      />

      {/* Pagination controls */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, px: 8 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <Select
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            size="small"
          >
            {[5, 10, 20, 50].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
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

      <ReferralForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        patients={patients}
        medicalCenters={medicalCenters}
      />

      <ToastContainer />
    </PageContainer>
  );
}
