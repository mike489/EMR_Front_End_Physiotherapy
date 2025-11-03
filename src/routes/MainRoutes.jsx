import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Protected from 'Protected';
// import DoctorAvailabilityTab from 'views/DoctorsList/components/DoctorAvailabilityTab';
// import Doctorlist from 'views/DoctorsList';
// import Doctorlistt from 'views/DoctorsList';
// import Doctor_appointment from 'views/Doctor_appointment';

// dashboard routing
const Home = Loadable(lazy(() => import('views/dashboard')));
const Units = Loadable(lazy(() => import('views/units')));
const MyUnits = Loadable(lazy(() => import('views/units/my_units')));
const ViewUnit = Loadable(lazy(() => import('views/units/view')));
const Planning = Loadable(lazy(() => import('views/planning')));
const PlanDetail = Loadable(lazy(() => import('views/planning/planDetail')));
const FeedBacks = Loadable(lazy(() => import('views/feedbacks')));
const Coaching = Loadable(lazy(() => import('views/coaching')));
const EODReport = Loadable(lazy(() => import('views/EodReport/EodReport')));
const EodReportView = Loadable(
  lazy(() => import('views/myTeamEodReport/EdoReportView')),
);
const ViewRegisterPatient = Loadable(
  lazy(() => import('views/patients/register_view')),
);

const MyTeamsEODReport = Loadable(lazy(() => import('views/myTeamEodReport')));
const PlanningStatus = Loadable(
  lazy(() => import('views/planning/planning-status')),
);
const TaskStatus = Loadable(lazy(() => import('views/my-teams/task-status')));
const Employees = Loadable(lazy(() => import('views/employees')));

const EmployeesPlanRemove = Loadable(
  lazy(() => import('views/employees/components/EmployeesPlanRemove')),
);
const EmployeesRemovedPlanLog = Loadable(
  lazy(() => import('views/employees/components/EmployeesRemovedPlanLog')),
);
const MyEmployees = Loadable(
  lazy(() => import('views/employees/my_employees')),
);
const ViewEmployee = Loadable(lazy(() => import('views/employees/view')));
const ViewPatients = Loadable(lazy(() => import('views/patients/view')));
const PaymentRequestView = Loadable(
  lazy(() => import('views/payement-request/view')),
);
const ViewVisitPatients = Loadable(
  lazy(() => import('views/visit_patients/view')),
);

const ViewTaskEmployee = Loadable(
  lazy(() => import('views/dashboard/components/hr/view')),
);
const ViewEmployeeFeedBack = Loadable(
  lazy(() => import('views/feedbacks/feedBack')),
);
const ViewCoaching = Loadable(lazy(() => import('views/coaching/coaching')));

const ViewEodReport = Loadable(lazy(() => import('views/EodReport/EodReport')));

const ViewMyFeedBack = Loadable(
  lazy(() => import('views/feedbacks/myFeedBack')),
);
const PerformanceRating = Loadable(
  lazy(() => import('views/settings/performance-ratings')),
);
const Perspectives = Loadable(
  lazy(() => import('views/settings/perspectives')),
);
const MeasuringUnits = Loadable(
  lazy(() => import('views/settings/measuring-units')),
);
const Periods = Loadable(lazy(() => import('views/settings/periods')));
const MonitoringSettings = Loadable(
  lazy(() => import('views/settings/monitoring-settings')),
);
const Frequencies = Loadable(lazy(() => import('views/settings/frequencies')));
const NotFound = Loadable(lazy(() => import('views/not-found')));
const ViewTask = Loadable(lazy(() => import('views/approvals/view')));

const Ranking = Loadable(lazy(() => import('views/ranking')));
const Performance = Loadable(lazy(() => import('views/performance')));
const PerKPIPerformanceReport = Loadable(
  lazy(() => import('views/Report/components/per-kpi-performance')),
);
const Tasks = Loadable(lazy(() => import('views/approvals')));
const Approvals = Loadable(lazy(() => import('views/approvals')));
const ViewApprovalTask = Loadable(lazy(() => import('views/approvals/view')));
const TriageRoom = Loadable(lazy(() => import('views/triage_room')));
const Lab = Loadable(lazy(() => import('views/Lab/index')));
const EvaluationApproval = Loadable(
  lazy(() => import('views/approvals/evaluation-approval')),
);

const MyEvaluations = Loadable(
  lazy(() => import('views/evaluation/my-evaluations')),
);
const Monitoring = Loadable(lazy(() => import('views/monitoring')));
const Revision = Loadable(lazy(() => import('views/revision')));
const MonitoringReport = Loadable(lazy(() => import('views/monitoringReport')));
const ViewPlan = Loadable(lazy(() => import('views/planning/View')));
const Account = Loadable(lazy(() => import('views/account')));
const KPIManagement = Loadable(lazy(() => import('views/kpi')));
const Users = Loadable(lazy(() => import('views/users')));
const Patients = Loadable(lazy(() => import('views/patients')));
const PaymentRequest = Loadable(lazy(() => import('views/payement-request')));
const DoctorAppointment = Loadable(
  lazy(() => import('views/Doctor_appointment')),
);

const CarePlan = Loadable(
  lazy(() => import('views/visit_patients/components/CarePlanTab')),
);

const Orders = Loadable(
  lazy(() => import('views/visit_patients/components/OrderTab')),
);

const Results = Loadable(
  lazy(() => import('views/visit_patients/components/Result/ResultTab')),
);

const ActivePatients = Loadable(
  lazy(() => import('views/patientManagent/active_patient/index')),
);

const InPatients = Loadable(
  lazy(() => import('views/patientManagent/inPatient/index')),
);

const OutPatients = Loadable(
  lazy(() => import('views/patientManagent/out_patient/index')),
);

const Doctorlists = Loadable(lazy(() => import('views/DoctorsList')));
const ViewDoctor = Loadable(
  lazy(() => import('views/DoctorsList/components/ViewDoctor')),
);
const ScheduleDoctor = Loadable(
  lazy(() => import('views/DoctorsList/ScheduleDoctor')),
);
// const DoctorAvailabilityTab = Loadable(lazy(() => import('views/DoctorsList/components/DoctorAvailabilityTab')));
const PatientApp = Loadable(lazy(() => import('views/Patientapp')));
const ViewPatientApp = Loadable(lazy(() => import('views/Patientapp/view')));

const VisitPatients = Loadable(lazy(() => import('views/visit_patients')));

const Workflows = Loadable(lazy(() => import('views/workflows')));
const Report = Loadable(lazy(() => import('views/Report')));
const Viewoverallcompany = Loadable(
  lazy(() => import('views/Report/admin_side/UnitDetailView')),
);
const ViewKpiDetail = Loadable(
  lazy(() => import('views/Report/admin_side/KpiDetailView')),
);
const Job = Loadable(lazy(() => import('views/job-positions/index')));
const Todo = Loadable(lazy(() => import('views/todo')));
const MyTeam = Loadable(lazy(() => import('views/my-teams')));
const ViewTeamMemberTasks = Loadable(lazy(() => import('views/my-teams/view')));

// utilities routing
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const BasicConfigPage = Loadable(
  lazy(() => import('views/settings/view/basic-config')),
);
const EodActivityPage = Loadable(lazy(() => import('views/Eod/EodActivity')));
const RolePermission = Loadable(
  lazy(() => import('views/roles_permission/Page')),
);
const Unauthorized = Loadable(lazy(() => import('utils/unautorized')));

// sample page routingkpiMange-view
const Testpage = Loadable(lazy(() => import('views/sample-page/test')));
const Fortest = Loadable(lazy(() => import('views/dashboard/index')));
const AddPatients = Loadable(
  lazy(() => import('views/patients/PatientAddView')),
);
const Payment = Loadable(lazy(() => import('views/payments')));
const Rooms = Loadable(lazy(() => import('views/rooms')));
// ======| MAIN ROUTING ||============================== //
const Glasses = Loadable(
  lazy(() => import('views/visit_patients/components/glasses/GlassesTable')),
);
const Medicines = Loadable(
  lazy(
    () => import('views/visit_patients/components/medicines/MedicinesTable'),
  ),
);
const LensTypes = Loadable(lazy(() => import('views/lensTypes')));
const LensMaterials = Loadable(lazy(() => import('views/lens_materials')));
const Radiology = Loadable(lazy(() => import('views/radiology')));
const Wards = Loadable(lazy(() => import('views/wards')));
const Beds = Loadable(lazy(() => import('views/beds')));
const Referrals = Loadable(lazy(() => import('views/referrals')));
const Specialties = Loadable(lazy(() => import('views/specialties')));
const AllDoctors = Loadable(lazy(() => import('views/doctors/all-doctors')));
const MyPatients = Loadable(lazy(() => import('views/doctors/MyPatients')));
const SurgeryRequest = Loadable(lazy(() => import('views/surgery-request')));
const SurgeryRequestDetails = Loadable(
  lazy(() => import('views/surgery-request/view')),
);
const MyReferrals = Loadable(lazy(() => import('views/doctors/MyReferrals')));
const MyReferralsOut = Loadable(
  lazy(() => import('views/doctors/MyReferredOut')),
);
const MySurgeryRequests = Loadable(
  lazy(() => import('views/doctors/MySurgeryRequests')),
);
const AllNurses = Loadable(lazy(() => import('views/nurses')));
const RegisterDoctors = Loadable(
  lazy(() => import('views/doctors/all-doctors/RegisterDoctor')),
);
const RegisterNurses = Loadable(
  lazy(() => import('views/nurses/RegisterNurses')),
);
const RadiologyResults = Loadable(
  lazy(
    () => import('views/visit_patients/components/radiology/RadiologyResult'),
  ),
);
const RadiologyOrder = Loadable(
  lazy(() => import('views/visit_patients/components/RadiologyDoctorTab')),
);

const LabResult = Loadable(
  lazy(() => import('views/visit_patients/components/ResultLaboratory')),
);

const LabOrder = Loadable(
  lazy(() => import('views/visit_patients/components/LaboratoryDoctorTab')),
);

const GlassesPrescription = Loadable(
  lazy(() => import('views/visit_patients/components/glasses/GlassesTab')),
);
const MedicinesInventory = Loadable(
  lazy(() => import('views/visit_patients/components/medicines/MedicinesTab')),
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <Protected>
          <Home />
        </Protected>
      ),
    },
    {
      path: 'visit_patients/glasses',
      element: (
        <Protected>
          <Glasses />
        </Protected>
      ),
    },
    {
      path: 'all_ophthalmologist',
      element: (
        <Protected>
          <AllDoctors />
        </Protected>
      ),
    },
    {
      path: 'register-doctors',
      element: (
        <Protected>
          <RegisterDoctors />
        </Protected>
      ),
    },
    {
      path: 'register_nurses',
      element: (
        <Protected>
          <RegisterNurses />
        </Protected>
      ),
    },

    {
      path: 'all_nurses',
      element: (
        <Protected>
          <AllNurses />
        </Protected>
      ),
    },
    {
      path: 'surgery-booking',
      element: (
        <Protected>
          <SurgeryRequest />
        </Protected>
      ),
    },
    {
      path: 'my_surgery_requests',
      element: (
        <Protected>
          <MySurgeryRequests />
        </Protected>
      ),
    },
    {
      path: 'my_referrals',
      element: (
        <Protected>
          <MyReferrals />
        </Protected>
      ),
    },
    {
      path: 'my_referral_out',
      element: (
        <Protected>
          <MyReferralsOut />
        </Protected>
      ),
    },
    {
      path: 'surgery-request/view',
      element: (
        <Protected>
          <SurgeryRequestDetails />
        </Protected>
      ),
    },
    {
      path: 'my_patients',
      element: (
        <Protected>
          <MyPatients />
        </Protected>
      ),
    },
    {
      path: 'radiology',
      element: (
        <Protected>
          <Radiology />
        </Protected>
      ),
    },
    {
      path: 'wards',
      element: (
        <Protected>
          <Wards />
        </Protected>
      ),
    },
    {
      path: 'beds',
      element: (
        <Protected>
          <Beds />
        </Protected>
      ),
    },
    {
      path: 'referral_in',
      element: (
        <Protected>
          <Referrals />
        </Protected>
      ),
    },
    {
      path: 'specialty_management',
      element: (
        <Protected>
          <Specialties />
        </Protected>
      ),
    },
    {
      path: 'lens_types',
      element: (
        <Protected>
          <LensTypes />
        </Protected>
      ),
    },
    {
      path: 'lens_materials',
      element: (
        <Protected>
          <LensMaterials />
        </Protected>
      ),
    },
    {
      path: 'visit_patients/medicines',
      element: (
        <Protected>
          <Medicines />
        </Protected>
      ),
    },
    {
      path: 'visit_patients/medicines',
      element: (
        <Protected>
          <Medicines />
        </Protected>
      ),
    },
    {
      path: 'home',
      element: (
        <Protected>
          <Home />
        </Protected>
      ),
    },

    {
      path: 'account',
      element: (
        <Protected>
          <Account />
        </Protected>
      ),
    },

    {
      path: 'employees',
      element: (
        <Protected>
          <Employees />
        </Protected>
      ),
    },
    {
      path: 'rooms',
      element: (
        <Protected>
          <Rooms />
        </Protected>
      ),
    },
    {
      path: 'payment_request',
      element: (
        <Protected>
          <PaymentRequest />
        </Protected>
      ),
    },
    {
      path: 'employees_plan_remove',
      element: (
        <Protected>
          <EmployeesPlanRemove />
        </Protected>
      ),
    },
    {
      path: 'payment_setting',
      element: (
        <Protected>
          <Payment />
        </Protected>
      ),
    },
    {
      path: 'delated_plan_log',
      element: (
        <Protected>
          <EmployeesRemovedPlanLog />
        </Protected>
      ),
    },
    {
      path: 'my_employees',
      element: (
        <Protected>
          <MyEmployees />
        </Protected>
      ),
    },

    {
      path: 'employees/view',
      element: (
        <Protected>
          <ViewEmployee />
        </Protected>
      ),
    },
    {
      path: 'patients/add',
      element: (
        <Protected>
          <AddPatients />
        </Protected>
      ),
    },
    {
      path: 'patients/view',
      element: (
        <Protected>
          <ViewPatients />
        </Protected>
      ),
    },
    {
      path: 'payement-request/view',
      element: (
        <Protected>
          <PaymentRequestView />
        </Protected>
      ),
    },
    {
      path: 'visit_patients/view',
      element: (
        <Protected>
          <ViewVisitPatients />
        </Protected>
      ),
    },
    {
      path: 'visit_patients',
      element: (
        <Protected>
          <VisitPatients />
        </Protected>
      ),
    },
    {
      path: 'hr/view',
      element: (
        <Protected>
          <ViewTaskEmployee />
        </Protected>
      ),
    },
    {
      path: 'employeesFeedBack/view',
      element: (
        <Protected>
          <ViewEmployeeFeedBack />
        </Protected>
      ),
    },
    {
      path: 'coaching/view',
      element: (
        <Protected>
          <ViewCoaching />
        </Protected>
      ),
    },
    {
      path: 'EodReport/view',
      element: (
        <Protected>
          <ViewEodReport />
        </Protected>
      ),
    },
    {
      path: '/myTeamEodReport/EodReportView',
      element: (
        <Protected>
          <EodReportView />
        </Protected>
      ),
    },

    {
      path: 'myFeedBacks',
      element: (
        <Protected>
          <ViewMyFeedBack />
        </Protected>
      ),
    },
    {
      path: 'units',
      element: (
        <Protected>
          <Units />
        </Protected>
      ),
    },
    {
      path: 'my_units',
      element: (
        <Protected>
          <MyUnits />
        </Protected>
      ),
    },

    {
      path: 'units/view',
      element: (
        <Protected>
          <ViewUnit />
        </Protected>
      ),
    },

    {
      path: 'planning',
      element: (
        <Protected>
          <Planning />
        </Protected>
      ),
    },

    {
      path: 'planning/view',
      element: (
        <Protected>
          <ViewPlan />
        </Protected>
      ),
    },

    {
      path: 'planning/details',
      element: (
        <Protected>
          <PlanDetail />
        </Protected>
      ),
    },
    {
      path: 'feedbacks',
      element: (
        <Protected>
          <FeedBacks />
        </Protected>
      ),
    },
    {
      path: 'coaching',
      element: (
        <Protected>
          <Coaching />
        </Protected>
      ),
    },
    {
      path: 'EODReport',
      element: (
        <Protected>
          <EODReport />
        </Protected>
      ),
    },
    {
      path: 'MyTeamsEODReport',
      element: (
        <Protected>
          <MyTeamsEODReport />
        </Protected>
      ),
    },
    {
      path: 'planning/status',
      element: (
        <Protected>
          <PlanningStatus />
        </Protected>
      ),
    },
    {
      path: 'task/status',
      element: (
        <Protected>
          <TaskStatus />
        </Protected>
      ),
    },
    {
      path: 'monitoring',
      element: (
        <Protected>
          <Monitoring />
        </Protected>
      ),
    },
    {
      path: 'monitoringReport',
      element: (
        <Protected>
          <MonitoringReport />
        </Protected>
      ),
    },
    {
      path: 'Revision',
      element: (
        <Protected>
          <Revision />
        </Protected>
      ),
    },
    {
      path: 'triage-room',
      element: (
        <Protected>
          <TriageRoom />
        </Protected>
      ),
    },
    {
      path: 'Lab',
      element: (
        <Protected>
          <Lab />
        </Protected>
      ),
    },

    {
      path: 'evaluation-approval',
      element: (
        <Protected>
          <EvaluationApproval />
        </Protected>
      ),
    },

    {
      path: 'my-evaluations',
      element: (
        <Protected>
          <MyEvaluations />
        </Protected>
      ),
    },

    {
      path: 'tasks',
      element: (
        <Protected>
          <Tasks />
        </Protected>
      ),
    },

    {
      path: 'task/detail',
      element: (
        <Protected>
          <ViewTask />
        </Protected>
      ),
    },

    {
      path: 'approvals',
      element: (
        <Protected>
          <Approvals />
        </Protected>
      ),
    },
    {
      path: 'approval/view',
      element: (
        <Protected>
          <ViewApprovalTask />
        </Protected>
      ),
    },

    {
      path: 'workflows',
      element: (
        <Protected>
          <Workflows />
        </Protected>
      ),
    },

    {
      path: 'performance',
      element: (
        <Protected>
          <Performance />
        </Protected>
      ),
    },
    {
      path: 'per-kpi-performance',
      element: (
        <Protected>
          <PerKPIPerformanceReport />
        </Protected>
      ),
    },
    {
      path: 'ranking',
      element: (
        <Protected>
          <Ranking />
        </Protected>
      ),
    },
    {
      path: 'ranking',
      element: (
        <Protected>
          <Ranking />
        </Protected>
      ),
    },
    {
      path: 'todo',
      element: (
        <Protected>
          <Todo />
        </Protected>
      ),
    },
    {
      path: 'my-team',
      element: (
        <Protected>
          <MyTeam />
        </Protected>
      ),
    },
    {
      path: 'my-team/member/tasks',
      element: (
        <Protected>
          <ViewTeamMemberTasks />
        </Protected>
      ),
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: (
            <Protected>
              <UtilsColor />
            </Protected>
          ),
        },
      ],
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: (
            <Protected>
              <UtilsShadow />
            </Protected>
          ),
        },
      ],
    },

    {
      path: 'basic-config',
      children: [
        {
          path: 'basic-config-creation',
          element: (
            <Protected>
              <BasicConfigPage />
            </Protected>
          ),
        },
      ],
    },
    {
      path: 'frequencies',
      element: (
        <Protected>
          <Frequencies />
        </Protected>
      ),
    },
    {
      path: 'periods',
      element: (
        <Protected>
          <Periods />
        </Protected>
      ),
    },
    {
      path: 'monitoring-settings',
      element: (
        <Protected>
          <MonitoringSettings />
        </Protected>
      ),
    },
    {
      path: 'measuring-units',
      element: (
        <Protected>
          <MeasuringUnits />
        </Protected>
      ),
    },
    {
      path: 'perspectives',
      element: (
        <Protected>
          <Perspectives />
        </Protected>
      ),
    },

    {
      path: 'performance-rating',
      element: (
        <Protected>
          <PerformanceRating />
        </Protected>
      ),
    },
    {
      path: 'kpi',
      children: [
        {
          path: 'kpi-managment',
          element: (
            <Protected>
              <KPIManagement />
            </Protected>
          ),
        },
      ],
    },

    {
      path: 'Eod',
      element: (
        <Protected>
          <EodActivityPage />
        </Protected>
      ),
    },
    {
      path: 'users',
      element: (
        <Protected>
          <Users />
        </Protected>
      ),
    },
    {
      path: 'Patients',
      element: (
        <Protected>
          <Patients />
        </Protected>
      ),
    },

    {
      path: 'role-permission',
      element: (
        <Protected>
          <RolePermission />
        </Protected>
      ),
    },

    {
      path: 'report',
      element: (
        <Protected>
          <Report />
        </Protected>
      ),
    },

    {
      path: '/report/overall_company',
      element: (
        <Protected>
          <Viewoverallcompany />
        </Protected>
      ),
    },

    {
      path: '/report/KpiDetailView',
      element: (
        <Protected>
          <ViewKpiDetail />
        </Protected>
      ),
    },

    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: 'test',
      element: (
        <Protected>
          <Testpage />
        </Protected>
      ),
    },
    {
      path: 'fortest',
      element: (
        <Protected>
          <Fortest />
        </Protected>
      ),
    },

    {
      path: 'job',
      element: (
        <Protected>
          <Job />
        </Protected>
      ),
    },
    {
      path: 'Doctor_appointment',
      element: (
        <Protected>
          <DoctorAppointment />
        </Protected>
      ),
    },
    {
      path: 'doctors',
      element: (
        <Protected>
          {/* <Doctorlistt /> */} <Doctorlists />
        </Protected>
      ),
    },
    {
      path: 'doctors/view',
      element: (
        <Protected>
          <ViewDoctor />
        </Protected>
      ),
    },
    {
      path: 'doctors/schedule',
      element: (
        <Protected>
          <ScheduleDoctor />
        </Protected>
      ),
    },

    {
      path: 'patientapp',
      element: (
        <Protected>
          <PatientApp />
        </Protected>
      ),
    },
    {
      path: 'patientapp/view',
      element: (
        <Protected>
          <ViewPatientApp />
        </Protected>
      ),
    },
    {
      path: 'register_view',
      element: (
        <Protected>
          <ViewRegisterPatient />
        </Protected>
      ),
    },
    {
      path: 'CarePlan',
      element: (
        <Protected>
          <CarePlan />
        </Protected>
      ),
    },
    {
      path: 'Orders',
      element: (
        <Protected>
          <Orders />
        </Protected>
      ),
    },
    {
      path: 'results',
      element: (
        <Protected>
          <Results />
        </Protected>
      ),
    },
    {
      path: 'active_patients',
      element: (
        <Protected>
          <ActivePatients />
        </Protected>
      ),
    },
    {
      path: 'in_patients',
      element: (
        <Protected>
          <InPatients />
        </Protected>
      ),
    },
    {
      path: 'out_patients',
      element: (
        <Protected>
          <OutPatients />
        </Protected>
      ),
    },
    {
      path: 'results_radio',
      element: (
        <Protected>
          <RadiologyResults />
        </Protected>
      ),
    },
    {
      path: 'orders_radio',
      element: (
        <Protected>
          <RadiologyOrder />
        </Protected>
      ),
    },
    {
      path: 'results_lab',
      element: (
        <Protected>
          <LabResult />
        </Protected>
      ),
    },
    {
      path: 'orders_lab',
      element: (
        <Protected>
          <LabOrder />
        </Protected>
      ),
    },
    {
      path: 'glasses_prescription',
      element: (
        <Protected>
          <GlassesPrescription />
        </Protected>
      ),
    },
    {
      path: 'medicines_inventory',
      element: (
        <Protected>
          <MedicinesInventory />
        </Protected>
      ),
    },
    {
      path: '/*',
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
