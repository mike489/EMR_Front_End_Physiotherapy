import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { DotMenu } from 'ui-component/menu/DotMenu';
import { format } from 'date-fns';
import { IconCircleCheckFilled, IconForbid } from '@tabler/icons-react';
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import AddUser from './componenets/Addusers';
import EditUser from './componenets/EditUsers';
import hasPermission from 'utils/auth/hasPermission';
import ChangePassword from './componenets/ChangePassword';
import AddButton from 'ui-component/buttons/AddButton';

const Users = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [add, setAdd] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rooms, setRooms] = useState([]); // State for rooms
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Normalize and check active status in a case-insensitive way
  const isActive = (status) => String(status ?? '').toLowerCase() === 'active';

  const getResponseMessage = (response, fallbackMessage) =>
    response?.data?.message ??
    response?.data?.data?.message ??
    response?.message ??
    fallbackMessage;

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleSearchFieldChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setPagination({ ...pagination, page: 0 });
  };

  const handleFetchingUsers = async () => {
    setLoading(true);
    const token = await GetToken();
    const Api =
      Backend.auth +
      Backend.users +
      `?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, { method: 'GET', headers: header })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setData(response.data.data);
          setPagination({
            ...pagination,
            last_page: response.data.last_page,
            total: response.data.total,
          });
          setError(false);
        } else {
          toast.warning(response.data?.data?.message || response.data?.message || 'Failed to fetch users');
        }
      })
      .catch((error) => {
        toast.warning('Failed to fetch users');
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUserAddition = async (value) => {
    setIsAdding(true);
    const token = await GetToken();
    const Api = Backend.auth + Backend.users;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      email: value.email,
      name: value.name,
      phone: value.phone,
      password: value.password,
      roles: value.roles,
      room_id: value.room_id, 
    };

    if (!value.email || !value.name || !value.password) {
      toast.error('Please fill all required fields.');
      setIsAdding(false);
      return;
    }

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.data.message || 'Error adding user');
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.data.message);
        handleFetchingUsers();
        handleUserModalClose();
      } else {
        toast.error(responseData.data?.message || responseData?.message || 'Failed to add user.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleFetchingRoles = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.roles}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, { method: 'GET', headers: header })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setRoles(response.data);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const handleFetchingRooms = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.rooms}`; 
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, { method: 'GET', headers: header })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setRooms(response.data);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const handleUpdatingUser = async (updatedData) => {
    setIsUpdating(true);
    const token = await GetToken();

    const Api = `${Backend.auth}${Backend.users}/${selectedRow?.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      roles: updatedData.roles,
      room_id: updatedData.room_id,
    };

    try {
      const response = await fetch(Api, {
        method: 'PATCH',
        headers: header,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error updating user');
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success('User updated successfully');
        setIsUpdating(false);
        handleFetchingUsers();
        handleUpdateUserClose();
      } else {
        setIsUpdating(false);
        toast.error('Failed to update user.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatingPassword = async (updatedPassword) => {
    if (!selectedRow) {
      toast.error('User selection is required to change the password');
      return;
    }

    setIsUpdating(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.changeuserPassword}/${selectedRow?.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      password: updatedPassword.newPassword,
      confirm_password: updatedPassword.confirmNewPassword,
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Password updated successfully');
        setIsUpdating(false);
        handleFetchingUsers();
        handleChangePasswordClose();
      } else {
        toast.error(responseData.data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUserStatus = async (user) => {
    setIsUpdating(true);

    const token = await GetToken();
    if (!token) {
      toast.error('Authorization token is missing.');
      setIsUpdating(false);
      return;
    }

    const Api = Backend.auth + Backend.userStatus + `/${user?.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      status: isActive(user?.status) ? 'inactive' : 'active',
    };

    fetch(Api, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          toast.success(response?.data?.message ?? 'Status updated successfully');
          handleFetchingUsers();
        } else {
          toast.error(getResponseMessage(response, 'Failed to update user status.'));
        }
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to update user status.');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleUserModalClose = () => {
    setAdd(false);
  };

  const handleUserUpdate = (updatedData) => {
    setSelectedRow(updatedData);
    handleFetchingRoles();
    handleFetchingRooms();
    setUpdate(true);
  };

  const handleUpdateUserClose = () => {
    setUpdate(false);
    setSelectedRow(null);
  };

  const handleChangePasswordClose = () => {
    setChange(false);
    setSelectedRow(null);
  };

  const handlePasswordUpdate = (updatedPassword) => {
    setChange(true);
    setSelectedRow(updatedPassword);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingUsers();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingUsers();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  const handleAddUserClick = () => {
    setAdd(true);
    handleFetchingRoles();
    handleFetchingRooms(); 
  };

  return (
    <PageContainer title="Users">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Grid item xs={10} md={12} marginBottom={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Search
                title="Search Employees"
                value={search}
                onChange={handleSearchFieldChange}
                filter={false}
              />
              {hasPermission('create_user') && (
                <AddButton title="Add User" onPress={handleAddUserClick} />
              )}
            </Box>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {loading ? (
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                    }}
                  >
                    <ActivityIndicator size={20} />
                  </Grid>
                </Grid>
              ) : error ? (
                <ErrorPrompt
                  title="Server Error"
                  message="Unable to retrieve users."
                />
              ) : data.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="User Not Found"
                  description="The list of users will be listed here."
                  sx={{ paddingTop: 6 }}
                />
              ) : (
                <TableContainer
                  sx={{
                    minHeight: '66dvh',
                    border: 0.4,
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                  }}
                >
                  <Table aria-label="users table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>User Id</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Roles</TableCell>
                        {/* <TableCell>Rooms</TableCell> */}
                        <TableCell>Created At</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow
                          key={item.id}
                          sx={{
                            ':hover': {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell>{item?.name}</TableCell>
                          <TableCell>{item?.username}</TableCell>
                          <TableCell>{item?.email}</TableCell>
                          <TableCell>{item?.phone}</TableCell>
                          <TableCell>
                            {item?.roles.map((role) => (
                              <Chip
                                key={role.id}
                                label={role.name}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ margin: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          {/* <TableCell>
                            {item?.rooms?.map((room) => (
                              <Chip
                                key={room.id}
                                label={room.name}
                                color="secondary"
                                variant="outlined"
                                size="small"
                                sx={{ margin: 0.5 }}
                              />
                            ))}
                          </TableCell> */}
                          <TableCell>
                            {format(new Date(item.created_at), 'dd-MM-yyyy')}
                          </TableCell>
                          <TableCell>
                            {isActive(item?.status) ? (
                              <Chip
                                label="Active"
                                sx={{
                                  backgroundColor: '#d8edd9',
                                  color: 'green',
                                }}
                              />
                            ) : (
                              <Chip
                                label="Inactive"
                                sx={{
                                  backgroundColor: '#f7e4e4',
                                  color: 'red',
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              ':hover': {
                                backgroundColor: theme.palette.grey[50],
                              },
                            }}
                          >
                            <DotMenu
                              onEdit={
                                hasPermission('update_user')
                                  ? () => handleUserUpdate(item)
                                  : null
                              }
                              onChangePassword={
                                hasPermission('update_user')
                                  ? () => handlePasswordUpdate(item)
                                  : null
                              }
                              status={
                                isActive(item?.status)
                                  ? 'Inactivate'
                                  : 'Activate'
                              }
                              statusIcon={
                                isActive(item?.status) ? (
                                  <IconForbid
                                    size={18}
                                    style={{ color: '#a34' }}
                                  />
                                ) : (
                                  <IconCircleCheckFilled
                                    size={18}
                                    style={{ color: '#008000' }}
                                  />
                                )
                              }
                              onStatusChange={
                                hasPermission('update_user')
                                  ? () => handleUserStatus(item)
                                  : null
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={pagination.total}
                    page={pagination.page}
                    onPageChange={handleChangePage}
                    rowsPerPage={pagination.per_page}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
      <AddUser
        add={add}
        roles={roles}
        rooms={rooms} 
        onClose={handleUserModalClose}
        onSubmit={handleUserAddition}
        isAdding={isAdding}
      />
      {selectedRow && (
        <EditUser
          edit={update}
          roles={roles}
          rooms={rooms} 
          isUpdating={isUpdating}
          userData={selectedRow}
          onClose={handleUpdateUserClose}
          onSubmit={handleUpdatingUser}
        />
      )}
      {selectedRow && (
        <ChangePassword
          change={change}
          user={selectedRow}
          onClose={handleChangePasswordClose}
          onSubmit={handleUpdatingPassword}
          isUpdating={isUpdating}
        />
      )}
    </PageContainer>
  );
};

export default Users;