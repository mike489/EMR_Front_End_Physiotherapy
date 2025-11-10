import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  IconButton,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';

const AddLumbar = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
  const [formData, setFormData] = useState({
    complaints: '',
    pmh: '',
    hpi: '',
    red_flags: [],
    red_flags_remark: '',
    aggravating_factors: '',
    easing_factors: '',
    pain_location: [],
    pain_level: '',
    pain_type: '',
    radiation_location: '',
    functional_limitations_adl: [],
    functional_limitations_adl_remark: '',

    // Lumbar-specific fields
    range_of_motion_forward_bend: '',
    range_of_motion_backward_bend: '',
    range_of_motion_side_bend_left: '',
    range_of_motion_side_bend_right: '',
    range_of_motion_remark: '',

    // Special tests
    special_tests_slr_right: '',
    special_tests_slr_left: '',
    special_tests_slump_right: '',
    special_tests_slump_left: '',
    special_tests_femoral_right: '',
    special_tests_femoral_left: '',
    special_tests_faber_right: '',
    special_tests_faber_left: '',
    special_tests_schober_right: '',
    special_tests_schober_left: '',
    special_tests_remark: '',

    // Posture and biomechanical
    posture_assessment: [],
    posture_assessment_remark: '',

    // Remove the old biomechanical array and replace with individual fields:
    // biomechanical: [], // Remove this line
    // biomechanical_remark: '', // Remove this line

    // Add the new biomechanical fields:
    biomechanical_normal_mobility: false,
    biomechanical_stiff_throughout: false,
    biomechanical_restricted_right_rotation: false,
    biomechanical_restricted_left_rotation: false,
    biomechanical_hypermobility_noted: '',
    biomechanical_remark: '',

    // Palpation
    palpations: [],
    palpations_remark: '',

    // Muscle assessment
    muscle_flexibility: [],
    muscle_flexibility_remark: '',

    // Measurements
    circumference_measurements: [],
    circumference_measurements_remark: '',

    // Observation - make sure this is properly defined
    observation: [],
    observation_remark: '',

    // Clinical and treatment
    clinical_impression: [],
    clinical_impression_remark: '',
    treatment_plans: [],
    treatment_plans_remark: '',
    short_term_goal: '',
    precautions_and_contraindications: '',

    // Strength assessment fields
    strength_hip_adduction_right: '',
    strength_hip_adduction_left: '',
    strength_knee_flexion_right: '',
    strength_knee_flexion_left: '',
    strength_hip_extension_right: '',
    strength_hip_extension_left: '',
    strength_hip_flexion_right: '',
    strength_hip_flexion_left: '',
    strength_hip_abduction_right: '',
    strength_hip_abduction_left: '',
    strength_remark: '',

    // Pelvic biomechanical fields (NEW)
    biomechanical_pelvic_normal_si_mobility: false,
    biomechanical_pelvic_si_dysfunction: false,
    biomechanical_pelvic_symphysis_dysfunction: false,
    biomechanical_pelvic_superior_shear_hypermobility: false,
    biomechanical_pelvic_restricted_hip_internal_rotation: false,
    biomechanical_pelvic_remark: '',

    // Lower extremity flexibility fields (NEW)
    flexibility_gastro_soleus_right: '',
    flexibility_gastro_soleus_left: '',
    flexibility_quadriceps_right: '',
    flexibility_quadriceps_left: '',
    flexibility_illacus_psoas_right: '',
    flexibility_illacus_psoas_left: '',
    flexibility_hamstrings_right: '',
    flexibility_hamstrings_left: '',
    flexibility_gluteus_max_right: '',
    flexibility_gluteus_max_left: '',
    flexibility_piriformis_right: '',
    flexibility_piriformis_left: '',
    flexibility_hip_adductors_right: '',
    flexibility_hip_adductors_left: '',

    medical_diagnosis: '',

    visit_id: visit?.visit_id || '',
  });

  const [showRemarks, setShowRemarks] = useState({
    redFlags: false,
    painLocation: false,
    functionalLimitations: false,
    observations: false,
    assessmentPlan: false,
    treatmentPlan: false,
  });

  // Lumbar-specific pain locations
  const painLocations = [
    'Lumbar Spine (L1-L5)',
    'Sacral Region',
    'SI Joint',
    'Buttocks',
    'Hip',
    'Groin',
    'Thigh (Anterior)',
    'Thigh (Posterior)',
    'Knee',
    'Lower Leg',
    'Foot',
  ];

  // Lumbar-specific functional limitations
  const functionalLimitations = [
    'Sitting',
    'Standing',
    'Walking',
    'Lifting',
    'Bending',
    'Twisting',
    'Stair Climbing',
    'Driving',
    'Sleeping',
    'Dressing',
    'Personal Hygiene',
    'Work Tasks',
    'Sports Activities',
    'Household Chores',
  ];

  const redFlags = [
    'Severe Unremitting Pain',
    'Night Pain',
    'Unexplained Weight Loss',
    'History of Cancer',
    'Fever/Chills',
    'IV Drug Use',
    'Immunosuppression',
    'Trauma',
    'Neurological Deficit',
    'Bowel/Bladder Changes',
    'Saddle Anesthesia',
    'Loss of Balance',
    'Difficulty Walking',
  ];

  // Lumbar-specific special tests
  const specialTests = [
    {
      name: 'Straight Leg Raise Test',
      description: 'Lumbar nerve root irritation',
    },
    {
      name: 'Slump Test',
      description: 'Neural tension assessment',
    },
    {
      name: 'Femoral Nerve Stretch Test',
      description: 'Upper lumbar nerve root involvement',
    },
    {
      name: "Patrick's Test (FABER)",
      description: 'SI joint dysfunction',
    },
    {
      name: 'Modified Schober Test',
      description: 'Lumbar flexion measurement',
    },
  ];

  // Lumbar-specific assessment options
  const AssessmentOptions = [
    'Lumbar Radiculopathy',
    'SI Joint Dysfunction',
    'Lumbar Spondylosis',
    'Herniated Disc',
    'Spinal Stenosis',
    'Mechanical Low Back Pain',
    'Facet Joint Syndrome',
    'Spondylolisthesis',
    'Muscle Strain',
    'Postural Dysfunction',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Core Stabilization',
    'Postural Re-education',
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Traction',
    'Ergonomic Education',
    'Pain Management',
    'Strengthening Program',
    'Flexibility Training',
  ];

  const clinicalImpressionOptions = [
    'Postural Dysfunction',
    'Decreased lumbar ROM',
    'Muscle Guarding',
    'Myofascial Restrictions',
    'Joint Hypomobility',
    'Neurological Involvement',
    'Muscle Weakness',
    'Movement Coordination Deficits',
    'Muscle Imbalance',
    'Functional instability of lumbopelvic region',
    'Lumbar spine dysfunction',
    'Decreased lumbar spine active range of motion',
    'Lumbar hypermobility',
    'Facet joint hypomobility lumbar/thoracic spine',
    'S-I dysfunction with possible hypermobility/with pubic joint involvement',
    'Sensitivity thoracic and lumbar vertebrae to p-a oscillations',
    'Roto scoliosis',
    'Hip capsule restriction',
    'Hip flexor muscle dysfunction',
    'Soft tissue dysfunction of pelvic girdle musculature and erector spine',
    'Hypertonic musculature',
    'Decreased lower extremity muscle lengths',
    'Lower extremity muscle weakness',
    'Adverse neural tension signs right/left sciatic and right/left femoral tract bilaterally',
    'Gait dysfunction',
    'Long quadrant',
    'Altered mechanics superior tib/fib joint/ Altered mechanics ankle joint',
    'Generalized physical deconditioning',
  ];

  const neurologicalOptions = [
    'Sensory Changes',
    'Motor Weakness',
    'Reflex Changes',
    'Radicular Symptoms',
    'Dermatomal Pattern',
    'Myotomal Weakness',
    'Neurogenic Claudication',
  ];

  const postureOptions = [
    'Increased Lumbar Lordosis',
    'Decreased Lumbar Lordosis',
    'Flat Back',
    'Sway Back',
    'Pelvic Tilt (Anterior)',
    'Pelvic Tilt (Posterior)',
    'Lateral Shift',
    'Shoulder Asymmetry',
    'Leg Length Discrepancy',
  ];

  const muscleFlexibilityOptions = [
    'Hamstrings Tight',
    'Hip Flexors Tight',
    'Quadratus Lumborum Tight',
    'Piriformis Tight',
    'Erector Spinae Tight',
    'Gluteals Tight',
    'Tensor Fascia Lata Tight',
  ];

  const circumferenceOptions = [
    'Thigh Circumference',
    'Calf Circumference',
    'Waist Circumference',
    'Hip Circumference',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  // Lumbar-specific palpation tests
  const palpationTests = [
    { key: 'lumbar_paraspinals', label: 'Lumbar Paraspinals' },
    { key: 'quadratus_lumborum', label: 'Quadratus Lumborum' },
    { key: 'si_joint', label: 'SI Joint' },
    { key: 'psiss', label: 'PSIS' },
    { key: 'piriformis', label: 'Piriformis' },
    { key: 'gluteus_medius', label: 'Gluteus Medius' },
    { key: 'gluteus_maximus', label: 'Gluteus Maximus' },
    { key: 'hamstrings_origin', label: 'Hamstrings Origin' },
  ];

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleArrayToggle = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));

  const handleSpecialTestResult = (testName, result) =>
    setFormData((prev) => ({
      ...prev,
      special_tests: { ...prev.special_tests, [testName]: result },
    }));

  const handlePalpationChange = (testKey, value) => {
    const fieldName = `palpations_${testKey}`;
    handleInputChange(fieldName, value);
  };

  const toggleRemark = (section) => {
    setShowRemarks((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = () => onSubmit(formData);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lumbar Assessment</Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: '70vh',
          '&::-webkit-scrollbar': {
            width: '16px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '6px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        {/* Chief Complaint & History */}
        <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
          Chief Complaint & History
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary Complaint"
              value={formData.complaints}
              onChange={(e) => handleInputChange('complaints', e.target.value)}
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Past Medical History (PMH)"
              value={formData.pmh}
              onChange={(e) => handleInputChange('pmh', e.target.value)}
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="History of Present Illness (HPI)"
              value={formData.hpi}
              onChange={(e) => handleInputChange('hpi', e.target.value)}
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Aggravating Factors"
              value={formData.aggravating_factors}
              onChange={(e) =>
                handleInputChange('aggravating_factors', e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Easing Factors"
              value={formData.easing_factors}
              onChange={(e) =>
                handleInputChange('easing_factors', e.target.value)
              }
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Red Flags Screening
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => toggleRemark('redFlags')}
              size="small"
              variant="outlined"
            >
              Other
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {redFlags.map((flag) => (
              <Chip
                key={flag}
                label={flag}
                onClick={() => handleArrayToggle('red_flags', flag)}
                color={formData.red_flags.includes(flag) ? 'error' : 'default'}
                variant={
                  formData.red_flags.includes(flag) ? 'filled' : 'outlined'
                }
                size="small"
              />
            ))}
          </Box>
          <Collapse in={showRemarks.redFlags}>
            <TextField
              fullWidth
              label="Red Flags Remark"
              value={formData.red_flags_remark}
              onChange={(e) =>
                handleInputChange('red_flags_remark', e.target.value)
              }
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          </Collapse>
        </Grid>

        {/* Pain Assessment */}
        <Typography variant="h5" gutterBottom>
          Pain Assessment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Pain Location</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('painLocation')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>
            <FormGroup row sx={{ flexWrap: 'wrap' }}>
              {painLocations.map((location) => (
                <FormControlLabel
                  key={location}
                  control={
                    <Checkbox
                      checked={formData.pain_location.includes(location)}
                      onChange={() =>
                        handleArrayToggle('pain_location', location)
                      }
                    />
                  }
                  label={location}
                />
              ))}
            </FormGroup>
            <Collapse in={showRemarks.painLocation}>
              <TextField
                fullWidth
                label="Pain Location Remark"
                value={formData.pain_location_remark}
                onChange={(e) =>
                  handleInputChange('pain_location_remark', e.target.value)
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Pain Level</Typography>

            {/* Dynamic colored text */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Typography variant="body1">
                {formData.pain_level}/10 —{' '}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    ml: 1,
                    color:
                      formData.pain_level <= 3
                        ? '#00C853'
                        : formData.pain_level <= 7
                          ? '#FFD700'
                          : '#D50000',
                  }}
                >
                  {formData.pain_level <= 3
                    ? 'Low'
                    : formData.pain_level <= 7
                      ? 'Medium'
                      : 'High'}
                </Box>
              </Typography>
            </Box>

            {/* Slider */}
            <Slider
              value={Number(formData.pain_level)}
              onChange={(_, value) =>
                handleInputChange('pain_level', String(value))
              }
              min={0}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{
                color:
                  formData.pain_level <= 3
                    ? '#00C853'
                    : formData.pain_level <= 7
                      ? '#FFD700'
                      : '#ec1c1c',
                '& .MuiSlider-thumb': {
                  backgroundColor:
                    formData.pain_level <= 3
                      ? '#00C853'
                      : formData.pain_level <= 7
                        ? '#FFD700'
                        : '#ec1c1c',
                },
                '& .MuiSlider-track': {
                  backgroundColor:
                    formData.pain_level <= 3
                      ? '#00C853'
                      : formData.pain_level <= 7
                        ? '#FFD700'
                        : '#ec1c1c',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>Pain Type</FormLabel>
              <RadioGroup
                row
                value={formData.pain_type}
                onChange={(e) => handleInputChange('pain_type', e.target.value)}
              >
                {[
                  'sharp',
                  'dull',
                  'burning',
                  'tingling',
                  'throbbing',
                  'aching',
                ].map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Radiation Location"
              value={formData.radiation_location}
              onChange={(e) =>
                handleInputChange('radiation_location', e.target.value)
              }
              placeholder="Buttock, leg, foot, groin..."
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* Observations Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Observations
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => toggleRemark('observations')}
              size="small"
              variant="outlined"
            >
              Other
            </Button>
          </Box>
          <FormGroup row>
            {[
              'Swelling Present',
              'Muscle Spasm',
              'Deformity Present',
              'Muscle Atrophy',
              'Skin Changes',
              'Ecchymosis',
            ].map((label) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={(formData.observation || []).includes(label)}
                    onChange={() => handleArrayToggle('observation', label)}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
          <Collapse in={showRemarks.observations}>
            <TextField
              fullWidth
              label="Observation Remark"
              value={formData.observation_remark || ''}
              onChange={(e) =>
                handleInputChange('observation_remark', e.target.value)
              }
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Collapse>
        </Grid>

        {/* ROM Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            ROM Lumbar
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Measurement
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '50%' }}>
                    <Box>
                      <Typography variant="body2">Forward Bend</Typography>
                      <Typography variant="caption" color="textSecondary">
                        (N=60°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion_forward_bend || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'range_of_motion_forward_bend',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2">Backward Bend</Typography>
                      <Typography variant="caption" color="textSecondary">
                        (N=25°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion_backward_bend || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'range_of_motion_backward_bend',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2">Side bend (L)</Typography>
                      <Typography variant="caption" color="textSecondary">
                        (N=25°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion_side_bend_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'range_of_motion_side_bend_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2">Side bend (R)</Typography>
                      <Typography variant="caption" color="textSecondary">
                        (N=25°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion_side_bend_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'range_of_motion_side_bend_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <TextField
                      fullWidth
                      label="Remark"
                      value={formData.range_of_motion_remark || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'range_of_motion_remark',
                          e.target.value,
                        )
                      }
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Additional notes on range of motion..."
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Divider sx={{ my: 3 }} />
        {/* Palpation Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Palpation
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
            These structures presented tender
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {palpationTests.map((test) => (
                  <TableRow key={test.key}>
                    <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                      <Typography variant="body2">{test.label}</Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData[`palpations_${test.key}`] || ''}
                          onChange={(e) =>
                            handlePalpationChange(test.key, e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {tendernessOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            fullWidth
            label="Remark"
            value={formData.palpations_remark}
            onChange={(e) =>
              handleInputChange('palpations_remark', e.target.value)
            }
            size="small"
            sx={{ mt: 1 }}
            multiline
            rows={2}
          />
        </Grid>
        <Divider sx={{ my: 3 }} />
        {/* Physical Examination */}
        <Typography variant="h5" gutterBottom>
          Physical Examination
        </Typography>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Strength Assessment
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Strength</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Right
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Left
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hip adduction
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_adduction_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_adduction_right',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_adduction_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_adduction_left',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Knee flexion
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_knee_flexion_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_knee_flexion_right',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_knee_flexion_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_knee_flexion_left',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hip Extension
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_extension_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_extension_right',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_extension_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_extension_left',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hip Flexion
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_flexion_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_flexion_right',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_flexion_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_flexion_left',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hip Abduction
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_abduction_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_abduction_right',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      value={formData.strength_hip_abduction_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'strength_hip_abduction_left',
                          e.target.value,
                        )
                      }
                      placeholder="Grade"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <TextField
                      fullWidth
                      label="Remark"
                      value={formData.strength_remark || ''}
                      onChange={(e) =>
                        handleInputChange('strength_remark', e.target.value)
                      }
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Additional notes on strength assessment..."
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Biomechanical Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Biomechanical Lumbar Spine
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Normal mobility</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_normal_mobility || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_normal_mobility',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Stiff throughout</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_stiff_throughout || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_stiff_throughout',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Restricted right rotation
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_restricted_right_rotation ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_restricted_right_rotation',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Restricted left rotation
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_restricted_left_rotation ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_restricted_left_rotation',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Hypermobility noted in the:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.biomechanical_hypermobility_noted || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'biomechanical_hypermobility_noted',
                          e.target.value,
                        )
                      }
                      placeholder="Specify location of hypermobility..."
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <TextField
                      fullWidth
                      label="Remark"
                      value={formData.biomechanical_remark || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'biomechanical_remark',
                          e.target.value,
                        )
                      }
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Additional notes on biomechanical assessment..."
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Biomechanical Pelvic Joints */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Biomechanical Pelvic Joints
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Normal S-I mobility</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_pelvic_normal_si_mobility ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_pelvic_normal_si_mobility',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">S-I dysfunction</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_pelvic_si_dysfunction ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_pelvic_si_dysfunction',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Public symphysis dysfunction
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_pelvic_symphysis_dysfunction ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_pelvic_symphysis_dysfunction',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Superior shear hypermobility
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_pelvic_superior_shear_hypermobility ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_pelvic_superior_shear_hypermobility',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      Restricted hip internal rotation
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            formData.biomechanical_pelvic_restricted_hip_internal_rotation ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'biomechanical_pelvic_restricted_hip_internal_rotation',
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <TextField
                      fullWidth
                      label="Remark"
                      value={formData.biomechanical_pelvic_remark || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'biomechanical_pelvic_remark',
                          e.target.value,
                        )
                      }
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Additional notes on pelvic joint biomechanics..."
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Lower Extremity Flexibility Muscles */}
        {/* Lower Extremity Flexibility Muscles */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Lower Extremity Flexibility Muscles - Restricted by
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                    Muscle Group
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 'bold', width: '30%' }}
                  >
                    Right
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 'bold', width: '30%' }}
                  >
                    Left
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Gastro/soleus</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_gastro_soleus_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_gastro_soleus_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_gastro_soleus_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_gastro_soleus_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Quadriceps</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_quadriceps_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_quadriceps_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_quadriceps_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_quadriceps_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Illacus/psoas</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_illacus_psoas_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_illacus_psoas_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_illacus_psoas_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_illacus_psoas_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Hamstrings</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_hamstrings_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_hamstrings_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_hamstrings_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_hamstrings_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Gluteus max</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_gluteus_max_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_gluteus_max_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_gluteus_max_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_gluteus_max_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Piriformis</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_piriformis_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_piriformis_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_piriformis_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_piriformis_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Hip adductors</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_hip_adductors_right || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_hip_adductors_right',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.flexibility_hip_adductors_left || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'flexibility_hip_adductors_left',
                          e.target.value,
                        )
                      }
                      placeholder="°"
                      sx={{ width: 120 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            °
                          </Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Divider sx={{ my: 3 }} />
        {/* Functional Status */}
        <Typography variant="h5" gutterBottom>
          Functional Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">
                Functional Limitations
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('functionalLimitations')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {functionalLimitations.map((limitation) => (
                <Chip
                  key={limitation}
                  label={limitation}
                  onClick={() =>
                    handleArrayToggle('functional_limitations_adl', limitation)
                  }
                  color={
                    formData.functional_limitations_adl.includes(limitation)
                      ? 'primary'
                      : 'default'
                  }
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
            <Collapse in={showRemarks.functionalLimitations}>
              <TextField
                fullWidth
                label="Functional Limitations Remark"
                value={formData.functional_limitations_adl_remark}
                onChange={(e) =>
                  handleInputChange(
                    'functional_limitations_adl_remark',
                    e.target.value,
                  )
                }
                multiline
                rows={2}
              />
            </Collapse>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>
          Medical Diagnosis
        </Typography>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical Diagnosis"
            value={formData.medical_diagnosis}
            onChange={(e) =>
              handleInputChange('medical_diagnosis', e.target.value)
            }
            multiline
            rows={2}
            required
          />
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle1">Treatment Plan</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('treatmentPlan')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {treatmentOptions.map((treatment) => {
                const selected = formData.treatment_plans.includes(treatment);
                return (
                  <Chip
                    key={treatment}
                    label={treatment}
                    onClick={() =>
                      handleArrayToggle('treatment_plans', treatment)
                    }
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    size="small"
                  />
                );
              })}
            </Box>
            <Collapse in={showRemarks.treatmentPlan}>
              <TextField
                fullWidth
                label="Treatment Plan Remark"
                value={formData.treatment_plans_remark}
                onChange={(e) =>
                  handleInputChange('treatment_plans_remark', e.target.value)
                }
                multiline
                rows={2}
              />
            </Collapse>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short-term Goal"
              value={formData.short_term_goal}
              onChange={(e) =>
                handleInputChange('short_term_goal', e.target.value)
              }
              placeholder="Reduce pain by 50%, Improve functional mobility, Restore ADL independence..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={isSubmitting}
          variant="contained"
          // disabled={!formData.complaints || !formData.clinical_impression}
        >
          Submit Assessment
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddLumbar;
