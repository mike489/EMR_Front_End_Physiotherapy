import React from 'react';
import { Box } from '@mui/material';
import TabPanel from 'ui-component/tabs/TabPanel';
import { useTheme } from '@emotion/react';
import { a11yProps } from 'utils/function';
import { AntTab, AntTabs, tabPaymentData } from './antPaymentTabs';
import PatientInfoPaymentTab from './PatientInfoPayment';
import LaboratoryPaymentsTab from './LaboratoryPaymentsTab';

const PatientPaymentTabs = ({ patient }) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabComponents = {
    PatientInformationTab: <PatientInfoPaymentTab patient={patient} />,
    LaboratoryPaymentsTab: <LaboratoryPaymentsTab patient={patient} />,
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <AntTabs
        value={value}
        onChange={handleChange}
        aria-label="Patient medical tabs"
        theme={theme}
      >
        {tabPaymentData.map((tab, index) => (
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

      {tabPaymentData.map((tab, index) => (
        <TabPanel key={index} value={value} index={index} dir={theme.direction}>
          {tabComponents[tab.component]}
        </TabPanel>
      ))}
    </Box>
  );
};

export default PatientPaymentTabs;
