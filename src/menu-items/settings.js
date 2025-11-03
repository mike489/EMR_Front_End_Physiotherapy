// assets
import {
  IconDashboard,
  IconReport,
  IconShadow,
  IconActivity,
  IconSettingsStar,
  IconFileReport,
  IconBrandCampaignmonitor,
  IconRoute,
  IconWaveSawTool,
  IconCalendarWeek,
  IconRulerMeasure,
  IconPerspective,
  IconFolderStar,
  IconBriefcase,
  IconWallet,
  IconAdjustmentsCog,
  IconMicroscope,
  IconPhotoSensor,
  IconPhotoSensor2,
  IconRadio,
  IconDoorEnter,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconDashboard,
  IconReport,
  IconShadow,
  IconActivity,
  IconSettingsStar,
  IconFileReport,
  IconBrandCampaignmonitor,
  IconRoute,
  IconWaveSawTool,
  IconCalendarWeek,
  IconRulerMeasure,
  IconPerspective,
  IconFolderStar,
  IconBriefcase,
  IconWallet,
  IconAdjustmentsCog,
  IconMicroscope,
  IconPhotoSensor,
  IconPhotoSensor2,
  IconRadio,
  IconDoorEnter,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const settings = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read:frequency',
    'read:period',
    'read:measuringunit',
    'read:perspectivetype',
    'read:performanceratingscale',
    'approval:manage',
    'read_lens_type',
    'read_lens_material',
    'read_monitoring_period',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
    'read_room',
  ];

  const permissionMap = {
    read_payment_setting: {
      id: 'payment_setting',
      title: 'Payment',
      url: '/payment_setting',
      icon: icons.IconWallet,
    },
    // read_laboratory_test_group: {
    //   id: 'laboratory_test_group',
    //   title: 'Laboratory',
    //   url: '/Lab',
    //   icon: icons.IconMicroscope,
    // },
    // read_radiology_department: {
    //   id: 'radiology_department',
    //   title: 'Radiology',
    //   url: '/radiology',
    //   icon: icons.IconRadio,
    // },

    read_room: {
      id: 'room',
      title: 'Rooms',
      url: '/rooms',
      icon: icons.IconDoorEnter,
    },
    'read:frequency': {
      id: 'frequencies',
      title: 'Frequencies',
      url: '/frequencies',
      icon: icons.IconWaveSawTool,
    },
    'read:measuringunit': {
      id: 'measuring-units',
      title: 'Measuring Units',
      url: '/measuring-units',
      icon: icons.IconRulerMeasure,
    },

    'read:performanceratingscale': {
      id: 'performance-rating',
      title: 'Performance Rating',
      url: '/performance-rating',
      icon: icons.IconFolderStar,
    },
    read_lens_material: {
      id: 'lens_materials',
      title: 'Lens Materials',
      url: '/lens_materials',
      icon: icons.IconPhotoSensor2,
    },

    'approval:manage': {
      id: 'workflows',
      title: 'Approval Workflows',
      url: '/workflows',
      icon: icons.IconRoute,
    },
    read_lens_type: {
      id: 'lens_types',
      title: 'Lens Types',
      url: '/lens_types',
      icon: icons.IconPhotoSensor,
    },

    'read:monitoring-period': {
      id: 'monitoring-settings',
      title: 'Monitoring Settings',
      url: '/monitoring-settings',
      icon: icons.IconAdjustmentsCog,
    },
  };

  if (auth) {
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

  return {
    id: 'settings',
    title: 'Settings',
    type: 'group',
    icon: icons.IconSettingsStar,
    children: childrenTemp,
  };
};
