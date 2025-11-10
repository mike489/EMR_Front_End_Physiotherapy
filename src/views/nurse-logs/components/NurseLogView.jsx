import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

const NurseLogView = ({ open, onClose, log }) => {
  if (!log) return null;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Nurse Log Details</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* Patient & Visit Info */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Patient & Visit Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Patient:</strong> {log.patient?.full_name || "N/A"}</Typography>
              <Typography><strong>Age:</strong> {log.patient?.age || "N/A"}</Typography>
              <Typography><strong>Gender:</strong> {log.patient?.gender || "N/A"}</Typography>
              <Typography><strong>EMR Number:</strong> {log.patient?.emr_number || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Visit Type:</strong> {log.visit?.visit_type || "N/A"}</Typography>
              <Typography><strong>Visit Date:</strong> {log.visit?.visit_date || "N/A"}</Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                <Chip
                  label={log.visit?.status || "N/A"}
                  color={log.visit?.status === "Finished" ? "success" : "warning"}
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Log Summary */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Log Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Note Type:</strong> {log.note_type}</Typography>
              <Typography>
                <strong>Requires Follow-up:</strong>{" "}
                <Chip
                  label={log.requires_follow_up ? "Yes" : "No"}
                  color={log.requires_follow_up ? "primary" : "default"}
                  size="small"
                />
              </Typography>
              {log.requires_follow_up && (
                <Typography><strong>Follow-up At:</strong> {formatDate(log.follow_up_at)}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Created At:</strong> {formatDate(log.created_at)}</Typography>
              <Typography><strong>Last Updated:</strong> {formatDate(log.updated_at)}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Rich Text Sections */}
        {["subjective", "objective", "assessment", "plan", "intervention", "evaluation"].map((field) => (
          <Paper key={field} sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              component="div"
              dangerouslySetInnerHTML={{ __html: log[field] || "<p>N/A</p>" }}
            />
          </Paper>
        ))}

        {/* Supervisor Info */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Supervisor
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={log.supervisor?.profile_photo_url}
                alt={log.supervisor?.name}
                sx={{ width: 60, height: 60 }}
              />
            </Grid>
            <Grid item xs>
              <Typography><strong>Name:</strong> {log.supervisor?.name || "N/A"}</Typography>
              <Typography><strong>Email:</strong> {log.supervisor?.email || "N/A"}</Typography>
              <Typography><strong>Phone:</strong> {log.supervisor?.phone || "N/A"}</Typography>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Typography variant="subtitle1"><strong>Supervisor Comment:</strong></Typography>
            <Typography
              component="div"
              dangerouslySetInnerHTML={{ __html: log.supervisor_comment || "<p>N/A</p>" }}
            />
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default NurseLogView;
