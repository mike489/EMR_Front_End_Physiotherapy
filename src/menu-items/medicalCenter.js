import React from 'react';
import { IconDoor } from '@tabler/icons-react';

const icons = {
  IconDoor,
};
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const medicalCenter = () => {
  const auth = getRolesAndPermissionsFromToken();

  if (!auth) return null;
  const hasPermission = auth.some((role) =>
    role.permissions?.some((per) => per.name === 'read_medical_center'),
  );

  if (!hasPermission) return null;

  // Create the icon element properly
  const iconElement = React.createElement(IconDoor, {
    size: 20,
    stroke: 1.5,
  });

  return {
    id: 'medical-centers',
    title: 'Medical Centers',
    type: 'item',
    url: '/medical-centers',
    icon: iconElement,
    breadcrumbs: false,
  };
};
