// assets
import {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconUserPlus,
} from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconUsersGroup,
  IconAlignBoxLeftBottom,
  IconGrave2,
  IconWheelchairOff,
  IconWheelchair,
  IconUserPlus,
};

// ==============================|| Kpi_basic_config  MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const PatientManagement = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_patient',
    'read_room',
    'read_laboratory_test_group',
    'read_lens_type',
    'read_lens_material',
    'read_monitoring_period',
    'read_payment_setting',
    'read_radiology_department',
  ];

  const permissionMap = {
    read_patient: {
      id: 'patients',
      title: 'All Patients',
      url: '/patients',
      icon: icons.IconUsersGroup,
    },
    read_laboratory_test_group: {
      id: 'register-patient',
      title: 'Register patient',
      url: '/register_view',
      icon: icons.IconUserPlus,
    },
    read_room: {
      id: 'Active patients',
      title: 'Active Patients',
      url: '/active_patients',
      icon: icons.IconUsersGroup,
    },
    read_lens_type: {
      id: 'visit-patients',
      title: 'Visit patients',
      url: '/visit_patients',
      icon: icons.IconUsersGroup,
    },
    read_lens_material: {
      id: 'In-patients',
      title: 'In Patients',
      url: '/in_patients',
      icon: icons.IconWheelchair,
    },
    read_payment_setting: {
      id: 'Out-patients',
      title: 'Out Patients',
      url: '/out_patients',
      icon: icons.IconWheelchairOff,
    },
    read_radiology_department: {
      id: 'Sick-Leaves',
      title: 'Sick Leaves',
      url: '/sick_leaves',
      icon: icons.IconGrave2,
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
    id: 'Patient management',
    title: 'Patient Management',
    type: 'group',
    icon: icons.IconAlignBoxLeftBottom,
    children: childrenTemp,
  };
};
