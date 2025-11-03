import React, { useState } from 'react';
import PageContainer from 'ui-component/MainPage';
import { useLocation } from 'react-router-dom';
import { Card, Typography, Box, Chip, useTheme, Button } from '@mui/material';
import PatientTabs from './components/PatientTabs';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';
import SendToRoomModal from 'views/patients/componenets/SendToRoomModal';
import AllergiesModal from './components/AllergiesModal';
import AddButton from 'ui-component/buttons/AddButton';
import PatientTabsWrapper from './components/PatientTabsWrapper';

const ViewVisitPatients = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [add, setAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [visitStatus, setVisitStatus] = useState(state?.status || '');
  const visit = state || {};
  console.log('Visit Data:', visit);

  // Define possible statuses
  const statuses = ['Pending', 'Accepted', 'Rejected'];

  const handleOpenSendModal = async (patient) => {
    await handleFetchingRooms();
    await handleFetchingDoctors();
    setSelectedPatient(patient);
    setOpenSendModal(true);
  };

  const handleCloseSendModal = () => {
    setOpenSendModal(false);
    setSelectedPatient(null);
  };

  const handleAddPatientAllergyClick = () => {
    setAdd(true);
  };

  const handleSubmit = async (patientDetails) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.createSubVisit}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          // patient_id: selectedPatient?.patient_id,
          room_id: patientDetails.room_id, // Send first room ID (single value)
          sub_visit_id: visit.id,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        // const roomNames = rooms
        //   .filter((room) => patientDetails.room_id.includes(room.id))
        //   .map((room) => room.name)
        //   .join(', ');
        // const doctorNames = doctors
        //   .filter((doctor) => patientDetails.doctor_id.includes(doctor.id))
        //   .map((doctor) => doctor.name)
        //   .join(', ');
        toast.success(`Patient assigned to room successfully`);
        handleCloseSendModal();
      } else {
        toast.error(responseData.message || 'Failed to assign patient');
      }
    } catch (error) {
      const errorMessage = error.data.message || 'Something went wrong';
      toast.error(
        errorMessage || 'An error occurred while assigning the patient',
      );
    }
  };

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
      const responseData = await response.json();

      if (responseData.success) {
        setRooms(responseData.data);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
      const responseData = await response.json();

      if (responseData.success) {
        setDoctors(responseData.data);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddPatientAllergyClose = () => {
    setAdd(false);
  };

  const handlePatientAllergy = async (allergyData) => {
    setIsAdding(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.updatePatientMedicalProfile}/${visit.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          allergies: allergyData.allergies,
          medical_conditions: allergyData.medical_conditions,
          medical_history: allergyData.medical_history,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      if (responseData.success) {
        toast.success('Patient medical profile updated successfully');
        handleAddPatientAllergyClose();
      } else {
        toast.error(
          responseData?.message || 'Failed to update medical profile',
        );
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle status update by cycling through statuses
  const handleStatusUpdate = async () => {
    if (!visit.visit_id) {
      toast.error('Visit ID is missing');
      return;
    }

    // Get the current status
    const currentStatus = visitStatus || visit?.status || 'Pending';
    // Find the next status in the cycle
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.acceptPatient}/${visit.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({ status: nextStatus }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        setVisitStatus(nextStatus); // Update local state
        toast.success(`Patient visit status updated to ${nextStatus}`);
      } else {
        toast.error(
          responseData.data.message ||
            `Failed to update status to ${nextStatus}`,
        );
      }
    } catch (error) {
      toast.error(
        error.data.message ||
          `An error occurred while updating status to ${nextStatus}`,
      );
    }
  };

  return (
    <PageContainer
      back={true}
      title={visit?.patient_name || 'Patient Details'}
      // accept={visitStatus || visit.status}
    >
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
            p: 2,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.getContrastText(
                  theme.palette.primary.light,
                ),
                zIndex: 1,
              }}
            >
              {visit?.patient_name || 'Patient Name'}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontWeight: 700,
                color: theme.palette.getContrastText(
                  theme.palette.primary.light,
                ),
                zIndex: 1,
              }}
            >
              Age {visit?.age || 'Patient Age'}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontWeight: 700,
                color: theme.palette.getContrastText(
                  theme.palette.primary.light,
                ),
                zIndex: 1,
              }}
            >
              Payment{' '}
              {visit?.payment.payment_method || 'Patient Payment Method'}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontWeight: 700,
                color: theme.palette.getContrastText(
                  theme.palette.primary.light,
                ),
                zIndex: 1,
              }}
            >
              {visit?.payment.organization.name || ''}
            </Typography>

            {visit?.patient_category && (
              <Chip
                label={visit?.patient_category}
                color="primary"
                size="small"
                sx={{
                  ml: 2,
                  fontWeight: 600,
                  boxShadow: theme.shadows[1],
                  zIndex: 1,
                }}
              />
            )}
            <Typography
              variant="body2"
              // onClick={handleStatusUpdate}
              sx={{
                ml: 2,
                width: 'fit-content',
                height: 'fit-content',
                fontWeight: 600,
                borderRadius: 2,
                p: '4px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
              }}
            >
              <Chip
                label={visitStatus || visit?.status || 'Pending'}
                sx={{
                  bgcolor:
                    visitStatus === 'Pending' || visit?.status === 'Pending'
                      ? 'warning.light'
                      : visitStatus === 'In Progress' ||
                          visit?.status === 'In Progress'
                        ? 'info.light'
                        : 'success.light',
                  color:
                    visitStatus === 'Pending' || visit?.status === 'Pending'
                      ? 'warning.contrastText'
                      : visitStatus === 'In Progress' ||
                          visit?.status === 'In Progress'
                        ? 'info.contrastText'
                        : 'success.contrastText',
                  fontWeight: 'bold',
                }}
              />
            </Typography>
            {visit.status === 'Pending' && (
              <Button onClick={handleStatusUpdate}>Accept</Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Button
              size="small"
              sx={{
                minWidth: 'auto',
                px: 1, // Horizontal padding
                py: 0.1, // Vertical padding
                fontSize: '0.75rem',
                fontWeight: 400,
                boxShadow: theme.shadows[1],
                bgcolor: 'primary.main',
                color: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  color: '#ffffff',
                },
              }}
              onClick={() => handleOpenSendModal(visit)}
            >
              Send
            </Button>
            <AddButton
              title="Add Allergies"
              onPress={handleAddPatientAllergyClick}
            />
          </Box>
        </Box>
        <ToastContainer />

        <Box sx={{ width: '100%' }}>
          <PatientTabsWrapper patient={visit} />
        </Box>
      </Card>

      <SendToRoomModal
        open={openSendModal}
        onClose={handleCloseSendModal}
        patient={selectedPatient}
        rooms={rooms}
        doctors={doctors}
        onSubmit={handleSubmit}
      />
      <AllergiesModal
        add={add}
        onClose={handleAddPatientAllergyClose}
        onSubmit={handlePatientAllergy}
        isAdding={isAdding}
      />
    </PageContainer>
  );
};

export default ViewVisitPatients;
