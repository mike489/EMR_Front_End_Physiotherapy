import React from 'react';
import {
  Box,
  IconButton,
  useMediaQuery,
  Typography,
  Menu,
  MenuItem,
  Fade,
  Grow,
  useTheme,
} from '@mui/material';
import { AntTabs, AntTab, tabData } from './antTabs';
import TabPanel from 'ui-component/tabs/TabPanel';
import ComplaintTab from './Complaint/ComplaintTab';
import OcularHistoryTab from './OcularHistoryTab';
// import { useTheme } from '@emotion/react';
import { a11yProps } from 'utils/function';
import HistoryTab from './History/HistoryTab';
import VisualAcuityTab from './VisualAcuity/VisualAcuityTab';
import OcularMotility from './Ocular Motility/OcularMotility';
import IntraocularPressureTab from './IntraocularPressure/IntraocularPressureTab';
import AdnexaExaminationTab from './AdnexaExamination/AdnexaExaminationTab';
import SlitLampExaminationTab from './SlitLampExamination/SlitLampExaminationTab';
import MenuIcon from '@mui/icons-material/Menu';
import InitialImpressionsTab from './InitialImpressions/InitialImpressionsTab';
import FundusExaminationsTab from './FundusExaminations/FundusExaminationsTab';
import PatientProfile from './PatientProfile';

const PatientTabs = ({ visit }) => {
  const [value, setValue] = React.useState(0);
  const [prevValue, setPrevValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event, newValue) => {
    setPrevValue(value);
    setValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index) => {
    setPrevValue(value);
    setValue(index);
    handleMenuClose();
  };

  const tabComponents = {
    ComplaintTab: <ComplaintTab visit={visit} />,
    HistoryTab: <HistoryTab visit={visit} />,
    VisualAcuityTab: <VisualAcuityTab visit={visit} />,
    ocularMotilities: <OcularMotility visit={visit} />,
    IntraocularPressureTab: <IntraocularPressureTab visit={visit} />,
    AdnexaExaminationTab: <AdnexaExaminationTab visit={visit} />,
    SlitLampExaminationTab: <SlitLampExaminationTab visit={visit} />,
    InitialImpressionsTab: <InitialImpressionsTab visit={visit} />,
    FundusExaminationsTab: <FundusExaminationsTab visit={visit} />,
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      {/* Mobile View - Dropdown Menu */}
      {isMobile && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                mr: 1,
                color: 'primary.main',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                background:
                  value === prevValue
                    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                    : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                transition: 'all 0.5s ease',
                fontWeight: 'bold',
              }}
            >
              {tabData[value]?.label || 'Select Tab'}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: '70vh',
                width: '60vw',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
            TransitionComponent={Fade}
          >
            {tabData.map((tab, index) => (
              <MenuItem
                key={index}
                selected={index === value}
                onClick={() => handleMenuItemClick(index)}
                sx={{
                  minHeight: 'auto',
                  padding: '10px 16px',
                  margin: '4px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {tab.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      {/* Desktop View - Vertical Tabs */}
      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            minHeight: '70vh',
          }}
        >
          {/* Sidebar Tabs */}
          <AntTabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Patient medical tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              minWidth: 200,
              '& .MuiTabs-scrollButtons': {
                color: theme.palette.primary.main,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.secondary.main,
                width: '4px',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          >
            {tabData.map((tab, index) => (
              <AntTab
                key={index}
                label={tab.label}
                {...a11yProps(index)}
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '12px 16px',
                  margin: '4px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    fontWeight: 'bold',
                    transform: 'translateX(4px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '60%',
                      width: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 3px 3px 0',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                  },
                }}
              />
            ))}
          </AntTabs>

          {/* Tab Content */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            {tabData.map((tab, index) => (
              <TabPanel
                key={index}
                value={value}
                index={index}
                dir={theme.direction}
              >
                {tabComponents[tab.component]}
              </TabPanel>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PatientTabs;
