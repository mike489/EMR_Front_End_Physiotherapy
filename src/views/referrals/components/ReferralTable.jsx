
import React, { useRef, useState } from "react";
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
import { Edit, Delete, Visibility, Print, Download } from "@mui/icons-material";
import hasPermission from "utils/auth/hasPermission";
import Fallbacks from "utils/components/Fallbacks";
import ReferralDetailsDialog from "./ReferralDetailsDialog";
import ReferralCertificate from "./ReferralCertificate";

// PDF Tools
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReferralTable = ({ referrals, onEdit, onDelete }) => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const printRefs = useRef({});
  const [downloadingId, setDownloadingId] = useState(null);

  const handleOpenView = (referral) => {
    setSelectedReferral(referral);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedReferral(null);
  };

  // PDF Download
  const downloadPDF = async (referral) => {
    const id = referral.id;
    setDownloadingId(id);
    const element = printRefs.current[id];
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Referral_${id}.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  // Print
  const handlePrint = (referral) => {
    const element = printRefs.current[referral.id];
    if (!element) return;
    const win = window.open("", "", "width=900,height=900");
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>Referral ${referral.id}</title>
        <style>@page { size: A4; margin: 0; } body { margin: 0; padding: 15mm; }</style>
      </head><body>${element.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print() && win.close(), 500);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Hidden printable versions */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        {referrals.map((r) => (
          <div
            key={`print-${r.id}`}
            ref={(el) => el && (printRefs.current[r.id] = el)}
          >
            <ReferralCertificate referral={r} />
          </div>
        ))}
      </div>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 0, border: "1px solid #ddd" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.length > 0 ? (
              referrals.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.patient?.full_name || "N/A"}</TableCell>
                  <TableCell>{r.from?.name || "N/A"}</TableCell>
                  <TableCell align="center">
                    {hasPermission("read_referral") && (
                      <Tooltip title="View">
                        <IconButton color="info" onClick={() => handleOpenView(r)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("read_referral") && (
                      <Tooltip title="Download PDF">
                        <IconButton
                          color="success.main"
                          onClick={() => downloadPDF(r)}
                          disabled={downloadingId === r.id}
                        >
                          {downloadingId === r.id ? <CircularProgress size={20} /> : <Print />}
                        </IconButton>
                      </Tooltip>
                    )}
                   
                    {hasPermission("update_referral") && (
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit(r)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission("delete_referral") && (
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(r.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Fallbacks
                    severity="evaluation"
                    title="No Referral Found"
                    description="Referrals will appear here once available."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <ReferralDetailsDialog
        open={openViewDialog}
        onClose={handleCloseView}
        referral={selectedReferral}
        printRef={printRefs.current[selectedReferral?.id]}
        onDownloadPDF={() => downloadPDF(selectedReferral)}
        onPrint={() => handlePrint(selectedReferral)}
        downloading={downloadingId === selectedReferral?.id}
      />
    </Box>
  );
};

export default ReferralTable;