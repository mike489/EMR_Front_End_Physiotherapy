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
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const ReferralManagement = () => {
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
      id: 'Referral-in',
      title: 'Referral in',
      url: '/referral_in',
      icon: icons.IconUserDown,
    },
    read_room: {
      id: 'Referral-Out',
      title: 'Referral out',
      url: '/referral_out',
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
    id: 'Referral management',
    title: 'Referral management',
    type: 'group',
    icon: icons.IconUserUp,
    children: childrenTemp,
  };
};
