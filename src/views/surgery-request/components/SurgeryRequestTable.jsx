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
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import hasPermission from "utils/auth/hasPermission";
import { useNavigate } from "react-router-dom";

// Use this helper to safely get nested values
const safe = (fn, fallback = "") => {
  try {
    const result = fn();
    return result ?? fallback;
  } catch {
    return fallback;
  }
};

const SurgeryRequestTable = ({ requests, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView = (req) => {
    navigate(`/surgery-request/view/`, { state: req });
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 0, border: "1px solid #dddddd" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Patient
              </TableCell>
              {/* <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Doctor
              </TableCell> */}
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Notes
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Created At
              </TableCell>
              <TableCell
                sx={{ color: "black", fontWeight: "bold" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests && requests.length > 0 ? (
              requests.map((req) => (
                <TableRow key={req.id} hover>
                  {/* Patient Name */}
                  <TableCell>
                    {safe(() => req.visit.patient.full_name, "Unknown Patient")}
                  </TableCell>

                  {/* Doctor ID (replace with doctor.user.name if available later) */}
                  {/* <TableCell>
                    {safe(() => req.doctor.id, "No Doctor")}
                  </TableCell> */}

                  {/* Notes (HTML displayed safely) */}
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: req.notes || "<em>No notes</em>",
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        color:
                          req.status === "pending"
                            ? "orange"
                            : req.status === "approved"
                            ? "green"
                            : "gray",
                      }}
                    >
                      {req.status}
                    </Typography>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell>
                    {new Date(req.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton color="info" onClick={() => handleView(req)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {hasPermission("update_surgery_request") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(req)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {hasPermission("delete_surgery_request") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(req.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No surgery requests available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SurgeryRequestTable;
 