import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Person,
  Schedule,
  Event,
  Note,
  Healing,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';

const SurgeryRequestDetails = ({ request, onAccept, onReject }) => {
  const isPending = request.status === 'pending';

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: <Schedule fontSize="small" /> };
      case 'approved':
        return { color: 'success', icon: <CheckCircle fontSize="small" /> };
      case 'rejected':
        return { color: 'error', icon: <Cancel fontSize="small" /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header Card */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, overflow: 'visible' }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Surgery Request
              </Typography>
            </Box>
            <Chip
              icon={statusConfig.icon}
              label={
                request.status.charAt(0).toUpperCase() + request.status.slice(1)
              }
              color={statusConfig.color}
              sx={{ fontWeight: 'medium', px: 1 }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Event fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(new Date(request.created_at), "PPP 'at' p")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Schedule fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(new Date(request.updated_at), "PPP 'at' p")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(request.updated_at), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Note fontSize="small" color="action" sx={{ mt: 0.5 }} />
                <Box flex={1}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Notes
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        request.notes ||
                        "<em style='color: #999'>No additional notes provided.</em>",
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Doctor Info */}
      {request.doctor?.user && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Healing color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Doctor Information
              </Typography>
            </Stack>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={request.doctor.user.profile_photo_url}
                  sx={{ width: 70, height: 70, boxShadow: 1 }}
                >
                  <Person />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {request.doctor.user.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {request.doctor.user.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {request.doctor.user.phone || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Status:</strong>{' '}
                      <Chip
                        label={request.doctor.user.status}
                        size="small"
                        color={
                          request.doctor.user.status === 'active'
                            ? 'success'
                            : 'default'
                        }
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Requester Info */}
      {request.requester && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Person color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Requester Information
              </Typography>
            </Stack>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={request.requester.profile_photo_url}
                  sx={{ width: 70, height: 70, boxShadow: 1 }}
                >
                  <Person />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong>{' '}
                      {request.requester.name || request.requester}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {request.requester.email || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {request.requester.phone || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

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
            startIcon={<Cancel />}
            onClick={() => onReject(request.id)}
            disabled={!isPending}
            fullWidth={{ xs: true, sm: false }}
          >
            Reject Request
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
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
    </Box>
  );
};

export default SurgeryRequestDetails;
