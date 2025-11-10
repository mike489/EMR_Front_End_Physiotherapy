// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconEyeTable,
  IconFolderSymlink,
  IconVaccine,
  IconNurse,
  IconCalendarUser,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconEyeTable,
  IconFolderSymlink,
  IconVaccine,
  IconNurse,
  IconCalendarUser,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Nurses = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_patient',
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_monitoring_period',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
    'read_availability',
  ];

  const permissionMap = {
    read_patient: {
      id: 'All-nurses',
      title: 'All nurses',
      url: '/all_nurses',
      icon: icons.IconNurse,
    },
    read_room: {
      id: 'Register-nurses',
      title: 'Register nurses',
      url: '/register_nurses',
      icon: icons.IconCalendarUser,
    },
    read_lens_type: {
      id: 'progress-logs',
      title: 'Progress logs',
      url: '/nurse_logs',
      icon: icons.IconUsersGroup,
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
    id: 'Nurses',
    title: 'Nurses',
    type: 'group',
    icon: icons.IconNurse,
    children: childrenTemp,
  };
};
