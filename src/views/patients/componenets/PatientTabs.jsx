import React from 'react';
import { Box } from '@mui/material';
import { AntTabs, AntTab, tabData } from './antTabs';
import TabPanel from 'ui-component/tabs/TabPanel';
import ComplaintTab from './ComplaintTab';
import OcularHistoryTab from './OcularHistoryTab';
import { useTheme } from '@emotion/react';
import { a11yProps } from 'utils/function';
import PatientInformationTab from './PatientInformation';
import PaymentList from './PaymentList';
import PatientVisits from './PatientVisits';
// import MedicalHistoryTab from './MedicalHistoryTab';

const PatientTabs = ({ patient }) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabComponents = {
    PatientInformationTab: <PatientInformationTab patient={patient} />,
    PaymentList: <PaymentList patient={patient} />,
    PatientVisits: <PatientVisits patient={patient} />,
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <AntTabs
        value={value}
        onChange={handleChange}
        aria-label="Patient medical tabs"
        theme={theme}
      >
        {tabData.map((tab, index) => (
          <AntTab
            key={index}
            label={tab.label}
            // icon={<tab.icon />}
            iconPosition="start"
            {...a11yProps(index)}
            color="text.primary"
          />
        ))}
      </AntTabs>

      {tabData.map((tab, index) => (
        <TabPanel key={index} value={value} index={index} dir={theme.direction}>
          {tabComponents[tab.component]}
        </TabPanel>
      ))}
    </Box>
  );
};

export default PatientTabs;
