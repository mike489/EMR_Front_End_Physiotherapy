import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import hasPermission from "utils/auth/hasPermission";

const SpecialtiesTable = ({ specialties, onEdit, onDelete }) => {
  return (
    <Box sx={{ p: 3 }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 0, border: "1px solid #dddddd" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.length > 0 ? (
              specialties.map((ward) => (
                <TableRow key={ward.id} hover>
                  <TableCell>{ward.name}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{ __html: ward.description }}
                      style={{ whiteSpace: 'normal' }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {hasPermission("update_speciality") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(ward)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("delete_speciality") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(ward.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">No   specialties available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SpecialtiesTable;
