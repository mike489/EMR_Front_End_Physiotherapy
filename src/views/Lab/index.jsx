import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  LocalHospital as TestIcon,
} from '@mui/icons-material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import PageContainer from 'ui-component/MainPage';
import AddButton from 'ui-component/buttons/AddButton';
import CreateLabTest from './components/CreateLabTest';
import { DotMenu } from 'ui-component/menu/DotMenu';
import hasPermission from 'utils/auth/hasPermission';
import EditLabGroup from './components/EditLabGroup';
import EditLabTest from './components/EditLabTest';

const Lab = () => {
  const [lab, setLab] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [add, setAdd] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdatingTest, setIsUpdatingTest] = React.useState(false);
  const [isUpdatingGroup, setIsUpdatingGroup] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [editTestModalOpen, setEditTestModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFetchingLab = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoryTestGroups}`;
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
        setLab(responseData.data.data || responseData.data);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabTest = async (labTestData) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoryTestGroups}`;
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
        body: JSON.stringify(labTestData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Lab test group created successfully!');
        handleAddLabTestClose();
        handleFetchingLab();
      } else {
        toast.error(responseData.message || 'Failed to create lab test group');
      }
    } catch (error) {
      toast.error('Error creating lab test group: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    handleFetchingLab();
  }, []);

  const handleAddLabTestClose = () => {
    setAdd(false);
  };

  const handleAddLabTestClick = () => {
    setAdd(true);
  };
  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setEditModalOpen(true);
  };
  const handleEditTestClick = (test) => {
    setSelectedTest(test);
    setEditTestModalOpen(true);
  };

  ////--------------Start CURD LAB GROUPS-----------------////

  const handleEditLabGroup = async (groupId, updatedData) => {
    setIsUpdatingGroup(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoryTestGroups}/${groupId}`;
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
        throw new Error(responseData.message || 'Failed to update lab group');
      }

      if (responseData.success) {
        toast.success('Lab group updated successfully');
        setEditModalOpen(false);
        handleFetchingLab();
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingGroup(false);
    }
  };

  const handleDeleteLabGroup = async (labGroupId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.laboratoryTestGroups}/${labGroupId}`;
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
        toast.success('Lab group deleted successfully');
        handleFetchingLab(); // Refresh the list
      } else {
        toast.error(responseData.message || 'Failed to delete lab group');
      }
    } catch (error) {
      toast.error('Error deleting lab group: ' + error.message);
    }
  };

  ////--------------End CURD LAB GROUPS-----------------////

  ////--------------Start CURD LAB TESTS-----------------////

  const handleEditLabTest = async (labTestId, updatedData) => {
    setIsUpdatingTest(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.updateLaboratoryTests}/${labTestId}`;
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
        throw new Error(responseData.message || 'Failed to update lab test');
      }

      if (responseData.success) {
        toast.success('Lab test updated successfully');
        handleFetchingLab();
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingTest(false);
    }
  };

  const handleDeleteLabTest = async (labTestId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.updateLaboratoryTests}/${labTestId}`;
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
        toast.success('Lab test deleted successfully');
        handleFetchingLab();
        setEditTestModalOpen(false);
      } else {
        toast.error(responseData.data.message || 'Failed to delete lab test');
      }
    } catch (error) {
      toast.error('Error deleting lab test: ' + error.message);
    }
  };

  ////--------------End CURD LAB TESTS-----------------////

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
    <PageContainer title="Laboratory Tests" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <ScienceIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" color="primary">
            Laboratory Tests
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Browse through our comprehensive list of laboratory tests and
          diagnostic services. Each test group contains detailed information
          about available tests, prices, and descriptions.
        </Typography>
        <AddButton
          title="Add Laboratory Test"
          onPress={handleAddLabTestClick}
        />
      </Paper>

      {lab.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No laboratory tests available at the moment.
          </Typography>
        </Paper>
      ) : (
        lab.map((group, index) => (
          <Accordion
            key={group.id}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}
              >
                <TestIcon color="primary" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h2">
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {group.description}
                  </Typography>
                </Box>
                <Chip
                  label={`${group.tests?.length || 0} tests`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                }}
              >
                <DotMenu
                  onEdit={() => handleEditClick(group)}
                  onDelete={() => handleDeleteLabGroup(group.id)}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />

              {!group.tests || group.tests.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No tests available in this group.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {group.tests.map((test) => (
                    <Grid item xs={12} md={6} lg={4} key={test.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="h3"
                              gutterBottom
                            >
                              {test.name}
                            </Typography>
                            <Box
                              sx={{
                                position: 'relative',
                                display: 'inline-flex',
                              }}
                            >
                              <DotMenu
                                onEdit={() => handleEditTestClick(test)}
                                onDelete={() => handleDeleteLabTest(test.id)}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Chip
                              label={`ETB ${test.price}`}
                              color="secondary"
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {test.description}
                          </Typography>

                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {test.id.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
      <ToastContainer />

      <CreateLabTest
        add={add}
        isSubmitting={submitting}
        onClose={handleAddLabTestClose}
        onSubmit={handleCreateLabTest}
        isAdding={isAdding}
      />

      {/* Edit Modal */}
      <EditLabGroup
        open={editModalOpen}
        isSubmitting={isUpdatingGroup}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedGroup(null);
        }}
        onSubmit={handleEditLabGroup}
        groupId={selectedGroup?.id}
        initialData={
          selectedGroup
            ? {
                name: selectedGroup.name,
                description: selectedGroup.description,
              }
            : null
        }
      />

      {/* Edit Test Modal */}
      <EditLabTest
        open={editTestModalOpen}
        isSubmitting={isUpdatingTest}
        onClose={() => {
          setEditTestModalOpen(false);
          setSelectedTest(null);
          setSelectedGroup(null);
        }}
        onSubmit={handleEditLabTest}
        testId={selectedTest?.id}
        groupId={selectedGroup?.id}
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

export default Lab;
