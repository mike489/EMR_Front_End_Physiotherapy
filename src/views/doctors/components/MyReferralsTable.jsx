// MyReferralsTable.jsx
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusChip = (status) => {
  const config = {
    pending: { color: "warning", icon: <AccessTimeIcon fontSize="small" /> },
    accepted: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
    rejected: { color: "error", icon: <CancelIcon fontSize="small" /> },
    default: { color: "default", icon: null },
  };

  const { color, icon } =
    config[status?.toLowerCase()] || config.default;

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

export default function MyReferralsTable({ referrals, onView }) {
  if (!referrals?.length)
    return (
      <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        No referrals found.
      </Paper>
    );

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
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow
                key={referral.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.2s ease-in-out",
                }}
              >
                <TableCell>
                  <Box>
                    <strong>{referral.patient?.full_name }</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {referral.patient?.emr_number }
                    </small>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={referral.type}
                    size="small"
                    color={referral.type === "internal" ? "info" : "secondary"}
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>{getStatusChip(referral.status)}</TableCell>
                <TableCell>{formatDate(referral.created_at)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      color="primary"
                      onClick={() => onView(referral)}
                    >
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