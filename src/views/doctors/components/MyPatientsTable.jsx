import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  TableContainer,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import GetToken from "utils/auth-token";
import Backend from "services/backend";
import { toast } from "react-toastify";
import Fallbacks from "utils/components/Fallbacks";
import PatientDetails from "./PatientDetails";

export default function MyPatientsTable({ doctorId, open, onClose, onView }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 10,
    total: 0,
  });

  const fetchPatients = async (page = 1) => {
    if (!doctorId) return;

    const token = await GetToken();
    // CORRECT URL – first query param uses ?
    const api = `${Backend.auth}${Backend.myPatients}?page=${page}`;
    console.log("Requesting:", api); // DEBUG

    try {
      setLoading(true);
      const res = await fetch(api, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.success && data.data?.data) {
        setPatients(data.data.data);
        setPagination({
          page: data.data.current_page - 1,
          perPage: data.data.per_page,
          total: data.data.total,
        });
      } else {
        toast.warning(data.message || "Failed to fetch patients");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when the component becomes visible
  useEffect(() => {
    if (open && doctorId) fetchPatients(1);
  }, [open, doctorId]);

  const handlePageChange = (_, newPage) => {
    fetchPatients(newPage + 1);
  };

  // If you still want the Dialog contract, just hide when !open
  if (!open) return null;

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : patients.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>EMR Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Visit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {patients.map((patient) => {
                  const lastVisit =
                    patient.visits && patient.visits.length > 0
                      ? patient.visits[0]
                      : null;

                  return (
                    <TableRow key={patient.id} hover>
                      <TableCell>{patient.full_name}</TableCell>
                      <TableCell>{patient.emr_number}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.address?.city}</TableCell>
                      <TableCell>{lastVisit?.visit_type} </TableCell>
                      <TableCell>
                        <Chip
                          label={lastVisit?.status || "No Visit"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor:
                              lastVisit?.status === "Finished"
                                ? "success.main"
                                : lastVisit?.status === "In Progress"
                                  ? "info.main"
                                  : "grey.500",
                            color: "white",
                            minWidth: 85,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton onClick={() => setSelectedPatient(patient)}>
                            <Visibility />
                          </IconButton>

                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            rowsPerPageOptions={[10]}
            sx={{ borderTop: "1px solid", borderColor: "divider" }}
          />
          <PatientDetails
            patient={selectedPatient}
            open={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
          <Fallbacks
            severity="evaluation"
            title="No Patients Found"
            description="Patients assigned to you will appear here."
          />
        </Box>
      )}
    </>
  );
}