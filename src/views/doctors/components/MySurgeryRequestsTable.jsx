import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function MySurgeryRequestsTable({ requests, onView }) {
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Surgery Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Requested By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scheduled Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.map((req) => (
              <TableRow
                key={req.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.2s ease-in-out",
                }}
              >
                <TableCell>{req.patient_name || "—"}</TableCell>
                <TableCell>{req.surgery_type || "—"}</TableCell>
                <TableCell>{req.requested_by || "—"}</TableCell>
                <TableCell>{req.status || "—"}</TableCell>
                <TableCell>
                  {req.scheduled_date
                    ? new Date(req.scheduled_date).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton color="primary" onClick={() => onView(req)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
