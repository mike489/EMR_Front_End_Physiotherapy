
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close, Print, Download } from "@mui/icons-material";
import ReferralCertificate from "./ReferralCertificate";

const RenderHTML = ({ html }) => (
  <Box
    sx={{
      pl: 2,
      py: 0.5,
      bgcolor: "#fafafa",
      borderRadius: 1,
      border: "1px solid #eee",
      "& p": { margin: "4px 0" },
      "& ul, & ol": { margin: "4px 0 4px 20px", paddingLeft: 0 },
    }}
    dangerouslySetInnerHTML={{ __html: html || "<p>N/A</p>" }}
  />
);

const ReferralDetailsDialog = ({
  open,
  onClose,
  referral,
  printRef,
  onDownloadPDF,
  onPrint,
  downloading,
}) => {
  if (!referral) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {/* ---------- Title ---------- */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: 24,
          textAlign: "center",
          borderBottom: "1px solid #ddd",
          pb: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Referral Details
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* ---------- Content (Preview) ---------- */}
      <DialogContent dividers sx={{ py: 4, bgcolor: "#f9f9f9" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Patient Info */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                  Patient Information
                </Typography>
                <Typography><strong>Name:</strong> {referral.patient?.full_name || "N/A"}</Typography>
                <Typography><strong>EMR Number:</strong> {referral.patient?.emr_number || "N/A"}</Typography>
                <Typography><strong>Age:</strong> {referral.patient?.age || "N/A"}</Typography>
                <Typography><strong>Gender:</strong> {referral.patient?.gender || "N/A"}</Typography>
              </Box>
            </Grid>

            {/* Referral Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                  Referral Information
                </Typography>
                <Typography><strong>Type:</strong> {referral.direction || "N/A"}</Typography>
                <Typography>
                  <strong>Status:</strong>{" "}
                  {referral.status
                    ? referral.status.charAt(0).toUpperCase() + referral.status.slice(1)
                    : "N/A"}
                </Typography>
                <Typography><strong>From:</strong> {referral.from?.name || "N/A"}</Typography>
                <Typography><strong>To:</strong> {referral.to?.name || referral.sent_to || "N/A"}</Typography>
                <Typography><strong>Reason:</strong></Typography>
                <RenderHTML html={referral.reason} />
              </Box>
            </Grid>
          </Grid>

          {/* Medical Details */}
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
              Medical Details
            </Typography>

            <Box sx={{ display: "grid", gap: 2.5 }}>
              {[
                { label: "History / Exam", content: referral.history_exam },
                { label: "Physiotherapy Diagnosis", content: referral.physiotherapy_diagnosis },
                { label: "Medical Diagnosis", content: referral.medical_diagnosis },
                { label: "Treatment Given", content: referral.treatment_given },
              ].map((item, i) => (
                <Box key={i}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "text.secondary" }}>
                    {item.label}:
                  </Typography>
                  <RenderHTML html={item.content} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* ---------- Hidden Printable Version (A4) ---------- */}
      <div style={{ position: "absolute", left: "-9999px" }} ref={printRef}>
        <ReferralCertificate referral={referral} />
      </div>

      {/* ---------- Actions: PDF + Print + Close ---------- */}
      <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
          onClick={onDownloadPDF}
          disabled={downloading}
          color="secondary"
        >
          Download PDF
        </Button>

        <Button variant="contained" onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReferralDetailsDialog;