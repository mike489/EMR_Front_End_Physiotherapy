import React from 'react';
import { IconDoor } from '@tabler/icons-react';

const icons = {
  IconDoor,
};
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const dashboard = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;
  const hasPermission = auth.some((role) =>
    role.permissions?.some((per) => per.name === 'read_room'),
  );

  if (!hasPermission) return null;

  // Create the icon element properly
  const iconElement = React.createElement(IconDoor, {
    size: 20,
    stroke: 1.5,
  });

  return {
    id: 'triage_room',
    title: 'Triage Room',
    type: 'item',
    url: '/triage-room',
    icon: iconElement,
    breadcrumbs: false,
  };
};
