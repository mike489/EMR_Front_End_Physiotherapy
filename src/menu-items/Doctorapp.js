// import React from 'react';
// import { IconCalendarClock } from '@tabler/icons-react';

// const icons = {
//   IconCalendarClock,

// };
// import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// // ==============================|| DASHBOARD MENU ITEMS ||============================== //

// export const Doctorapp = () => {
//   const auth = getRolesAndPermissionsFromToken();
//   console.log('Auth Data:', auth);

//   if (!auth) return null;
//   const hasPermission = auth.some((role) =>
//     role.permissions?.some((per) => per.name === 'read_room'),
//   );

//   if (!hasPermission) return null;

//   // Create the icon element properly
//   const iconElement = React.createElement(IconCalendarClock, {
//     size: 20,
//     stroke: 1.5,
//   });

//   return {
//     id: 'doctorailability',
//     title: 'Doctor Availability',
//     type: 'item',
//     url: '/Doctor_appointment',
//     icon: iconElement,
//     breadcrumbs: false,
//   };
// };

// assets
import { IconCalendarClock, IconStethoscope } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconCalendarClock,
  IconStethoscope,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Doctorapp = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = ['read_availability', 'read_room'];

  const permissionMap = {
    read_availability: {
      id: 'doctor_availability',
      title: 'Doctors Availability',
      url: '/Doctor_appointment',
      icon: icons.IconCalendarClock,
    },
     
    read_room: {
      id: 'doctors',
      title: 'Doctor List',
      url: '/doctors',
      icon: icons.IconStethoscope,
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
    id: 'Doctor',
    title: 'Doctors',
    type: 'group',
    icon: IconCalendarClock,
    children: childrenTemp,
  };
};
