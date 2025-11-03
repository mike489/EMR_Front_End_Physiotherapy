import React from 'react';
import { IconReportAnalytics } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

export const Results = () => {
  const auth = getRolesAndPermissionsFromToken();
  // console.log('Auth Data:', auth);

  if (!auth) return null;

  const iconElement = React.createElement(IconReportAnalytics, {
    size: 20,
    stroke: 1.5,
  });

  if (
    auth.some((role) =>
      role.permissions?.some((per) => per.name === 'read_patient'),
    )
  ) {
    return {
      id: 'results',
      title: 'Results',
      type: 'item',
      url: '/results',
      icon: iconElement,
      breadcrumbs: false,
    };
  }
};
