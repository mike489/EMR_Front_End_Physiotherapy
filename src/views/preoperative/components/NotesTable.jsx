import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { Visibility as VisibilityIcon, Close as CloseIcon } from "@mui/icons-material";

const TYPE_COLORS = {
  note: "primary",
  summary: "secondary",
  comment: "info",
  memo: "warning",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleString() : "—";

const truncateHtml = (html, maxLength = 100) => {
  const text = html.replace(/<[^>]*>/g, ""); // Strip HTML
  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
};

export default function NotesTable({ notes }) {
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  return (
    <>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                Patient
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                Preview
              </TableCell>
            
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                Created
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: "#374151" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow
                key={note.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
              >
                 <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {note.patient?.full_name || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {note.patient?.emr_number || ""}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {truncateHtml(note.content, 80)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(note.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={note.type}
                    size="small"
                    color={TYPE_COLORS[note.type] || "default"}
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="medium"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(note);
                    }}
                    sx={{
                    color: "primary.light",
                    //   color: "primary.contrastText",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        {selectedNote && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="div">
                  Note Details
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Author */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={selectedNote.author?.profile_photo_url}
                    alt={selectedNote.author?.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    {selectedNote.author?.name?.[0] || "A"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedNote.author?.name || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedNote.author?.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Note Type */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Type
                  </Typography>
                  <Chip
                    label={selectedNote.type}
                    color={TYPE_COLORS[selectedNote.type] || "default"}
                    size="small"
                    sx={{ textTransform: "capitalize", fontWeight: 600 }}
                  />
                </Box>

                {/* Patient */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Patient
                  </Typography>
                  <Typography variant="body1">
                    {selectedNote.patient?.full_name} ({selectedNote.patient?.emr_number})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DOB: {selectedNote.patient?.date_of_birth?.split("T")[0] || "—"} |{" "}
                    Gender: {selectedNote.patient?.gender}
                  </Typography>
                </Box>

                {/* Visit */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Visit
                  </Typography>
                  <Typography variant="body1">
                    {selectedNote.visit?.visit_type} on{" "}
                    {selectedNote.visit?.visit_date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {selectedNote.visit?.status}
                  </Typography>
                </Box>

                {/* Content */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Content
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f9f9f9",
                      borderRadius: 2,
                      border: "1px solid #eee",
                      maxHeight: 300,
                      overflow: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                  />
                </Box>

                {/* Created At */}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created on {formatDate(selectedNote.created_at)}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}