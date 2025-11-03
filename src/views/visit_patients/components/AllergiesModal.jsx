import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Grid,
  Box,
  Chip,
  Button,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const AllergiesModal = ({ add, isAdding, onClose, onSubmit }) => {
  const [patientDetails, setPatientDetails] = useState({
    medical_history: [],
    allergies: [],
    medical_conditions: [],
  });

  const [currentMedicalHistory, setCurrentMedicalHistory] = useState('');
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [currentMedicalCondition, setCurrentMedicalCondition] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('address[')) {
      const field = name.replace('address[', '').replace(']', '');
      setPatientDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setPatientDetails({ ...patientDetails, [name]: value });
    }
  };

  const handleArrayFieldAdd = (field, currentValue, setCurrentValue) => {
    if (currentValue.trim()) {
      setPatientDetails((prev) => ({
        ...prev,
        [field]: [...prev[field], currentValue.trim()],
      }));
      setCurrentValue('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!patientDetails.allergies || !patientDetails.medical_conditions) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(patientDetails);
    setPatientDetails(initialPatientState);
  };

  const handleRoomsChange = (event) => {
    const selectedRooms = event.target.value;
    setPatientDetails({ ...patientDetails, room_id: selectedRooms });
  };
  const handleDoctorChange = (event) => {
    const selectedDoctor = event.target.value;
    setPatientDetails({ ...patientDetails, doctor_id: selectedDoctor });
  };

  return (
    <DrogaFormModal
      open={add}
      title="Add Allergies"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={isAdding}
    >
      <Grid item xs={12}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            label="Add Medical History"
            value={currentMedicalHistory}
            onChange={(e) => setCurrentMedicalHistory(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={() =>
              handleArrayFieldAdd(
                'medical_history',
                currentMedicalHistory,
                setCurrentMedicalHistory,
              )
            }
            sx={{ ml: 2 }}
          >
            Add
          </Button>
        </Box>
        {patientDetails.medical_history.length > 0 && (
          <div>
            <strong>Medical History:</strong>
            <ul>
              {patientDetails.medical_history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            label="Add Allergy"
            value={currentAllergy}
            onChange={(e) => setCurrentAllergy(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={() =>
              handleArrayFieldAdd(
                'allergies',
                currentAllergy,
                setCurrentAllergy,
              )
            }
            sx={{ mt: 2, mb: 2 }}
          >
            Add
          </Button>
        </Box>
        {patientDetails.allergies.length > 0 && (
          <div>
            <strong>Allergies:</strong>
            <ul>
              {patientDetails.allergies.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            label="Add Medical Condition"
            value={currentMedicalCondition}
            onChange={(e) => setCurrentMedicalCondition(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={() =>
              handleArrayFieldAdd(
                'medical_conditions',
                currentMedicalCondition,
                setCurrentMedicalCondition,
              )
            }
            sx={{ mt: 2, mb: 2 }}
          >
            Add
          </Button>
        </Box>
        {patientDetails.medical_conditions.length > 0 && (
          <div>
            <strong>Medical Conditions:</strong>
            <ul>
              {patientDetails.medical_conditions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </Grid>
    </DrogaFormModal>
  );
};

AllergiesModal.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  rooms: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AllergiesModal;
