import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import PageContainer from 'ui-component/MainPage';
import AddButton from 'ui-component/buttons/AddButton';
import CreateRadiology from './components/CreateRadiology';
import { DotMenu } from 'ui-component/menu/DotMenu';
import hasPermission from 'utils/auth/hasPermission';
import EditRadiology from './components/EditRadiology';

const Radiology = () => {
  const [radiology, setRadiology] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [add, setAdd] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState(null);

  const handleFetchingRadiology = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologyDepartments}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setRadiology(responseData.data.data || responseData.data);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRadiologyTest = async (radiologyTestData) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologyDepartments}`;
    const header = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    setSubmitting(true);
    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(radiologyTestData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Radiology test created successfully!');
        handleAddRadiologyTestClose();
        handleFetchingRadiology();
      } else {
        toast.error(responseData.message || 'Failed to create radiology test');
      }
    } catch (error) {
      toast.error('Error creating radiology test: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    handleFetchingRadiology();
  }, []);

  const handleAddRadiologyTestClose = () => {
    setAdd(false);
  };

  const handleAddRadiologyClick = () => {
    setAdd(true);
  };

  const handleEditClick = (test) => {
    setSelectedTest(test);
    setEditTestModalOpen(true);
  };

  const handleEditRadiology = async (radiologyTestId, updatedData) => {
    setIsUpdating(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.radiologyDepartments}/${radiologyTestId}`;
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
        throw new Error(
          responseData.message || 'Failed to update radiology test',
        );
      }

      if (responseData.success) {
        toast.success('Radiology test updated successfully');
        handleFetchingRadiology();
        setEditModalOpen(false);
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRadiologyTest = async (radiologyTestId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.updateRadiologyTests}/${radiologyTestId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'DELETE',
        headers: header,
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Radiology test deleted successfully');
        handleFetchingRadiology();
        setEditTestModalOpen(false);
      } else {
        toast.error(
          responseData.data.message || 'Failed to delete radiology test',
        );
      }
    } catch (error) {
      toast.error('Error deleting radiology test: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <PageContainer title="Radiology" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <ScienceIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" color="primary">
            Radiology
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Browse through our comprehensive list of Radiology and diagnostic
          services. Each service contains detailed information about available
          tests, prices, and descriptions.
        </Typography>
        <AddButton title="Add Radiology" onPress={handleAddRadiologyClick} />
      </Paper>

      {radiology.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No Radiology department available at the moment.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table
            sx={{ width: '100%', border: '1px solid #ddd' }}
            aria-label="radiology tests table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
                {/* <TableCell>Created By</TableCell> */}
                <TableCell>Created At</TableCell>
                {/* {hasPermission('update_radiology_department') && <TableCell>Actions</TableCell>} */}
              </TableRow>
            </TableHead>
            <TableBody>
              {radiology.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>{test.price}</TableCell>
                  <TableCell>{test.description}</TableCell>
                  {/* <TableCell>{test.created_by}</TableCell> */}
                  <TableCell>
                    {new Date(test.created_at).toLocaleString()}
                  </TableCell>
                  {/* {hasPermission('update_radiology_department') && (
                    <TableCell>
                      <DotMenu
                        onEdit={() => handleEditClick(test)}
                        // onDelete={() => handleDeleteRadiologyTest(test.id)}
                      />
                    </TableCell>
                  )} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ToastContainer />

      <CreateRadiology
        add={add}
        isSubmitting={submitting}
        onClose={handleAddRadiologyTestClose}
        onSubmit={handleCreateRadiologyTest}
        isAdding={isAdding}
      />

      <EditRadiology
        open={editModalOpen}
        isSubmitting={isUpdating}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTest(null);
        }}
        onSubmit={handleEditRadiology}
        testId={selectedTest?.id}
        initialData={
          selectedTest
            ? {
                name: selectedTest.name,
                price: selectedTest.price,
                description: selectedTest.description,
              }
            : null
        }
      />
    </PageContainer>
  );
};

export default Radiology;
