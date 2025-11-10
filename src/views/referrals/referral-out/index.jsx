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
import ReferralTable from '../components/ReferralTable';
import ReferralForm from './ReferralForm';

/* ---------------------------------------------------------- */
/* Helper: Strip HTML from Quill content for table previews   */
/* ---------------------------------------------------------- */
const stripHtml = (html) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim().slice(0, 200);
};

export default function ReferralIndex() {
  const [referrals, setReferrals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicalCenters, setMedicalCenters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    patient_id: '',
    to_id: '',
    reason: '',
    history_exam: '',
    physiotherapy_diagnosis: '',
    medical_diagnosis: '',
    treatment_given: '',
  });

  /* ---------------------------------------------------------- */
  /* Fetch Referrals (with pagination)                          */
  /* ---------------------------------------------------------- */
  const fetchReferrals = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getReferralsOut}?type=internal&page=${page}&per_page=${perPage}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const res = await fetch(Api, { method: 'GET', headers });
      const data = await res.json();

      if (data.success) {
        const refData = data.data?.data || data.data || [];
        setReferrals(refData);
        setTotalPages(data.data?.last_page || 1);
      } else {
        toast.warning(data.data.message || 'Failed to fetch referrals');
      }
    } catch (error) {
      toast.error('Error fetching referrals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------- */
  /* Fetch Patients                                              */
  /* ---------------------------------------------------------- */
  const fetchPatients = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.patients}`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(Api, { method: 'GET', headers });
      const data = await res.json();
      if (data.success) setPatients(data.data?.data || data.data || []);
    } catch (error) {
      toast.error('Error fetching patients');
    }
  };

  /* ---------------------------------------------------------- */
  /* Fetch Medical Centers                                       */
  /* ---------------------------------------------------------- */
  const fetchMedicalCenters = async () => {
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.allMedicalCenter}`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(Api, { method: 'GET', headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setMedicalCenters(data.data);
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

  /* ---------------------------------------------------------- */
  /* Dialog Handlers                                             */
  /* ---------------------------------------------------------- */
  const handleOpenDialog = (referral = null) => {
    if (referral) {
      setEditMode(true);
      setSelectedReferral(referral);
      setFormData({
        patient_id: referral.patient?.id || '',
        to_id: referral.medical_center?.id || '',
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
        to_id: '',
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
      to_id,
      reason,
      history_exam,
      physiotherapy_diagnosis,
      medical_diagnosis,
      treatment_given,
    } = formData;

    if (!patient_id || !to_id || !reason) {
      return toast.warning('Please fill all required fields');
    }

    const payload = {
      patient_id,
      to_id,
      reason,
      history_exam,
      physiotherapy_diagnosis,
      medical_diagnosis,
      treatment_given,
    };

    const token = await GetToken();
    const Api = editMode
      ? `${Backend.auth}${Backend.createReferralsOut}/${selectedReferral.id}`
      : `${Backend.auth}${Backend.createReferralsOut}`;
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

  /* ---------------------------------------------------------- */
  /* Render                                                      */
  /* ---------------------------------------------------------- */
  if (loading && referrals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer
      title="Referrals Out"
      maxWidth="lg"
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

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 3,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 4 }}>
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
          shape="rounded"
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
