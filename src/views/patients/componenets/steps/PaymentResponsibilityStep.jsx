import { Controller, useForm } from "react-hook-form";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Backend from "services/backend";
import GetToken from "utils/auth-token";

export const paymentResponsibilitySchema = yup.object().shape({
  payment_type: yup.string().required("Payment type required"),
  amount: yup.string().required("Amount required"),
});

const PaymentResponsibilityStep = ({ patientId, onSuccess }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(paymentResponsibilitySchema),
  });

  const submitPayment = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${GetToken()}` };
      const resp = await Backend.post("/payment-responsibilities", { ...data, patient_id: patientId }, { headers });
      toast.success("Payment responsibility saved");
      onSuccess(resp.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving payment responsibility");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPayment)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Payment Responsibility</Typography>
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="payment_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.payment_type}>
                <InputLabel>Payment Type</InputLabel>
                <Select {...field}>
                  <MenuItem value="self pay">Self Pay</MenuItem>
                  <MenuItem value="insurance">Insurance</MenuItem>
                  <MenuItem value="government">Government</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                <Typography variant="caption" color="error">{errors.payment_type?.message}</Typography>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Amount" error={!!errors.amount} helperText={errors.amount?.message} />
            )}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Save & Next</Button>
    </form>
  );
};

export default PaymentResponsibilityStep;
