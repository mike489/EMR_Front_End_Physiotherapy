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
import AddCervical from './components/AddCervical';

const CervicalTab = ({ visit }) => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [cervicals, setCervicals] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [expandedCervical, setExpandedCervical] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
  });
  const [meta, setMeta] = useState({
    last_page: 0,
    total: 0,
  });

  const [openAddCervical, setOpenAddCervical] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCervical, setSelectedCervical] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, per_page: event.target.value, page: 0 });
  };

  const handleFetchingCervicals = useCallback(async () => {
    setLoading(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.cervicals}?page=${pagination.page + 1}&per_page=${pagination.per_page}&search=${search}&visit_id=${visit?.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch Cervical');
      }

      if (responseData.success) {
        setCervicals(responseData.data.data);
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

  const handleAddCervical = async (cervicalData) => {
    setIsSubmitting(true);
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.cervicals}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(Api, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(cervicalData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add Cervical');
      }

      if (responseData.success) {
        toast.success('Cervical assessment added successfully');
        handleFetchingCervicals();
        setOpenAddCervical(false);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCervical = async (cervicalId) => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.cervicals}/${cervicalId}`;
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
          responseData.message || 'Failed to delete cervical assessment',
        );
      }
      if (responseData.success) {
        toast.success('Cervical assessment deleted successfully');
        handleFetchingCervicals();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (cervicalId) => {
    setExpandedCervical(expandedCervical === cervicalId ? null : cervicalId);
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

    const movements = ['flexion', 'extension', 'lateral_flexion', 'rotation'];
    return movements.map((movement) =>
      rom[movement] &&
      (rom[movement].left !== null ||
        rom[movement].right !== null ||
        rom[movement].left !== undefined ||
        rom[movement].right !== undefined) ? (
        <Box key={movement} sx={{ mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
          >
            {movement.replace('_', ' ')}:
          </Typography>
          <Box sx={{ pl: 2 }}>
            {rom[movement].left !== null &&
              rom[movement].left !== undefined && (
                <Typography variant="body2">
                  Left: {rom[movement].left}°
                </Typography>
              )}
            {rom[movement].right !== null &&
              rom[movement].right !== undefined && (
                <Typography variant="body2">
                  Right: {rom[movement].right}°
                </Typography>
              )}
          </Box>
        </Box>
      ) : null,
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

  const formatReflexTesting = (reflexes) => {
    if (!reflexes || !Array.isArray(reflexes) || reflexes.length === 0) {
      return 'No reflex testing performed';
    }
    return reflexes.map((reflex, index) => (
      <Chip key={index} label={reflex} size="small" sx={{ m: 0.5 }} />
    ));
  };

  const formatMyotome = (myotomes) => {
    if (!myotomes || !Array.isArray(myotomes) || myotomes.length === 0) {
      return 'No myotome testing performed';
    }
    return myotomes.map((myotome, index) => (
      <Chip key={index} label={myotome} size="small" sx={{ m: 0.5 }} />
    ));
  };

  const formatPostureAssessment = (posture) => {
    if (!posture) return 'Not assessed';

    return (
      <Box>
        {posture.assessments && posture.assessments.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Findings:
            </Typography>
            <Box>
              {posture.assessments.map((assessment, index) => (
                <Chip
                  key={index}
                  label={assessment}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
        {posture.remark && (
          <Typography variant="body2">
            <strong>Remarks:</strong> {posture.remark}
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
      handleFetchingCervicals();
    }, 800);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    if (mounted) {
      handleFetchingCervicals();
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
          Cervical Assessments
        </Typography>
        <IconButton
          color="primary"
          aria-label="add cervical assessment"
          onClick={() => setOpenAddCervical(true)}
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
          message="Unable to retrieve cervical assessments."
        />
      ) : cervicals.length === 0 ? (
        <Fallbacks
          severity="info"
          title="No Cervical Assessments Found"
          description="Cervical assessments will be listed here when available."
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <Box>
          {cervicals.map((cervical, index) => (
            <Card
              key={cervical.id}
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
                  onClick={() => toggleExpand(cervical.id)}
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
                              <strong>Cervical Assessment</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              <strong>HPI:</strong>{' '}
                              {cervical.hpi || 'Not specified'}
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
                                  cervical.visit_date,
                                ).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption">
                                <strong>Pain:</strong> {cervical.pain_level}/10
                                ({cervical.pain_type})
                              </Typography>
                              <Typography variant="caption">
                                <strong>By:</strong> {cervical.created_by}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                              {expandedCervical === cervical.id ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                            <DotMenu
                              onEdit={() => {
                                setEditModalOpen(true);
                                setSelectedCervical(cervical);
                              }}
                              onDelete={() => handleDeleteCervical(cervical.id)}
                            />
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>

                {/* Expanded Details */}
                <Collapse
                  in={expandedCervical === cervical.id}
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
                            <strong>Level:</strong> {cervical.pain_level}/10
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Type:</strong>{' '}
                            {cervical.pain_type || 'Not specified'}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Pain Locations:</strong>
                            </Typography>
                            <Box>
                              {formatPainLocations(cervical.pain_location)}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Radiation Location:</strong>{' '}
                            {cervical.radiation_location || 'None'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Aggravating Factors:</strong>{' '}
                            {cervical.aggravating_factors || 'None'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Easing Factors:</strong>{' '}
                            {cervical.easing_factors || 'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Medical History"
                          icon={<DescriptionIcon fontSize="small" />}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>PMH:</strong>{' '}
                            {cervical.pmh || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Complaints:</strong>{' '}
                            {cervical.complaints || 'Not specified'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Red Flags"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {cervical.red_flags?.flag_list &&
                          cervical.red_flags.flag_list.length > 0 ? (
                            <Box>
                              {cervical.red_flags.flag_list.map(
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
                              {cervical.red_flags.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {cervical.red_flags.remark}
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
                          {cervical.functional_limitations_adl?.limitations &&
                          cervical.functional_limitations_adl.limitations
                            .length > 0 ? (
                            <Box>
                              {cervical.functional_limitations_adl.limitations.map(
                                (limitation, index) => (
                                  <Chip
                                    key={index}
                                    label={limitation}
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ),
                              )}
                              {cervical.functional_limitations_adl.remark && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Remarks:</strong>{' '}
                                  {cervical.functional_limitations_adl.remark}
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
                          {formatSpecialTests(cervical.special_tests)}
                        </DataSection>

                        <DataSection
                          title="Range of Motion"
                          icon={<TrendingUpIcon fontSize="small" />}
                        >
                          {formatRangeOfMotion(cervical.range_of_motion)}
                        </DataSection>

                        <DataSection
                          title="Neurological Assessment"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontWeight: 'bold' }}
                            >
                              Reflex Testing:
                            </Typography>
                            {formatReflexTesting(cervical.reflex_testing)}
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontWeight: 'bold' }}
                            >
                              Myotome Testing:
                            </Typography>
                            {formatMyotome(cervical.myotome)}
                          </Box>
                        </DataSection>

                        <DataSection
                          title="Posture Assessment"
                          icon={<VisibilityIcon fontSize="small" />}
                        >
                          {formatPostureAssessment(cervical.posture_assessment)}
                        </DataSection>

                        <DataSection
                          title="Palpations"
                          icon={<TouchAppIcon fontSize="small" />}
                        >
                          <Typography variant="body2">
                            {cervical.palpations?.remark ||
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
                                cervical.treatment_plans?.plans,
                                'treatment plans',
                              )}
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Short Term Goal:</strong>{' '}
                            {cervical.short_term_goal || 'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Precautions:</strong>{' '}
                            {cervical.precautions_and_contraindications ||
                              'None'}
                          </Typography>
                        </DataSection>

                        <DataSection
                          title="Clinical Impression"
                          icon={<PsychologyIcon fontSize="small" />}
                        >
                          <Box>
                            {formatListWithChips(
                              cervical.clinical_impression?.impressions,
                              'clinical impressions',
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
                          <strong>Assessment ID:</strong> {cervical.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Created:</strong>{' '}
                          {new Date(cervical.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Visit Date:</strong>{' '}
                          {new Date(cervical.visit_date).toLocaleDateString()}
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

      <AddCervical
        open={openAddCervical}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddCervical(false)}
        onSubmit={handleAddCervical}
        visit={visit}
      />

      <ToastContainer />
    </Box>
  );
};

export default CervicalTab;
