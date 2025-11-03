import {
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';
import { toast } from 'react-toastify';

// Define available visit types (adjust based on your backend requirements)
const visitTypes = [
  { id: 'consultation', name: 'Consultation' },
  { id: 'follow-up', name: 'Follow-up' },
  { id: 'emergency', name: 'Emergency' },
];

const SendToRoomModal = ({
  open,
  onClose,
  patient,
  rooms,
  doctors,
  onSubmit,
}) => {
  const [patientDetails, setPatientDetails] = useState({
    room_id: '', // Single value for room
    // doctor_id: '', // Single value for doctor
    // visit_type: '', // Visit type
  });

  const handleRoomsChange = (event) => {
    const selectedRoom = event.target.value;
    setPatientDetails({ ...patientDetails, room_id: selectedRoom });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!patientDetails.room_id) {
      toast.error('Please select a visit type, a room, and a doctor.');
      return;
    }
    if (typeof onSubmit === 'function') {
      onSubmit(patientDetails);
      setPatientDetails({ room_id: '', doctor_id: '', visit_type: '' });
    } else {
      console.error('onSubmit is not a function');
    }
  };

  return (
    <DrogaFormModal
      title={'Send Patient to Room'}
      open={open}
      onClose={onClose}
      handleClose={onClose}
      onSubmit={handleSubmit}
      onCancel={onClose}
    >
      <DialogContent>
        <DialogContentText>
          Select a room to send {patient?.patient_name || 'the patient'} to:
        </DialogContentText>
        {/* 
        Visit Type Selection
        <FormControl fullWidth margin="normal">
          <InputLabel>Visit Type</InputLabel>
          <Select
            label="Visit Type"
            value={patientDetails.visit_type}
            onChange={handleVisitTypeChange}
          >
            {visitTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                <Typography variant="body1">{type.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* Room Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Room</InputLabel>
          <Select
            label="Room"
            value={patientDetails.room_id}
            onChange={handleRoomsChange}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                <Typography variant="body1">{room.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Doctor Selection */}
        {/* <FormControl fullWidth margin="normal">
          <InputLabel>Doctor</InputLabel>
          <Select
            label="Doctor"
            value={patientDetails.doctor_id}
            onChange={handleDoctorChange}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                <Typography variant="body1">{doctor.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </DialogContent>
    </DrogaFormModal>
  );
};

SendToRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.shape({
    patient_name: PropTypes.string,
  }),
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
  // doctors: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.number,
  //     name: PropTypes.string,
  //   }),
  // ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SendToRoomModal;
