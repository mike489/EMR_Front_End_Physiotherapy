import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import AddPatient from './componenets/AddPatients';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { CircularProgress, Box } from '@mui/material';
import PageContainer from 'ui-component/MainPage';
import RegisterPatient from './register_patient';

const PatientRegisterView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isCardExpired, setIsCardExpired] = useState(true);
  const [loading, setLoading] = useState(true);
  const [patientId] = useState(location.state?.patientId || null);

  // Fetch Rooms
  const handleFetchingRooms = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.rooms}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) setRooms(data.data);
      else toast.warning(data?.message || 'Failed to fetch rooms');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Doctors
  const handleFetchingDoctors = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getDoctors}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) setDoctors(data.data);
      else toast.warning(data?.message || 'Failed to fetch doctors');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Organizations
  const handleFetchingOrganizations = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.getOrganizations}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) setOrganizations(data.data);
      else toast.warning(data?.message || 'Failed to fetch organizations');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Payment Amounts
  const handleFetchingPaymentAmounts = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.paymentAmounts}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) setPaymentAmounts(data.data);
      else toast.warning(data?.message || 'Failed to fetch payment amounts');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Payment Details (only if patient exists)
  const handleFetchingPaymentDetails = async (id) => {
    if (!id) return;
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientCard}/${id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.data);
        setIsCardExpired(data.data.is_card_expired || false);
      }
    } catch (error) {
      console.error('Payment fetch error:', error);
    }
  };

  // ✅ Single Submit Handler — everything in one payload
  const handleSubmitAllPatientData = async (payload) => {
    setIsAdding(true);
    const token = await GetToken();
    const Api = patientId
      ? `${Backend.auth}${Backend.patients}/${patientId}`
      : `${Backend.auth}${Backend.patients}`;

    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: patientId ? 'PUT' : 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data?.message || 'Failed to save patient');
        return { success: false };
      }

      toast.success('Patient added successfully');
      navigate('/patients');
      return { success: true };
    } catch (error) {
      toast.error('An error occurred while saving patient');
      return { success: false };
    } finally {
      setIsAdding(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        handleFetchingRooms(),
        handleFetchingDoctors(),
        handleFetchingOrganizations(),
        handleFetchingPaymentAmounts(),
      ]);
      if (patientId) await handleFetchingPaymentDetails(patientId);
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer title="Register Patient">
      <ToastContainer />
      <RegisterPatient
        onSubmitAll={handleSubmitAllPatientData} // ✅ single unified submit
        rooms={rooms}
        organizations={organizations}
        doctors={doctors}
        paymentAmounts={paymentAmounts}
        onCancel={() => navigate('/patients')}
        isAdding={isAdding}
        paymentDetails={paymentDetails}
        isCardExpired={isCardExpired}
      />
    </PageContainer>
  );
};

export default PatientRegisterView;
