import { Controller, useForm } from "react-hook-form";
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Button } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

export const assignmentSchema = yup.object().shape({
  room_id: yup.array().of(yup.string()).min(1, "Select a room"),
  doctor_id: yup.array().of(yup.string()).min(1, "Select a doctor"),
});

const AssignmentStep = ({ patientId, rooms, doctors, onSuccess }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(assignmentSchema),
    defaultValues: { room_id: [], doctor_id: [] },
  });

  const submitAssignment = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${GetToken()}` };
      await Backend.post("/assignments", { ...data, patient_id: patientId }, { headers });
      toast.success("Assignment saved");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving assignment");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitAssignment)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Assignment</Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="room_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.room_id}>
                <InputLabel>Room</InputLabel>
                <Select value={field.value || []} onChange={(e) => field.onChange([e.target.value])}>
                  {rooms.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                </Select>
                <Typography variant="caption" color="error">{errors.room_id?.message}</Typography>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="doctor_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.doctor_id}>
                <InputLabel>Doctor</InputLabel>
                <Select value={field.value || []} onChange={(e) => field.onChange([e.target.value])}>
                  {doctors.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </Select>
                <Typography variant="caption" color="error">{errors.doctor_id?.message}</Typography>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Finish</Button>
    </form>
  );
};

export default AssignmentStep;
