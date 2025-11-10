import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  AccessTime as TimeIcon,
  CalendarToday as DateIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';

const PaymentList = ({ patient }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFetchingPayments = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientPayments}/${patient.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    ``;

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setPayments(responseData.data.data);
      } else {
        setError(responseData.message || 'Failed to fetch payments');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchingPayments();
  }, []);

  // Format currency amount
  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color based on remaining days
  const getStatusColor = (days) => {
    if (days > 7) return 'success';
    if (days > 3) return 'warning';
    return 'error';
  };

  // Get status text based on remaining days
  const getStatusText = (days) => {
    if (days > 7) return 'Active';
    if (days > 3) return 'Expiring Soon';
    return 'Expired';
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading payments...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <WalletIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight="600">
            Payment History
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <PaymentIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Total Payments: {payments.length}
          </Typography>
        </Box>
      </Paper>

      {payments.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Payment Type
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Remaining Days
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{
                    '&:nth-of-type(even)': { bgcolor: 'grey.50' },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <WalletIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {payment.payment_type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="success.main"
                    >
                      {formatAmount(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DateIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {formatDate(payment.created_at)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(payment.remaining_days)}
                      color={getStatusColor(payment.remaining_days)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TimeIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" fontWeight="500">
                        {payment.remaining_days} days
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}
        >
          <WalletIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No payments found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your payment history will appear here once you make a payment.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentList;
