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
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import { toast, ToastContainer } from 'react-toastify';
import ErrorPrompt from 'utils/components/ErrorPrompt';
import Fallbacks from 'utils/components/Fallbacks';
import { DotMenu } from 'ui-component/menu/DotMenu';
import AddWristHand from './components/AddWristHand';

const WristHandTab = ({ visit }) => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [wristHands, setWristHands] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [expandedWristHand, setExpandedWristHand] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
  });
  const [meta, setMeta] = useState({
    last_page: 0,
    total: 0,
  });

  const [openAddWristHand, setOpenAddWristHand] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWristHand, setSelectedWristHand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleFetchingWristHands = useCallback(async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.wristHands}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}&visit_id=${visit?.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch Wrist & Hand');
      }

      if (responseData.success) {
        setWristHands(responseData.data.data);
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

  const handleAddWristHand = async (wristHandData) => {
    setIsSubmitting(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.wristHands}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(wristHandData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add Wrist & Hand');
      }

      if (responseData.success) {
        toast.success('Wrist & Hand assessment added successfully');
        handleFetchingWristHands();
        setOpenAddWristHand(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWristHand = async (wristHandId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.wristHands}/${wristHandId}`;
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
          responseData.message || 'Failed to delete wrist & hand assessment',
        );
      }
      if (responseData.success) {
        toast.success('Wrist & Hand assessment deleted successfully');
        handleFetchingWristHands();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (wristHandId) => {
    setExpandedWristHand(
      expandedWristHand === wristHandId ? null : wristHandId,
    );
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

    return Object.entries(specialTests).map(([test, result]) => (
      <Box
        key={test}
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
      >
        <Typography variant="body2">{test}</Typography>
        <Chip
          label={result.replace('_', ' ')}
          size="small"
          color={
            result === 'positive'
              ? 'error'
              : result === 'negative'
                ? 'success'
                : 'default'
          }
        />
      </Box>
    ));
  };

  const formatRangeOfMotion = (rom) => {
    if (!rom) return 'Not assessed';

    const movements = [
      'flexion',
      'extension',
      'supination',
      'pronation',
      'radial_deviation',
      'ulnar_deviation',
      'finger_flexion',
      'finger_extension',
      'wrist_flexion',
      'wrist_extension',
    ];

    return movements
      .map((movement) => {
        const movementData = rom[movement];
        if (!movementData) return null;

        const leftValue = movementData.left;
        const rightValue = movementData.right;

        if (leftValue === null && rightValue === null) return null;

        return (
          <Box key={movement} sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
            >
              {movement.replace('_', ' ')}:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {leftValue !== null && (
                <Typography variant="body2">Left: {leftValue}°</Typography>
              )}
              {rightValue !== null && (
                <Typography variant="body2">Right: {rightValue}°</Typography>
              )}
            </Box>
          </Box>
        );
      })
      .filter(Boolean);
  };

  const formatListWithChips = (items, fieldName = 'items') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return `No ${fieldName}`;
    }
    return items.map((item, index) => (
      <Chip key={index} label={item} size="small" sx={{ m: 0.5 }} />
    ));
  };

  const formatPalpations = (palpations) => {
    if (
      !palpations ||
      !Array.isArray(palpations.palpations) ||
      palpations.palpations.length === 0
    ) {
      return palpations?.remark || 'No palpation remarks';
    }

    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Palpation Findings:
        </Typography>
        {palpations.palpations.map((palpation, index) => (
          <Chip
            key={index}
            label={palpation.area || `Palpation ${index + 1}`}
            size="small"
            sx={{ m: 0.5 }}
          />
        ))}
        {palpations.remark && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Remarks:</strong> {palpations.remark}
          </Typography>
        )}
      </Box>
    );
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
      handleFetchingWristHands();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingWristHands();
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
          Wrist & Hand Assessments
        </Typography>
        <IconButton
          color="primary"
          aria-label="add wrist & hand assessment"
          onClick={() => setOpenAddWristHand(true)}
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
          message="Unable to retrieve wrist & hand assessments."
        />
      ) : wristHands.length === 0 ? (
        <Fallbacks
          severity="info"
          title="No Wrist & Hand Assessments Found"
          description="Wrist & hand assessments will be listed here when available."
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <Box>
          {wristHands.map((wristHand, index) => (
            <Card
              key={wristHand.id}
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
                  onClick={() => toggleExpand(wristHand.id)}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <LocalHospitalIcon />
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
                              <strong>Wrist & Hand Assessment</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>HPI:</strong>{' '}
                              {wristHand.hpi || 'Not specified'}
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
                                  wristHand.visit_date,
                                ).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption">
                                <strong>Pain:</strong> {wristHand.pain_level}/10
                                ({wristHand.pain_type})
                              </Typography>
                              <Typography variant="caption">
                                <strong>By:</strong> {wristHand.created_by}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              {expandedWristHand === wristHand.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                            <DotMenu
                              onEdit={() => {
                                setEditModalOpen(true);
                                setSelectedWristHand(wristHand);
                              }}
                              onDelete={() =>
                                handleDeleteWristHand(wristHand.id)
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>

                {/* Expanded Details */}
                <Collapse
                  in={expandedWristHand === wristHand.id}
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
                            <strong>Level:</strong> {wristHand.pain_level}/10
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Type:</strong>{' '}
                            {wristHand.pain_type || 'Not specified'}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Pain Locations:</strong>
                            </Typography>
                            <Box>
                              {formatPainLocations(wristHand.pain_location)}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Radiation Location:</strong>{' '}
                            {wristHand.radiation_location || 'None'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Aggravating Factors:</strong>{' '}
                            {wristHand.aggravating_factors || 'None'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Easing Factors:</strong>{' '}
                            {wristHand.easing_factors || 'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Medical History"
                          icon={<DescriptionIcon fontSize="small" />}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>PMH:</strong>{' '}
                            {wristHand.pmh || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Complaints:</strong>{' '}
                            {wristHand.complaints || 'Not specified'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Red Flags"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {wristHand.red_flags?.flag_list &&
                          wristHand.red_flags.flag_list.length > 0 ? (
                            <Box>
                              {wristHand.red_flags.flag_list.map(
                                (flag, index) => (
                                  <Chip
                                    key={index}
                                    label={flag}
                                    color="error"
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ),
                              )}
                              {wristHand.red_flags.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {wristHand.red_flags.remark}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2">
                              No red flags identified
                            </Typography>
                          )}
                        </DataSection>

                        <DataSection
                          title="Functional Limitations"
                          icon={<AssignmentIcon fontSize="small" />}
                        >
                          {wristHand.functional_limitations_adl?.limitations &&
                          wristHand.functional_limitations_adl.limitations
                            .length > 0 ? (
                            <Box>
                              {wristHand.functional_limitations_adl.limitations.map(
                                (limitation, index) => (
                                  <Chip
                                    key={index}
                                    label={limitation}
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ),
                              )}
                              {wristHand.functional_limitations_adl.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {wristHand.functional_limitations_adl.remark}
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
                          title="Special Tests"
                          icon={<ScienceIcon fontSize="small" />}
                        >
                          {formatSpecialTests(wristHand.special_tests)}
                        </DataSection>

                        <DataSection
                          title="Range of Motion"
                          icon={<TrendingUpIcon fontSize="small" />}
                        >
                          {formatRangeOfMotion(wristHand.range_of_motion)}
                        </DataSection>

                        <DataSection
                          title="Palpations"
                          icon={<TouchAppIcon fontSize="small" />}
                        >
                          {formatPalpations(wristHand.palpations)}
                        </DataSection>

                        <DataSection
                          title="Muscle Flexibility"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Typography variant="body2">
                            {wristHand.muscle_flexibility?.remark ||
                              'No muscle flexibility remarks'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Circumference Measurements"
                          icon={<AssessmentIcon fontSize="small" />}
                        >
                          <Typography variant="body2">
                            {wristHand.circumference_measurements?.remark ||
                              'No circumference measurement remarks'}
                          </Typography>
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
                                wristHand.treatment_plans?.plans,
                                'treatment plans',
                              )}
                            </Box>
                            {wristHand.treatment_plans?.remark && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Remarks:</strong>{' '}
                                {wristHand.treatment_plans.remark}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Short Term Goal:</strong>{' '}
                            {wristHand.short_term_goal || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Precautions:</strong>{' '}
                            {wristHand.precautions_and_contraindications ||
                              'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Clinical Impression"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Box>
                            {formatListWithChips(
                              wristHand.clinical_impression?.impressions,
                              'clinical impressions',
                            )}
                            {wristHand.clinical_impression?.remark && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Remarks:</strong>{' '}
                                {wristHand.clinical_impression.remark}
                              </Typography>
                            )}
                          </Box>
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
                          <strong>Assessment ID:</strong> {wristHand.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Created:</strong>{' '}
                          {new Date(wristHand.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Visit Date:</strong>{' '}
                          {new Date(wristHand.visit_date).toLocaleDateString()}
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

      <AddWristHand
        open={openAddWristHand}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddWristHand(false)}
        onSubmit={handleAddWristHand}
        visit={visit}
      />

      <ToastContainer />
    </Box>
  );
};

export default WristHandTab;
