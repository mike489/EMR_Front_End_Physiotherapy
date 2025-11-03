import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

// Ethiopian cities list
const ethiopianCities = [
  'Addis Ababa',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Bahir Dar',
  'Adama',
  'Hawassa',
  'Jimma',
  'Dessie',
  'Jijiga',
];

const ethiopianKifleKetema = [
  'Arada',
  'Lideta',
  'Kirkos',
  'Yeka',
  'Kolfe Keranio',
  'Akaki Kaliti',
  'Nifas Silk Lafto',
  'Gullele',
  'Bole',
  'Addis Ketema',
];

const physiotherapyConditions = [
  'Ankle',
  'Cervical',
  'Elbow',
  'Wrist&Hand',
  'Knee',
  'Lumbar',
  'Shoulder',
  'Thoracic',
  'Neurological/Balance',
  'Hip',
  'Foot',
];

const steps = ['Patient Details', 'Payment ', 'Assignment'];

// Custom Step Icon
const CustomStepIcon = ({ active, completed }) =>
  completed ? (
    <CheckCircle color="success" />
  ) : (
    <CircleOutlined color={active ? 'primary' : 'disabled'} />
  );

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

// Yup validation schemas
const schemas = {
  patientDetails: yup.object().shape({
    full_name: yup
      .string()
      .trim()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: yup.string().email('Invalid email format').nullable(),
    phone: yup
      .string()
      .matches(
        /^[0-9]{9}$/,
        'Phone must be exactly 9 digits (without country code)',
      )
      .required('Phone number is required'),
    date_of_birth: yup
      .string()
      .required('Date of birth is required')
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        'Date of birth must be in YYYY-MM-DD format',
      ),
    gender: yup
      .string()
      .oneOf(['Male', 'Female'], 'Gender must be Male or Female')
      .required('Gender is required'),
    national_id: yup
      .string()
      .trim()
      .matches(/^[0-9]{16}$/, 'National ID must be exactly 16 digits')
      .required('National ID is required'),
    passport_number: yup
      .string()
      .trim()
      .transform((value) => (value ? value.toUpperCase() : null))
      .nullable()
      .notRequired()
      .test(
        'passport-format',
        'Passport number must be 9 characters (2 uppercase letters + 7 digits)',
        (value) => {
          if (!value) return true; // allow empty
          return /^[A-Z]{2}[0-9]{7}$/.test(value);
        },
      ),

    patient_category: yup
      .string()
      .oneOf(['regular', 'vip', 'emergency'], 'Invalid patient category')
      .required('Patient category is required'),

    address: yup.object().shape({
      wereda: yup.string().trim().nullable(),
      city: yup
        .string()
        .oneOf(ethiopianCities, 'City must be a valid Ethiopian city')
        .required('City is required'),
      country: yup
        .string()
        .matches(/^Ethiopia$/, 'Country must be Ethiopia')
        .required('Country is required'),
      kifle_ketema: yup
        .string()
        .oneOf(
          ethiopianKifleKetema,
          'Kifle Ketema must be a valid Ethiopian Kifle Ketema',
        )
        .required('Kifle Ketema is required'),
    }),
  }),

  paymentResponsibility: yup.object().shape({
    payment_method: yup
      .string()
      .oneOf(['self pay', 'credit'], 'Invalid payment method')
      .required('Payment method is required'),
    // amount: yup
    //   .number()
    //   .typeError('Amount must be a number')
    //   .positive('Amount must be positive')
    //   .required('Amount is required'),
    responsible_payer_name: yup.string().when('payment_method', {
      is: 'insurance',
      then: (schema) =>
        schema
          .trim()
          .required('Responsible payer name is required for insurance'),
      otherwise: (schema) => schema.trim().nullable(),
    }),
    responsible_payer_contact: yup.string().when('payment_method', {
      is: 'insurance',
      then: (schema) =>
        schema
          .trim()
          .matches(/^[0-9]{9}$/, 'Payer contact must be exactly 9 digits')
          .required('Responsible payer contact is required for insurance'),
      otherwise: (schema) => schema.trim().nullable(),
    }),
    insurance_policy_number: yup.string().when('payment_method', {
      is: 'insurance',
      then: (schema) =>
        schema
          .trim()
          .required('Insurance policy number is required for insurance'),
      otherwise: (schema) => schema.trim().nullable(),
    }),
  }),
  assignment: yup.object().shape({
    visit_type: yup
      .string()
      .oneOf(
        ['Consultation', 'Physiotherapy', 'Optometry', 'General'],
        'Invalid visit type',
      )
      .nullable(),
    // room_id: yup.string().required('Room selection is required'),
    doctor_id: yup.string().required('Doctor selection is required'),
    // appointed_to: yup.string().required('Organization selection is required'),
    conditions: yup.array().when('visit_type', {
      is: 'Physiotherapy',
      then: (schema) => schema.min(1, 'Select at least one condition'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
};

const AddPatient = ({
  onPatientDetailsSubmit,
  onPaymentSubmit,
  onAssignmentSubmit,
  rooms,
  doctors,
  organizations,
  paymentAmounts,
  onCancel,
  isCardExpired,
  paymentDetails,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId, initialStep = 0, patient = {} } = location.state || {};
  const [activeStep, setActiveStep] = useState(
    Math.min(Math.max(initialStep, 0), 2),
  );
  const [completedSteps, setCompletedSteps] = useState([
    !!patientId,
    !!patientId,
    false,
  ]);

  const amountsArray = paymentAmounts?.card_amount
    ? [paymentAmounts.card_amount]
    : [];

  const defaultValues = {
    full_name: patient.full_name || '',
    email: patient.email || '',
    phone: patient.phone ? patient.phone.replace('+251', '') : '',
    address: {
      wereda: patient.address?.wereda || '',
      city: patient.address?.city || '',
      country: 'Ethiopia',
    },
    date_of_birth: patient.date_of_birth || '',
    gender: patient.gender || 'Male',
    national_id: patient.national_id || '',
    passport_number: patient.passport_number || '',
    patient_category: patient.patient_category || 'regular',
    payment_method: ['self pay', 'credit'].includes(
      paymentDetails?.payment_method,
    )
      ? paymentDetails.payment_method
      : 'self pay',
    // responsible_payer_name: paymentDetails?.responsible_payer_name || '',
    // responsible_payer_contact: paymentDetails?.responsible_payer_contact || '',
    // insurance_policy_number: paymentDetails?.insurance_policy_number || '',
    amount: paymentDetails?.amount || '',
    room_id: patient.room_id?.[0] || '',
    visit_type: patient.visit_type || '',
    doctor_id: patient.doctor_id?.[0] || '',
    organization: paymentDetails?.organization_id || '',
    conditions: patient.conditions || [],
  };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      activeStep === 0
        ? schemas.patientDetails
        : activeStep === 1
          ? schemas.paymentResponsibility
          : schemas.assignment,
    ),
    defaultValues,
  });

  const paymentMethod = watch('payment_method');
  const visitType = watch('visit_type');

  // Update form when activeStep or patient data changes
  useEffect(() => {
    if (patientId || paymentDetails) {
      reset({
        ...defaultValues,
        ...patient,
        phone: patient.phone ? patient.phone.replace('+251', '') : '',
        ...paymentDetails,
        payment_method:
          paymentDetails?.payment_method ||
          paymentDetails?.payment_type ||
          'self pay',

        // room_id: patient.room_id?.[0] || '',
        doctor_id: patient.doctor_id?.[0] || '',
        appointed_to: paymentDetails?.appointed_to || '',
        visit_type: patient.visit_type || '',
      });
    }
  }, [patientId, patient, paymentDetails, reset]);

  // Handle step submission
  const handleStepSubmit = async (data) => {
    try {
      if (activeStep === 0) {
        const patientData = {
          full_name: data.full_name,
          email: data.email || null,
          phone: `251${data.phone}`,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          national_id: data.national_id,
          passport_number: data.passport_number,
          patient_category: data.patient_category,
          address: {
            wereda: data.address.wereda || null,
            city: data.address.city,
            country: data.address.country,
            kifle_ketema: data.address.kifle_ketema,
          },
        };
        const response = await onPatientDetailsSubmit(patientData, patientId);
        if (!response?.success) {
          throw new Error(
            response?.data?.message || 'Failed to save patient details',
          );
        }
        setCompletedSteps((prev) => [true, prev[1], prev[2]]);
        setActiveStep(1);
      } else if (activeStep === 1) {
        const paymentData = {
          payment_method: data.payment_method,
          amount: data.amount,
          organization_id: data.organization || null,
        };
        const response = await onPaymentSubmit(paymentData, patientId);
        if (!response?.success) {
          throw new Error(
            response?.data?.message || 'Failed to save payment details',
          );
        }
        setCompletedSteps((prev) => [prev[0], true, prev[2]]);
        setActiveStep(2);
      } else if (activeStep === 2) {
        const assignmentData = {
          visit_type: data.visit_type || null,
          // room_id: data.room_id,
          doctor_id: data.doctor_id,
          appointed_to: data.appointed_to,
          conditions: data.conditions || [],
        };
        const response = await onAssignmentSubmit(assignmentData, patientId);
        if (!response?.success) {
          throw new Error(
            response?.data?.message || 'Failed to save assignment details',
          );
        }
        setCompletedSteps((prev) => [prev[0], prev[1], true]);
        navigate('/patients');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
      console.error('Submission error:', error);
    }
  };

  // Allow navigation to previous or completed steps
  const handleStepClick = (step) => {
    if (step === activeStep) {
      //  && completedSteps[step]
      setActiveStep(step);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* <Typography variant="h4" gutterBottom>
          {/* {patientId ? 'Edit Patient' : 'Add Patient'} */}
        {/* Add Patient
        </Typography> */}

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step
              key={label}
              completed={completedSteps[index]}
              onClick={() => handleStepClick(index)}
            >
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(handleStepSubmit)}>
          <Grid container spacing={2}>
            {activeStep === 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Patient Details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="full_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name *"
                        margin="normal"
                        error={!!errors.full_name}
                        helperText={errors.full_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone *"
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>+251</Typography>
                          ),
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label="Date of Birth *"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date_of_birth}
                        helperText={errors.date_of_birth?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.gender}
                      >
                        <InputLabel>Gender *</InputLabel>
                        <Select {...field} label="Gender *">
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.gender?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="national_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="National ID *"
                        margin="normal"
                        error={!!errors.national_id}
                        helperText={errors.national_id?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="passport_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Passport Number"
                        margin="normal"
                        error={!!errors.passport_number}
                        helperText={errors.passport_number?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="patient_category"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.patient_category}
                      >
                        <InputLabel>Patient Category *</InputLabel>
                        <Select {...field} label="Patient Category *">
                          <MenuItem value="regular">Regular</MenuItem>
                          <MenuItem value="vip">VIP</MenuItem>
                          <MenuItem value="emergency">Emergency</MenuItem>
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.patient_category?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.address?.city}
                      >
                        <InputLabel>City *</InputLabel>
                        <Select {...field} label="City *">
                          {ethiopianCities.map((city) => (
                            <MenuItem key={city} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.address?.city?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="address.kifle_ketema"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.address?.kifle_ketema}
                      >
                        <InputLabel>Kifle Ketema *</InputLabel>
                        <Select {...field} label="Kifle Ketema *">
                          {ethiopianKifleKetema.map((kebele) => (
                            <MenuItem key={kebele} value={kebele}>
                              {kebele}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.address?.kifle_ketema?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="address.wereda"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Address"
                        margin="normal"
                        error={!!errors.address?.wereda}
                        helperText={errors.address?.wereda?.message}
                      />
                    )}
                  />
                </Grid>
                <input
                  type="hidden"
                  value="Ethiopia"
                  {...{ name: 'address.country' }}
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isCardExpired
                      ? 'Please update payment details.'
                      : 'Enter payment details.'}
                  </Typography>
                </Grid>

                {/* Payment Method */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.payment_method}
                      >
                        <InputLabel>Payment Method *</InputLabel>
                        <Select {...field} label="Payment Method *">
                          <MenuItem value="self pay">Self Pay</MenuItem>
                          <MenuItem value="credit">Credit</MenuItem>
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.payment_method?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Self Pay: List of amounts */}
                {paymentMethod === 'self pay' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Select Amount</Typography>
                    <Box
                      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                    >
                      {(Array.isArray(paymentAmounts)
                        ? paymentAmounts
                        : [paymentAmounts?.card_amount || 0]
                      ).map((amt) => (
                        <Button
                          key={amt}
                          variant={
                            watch('amount') === amt ? 'contained' : 'outlined'
                          }
                          onClick={() => reset({ ...watch(), amount: amt })}
                        >
                          {amt}
                        </Button>
                      ))}
                    </Box>
                  </Grid>
                )}

                {paymentMethod === 'credit' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="organization"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.organization}
                          >
                            <InputLabel>Organization *</InputLabel>
                            <Select {...field} label="Organization">
                              {organizations.length === 0 ? (
                                <MenuItem disabled>
                                  No organizations available
                                </MenuItem>
                              ) : (
                                organizations.map((org) => (
                                  <MenuItem key={org.id} value={org.id}>
                                    {org.name}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            <Typography variant="caption" color="error">
                              {errors.organization?.message}
                            </Typography>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Amount"
                            type="number"
                            margin="normal"
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {activeStep === 2 && (
              <>
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Assign Room and Doctor
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="visit_type"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.visit_type}
                      >
                        <InputLabel>Visit Type</InputLabel>
                        <Select {...field} label="Visit Type">
                          <MenuItem value="Consultation">Consultation</MenuItem>
                          <MenuItem value="Optometry">Optometry</MenuItem>
                          <MenuItem value="Physiotherapy">
                            Physiotherapy
                          </MenuItem>
                          <MenuItem value="General">General / Medical</MenuItem>
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.visit_type?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <Controller
                    name="room_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.room_id}
                      >
                        <InputLabel>Room *</InputLabel>
                        <Select {...field} label="Room *">
                          {rooms.length === 0 ? (
                            <MenuItem disabled>No rooms available</MenuItem>
                          ) : (
                            rooms.map((room) => (
                              <MenuItem key={room.id} value={room.id}>
                                {room.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.room_id?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="doctor_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.doctor_id}
                      >
                        <InputLabel>Doctor *</InputLabel>
                        <Select {...field} label="Doctor *">
                          {doctors.length === 0 ? (
                            <MenuItem disabled>No doctors available</MenuItem>
                          ) : (
                            doctors.map((doctor) => (
                              <MenuItem key={doctor.id} value={doctor.id}>
                                {doctor.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors.doctor_id?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                {visitType === 'Physiotherapy' && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="conditions"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!errors.conditions}
                        >
                          <InputLabel>Conditions *</InputLabel>
                          <Select
                            {...field}
                            multiple
                            label="Conditions *"
                            value={field.value || []}
                            onChange={(e) => field.onChange(e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                          >
                            {physiotherapyConditions.map((condition) => (
                              <MenuItem key={condition} value={condition}>
                                {condition}
                              </MenuItem>
                            ))}
                          </Select>
                          <Typography variant="caption" color="error">
                            {errors.conditions?.message}
                          </Typography>
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onCancel}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                {activeStep < 2 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={activeStep === 1 && isCardExpired}
                  >
                    Next
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

AddPatient.propTypes = {
  onPatientDetailsSubmit: PropTypes.func.isRequired,
  onPaymentSubmit: PropTypes.func.isRequired,
  onAssignmentSubmit: PropTypes.func.isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  isCardExpired: PropTypes.bool.isRequired,
  paymentDetails: PropTypes.shape({
    payment_method: PropTypes.oneOf(['self pay', 'credit']),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    responsible_payer_name: PropTypes.string,
    responsible_payer_contact: PropTypes.string,
    insurance_policy_number: PropTypes.string,
  }),
};

export default AddPatient;
