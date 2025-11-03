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
  IconButton,
  Typography,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function NursesTable({
  nurses,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nurses.length > 0 ? (
            nurses.map((nurse) => (
              <TableRow key={nurse.id} hover>
                <TableCell>{nurse.name}</TableCell>
                <TableCell>{nurse.email}</TableCell>
                <TableCell>{nurse.phone}</TableCell>
                <TableCell>{nurse.username}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(nurse)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(nurse.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary">No nurses found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
