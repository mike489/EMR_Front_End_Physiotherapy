import React from 'react';
import { IconCalendarBolt } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

export const patientapp = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;

  const iconElement = React.createElement(IconCalendarBolt, {
    size: 20,
    stroke: 1.5,
  });

  // Check for patient permission
  if (
    auth.some((role) =>
      role.permissions?.some((per) => per.name === 'read_appointment'),
    )
  ) {
    return {
      id: 'patientapp',
      title: 'Patients Appointment',
      type: 'item',
      url: '/patientapp',
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
