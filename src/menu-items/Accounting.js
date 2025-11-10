// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconBrandPagekit,
  IconUserUp,
  IconPill,
  IconUserShare,
  IconUserDown,
  IconStethoscope,
  IconCalendarClock,
  IconCalendarCheck,
  IconCalculator,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconBrandPagekit,
  IconUserUp,
  IconPill,
  IconUserShare,
  IconUserDown,
  IconStethoscope,
  IconCalendarClock,
  IconCalendarCheck,
  IconCalculator,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Accounting = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_patient',
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
  ];

  const permissionMap = {
    read_patient: {
      id: 'Credit invoice',
      title: 'Credit invoice',
      url: '/credit_invoice',
      icon: icons.IconCalendarClock,
    },
    read_room: {
      id: 'Cash invoice',
      title: 'Cash invoice',
      url: '/cash_invoice',
      icon: icons.IconUserShare,
    },
    read_lens_type: {
      id: 'Balance sheet',
      title: 'Balance sheet',
      url: '/balance_sheet',
      icon: icons.IconWorldWww,
    },
    read_lens_material: {
      id: 'Sales revenue',
      title: 'Sales revenue',
      url: '/sales_revenue',
      icon: icons.IconWorldWww,
    },
    read_payment_setting: {
      id: 'Billing and payments',
      title: 'Billing and payments',
      url: '/billing_and_payments',
      icon: icons.IconWorldWww,
    },
    read_payment_setting: {
      id: 'payment_requests',
      title: 'Payment Requests',
      url: '/payment_request',
      icon: icons.IconWorldWww,
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
    id: 'Accounting',
    title: 'Accounting',
    type: 'group',
    icon: icons.IconCalculator,
    children: childrenTemp,
  };
};
