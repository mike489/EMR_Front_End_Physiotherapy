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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Delete, Edit, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';

const DoctorAvailabilityTab = ({ doctor }) => {
  const navigate = useNavigate();
  const [availabilityRows, setAvailabilityRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState(null);
  const [timeSlots, setTimeSlots] = useState([{ start_time: '', end_time: '' }]);
  const [saving, setSaving] = useState(false);
  const [customDates, setCustomDates] = useState([{ date: '', time_slots: [{ start_time: '', end_time: '' }] }]);

  const fetchDoctorAvailability = async () => {
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
      if (!response.ok) throw new Error(responseData.message || 'Failed to fetch availability');

      const payload = responseData?.data || [];
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setAvailabilityRows(rows);
    } catch (e) {
      console.error(e);
      setAvailabilityRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id]);

  const handleOpenEdit = (row) => {
    setCurrentAvailability(row);
    const isCustom = String(row?.period || '').toLowerCase() === 'custom';
    if (isCustom) {
      if (row?.available_date) {
        const parsedSlots = (row.time_slots || []).map((s) => {
          if (typeof s === 'string' && s.includes('-')) {
            const [start, end] = s.split('-');
            return { start_time: start || '', end_time: end || '' };
          }
          return { start_time: s?.start_time || '', end_time: s?.end_time || '' };
        });
        setCustomDates([{ date: row.available_date, time_slots: parsedSlots.length ? parsedSlots : [{ start_time: '', end_time: '' }] }]);
        setTimeSlots([{ start_time: '', end_time: '' }]);
      } else {
        const cds = Array.isArray(row?.custom_dates) && row.custom_dates.length > 0
          ? row.custom_dates.map((cd) => ({
              date: cd.date || cd.available_date || '',
              time_slots: (cd.time_slots || []).map((s) => (typeof s === 'string' ? { start_time: (s.split('-')[0] || ''), end_time: (s.split('-')[1] || '') } : { start_time: s.start_time || '', end_time: s.end_time || '' })),
            }))
          : [{ date: '', time_slots: [{ start_time: '', end_time: '' }] }];
        setCustomDates(cds);
        setTimeSlots([{ start_time: '', end_time: '' }]);
      }
    } else {
      const slots = Array.isArray(row?.time_slots) && row.time_slots.length > 0
        ? row.time_slots.map((s) => ({ start_time: s.start_time || '', end_time: s.end_time || '' }))
        : [{ start_time: '', end_time: '' }];
      setTimeSlots(slots);
      setCustomDates([{ date: '', time_slots: [{ start_time: '', end_time: '' }] }]);
    }
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setCurrentAvailability(null);
    setTimeSlots([{ start_time: '', end_time: '' }]);
    setCustomDates([{ date: '', time_slots: [{ start_time: '', end_time: '' }] }]);
  };

  const handleAddSlot = () => {
    setTimeSlots((s) => [...s, { start_time: '', end_time: '' }]);
  };

  const handleRemoveSlot = (idx) => {
    setTimeSlots((s) => s.filter((_, i) => i !== idx));
  };

  const handleSlotChange = (idx, field, value) => {
    setTimeSlots((s) => s.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)));
  };

  const validateSlots = () => {
    const isCustom = String(currentAvailability?.period || '').toLowerCase() === 'custom';
    if (isCustom) {
      if (!Array.isArray(customDates) || customDates.length === 0) return 'Add at least one date';
      for (const cd of customDates) {
        if (!cd.date) return 'Each custom entry must have a date';
        if (!Array.isArray(cd.time_slots) || cd.time_slots.length === 0) return 'Each date needs at least one time slot';
        for (const slot of cd.time_slots) {
          if (!slot.start_time || !slot.end_time) return 'Each slot needs start and end time';
          if (slot.end_time <= slot.start_time) return 'End time must be after start time';
        }
      }
      return '';
    }
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) return 'Add at least one time slot';
    for (const slot of timeSlots) {
      if (!slot.start_time || !slot.end_time) return 'Each slot needs start and end time';
      if (slot.end_time <= slot.start_time) return 'End time must be after start time';
    }
    return '';
  };

  const handleSaveEdit = async () => {
    const err = validateSlots();
    if (err) {
      alert(err);
      return;
    }
    if (!currentAvailability?.id) return;
    try {
      setSaving(true);
      const token = await GetToken();
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.DocAvailabilities}/${currentAvailability.id}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const isCustom = String(currentAvailability?.period || '').toLowerCase() === 'custom';
      let body;
      if (isCustom) {
        if (currentAvailability?.available_date) {
          const first = customDates[0] || { date: '', time_slots: [] };
          body = {
            period: 'Custom',
            doctor_id: doctor?.id,
            available_date: first.date,
            time_slots: (first.time_slots || []).map((s) => `${s.start_time}-${s.end_time}`),
          };
        } else {
          body = {
            period: 'Custom',
            doctor_id: doctor?.id,
            custom_dates: customDates.map((cd) => ({
              available_date: cd.date,
              time_slots: (cd.time_slots || []).map((s) => ({ start_time: s.start_time, end_time: s.end_time })),
            })),
          };
        }
      } else {
        body = {
          time_slots: timeSlots,
          period: currentAvailability?.period || '',
          doctor_id: doctor?.id,
        };
      }
      const res = await fetch(Api, { method: 'PATCH', headers: header, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || 'Failed to update availability');
      handleCloseEdit();
      fetchDoctorAvailability();
    } catch (e) {
      alert(e?.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    const ok = window.confirm('Delete this availability?');
    if (!ok) return;
    try {
      const token = await GetToken();
      const Api = `${import.meta.env.VITE_AUTH_URL}${Backend.DocAvailabilities}/${row.id}`;
      const header = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const res = await fetch(Api, { method: 'DELETE', headers: header });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.message || 'Failed to delete availability');
      fetchDoctorAvailability();
    } catch (e) {
      alert(e?.message || 'Failed to delete availability');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Doctor Availability
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/doctors/schedule', { state: { doctor } })}
        >
          Schedule
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="caption" color="text.secondary">
                    Loading…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : !Array.isArray(availabilityRows) || availabilityRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="caption" color="text.secondary">
                    No availability found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                // Build grouped map: period -> list of entries {date?, start_time, end_time, _source}
                const groups = (availabilityRows || []).reduce((acc, row) => {
                  const period = row?.period || 'Unknown';
                  const pushEntry = (entry) => {
                    acc[period] = acc[period] || [];
                    acc[period].push({ ...entry, _source: row });
                  };

                  if (row?.available_date && Array.isArray(row?.time_slots)) {
                    row.time_slots.forEach((s) => {
                      if (typeof s === 'string' && s.includes('-')) {
                        const [start, end] = s.split('-');
                        pushEntry({ date: row.available_date, start_time: start || '', end_time: end || '' });
                      } else {
                        pushEntry({ date: row.available_date, start_time: s?.start_time || '', end_time: s?.end_time || '' });
                      }
                    });
                  } else if (Array.isArray(row?.custom_dates) && row.custom_dates.length > 0) {
                    row.custom_dates.forEach((cd) => {
                      (cd.time_slots || []).forEach((s) => {
                        if (typeof s === 'string' && s.includes('-')) {
                          const [start, end] = s.split('-');
                          pushEntry({ date: cd.date || cd.available_date || '', start_time: start || '', end_time: end || '' });
                        } else {
                          pushEntry({ date: cd.date || cd.available_date || '', start_time: s?.start_time || '', end_time: s?.end_time || '' });
                        }
                      });
                    });
                  } else if (Array.isArray(row?.time_slots)) {
                    row.time_slots.forEach((s) => pushEntry({ start_time: s?.start_time || '', end_time: s?.end_time || '' }));
                  } else {
                    pushEntry({ start_time: '', end_time: '' });
                  }
                  return acc;
                }, {});

                return Object.entries(groups).map(([period, entries]) => (
                  <React.Fragment key={period}>
                    {entries.map((entry, idx) => (
                      <TableRow key={`${period}-${idx}`} sx={{ backgroundColor: 'white' }}>
                        {idx === 0 ? (
                          <TableCell rowSpan={entries.length} sx={{ fontWeight: 'bold', verticalAlign: 'top' }}>{period}</TableCell>
                        ) : null}
                        <TableCell>{entry.date || (String(period).toLowerCase() === 'custom' ? '' : '')}</TableCell>
                        <TableCell>{entry.start_time}</TableCell>
                        <TableCell>{entry.end_time}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(entry._source)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(entry._source)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Availability</DialogTitle>
        <DialogContent>
          {String(currentAvailability?.period || '').toLowerCase() === 'custom' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {customDates.map((cd, cdIdx) => (
                <Box key={`cd-${cdIdx}`} sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                      type="date"
                      label={`Date ${cdIdx + 1}`}
                      size="small"
                      value={cd.date}
                      onChange={(e) => setCustomDates((arr) => arr.map((v, i) => (i === cdIdx ? { ...v, date: e.target.value } : v)))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <IconButton color="error" onClick={() => setCustomDates((arr) => arr.filter((_, i) => i !== cdIdx))} disabled={customDates.length === 1}>
                      <Remove />
                    </IconButton>
                    <IconButton color="primary" onClick={() => setCustomDates((arr) => [...arr, { date: '', time_slots: [{ start_time: '', end_time: '' }] }])}>
                      <Add />
                    </IconButton>
                  </Box>
                  {(cd.time_slots || []).map((slot, idx) => (
                    <Box key={`cd-${cdIdx}-slot-${idx}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TextField
                        type="time"
                        label="Start Time"
                        size="small"
                        value={slot.start_time}
                        onChange={(e) => setCustomDates((arr) => arr.map((v, i) => (i === cdIdx ? { ...v, time_slots: v.time_slots.map((s, si) => (si === idx ? { ...s, start_time: e.target.value } : s)) } : v)))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <TextField
                        type="time"
                        label="End Time"
                        size="small"
                        value={slot.end_time}
                        onChange={(e) => setCustomDates((arr) => arr.map((v, i) => (i === cdIdx ? { ...v, time_slots: v.time_slots.map((s, si) => (si === idx ? { ...s, end_time: e.target.value } : s)) } : v)))}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <IconButton color="error" onClick={() => setCustomDates((arr) => arr.map((v, i) => (i === cdIdx ? { ...v, time_slots: v.time_slots.filter((_, si) => si !== idx) } : v)))} disabled={(cd.time_slots || []).length === 1}>
                        <Remove />
                      </IconButton>
                      <IconButton color="primary" onClick={() => setCustomDates((arr) => arr.map((v, i) => (i === cdIdx ? { ...v, time_slots: [...v.time_slots, { start_time: '', end_time: '' }] } : v)))}>
                        <Add />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {timeSlots.map((slot, idx) => (
                <Box key={`slot-${idx}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    type="time"
                    label="Start Time"
                    size="small"
                    value={slot.start_time}
                    onChange={(e) => handleSlotChange(idx, 'start_time', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    type="time"
                    label="End Time"
                    size="small"
                    value={slot.end_time}
                    onChange={(e) => handleSlotChange(idx, 'end_time', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <IconButton color="error" onClick={() => handleRemoveSlot(idx)} disabled={timeSlots.length === 1}>
                    <Remove />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<Add />} variant="outlined" onClick={handleAddSlot} sx={{ alignSelf: 'flex-start' }}>
                Add Slot
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAvailabilityTab;
