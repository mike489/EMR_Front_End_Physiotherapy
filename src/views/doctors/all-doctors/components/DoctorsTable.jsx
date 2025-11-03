import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Typography,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

export default function DoctorsTable({
  doctors,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onViewPatients, // 🔹 new prop
}) {
  return (
    <TableContainer component={Paper}>
      <Table component={Paper} sx={{ borderRadius: 3, border: "1px solid #dddddd" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Specialty</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <TableRow key={doctor.id} hover>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.username}</TableCell>
                <TableCell>{doctor.speciality || "—"}</TableCell>
                <TableCell>{doctor.status || "—"}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ mr: 1, borderRadius: "50%" }}
                    onClick={() => onEdit(doctor)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    sx={{ mr: 1, borderRadius: "50%" }}
                    onClick={() => onDelete(doctor.id)}
                  >
                    <Delete />
                  </Button>
                  <Tooltip title="View My Patients">
                  <Button
                    size="small"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                    startIcon={<Visibility />}
                    onClick={() => onViewPatients(doctor)}
                  />

                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary">No doctors found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.current_page || 1) - 1}
          rowsPerPage={pagination.per_page || 10}
          onPageChange={(e, newPage) => onPageChange(newPage + 1)}
          rowsPerPageOptions={[10]}
        />
      )}
    </TableContainer>
  );
}
