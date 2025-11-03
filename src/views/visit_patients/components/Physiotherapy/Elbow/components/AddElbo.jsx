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

const AddElbo = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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
    functional_limitations: [],
    functional_limitations_adl: [],
    functional_limitations_adl_remark: '',
    // work_impact: '',
    // sports_impact: '',

    palpations: [],
    palpations_remark: '',
    // Biomechanical
    biomechanical: [],
    biomechanical_remark: '',
    // Observation
    observation: [],
    observation_remark: '',
    // ROM
    range_of_motion: {
      flexion: { left: '', right: '' },
      extension: { left: '', right: '' },
      supination: { left: '', right: '' },
      pronation: { left: '', right: '' },
    },
    rom_remark: '',
    // Strength
    strength_elbow_extension_right: '',
    strength_elbow_extension_left: '',
    strength_elbow_flexion_right: '',
    strength_elbow_flexion_left: '',
    strength_grip_right: '',
    strength_grip_left: '',
    strength_radial_deviation_right: '',
    strength_radial_deviation_left: '',
    strength_ulnar_deviation_right: '',
    strength_ulnar_deviation_left: '',
    strength_wrist_extension_right: '',
    strength_wrist_extension_left: '',
    strength_wrist_flexion_right: '',
    strength_wrist_flexion_left: '',
    strength_remark: '',
    // Tests
    special_tests: [],
    special_tests_remark: '',

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
    // short_term_goal: [],
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

  const painLocations = [
    'Lateral Epicondyle',
    'Medial Epicondyle',
    'Olecranon',
    'Forearm',
    'Wrist',
    'Radial Head',
    'Ulnar Nerve',
    'Biceps Tendon',
    'Triceps Tendon',
  ];
  const functionalLimitations = [
    'Lifting Objects',
    'Gripping',
    'Writing/Typing',
    'Carrying',
    'Pushing/Pulling',
    'Sports Activities',
    'Self Care',
    'Work Tasks',
    'Eating',
    'Dressing',
    'Personal Hygiene',
    'Cooking',
    'Cleaning',
    'Driving',
    'Sleeping',
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

  const specialTests = [
    {
      name: "Cozen's Test ( Tennis elbow)",
      description: 'Lateral epicondylitis',
    },
    {
      name: "Mill's Test ( Tennis elbow)",
      description: 'Lateral epicondylitis',
    },
    { name: 'Medial Epicondylitis test ', description: 'Medial epicondylitis' },
    {
      name: "Tinel's sign( Ulnar nerve entrapment)",
      description: 'Ulnar nerve compression',
    },
    {
      name: 'Valgus stress test ( Ligament stability)',
      description: 'MCL injury',
    },
  ];

  const AssessmentOptions = [
    'Lateral Epicondylitis',
    'Medial Epicondylitis',
    'Cubital Tunnel Syndrome',
    'Ulnar Collateral Ligament Injury',
    'Radial Head Fracture',
    'Olecranon Bursitis',
    'Distal Biceps Tendon Rupture',
    'Triceps Tendonitis',
    'Wrist Sprain/Strain',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Stretching Protocol',
    'Strengthening Program',
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Activity Modification',
    'Ergonomic Education',
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
    'Postural Imbalance',
    'Decreased active ROM',
    'Decreased passive ROM',
    'Adaptive shortening of muscles',
    'Adverse neural tension',
    'Decreased joint mobility',
    'Decreased scar mobility',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  const strengthTests = [
    { key: 'elbow_extension', label: 'Elbow extension' },
    { key: 'elbow_flexion', label: 'Elbow flex.' },
    { key: 'grip', label: 'Grip strength' },
    { key: 'radial_deviation', label: 'Radial deviation' },
    { key: 'ulnar_deviation', label: 'Ulnar deviation' },
    { key: 'wrist_extension', label: 'Wrist ext.' },
    { key: 'wrist_flexion', label: 'Wrist flex.' },
  ];

  const palpationTests = [
    { key: 'upper_trapezius', label: 'Upp. Trap' },
    { key: 'levator_scapulae', label: 'Lev. Scap' },
    { key: 'scm', label: 'SCM' },
    { key: 'superior_trapezius', label: 'Superior trapezius' },
    { key: 'scalenes', label: 'Scalen' },
    { key: 'infraspinatus', label: 'Infraspinatus' },
    { key: 'supraspinatus', label: 'Supraspinatus' },
    { key: 'suboccipital', label: 'Suboccipital muscle' },
  ];

  const biomechanicalTests = [
    { biomechanical: 'upper_trapezius', label: 'Upp. Trap' },
    { biomechanical: 'levator_scapulae', label: 'Lev. Scap' },
  ];

  const romTests = [
    { key: 'elbow_flexion', label: 'Elbow Flex', normal: '150°' },
    { key: 'elbow_extension', label: 'Elbow Ext', normal: '0°' },
    { key: 'supination', label: 'Supination', normal: '80°' },
    { key: 'pronation', label: 'Pronation', normal: '80°' },
    { key: 'wrist_flexion', label: 'Wrist Flex', normal: '60°' },
    { key: 'wrist_extension', label: 'Wrist Ext', normal: '70°' },
    { key: 'radial_deviation', label: 'Radial Dev', normal: '20°' },
    { key: 'ulnar_deviation', label: 'Ulnar Dev', normal: '30°' },
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
          <Typography variant="h6">Elbow Assessment</Typography>
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
              label="passive medical History (PMH)"
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
                          ? '#FFD700' // Yellow
                          : '#D50000', // Red
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
                    ? '#00C853' // Green
                    : formData.pain_level <= 7
                      ? '#FFD700' // Yellow
                      : '#ec1c1c', // Red
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
                    handleArrayToggle('functional_limitations', limitation)
                  }
                  color={
                    formData.functional_limitations.includes(limitation)
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
                value={formData.functional_limitations_remark}
                onChange={(e) =>
                  handleInputChange(
                    'functional_limitations_remark',
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
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ width: '40%' }}
                      >
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
              value={formData.palpation_remark}
              onChange={(e) =>
                handleInputChange('palpations_remark', e.target.value)
              }
              size="small"
              sx={{ mt: 1 }}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Bio-Mechanical
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              These structures presented tender
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {biomechanicalTests.map((test) => (
                    <TableRow key={test.key}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ width: '40%' }}
                      >
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
              value={formData.biomechanical_remark}
              onChange={(e) =>
                handleInputChange('palpations_remark', e.target.value)
              }
              size="small"
              sx={{ mt: 1 }}
              multiline
              rows={2}
            />
          </Grid>

          {/* ROM Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              ROM
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
                  {romTests.map((test) => (
                    <TableRow key={test.key}>
                      <TableCell component="th" scope="row">
                        <Box>
                          <Typography variant="body2">{test.label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            (N={test.normal})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="medium"
                          type="number"
                          value={
                            formData.range_of_motion?.[test.key]?.right || ''
                          }
                          onChange={(e) =>
                            handleRomChange(test.key, 'right', e.target.value)
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
                            formData.range_of_motion?.[test.key]?.left || ''
                          }
                          onChange={(e) =>
                            handleRomChange(test.key, 'left', e.target.value)
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
                  ))}
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

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
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
                />
              ))}
            </Box>
            <Collapse in={showRemarks.clinicalImpression}>
              <TextField
                fullWidth
                label="Clinical Impression Remark"
                value={formData.clinical_impression_remark}
                onChange={(e) =>
                  handleInputChange(
                    'clinical_impression_remark',
                    e.target.value,
                  )
                }
                multiline
                rows={2}
                placeholder="Specify other clinical impressions..."
              />
            </Collapse>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Special Tests
            </Typography>
            <Grid container spacing={1}>
              {specialTests.map((test) => (
                <Grid item xs={12} sm={6} key={test.name}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {test.name}
                      </Typography>
                      <Tooltip title={test.description}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <RadioGroup
                      row
                      value={formData.special_tests[test.name] || ''}
                      onChange={(e) =>
                        handleSpecialTestResult(test.name, e.target.value)
                      }
                    >
                      {['positive', 'negative', 'not_tested'].map((opt) => (
                        <FormControlLabel
                          key={opt}
                          value={opt}
                          control={<Radio size="small" />}
                          label={opt}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </Grid>
              ))}
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
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Assessment & Plan */}
        <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>
          Assessment & Plan
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
              <Typography variant="subtitle2">Assessment Plan</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('assessmentPlan')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {AssessmentOptions.map((treatment) => {
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
            <Collapse in={showRemarks.assessmentPlan}>
              <TextField
                fullWidth
                label="Assessment Plan Remark"
                value={formData.assessment_plan_remark}
                onChange={(e) =>
                  handleInputChange('assessment_plan_remark', e.target.value)
                }
                multiline
                rows={2}
              />
            </Collapse>
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
              <Typography variant="subtitle2">Treatment Plan</Typography>
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
                value={formData.treatment_plan_remark}
                onChange={(e) =>
                  handleInputChange('treatment_plan_remark', e.target.value)
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
              placeholder="Reduce pain by 50%, Improve grip strength..."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precautions"
              value={formData.precautions}
              onChange={(e) => handleInputChange('precautions', e.target.value)}
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
          // disabled={
          //   !formData.primary_complaint || !formData.clinical_impression
          // }
        >
          Submit Assessment
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddElbo;
