import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Print, MoreVert, Edit } from "@mui/icons-material";
import logo from 'assets/images/logo-vcc.png'; // Adjust path as needed
import PropTypes from 'prop-types';

const MedicinesTable = ({ data, visit, onEdit }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const open = Boolean(anchorEl);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, medicine) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedicine(medicine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMedicine(null);
  };

  const handlePrint = (medicine) => {
    const logoUrl = logo;
    const clinicName = 'Vision Care Clinic';
    const clinicAddress = 'Addiss Ababa, Ethiopia';
    const printContent = `
      <html>
        <head>
          <title>Medicine Prescription</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #f5f7fa;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 30px;
              background: #ffffff;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .header {
              text-align: center;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 25px;
              padding: 15px 20px;
              border-bottom: 2px solid #000000;
              background: linear-gradient(90deg, #1976d2, #42a5f5);
              border-radius: 8px 8px 0 0;
              color: #fff;
            }
            .header .logo img {
              max-width: 120px;
              height: auto;
              margin: 10px 0;
              padding: 5px;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .header .clinic-info h1 {
              color: #000;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .header .clinic-info p {
              color: #000;
              margin: 5px 0;
              font-size: 14px;
              font-weight: 500;
              opacity: 0.9;
            }
            .patient-info, .medicine-details {
              margin: 15px 0;
              padding: 20px;
              background: #f9fbfd;
              border: 1px solid #e0e7ff;
              border-radius: 6px;
            }
            .detail {
              margin: 8px 0;
              line-height: 1.5;
            }
            .detail label {
              font-weight: 500;
              display: inline-block;
              width: 160px;
              color: #424242;
            }
            .description {
              padding: 15px;
              background: #fff;
              font-style: italic;
              color: #666;
            }
            .footer {
              margin-top: 25px;
              padding-top: 15px;
              text-align: center;
              color: #757575;
              font-size: 13px;
              border-top: 1px solid #e0e0e0;
              border-radius: 0 0 8px 8px;
            }
            .signature-line {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed #bbb;
            }
            .signature-line .detail label {
              width: 100px;
            }
            .signature-line .detail input[type="text"] {
              border: none;
              background: transparent;
              width: 200px;
              text-align: center;
              font-size: 14px;
            }
            @media print {
              .container { box-shadow: none; border: none; }
              .header img { max-width: 100px; }
              .footer { position: fixed; bottom: 10px; width: 100%; }
              .signature-line input[type="text"] { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="${logoUrl}" alt="Clinic Logo" />
              </div>
              <div class="clinic-info">
                  <h1>${clinicName}</h1>
                  <p>${clinicAddress}</p>
              </div>
            </div>
            <div class="patient-info">
              <h2 style="color: #000000; font-size: 20px; font-weight: 500;">Patient Information</h2>
              <div class="detail"><label>Patient Name:</label> ${visit.patient_name}</div>
              <div class="detail"><label>EMR Number:</label> ${visit.emr_number}</div>
              <div class="detail"><label>Created At:</label> ${new Date(medicine.created_at).toLocaleString()}</div>
            </div>
            <div class="medicine-details">
              <h2 style="color: #000000; font-size: 20px; font-weight: 500;">Medicine Details</h2>
              <div class="detail"><label>Quantity:</label> ${medicine.quantity}</div>
              <div class="detail"><label>Frequency:</label> ${medicine.frequency}</div>
              <div class="detail"><label>Note:</label> ${medicine.note || '-'}</div>
            </div>
            <div class="footer">
              Prescribed on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', hour12: true })} EAT, September 24, 2025 | ${visit.emr_number} - ${visit.patient_name}
              <div class="signature-line">
                <div class="detail">
                  <label>Doctor:</label>
                  <input type="text" value="${visit.current_assigned_doctor || ''}" readonly>
                </div>
                <div class="detail">
                  <label>Signature:</label>
                  <input type="text" placeholder="___________________________" readonly>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const medicines = data?.data || [];

  if (!medicines.length) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          No medicines available
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", border: "1px solid #ddd" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Quantity</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.quantity}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: med.note || "-" }}
                  />
                  <TableCell>
                    {new Date(med.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                   <IconButton
                    onClick={() => onEdit(med)}  // ← call parent handler
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <Tooltip title="Edit Medicine">
                      <Edit fontSize="small" />
                    </Tooltip>
                  </IconButton>



                      <IconButton
                        onClick={() => handlePrint(med)}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <Tooltip title="Print Order">
                          <ListItemIcon><Print fontSize="small" /></ListItemIcon>
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={medicines.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />


    </Paper>
  );
};

MedicinesTable.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        frequency: PropTypes.string,
        note: PropTypes.string,
        created_at: PropTypes.string,
      })
    ),
  }).isRequired,
  visit: PropTypes.shape({
    visit_id: PropTypes.string,
    patient_id: PropTypes.string,
    emr_number: PropTypes.string,
    patient_name: PropTypes.string,
    current_assigned_doctor: PropTypes.string,
  }).isRequired,
};

export default MedicinesTable;