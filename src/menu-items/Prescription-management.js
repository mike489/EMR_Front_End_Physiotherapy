// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconBrandPagekit,
  IconShoppingCart,
  IconPill,
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
  IconShoppingCart,
  IconPill,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const PrescriptionManagement = () => {
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
  ];

  const permissionMap = {
    read_patient: {
      id: 'Orders',
      title: 'Orders ',
      url: '/orders',
      icon: icons.IconShoppingCart,
    },
    read_room: {
      id: 'E-Prescription',
      title: 'E-Prescription',
      url: '/e_prescription',
      icon: icons.IconPill,
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
    id: 'Prescription management',
    title: 'Prescription management',
    type: 'group',
    icon: icons.IconBrandPagekit,
    children: childrenTemp,
  };
};
