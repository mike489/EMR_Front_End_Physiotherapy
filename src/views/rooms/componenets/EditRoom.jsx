import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const EditRoom = ({ edit, isUpdating, userData = {}, onClose, onSubmit }) => {
  const { name: userName, description: userDescription } = userData;

  const [userDetails, setUserDetails] = useState({
    name: userName || '',
    description: userDescription || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, description } = userDetails;
    if (!description || !name) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(userDetails);
  };

  return (
    <DrogaFormModal
      open={edit}
      title="Edit User"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={isUpdating}
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

EditRoom.propTypes = {
  edit: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  userData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditRoom;
