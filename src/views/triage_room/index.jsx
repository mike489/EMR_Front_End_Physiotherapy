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
import PageContainer from 'ui-component/MainPage';
import Backend from 'services/backend';
import Search from 'ui-component/search';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import AddButton from 'ui-component/buttons/AddButton';
import AddRoom from './componenets/AddRoom';
import EditRoom from './componenets/EditRoom';
// import AddTriageRoom from './componenets/AddTriageRoom';
// import EditTriageRoom from './componenets/EditTriageRoom';

const TriageRoom = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [add, setAdd] = useState(false);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [update, setUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);

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

  const handleFetchingRooms = async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.rooms}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch triage rooms');
      }

      if (responseData.success) {
        setData(responseData.data);
        setPagination({
          ...pagination,
          last_page: responseData.last_page || 1,
          total: responseData.total || responseData.data.length,
        });
        setError(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomAddition = async (roomData) => {
    setIsAdding(true);
    const token = await GetToken();
    const Api = Backend.auth + Backend.rooms;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(roomData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      if (responseData.success) {
        toast.success('Triage room added successfully');
        handleFetchingRooms();
        handleRoomModalClose();
      } else {
        toast.error(responseData?.message || 'Failed to add triage room');
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdatingRooms = async (updatedData) => {
    setIsUpdating(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.rooms}/${selectedRow?.id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'PATCH',
        headers: header,
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update triage room');
      }

      if (responseData.success) {
        toast.success('Triage room updated successfully');
        handleFetchingRooms();
        handleUpdateRoomClose();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoomModalClose = () => {
    setAdd(false);
  };

  const handleRoomUpdate = (roomData) => {
    setSelectedRow(roomData);
    setUpdate(true);
  };

  const handleUpdateRoomClose = () => {
    setUpdate(false);
    setSelectedRow(null);
  };

  const handleAddRoomClick = () => {
    setAdd(true);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingRooms();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingRooms();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  return (
    <PageContainer title="Triage Rooms">
      <Grid container>
        <Grid item xs={12} padding={3}>
          <Grid item xs={10} md={12} marginBottom={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Search
                title="Search Rooms"
                value={search}
                onChange={handleSearchFieldChange}
                filter={false}
              />
              <AddButton title="Add Room" onPress={handleAddRoomClick} />
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
                  message="Unable to retrieve triage rooms."
                />
              ) : data.length === 0 ? (
                <Fallbacks
                  severity="evaluation"
                  title="Triage Rooms Not Found"
                  description="The list of triage rooms will be listed here."
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
                  <Table aria-label="triage rooms table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        {/* <TableCell>Status</TableCell> */}
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((room) => (
                        <TableRow
                          key={room.id}
                          sx={{
                            ':hover': {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell>{room.name}</TableCell>
                          <TableCell>{room.description}</TableCell>
                          {/* <TableCell>
                            <Chip
                              label={room.deleted_at ? 'Inactive' : 'Active'}
                              color={room.deleted_at ? 'error' : 'success'}
                            />
                          </TableCell> */}
                          <TableCell>
                            <DotMenu onEdit={() => handleRoomUpdate(room)} />
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
      <AddRoom
        add={add}
        onClose={handleRoomModalClose}
        onSubmit={handleRoomAddition}
        isAdding={isAdding}
      />
      {selectedRow && (
        <EditRoom
          edit={update}
          isUpdating={isUpdating}
          userData={selectedRow}
          onClose={handleUpdateRoomClose}
          onSubmit={handleUpdatingRooms}
        />
      )}
    </PageContainer>
  );
};

export default TriageRoom;
