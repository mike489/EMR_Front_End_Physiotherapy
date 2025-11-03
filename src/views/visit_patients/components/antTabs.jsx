import { styled } from '@mui/material/styles';
import { Tabs, Tab } from '@mui/material';
import hasPermission from 'utils/auth/hasPermission';

export const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: 'primary.main',
  },
});

export const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: 'text.primary',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: theme.palette.primary[800],
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#d1eaff',
    },
  }),
);

export const tabData = [
  hasPermission('read_complaint') && {
    label: 'Complaint',
    component: 'ComplaintTab',
  },

  hasPermission('read_medical_history') && {
    label: 'History',
    component: 'HistoryTab',
  },
  hasPermission('read_visual_acuity') && {
    label: 'Visual Acuity',
    component: 'VisualAcuityTab',
  },
  hasPermission('read_ocular_motility') && {
    label: 'Ocular Motility',
    component: 'ocularMotilities',
  },
  hasPermission('read_intraocular_pressure') && {
    label: 'Intraocular Pressure',
    component: 'IntraocularPressureTab',
  },
  hasPermission('read_adnexa_examination') && {
    label: 'Adnexa Examination',
    component: 'AdnexaExaminationTab',
  },
  hasPermission('read_slit_lamp_examination') && {
    label: 'Slit Lamp Examination',
    component: 'SlitLampExaminationTab',
  },
  hasPermission('read_fundus_examination') && {
    label: 'Fundus Examinations',
    component: 'FundusExaminationsTab',
  },
  hasPermission('read_initial_impression') && {
    label: 'Initial Impression',
    component: 'InitialImpressionsTab',
  },
].filter(Boolean);

export const flowsheetTabsData= [
  hasPermission('read_vital_sign') && {
    label: 'Vital Signs',
    component: 'VitalsTab',
  },
   hasPermission('read_cardiovascular_assessment') && {
    label: 'Cardiovascular Assessments',
    component: 'CardiovascularTabs',
  },
   hasPermission('read_urological_assessment') && {
    label: 'Urological Assessments',
    component: 'UrologicalTabs',
  },
  hasPermission('read_gastrointestinal_assessment') && {
    label: 'Gastrointestinal Assessments',
    component: 'GastrointestinalTabs',
  },
   hasPermission('read_pain') && {
    label: 'Pains',
    component: 'PainsTabs',
  },
   hasPermission('read_oxygen') && {
    label: 'Oxygens',
    component: 'OxygenTabs',
  },
   hasPermission('read_respiratory_assessment') && {
    label: 'Respiratory Assessments',
    component: 'RespiratoryTabs',
  },
   hasPermission('read_intravenous_therapy') && {
    label: 'Intravenous Therapy',
    component: 'IntravenousTabs',
  },
    hasPermission('read_neurological_assessment') && {
    label: 'Neurological Assessments',
    component: 'NeurologicalTabs',
  },
    hasPermission('read_infectious') && {
    label: 'Infectious',
    component: 'InfectiousTabs',
  },
].filter(Boolean);
