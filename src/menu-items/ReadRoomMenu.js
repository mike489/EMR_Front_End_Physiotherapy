import React from 'react';
import { IconDoor, IconDoorEnter } from '@tabler/icons-react';

const icons = {
  IconDoor,
  IconDoorEnter,
};
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const readRoom = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;
  const hasPermission = auth.some((role) =>
    role.permissions?.some((per) => per.name === 'read_room'),
  );

  if (!hasPermission) return null;

  // Create the icon element properly
  const iconElement = React.createElement(IconDoorEnter, {
    size: 20,
    stroke: 1.5,
  });

  return {
    id: 'rooms',
    title: 'Rooms',
    type: 'item',
    url: '/rooms',
    icon: iconElement,
    breadcrumbs: false,
  };
};

// read_room: {
//   id: 'room',
//   title: 'Triage Room',
//   url: '/triage-room',
//   icon: icons.IconDoor,
// },
