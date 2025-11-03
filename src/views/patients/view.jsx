import React from 'react';
import PageContainer from 'ui-component/MainPage';
import { useLocation } from 'react-router-dom';
import { Card, Box } from '@mui/material';
import PatientTabs from './componenets/PatientTabs';

const ViewPatients = () => {
  const { state } = useLocation();
  const patient = state || {};
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <PageContainer back={true} title={patient.full_name || 'Patient Details'}>
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)',
        }}
      >
        {/* Tabs Section */}
        <Box sx={{ width: '100%', mt: 1 }}>
          <PatientTabs patient={patient} />
        </Box>
      </Card>
    </PageContainer>
  );
};

export default ViewPatients;
