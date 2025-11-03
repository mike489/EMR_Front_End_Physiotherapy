import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Backend from 'services/backend'
import GetToken from 'utils/auth-token'
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator'
import ErrorPrompt from 'utils/components/ErrorPrompt'
import Fallbacks from 'utils/components/Fallbacks'
import DrogaButton from 'ui-component/buttons/DrogaButton'
import { getStatusColor } from 'utils/function'

const NextAppointmentTab = ({ visit }) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 0, per_page: 10, last_page: 0, total: 0 })
  const [meta, setMeta] = useState({
    current_page: 1,
    first_page_url: '',
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 10,
    prev_page_url: null,
    from: 0,
    to: 0,
    total: 0,
  })
  const [addOpen, setAddOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ appointment_date: '', time: '' })

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: parseInt(event.target.value, 10), page: 0 })
  }

  const handleFetchAppointments = async () => {
    const visitId = visit?.visit_id || visit?.id || visit?.visit?.id
    if (!visitId) return
    setLoading(true)
    const token = await GetToken()

    const Api = `${Backend.auth}${Backend.nextVisitAppointments}/${visitId}?page=${pagination.page + 1}&per_page=${pagination.per_page}`
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(Api, { method: 'GET', headers: header })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.data?.message || result?.message || 'Failed to fetch next appointments')
      }

      if (result.success && result.data) {
        const payload = result.data
        setData(Array.isArray(payload.data) ? payload.data : [])
        setPagination({
          ...pagination,
          last_page: payload.last_page || 1,
          total: payload.total || (Array.isArray(payload.data) ? payload.data.length : 0),
          per_page: payload.per_page || pagination.per_page,
        })
        setMeta({
          current_page: payload.current_page ?? meta.current_page,
          first_page_url: payload.first_page_url ?? meta.first_page_url,
          last_page: payload.last_page ?? meta.last_page,
          last_page_url: payload.last_page_url ?? meta.last_page_url,
          links: payload.links ?? meta.links,
          next_page_url: payload.next_page_url ?? meta.next_page_url,
          path: payload.path ?? meta.path,
          per_page: payload.per_page ?? pagination.per_page,
          prev_page_url: payload.prev_page_url ?? meta.prev_page_url,
          from: payload.from ?? meta.from,
          to: payload.to ?? meta.to,
          total: payload.total ?? meta.total,
        })
        setError(false)
      } else {
        toast.warning(result?.data?.message || result?.message || 'Unable to load next appointments')
      }
    } catch (err) {
      toast.error(err.message)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visit?.id, pagination.page, pagination.per_page])

  const handleOpenAdd = () => {
    setForm({ appointment_date: '', time: '' })
    setAddOpen(true)
  }

  const handleCloseAdd = () => {
    setAddOpen(false)
  }

  const handleCreateClick = () => {
    setConfirmOpen(true)
  }

  const handleConfirmClose = () => setConfirmOpen(false)

  const handleCreateNextVisit = async () => {
    const visitId = visit?.visit_id || visit?.id || visit?.visit?.id
    if (!visitId) return
    setCreating(true)
    const token = await GetToken()
    const Api = `${Backend.auth}next-visit-appointment/${visitId}`
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const payload = {
      appointment_date: form.appointment_date,
      time: form.time,
    }

    try {
      const response = await fetch(Api, { method: 'POST', headers: header, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.data?.message || result?.message || 'Failed to create next visit')
      if (result.success) {
        toast.success(result?.data?.message || result?.message || 'Created')
        setAddOpen(false)
        setConfirmOpen(false)
        // reload first page to include newly created item
        setPagination((p) => ({ ...p, page: 0 }))
        await handleFetchAppointments()
      } else {
        toast.warning(result?.data?.message || result?.message || 'Not created')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3">Next Visit Appointments</Typography>
        <IconButton
          color="primary"
          aria-label="add appointment"
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: 'white',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
            <ActivityIndicator size={20} />
          </Grid>
        </Grid>
      ) : error ? (
        <ErrorPrompt title="Server Error" message="Unable to retrieve next visit appointments" />
      ) : data.length === 0 ? (
        <Fallbacks
          severity="appointments"
          title="No Next Appointments"
          description="Next visit appointments will be listed here"
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  {/* <TableCell>Doctor ID</TableCell> */}
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.patient_name || '-'}</TableCell>
                    <TableCell>{row.phone_number || '-'}</TableCell>
                    <TableCell>{row.email || '-'}</TableCell>
                    <TableCell>{row.age ?? '-'}</TableCell>
                    <TableCell>{row.gender || '-'}</TableCell>
                    {/* <TableCell>{row.doctor_id || '-'}</TableCell> */}
                    <TableCell>{row.appointment_date ? format(new Date(row.appointment_date), 'yyyy-MM-dd') : '-'}</TableCell>
                    <TableCell>{row.time || '-'}</TableCell>
                    <TableCell>
                    <DrogaButton
                      variant="text"
                      title={row.status || '-'}
                      onPress={() => {}}
                      sx={{
                        color: getStatusColor(row.status || ''),
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }}
                    />
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.per_page}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Add Next Visit Modal */}
      <Dialog open={addOpen} onClose={handleCloseAdd} fullWidth maxWidth="sm">
        <DialogTitle>Add Next Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Appointment Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.appointment_date}
              onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
              fullWidth
            />
            <TextField
              label="Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              fullWidth
            />
            {/* status removed per request */}
          </Box>
        </DialogContent>
        <DialogActions>
          <DrogaButton title="Cancel" variant="text" onPress={handleCloseAdd} />
          <DrogaButton title="Create" onPress={handleCreateClick} />
        </DialogActions>
      </Dialog>

      {/* Confirm Create Dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create the next visit?</Typography>
        </DialogContent>
        <DialogActions>
          <DrogaButton title="No" variant="text" onPress={handleConfirmClose} />
          <DrogaButton title="Yes, Create" loading={creating} onPress={handleCreateNextVisit} />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NextAppointmentTab