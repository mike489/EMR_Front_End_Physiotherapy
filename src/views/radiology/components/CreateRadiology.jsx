
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const CreateRadiology = ({ add, isAdding, onClose, onSubmit }) => {
  const [test, setTest] = useState({
    name: '',
    price: '',
    description: '',
  });

  const handleTestChange = (event) => {
    const { name, value } = event.target;
    setTest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!test.name.trim() || !test.description.trim()) {
      toast.error('Please fill all required fields (name, description)');
      return;
    }

    if (!test.price || isNaN(test.price) || parseFloat(test.price) <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    // Prepare data in the format expected by backend
    const submitData = {
      name: test.name,
      description: test.description,
      price: parseFloat(test.price).toString(), // Convert to string if backend expects string
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    // Reset form on close
    setTest({
      name: '',
      price: '',
      description: '',
    });
    onClose();
  };

  return (
    <DrogaFormModal
      open={add}
      title="Create Radiology "
      handleClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      submitting={isAdding}
      maxWidth="sm"
      fullWidth
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Radiology Details
          </Typography>

          <TextField
            fullWidth
            label="Radiology Name"
            name="name"
            value={test.name}
            onChange={handleTestChange}
            required
            margin="normal"
            placeholder="e.g., Schirmer's Radiology"
          />

          <TextField
            fullWidth
            label="Price "
            name="price"
            type="number"
            value={test.price}
            onChange={handleTestChange}
            required
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            placeholder="e.g., 500.00"
          />

          <TextField
            fullWidth
            label="Radiology Description"
            name="description"
            value={test.description}
            onChange={handleTestChange}
            required
            multiline
            rows={3}
            margin="normal"
            placeholder="e.g., Measures tear production using filter paper strips..."
          />
        </Grid>
      </Grid>
    </DrogaFormModal>
  );
};

CreateRadiology.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRadiology;