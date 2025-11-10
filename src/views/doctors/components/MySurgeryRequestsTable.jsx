// MySurgeryRequestsTable.jsx
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
  Chip,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const getStatusChip = (status) => {
  const config = {
    pending: { color: "warning" },
    accepted: { color: "success" },
    rejected: { color: "error" },
  };
  const { color, icon } = config[status?.toLowerCase()] || { color: "default", icon: null };

  return (
    <Chip
      icon={icon}
      label={status }
      size="small"
      color={color}
      sx={{ fontWeight: 600, minWidth: 90 }}
    />
  );
};

export default function MySurgeryRequestsTable({ requests, onView }) {
  if (!requests?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        No surgery requests found.
      </Paper>
    );
  }

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
              <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Visit Type</TableCell>
              {/* <TableCell sx={{ fontWeight: 600 }}>Requested By</TableCell> */}
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              {/* <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell> */}
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
                <TableCell>
                  <Box>
                    <strong>{req.visit?.patient?.full_name }</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {req.visit?.patient?.emr_number }
                    </small>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={req.surgery_type }>
                    <span
                      style={{
                        display: "block",
                        maxWidth: 150,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {req.visit.visit_type}
                    </span>
                  </Tooltip>
                </TableCell>
                {/* <TableCell>{req.requester?.name }</TableCell> */}
                <TableCell sx={{textTransform:'capitalize'}}>{getStatusChip(req.status)}</TableCell>
                {/* <TableCell>{formatDate(req.scheduled_date)}</TableCell> */}
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