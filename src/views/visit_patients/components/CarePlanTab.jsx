import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions,
  IconButton,
  CircularProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Stack,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Medication as MedicationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import GoalInterventionReview from './GoalInterventionReview';
import { DotMenu } from 'ui-component/menu/DotMenu';

const CarePlanTab = ({ visit }) => {
  const theme = useTheme();
  const [carePlans, setCarePlans] = useState([]);
  const [carePlanMeta, setCarePlanMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [startStep, setStartStep] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(null); // 'goal', 'intervention', 'review'
  const [statusAlert, setStatusAlert] = useState(null);
  const [expandedInterventions, setExpandedInterventions] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});

  const [dialogMode, setDialogMode] = useState('care-plan');
  // Lookup maps for rendering names instead of IDs
  const [staffMap, setStaffMap] = useState({});
  const [goalTitleMap, setGoalTitleMap] = useState({});
  const [interventionTitleMap, setInterventionTitleMap] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setEditingPlan(null);
    setStartStep(0);
    setDialogMode('care-plan');
  };

  const handleOpenGoal = () => {
    setOpen(true);
    setEditingPlan(null);
    setStartStep(1);
    setDialogMode('goal');
  };

  const handleManage = (plan) => {
    setOpen(true);
    setEditingPlan(plan);
    setDialogMode('goal');
    setStartStep(1);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPlan(null);
    setStartStep(0);
  };

  const handleDelete = async (planId) => {
    try {
      setLoading(true);
      setCarePlans((prev) => prev.filter((p) => p.id !== planId));
      toast.success('Care plan deleted successfully');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCarePlans = async () => {
    try {
      setLoading(true);

      const token = await GetToken();
      const response = await fetch(`${Backend.auth}${Backend.carePlans}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch care plans:', errorText);
        showSnackbar('Failed to load care plans', 'error');
        return;
      }

      const result = await response.json();
      console.log('Care plans response:', result);

      // Handle paginated response structure
      const carePlansData = result.data?.data || [];
      const carePlansMeta = result.data || null;

      const visitFilteredPlans = carePlansData.filter(
        (plan) => plan?.visit_id === visit?.visit_id,
      );

      setCarePlans(visitFilteredPlans);
      setCarePlanMeta(carePlansMeta);
    } catch (error) {
      console.error('Error fetching care plans:', error);
      showSnackbar('Failed to load care plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarePlans();
  }, []);

  useEffect(() => {
    if (!editingPlan?.goals) return;

    const baseline = editingPlan.goals.reduce((acc, goal, index) => {
      const key = goal?.id || goal?.care_plan_id || `goal-${index}`;
      acc[key] = false;
      return acc;
    }, {});

    setExpandedInterventions(baseline);
    setExpandedReviews(baseline);
  }, [editingPlan]);

  // Preload doctor name map for displaying created_by and staff fields
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const token = await GetToken();
        const response = await fetch(`${Backend.auth}${Backend.getDoctors}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) return;

        const result = await response.json();
        const doctorArr = result?.data?.data ?? result?.data ?? [];
        const doctorMap = doctorArr.reduce((acc, doc) => {
          if (!doc?.id) return acc;
          const name =
            doc.name ||
            doc.full_name ||
            [doc.first_name, doc.last_name].filter(Boolean).join(' ').trim();
          acc[doc.id] = name || doc.id;
          return acc;
        }, {});

        setStaffMap((prev) => ({ ...doctorMap, ...prev }));
      } catch (error) {
        console.warn('Failed to preload doctor list', error);
      }
    };

    loadDoctors();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    toast[severity](message);
  };

  // Delete handlers
  const handleDeleteClick = (type, id, title) => {
    setDeleteTarget({ type, id, title });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);
      const token = await GetToken();
      let endpoint = '';

      switch (deleteTarget.type) {
        case 'goal':
          endpoint = `${Backend.auth}${Backend.carePlansGoals}/${deleteTarget.id}`;
          break;
        case 'intervention':
          endpoint = `${Backend.auth}${Backend.carePlansInterventions}/${deleteTarget.id}`;
          break;
        case 'review':
          endpoint = `${Backend.auth}${Backend.carePlansReviews}/${deleteTarget.id}`;
          break;
        default:
          throw new Error('Invalid delete type');
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${deleteTarget.type}`);
      }

      showSnackbar(`${deleteTarget.type} deleted successfully`, 'success');

      // Refresh the detail view
      if (editingPlan) {
        handleViewDetails(editingPlan, { stopPropagation: () => {} });
      }
    } catch (error) {
      console.error(`Error deleting ${deleteTarget.type}:`, error);
      showSnackbar(`Failed to delete ${deleteTarget.type}`, 'error');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // Edit handlers
  const handleEditGoal = (goal) => {
    setEditingItem(goal);
    setEditType('goal');
    setEditModalOpen(true);
  };

  const handleEditIntervention = (intervention) => {
    setEditingItem(intervention);
    setEditType('intervention');
    setEditModalOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingItem(review);
    setEditType('review');
    setEditModalOpen(true);
  };

  const handleEditSave = async (formData) => {
    try {
      setLoading(true);
      const token = await GetToken();
      let endpoint = '';
      let payload = {};

      switch (editType) {
        case 'goal':
          endpoint = `${Backend.auth}${Backend.carePlansGoals}/${editingItem.id}`;
          payload = {
            title: formData.title,
            notes: formData.notes,
            target_metric: formData.target_metric,
            deadline: formData.deadline,
            status: formData.status,
            progress:
              formData.progress === '' ? null : Number(formData.progress),
          };
          break;
        case 'intervention':
          endpoint = `${Backend.auth}${Backend.carePlansInterventions}/${editingItem.id}`;
          payload = {
            title: formData.title,
            instructions: formData.instructions,
            assigned_staff_id: formData.assigned_staff_id,
            deadline: formData.deadline,
          };
          break;
        case 'review':
          endpoint = `${Backend.auth}${Backend.carePlansReviews}/${editingItem.id}`;
          payload = {
            reviewed_by: formData.reviewed_by,
            review_date: formData.review_date,
            notes: formData.notes,
            updated_goals: formData.updated_goals || [],
            updated_interventions: formData.updated_interventions || [],
          };
          break;
        default:
          throw new Error('Invalid edit type');
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${editType}`);
      }

      showSnackbar(`${editType} updated successfully`, 'success');
      setEditModalOpen(false);

      // Refresh the detail view
      if (editingPlan) {
        handleViewDetails(editingPlan, { stopPropagation: () => {} });
      }
    } catch (error) {
      console.error(`Error updating ${editType}:`, error);
      showSnackbar(`Failed to update ${editType}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (plan, event) => {
    event.stopPropagation();
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const token = await GetToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const goals = Array.isArray(plan.goals) ? plan.goals : [];
      // Prepare goal title map for displaying updated_goals nicely
      const goalMapLocal = goals.reduce((acc, g) => {
        if (g?.id) acc[g.id] = g.title || g.id;
        return acc;
      }, {});
      setGoalTitleMap(goalMapLocal);

      // Fetch doctors to map doctor IDs to names
      let staffDict = {};
      try {
        const doctorRes = await fetch(`${Backend.auth}${Backend.getDoctors}`, {
          method: 'GET',
          headers,
        });
        const doctorJson = doctorRes.ok ? await doctorRes.json() : null;
        const doctorArr = doctorJson?.data?.data ?? doctorJson?.data ?? [];
        doctorArr.forEach((doc) => {
          if (!doc) return;
          const id = doc.id;
          const name =
            doc.name ||
            doc.full_name ||
            [doc.first_name, doc.last_name].filter(Boolean).join(' ').trim();
          if (id) staffDict[id] = name || id;
        });
      } catch (e) {
        console.warn('Failed to load doctor list', e);
      }
      setStaffMap((prev) => ({ ...prev, ...staffDict }));

      // For each goal, fetch interventions and reviews by goal ID
      const goalsWithDetails = await Promise.all(
        goals.map(async (g) => {
          try {
            const [intRes, revRes] = await Promise.all([
              fetch(
                `${Backend.auth}${Backend.carePlansInterventions}/${g.id}`,
                { method: 'GET', headers },
              ),
              fetch(`${Backend.auth}${Backend.carePlansReviews}/${g.id}`, {
                method: 'GET',
                headers,
              }),
            ]);

            const intJson = intRes.ok ? await intRes.json() : null;
            const revJson = revRes.ok ? await revRes.json() : null;

            // Handle both paginated and non-paginated shapes
            const interventionsRaw = intJson?.data?.data ?? intJson?.data ?? [];
            const reviewsRaw = revJson?.data?.data ?? revJson?.data ?? [];

            return {
              ...g,
              interventions: Array.isArray(interventionsRaw)
                ? interventionsRaw
                : [],
              reviews: Array.isArray(reviewsRaw) ? reviewsRaw : [],
            };
          } catch (err) {
            console.error(`Failed to load goal details for ${g.id}`, err);
            return {
              ...g,
              interventions: g.interventions || [],
              reviews: g.reviews || [],
            };
          }
        }),
      );

      // Build intervention title map
      const intMapLocal = goalsWithDetails
        .flatMap((gg) =>
          Array.isArray(gg.interventions) ? gg.interventions : [],
        )
        .reduce((acc, i) => {
          if (i?.id) acc[i.id] = i.title || i.id;
          return acc;
        }, {});
      setInterventionTitleMap(intMapLocal);

      // Display all goals with all their interventions and reviews
      setEditingPlan({ ...plan, goals: goalsWithDetails });
    } catch (error) {
      console.error('Error loading care plan details:', error);
      setEditingPlan({ ...plan, goals: plan.goals || [] });
      toast.error('Failed to load interventions/reviews for goals');
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Helpers to render names/labels from IDs - show only names
  const getStaffDisplay = (val) => {
    if (!val) return '-';
    if (typeof val === 'string') {
      const name = staffMap[val];
      return name || '-';
    }
    if (typeof val === 'object') {
      const firstLast = [val.first_name, val.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
      return (
        val.name ||
        val.full_name ||
        firstLast ||
        val.username ||
        val.email ||
        '-'
      );
    }
    return '-';
  };

  const getGoalLabel = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return goalTitleMap[item] || '';
    if (typeof item === 'object')
      return item.title || goalTitleMap[item.id] || '';
    return '';
  };

  const getInterventionLabel = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return interventionTitleMap[item] || '';
    if (typeof item === 'object')
      return item.title || interventionTitleMap[item.id] || '';
    return '';
  };

  const handleStatusAlertClose = () => setStatusAlert(null);

  const handleToggleInterventions = (goalKey, expanded) => {
    setExpandedInterventions((prev) => ({
      ...prev,
      [goalKey]: expanded,
    }));
  };

  const handleToggleReviews = (goalKey, expanded) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [goalKey]: expanded,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        mb={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
            Care Plans
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient care plans, goals, interventions, and reviews
          </Typography>
        </Box>
        <Tooltip title="Add Care Plan" arrow>
          <IconButton
            onClick={handleOpen}
            color="primary"
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(17, 24, 39, 0.12)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-1px)',
                boxShadow: '0 10px 30px rgba(17, 24, 39, 0.2)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {statusAlert && (
        <Alert
          severity={statusAlert.type || 'info'}
          onClose={handleStatusAlertClose}
          sx={{ mb: 2, alignItems: 'center' }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
            {statusAlert.message || 'Care plan updated'}
          </Typography>
          {statusAlert.visitId && (
            <Typography component="span" variant="body2" sx={{ ml: 1 }}>
              (Visit ID: {statusAlert.visitId})
            </Typography>
          )}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : carePlans.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <LocalHospitalIcon
              sx={{
                fontSize: 48,
                color: 'text.secondary',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              No care plans found for this visit
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {carePlans.map((plan) => (
            <Paper
              key={plan.id}
              sx={{
                p: 3,
                borderRadius: 3,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  background: '#ffffff',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}
                  >
                    {plan.title || 'Untitled Care Plan'}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.6 }}
                  >
                    {plan.description || 'No description provided'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created:{' '}
                      {plan.created_at
                        ? format(new Date(plan.created_at), 'MMM dd, yyyy')
                        : 'N/A'}
                      {plan.created_by && staffMap[plan.created_by] && (
                        <> • By: {staffMap[plan.created_by]}</>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <IconButton
                    onClick={(event) => handleViewDetails(plan, event)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleManage(plan)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#E5E7EB',
            color: '#64748b',

            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 28, color: '#64748b' }} />
            </Box>
            <Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                {editingPlan?.title || 'Care Plan Details'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {detailLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : editingPlan ? (
            <Box>
              <Box
                sx={{
                  p: 4,
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {editingPlan.title || 'Untitled Care Plan'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {editingPlan.description || 'No description provided'}
                </Typography>
              </Box>
              {/* Goals, interventions, and reviews */}
              {(editingPlan.goals || []).map((goal, goalIndex) => {
                const goalKey =
                  goal?.id || goal?.care_plan_id || `goal-${goalIndex}`;
                return (
                  <Box key={goal.id || goal.care_plan_id || goalIndex}>
                    {/* Goal Section */}
                    <Box
                      sx={{
                        p: 4,
                        bgcolor: goalIndex % 2 === 0 ? 'white' : '#f8f9fa',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 3,
                          pb: 2,
                          borderBottom: '3px solid',
                          borderColor: '#2e7d32',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 3,
                              background: '#2e7d32',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
                            }}
                          >
                            <AddIcon sx={{ color: 'white', fontSize: 26 }} />
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: '#1b5e20' }}
                          >
                            Goal {goalIndex + 1}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditGoal(goal)}
                            sx={{ color: '#2e7d32' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteClick('goal', goal.id, goal.title)
                            }
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { sm: 'center' },
                              justifyContent: 'space-between',
                              gap: { xs: 2, sm: 4 },
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 'bold',
                                  mb: 1,
                                  color: 'text.primary',
                                }}
                              >
                                Title
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ mb: { xs: 0, sm: 0 } }}
                              >
                                {goal.title || '-'}
                              </Typography>
                            </Box>
                            {goal.target_metric && (
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 'bold',
                                    mb: 1,
                                    color: 'text.primary',
                                  }}
                                >
                                  Target Metric
                                </Typography>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <TrendingUpIcon
                                    sx={{ mr: 1, color: '#2e7d32' }}
                                  />
                                  <Typography variant="body1">
                                    {goal.target_metric}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 'bold',
                              mb: 1,
                              color: 'text.primary',
                            }}
                          >
                            Notes
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.6, mb: 2 }}
                          >
                            {goal.notes || '-'}
                          </Typography>
                        </Grid>

                        {goal.deadline && (
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                color: 'text.primary',
                              }}
                            >
                              Deadline
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon sx={{ mr: 1, color: '#2e7d32' }} />
                              <Typography variant="body1">
                                {format(
                                  new Date(goal.deadline),
                                  'MMMM dd, yyyy',
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>

                      {/* Interventions for this goal */}
                      {goal.interventions && goal.interventions.length > 0 && (
                        <Accordion
                          disableGutters
                          elevation={0}
                          expanded={Boolean(expandedInterventions[goalKey])}
                          onChange={(event, isExpanded) =>
                            handleToggleInterventions(goalKey, isExpanded)
                          }
                          sx={{
                            mt: 4,
                            borderLeft: '3px dashed rgba(46, 125, 50, 0.3)',
                            borderRadius: 2,
                            backgroundColor: 'transparent',
                            '&:before': { display: 'none' },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: '#2e7d32' }} />
                            }
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderBottom: '2px solid rgba(46, 125, 50, 0.3)',
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <MedicationIcon
                                sx={{ color: '#2e7d32', fontSize: 20 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, color: '#2e7d32' }}
                              >
                                ↳ Interventions ({goal.interventions.length})
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pl: 1 }}>
                            {goal.interventions.map((intv, intvIndex) => (
                              <Box
                                key={intv.id || intvIndex}
                                sx={{
                                  mb:
                                    intvIndex < goal.interventions.length - 1
                                      ? 3
                                      : 0,
                                  pl: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 'bold',
                                      color: '#2e7d32',
                                    }}
                                  >
                                    Intervention {intvIndex + 1}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleEditIntervention(intv)
                                      }
                                      sx={{ color: '#2e7d32' }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteClick(
                                          'intervention',
                                          intv.id,
                                          intv.title,
                                        )
                                      }
                                      sx={{ color: '#d32f2f' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      Title
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      {intv.title || '-'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      Instructions
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ lineHeight: 1.6, mb: 1 }}
                                    >
                                      {intv.instructions ||
                                        intv.instruction ||
                                        '-'}
                                    </Typography>
                                  </Grid>
                                  {(intv.assigned_staff_id ||
                                    intv.assigned_staff) && (
                                    <Grid item xs={12}>
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: 'bold',
                                          mb: 0.5,
                                          color: 'text.primary',
                                        }}
                                      >
                                        Assigned Staff
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <PersonIcon
                                          sx={{
                                            mr: 1,
                                            color: '#2e7d32',
                                            fontSize: 18,
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {getStaffDisplay(
                                            intv.assigned_staff_id ||
                                              intv.assigned_staff,
                                          )}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                </Grid>
                                {intvIndex < goal.interventions.length - 1 && (
                                  <Divider sx={{ mt: 2 }} />
                                )}
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {/* Reviews for this goal */}
                      {goal.reviews && goal.reviews.length > 0 && (
                        <Accordion
                          disableGutters
                          elevation={0}
                          expanded={Boolean(expandedReviews[goalKey])}
                          onChange={(event, isExpanded) =>
                            handleToggleReviews(goalKey, isExpanded)
                          }
                          sx={{
                            mt: 4,
                            borderLeft: '3px dashed rgba(46, 125, 50, 0.3)',
                            borderRadius: 2,
                            backgroundColor: 'transparent',
                            '&:before': { display: 'none' },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: '#2e7d32' }} />
                            }
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderBottom: '2px solid rgba(46, 125, 50, 0.3)',
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ScheduleIcon
                                sx={{ color: '#2e7d32', fontSize: 20 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, color: '#2e7d32' }}
                              >
                                ↳ Reviews ({goal.reviews.length})
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pl: 1 }}>
                            {goal.reviews.map((rev, revIndex) => (
                              <Box
                                key={rev.id || revIndex}
                                sx={{
                                  mb:
                                    revIndex < goal.reviews.length - 1 ? 3 : 0,
                                  pl: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 'bold',
                                      color: '#2e7d32',
                                    }}
                                  >
                                    Review {revIndex + 1}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditReview(rev)}
                                      sx={{ color: '#2e7d32' }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteClick(
                                          'review',
                                          rev.id,
                                          `Review by ${rev.reviewed_by}`,
                                        )
                                      }
                                      sx={{ color: '#d32f2f' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      Reviewed By
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <PersonIcon
                                        sx={{
                                          mr: 1,
                                          color: '#2e7d32',
                                          fontSize: 18,
                                        }}
                                      />
                                      <Typography variant="body2">
                                        {getStaffDisplay(rev.reviewed_by)}
                                      </Typography>
                                    </Box>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      Review Date
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <CalendarIcon
                                        sx={{
                                          mr: 1,
                                          color: '#2e7d32',
                                          fontSize: 18,
                                        }}
                                      />
                                      <Typography variant="body2">
                                        {rev.review_date
                                          ? format(
                                              new Date(rev.review_date),
                                              'MMMM dd, yyyy',
                                            )
                                          : '-'}
                                      </Typography>
                                    </Box>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        color: 'text.primary',
                                      }}
                                    >
                                      Notes
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ lineHeight: 1.6 }}
                                    >
                                      {rev.notes || rev.outcome || '-'}
                                    </Typography>
                                  </Grid>
                                  {Array.isArray(rev.updated_goals) &&
                                    rev.updated_goals.length > 0 && (
                                      <Grid item xs={12}>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            fontWeight: 'bold',
                                            mb: 0.5,
                                            color: 'text.primary',
                                          }}
                                        >
                                          Updated Goals
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                          }}
                                        >
                                          {rev.updated_goals
                                            .filter(Boolean)
                                            .map((gid, idx) => {
                                              const goalTitle =
                                                goalTitleMap[gid];
                                              if (!goalTitle) return null; // Don't show if no title found
                                              return (
                                                <Chip
                                                  key={`goal-${gid}-${idx}`}
                                                  label={goalTitle}
                                                  size="small"
                                                  sx={{
                                                    bgcolor:
                                                      theme.palette.primary
                                                        .light,
                                                    color:
                                                      theme.palette.primary
                                                        .dark,
                                                  }}
                                                />
                                              );
                                            })
                                            .filter(Boolean)}
                                        </Box>
                                      </Grid>
                                    )}
                                  {Array.isArray(rev.updated_interventions) &&
                                    rev.updated_interventions.length > 0 && (
                                      <Grid item xs={12}>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            fontWeight: 'bold',
                                            mb: 0.5,
                                            color: 'text.primary',
                                          }}
                                        >
                                          Updated Interventions
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                          }}
                                        >
                                          {rev.updated_interventions
                                            .filter(Boolean)
                                            .map((iid, idx) => {
                                              const interventionTitle =
                                                interventionTitleMap[iid];
                                              if (!interventionTitle)
                                                return null; // Don't show if no title found
                                              return (
                                                <Chip
                                                  key={`intervention-${iid}-${idx}`}
                                                  label={interventionTitle}
                                                  size="small"
                                                  sx={{
                                                    bgcolor:
                                                      theme.palette.success
                                                        .light,
                                                    color:
                                                      theme.palette.success
                                                        .dark,
                                                  }}
                                                />
                                              );
                                            })
                                            .filter(Boolean)}
                                        </Box>
                                      </Grid>
                                    )}
                                </Grid>
                                {revIndex < goal.reviews.length - 1 && (
                                  <Divider sx={{ mt: 2 }} />
                                )}
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>

                    {/* Divider between goals */}
                    {goalIndex < (editingPlan.goals?.length || 0) - 1 && (
                      <Divider
                        sx={{ borderBottomWidth: 3, borderColor: '#2e7d32' }}
                      />
                    )}
                  </Box>
                );
              })}

              {/* Show message if no goals */}
              {(!editingPlan.goals || editingPlan.goals.length === 0) && (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <AssignmentIcon
                    sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No goals found in this care plan
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No plan selected
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            bgcolor: '#f8fafc',
            gap: 2,
          }}
        >
          <Button
            onClick={() => setDetailOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': {
                borderColor: '#94a3b8',
                bgcolor: '#f1f5f9',
              },
            }}
          >
            Close
          </Button>
          {/* {editingPlan && (
            // <Button 
            //   onClick={() => handleEdit(editingPlan)}
            //   variant="contained"
            //   startIcon={<EditIcon />}
            //   sx={{ 
            //     borderRadius: 2,
            //     px: 3,
            //     py: 1,
            //     fontWeight: 600,
            //     bgcolor: '#64748b',
            //     color: 'white',
            //     '&:hover': {
            //       bgcolor: '#94a3b8',
            //     },
            //   }}
            //   sx={{ borderRadius: 1 }}
            // >
            //   Edit Plan
            // </Button>
          )} */}
        </DialogActions>
      </Dialog>

      {/* Goal/Intervention/Review Dialog */}
      <GoalInterventionReview
        open={open}
        onClose={handleClose}
        visit={visit}
        carePlans={carePlans}
        onSaveComplete={fetchCarePlans}
        onCarePlanCreated={(result) => {
          setStatusAlert({
            type: 'success',
            message: result?.message || 'Care plan created successfully',
            visitId: result?.data?.visit_id,
          });
        }}
        editingPlan={editingPlan}
        initialStep={startStep}
        mode={dialogMode}
      />

      {/* Edit Modal */}
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editType={editType}
        editingItem={editingItem}
        onSave={handleEditSave}
        loading={loading}
        carePlans={carePlans}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this {deleteTarget?.type}?
          </Typography>
          {deleteTarget?.title && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              "{deleteTarget.title}"
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// EditModal Component
const EditModal = ({
  open,
  onClose,
  editType,
  editingItem,
  onSave,
  loading,
  carePlans,
}) => {
  const [formData, setFormData] = useState({});

  React.useEffect(() => {
    if (editingItem && editType) {
      switch (editType) {
        case 'goal':
          setFormData({
            title: editingItem.title || '',
            notes: editingItem.notes || '',
            target_metric: editingItem.target_metric || '',
            deadline: editingItem.deadline || '',
            status: editingItem.status || 'not_started',
            progress: editingItem.progress ?? '',
          });
          break;
        case 'intervention':
          setFormData({
            title: editingItem.title || '',
            instructions:
              editingItem.instructions || editingItem.instruction || '',
            assigned_staff_id:
              editingItem.assigned_staff_id || editingItem.assigned_staff || '',
            deadline: editingItem.deadline || '',
          });
          break;
        case 'review':
          setFormData({
            reviewed_by: editingItem.reviewed_by || '',
            review_date: editingItem.review_date || '',
            notes: editingItem.notes || editingItem.outcome || '',
            updated_goals: editingItem.updated_goals || [],
            updated_interventions: editingItem.updated_interventions || [],
          });
          break;
        default:
          setFormData({});
      }
    }
  }, [editingItem, editType]);

  const handleSubmit = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (editType) {
      case 'goal':
        return 'Edit Goal';
      case 'intervention':
        return 'Edit Intervention';
      case 'review':
        return 'Edit Review';
      default:
        return 'Edit Item';
    }
  };

  // Get all goals for dropdowns
  const allGoals = carePlans.flatMap((plan) => plan.goals || []);

  // Get all interventions for dropdowns
  const allInterventions = carePlans.flatMap((plan) =>
    (plan.goals || []).flatMap((goal) => goal.interventions || []),
  );

  // Mock staff data - replace with actual API call
  const staffOptions = [
    { id: '01999690-5361-739e-90c2-f32aa5b80f82', name: 'Dr. Smith' },
    { id: '01999690-5361-739e-90c2-f32aa5b80f83', name: 'Nurse Johnson' },
    { id: '01999690-5361-739e-90c2-f32aa5b80f84', name: 'Therapist Brown' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {editType === 'goal' && (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Target Metric"
              value={formData.target_metric || ''}
              onChange={(e) =>
                setFormData({ ...formData, target_metric: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Progress (%)"
              type="number"
              value={formData.progress ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progress: e.target.value === '' ? '' : e.target.value,
                })
              }
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'not_started'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {editType === 'intervention' && (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Instructions"
              value={formData.instructions || ''}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assigned Staff</InputLabel>
              <Select
                value={formData.assigned_staff_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigned_staff_id: e.target.value,
                  })
                }
              >
                {staffOptions.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}

        {editType === 'review' && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reviewed By</InputLabel>
              <Select
                value={formData.reviewed_by || ''}
                onChange={(e) =>
                  setFormData({ ...formData, reviewed_by: e.target.value })
                }
              >
                {staffOptions.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Review Date"
              type="date"
              value={formData.review_date || ''}
              onChange={(e) =>
                setFormData({ ...formData, review_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Updated Goals</InputLabel>
              <Select
                multiple
                value={formData.updated_goals || []}
                onChange={(e) =>
                  setFormData({ ...formData, updated_goals: e.target.value })
                }
              >
                {allGoals.map((goal) => (
                  <MenuItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Updated Interventions</InputLabel>
              <Select
                multiple
                value={formData.updated_interventions || []}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    updated_interventions: e.target.value,
                  })
                }
              >
                {allInterventions.map((intervention) => (
                  <MenuItem key={intervention.id} value={intervention.id}>
                    {intervention.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarePlanTab;
