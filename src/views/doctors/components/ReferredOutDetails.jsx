// ReferredOutDetails.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  LocalHospital as HospitalIcon,
  Description as NotesIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccountCircle as DoctorIcon,
} from '@mui/icons-material';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

export default function ReferredOutDetails({ referral, open, onClose }) {
  if (!referral) return null;

  const { patient, type, status, to_doctor, sent_to, to, from } = referral;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600} color="white">
            Referred Out Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Header */}
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor:
                      patient?.gender === 'Male'
                        ? 'info.main'
                        : 'secondary.main',
                    fontSize: '1.8rem',
                  }}
                >
                  {patient?.full_name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || '?'}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" fontWeight={700}>
                  {patient?.full_name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  mt={1}
                  flexWrap="wrap"
                  gap={1}
                >
                  <Chip
                    icon={<BadgeIcon />}
                    label={patient?.emr_number}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={type}
                    size="small"
                    color={type === 'internal' ? 'info' : 'secondary'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Chip
                    icon={
                      status === 'pending' ? (
                        <TimeIcon />
                      ) : status === 'accepted' ? (
                        <CheckCircleIcon />
                      ) : (
                        <CancelIcon />
                      )
                    }
                    label={status}
                    size="small"
                    color={
                      status === 'pending'
                        ? 'warning'
                        : status === 'accepted'
                          ? 'success'
                          : 'error'
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Patient Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                color="primary"
              >
                Patient Information
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <CakeIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="DOB"
                    secondary={formatDate(patient?.date_of_birth)}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <PersonIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="Gender" secondary={patient?.gender} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <PhoneIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={patient?.phone} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <EmailIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={patient?.email} />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Referred To */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                color="primary"
              >
                Referral To
              </Typography>

              {to ? (
                <Box>
                  <Typography fontWeight={600}>{to.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {to.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {to.phone}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">—</Typography>
              )}
            </Paper>
            {/* Referral From */}
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                color="primary"
              >
                Referral From
              </Typography>

              {from ? (
                <Box>
                  <Typography fontWeight={600}>{from.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {from.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {from.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {from.phone}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">—</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Clinical Notes */}
        <Box mt={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              color="primary"
            >
              Clinical Summary
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'History & Exam', value: referral.history_exam },
                {
                  label: 'Medical Diagnosis',
                  value: referral.medical_diagnosis,
                },
                {
                  label: 'Physiotherapy Diagnosis',
                  value: referral.physiotherapy_diagnosis,
                },
                { label: 'Treatment Given', value: referral.treatment_given },
                { label: 'Reason for Referral', value: referral.reason },
              ].map((item) => (
                <Grid item xs={12} key={item.label}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.label}
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: 'grey.50',
                      minHeight: 40,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {item.value}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Timestamps */}
        <Box mt={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography fontWeight={500}>
                  {formatDate(referral.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography fontWeight={500}>
                  {formatDate(referral.updated_at)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
