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
import AddNeurologicalBalance from './components/AddNeurologicalBalance';

const NeurologicalBalanceTab = ({ visit }) => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [neurologicals, setNeurologicals] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [expandedNeurological, setExpandedNeurological] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
  });
  const [meta, setMeta] = useState({
    last_page: 0,
    total: 0,
  });

  const [openAddNeurological, setOpenAddNeurological] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNeurological, setSelectedNeurological] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleFetchingNeurologicals = useCallback(async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.neurologicals}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}&visit_id=${visit?.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch Neurological');
      }

      if (responseData.success) {
        setNeurologicals(responseData.data.data);
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

  const handleAddNeurological = async (neurologicalData) => {
    setIsSubmitting(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.neurologicals}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(neurologicalData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add Neurological');
      }

      if (responseData.success) {
        toast.success('Neurological assessment added successfully');
        handleFetchingNeurologicals();
        setOpenAddNeurological(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNeurological = async (neurologicalId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.neurologicals}/${neurologicalId}`;
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
          responseData.message || 'Failed to delete neurological assessment',
        );
      }
      if (responseData.success) {
        toast.success('Neurological assessment deleted successfully');
        handleFetchingNeurologicals();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (neurologicalId) => {
    setExpandedNeurological(
      expandedNeurological === neurologicalId ? null : neurologicalId,
    );
  };

  // Helper functions for data formatting
  const formatNeurologicalSymptoms = (symptoms) => {
    if (!symptoms || !Array.isArray(symptoms)) return 'None specified';
    return symptoms.map((symptom) => (
      <Chip
        key={symptom}
        label={symptom}
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

  const formatListWithChips = (items, fieldName = 'items') => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return `No ${fieldName}`;
    }
    return items.map((item, index) => (
      <Chip key={index} label={item} size="small" sx={{ m: 0.5 }} />
    ));
  };

  const formatCranialNerveAssessment = (cranialNerve) => {
    if (!cranialNerve) return 'Not assessed';

    return (
      <Box>
        {cranialNerve.cranial_nerve_assessment &&
          cranialNerve.cranial_nerve_assessment.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Cranial Nerves Assessed:
              </Typography>
              <Box>
                {cranialNerve.cranial_nerve_assessment.map((nerve, index) => (
                  <Chip
                    key={index}
                    label={nerve}
                    size="small"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        {cranialNerve.remark && (
          <Typography variant="body2">
            <strong>Remarks:</strong> {cranialNerve.remark}
          </Typography>
        )}
      </Box>
    );
  };

  const formatSensoryAssessment = (sensory) => {
    if (!sensory) return 'Not assessed';

    return (
      <Box>
        {sensory.sensory_assessment &&
          sensory.sensory_assessment.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Sensory Tests:
              </Typography>
              <Box>
                {sensory.sensory_assessment.map((test, index) => (
                  <Chip key={index} label={test} size="small" sx={{ m: 0.5 }} />
                ))}
              </Box>
            </Box>
          )}
        {sensory.remark && (
          <Typography variant="body2">
            <strong>Remarks:</strong> {sensory.remark}
          </Typography>
        )}
      </Box>
    );
  };

  const formatNeurologicalAssessment = (neuro) => {
    if (!neuro) return 'Not assessed';

    return (
      <Box>
        {neuro.biomechanical && neuro.biomechanical.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Reflex Findings:
            </Typography>
            <Box>
              {neuro.biomechanical.map((finding, index) => (
                <Chip
                  key={index}
                  label={finding}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
        {neuro.remark && (
          <Typography variant="body2">
            <strong>Remarks:</strong> {neuro.remark}
          </Typography>
        )}
      </Box>
    );
  };

  const formatObservation = (observation) => {
    if (!observation) return 'Not assessed';

    return (
      <Box>
        {observation.findings && observation.findings.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Findings:
            </Typography>
            <Box>
              {observation.findings.map((finding, index) => (
                <Chip
                  key={index}
                  label={finding}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
        {observation.remark && (
          <Typography variant="body2">
            <strong>Remarks:</strong> {observation.remark}
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
      handleFetchingNeurologicals();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingNeurologicals();
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
          Neurological & Balance Assessments
        </Typography>
        <IconButton
          color="primary"
          aria-label="add neurological assessment"
          onClick={() => setOpenAddNeurological(true)}
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
          message="Unable to retrieve neurological assessments."
        />
      ) : neurologicals.length === 0 ? (
        <Fallbacks
          severity="info"
          title="No Neurological Assessments Found"
          description="Neurological assessments will be listed here when available."
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <Box>
          {neurologicals.map((neurological, index) => (
            <Card
              key={neurological.id}
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
                  onClick={() => toggleExpand(neurological.id)}
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
                              <strong>Neurological & Balance Assessment</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>HPI:</strong>{' '}
                              {neurological.hpi || 'Not specified'}
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
                                  neurological.visit_date,
                                ).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption">
                                <strong>Cognitive Status:</strong>{' '}
                                {neurological.cognitive_status}
                              </Typography>
                              <Typography variant="caption">
                                <strong>By:</strong> {neurological.created_by}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              {expandedNeurological === neurological.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                            <DotMenu
                              onEdit={() => {
                                setEditModalOpen(true);
                                setSelectedNeurological(neurological);
                              }}
                              onDelete={() =>
                                handleDeleteNeurological(neurological.id)
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
                  in={expandedNeurological === neurological.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Grid container spacing={3}>
                      {/* Neurological Symptoms Column */}
                      <Grid item xs={12} md={6}>
                        <DataSection
                          title="Neurological Symptoms"
                          icon={<AssessmentIcon fontSize="small" />}
                          defaultExpanded
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Symptoms:</strong>
                            </Typography>
                            <Box>
                              {formatNeurologicalSymptoms(
                                neurological.neurological_symptoms,
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Triggers:</strong>
                            </Typography>
                            <Box>
                              {formatListWithChips(
                                neurological.symptom_triggers,
                                'triggers',
                              )}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Cognitive Status:</strong>{' '}
                            {neurological.cognitive_status || 'Not assessed'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Aggravating Factors:</strong>{' '}
                            {neurological.aggravating_factors || 'None'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Easing Factors:</strong>{' '}
                            {neurological.easing_factors || 'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Medical History"
                          icon={<DescriptionIcon fontSize="small" />}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>PMH:</strong>{' '}
                            {neurological.pmh || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Complaints:</strong>{' '}
                            {neurological.complaints || 'Not specified'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Red Flags"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {neurological.red_flags?.flag_list &&
                          neurological.red_flags.flag_list.length > 0 ? (
                            <Box>
                              {neurological.red_flags.flag_list.map(
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
                              {neurological.red_flags.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {neurological.red_flags.remark}
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
                          {neurological.functional_limitations_adl
                            ?.limitations &&
                          neurological.functional_limitations_adl.limitations
                            .length > 0 ? (
                            <Box>
                              {neurological.functional_limitations_adl.limitations.map(
                                (limitation, index) => (
                                  <Chip
                                    key={index}
                                    label={limitation}
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ),
                              )}
                              {neurological.functional_limitations_adl
                                .remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {
                                    neurological.functional_limitations_adl
                                      .remark
                                  }
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
                          {formatSpecialTests(neurological.special_tests)}
                        </DataSection>

                        <DataSection
                          title="Cranial Nerve Assessment"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          {formatCranialNerveAssessment(
                            neurological.cranial_nerve_assessment,
                          )}
                        </DataSection>

                        <DataSection
                          title="Sensory Assessment"
                          icon={<TouchAppIcon fontSize="small" />}
                        >
                          {formatSensoryAssessment(
                            neurological.sensory_assessment,
                          )}
                        </DataSection>

                        <DataSection
                          title="Neurological Assessment"
                          icon={<AssessmentIcon fontSize="small" />}
                        >
                          {formatNeurologicalAssessment(
                            neurological.neurological_assessment,
                          )}
                        </DataSection>

                        <DataSection
                          title="Observations"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {formatObservation(neurological.observation)}
                        </DataSection>

                        <DataSection
                          title="Palpations"
                          icon={<TouchAppIcon fontSize="small" />}
                        >
                          <Typography variant="body2">
                            {neurological.palpations?.remark ||
                              'No palpation remarks'}
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
                                neurological.treatment_plans?.plans,
                                'treatment plans',
                              )}
                            </Box>
                            {neurological.treatment_plans?.remark && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Remarks:</strong>{' '}
                                {neurological.treatment_plans.remark}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Short Term Goal:</strong>{' '}
                            {neurological.short_term_goal || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Precautions:</strong>{' '}
                            {neurological.precautions_and_contraindications ||
                              'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Clinical Impression"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Box>
                            {formatListWithChips(
                              neurological.clinical_impression?.impressions,
                              'clinical impressions',
                            )}
                            {neurological.clinical_impression?.remark && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Remarks:</strong>{' '}
                                {neurological.clinical_impression.remark}
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
                          <strong>Assessment ID:</strong> {neurological.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Created:</strong>{' '}
                          {new Date(neurological.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Visit Date:</strong>{' '}
                          {new Date(
                            neurological.visit_date,
                          ).toLocaleDateString()}
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

      <AddNeurologicalBalance
        open={openAddNeurological}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddNeurological(false)}
        onSubmit={handleAddNeurological}
        visit={visit}
      />

      <ToastContainer />
    </Box>
  );
};

export default NeurologicalBalanceTab;
