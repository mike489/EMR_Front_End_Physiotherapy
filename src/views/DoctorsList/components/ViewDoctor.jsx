import React, { useEffect, useMemo, useState } from 'react';
import PageContainer from 'ui-component/MainPage';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Box,
  Grid,
  Avatar,
  Typography,
  Divider,
  Chip,
  useTheme,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import DoctorAvailabilityTab from './DoctorAvailabilityTab';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { format } from 'date-fns';

const ViewDoctor = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctor = state?.doctor || state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState(state?.initialTab || 0);

  const doctorTitle = useMemo(() => doctor.full_name || doctor.name || 'Doctor Details', [doctor]);

  const fetchDoctorAvailabilities = async () => {
    if (!doctor?.id) return;
    setLoading(true);
    try {
      const token = await GetToken();
      const params = new URLSearchParams();
      params.append('doctor', doctor.id);
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.DocAvailabilities}?${params.toString()}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to fetch availabilities');
      setError(false);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAvailabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id]);

  return (
    <PageContainer back={true} title={doctorTitle}>
      <Card sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)', background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
          <Tab label="Doctor Information" />
          <Tab label="Doctor Availability" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Doctor Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'divider' }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} display="flex" justifyContent="center">
                <Paper elevation={3} sx={{ p: 1, borderRadius: 3 }}>
                  <Avatar src={doctor?.avatar_url} alt={doctorTitle} sx={{ width: 160, height: 160, fontSize: 60, bgcolor: 'primary.light' }}>
                    {!doctor?.avatar_url && (doctorTitle || 'D')?.charAt(0)}
                  </Avatar>
                </Paper>
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                      <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                    </Box>
                    <Typography variant="body1">{doctor?.full_name || doctor?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    </Box>
                    <Typography variant="body1">{doctor?.email || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                      <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                    </Box>
                    <Typography variant="body1">{doctor?.phone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                      <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    </Box>
                    {(() => {
                      const isActive = String(doctor?.status || '').toLowerCase() === 'active';
                      return isActive ? (
                        <Chip label="Active" sx={{ backgroundColor: '#d8edd9', color: 'green' }} />
                      ) : (
                        <Chip label="Inactive" sx={{ backgroundColor: '#f7e4e4', color: 'red' }} />
                      );
                    })()}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                      <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                    </Box>
                    <Typography variant="body1">
                      {doctor?.created_at ? format(new Date(doctor.created_at), 'yyyy-MM-dd') : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {tab === 1 && <DoctorAvailabilityTab doctor={doctor} />}
      </Card>
    </PageContainer>
  );
};

export default ViewDoctor;


