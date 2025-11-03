import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

import PatientInfoPaymentTab from './PatientInfoPayment';
import LaboratoryPaymentsTab from './LaboratoryPaymentsTab';
import RadiologyPaymentsTab from './RadiologyPaymentsTab';

const PaymentTabWrapper = ({ patient }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs header */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        // variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Profile Information" />
        <Tab label="Laboratory Payments" />
        <Tab label="Radiology Payments"/>
      </Tabs>

      {/* Tabs content */}
      {activeTab === 0 && (
        <Box sx={{ p: 2 }}>
          <PatientInfoPaymentTab patient={patient} />
        </Box>
      )}
      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          <LaboratoryPaymentsTab visit={patient} />
        </Box>
      )}
      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <RadiologyPaymentsTab visit={patient} />
        </Box>
      )}
    </Box>
  );
};

export default PaymentTabWrapper;
