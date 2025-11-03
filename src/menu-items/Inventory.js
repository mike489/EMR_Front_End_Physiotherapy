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
  IconBasketDown,
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
  IconBasketDown,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Inventory = () => {
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
      id: 'Medicines',
      title: 'Medicines',
      url: '/medicines_inventory',
      icon: icons.IconCalendarClock,
    },
    read_room: {
      id: 'Glasses',
      title: 'Glasses ',
      url: '/glasses_prescription',
      icon: icons.IconUserShare,
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
    id: 'Inventory ',
    title: 'Inventory ',
    type: 'group',
    icon: icons.IconBasketDown,
    children: childrenTemp,
  };
};
