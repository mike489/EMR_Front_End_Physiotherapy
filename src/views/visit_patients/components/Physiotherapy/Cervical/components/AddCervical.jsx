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

const AddCervical = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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

    // Cervical-specific fields
    range_of_motion: {
      flexion: { left: '', right: '' },
      extension: { left: '', right: '' },
      lateral_flexion: { left: '', right: '' },
      rotation: { left: '', right: '' },
    },

    // Neurological assessment
    myotome: [],
    myotome_remark: '',
    reflex_testing: [],

    // Special tests
    special_tests: [],
    special_tests_remark: '',

    // Posture and biomechanical
    posture_assessment: [],
    posture_assessment_remark: '',
    biomechanical: [],
    biomechanical_remark: '',

    // Palpation
    palpations: [],
    palpations_remark: '',

    // Observation
    observation: [],
    observation_remark: '',

    // Clinical and treatment
    clinical_impression: [],
    clinical_impression_remark: '',
    treatment_plans: [],
    treatment_plans_remark: '',
    short_term_goal: '',
    medical_diagnosis: '',
    precautions_and_contraindications: '',

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

  // Cervical-specific pain locations
  const painLocations = [
    'Upper Cervical (C1-C2)',
    'Mid Cervical (C3-C5)',
    'Lower Cervical (C6-C7)',
    'Occipital Region',
    'Trapezius',
    'Levator Scapulae',
    'Scalenes',
    'Sternocleidomastoid',
    'Shoulder Girdle',
    'Interscapular',
  ];

  // Cervical-specific functional limitations
  const functionalLimitations = [
    'Neck Rotation',
    'Looking Up/Down',
    'Driving',
    'Reading',
    'Computer Work',
    'Sleeping',
    'Lifting',
    'Carrying',
    'Personal Hygiene',
    'Dressing',
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

  // Cervical-specific special tests
  const specialTests = [
    {
      name: 'Cervical Compression',
      description: 'Assesses for nerve root compression',
    },
    {
      name: 'Cervical Distraction',
      description: 'Relieves nerve root compression symptoms',
    },
    {
      name: 'Cranial Nerve Test',
      description: 'Assesses cranial nerve function',
    },
    {
      name: 'Thoracic T123 Restricted rotation',
      description: 'Assesses thoracic spine mobility',
    },
    {
      name: "Spurling's Test",
      description: 'Cervical radiculopathy assessment',
    },
    {
      name: "Lhermitte's Sign",
      description: 'Cervical cord compression',
    },
    {
      name: 'Valsalva Test',
      description: 'Increased intrathecal pressure',
    },
    {
      name: 'Distraction Test',
      description: 'Cervical nerve root compression',
    },
    {
      name: 'Upper Limb Tension Test',
      description: 'Brachial plexus involvement',
    },
  ];

  // Cervical-specific assessment options
  const AssessmentOptions = [
    'Cervical Radiculopathy',
    'Cervical Spondylosis',
    'Whiplash Associated Disorder',
    'Cervical Strain/Sprain',
    'Myofascial Pain Syndrome',
    'Cervical Disc Herniation',
    'Thoracic Outlet Syndrome',
    'Tension Headache',
    'Cervicogenic Headache',
    'Postural Dysfunction',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Neck Stabilization',
    'Postural Re-education',
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Traction',
    'Ergonomic Education',
    'Pain Management',
    'Strengthening Program',
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
    'Postural Dysfunction',
    'Decreased cervical ROM',
    'Muscle Guarding',
    'Myofascial Restrictions',
    'Joint Hypomobility',
    'Neurological Involvement',
    'Muscle Weakness',
    'Movement Coordination Deficits',
  ];

  const myotomeOptions = [
    'C1-C2 - Neck flexion',
    'C3 - Neck lateral flexion',
    'C4 - Shoulder elevation',
    'C5 - Shoulder abduction',
    'C6 - Elbow flexion/wrist extension',
    'C7 - Elbow extension/wrist flexion',
    'C8 - Thumb extension',
    'T1 - Finger abduction',
  ];

  const reflexOptions = [
    'Biceps (C5-C6)',
    'Brachioradialis (C5-C6)',
    'Triceps (C7)',
    "Hoffmann's Sign",
    'Babinski Sign',
  ];

  const postureOptions = [
    'Forward Head Posture',
    'Rounded Shoulders',
    'Increased Cervical Lordosis',
    'Decreased Cervical Lordosis',
    'Shoulder Asymmetry',
    'Head Tilt',
    'Scapular Winging',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  // Cervical-specific ROM tests
  const romTests = [
    { key: 'flexion', label: 'Flexion', normal: '45-50°' },
    { key: 'extension', label: 'Extension', normal: '45-60°' },
    { key: 'lateral_flexion', label: 'Lateral Flexion', normal: '40-45°' },
    { key: 'rotation', label: 'Rotation', normal: '70-90°' },
  ];

  // Cervical-specific palpation tests
  const palpationTests = [
    { key: 'upper_trapezius', label: 'Upper Trapezius' },
    { key: 'levator_scapulae', label: 'Levator Scapulae' },
    { key: 'scm', label: 'Sternocleidomastoid' },
    { key: 'scalenes', label: 'Scalenes' },
    { key: 'suboccipital', label: 'Suboccipital Muscles' },
    { key: 'cervical_paraspinals', label: 'Cervical Paraspinals' },
    { key: 'supraspinatus', label: 'Supraspinatus' },
    { key: 'rhomboids', label: 'Rhomboids' },
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
          <Typography variant="h6">Cervical Assessment</Typography>
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
              placeholder="Arm, shoulder, scapula, head..."
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
              ].map((label) => (
                <FormControlLabel
                  key={label}
                  control={
                    <Checkbox
                      checked={formData.observation.includes(label)}
                      onChange={() => handleArrayToggle('observation', label)}
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
                            formData.range_of_motion[test.key]?.right || ''
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
                          value={formData.range_of_motion[test.key]?.left || ''}
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
        </Grid>

        <Divider sx={{ my: 3 }} />
        {/* Physical Examination */}
        <Typography variant="h5" gutterBottom>
          Physical Examination
        </Typography>
        <Grid container spacing={2}>
          {/* Strength Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Strength
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="center">Right</TableCell>
                    <TableCell align="center">Left</TableCell>
                    <TableCell align="center">Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Elbow flexion */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Elbow flex.</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_elbow_flex_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_elbow_flex_right',
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
                          value={formData.strength_elbow_flex_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_elbow_flex_left',
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
                      <TextField
                        size="small"
                        value={formData.strength_elbow_flex_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_elbow_flex_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* Finger abduction */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Finger add</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_finger_add_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_finger_add_right',
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
                          value={formData.strength_finger_add_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_finger_add_left',
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
                      <TextField
                        size="small"
                        value={formData.strength_finger_add_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_finger_add_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* Finger flexion (Kg) */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Finger flex(Kg)</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.strength_finger_flex_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_finger_flex_right',
                            e.target.value,
                          )
                        }
                        placeholder="Kg"
                        sx={{ width: 100 }}
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
                        value={formData.strength_finger_flex_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_finger_flex_left',
                            e.target.value,
                          )
                        }
                        placeholder="Kg"
                        sx={{ width: 100 }}
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
                        value={formData.strength_finger_flex_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_finger_flex_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* Shoulder abduction */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Shoulder abd.</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_shoulder_abd_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_shoulder_abd_right',
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
                          value={formData.strength_shoulder_abd_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_shoulder_abd_left',
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
                      <TextField
                        size="small"
                        value={formData.strength_shoulder_abd_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_shoulder_abd_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* Wrist extension */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Wrist ext.</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_wrist_ext_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_wrist_ext_right',
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
                          value={formData.strength_wrist_ext_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_wrist_ext_left',
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
                      <TextField
                        size="small"
                        value={formData.strength_wrist_ext_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_ext_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* Wrist flexion */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Wrist flex.</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.strength_wrist_flex_right || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_wrist_flex_right',
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
                          value={formData.strength_wrist_flex_left || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'strength_wrist_flex_left',
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
                      <TextField
                        size="small"
                        value={formData.strength_wrist_flex_remark || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_flex_remark',
                            e.target.value,
                          )
                        }
                        placeholder="Remark"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* General Remark Field */}
            <TextField
              fullWidth
              label="Remark"
              value={formData.strength_remark}
              onChange={(e) =>
                handleInputChange('strength_remark', e.target.value)
              }
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Muscle Flexibility */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            Muscle Flexibility
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
            These structures presented tender when elongated
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {/* Upp. Trap */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Upp. Trap</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_upper_trap || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_upper_trap',
                            e.target.value,
                          )
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

                {/* Lev. Scap */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Lev. Scap</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_lev_scap || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_lev_scap',
                            e.target.value,
                          )
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

                {/* SCM */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">SCM</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_scm || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_scm',
                            e.target.value,
                          )
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

                {/* Superior trapezius */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Superior trapezius</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.muscle_flexibility_superior_trapezius || ''
                        }
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_superior_trapezius',
                            e.target.value,
                          )
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

                {/* Scalen */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Scalen</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_scalen || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_scalen',
                            e.target.value,
                          )
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

                {/* Infraspinatus */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Infraspinatus</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_infraspinatus || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_infraspinatus',
                            e.target.value,
                          )
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

                {/* Supraspinatus */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Supraspinatus</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_supraspinatus || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_supraspinatus',
                            e.target.value,
                          )
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

                {/* Suboccipital muscle */}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Typography variant="body2">Suboccipital muscle</Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.muscle_flexibility_suboccipital || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'muscle_flexibility_suboccipital',
                            e.target.value,
                          )
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
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            fullWidth
            label="Remark"
            value={formData.muscle_flexibility_remark}
            onChange={(e) =>
              handleInputChange('muscle_flexibility_remark', e.target.value)
            }
            size="small"
            sx={{ mt: 1 }}
            multiline
            rows={2}
          />
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Special Tests */}
        <Typography variant="h5" gutterBottom>
          Special Tests
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell align="center">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Cervical Compression */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Cervical Compression
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.cervical_compression || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'cervical_compression',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="positive">Positive</MenuItem>
                          <MenuItem value="negative">Negative</MenuItem>
                          <MenuItem value="not_tested">Not Tested</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* Cervical Distraction */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Cervical Distraction
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.cervical_distraction || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'cervical_distraction',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="positive">Positive</MenuItem>
                          <MenuItem value="negative">Negative</MenuItem>
                          <MenuItem value="not_tested">Not Tested</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* Cranial Nerve Test */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Cranial Nerve Test
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.cranial_nerve_test || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'cranial_nerve_test',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="normal">Normal</MenuItem>
                          <MenuItem value="abnormal">Abnormal</MenuItem>
                          <MenuItem value="not_tested">Not Tested</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>

                  {/* Thoracic T123 Restricted rotation */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">
                        Thoracic T123 Restricted rotation
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests
                              ?.thoracic_restricted_rotation || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'thoracic_restricted_rotation',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="absent">Absent</MenuItem>
                          <MenuItem value="not_tested">Not Tested</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Remark Field */}
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
        <Divider sx={{ my: 3 }} />

        {/* Clinical Impressions */}
        <Typography variant="h5" gutterBottom>
          Clinical Impressions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              Mechanical deficits/Impairments found on examination
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {[
                'Postural imbalance',
                'Decreased AROM',
                'Decreased passive intervertebral motion',
                'Hypermobility on passive intervertebral motion',
                'Decreased strength of cervical and UQ muscles',
                'Hypertonic upper quarter musculature',
                'Adaptive shortening of muscles',
                'Adverse neural tension',
                'Decreased facet joint mobility',
                'Decreased mobility upper thoracic spine',
                'Restricted mobility suboccipital',
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
                />
              ))}
            </Box>

            <TextField
              fullWidth
              label="Remark"
              value={formData.clinical_impression_remark}
              onChange={(e) =>
                handleInputChange('clinical_impression_remark', e.target.value)
              }
              multiline
              rows={2}
              placeholder="Additional clinical impressions..."
            />
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
              placeholder="Reduce pain by 50%, Improve neck ROM, Restore functional activities..."
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

export default AddCervical;
