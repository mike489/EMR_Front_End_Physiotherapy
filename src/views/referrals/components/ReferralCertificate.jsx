
import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const ReferralCertificate = React.forwardRef(({ referral }, ref) => {
  if (!referral) return null;

  const renderHTML = (html) => ({ __html: html || "N/A" });

  return (
    <>
      {/* Print CSS */}
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 0; }
          body, html { margin: 0; padding: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-html p { margin: 6px 0; line-height: 1.5; }
          .print-html ul, .print-html ol { margin: 6px 0 6px 20px; padding-left: 0; }
        }
      `}</style>

      <Box
        ref={ref}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          p: "20mm",
          fontFamily: '"Georgia", "Times New Roman", serif',
          backgroundColor: "#fff",
          color: "#000",
          position: "relative",
          overflow: "hidden",
          "@media print": { p: "15mm" },
        }}
      >
       
        {/* Header */}
        <Box textAlign="center" mb={4} position="relative" zIndex={1}>
          <Typography
            variant="h3"
            fontWeight="bold"
            letterSpacing="1.5px"
            color="primary.main"
            gutterBottom
          >
            REFERRAL LETTER
          </Typography>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Issued by Authorized Medical Practitioner
          </Typography>
          <Box
            sx={{
              height: 3,
              width: "100px",
              backgroundColor: "primary.main",
              mx: "auto",
              mt: 2,
            }}
          />
        </Box>

        {/* Referral Info */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={6}>
            <Typography fontWeight="bold" color="primary" variant="subtitle2">
              Referral ID
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {/* {referral.id || "N/A"} */}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold" color="primary" variant="subtitle2">
              Status
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={referral.status === "sent" ? "success.main" : "warning.main"}
              textTransform="uppercase"
            >
              {referral.status || "N/A"}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: "1px solid #ddd", mb: 3 }} />

        {/* Patient Info */}
        <Box mb={3}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Patient Information
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Full Name", value: referral.patient?.full_name },
              { label: "EMR Number", value: referral.patient?.emr_number },
              { label: "Age", value: referral.patient?.age },
              { label: "Gender", value: referral.patient?.gender },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography fontWeight="bold" color="text.secondary" minWidth="110px">
                    {item.label}:
                  </Typography>
                  <Typography>{item.value || "N/A"}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ borderBottom: "1px solid #ddd", my: 3 }} />

        {/* Referral Details */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Referral Details
          </Typography>
          <Box sx={{ pl: 1 }}>
            {[
              { title: "From", content: referral.from?.name || "N/A" },
              { title: "To", content: referral.to?.name || referral.sent_to || "N/A" },
              { title: "Direction", content: referral.direction || "N/A" },
              { title: "Reason", content: referral.reason },
            ].map((section, i) => (
              <Box key={i} mb={3}>
                <Typography fontWeight="bold" color="text.secondary" gutterBottom>
                  {section.title}:
                </Typography>
                <Box
                  className="print-html"
                  sx={{ pl: 2 }}
                  dangerouslySetInnerHTML={renderHTML(section.content)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderBottom: "1px solid #ddd", my: 4 }} />

        {/* Medical Details */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Medical Details
          </Typography>
          <Box sx={{ pl: 1 }}>
            {[
              { title: "History / Exam", content: referral.history_exam },
              { title: "Physiotherapy Diagnosis", content: referral.physiotherapy_diagnosis },
              { title: "Medical Diagnosis", content: referral.medical_diagnosis },
              { title: "Treatment Given", content: referral.treatment_given },
            ].map((section, i) => (
              <Box key={i} mb={3}>
                <Typography fontWeight="bold" color="text.secondary" gutterBottom>
                  {section.title}:
                </Typography>
                <Box
                  className="print-html"
                  sx={{ pl: 2 }}
                  dangerouslySetInnerHTML={renderHTML(section.content)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderBottom: "1px solid #ddd", my: 4 }} />

        {/* Signature */}
        <Grid container alignItems="flex-end" spacing={4}>
          <Grid item xs={6}>
            <Typography fontWeight="bold" color="text.secondary">
              Date of Issue
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography fontWeight="bold" color="text.secondary" gutterBottom>
              Doctor's Signature
            </Typography>
            <Box
              sx={{
                borderTop: "2px solid #000",
                width: "200px",
                ml: "auto",
                height: "55px",
                mb: 1,
              }}
            />
            <Typography fontStyle="italic" color="text.secondary" fontSize="0.9rem">
              Authorized Medical Practitioner
            </Typography>
            <Typography fontSize="0.8rem" color="gray">
              License No: MP-XXXXXX
            </Typography>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box textAlign="center" mt={5} pt={2} borderTop="1px dashed #aaa">
          <Typography fontSize="0.7rem" color="gray" fontStyle="italic">
            System-generated referral • No signature required
          </Typography>
        </Box>
      </Box>
    </>
  );
});

ReferralCertificate.displayName = "ReferralCertificate";

export default ReferralCertificate;