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

const AddShoulder = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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

    // Shoulder-specific fields
    palpations: [],
    palpations_remark: '',
    biomechanical: [],
    biomechanical_remark: '',
    observation: [],
    observation_remark: '',

    // ROM for shoulder
    range_of_motion: {
      flexion: { left: '', right: '' },
      extension: { left: '', right: '' },
      abduction: { left: '', right: '' },
      adduction: { left: '', right: '' },
      internal_rotation: { left: '', right: '' },
      external_rotation: { left: '', right: '' },
    },
    rom_remark: '',

    // Strength for shoulder
    strength_flexion_right: '',
    strength_flexion_left: '',
    strength_extension_right: '',
    strength_extension_left: '',
    strength_abduction_right: '',
    strength_abduction_left: '',
    strength_adduction_right: '',
    strength_adduction_left: '',
    strength_internal_rotation_right: '',
    strength_internal_rotation_left: '',
    strength_external_rotation_right: '',
    strength_external_rotation_left: '',
    strength_retraction_right: '',
    strength_retraction_left: '',
    strength_depression_right: '',
    strength_depression_left: '',
    strength_remark: '',

    // Special tests for shoulder
    special_tests: [],
    special_tests_remark: '',

    // Neurological Scan
    neurological_scan: {
      reflexes: {
        c5_c6: { left: '', right: '' },
        c7: { left: '', right: '' },
        l3_l4: { left: '', right: '' },
      },
      sensory: {
        c5: { left: '', right: '' },
        c6: { left: '', right: '' },
        c7: { left: '', right: '' },
        c8: { left: '', right: '' },
        t1: { left: '', right: '' },
      },
    },
    neurological_scan_remark: '',

    // Balance and gait
    balance_issues: [],
    balance_issues_remark: '',
    gait_pattern: '',

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

  // Shoulder-specific pain locations
  const painLocations = [
    'Anterior Shoulder',
    'Lateral Shoulder',
    'Posterior Shoulder',
    'Acromioclavicular Joint',
    'Sternoclavicular Joint',
    'Bicipital Groove',
    'Rotator Cuff',
    'Deltoid',
  ];

  // Shoulder-specific functional limitations
  const functionalLimitations = [
    'Reaching Overhead',
    'Lifting Objects',
    'Pushing/Pulling',
    'Dressing',
    'Personal Hygiene',
    'Sleeping on Affected Side',
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

  // Shoulder-specific special tests
  const specialTests = [
    {
      name: 'Hawkins-Kennedy Test',
      description: 'Impingement test',
    },
    {
      name: 'Neer Test',
      description: 'Impingement test',
    },
    {
      name: 'Empty Can Test',
      description: 'Supraspinatus strength',
    },
    {
      name: 'Lift-off Test',
      description: 'Subscapularis strength',
    },
    {
      name: 'Apprehension Test',
      description: 'Anterior instability',
    },
  ];

  // Shoulder-specific assessment options
  const AssessmentOptions = [
    'Rotator Cuff Tendinopathy',
    'Shoulder Impingement',
    'Adhesive Capsulitis',
    'Glenohumeral Instability',
    'Labral Tear',
    'AC Joint Sprain',
    'Biceps Tendinopathy',
    'Shoulder Osteoarthritis',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Range of Motion Exercises',
    'Strengthening Program',
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Activity Modification',
    'Postural Training',
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
    'Decreased active ROM',
    'Decreased passive ROM',
    'Muscle Weakness',
    'Joint Stiffness',
    'Swelling',
    'Instability',
    'Muscle Imbalance',
    'Postural Dysfunction',
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

  // Shoulder-specific strength tests
  const strengthTests = [
    { key: 'flexion', label: 'Flexion' },
    { key: 'extension', label: 'Extension' },
    { key: 'abduction', label: 'Abduction' },
    { key: 'adduction', label: 'Adduction' },
    { key: 'internal_rotation', label: 'Internal Rotation' },
    { key: 'external_rotation', label: 'External Rotation' },
    { key: 'retraction', label: 'Retraction' },
    { key: 'depression', label: 'Depression' },
  ];

  // Shoulder-specific palpation tests
  const palpationTests = [
    { key: 'acromioclavicular_joint', label: 'Acromioclavicular Joint' },
    { key: 'sternoclavicular_joint', label: 'Sternoclavicular Joint' },
    { key: 'bicipital_groove', label: 'Bicipital Groove' },
    { key: 'supraspinatus', label: 'Supraspinatus' },
    { key: 'infraspinatus', label: 'Infraspinatus' },
    { key: 'subscapularis', label: 'Subscapularis' },
    { key: 'teres_minor', label: 'Teres Minor' },
    { key: 'deltoid', label: 'Deltoid' },
  ];

  // Shoulder-specific ROM tests
  const romTests = [
    { key: 'flexion', label: 'Flexion', normal: '180°' },
    { key: 'extension', label: 'Extension', normal: '60°' },
    { key: 'abduction', label: 'Abduction', normal: '180°' },
    { key: 'adduction', label: 'Adduction', normal: '45°' },
    { key: 'internal_rotation', label: 'Internal Rotation', normal: '70°' },
    { key: 'external_rotation', label: 'External Rotation', normal: '90°' },
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
      special_tests: {
        ...prev.special_tests,
        [testName]: result,
      },
    }));

  const handleStrengthChange = (testKey, side, value) => {
    const fieldName = `strength_${testKey}_${side}`;
    handleInputChange(fieldName, value);
  };

  const handleRomChange = (testKey, side, value) => {
    setFormData((prev) => ({
      ...prev,
      range_of_motion: {
        ...prev.range_of_motion,
        [testKey]: {
          ...prev.range_of_motion[testKey],
          [side]: value,
        },
      },
    }));
  };

  const handlePalpationChange = (testKey, value) => {
    const fieldName = `palpations_${testKey}`;
    handleInputChange(fieldName, value);
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
          <Typography variant="h6">Shoulder Assessment</Typography>
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
        {/* ROM Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Range of Motion
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ROM</TableCell>
                  <TableCell align="center">Right</TableCell>
                  <TableCell align="center">Left</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2">Flexion (N=180°)</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion.flexion?.right || ''}
                      onChange={(e) =>
                        handleRomChange('flexion', 'right', e.target.value)
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
                      value={formData.range_of_motion.flexion?.left || ''}
                      onChange={(e) =>
                        handleRomChange('flexion', 'left', e.target.value)
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
                      <Typography variant="body2">
                        Abduction (N=180°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion.abduction?.right || ''}
                      onChange={(e) =>
                        handleRomChange('abduction', 'right', e.target.value)
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
                      value={formData.range_of_motion.abduction?.left || ''}
                      onChange={(e) =>
                        handleRomChange('abduction', 'left', e.target.value)
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
                      <Typography variant="body2">
                        Internal Rotation (N=70°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={
                        formData.range_of_motion.internal_rotation?.right || ''
                      }
                      onChange={(e) =>
                        handleRomChange(
                          'internal_rotation',
                          'right',
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
                      value={
                        formData.range_of_motion.internal_rotation?.left || ''
                      }
                      onChange={(e) =>
                        handleRomChange(
                          'internal_rotation',
                          'left',
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
                      <Typography variant="body2">
                        External Rotation (N=90°)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={
                        formData.range_of_motion.external_rotation?.right || ''
                      }
                      onChange={(e) =>
                        handleRomChange(
                          'external_rotation',
                          'right',
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
                      value={
                        formData.range_of_motion.external_rotation?.left || ''
                      }
                      onChange={(e) =>
                        handleRomChange(
                          'external_rotation',
                          'left',
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
          <TextField
            fullWidth
            label="Remark"
            value={formData.rom_remark}
            onChange={(e) => handleInputChange('rom_remark', e.target.value)}
            size="small"
            sx={{ mt: 1 }}
            multiline
            rows={2}
          />
        </Grid>

        {/* Palpation Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Palpation
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

        {/* Neurological Scan Section */}
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
                    <Typography variant="subtitle2">Reflexes</Typography>
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
                          formData.neurological_scan.reflexes.c5_c6.right || ''
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
                          formData.neurological_scan.reflexes.c5_c6.left || ''
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
                          formData.neurological_scan.reflexes.c7.right || ''
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
                          formData.neurological_scan.reflexes.c7.left || ''
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
                          formData.neurological_scan.reflexes.l3_l4.right || ''
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
                          formData.neurological_scan.reflexes.l3_l4.left || ''
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
                {['c5', 'c6', 'c7', 'c8', 't1'].map((nerve) => (
                  <TableRow key={nerve}>
                    <TableCell component="th" scope="row">
                      {nerve.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.neurological_scan.sensory[nerve].right ||
                            ''
                          }
                          onChange={(e) =>
                            handleNeurologicalChange(
                              'sensory',
                              nerve,
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
                            formData.neurological_scan.sensory[nerve].left || ''
                          }
                          onChange={(e) =>
                            handleNeurologicalChange(
                              'sensory',
                              nerve,
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
                ))}
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
                  {strengthTests.map((test) => (
                    <TableRow key={test.key}>
                      <TableCell component="th" scope="row">
                        {test.label}
                      </TableCell>
                      <TableCell align="center">
                        <FormControl size="small" fullWidth>
                          <Select
                            value={formData[`strength_${test.key}_right`] || ''}
                            onChange={(e) =>
                              handleStrengthChange(
                                test.key,
                                'right',
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
                            value={formData[`strength_${test.key}_left`] || ''}
                            onChange={(e) =>
                              handleStrengthChange(
                                test.key,
                                'left',
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
                  ))}
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
                    <TableCell align="center">RT</TableCell>
                    <TableCell align="center">LT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Girth measurements */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Girth measurements
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          value={formData.special_tests?.girth_right || ''}
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'girth_right',
                              e.target.value,
                            )
                          }
                          placeholder="cm"
                          sx={{ width: 80 }}
                        />
                        <Typography variant="body2">cm</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          value={formData.special_tests?.girth_left || ''}
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'girth_left',
                              e.target.value,
                            )
                          }
                          placeholder="cm"
                          sx={{ width: 80 }}
                        />
                        <Typography variant="body2">cm</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Capillary refill */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Capillary refill (N=3)
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.capillary_refill_right || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'capillary_refill_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="<2">&lt;2 sec</MenuItem>
                          <MenuItem value="2-3">2-3 sec</MenuItem>
                          <MenuItem value=">3">&gt;3 sec</MenuItem>
                          <MenuItem value="delayed">Delayed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.capillary_refill_left || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'capillary_refill_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="<2">&lt;2 sec</MenuItem>
                          <MenuItem value="2-3">2-3 sec</MenuItem>
                          <MenuItem value=">3">&gt;3 sec</MenuItem>
                          <MenuItem value="delayed">Delayed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* Pitting edema */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Pitting edema</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.pitting_edema_right || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'pitting_edema_right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="1+">1+</MenuItem>
                          <MenuItem value="2+">2+</MenuItem>
                          <MenuItem value="3+">3+</MenuItem>
                          <MenuItem value="4+">4+</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.pitting_edema_left || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'pitting_edema_left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="1+">1+</MenuItem>
                          <MenuItem value="2+">2+</MenuItem>
                          <MenuItem value="3+">3+</MenuItem>
                          <MenuItem value="4+">4+</MenuItem>
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
            {[
              'Decreased AROM',
              'Decreased PROM and accessory motion',
              'Decreased strength/coordination of glenohumeral muscles',
              'Decreased soft tissue mobility at scar and fascial planes',
              'Adverse neural tension',
              'Decreased strength/coordination of scapular stabilizers',
              'Hypermobility of the GH joint',
              'A/C or S/C dysfunction',
              'Thoracic spine dysfunction',
              'Hypertonic upper quarter musculature',
              'Postural dysfunction',
              'Hypomobility of glenohumeral joint',
              'Tendonitis of associated musculature',
              'Ligament stress test positive for superior glenohumeral, coracohumeral, anterior inferior glenohumeral, posterior inferior glenohumeral ligaments',
            ].map((impression) => (
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
              placeholder="Improve shoulder range of motion, Reduce pain during overhead activities..."
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

export default AddShoulder;
