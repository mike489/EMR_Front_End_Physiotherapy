// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconUserPlus,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconUserPlus,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const surgeryRequest = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_surgery_request',
    'read_room',
    'read_laboratory_test_group',
    'read_lens_type',
    'read_lens_material',
    'read_monitoring_period',
    'read_payment_setting',
    'read_radiology_department',
  ];

  const permissionMap = {
    read_surgery_request: {
      id: 'surgery-booking',
      title: 'Surgery booking',
      url: '/surgery-booking',
      icon: icons.IconUsersGroup,
    },
    read_laboratory_test_group: {
      id: 'preoperative-preparation',
      title: 'Preoperative preparation',
      url: '/preoperative-preparation',
      icon: icons.IconUserPlus,
    },
    read_room: {
      id: 'Operative notes',
      title: 'Operative notes',
      url: '/operative-notes',
      icon: icons.IconUsersGroup,
    },

    read_lens_material: {
      id: 'Discharge summary',
      title: 'Discharge summary',
      url: '/discharge-summary',
      icon: icons.IconWheelchair,
    },

    read_radiology_department: {
      id: 'OR flow management',
      title: 'OR flow management',
      url: '/OR-flow-management',
      icon: icons.IconGrave2,
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
    id: 'surgical',
    title: 'Surgical',
    type: 'group',
    icon: icons.IconAlignBoxLeftBottom,
    children: childrenTemp,
  };
};
