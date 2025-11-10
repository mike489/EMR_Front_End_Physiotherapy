
import React, { useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box
} from "@mui/material";
import { Close, Print, Download } from "@mui/icons-material";
import PrintableCertificate from "./PrintableCertificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MedicalCertificateView = ({ open, onClose, certificate }) => {
  const printRef = useRef();

  // PDF Download
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Medical_Certificate_${certificate.certificate_number}.pdf`);
  };


  if (!certificate) return null;

  return (
    <>
      {/* Hidden for PDF & Print */}
      <div style={{ position: "absolute",  }}>
        <div ref={printRef}>
          <PrintableCertificate certificate={certificate} />
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Medical Certificate Details
          <IconButton onClick={onClose}><Close /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <PrintableCertificate certificate={certificate} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            color="secondary"
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicalCertificateView;