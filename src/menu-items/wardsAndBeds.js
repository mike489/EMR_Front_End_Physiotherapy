// import React from 'react';
// import { IconCalendarClock } from '@tabler/icons-react';

// const icons = {
//   IconCalendarClock,

// };
// import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// // ==============================|| DASHBOARD MENU ITEMS ||============================== //

// export const WardsAndBeds = () => {
//   const auth = getRolesAndPermissionsFromToken();
//   console.log('Auth Data:', auth);

//   if (!auth) return null;
//   const hasPermission = auth.some((role) =>
//     role.permissions?.some((per) => per.name === 'read_bed'),
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
import {
  IconCalendarClock,
  IconStethoscope,
  IconBed,
  IconBedFilled,
  IconAmbulance,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconCalendarClock,
  IconStethoscope,
  IconBed,
  IconBedFilled,
  IconAmbulance,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const WardsAndBeds = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = ['read_ward', 'read_bed', 'read_bed_assignment'];

  const permissionMap = {
    read_ward: {
      id: 'ward',
      title: 'Wards',
      url: '/wards',
      icon: icons.IconAmbulance,
    },
    read_bed: {
      id: 'beds',
      title: 'Beds',
      url: '/beds',
      icon: icons.IconBedFilled,
    },
    read_bed_assignment: {
      id: 'bed-lists',
      title: 'Patient Beds Lists',
      url: '/bed-lists',
      icon: icons.IconBedFilled,
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
    id: 'wards-and-beds',
    title: 'Bed & room management',
    type: 'group',
    icon: IconBed,
    children: childrenTemp,
  };
};
