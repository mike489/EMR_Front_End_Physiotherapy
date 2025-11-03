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

export default function MyReferredOutTable({ referrals, onView }) {
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
                <TableCell>{ref.patient_name || "—"}</TableCell>
                <TableCell>{ref.referred_to || "—"}</TableCell>
                <TableCell>{ref.reason || "—"}</TableCell>
                <TableCell>{ref.status || "—"}</TableCell>
                <TableCell>
                  {ref.created_at
                    ? new Date(ref.created_at).toLocaleDateString()
                    : "—"}
                </TableCell>
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
