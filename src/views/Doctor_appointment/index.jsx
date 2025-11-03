// import { useEffect, useState } from 'react';
// import {
//   Box,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Chip,
//   Button,
//   useTheme,
// } from '@mui/material';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import PageContainer from 'ui-component/MainPage';
// import Backend from 'services/backend';
// import Search from 'ui-component/search';
// import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
// import GetToken from 'utils/auth-token';
// import ErrorPrompt from 'utils/components/ErrorPrompt';
// import Fallbacks from 'utils/components/Fallbacks';

// const DoctorAppointment = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(false);

//   const [pagination, setPagination] = useState({
//     page: 0,
//     per_page: 10,
//     last_page: 0,
//     total: 0,
//   });

//   const [search, setSearch] = useState('');
//   const [doctors, setDoctors] = useState([]); // 🔹 store doctor list

//   const handleChangePage = (event, newPage) => {
//     setPagination({ ...pagination, page: newPage });
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPagination({ ...pagination, per_page: parseInt(event.target.value, 10), page: 0 });
//   };

//   const handleSearchFieldChange = (event) => {
//     const value = event.target.value;
//     setSearch(value);
//     setPagination({ ...pagination, page: 0 });
//   };

//   // 🔹 Fetch doctor availabilities
//   const handleFetchingAvailabilities = async () => {
//     setLoading(true);
//     const token = await GetToken();

//     const params = new URLSearchParams();
//     params.append('page', pagination.page + 1);
//     params.append('per_page', pagination.per_page);
//     if (search) params.append('search', search);

//     const Api = `${Backend.auth}${Backend.DocAvailabilities}?${params.toString()}`;
//     const header = {
//       Authorization: `Bearer ${token}`,
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//     };

//     try {
//       const response = await fetch(Api, { method: 'GET', headers: header });
//       const responseData = await response.json();

//       if (!response.ok) throw new Error(responseData.message || 'Failed to fetch data');

//       if (responseData.success) {
//         setData(responseData.data);
//         setPagination({
//           ...pagination,
//           last_page: responseData.last_page || 1,
//           total: responseData.total || responseData.data.length,
//         });
//         setError(false);
//       } else {
//         toast.warning(responseData.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Fetch doctor list (id → name mapping)
//   const handleFetchingDoctors = async () => {
//     const token = await GetToken();
//     const Api = `${Backend.auth}${Backend.getDoctors}`;
//     const header = {
//       Authorization: `Bearer ${token}`,
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//     };

//     try {
//       const response = await fetch(Api, { method: 'GET', headers: header });
//       const responseData = await response.json();

//       if (response.ok && responseData.success) {
//         setDoctors(responseData.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch doctors:', error);
//     }
//   };

//   // map doctor_id → doctor name
//   const getDoctorName = (id) => {
//     const doctor = doctors.find((doc) => doc.id === id);
//     return doctor ? doctor.full_name || doctor.name : `Doctor ${id}`;
//   };

//   useEffect(() => {
//     handleFetchingAvailabilities();
//     handleFetchingDoctors();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pagination.page, pagination.per_page, search]);

//   return (
//     <PageContainer title="Doctor Availabilities">
//       <Grid container>
//         <Grid item xs={12} padding={3}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//             <Search
//               title="Search Doctor Availabilities"
//               value={search}
//               onChange={handleSearchFieldChange}
//               filter={false}
//             />

//             {/* 🔹 Add Doctor Button */}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate('/add-doctor')}
//             >
//               Add Doctor
//             </Button>
//           </Box>

//           {loading ? (
//             <Grid container justifyContent="center" padding={4}>
//               <ActivityIndicator size={20} />
//             </Grid>
//           ) : error ? (
//             <ErrorPrompt title="Server Error" message="Unable to retrieve availabilities." />
//           ) : data.length === 0 ? (
//             <Fallbacks
//               severity="evaluation"
//               title="No Availabilities Found"
//               description="The list of doctor availabilities will be shown here."
//               sx={{ paddingTop: 6 }}
//             />
//           ) : (
//             <TableContainer
//               sx={{
//                 minHeight: '66dvh',
//                 border: 0.4,
//                 borderColor: theme.palette.divider,
//                 borderRadius: 2,
//               }}
//             >
//               <Table aria-label="doctor availability table" sx={{ minWidth: 650 }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Doctor Name</TableCell>
//                     <TableCell>Period</TableCell>
//                     <TableCell>Time Slots</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {data.map((availability) => (
//                     <TableRow
//                       key={availability.id}
//                       sx={{ ':hover': { backgroundColor: theme.palette.grey[50] } }}
//                     >
//                       <TableCell>{getDoctorName(availability.doctor_id)}</TableCell>
//                       <TableCell>
//                         <Chip label={availability.period} color="primary" />
//                       </TableCell>
//                       <TableCell>
//                         {availability.time_slots && availability.time_slots.length > 0 ? (
//                           availability.time_slots.map((slot, index) => (
//                             <Chip
//                               key={index}
//                               label={`${slot.start_time} - ${slot.end_time}`}
//                               sx={{ mr: 1, mb: 1 }}
//                             />
//                           ))
//                         ) : (
//                           <span>No slots</span>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <TablePagination
//                 component="div"
//                 count={pagination.total}
//                 page={pagination.page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={pagination.per_page}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </TableContainer>
//           )}
//         </Grid>
//       </Grid>
//       <ToastContainer />
//     </PageContainer>
//   );
// };

// export default DoctorAppointment;

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  useTheme,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';

const DoctorAppointment = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [slotCache, setSlotCache] = useState({}); // key: `${date}|${doctorId}` -> { slots, source, date }
  const [tooltipLoadingKey, setTooltipLoadingKey] = useState(null);
  const [preloadingDates, setPreloadingDates] = useState({}); // dateStr -> boolean

  const handleSearchFieldChange = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  // Fetch doctor availabilities
  const handleFetchingAvailabilities = async () => {
    setLoading(true);
    const token = await GetToken();

    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const Api = `${Backend.auth}${Backend.DocAvailabilities}?${params.toString()}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'Failed to fetch data');

      if (responseData.success) {
        const payload = responseData?.data;
        const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        setData(rows);
        setError(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor list (id → name mapping)
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

      if (response.ok && responseData.success) {
        setDoctors(responseData.data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  // Map doctor_id → doctor name
  const getDoctorName = (id) => {
    const doctor = doctors.find((doc) => doc.id === id);
    return doctor ? doctor.full_name || doctor.name : `Doctor ${id}`;
  };

  // Get doctor details
  const getDoctorDetails = (id) => {
    return doctors.find((doc) => doc.id === id) || {};
  };

  // Get availability for a specific date with period mapping
  const getAvailabilityForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
    const isWeekday = !isWeekend;

    return Array.isArray(data) ? data.filter((availability) => {
      const period = (availability?.period || '').toLowerCase();
      const days = (availability?.days || []).map((d) => String(d).toLowerCase());
      const availableDate = availability?.available_date; // may be null or 'YYYY-MM-DD'

      // If availability is tied to a specific date, match it exactly
      if (availableDate) {
        return availableDate === dateString;
      }

      // Period-based rules
      if (period === 'everyday') return true;
      if (period === 'weekdays') return isWeekday;
      if (period === 'weekend') return isWeekend;

      // Custom period falls back to explicit days array
      if (Array.isArray(days) && days.length > 0) {
        return days.includes(dayOfWeek);
      }

      // Default: no match
      return false;
    }) : [];
  };

  // Navigation functions (30-day period)
  const goToPreviousPeriod = () => {
    setCurrentDate(subDays(currentDate, 30));
  };

  const goToNextPeriod = () => {
    setCurrentDate(addDays(currentDate, 30));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle doctor selection for details
  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(getDoctorDetails(doctorId));
    setDetailDialogOpen(true);
  };

  // Generate next 30 days for the calendar
  const getThirtyDays = () => {
    const start = currentDate;
    const days = [];
    for (let i = 0; i < 30; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  // Fetch slots for a specific date and doctor (with caching)
  const fetchSlotsFor = async (date, doctorId) => {
    const key = `${format(date, 'yyyy-M-d')}|${doctorId}`;
    if (slotCache[key]) return slotCache[key];
    setTooltipLoadingKey(key);
    try {
      const token = await GetToken();
      const params = new URLSearchParams();
      params.append('date', format(date, 'yyyy-M-d'));
      params.append('doctor', doctorId);
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.availableTimeSlots}?${params.toString()}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to fetch slots');
      const slots = responseData?.data?.time_slots || [];
      const source = responseData?.data?.source || 'recurring';
      const apiDate = responseData?.data?.date || format(date, 'yyyy-M-d');
      const payload = { slots, source, date: apiDate };
      setSlotCache((prev) => ({ ...prev, [key]: payload }));
      return payload;
    } catch (e) {
      return { slots: [], source: 'recurring', date: format(date, 'yyyy-M-d') };
    } finally {
      setTooltipLoadingKey(null);
    }
  };

  // Preload slots for all doctors for a specific date
  const preloadSlotsForDate = async (date) => {
    const dateStr = format(date, 'yyyy-M-d');
    if (preloadingDates[dateStr]) return;
    setPreloadingDates((p) => ({ ...p, [dateStr]: true }));
    try {
      const tasks = (doctors || []).map((doc) => fetchSlotsFor(date, doc.id));
      await Promise.allSettled(tasks);
    } finally {
      setPreloadingDates((p) => ({ ...p, [dateStr]: false }));
    }
  };

  // Tooltip content for a given day using DocAvailabilities (show start-end ranges)
  const renderTooltipContent = (day) => {
    const availabilities = getAvailabilityForDate(day) || [];
    const byDoctor = availabilities.reduce((acc, row) => {
      const key = row.doctor_id;
      if (!acc[key]) acc[key] = [];
      const ranges = Array.isArray(row.time_slots) ? row.time_slots.map((s) => `${s.start_time} - ${s.end_time}`) : [];
      acc[key].push(...ranges);
      return acc;
    }, {});

    return (
      <Box p={1} sx={{ backgroundColor: 'white', border: '0.5px solid #567837', borderRadius: 1, minWidth: 220 }}>
        {Object.keys(byDoctor).length === 0 ? (
          <Typography variant="caption" color="#567837">No availability</Typography>
        ) : (
          <Grid container spacing={1}>
            {Object.entries(byDoctor).map(([docId, ranges]) => {
              const unique = Array.from(new Set(ranges));
              return (
                <Grid item xs={12} key={docId}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#567837' }}>
                    {getDoctorName(docId)}
                  </Typography>
                  <Box>
                    {unique.map((r, idx) => (
                      <Typography key={idx} variant="caption" display="block">{r}</Typography>
                    ))}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    );
  };

  useEffect(() => {
    handleFetchingAvailabilities();
    handleFetchingDoctors();
  }, [search]);

  // Listen for storage events to refresh when schedule is created
  useEffect(() => {
    const handleStorageChange = () => {
      handleFetchingAvailabilities();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events
    window.addEventListener('availabilityUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('availabilityUpdated', handleStorageChange);
    };
  }, []);

  const thirtyDays = getThirtyDays();

  return (
    <PageContainer title="Doctor Availabilities">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Search
              title="Search Doctor Availabilities"
              value={search}
              onChange={handleSearchFieldChange}
              filter={false}
            />

          </Box>

          {loading ? (
            <Grid container justifyContent="center" padding={4}>
              <ActivityIndicator size={20} />
            </Grid>
          ) : error ? (
            <ErrorPrompt title="Server Error" message="Unable to retrieve availabilities." />
          ) : data.length === 0 ? (
            <Fallbacks
              severity="evaluation"
              title="No Availabilities Found"
              description="The list of doctor availabilities will be shown here."
              sx={{ paddingTop: 6 }}
            />
          ) : (
            <>
              {/* Calendar Navigation */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton onClick={goToPreviousPeriod}>
                  <Typography variant="h4">&#8249;</Typography>
                </IconButton>
                
                <Typography variant="h5" component="div">
                  {`${format(currentDate, 'MMM d, yyyy')} - ${format(addDays(currentDate, 29), 'MMM d, yyyy')}`}
                </Typography>
                
                <Box>
                  <Button onClick={goToToday} sx={{ mr: 1 }}>
                    Today
                  </Button>
                  <IconButton onClick={goToNextPeriod}>
                    <Typography variant="h4">&#8250;</Typography>
                  </IconButton>
                </Box>
              </Box>

              {/* Calendar View: 30-day grid */}
              <Grid container spacing={1}>
                {thirtyDays.map((day, index) => {
                  const availabilities = getAvailabilityForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const hasSlots = availabilities && availabilities.length > 0;
                  
                  return (
                    <Grid item xs={12/7} key={`day-${index}`}>
                      <Tooltip
                        title={renderTooltipContent(day)}
                        placement="top"
                        enterDelay={300}
                        arrow
                      >
                        <Paper 
                          elevation={isSelected ? 3 : 1}
                          onClick={() => handleDateSelect(day)}
                          sx={{ 
                            minHeight: '120px',
                            p: 1,
                            cursor: 'pointer',
                            border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                            backgroundColor: isSelected ? 'primary.light' : 'background.paper',
                            '&:hover': { 
                              backgroundColor: '#eaf1e4',
                              border: '2px solid #567837',
                              color: 'black',
                              '& *': { color: 'black' }
                            }
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                                color: isSameDay(day, new Date()) ? 'primary.main' : 'text.primary'
                              }}
                            >
                              {format(day, 'EEE d')}
                            </Typography>
                            {hasSlots && (
                              <Chip size="small" label={`${availabilities.length}`} color="success" />
                            )}
                          </Box>
                          {/* Show only the count in the calendar cell; time slots are shown in the hover tooltip */}
                        </Paper>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Selected Date Details */}
              {selectedDate && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Availability on {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  <Grid container spacing={2}>
                    {getAvailabilityForDate(selectedDate).map((availability, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          variant="outlined"
                          sx={{ 
                            cursor: 'pointer',
                            borderColor: theme.palette.success.light,
                            '&:hover': {
                              backgroundColor: theme.palette.success.light + '20'
                            }
                          }}
                          onClick={() => handleDoctorSelect(availability.doctor_id)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {getDoctorName(availability.doctor_id)}
                            </Typography>
                            {availability.time_slots && availability.time_slots.map((slot, slotIndex) => (
                              <Typography key={slotIndex} variant="body2" color="textSecondary">
                                {slot.start_time} - {slot.end_time}
                              </Typography>
                            ))}
                            <Chip 
                              label={availability.period} 
                              size="small" 
                              sx={{ 
                                mt: 1,
                                backgroundColor: theme.palette.success.main,
                                color: 'white'
                              }} 
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

            </>
          )}
        </Grid>
      </Grid>

      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Doctor Information</DialogTitle>
        <DialogContent>
          {selectedDoctor && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedDoctor.full_name || selectedDoctor.name}
              </Typography>
              {/* Removed Specialty as requested */}
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status: {selectedDoctor.status || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Created At: {selectedDoctor.created_at ? format(new Date(selectedDoctor.created_at), 'yyyy-MM-dd') : 'Not specified'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Email: {selectedDoctor.email || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Phone: {selectedDoctor.phone || 'Not specified'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DoctorAppointment;