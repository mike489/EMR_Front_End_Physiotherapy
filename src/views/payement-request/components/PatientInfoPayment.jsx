import React from 'react';
import {
  Avatar,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Transgender,
  Fingerprint,
  CreditCard,
  Home,
  Warning,
  History,
  MedicalServices,
} from '@mui/icons-material';
import { Box, useTheme } from '@mui/system';

const PatientInfoPaymentTab = ({ patient }) => {
  const theme = useTheme();
  const renderDetail = (icon, label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        {React.cloneElement(icon, { color: 'primary' })}
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {label}
          </Typography>
          <Typography variant="body1">
            {value || (
              <span style={{ color: '#999', fontStyle: 'italic' }}>
                Not specified
              </span>
            )}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );

  const renderList = (icon, label, items) => (
    <Grid item xs={12} sm={6} md={4}>
      <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
        {React.cloneElement(icon, { color: 'primary' })}
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {label}
          </Typography>
          {items && items.length > 0 ? (
            <List dense sx={{ py: 0 }}>
              {items.map((item, index) => (
                <ListItem key={index} sx={{ py: 0, pl: 0 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              style={{ color: '#999', fontStyle: 'italic' }}
            >
              Not specified
            </Typography>
          )}
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Grid container spacing={3} mt={2}>
      {/* Patient Photo */}
      <Grid item xs={12} md={3} display="flex" justifyContent="center">
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
            alt={patient.full_name}
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
            {!patient?.patient_picture_url && patient.full_name?.charAt(0)}
          </Avatar>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            {/* Name + Status */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {patient?.full_name}
              </Typography>

              <Chip
                label={patient?.patient_category}
                size="small"
                sx={{
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  fontWeight: 500,
                  borderRadius: '5px',
                }}
              />
            </Box>

            {/* EMR Number */}
            <Typography variant="h5" color="text.secondary">
              EMR: {patient?.emr_number}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={9}>
        <CardContent sx={{ p: 0 }}>
          <Grid container spacing={2}>
            {renderDetail(<Person />, 'Full Name', patient.full_name)}
            {renderDetail(<Fingerprint />, 'EMR Number', patient.emr_number)}
            {renderDetail(<Email />, 'Email', patient.email)}
            {renderDetail(<Phone />, 'Phone', patient.phone)}
            {renderDetail(<Transgender />, 'Gender', patient.gender)}
            {renderDetail(
              <Cake />,
              'Date of Birth',
              patient.date_of_birth &&
                new Date(patient.date_of_birth).toLocaleDateString(),
            )}
            {renderDetail(<Fingerprint />, 'National ID', patient.national_id)}
            {renderDetail(
              <Fingerprint />,
              'Passport Number',
              patient.passport_number,
            )}
            {/* {renderDetail(
              <Category />,
              'Patient Category',
              patient.patient_category,
            )} */}
            {renderDetail(<CreditCard />, 'Payment Type', patient.payment_type)}
            {renderDetail(
              <Home />,
              'Address',
              patient.address &&
                `${patient.address?.wereda}, ${patient.address?.city}, ${patient.address?.country}`,
            )}
            {renderList(<Warning />, 'Allergies', patient.allergies)}
            {renderList(
              <History />,
              'Medical History',
              patient.medical_history,
            )}
            {renderList(
              <MedicalServices />,
              'Medical Conditions',
              patient.medical_conditions,
            )}
          </Grid>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default PatientInfoPaymentTab;
