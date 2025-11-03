import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import AddPatient from './componenets/AddPatients';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { CircularProgress, Box } from '@mui/material';
import PageContainer from 'ui-component/MainPage';

const PatientAddView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(location.state?.patientId || null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isCardExpired, setIsCardExpired] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [paymentAmounts, setPaymentAmounts] = useState([]);

  // Fetch rooms
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
      else toast.warning(data?.data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

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
      const responseData = await response.json();

      if (responseData.success) {
        setOrganizations(responseData.data);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch data',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

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
      const responseData = await response.json();

      if (responseData.success) {
        setPaymentAmounts(responseData.data);
      } else {
        toast.warning(
          responseData?.data?.message ||
            responseData?.message ||
            'Failed to fetch data',
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Fetch doctors
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
      else toast.warning(data?.data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch payment details only if patientId exists
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

  // Step 1: Submit Patient Details
  const handlePatientDetailsSubmit = async (patientData) => {
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
        body: JSON.stringify(patientData),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          data: {
            message: data?.data?.message || 'Failed to save patient details',
            errors: data?.data?.errors || data?.errors,
          },
        };
      }

      if (data.success) {
        toast.success('Patient details saved successfully');
        setPatientId(data.data.id); // Save the patient ID for next steps
        setIsCardExpired(data.data.is_card_expired || false);
        return { success: true, data: data.data };
      }
      return {
        success: false,
        data: {
          message: data?.data?.message || 'Failed to save patient details',
          errors: data?.data?.errors || data?.errors,
        },
      };
    } catch (error) {
      return { success: false, data: { message: 'Something went wrong' } };
    } finally {
      setIsAdding(false);
    }
  };

  // Step 2: Submit Payment Responsibility
  // const handlePaymentSubmit = async (paymentData) => {
  //   if (!patientId) {
  //     return {
  //       success: false,
  //       data: { message: 'Patient ID not found. Save patient details first.' },
  //     };
  //   }

  //   setIsAdding(true);
  //   const token = await GetToken();
  //   const Api = `${Backend.auth}${Backend.patientCard}/${patientId}`;
  //   const header = {
  //     Authorization: `Bearer ${token}`,
  //     accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   };

  //   const paymentTypeMap = {
  //     self_pay: 'self pay',
  //     // insurance: 'insurance',
  //     government: 'government',
  //     company: 'company',
  //     other: 'other',
  //   };

  //   try {
  //     const payload = {
  //       payment_method:
  //         paymentTypeMap[paymentData.payment_method] ||
  //         paymentData.payment_method,
  //       amount: paymentData.amount,
  //       organization_id: paymentData.organization || null,
  //     };
  //     const response = await fetch(Api, {
  //       method: 'POST',
  //       headers: header,
  //       body: JSON.stringify(payload),
  //     });
  //     const data = await response.json();

  //     if (!response.ok) {
  //       return {
  //         success: false,
  //         data: {
  //           message: data?.data?.message || `HTTP error ${response.status}`,
  //           errors: data?.data?.errors || data?.errors,
  //         },
  //       };
  //     }
  //     if (data.success) {
  //       toast.success('Payment details saved successfully');
  //       setIsCardExpired(false);
  //       return { success: true, data: data.data };
  //     }
  //     return {
  //       success: false,
  //       data: {
  //         message: 'Failed to save payment details',
  //         errors: data?.data?.errors || data?.errors,
  //       },
  //     };
  //   } catch (error) {
  //     return { success: false, data: { message: 'Something went wrong' } };
  //   } finally {
  //     setIsAdding(false);
  //   }
  // };

  // Step 2: Submit Payment Responsibility

  const handlePaymentSubmit = async (paymentData) => {
    if (!patientId) {
      return {
        success: false,
        data: { message: 'Patient ID not found. Save patient details first.' },
      };
    }

    setIsAdding(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientCard}/${patientId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      // Prepare payload
      const payload = {
        payment_method: paymentData.payment_method,
        amount: paymentData.amount || null,
      };

      // Include organization if credit
      if (paymentData.payment_method === 'credit') {
        payload.organization_id = paymentData.organization_id || null;
      }

      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: {
            message: data?.data?.message || `HTTP error ${response.status}`,
            errors: data?.data?.errors || data?.errors,
          },
        };
      }

      if (data.success) {
        toast.success('Payment details saved successfully');
        setIsCardExpired(false);
        return { success: true, data: data.data };
      }

      return {
        success: false,
        data: {
          message: 'Failed to save payment details',
          errors: data?.data?.errors || data?.errors,
        },
      };
    } catch (error) {
      return { success: false, data: { message: 'Something went wrong' } };
    } finally {
      setIsAdding(false);
    }
  };

  // Step 3: Submit Assignment
  const handleAssignmentSubmit = async (assignmentData) => {
    if (!patientId) {
      return {
        success: false,
        data: { message: 'Patient ID not found. Save patient details first.' },
      };
    }

    setIsAdding(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.sendTo}/${patientId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const payload = {
        patient_id: patientId,
        // visit_date: new Date().toISOString().split('T')[0],
        visit_type: assignmentData.visit_type,
        // room_id: assignmentData.room_id,
        appointed_to: assignmentData.doctor_id,
        // appointed_to: assignmentData.appointed_to,
      };

      if (assignmentData.visit_type === 'Physiotherapy') {
        payload.conditions = assignmentData.conditions || [];
      }
      console.log('Assign Payload:', payload);
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: {
            message: data?.data?.message || 'Failed to save assignment',
            errors: data?.data?.errors || data?.errors,
          },
        };
      }
      if (data.success) {
        toast.success('Patient visit created successfully');
        return { success: true, data: data.data };
      }
      return {
        success: false,
        data: {
          message: 'Failed to save assignment',
          errors: data?.data?.errors || data?.errors,
        },
      };
    } catch (error) {
      return { success: false, data: { message: 'Something went wrong' } };
    } finally {
      setIsAdding(false);
    }
  };

  // Load rooms and doctors once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([handleFetchingRooms(), handleFetchingDoctors()]);
      setLoading(false);
    };
    fetchData();
    handleFetchingOrganizations();
    handleFetchingPaymentAmounts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer title="Add Patient">
      <ToastContainer />
      <AddPatient
        onPatientDetailsSubmit={handlePatientDetailsSubmit}
        onPaymentSubmit={handlePaymentSubmit}
        onAssignmentSubmit={handleAssignmentSubmit}
        rooms={rooms}
        organizations={organizations}
        doctors={doctors}
        paymentAmounts={paymentAmounts}
        onCancel={() => navigate('/patients')}
        isAdding={isAdding}
        paymentDetails={paymentDetails}
      />
    </PageContainer>
  );
};

export default PatientAddView;
