import React, { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Avatar,
  useTheme,
  TablePagination,
  Collapse,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScienceIcon from '@mui/icons-material/Science';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import BalanceIcon from '@mui/icons-material/Balance';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { toast, ToastContainer } from 'react-toastify';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import { DotMenu } from 'ui-component/menu/DotMenu';
import AddAnkle from './components/AddAnkle';

const AnkleTab = ({ visit }) => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [ankles, setAnkles] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [expandedAnkle, setExpandedAnkle] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
  });
  const [meta, setMeta] = useState({
    last_page: 0,
    total: 0,
  });

  const [openAddAnkle, setOpenAddAnkle] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAnkle, setSelectedAnkle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleFetchingAnkles = useCallback(async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.ankles}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}&visit_id=${visit?.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to fetch Ankle assessments',
        );
      }

      if (responseData.success) {
        setAnkles(responseData.data.data);
        setPagination({
          ...pagination,
        });
        setMeta({
          last_page: responseData.data.last_page,
          total: responseData.data.total,
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
  }, [pagination.page, pagination.per_page, search, visit?.visit_id]);

  const handleAddAnkle = async (ankleData) => {
    setIsSubmitting(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.ankles}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(ankleData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to add Ankle assessment',
        );
      }

      if (responseData.success) {
        toast.success('Ankle assessment added successfully');
        handleFetchingAnkles();
        setOpenAddAnkle(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnkle = async (ankleId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.ankles}/${ankleId}`;
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
      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to delete ankle assessment',
        );
      }
      if (responseData.success) {
        toast.success('Ankle assessment deleted successfully');
        handleFetchingAnkles();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (ankleId) => {
    setExpandedAnkle(expandedAnkle === ankleId ? null : ankleId);
  };

  // Helper functions for data formatting
  const formatPainLocations = (painLocations) => {
    if (!painLocations || !Array.isArray(painLocations))
      return 'None specified';
    return painLocations.map((location) => (
      <Chip
        key={location}
        label={location}
        size="small"
        variant="outlined"
        sx={{ m: 0.5 }}
      />
    ));
  };

  const formatSpecialTests = (specialTests) => {
    if (!specialTests || typeof specialTests !== 'object')
      return 'None performed';

    return Object.entries(specialTests).map(
      ([test, result]) =>
        result && (
          <Box
            key={test}
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {test.replace('_', ' ')}:
            </Typography>
            <Chip
              label={result}
              size="small"
              color={
                result === 'Positive'
                  ? 'error'
                  : result === 'Negative'
                    ? 'success'
                    : 'default'
              }
            />
          </Box>
        ),
    );
  };

  const formatRangeOfMotion = (rom) => {
    if (!rom || typeof rom !== 'object') return 'Not assessed';

    return Object.entries(rom).map(([movement, sides]) => {
      if (!sides || (sides.left == null && sides.right == null)) return null;

      return (
        <Box key={movement} sx={{ mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
          >
            {movement.replace(/_/g, ' ')}:
          </Typography>
          <Box sx={{ pl: 2 }}>
            {sides.left && (
              <Typography variant="body2">Left: {sides.left}°</Typography>
            )}
            {sides.right && (
              <Typography variant="body2">Right: {sides.right}°</Typography>
            )}
          </Box>
        </Box>
      );
    });
  };

  const formatStrengthAssessment = (strength) => {
    if (!strength?.flag_list || typeof strength.flag_list !== 'object')
      return 'Not assessed';

    return Object.entries(strength.flag_list).map(
      ([movement, grade]) =>
        movement !== 'other' &&
        grade && (
          <Box key={movement} sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
            >
              {movement.replace('_', ' ')}:
            </Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {grade}
            </Typography>
          </Box>
        ),
    );
  };

  const formatListWithChips = (items, fieldName = 'items') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return `No ${fieldName}`;
    }
    return items.map((item, index) => (
      <Chip key={index} label={item} size="small" sx={{ m: 0.5 }} />
    ));
  };

  const DataSection = ({ title, icon, children, defaultExpanded = false }) => (
    <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleFetchingAnkles();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingAnkles();
    } else {
      setMounted(true);
    }
  }, [pagination.page, pagination.per_page]);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Ankle & Foot Assessments
        </Typography>
        <IconButton
          color="primary"
          aria-label="add ankle & foot assessment"
          onClick={() => setOpenAddAnkle(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: 'white',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <ErrorPrompt
          title="Server Error"
          message="Unable to retrieve ankle & foot assessments."
        />
      ) : ankles.length === 0 ? (
        <Fallbacks
          severity="info"
          title="No Ankle & Foot Assessments Found"
          description="Ankle & foot assessments will be listed here when available."
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <Box>
          {ankles.map((ankle, index) => (
            <Card
              key={ankle.id}
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Header Section */}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => toggleExpand(ankle.id)}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <DirectionsWalkIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="subtitle1"
                              component="div"
                              sx={{ mb: 1 }}
                            >
                              <strong>Ankle & Foot Assessment</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>HPI:</strong>{' '}
                              {ankle.hpi || 'Not specified'}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              <Chip
                                icon={<EventIcon fontSize="small" />}
                                label={new Date(
                                  ankle.visit_date,
                                ).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption">
                                <strong>Pain:</strong> {ankle.pain_level}/10
                              </Typography>
                              <Typography variant="caption">
                                <strong>By:</strong> {ankle.created_by}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              {expandedAnkle === ankle.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                            <DotMenu
                              onEdit={() => {
                                setEditModalOpen(true);
                                setSelectedAnkle(ankle);
                              }}
                              onDelete={() => handleDeleteAnkle(ankle.id)}
                            />
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>

                {/* Expanded Details */}
                <Collapse
                  in={expandedAnkle === ankle.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Grid container spacing={3}>
                      {/* Pain Assessment Column */}
                      <Grid item xs={12} md={6}>
                        <DataSection
                          title="Pain Assessment"
                          icon={<AssessmentIcon fontSize="small" />}
                          defaultExpanded
                        >
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Level:</strong> {ankle.pain_level}/10
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Pain Locations:</strong>
                            </Typography>
                            <Box>
                              {formatPainLocations(ankle.pain_location)}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Aggravating Factors:</strong>{' '}
                            {ankle.aggravating_factors || 'None'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Easing Factors:</strong>{' '}
                            {ankle.easing_factors || 'None'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Radiation:</strong>{' '}
                            {ankle.radiation_location || 'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Medical History"
                          icon={<DescriptionIcon fontSize="small" />}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>PMH:</strong> {ankle.pmh || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Complaints:</strong>{' '}
                            {ankle.complaints || 'Not specified'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Functional Limitations"
                          icon={<AssignmentIcon fontSize="small" />}
                        >
                          {ankle.functional_limitations_adl?.limitations &&
                          ankle.functional_limitations_adl.limitations.length >
                            0 ? (
                            <Box>
                              <Box sx={{ mb: 1 }}>
                                {formatListWithChips(
                                  ankle.functional_limitations_adl.limitations,
                                  'functional limitations',
                                )}
                              </Box>
                              {ankle.functional_limitations_adl.remark && (
                                <Typography variant="body2">
                                  <strong>Remarks:</strong>{' '}
                                  {ankle.functional_limitations_adl.remark}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2">
                              No functional limitations specified
                            </Typography>
                          )}
                        </DataSection>
                      </Grid>

                      {/* Clinical Findings Column */}
                      <Grid item xs={12} md={6}>
                        <DataSection
                          title="Strength Assessment"
                          icon={<TrendingUpIcon fontSize="small" />}
                        >
                          {formatStrengthAssessment(ankle.strength_assessment)}
                          {ankle.strength_assessment?.remark && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Remarks:</strong>{' '}
                              {ankle.strength_assessment.remark}
                            </Typography>
                          )}
                        </DataSection>

                        <DataSection
                          title="Special Tests"
                          icon={<ScienceIcon fontSize="small" />}
                        >
                          {formatSpecialTests(ankle.special_tests)}
                        </DataSection>
                        <DataSection
                          title="Range of Motion"
                          icon={<TrendingUpIcon fontSize="small" />}
                        >
                          {formatRangeOfMotion(ankle.range_of_motion)}
                        </DataSection>
                        <DataSection
                          title="Balance & Gait"
                          icon={<BalanceIcon fontSize="small" />}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Gait Pattern:</strong>{' '}
                            {ankle.gait_pattern || 'Not specified'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Single Leg Stance:</strong>{' '}
                            {ankle.single_leg_stance_time || 'Not assessed'}
                          </Typography>
                          {ankle.balance_issues?.issues &&
                          ankle.balance_issues.issues.length > 0 ? (
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Balance Issues:</strong>
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                {formatListWithChips(
                                  ankle.balance_issues.issues,
                                  'balance issues',
                                )}
                              </Box>
                              {ankle.balance_issues.remark && (
                                <Typography variant="body2">
                                  <strong>Remarks:</strong>{' '}
                                  {ankle.balance_issues.remark}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2">
                              No balance issues identified
                            </Typography>
                          )}
                        </DataSection>
                      </Grid>

                      {/* Treatment Column */}
                      <Grid item xs={12}>
                        <DataSection
                          title="Treatment Plan"
                          icon={<AssignmentIcon fontSize="small" />}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Plans:</strong>
                            </Typography>
                            <Box>
                              {formatListWithChips(
                                ankle.treatment_plans?.plans,
                                'treatment plans',
                              )}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Short Term Goal:</strong>{' '}
                            {ankle.short_term_goal || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Precautions:</strong>{' '}
                            {ankle.precautions_and_contraindications || 'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Clinical Impression"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Box>
                            {formatListWithChips(
                              ankle.clinical_impression?.impressions,
                              'clinical impressions',
                            )}
                          </Box>
                        </DataSection>

                        <DataSection
                          title="Red Flags"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {ankle.red_flags?.flag_list &&
                          ankle.red_flags.flag_list.length > 0 ? (
                            <Box>
                              {ankle.red_flags.flag_list.map((flag, index) => (
                                <Chip
                                  key={index}
                                  label={flag}
                                  color="error"
                                  size="small"
                                  sx={{ m: 0.5 }}
                                />
                              ))}
                              {ankle.red_flags.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {ankle.red_flags.remark}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2">
                              No red flags identified
                            </Typography>
                          )}
                        </DataSection>
                      </Grid>
                    </Grid>

                    {/* Footer with metadata */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mt: 2,
                        backgroundColor: theme.palette.grey[50],
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography variant="caption" color="text.secondary">
                          <strong>Assessment ID:</strong> {ankle.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Created:</strong>{' '}
                          {new Date(ankle.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Visit Date:</strong>{' '}
                          {new Date(ankle.visit_date).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={meta.total}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.per_page}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      )}

      <AddAnkle
        open={openAddAnkle}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddAnkle(false)}
        onSubmit={handleAddAnkle}
        visit={visit}
      />

      <ToastContainer />
    </Box>
  );
};

export default AnkleTab;
