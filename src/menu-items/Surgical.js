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
  IconDeviceHeartMonitor,
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
  IconDeviceHeartMonitor,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Surgical = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_laboratory_payment_requests',
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',
  ];

  const permissionMap = {
    read_laboratory_payment_requests: {
      id: 'Surgery-booking ',
      title: 'Surgery booking ',
      url: '/surgery_request ',
      icon: icons.IconCalendarClock,
    },
    read_room: {
      id: 'Preoperative preparation',
      title: 'Preoperative preparation',
      url: '/preoperative_preparation',
      icon: icons.IconUserShare,
    },
    read_lens_type: {
      id: 'Operative-notes',
      title: 'Operative notes',
      url: '/operative_notes',
      icon: icons.IconWorldWww,
    },
    read_lens_material: {
      id: 'Patient-scheduling',
      title: 'Patient scheduling',
      url: '/patient_scheduling',
      icon: icons.IconCalendarClock,
    },
    read_payment_setting: {
      id: 'Discharge summary',
      title: 'Discharge summary',
      url: '/discharge_summary',
      icon: icons.IconWorldWww,
    },
    read_payment_setting: {
      id: 'OR-flow-management',
      title: 'OR flow management',
      url: '/or_flow_management',
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
    id: 'Surgical',
    title: 'Surgical',
    type: 'group',
    icon: icons.IconDeviceHeartMonitor,
    children: childrenTemp,
  };
};
