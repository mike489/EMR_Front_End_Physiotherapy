import React from 'react';
import { IconShoppingCart } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

export const Orders = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;

  const iconElement = React.createElement(IconShoppingCart, {
    size: 20,
    stroke: 1.5,
  });

  // Check for patient permission
  if (
    auth.some((role) =>
      role.permissions?.some((per) => per.name === 'read_patient'),
    )
  ) {
    return {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: '/Orders',
      icon: iconElement,
      breadcrumbs: false,
    };
  }
};
