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

const AddThoracic = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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
    pain_radiation: false,
    radiation_location: '',
    functional_limitations_adl: [],
    functional_limitations_adl_remark: '',

    // Thoracic-specific fields
    palpations: [],
    palpations_remark: '',
    biomechanical: [],
    biomechanical_remark: '',
    observation: [],
    observation_remark: '',

    // ROM for thoracic
    // Update the range_of_motion in the initial formData state:
    range_of_motion: {
      forward_bend: '',
      backward_bend: '',
      rotation_right: '',
      rotation_left: '',
      sidebend_right: '',
      sidebend_left: '',
    },
    rom_remark: '',

    // Strength for thoracic
    strength_upper_trapezius_right: '',
    strength_upper_trapezius_left: '',
    strength_middle_trapezius_right: '',
    strength_middle_trapezius_left: '',
    strength_lower_trapezius_right: '',
    strength_lower_trapezius_left: '',
    strength_rhomboids_right: '',
    strength_rhomboids_left: '',
    strength_serratus_anterior_right: '',
    strength_serratus_anterior_left: '',
    strength_remark: '',

    // Special tests for thoracic
    special_tests: [],
    special_tests_remark: '',

    // Neurological Scan - Updated to match image
    neurological_scan: {
      reflexes: {
        c3_c4: { left: '', right: '' },
        c5_c6: { left: '', right: '' },
        c7: { left: '', right: '' },
        l3_l4: { left: '', right: '' },
      },
      sensory: {
        c3_c4: { left: '', right: '' },
        c5_c6: { left: '', right: '' },
        c7: { left: '', right: '' },
      },
    },
    neurological_scan_remark: '',

    // Postural assessment
    postural_assessment: [],
    postural_assessment_remark: '',

    // Clinical findings
    swelling_present: false,
    bruising_present: false,
    deformity_present: false,
    muscle_atrophy: false,

    // Clinical Impression
    clinical_impression: [],
    clinical_impression_remark: '',

    // Treatment
    treatment_plans: [],
    treatment_plans_remark: '',
    short_term_goal: '',
    precautions_and_contraindications: '',

    // Add these to your formData state
    strength_c8_grip_right: '',
    strength_c8_grip_left: '',
    strength_c5_deltoid_right: '',
    strength_c5_deltoid_left: '',
    strength_c5_c6_biceps_right: '',
    strength_c5_c6_biceps_left: '',
    strength_c6_wrist_ext_right: '',
    strength_c6_wrist_ext_left: '',
    strength_c7_wrist_flex_right: '',
    strength_c7_wrist_flex_left: '',
    strength_t1_interossei_right: '',
    strength_t1_interossei_left: '',

    // Biomechanical fields
    biomechanical_lumbar: '',
    biomechanical_lumbar_restricted_rotation: '',
    biomechanical_lumbar_hypermobility_segments: '',
    biomechanical_thoracic: '',
    biomechanical_thoracic_restricted_rotation: '',
    biomechanical_thoracic_hypermobility_segments: '',
    biomechanical_restricted_segments: '',

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

  // Thoracic-specific pain locations
  const painLocations = [
    'Upper Thoracic (T1-T4)',
    'Middle Thoracic (T5-T8)',
    'Lower Thoracic (T9-T12)',
    'Interscapular',
    'Paraspinal',
    'Costovertebral Joints',
    'Sternum',
    'Rib Cage',
  ];

  // Thoracic-specific functional limitations
  const functionalLimitations = [
    'Deep Breathing',
    'Coughing/Sneezing',
    'Twisting/Turning',
    'Lifting Objects',
    'Reaching Overhead',
    'Sitting for Prolonged Periods',
    'Sleeping on Back/Side',
    'Sports Activities',
    'Work Tasks',
    'Driving',
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
  ];

  // Thoracic-specific special tests
  const specialTests = [
    {
      name: 'Thoracic Spring Test',
      description: 'Segmental mobility assessment',
    },
    {
      name: 'Rib Spring Test',
      description: 'Rib mobility assessment',
    },
    {
      name: 'Slump Test',
      description: 'Neural tension assessment',
    },
    {
      name: 'Costovertebral Joint Play',
      description: 'Joint mobility assessment',
    },
  ];

  // Thoracic-specific assessment options
  const AssessmentOptions = [
    'Thoracic Hypomobility',
    'Costovertebral Joint Dysfunction',
    'Thoracic Outlet Syndrome',
    'Postural Dysfunction',
    "Scheuermann's Disease",
    'Ankylosing Spondylitis',
    'Compression Fracture',
    'Muscle Strain',
    'Myofascial Pain Syndrome',
  ];

  const treatmentOptions = [
    'Thoracic Joint Mobilization',
    'Soft Tissue Mobilization',
    'Postural Training',
    'Therapeutic Exercises',
    'Strengthening Program',
    'Stretching Program',
    'Manual Therapy',
    'Activity Modification',
    'Ergonomic Training',
  ];

  const strengthOptions = [
    '0/5 - No contraction',
    '1/5 - Muscle flicker, but no movement',
    '2/5 - Movement with gravity eliminated',
    '3/5 - Movement against gravity only',
    '4/5 - Movement against some resistance',
    '5/5 - Normal strength',
  ];

  const clinicalImpressionOptions = [
    'Decreased AROM',
    'Decreased passive intervertebral motion',
    'Decreased muscle strength, upper quarter musculature',
    'Adaptive shortening of muscle',
    'Neural tension',
    'Decreased rib joint mobility',
    'Decreased scapular mobility',
    'Dysfunction',
    'Decreased mobility thoracic/rib cage',
    'Decreased thoracic and lumbar extension and rotation',
    'Postural dysfunction',
    'Scapular winging and dysfunction',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  const neurologicalOptions = [
    'N/T', // Not Tested
    'Intact',
    'Diminished',
    'Absent',
    'Hyperreflexia',
  ];

  // Thoracic-specific strength tests
  const strengthTests = [
    { key: 'upper_trapezius', label: 'Upper Trapezius' },
    { key: 'middle_trapezius', label: 'Middle Trapezius' },
    { key: 'lower_trapezius', label: 'Lower Trapezius' },
    { key: 'rhomboids', label: 'Rhomboids' },
    { key: 'serratus_anterior', label: 'Serratus Anterior' },
  ];

  // Thoracic-specific ROM tests

  const romTests = [
    { key: 'forward_bend', label: 'Forward Bend', normal: '30-40°' },
    { key: 'backward_bend', label: 'Backward Bend', normal: '20-25°' },
    { key: 'rotation_right', label: 'Rotation Right', normal: '30-35°' },
    { key: 'rotation_left', label: 'Rotation Left', normal: '30-35°' },
    { key: 'sidebend_right', label: 'Sidebend Right', normal: '25-30°' },
    { key: 'sidebend_left', label: 'Sidebend Left', normal: '25-30°' },
  ];

  // Add these options for the biomechanical sections
  const biomechanicalOptions = ['Normal mobility', 'Stiff throughout'];

  const segmentOptions = [
    'T1-T2',
    'T2-T3',
    'T3-T4',
    'T4-T5',
    'T5-T6',
    'T6-T7',
    'T7-T8',
    'T8-T9',
    'T9-T10',
    'T10-T11',
    'T11-T12',
    'L1-L2',
    'L2-L3',
    'L3-L4',
    'L4-L5',
    'L5-S1',
  ];

  // Add the handle functions for biomechanical fields
  const handleBiomechanicalChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      special_tests: {
        ...prev.special_tests,
        [testName]: result,
      },
    }));

  const handleStrengthChange = (testKey, side, value) => {
    const fieldName = `strength_${testKey}_${side}`;
    handleInputChange(fieldName, value);
  };

  const handleRomChange = (testKey, value) => {
    setFormData((prev) => ({
      ...prev,
      range_of_motion: {
        ...prev.range_of_motion,
        [testKey]: value,
      },
    }));
  };

  const handleNeurologicalChange = (category, testKey, side, value) => {
    setFormData((prev) => ({
      ...prev,
      neurological_scan: {
        ...prev.neurological_scan,
        [category]: {
          ...prev.neurological_scan[category],
          [testKey]: {
            ...prev.neurological_scan[category][testKey],
            [side]: value,
          },
        },
      },
    }));
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
          <Typography variant="h6">Thoracic Assessment</Typography>
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
              label="Passive Medical History (PMH)"
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
                {['sharp', 'dull', 'burning', 'tingling', 'throbbing'].map(
                  (type) => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={<Radio />}
                      label={type}
                    />
                  ),
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.pain_radiation}
                  onChange={(e) =>
                    handleInputChange('pain_radiation', e.target.checked)
                  }
                />
              }
              label="Pain Radiates"
            />
            {formData.pain_radiation && (
              <TextField
                fullWidth
                label="Radiation Location"
                value={formData.radiation_location}
                onChange={(e) =>
                  handleInputChange('radiation_location', e.target.value)
                }
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
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
              'Bruising Present',
              'Deformity Present',
              'Muscle Atrophy',
            ].map((label, i) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={
                      formData[
                        [
                          'swelling_present',
                          'bruising_present',
                          'deformity_present',
                          'muscle_atrophy',
                        ][i]
                      ]
                    }
                    onChange={(e) =>
                      handleInputChange(
                        [
                          'swelling_present',
                          'bruising_present',
                          'deformity_present',
                          'muscle_atrophy',
                        ][i],
                        e.target.checked,
                      )
                    }
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
          <Collapse in={showRemarks.observation}>
            <TextField
              fullWidth
              label="Observation Remark"
              value={formData.observation_remark}
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
            Range of Motion
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Movement</TableCell>
                  <TableCell align="center">Right</TableCell>
                  <TableCell align="center">Left</TableCell>
                  <TableCell align="center">Normal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Forward Bend */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Forward Bend</Typography>
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    <TextField
                      size="small"
                      type="number"
                      value={formData.range_of_motion.forward_bend || ''}
                      onChange={(e) =>
                        handleRomChange('forward_bend', e.target.value)
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
                    <Typography variant="body2" color="textSecondary">
                      30-40°
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Backward Bend */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Backward Bend</Typography>
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    <TextField
                      size="small"
                      type="number"
                      value={formData.range_of_motion.backward_bend || ''}
                      onChange={(e) =>
                        handleRomChange('backward_bend', e.target.value)
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
                    <Typography variant="body2" color="textSecondary">
                      20-25°
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Rotation */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Rotation</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      type="number"
                      value={formData.range_of_motion.rotation_right || ''}
                      onChange={(e) =>
                        handleRomChange('rotation_right', e.target.value)
                      }
                      placeholder="°"
                      sx={{ width: 100 }}
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
                      size="small"
                      type="number"
                      value={formData.range_of_motion.rotation_left || ''}
                      onChange={(e) =>
                        handleRomChange('rotation_left', e.target.value)
                      }
                      placeholder="°"
                      sx={{ width: 100 }}
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
                    <Typography variant="body2" color="textSecondary">
                      30-35°
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Sidebend */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">Sidebend</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      type="number"
                      value={formData.range_of_motion.sidebend_right || ''}
                      onChange={(e) =>
                        handleRomChange('sidebend_right', e.target.value)
                      }
                      placeholder="°"
                      sx={{ width: 100 }}
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
                      size="small"
                      type="number"
                      value={formData.range_of_motion.sidebend_left || ''}
                      onChange={(e) =>
                        handleRomChange('sidebend_left', e.target.value)
                      }
                      placeholder="°"
                      sx={{ width: 100 }}
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
                    <Typography variant="body2" color="textSecondary">
                      25-30°
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Remark field at the bottom */}
          <TextField
            fullWidth
            label="Remark"
            value={formData.rom_remark}
            onChange={(e) => handleInputChange('rom_remark', e.target.value)}
            size="small"
            sx={{ mt: 1 }}
            multiline
            rows={2}
            placeholder="Additional ROM observations..."
          />
        </Grid>

        {/* Biomechanical Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Biomechanical Assessment
          </Typography>

          {/* Lumbar Section */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Lumbar
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={formData.biomechanical_lumbar}
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_lumbar',
                        e.target.value,
                      )
                    }
                  >
                    {biomechanicalOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    Restricted rotation on / Hypermobility noted in the
                    following segments
                  </InputLabel>
                  <Select
                    value={
                      formData.biomechanical_lumbar_restricted_rotation || ''
                    }
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_lumbar_restricted_rotation',
                        e.target.value,
                      )
                    }
                    label="Restricted rotation on / Hypermobility noted in the following segments"
                  >
                    <MenuItem value="">
                      <em>-Select-</em>
                    </MenuItem>
                    {segmentOptions.map((segment) => (
                      <MenuItem key={`lumbar-${segment}`} value={segment}>
                        {segment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hypermobility segments</InputLabel>
                  <Select
                    value={
                      formData.biomechanical_lumbar_hypermobility_segments || ''
                    }
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_lumbar_hypermobility_segments',
                        e.target.value,
                      )
                    }
                    label="Hypermobility segments"
                  >
                    <MenuItem value="">
                      <em>-Select-</em>
                    </MenuItem>
                    {segmentOptions.map((segment) => (
                      <MenuItem key={`lumbar-hyper-${segment}`} value={segment}>
                        {segment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Thoracic Section */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Thoracic
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={formData.biomechanical_thoracic}
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_thoracic',
                        e.target.value,
                      )
                    }
                  >
                    {biomechanicalOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    Restricted rotation on / Hypermobility noted in the
                    following segments
                  </InputLabel>
                  <Select
                    value={
                      formData.biomechanical_thoracic_restricted_rotation || ''
                    }
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_thoracic_restricted_rotation',
                        e.target.value,
                      )
                    }
                    label="Restricted rotation on / Hypermobility noted in the following segments"
                  >
                    <MenuItem value="">
                      <em>-Select-</em>
                    </MenuItem>
                    {segmentOptions.map((segment) => (
                      <MenuItem key={`thoracic-${segment}`} value={segment}>
                        {segment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hypermobility segments</InputLabel>
                  <Select
                    value={
                      formData.biomechanical_thoracic_hypermobility_segments ||
                      ''
                    }
                    onChange={(e) =>
                      handleBiomechanicalChange(
                        'biomechanical_thoracic_hypermobility_segments',
                        e.target.value,
                      )
                    }
                    label="Hypermobility segments"
                  >
                    <MenuItem value="">
                      <em>-Select-</em>
                    </MenuItem>
                    {segmentOptions.map((segment) => (
                      <MenuItem
                        key={`thoracic-hyper-${segment}`}
                        value={segment}
                      >
                        {segment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Restricted Segments */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Restricted in the following segments
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Select restricted segments</InputLabel>
              <Select
                value={formData.biomechanical_restricted_segments || ''}
                onChange={(e) =>
                  handleBiomechanicalChange(
                    'biomechanical_restricted_segments',
                    e.target.value,
                  )
                }
                label="Select restricted segments"
              >
                <MenuItem value="">
                  <em>-Select-</em>
                </MenuItem>
                {segmentOptions.map((segment) => (
                  <MenuItem key={`restricted-${segment}`} value={segment}>
                    {segment}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Palpation Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Palpation
          </Typography>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              These muscles presented tender
            </Typography>

            <FormGroup>
              {[
                'Erector Spinea',
                'Rhomboid',
                'Mid traps',
                'Inter costal muscles',
                'Upper traps',
                'Infra.sp',
              ].map((muscle) => (
                <FormControlLabel
                  key={muscle}
                  control={
                    <Checkbox
                      checked={formData.palpations.includes(muscle)}
                      onChange={() => handleArrayToggle('palpations', muscle)}
                    />
                  }
                  label={muscle}
                />
              ))}
            </FormGroup>

            <TextField
              fullWidth
              label="Remark"
              value={formData.palpations_remark}
              onChange={(e) =>
                handleInputChange('palpations_remark', e.target.value)
              }
              size="small"
              sx={{ mt: 2 }}
              multiline
              rows={2}
              placeholder="Additional palpation observations..."
            />
          </Paper>
        </Grid>

        {/* Neurological Scan Section - Updated to match image */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Neurological Scan
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Right</TableCell>
                  <TableCell align="center">Left</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Reflexes */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ backgroundColor: 'grey.100' }}>
                    <Typography variant="subtitle2">Reflexs</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₃-C₄
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c3_c4?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c3_c4',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c3_c4?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c3_c4',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₅-C₆
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c5_c6?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c5_c6',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c5_c6?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c5_c6',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₇
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c7?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c7',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.c7?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'c7',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    L₃-L₄
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.l3_l4?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'l3_l4',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.l3_l4?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'l3_l4',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                {/* Sensory */}
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ backgroundColor: 'grey.100', mt: 2 }}
                  >
                    <Typography variant="subtitle2">Sensory</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₃-C₄
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c3_c4?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c3_c4',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c3_c4?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c3_c4',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₅-C₆
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c5_c6?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c5_c6',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c5_c6?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c5_c6',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    C₇
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c7?.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c7',
                            'right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.sensory.c7?.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'sensory',
                            'c7',
                            'left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-Select-</em>
                        </MenuItem>
                        {neurologicalOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            fullWidth
            label="Neurological Scan Remark"
            value={formData.neurological_scan_remark}
            onChange={(e) =>
              handleInputChange('neurological_scan_remark', e.target.value)
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
        <Grid container spacing={2}>
          {/* Strength Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Strength
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center">Right</TableCell>
                    <TableCell align="center">Left</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* C8 Finger flex (Grip strength) */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box>
                        <Typography variant="body2">C8 Finger flex.</Typography>
                        <Typography variant="caption" color="textSecondary">
                          (Grip strength)(Kg)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.strength_c8_grip_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_c8_grip_right',
                            e.target.value,
                          )
                        }
                        placeholder="Kg"
                        sx={{ width: 120 }}
                        InputProps={{
                          endAdornment: (
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              Kg
                            </Typography>
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.strength_c8_grip_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_c8_grip_left',
                            e.target.value,
                          )
                        }
                        placeholder="Kg"
                        sx={{ width: 120 }}
                        InputProps={{
                          endAdornment: (
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              Kg
                            </Typography>
                          ),
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* C5 Deltoid, Supra */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      C5 Deltoid, Supra
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c5_deltoid_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c5_deltoid_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c5_deltoid_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c5_deltoid_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* C5-6 Biceps */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      C5-6 Biceps
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c5_c6_biceps_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c5_c6_biceps_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c5_c6_biceps_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c5_c6_biceps_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* C6 Wrist ext. */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      C6 Wrist ext.
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c6_wrist_ext_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c6_wrist_ext_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c6_wrist_ext_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c6_wrist_ext_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* C7 Wrist flex. */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      C7 Wrist flex.
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c7_wrist_flex_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c7_wrist_flex_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_c7_wrist_flex_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_c7_wrist_flex_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* T1 Interossei */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      T1 Interossei
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_t1_interossei_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_t1_interossei_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_t1_interossei_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_t1_interossei_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {strengthOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TextField
              fullWidth
              label="Remark"
              value={formData.strength_remark}
              onChange={(e) =>
                handleInputChange('strength_remark', e.target.value)
              }
              multiline
              rows={2}
              required
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Special Tests */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Special Test
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell align="center">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {specialTests.map((test) => (
                    <TableRow key={test.name}>
                      <TableCell component="th" scope="row">
                        <Box>
                          <Typography variant="body2">{test.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {test.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <FormControl size="small" fullWidth>
                          <Select
                            value={formData.special_tests[test.name] || ''}
                            onChange={(e) =>
                              handleSpecialTestResult(test.name, e.target.value)
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>-Select-</em>
                            </MenuItem>
                            <MenuItem value="positive">Positive</MenuItem>
                            <MenuItem value="negative">Negative</MenuItem>
                            <MenuItem value="equivocal">Equivocal</MenuItem>
                            <MenuItem value="not_tested">Not Tested</MenuItem>
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
              value={formData.special_tests_remark}
              onChange={(e) =>
                handleInputChange('special_tests_remark', e.target.value)
              }
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Grid>
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

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Clinical Impressions
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => toggleRemark('clinicalImpression')}
              size="small"
              variant="outlined"
            >
              Other
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
            Mechanical deficits/Impairments found on examination
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {clinicalImpressionOptions.map((impression) => (
              <Chip
                key={impression}
                label={impression}
                onClick={() =>
                  handleArrayToggle('clinical_impression', impression)
                }
                color={
                  formData.clinical_impression.includes(impression)
                    ? 'primary'
                    : 'default'
                }
                variant={
                  formData.clinical_impression.includes(impression)
                    ? 'filled'
                    : 'outlined'
                }
                size="small"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
          <Collapse in={showRemarks.clinicalImpression}>
            <TextField
              fullWidth
              label="Remarks"
              value={formData.clinical_impression_remark}
              onChange={(e) =>
                handleInputChange('clinical_impression_remark', e.target.value)
              }
              multiline
              rows={2}
              placeholder="Additional clinical impressions..."
            />
          </Collapse>
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
        {/* Assessment & Plan */}
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
              placeholder="Improve thoracic mobility, Reduce pain with breathing..."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precautions & Contraindications"
              value={formData.precautions_and_contraindications}
              onChange={(e) =>
                handleInputChange(
                  'precautions_and_contraindications',
                  e.target.value,
                )
              }
              placeholder="Avoid heavy lifting, Maintain proper posture..."
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
        >
          Submit Assessment
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddThoracic;
