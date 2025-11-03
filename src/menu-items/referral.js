
import {
IconDirections,IconStethoscope, IconListDetails
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconDirections,
IconStethoscope, IconListDetails
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Referral = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_availability',
    'read_room'
  
  ];

  const permissionMap = {
    // read_availability: {
    //   id: 'doctor_availability',
    //   title: 'Doctors Availability',
    //   url: '/referral',
    //   icon: icons.IconDirections,
    // },
    read_room: {
      id: 'referral',
      title: 'Referral List',
      url: '/referral',
      icon: icons.IconListDetails,
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
    id: 'Referral',
    title: 'Referral Managements',
    type: 'group',
    icon: IconDirections,
    children: childrenTemp,

  };
};
