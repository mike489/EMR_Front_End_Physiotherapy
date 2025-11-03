import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

import Backend from 'services/backend';
import GetToken from 'utils/auth-token';

import LensForm from './components/LensFrom';
import { Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';


const fetchItems = async () => {
  try {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.lensTypes}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(Api, {
      method: 'GET',
      headers: header,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

const createItem = async (itemData) => {
  try {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.lensTypes}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(Api, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

const updateItem = async (id, itemData) => {
  try {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.lensTypes}/${id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(Api, {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

const deleteItem = async (id) => {
  try {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.lensTypes}/${id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(Api, {
      method: 'DELETE',
      headers: header,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Main Component
const LensTypes = ({
  title = "Items",
  entityName = "Item",
  emptyMessage = "No items found. Click 'Add New' to get started."
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchItems();
      // Adjust based on your API response structure
      const itemsData = response.data || response.items || response || [];
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      setError(null);
      const response = await createItem(itemData);
      const newItem = response.data || response;
      setItems(prev => [...prev, newItem]);
      setSuccessMessage(`${entityName} created successfully!`);
      setFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err.message || `Failed to create ${entityName.toLowerCase()}`);
    }
  };

  const handleUpdateItem = async (itemData) => {
    try {
      setError(null);
      const response = await updateItem(editingItem.id, itemData);
      const updatedItem = response.data || response;
      setItems(prev =>
        prev.map(item =>
          item.id === editingItem.id ? updatedItem : item
        )
      );
      setSuccessMessage(`${entityName} updated successfully!`);
      setFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err.message || `Failed to update ${entityName.toLowerCase()}`);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entityName.toLowerCase()}?`)) {
      return;
    }

    try {
      setError(null);
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setSuccessMessage(`${entityName} deleted successfully!`);
    } catch (err) {
      setError(err.message || `Failed to delete ${entityName.toLowerCase()}`);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
    setSuccessMessage('Data refreshed successfully!');
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setError(null);
  };

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      message: `${entityName} name must be at least 2 characters long`
    },
    description: {
      required: false,
      maxLength: 500,
      message: 'Description must be less than 500 characters'
    }
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading {title.toLowerCase()}...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
      }}>
        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Lens Types
          </Typography>

        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            disabled={loading}
            size="small"
          >
            Add Lens Types
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={loadItems}>
              Retry
            </Button>
          }
        >
          <Typography variant="body1">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      )}

      {/* Items Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label={`${title} table`}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', width: '30%' }}>
                   Name
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', width: '50%' }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', width: '10%' }}>
                  Created
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', width: 120 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {emptyMessage}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setFormOpen(true)}
                    >
                      Add First {entityName}
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: item.is_active === false ? '#fff3e0' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium" color="primary">
                          {item.name}
                        </Typography>
                        {item.code && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            ID: {item.code}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.description || 'No description provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('en-ET')
                          : 'N/A'
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={`Edit ${entityName.toLowerCase()}`}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditItem(item)}
                            disabled={loading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Form Dialog */}
      <LensForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleUpdateItem : handleCreateItem}
        initialData={editingItem}
        title={entityName}
        maxWidth="md"
        loading={loading}
        validationRules={validationRules}
      />
      <ToastContainer />

    </Container>
  );
};

export default LensTypes;