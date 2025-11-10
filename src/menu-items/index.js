// import dashboard from './dashboard';
import { settings } from './settings';
import { Accounts } from './account';
import { TeamAndPersonalReports } from './Team-personal-reports';
import { StatusReport } from './status-reports';
import { PatientManagement } from './Patient-management';
import { DashboardAndReports } from './Dashboard-Reports';
import { OphthalmologistDoctors } from './OphthalmologistDoctors';
import { PrescriptionManagement } from './Prescription-management';
import { Nurses } from './Nurses';
import { WardsAndBeds } from './wardsAndBeds';
import { surgeryRequest } from './surgery-requests';
import { ReferralManagement } from './Referral-management';
import { Appointments } from './Appointments';
import { Accounting } from './Accounting';
import { Laboratory } from './Laboratory';
import { Radiology } from './Radiology';
import { Inventory } from './Inventory';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    // dashboard(),
    DashboardAndReports(),
    PatientManagement(),
    TeamAndPersonalReports(),
    OphthalmologistDoctors(),
    PrescriptionManagement(),
    Nurses(),
    WardsAndBeds(),
    // Referral(),
    ReferralManagement(),
    Appointments(),
    // Surgical(),
    surgeryRequest(),
    Accounting(),
    Laboratory(),
    Radiology(),
    Inventory(),
    StatusReport(),
    // patientapp(),
    // Results(),
    // Doctorapp(),
    settings(),
    Accounts(),
  ],
};
console.log('menuItems.items:', menuItems.items);
export default menuItems;
