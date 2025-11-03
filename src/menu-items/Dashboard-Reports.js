// assets
import {
  IconDashboard,
  IconPresentationAnalytics,
  IconReport,
  IconHistory,
  IconLayoutDashboard,
  IconClipboardHeart,
  IconChartHistogram,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconDashboard,
  IconPresentationAnalytics,
  IconReport,
  IconHistory,
  IconLayoutDashboard,
  IconClipboardHeart,
  IconChartHistogram,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();
console.log('auth', auth);
export const DashboardAndReports = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
  ];

  const permissionMap = {
    read_room: {
      id: 'Patient-histories',
      title: 'Patient histories',
      url: '/patient_histories',
      icon: icons.IconHistory,
    },
    read_lens_type: {
      id: 'Trend-analytics',
      title: 'Trend analytics',
      url: '/trend_analytics',
      icon: icons.IconPresentationAnalytics,
    },
    read_lens_material: {
      id: 'Clinical-&-surgical-report',
      title: 'Clinical and surgical report',
      url: '/clinical_and_surgical_report',
      icon: icons.IconClipboardHeart,
    },
    read_payment_setting: {
      id: 'Financial-analytics',
      title: 'Financial analytics',
      url: '/financial_analytics',
      icon: icons.IconChartHistogram,
    },
  };

  if (auth) {
    console.log('auth', auth);
    orderedPermissions.forEach((permissionName) => {
      auth.forEach((role) => {
        const setting = permissionMap[permissionName];

        if (setting && !addedPermissions.has(permissionName)) {
          const hasPermission = role.permissions.find(
            (per) => per.name === permissionName,
          );

          if (hasPermission) {
            childrenTemp.push({
              ...setting,
              type: 'item',
            });
            addedPermissions.add(permissionName);
          }
        }
      });
    });
  }
  console.log('childrenTemp', childrenTemp);
  return {
    id: 'Dashboard & Reports',
    title: 'Dashboard & Reports',
    type: 'group',
    icon: icons.IconLayoutDashboard,
    children: childrenTemp,
  };
};
