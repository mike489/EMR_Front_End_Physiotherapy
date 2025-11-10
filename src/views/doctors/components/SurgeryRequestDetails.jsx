// SurgeryRequestDetails.jsx
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
  Divider,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  MedicalServices as SurgeryIcon,
  Description as NotesIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccountCircle as DoctorIcon,
  CalendarToday as CalendarIcon,
  Cancel,
} from '@mui/icons-material';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

export default function SurgeryRequestDetails({
  request,
  open,
  onClose,
  onAccept,
  onReject,
}) {
  if (!request) return null;

  const { visit, status, notes, created_at, updated_at } = request;
  const patient = visit?.patient;

  const isPending = status === 'pending'; // ✅ add this

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600} color="white">
            Surgery Request Details
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
                  {patient?.full_name || '—'}
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
                  <ListItemText
                    primary="Gender"
                    secondary={patient?.gender || '—'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <PhoneIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={patient?.phone || '—'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <EmailIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={patient?.email || '—'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Visit Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                color="primary"
              >
                Visit Details
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <SurgeryIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Visit Type"
                    secondary={visit?.visit_type || '—'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <CalendarIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Visit Date"
                    secondary={formatDate(visit?.visit_date)}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <CheckCircleIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={visit?.status || '—'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Notes */}
        <Box mt={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              color="primary"
            >
              Surgeon's Notes
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                minHeight: 80,
                '& p': { margin: 0 },
              }}
              dangerouslySetInnerHTML={{ __html: notes || '—' }}
            />
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
                  {formatDate(created_at)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography fontWeight={500}>
                  {formatDate(updated_at)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      {/* Action Buttons */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          mt: 3,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => onReject(request.id)}
            disabled={!isPending}
            fullWidth={{ xs: true, sm: false }}
          >
            Reject Request
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => onAccept(request.id)}
            disabled={!isPending}
            fullWidth={{ xs: true, sm: false }}
          >
            Accept Request
          </Button>
        </Stack>
        {!isPending && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', textAlign: 'right' }}
          >
            This request has already been {request.status}.
          </Typography>
        )}
      </Paper>
    </Dialog>
  );
}
