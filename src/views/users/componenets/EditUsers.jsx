import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const EditUser = ({ edit, isUpdating, userData = {}, roles, rooms, onClose, onSubmit }) => {
  const { name: userName, email: userEmail, phone: userPhone, roles: userRoles = [], room_id: userRoom = [] } = userData;

  const [userDetails, setUserDetails] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: userPhone || '',
    roles: userRoles.map((role) => role.uuid) || [],
    room_id: userRoom.map((room) => room.id) || [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleRoleChange = (event, value) => {
    const selectedRoleIds = value.map((role) => role.uuid);
    setUserDetails({ ...userDetails, roles: selectedRoleIds });
  };

  const handleRoomChange = (event, value) => {
    const selectedRoomIds = value.map((room) => room.id);
    setUserDetails({ ...userDetails, room_id: selectedRoomIds });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email } = userDetails;
    if (!email || !name) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(userDetails);
  };

 
  const uniqueRooms = rooms.filter(
    (room, index, self) =>
      index === self.findIndex((r) => r.id === room.id)
  );

  console.log('Rooms:', uniqueRooms);
  console.log('User Room IDs:', userDetails.room_id);

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
        label="Email"
        name="email"
        value={userDetails.email}
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
      />

      <Autocomplete
        multiple
        options={roles}
        getOptionLabel={(option) => option.name || ''}
        value={roles.filter((role) => userDetails.roles.includes(role.uuid))}
        onChange={handleRoleChange}
        renderInput={(params) => (
          <TextField {...params} label="Roles" margin="normal" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.uuid}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
      />

      <Autocomplete
        multiple
        options={uniqueRooms}
        getOptionLabel={(option) => option.name || ''}
        value={uniqueRooms.filter((room) => userDetails.room_id.includes(room.id))}
        onChange={handleRoomChange}
        renderInput={(params) => (
          <TextField {...params} label="Rooms" margin="normal" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </DrogaFormModal>
  );
};

EditUser.propTypes = {
  edit: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  userData: PropTypes.object,
  roles: PropTypes.array.isRequired,
  rooms: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditUser;