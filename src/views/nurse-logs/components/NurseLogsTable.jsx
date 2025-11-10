
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
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import hasPermission from "utils/auth/hasPermission";
import Fallbacks from "utils/components/Fallbacks";

const NurseLogsTable = ({ logs, onEdit, onDelete, onView }) => {
  return (
    <Box sx={{ p: 3 }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 0, border: "1px solid #dddddd" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Patient</strong></TableCell>
              <TableCell><strong>Supervisor</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.patient?.full_name || "N/A"}</TableCell>
                  <TableCell>{log.supervisor?.name || log.visit_id || "N/A"}</TableCell>
                  <TableCell>{log.note_type}</TableCell>
                  <TableCell>{log.requires_follow_up ? "Requires Follow-up" : "Completed"}</TableCell>
                  <TableCell align="center">
                    {hasPermission("read_nurse_log") && (
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => onView(log)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("update_nurse_log") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(log)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("delete_nurse_log") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(log.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 4 }}>
                    <Fallbacks
                      severity="evaluation"
                      title="No Nurse Logs Found"
                      description="Nurse logs will appear here once available."
                    />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NurseLogsTable;
