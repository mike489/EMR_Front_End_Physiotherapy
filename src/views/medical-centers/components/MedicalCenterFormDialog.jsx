import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MedicalCenterForm from "./MedicalCenterForm";

export default function MedicalCenterFormDialog({ open, editMode, center, onClose, refreshList }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? "Edit Medical Center" : "Add Medical Center"}</DialogTitle>
      <DialogContent>
        <MedicalCenterForm
          editMode={editMode}
          center={center}
          onClose={onClose}
          refreshList={refreshList}
        />
      </DialogContent>
    </Dialog>
  );
}
