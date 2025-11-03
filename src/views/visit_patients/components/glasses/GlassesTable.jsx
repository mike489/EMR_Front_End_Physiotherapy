import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  TablePagination,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Edit, Print, MoreVert } from '@mui/icons-material';
import PropTypes from 'prop-types';
import logo from 'assets/images/logo-vcc.png'; // Corrected import

const GlassesTable = ({ glassesOrders, onEdit, onDelete, visit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const open = Boolean(anchorEl);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Slice data for current page
  const paginatedOrders = glassesOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const handlePrint = (order) => {
    const logoUrl = logo;
    const clinicName = 'Vision Care Clinic';
    const clinicAddress = 'Addiss Ababa, Ethiopia';
    const printContent = `
      <html>
        <head>
          <title>Glasses Prescription</title>
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
            .patient-info, .order-details {
              margin: 15px 0;
              padding: 20px;
              background: #f9fbfd;
              border: 1px solid #e0e7ff;
              border-radius: 6px;
              // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
            .color-swatch {
              display: inline-block;
              width: 20px;
              height: 20px;
              border-radius: 4px;
              vertical-align: middle;
              margin-right: 8px;
              border: 1px solid #ccc;
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
              // border-bottom: 1px solid #bbb;
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
              <div class="detail"><label>Created At:</label> ${new Date(order.created_at).toLocaleString()}</div>
            </div>
            <div class="order-details">
              <h2 style="color: #000000; font-size: 20px; font-weight: 500;">Order Details</h2>
              <div class="detail"><label>Lens Type:</label> ${order.other_lens_type || order.lens_type || 'None'}</div>
              <div class="detail"><label>Lens Material:</label> ${order.lens_material || 'None'}</div>
              <div class="detail"><label>Size:</label> ${order.size || '-'}</div>
              <div class="detail"><label>Color:</label> <span class="color-swatch" style="background-color: ${order.color || '#000000'}"></span></div>
              <div class="detail"><label>Frame Description:</label> ${order.frame_description || '-'}</div>
              <div class="detail"><label>Description:</label> ${order.description || '-'}</div>
            </div>
            <div class="footer">
              Ordered on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', hour12: true })} EAT, September 23, 2025 | ${visit.emr_number} - ${visit.patient_name}
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

  return (
    <TableContainer component={Box} sx={{ mt: 4, border: '1px solid #ddd', borderBottom: 'none', borderRadius: 1 }} >
   
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><Typography variant="subtitle2">Size</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Color</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Frame Description</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Description</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Created At</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No glasses orders found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f1f5f9' } }}>
                  <TableCell>{order.size}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: order.color || '#000',
                        width: 24,
                        height: 24,
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        mr: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>{order.frame_description || '-'}</TableCell>
                  <TableCell>{order.description.replace(/<[^>]+>/g, '') || '-'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => onEdit(order)} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <Tooltip title="Edit Order">
                          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                        </Tooltip>
                      </IconButton>
                      <IconButton onClick={() => handlePrint(order)} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <Tooltip title="Print Order">
                          <ListItemIcon><Print fontSize="small" /></ListItemIcon>
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={glassesOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </TableContainer>

  
  );
};

GlassesTable.propTypes = {
  glassesOrders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      lens_type_id: PropTypes.string,
      other_lens_type: PropTypes.string,
      lens_material_id: PropTypes.string,
      other_lens_material: PropTypes.string,
      frame: PropTypes.string,
      size: PropTypes.string,
      color: PropTypes.string,
      frame_description: PropTypes.string,
      description: PropTypes.string,
      created_at: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  visit: PropTypes.shape({
    visit_id: PropTypes.string,
    patient_id: PropTypes.string,
    emr_number: PropTypes.string,
    patient_name: PropTypes.string,
  }).isRequired,
};

export default GlassesTable;