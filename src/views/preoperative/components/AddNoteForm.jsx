import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NOTE_TYPES = [
  { value: "note", label: "Note" },
  { value: "summary", label: "Summary" },
  { value: "comment", label: "Comment" },
  { value: "memo", label: "Memo" },
];

export default function AddNoteForm({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading,
  patients = [], 
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Note</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={2}>
          {/* Patient Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Patient</InputLabel>
              <Select
                value={formData.patient_id || ""}
                label="Patient"
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                disabled={loading}
              >
                {patients.length === 0 ? (
                  <MenuItem disabled>No patients found</MenuItem>
                ) : (
                  patients.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.full_name} 
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Rich Text Editor */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Content
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Start writing..."
              readOnly={loading}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"],
                ],
              }}
              style={{ height: "200px", marginBottom: "60px" }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={
            loading ||
            !formData.patient_id ||
            !formData.content.replace(/<[^>]*>/g, "").trim()
          }
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
