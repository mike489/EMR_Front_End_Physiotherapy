import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
// Icons removed as they're not used in the current layout
import { format } from 'date-fns';
import PageContainer from 'ui-component/MainPage';

const ViewWebsiteRequests = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const appointment = state || {};

  if (!appointment.id) {
    navigate('/patientapp');
    return null;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'appointed':
        return '#d8edd9';
      case 'completed':
        return '#e3f2fd';
      case 'cancelled':
        return '#f7e4e4';
      case 'pending':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'appointed':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <PageContainer
      back={true}
      title={`Appointment Details - ${appointment.patient_name || 'Unknown Patient'}`}
    >
      <Card
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)',
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              Patient Information
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, borderColor: 'divider' }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} display="flex" justifyContent="center">
              {/* <Paper elevation={3} sx={{ p: 1, borderRadius: 3 }}> */}
              <Avatar
                src={appointment.patient_picture_url}
                alt={appointment.patient_name}
                sx={{
                  width: 90,
                  height: 90,
                  fontSize: 36,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: theme.shadows[4],
                  border: `3px solid ${theme.palette.background.paper}`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                  },
                }}
              >
                {!appointment.patient_picture_url &&
                  appointment.patient_name?.charAt(0)}
              </Avatar>
              {/* </Paper> */}
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Patient Name
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.patient_name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone Number
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.phone_number || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.email || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Gender
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.gender || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Age
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.age ? `${appointment.age} years` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                  </Box>
                  <Chip
                    label={appointment.status || 'Unknown'}
                    sx={{
                      backgroundColor: getStatusColor(appointment.status),
                      color: getStatusTextColor(appointment.status),
                      textTransform: 'capitalize',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Appointment Date
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.appointment_date
                      ? format(
                          new Date(appointment.appointment_date),
                          'EEEE, MMMM dd, yyyy',
                        )
                      : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Time Slot
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.start_time && appointment.end_time
                      ? `${appointment.start_time} - ${appointment.end_time}`
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>

              {/* Doctor Information Section */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}
                >
                  Assigned Doctor
                </Typography>
                {/* <Divider sx={{ mb: 2 }} /> */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {appointment.doctor?.name || 'No doctor assigned'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Doctor
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </PageContainer>
  );
};

export default ViewWebsiteRequests;
