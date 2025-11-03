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
import Fallbacks from 'utils/components/Fallbacks';

const WardTable = ({ wards, onEdit, onDelete }) => {
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
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Capacity</TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wards.length > 0 ? (
              wards.map((ward) => (
                <TableRow key={ward.id} hover>
                  <TableCell>{ward.name}</TableCell>
                  <TableCell>{ward.description}</TableCell>
                  <TableCell>{ward.capacity}</TableCell>
                  <TableCell align="center">
                    {hasPermission("update_ward") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(ward)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("delete_ward") && (
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
                 <Fallbacks
          severity="evaluation"
          title="No Ward Found"
          description="Wards will appear here once available."
          sx={{ paddingTop: 6 }}
        />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WardTable;
