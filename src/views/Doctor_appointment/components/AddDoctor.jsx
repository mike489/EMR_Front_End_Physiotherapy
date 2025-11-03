import { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import DrogaFormModal from "ui-component/modal/DrogaFormModal";

const AddDoctor = ({ add, isAdding, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phone: "",
    email: "",
    period: "",
    timeSlot: { from: "", to: "" },
    customDays: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // restrict phone to digits only
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setUserDetails({ ...userDetails, [name]: digitsOnly });
      return;
    }

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleCheckboxChange = (day) => {
    const { customDays } = userDetails;
    if (customDays.includes(day)) {
      setUserDetails({
        ...userDetails,
        customDays: customDays.filter((d) => d !== day),
      });
    } else {
      setUserDetails({
        ...userDetails,
        customDays: [...customDays, day],
      });
    }
  };

  const handleTimeChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      timeSlot: { ...userDetails.timeSlot, [name]: value },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails.fullName || !userDetails.phone || !userDetails.email || !userDetails.period) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (userDetails.period === "custom") {
      if (!userDetails.timeSlot.from || !userDetails.timeSlot.to) {
        toast.error("Please provide time slot for custom period.");
        return;
      }
      if (userDetails.customDays.length === 0) {
        toast.error("Please select at least one custom day.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await fetch("https://emrbackend.risegmbh.com/api/availabilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor availability");
      }

      toast.success("Doctor availability added successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <DrogaFormModal
      open={add}
      title="Add Doctor"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={(event) => handleSubmit(event)}
      submitting={submitting || isAdding}
    >
      <TextField
        fullWidth
        label="Full Name"
        name="fullName"
        value={userDetails.fullName}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={userDetails.phone}
        onChange={handleChange}
        margin="normal"
        required
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={userDetails.email}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        select
        fullWidth
        label="Period"
        name="period"
        value={userDetails.period}
        onChange={handleChange}
        margin="normal"
        required
      >
        <MenuItem value="weekends">Weekends</MenuItem>
        <MenuItem value="weekdays">Weekdays</MenuItem>
        <MenuItem value="everyday">Everyday</MenuItem>
        <MenuItem value="custom">Custom</MenuItem>
      </TextField>

      {userDetails.period === "custom" && (
        <>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="From"
                name="from"
                value={userDetails.timeSlot.from}
                onChange={handleTimeChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="To"
                name="to"
                value={userDetails.timeSlot.to}
                onChange={handleTimeChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <FormGroup sx={{ mt: 2 }}>
            {days.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={userDetails.customDays.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </>
      )}
    </DrogaFormModal>
  );
};

// AddDoctor.propTypes = {
//   add: PropTypes.bool.isRequired,
//   isAdding: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };

export default AddDoctor;
