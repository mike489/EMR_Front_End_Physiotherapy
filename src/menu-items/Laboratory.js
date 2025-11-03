// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconBrandPagekit,
  IconUserUp,
  IconPill,
  IconUserShare,
  IconUserDown,
  IconStethoscope,
  IconCalendarClock,
  IconCalendarCheck,
  IconMicroscope,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconBrandPagekit,
  IconUserUp,
  IconPill,
  IconUserShare,
  IconUserDown,
  IconStethoscope,
  IconCalendarClock,
  IconCalendarCheck,
  IconMicroscope,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Laboratory = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_patient',
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
    'read_laboratory_test_group ',
  ];

  const permissionMap = {
    read_patient: {
      id: 'Orders',
      title: 'Orders',
      url: '/orders_lab',
      icon: icons.IconCalendarClock,
    },
    read_room: {
      id: 'Results',
      title: 'Results',
      url: '/results_lab',
      icon: icons.IconUserShare,
    },
    read_laboratory_test_group: {
      id: 'Configurations',
      title: 'Configurations',
      url: '/Lab',
      icon: icons.IconWorldWww,
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
    id: 'Laboratory ',
    title: 'Laboratory ',
    type: 'group',
    icon: icons.IconMicroscope,
    children: childrenTemp,
  };
};
