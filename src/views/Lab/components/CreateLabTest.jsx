import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const CreateLabTest = ({ add, isAdding, onClose, onSubmit }) => {
  const [labTestGroup, setLabTestGroup] = useState({
    name: '',
    description: '',
    tests: [],
  });

  const [currentTest, setCurrentTest] = useState({
    name: '',
    price: '',
    description: '',
  });

  const handleGroupChange = (event) => {
    const { name, value } = event.target;
    setLabTestGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestChange = (event) => {
    const { name, value } = event.target;
    setCurrentTest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTest = () => {
    if (
      !currentTest.name.trim() ||
      !currentTest.price ||
      !currentTest.description.trim()
    ) {
      toast.error('Please fill all test fields (name, price, description)');
      return;
    }

    if (isNaN(currentTest.price) || parseFloat(currentTest.price) <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    setLabTestGroup((prev) => ({
      ...prev,
      tests: [
        ...prev.tests,
        {
          ...currentTest,
          price: parseFloat(currentTest.price),
        },
      ],
    }));

    // Reset current test form
    setCurrentTest({
      name: '',
      price: '',
      description: '',
    });
  };

  const handleRemoveTest = (index) => {
    setLabTestGroup((prev) => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!labTestGroup.name.trim() || !labTestGroup.description.trim()) {
      toast.error('Please fill all required group fields');
      return;
    }

    if (labTestGroup.tests.length === 0) {
      toast.error('Please add at least one test');
      return;
    }

    // Prepare data in the format expected by backend
    const submitData = {
      name: labTestGroup.name,
      description: labTestGroup.description,
      tests: labTestGroup.tests.map((test) => ({
        name: test.name,
        price: test.price.toString(), // Convert to string if backend expects string
        description: test.description,
      })),
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    // Reset form on close
    setLabTestGroup({
      name: '',
      description: '',
      tests: [],
    });
    setCurrentTest({
      name: '',
      price: '',
      description: '',
    });
    onClose();
  };

  return (
    <DrogaFormModal
      open={add}
      title="Create Lab Test Group"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={isAdding}
      maxWidth="md"
      fullWidth
    >
      <Grid container spacing={3}>
        {/* Group Information */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ScienceIcon color="primary" />
            <Typography variant="h6" color="primary">
              Test Group Information
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Group Name"
            name="name"
            value={labTestGroup.name}
            onChange={handleGroupChange}
            required
            margin="normal"
            placeholder="e.g., Ocular Surface & Tear Film Test"
          />

          <TextField
            fullWidth
            label="Group Description"
            name="description"
            value={labTestGroup.description}
            onChange={handleGroupChange}
            required
            multiline
            rows={3}
            margin="normal"
            placeholder="e.g., Specialized tests to evaluate tear production, tear film stability, and ocular surface health..."
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Add Tests Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Add Tests
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Test Name"
                  name="name"
                  value={currentTest.name}
                  onChange={handleTestChange}
                  margin="normal"
                  size="small"
                  placeholder="e.g., Schirmer's Test"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  name="price"
                  type="number"
                  value={currentTest.price}
                  onChange={handleTestChange}
                  margin="normal"
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Test Description"
                  name="description"
                  value={currentTest.description}
                  onChange={handleTestChange}
                  margin="normal"
                  size="small"
                  placeholder="e.g., Measures tear production using filter paper strips..."
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  variant="contained"
                  onClick={handleAddTest}
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                  disabled={
                    !currentTest.name ||
                    !currentTest.price ||
                    !currentTest.description
                  }
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Added Tests List */}
          {labTestGroup.tests.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Added Tests ({labTestGroup.tests.length})
              </Typography>

              <Paper variant="outlined" sx={{ p: 2 }}>
                {labTestGroup.tests.map((test, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      mb: 1,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                    }}
                  >
                    <Box flex={1}>
                      <Typography variant="subtitle2" gutterBottom>
                        {test.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {test.description}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        ml: 2,
                      }}
                    >
                      <Chip
                        label={`₹${test.price}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveTest(index)}
                        aria-label="Remove test"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </DrogaFormModal>
  );
};

CreateLabTest.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateLabTest;
