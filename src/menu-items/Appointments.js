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
  IconWorldWww,
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
  IconWorldWww,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const Appointments = () => {
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
      id: 'All appointments',
      title: 'All appointments',
      url: '/patientapp',
      icon: icons.IconCalendarClock,
    },
    read_room: {
      id: 'Doctor-availability',
      title: 'Doctor availability',
      url: '/Doctor_appointment',
      icon: icons.IconUserShare,
    },
    read_lens_type: {
      id: 'Website-Requests',
      title: 'Website Requests',
      url: '/website_requests',
      icon: icons.IconWorldWww,
    },
    read_lens_material: {
      id: 'Patient-scheduling',
      title: 'Patient scheduling',
      url: '/patient_scheduling',
      icon: icons.IconWorldWww,
    },
    read_payment_setting: {
      id: 'Emergencies',
      title: 'Emergencies',
      url: '/emergencies',
      icon: icons.IconWorldWww,
    },
    read_radiology_department: {
      id: 'Vip ',
      title: 'VIP ',
      url: '/vip',
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
    id: 'Appointments',
    title: 'Appointments',
    type: 'group',
    icon: icons.IconCalendarCheck,
    children: childrenTemp,
  };
};
