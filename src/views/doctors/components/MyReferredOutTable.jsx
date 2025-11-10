// MyReferredOutTable.jsx
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
    pending: { color: "warning", icon: <AccessTimeIcon fontSize="small" /> },
    accepted: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
    rejected: { color: "error", icon: <CancelIcon fontSize="small" /> },
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

export default function MyReferredOutTable({ referrals, onView }) {
  if (!referrals?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        No referred-out cases.
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
              <TableCell sx={{ fontWeight: 600 }}>Referred To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((ref) => (
              <TableRow
                key={ref.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.2s ease-in-out",
                }}
              >
                <TableCell>
                  <Box>
                    <strong>{ref.patient?.full_name }</strong>
                    <br />
                    <small style={{ color: "#666" }}>{ref.patient?.emr_number }</small>
                  </Box>
                </TableCell>
                <TableCell>
                  {ref.type === "internal" && ref.to_doctor ? (
                    <Box>
                      <strong>{ref.to_doctor.user?.name}</strong>
                      <br />
                      <small>{ref.to_doctor.user?.email}</small>
                    </Box>
                  ) : (
                    ref.sent_to 
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={ref.reason }>
                    <span
                      style={{
                        display: "block",
                        maxWidth: 180,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {ref.reason }
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>{getStatusChip(ref.status)}</TableCell>
                <TableCell>{formatDate(ref.created_at)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton color="primary" onClick={() => onView(ref)}>
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