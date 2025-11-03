import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Material UI Components
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Material UI Icons
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Custom Components
import PageContainer from 'ui-component/MainPage';
import DashboardSelector from './dashboard-selector';

// Custom theme with eye clinic colors (blues and purples)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#9c27b0',
      dark: '#6a1b9a',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      fontSize: '1.8rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.2rem',
    },
  },
});

// Sample data for charts
const patientFlowData = [
  { name: 'Mon', patients: 22 },
  { name: 'Tue', patients: 18 },
  { name: 'Wed', patients: 27 },
  { name: 'Thu', patients: 15 },
  { name: 'Fri', patients: 24 },
  { name: 'Sat', patients: 10 },
  { name: 'Sun', patients: 5 },
];

const conditionData = [
  { name: 'Myopia', value: 35 },
  { name: 'Cataracts', value: 25 },
  { name: 'Glaucoma', value: 15 },
  { name: 'Dry Eye', value: 12 },
  { name: 'Other', value: 13 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Sample appointments data
const appointments = [
  {
    id: 1,
    patient: 'John Smith',
    time: '9:00 AM',
    reason: 'Routine Checkup',
    status: 'Confirmed',
  },
  {
    id: 2,
    patient: 'Emma Johnson',
    time: '10:30 AM',
    reason: 'Cataract Consultation',
    status: 'Confirmed',
  },
  {
    id: 3,
    patient: 'Michael Brown',
    time: '11:45 AM',
    reason: 'Post-Op Follow-up',
    status: 'Confirmed',
  },
  {
    id: 4,
    patient: 'Sarah Davis',
    time: '2:00 PM',
    reason: 'Emergency',
    status: 'Pending',
  },
  {
    id: 5,
    patient: 'Robert Wilson',
    time: '3:30 PM',
    reason: 'Glaucoma Screening',
    status: 'Confirmed',
  },
];

// Metric cards data
const metrics = [
  {
    title: "Today's Appointments",
    value: '12',
    icon: <CalendarIcon />,
    color: '#1976d2',
  },
  {
    title: 'Total Patients',
    value: '1,243',
    icon: <GroupIcon />,
    color: '#d32f2f',
  },
  {
    title: 'Eye Exams Today',
    value: '8',
    icon: <VisibilityIcon />,
    color: '#388e3c',
  },
  {
    title: 'Avg. Wait Time',
    value: '15 min',
    icon: <AccessTimeIcon />,
    color: '#f57c00',
  },
];

// Main dashboard component
const ReceptionsDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const appliedTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />

      <PageContainer title="Dashboard">
        <Grid container spacing={3} mt={1}>
          {/* Metrics Cards */}
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  background: `linear-gradient(45deg, ${metric.color}20, ${metric.color}10)`,
                  // borderLeft: `4px solid ${metric.color}`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        color: metric.color,
                        mr: 2,
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: `${metric.color}15`,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                      >
                        {metric.title}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {metric.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Patient Flow Chart */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Weekly Patient Flow</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="#1976d2"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Conditions Distribution */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalHospitalIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Conditions Distribution</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conditionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {conditionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Appointments */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Appointments</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={
                                appointment.status === 'Confirmed'
                                  ? 'success'
                                  : 'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    </ThemeProvider>
  );
};

export default ReceptionsDashboard;
