import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const AddRoom = ({ add, isAdding, onClose, onSubmit }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userDetails.description || !userDetails.name) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(userDetails);
  };

  return (
    <DrogaFormModal
      open={add}
      title="Add Room"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={(event) => handleSubmit(event)}
      submitting={isAdding}
    >
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={userDetails.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={userDetails.description}
        onChange={handleChange}
        margin="normal"
        required
      />
    </DrogaFormModal>
  );
};
AddRoom.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddRoom;
