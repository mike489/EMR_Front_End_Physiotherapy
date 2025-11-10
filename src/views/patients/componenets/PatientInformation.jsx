import React from 'react';
import { Grid, Box, Typography, Avatar, useTheme, Stack } from '@mui/material';
import {
  Person,
  Fingerprint,
  Email,
  Phone,
  Transgender,
  Cake,
  CreditCard,
  Home,
  Category,
  Warning,
  History,
  MedicalServices,
} from '@mui/icons-material';

const PatientInformationTab = ({ patient }) => {
  const theme = useTheme();
  const renderDetail = (Icon, label, value) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        <Box
          sx={{
            p: 1,
            bgcolor: 'primary.light',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
          }}
        >
          <Icon
            fontSize="small"
            color="primary"
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {value || (
              <span
                style={{
                  color: theme.palette.text.disabled,
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                Not specified
              </span>
            )}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
  return (
    <Grid container spacing={2} mt={{ xs: 2, md: 0 }}>
      <Grid item xs={12} md={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            src={patient?.patient_picture_url}
            alt={patient?.patient_name}
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
            {!patient?.patient_picture_url && patient?.patient_name?.charAt(0)}
          </Avatar>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {patient?.patient_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              EMR: {patient?.emr_number}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={10}>
        <Grid container spacing={2}>
          {renderDetail(Person, 'Full Name', patient?.patient_name)}
          {renderDetail(Fingerprint, 'EMR Number', patient?.emr_number)}
          {renderDetail(Email, 'Email', patient?.email)}
          {renderDetail(Phone, 'Phone', patient?.phone)}
          {renderDetail(Transgender, 'Gender', patient?.gender)}
          {renderDetail(
            Cake,
            'Date of Birth',
            patient?.date_of_birth &&
              new Date(patient?.date_of_birth).toLocaleDateString(),
          )}
          {renderDetail(CreditCard, 'Payment', patient?.payment_type)}
          {renderDetail(
            Home,
            'Address',
            patient?.address &&
              `${patient?.address?.wereda}, ${patient?.address?.city}`,
          )}
          {renderDetail(Warning, 'Allergies', patient?.allergy)}
          {renderDetail(History, 'Medical History', patient?.medical_history)}
          {renderDetail(
            MedicalServices,
            'Medical Conditions',
            patient?.medical_conditions,
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientInformationTab;
