// src/views/doctors/components/DoctorsTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
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
  onViewPatients,
}) {
  return (
    <>
      {/* Table */}
      <Paper
        sx={{
          borderRadius: 3,
          border: "1px solid #dddddd",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
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
                  <TableCell>{doctor.name }</TableCell>
                  <TableCell>{doctor.email }</TableCell>
                  <TableCell>{doctor.phone }</TableCell>
                  <TableCell>{doctor.username }</TableCell>
                  <TableCell>{doctor.speciality }</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color:
                          doctor.status === "Active" ? "green" : "red",
                        fontWeight: 500,
                      }}
                    >
                      {doctor.status }
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{ mr: 1, borderRadius: "50%" }}
                      onClick={() => onEdit(doctor)}
                    >
                      <Edit fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      sx={{ mr: 1, borderRadius: "50%" }}
                      onClick={() => onDelete(doctor.id)}
                    >
                      <Delete fontSize="small" />
                    </Button>
                    {/* <Tooltip title="View My Patients">
                      <Button
                        size="small"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => onViewPatients(doctor)}
                      >
                        Patients
                      </Button>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination - OUTSIDE Table */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.current_page || 1) - 1}
          onPageChange={(e, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={pagination.per_page || 10}
          rowsPerPageOptions={[10]}
          sx={{
            mt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />
      )}
    </>
  );
}