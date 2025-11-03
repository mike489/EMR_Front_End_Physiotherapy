import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import PatientProfile from './PatientProfile';
import PatientTabs from './PatientTabs';
import OrderTab from './OrderTab';
import hasPermission from 'utils/auth/hasPermission';
import ResultTab from './Result/ResultTab';
import NextAppointmentTab from './NextAppointmentTab';
import AppointmentTab from './Appointment/AppointmentTab';
// import CarePlanTab from './CarePlanTab';
import FlowsheetTab from './FlowsheetTab';
import PhysiotherapyTab from './Physiotherapy/PhysiotherapyTab';

const PatientTabsWrapper = ({ patient }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Define your tab structure dynamically
  const wrapperTabs = [
    {
      label: 'Profile Information',
      component: <PatientProfile visit={patient} />,
      show: true,
    },
    {
      label: 'Ophthalmic Examination',
      component: <PatientTabs visit={patient} />,
      show:
        hasPermission('read_complaint') ||
        hasPermission('read_ocular_history') ||
        hasPermission('read_medical_history') ||
        hasPermission('read_visual_acuity') ||
        hasPermission('read_ocular_motility') ||
        hasPermission('read_intraocular_pressure') ||
        hasPermission('read_adnexa_examination') ||
        hasPermission('read_slit_lamp_examination') ||
        hasPermission('read_fundus_examination') ||
        hasPermission('read_initial_impression') ||
        hasPermission('create_next_visit_appointment') ||
        hasPermission('get_next_visit_appointment') ||
        hasPermission('read_care_plan') ||
        hasPermission('read_care_plan_goal') ||
        hasPermission('read_care_plan_intervention') ||
        hasPermission('read_care_plan_review'),
    },
    {
      label: 'Flowsheet',
      component: <FlowsheetTab visit={patient} />,
      show: true,
    },
    // {
    //   label: 'Orders',
    //   component: (
    //     <OrderTab
    //       visit={patient}
    //       goToResults={(type) => {
    //         if (type === 'lab') setActiveTab(4);
    //         else if (type === 'radiology') setActiveTab(4);
    //         else setActiveTab(2);
    //       }}
    //     />
    //   ),
    //   show: true,
    // },
    // {
    //   label: 'Results',
    //   component: <ResultTab visit={patient} />,
    //   show: true,
    // },
    {
      label: 'Next Visit Appointment',
      component: <AppointmentTab visit={patient} />,
      show: true,
    },
    // {
    //   label: 'Care Plan',
    //   component: <CarePlanTab visit={patient} />,
    //   show: true,
    // },
    {
      label: 'Physiotherapy',
      component: <PhysiotherapyTab visit={patient} />,
      show: true,
    },
  ].filter((tab) => tab.show);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs header */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        {wrapperTabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Tabs content */}
      {wrapperTabs.map(
        (tab, index) =>
          activeTab === index && (
            <Box key={index} sx={{ p: 2 }}>
              {tab.component}
            </Box>
          ),
      )}
    </Box>
  );
};

export default PatientTabsWrapper;
