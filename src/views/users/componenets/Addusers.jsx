import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AddUser = ({ add, isAdding, roles, rooms, onClose, onSubmit }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roles: [],
    room_id: [],
  });

  const [showPassword, setShowPassword] = useState(false);

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
    if (!userDetails.email || !userDetails.name || !userDetails.password) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(userDetails);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  
  const uniqueRooms = rooms.filter(
    (room, index, self) =>
      index === self.findIndex((r) => r.id === room.id)
  );

  
  console.log('Rooms:', uniqueRooms);

  return (
    <DrogaFormModal
      open={add}
      title="Add User"
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
        label="Email"
        name="email"
        value={userDetails.email}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={userDetails.password}
        onChange={handleChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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

AddUser.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
  rooms: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddUser;