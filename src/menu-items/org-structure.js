import React from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

export const getOrgStructure = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;

  const iconElement = React.createElement(IconUsersGroup, {
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
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/patients',
      icon: iconElement,
      breadcrumbs: false,
    };
  }

  // Check for payment setting permission
  // if (
  //   auth.some((role) =>
  //     role.permissions?.some((per) => per.name === 'read_payment_setting')
  //   )
  // ) {
  //   return {
  //     id: 'read_payment_setting',
  //     title: 'Payment Setting',
  //     type: 'item',
  //     url: '/payment_setting',
  //     icon: iconElement,
  //     breadcrumbs: false,
  //   };
  // }

  // return null;
};
