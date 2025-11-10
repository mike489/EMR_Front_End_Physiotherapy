import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Fallbacks from "utils/components/Fallbacks";
import hasPermission from "utils/auth/hasPermission";

export default function MedicalCentersTable({ centers, onEdit, onDelete }) {
  if (!centers.length)
    return (
      <Box sx={{ mt: 4 }}>
        <Fallbacks
          severity="info"
          title="No Medical Centers Found"
          description="Add a new medical center to get started."
        />
      </Box>
    );

  return (
    <Table sx={{borderRadius:10, border: "1px solid #ddd"}}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Code</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {centers.map((center) => (
          <TableRow key={center.id}>
            <TableCell>{center.name}</TableCell>
            <TableCell>
              {center.type
                ? center.type.charAt(0).toUpperCase() + center.type.slice(1)
                : "N/A"}
            </TableCell>
            <TableCell>{center.code}</TableCell>
            <TableCell>{center.email}</TableCell>
            <TableCell>{center.phone}</TableCell>
            <TableCell>{center.address}</TableCell>

            <TableCell>
              {/* Only show if user has edit or delete permissions */}
              {hasPermission("update_medical_center") && (
                <IconButton onClick={() => onEdit(center)} color="primary">
                  <Edit />
                </IconButton>
              )}

              {hasPermission("delete_medical_center") && (
                <IconButton
                  color="error"
                  onClick={() => onDelete(center.id)}
                >
                  <Delete />
                </IconButton>
              )}

              {/* If user has no permissions, show subtle info */}
              {!hasPermission("update_medical_center") &&
                !hasPermission("delete_medical_center") && (
                  <Box sx={{ color: "text.secondary", fontSize: 12 }}>
                    {/* No actions available */}
                  </Box>
                )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
