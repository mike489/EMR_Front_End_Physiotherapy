import { Controller, useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

// ✅ Validation schema
export const patientDetailsSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").nullable(),
  phone: yup
    .string()
    .matches(/^[0-9]{9}$/, "Phone must be 9 digits")
    .required("Phone is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  patient_category: yup.string().required("Patient category is required"),
  visit_type: yup.string().required("Visit type is required"),
  address: yup.object().shape({
    wereda: yup.string().nullable(),
    city: yup.string().required("City is required"),
    country: yup.string().default("Ethiopia"),
  }),
});

const ethiopianCities = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Bahir Dar",
  "Adama",
  "Hawassa",
  "Jimma",
  "Dessie",
  "Jijiga",
];

const PatientDetailsStep = ({ patientId, onSuccess }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(patientDetailsSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      patient_category: "",
      visit_type: "",
      address: { wereda: "", city: "", country: "Ethiopia" },
    },
  });

  // ✅ Submit handler
  const submitDetails = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${GetToken()}` };
      const resp = patientId
        ? await Backend.put(`/patients/${patientId}`, data, { headers })
        : await Backend.post("/patients", data, { headers });

      toast.success("Patient details saved");
      onSuccess(resp.data.data?.id || patientId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving patient details");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitDetails)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Patient Details</Typography>
        </Grid>

        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name *"
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
              />
            )}
          />
        </Grid>

        {/* Email */}
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
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone (+251)"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} md={6}>
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
              />
            )}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} md={6}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select {...field}>
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

        {/* Patient Category */}
        <Grid item xs={12} md={6}>
          <Controller
            name="patient_category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.patient_category}>
                <InputLabel>Patient Category</InputLabel>
                <Select {...field}>
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

        {/* Visit Type */}
        <Grid item xs={12} md={6}>
          <Controller
            name="visit_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.visit_type}>
                <InputLabel>Visit Type</InputLabel>
                <Select {...field}>
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
                <Typography variant="caption" color="error">
                  {errors.visit_type?.message}
                </Typography>
              </FormControl>
            )}
          />
        </Grid>

        {/* Wereda */}
        <Grid item xs={12} md={6}>
          <Controller
            name="address.wereda"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Wereda"
                error={!!errors.address?.wereda}
                helperText={errors.address?.wereda?.message}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} md={6}>
          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.address?.city}>
                <InputLabel>City</InputLabel>
                <Select {...field}>
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
      </Grid>

      {/* Country hidden input */}
      <input type="hidden" value="Ethiopia" {...control.register?.("address.country")} />

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Save & Next
      </Button>
    </form>
  );
};

export default PatientDetailsStep;
