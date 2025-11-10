// src/views/specialties/components/SpecialtiesTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Fallbacks from "utils/components/Fallbacks";


export default function SpecialtiesTable({ specialties, onEdit, onDelete }) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #ddd" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialties.length > 0 ? (
            specialties.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  {s.parent ? (
                    <Chip label={s.parent.name} size="small" color="info" />
                  ) : (
                    <Chip label="Root" size="small" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(s)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(s.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <Fallbacks
                          severity="evaluation"
                          title="No Referral Found"
                          description="Referrals will appear here once available."
                        />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}