// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconEyeTable,
  IconFolderSymlink,
  IconVaccine,
  IconCalendarPlus,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconEyeTable,
  IconFolderSymlink,
  IconVaccine,
  IconCalendarPlus,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const OphthalmologistDoctors = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_availability',
    'read_patient',
    'read_room',
    'read_lens_type',
    'read_lens_material',
    'read_monitoring_period',
    'read_payment_setting',
    'read_laboratory_test_group',
    'read_radiology_department',

    'read_availability',
    'read_care_plan',
  ];

  const permissionMap = {
    read_patient: {
      id: 'all-ophthalmologist',
      title: 'All Doctors',
      url: '/all_ophthalmologist',
      icon: icons.IconUsersGroup,
    },
    read_room: {
      id: 'register-doctors ',
      title: 'Register Doctors ',
      url: '/register-doctors',
      icon: icons.IconUsersGroup,
    },
    read_lens_type: {
      id: 'specialty-management',
      title: 'Specialty management',
      url: '/specialty_management',
      icon: icons.IconUsersGroup,
    },
    read_lens_material: {
      id: 'My-patients',
      title: 'My patients',
      url: '/my_patients',
      icon: icons.IconWheelchair,
    },
    read_payment_setting: {
      id: 'My-referrals',
      title: 'My referrals',
      url: '/my_referrals',
      icon: icons.IconWheelchairOff,
    },
    read_laboratory_test_group: {
      id: 'My-referral-out',
      title: 'My referral out',
      url: '/my_referral_out',
      icon: icons.IconGrave2,
    },
    read_radiology_department: {
      id: 'My-Surgery-requests',
      title: 'My Surgery requests',
      url: '/my_surgery_requests',
      icon: icons.IconVaccine,
    },

    read_care_plan: {
      id: 'Cross-referral',
      title: 'Care Plan',
      url: '/CarePlan',
      icon: icons.IconCalendarPlus,
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
    id: 'Ophthalmologist-Doctors',
    title: 'Doctors',
    type: 'group',
    icon: icons.IconEyeTable,
    children: childrenTemp,
  };
};
