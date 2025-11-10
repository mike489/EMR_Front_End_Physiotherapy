
import React, { useRef, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
} from "@mui/icons-material";
import hasPermission from "utils/auth/hasPermission";
import Fallbacks from "utils/components/Fallbacks";
import PrintableCertificate from "./PrintableCertificate";

// PDF tools
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MedicalCertificatesTable = ({
  certificates,
  onEdit,
  onDelete,
  onView,
}) => {
  // One ref per certificate
  const printRefs = useRef({});

  // Track which row is downloading
  const [downloadingId, setDownloadingId] = React.useState(null);


  const downloadPDF = async (cert) => {
    const id = cert.id;
    setDownloadingId(id);

    const element = printRefs.current[id];
    if (!element) {
      console.error("No printable element for ID:", id);
      setDownloadingId(null);
      return;
    }

    try {
      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // A4 width
      const pdfHeight = 297; // A4 height
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let y = 0;
      pdf.addImage(imgData, "PNG", 0, y, pdfWidth, imgHeight);
      y -= pdfHeight;

      while (y >= -imgHeight) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, y, pdfWidth, imgHeight);
        y -= pdfHeight;
      }

      const filename = `Medical_Certificate_${cert.certificate_number || id}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF failed:", err);
      alert("Failed to generate PDF. Check console.");
    } finally {
      setDownloadingId(null);
    }
  };



 
  return (
    <Box sx={{ p: 3 }}>
      {/* Hidden printable copies */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {certificates.map((cert) => (
          <div
            key={`print-${cert.id}`}
            ref={(el) => {
              if (el) printRefs.current[cert.id] = el;
            }}
          >
            <PrintableCertificate certificate={cert} />
          </div>
        ))}
      </div>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 0, border: "1px solid #ddd" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Diagnosis</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date of Examination</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <TableRow key={cert.id} hover>
                  <TableCell>{cert.patient?.full_name }</TableCell>
                  <TableCell>{cert.diagnosis}</TableCell>
                  <TableCell>{cert.date_of_examination}</TableCell>
                  <TableCell>{cert.status}</TableCell>

                  <TableCell align="center">
                    {/* View */}
                    {hasPermission("read_medical_certificate") && (
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => onView(cert)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Download PDF */}
                    {hasPermission("read_medical_certificate") && (
                      <Tooltip title="Download PDF">
                        <IconButton
                          color="success.main"
                          onClick={() => downloadPDF(cert)}
                          disabled={downloadingId === cert.id}
                        >
                          {downloadingId === cert.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Print />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}

                    
                    {/* Edit */}
                    {hasPermission("update_medical_certificate") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(cert)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Delete */}
                    {hasPermission("delete_medical_certificate") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(cert.id)}>
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
                  <Fallbacks
                    severity="evaluation"
                    title="No Certificates Found"
                    description="Certificates will appear here once available."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MedicalCertificatesTable;