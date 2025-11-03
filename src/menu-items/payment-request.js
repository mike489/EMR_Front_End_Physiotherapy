import React from 'react';
import { IconDoor } from '@tabler/icons-react';

const icons = {
  IconDoor,
};
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const paymentRequest = () => {
  const auth = getRolesAndPermissionsFromToken();

  if (!auth) return null;
  const hasPermission = auth.some((role) =>
    role.permissions?.some(
      (per) => per.name === 'read_laboratory_payment_requests',
    ),
  );

  if (!hasPermission) return null;

  // Create the icon element properly
  const iconElement = React.createElement(IconDoor, {
    size: 20,
    stroke: 1.5,
  });

  return {
    id: 'payment_requests',
    title: 'Payment Request ',
    type: 'item',
    url: '/payment_request',
    icon: iconElement,
    breadcrumbs: false,
  };
};
