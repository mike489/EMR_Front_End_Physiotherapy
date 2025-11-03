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
    range_of_motion: {
      flexion: { left: '', right: '' },
      extension: { left: '', right: '' },
      lateral_flexion: { left: '', right: '' },
      rotation: { left: '', right: '' },
    },

    // Neurological assessment
    neurological_assessment: [],
    neurological_assessment_remark: '',

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

    // Muscle assessment
    muscle_flexibility: [],
    muscle_flexibility_remark: '',

    // Measurements
    circumference_measurements: [],
    circumference_measurements_remark: '',

    // Observation
    observation: [],
    observation_remark: '',

    // Clinical and treatment
    clinical_impression: [],
    clinical_impression_remark: '',
    treatment_plans: [],
    treatment_plans_remark: '',
    short_term_goal: '',
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

  // Lumbar-specific ROM tests
  const romTests = [
    { key: 'flexion', label: 'Flexion', normal: '40-60°' },
    { key: 'extension', label: 'Extension', normal: '20-35°' },
    { key: 'lateral_flexion', label: 'Lateral Flexion', normal: '15-20°' },
    { key: 'rotation', label: 'Rotation', normal: '3-18°' },
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

        {/* Physical Examination */}
        <Typography variant="h5" gutterBottom>
          Physical Examination
        </Typography>
        <Grid container spacing={2}>
          {/* ROM Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
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

          {/* Neurological Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Neurological Assessment
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {neurologicalOptions.map((neuro) => (
                <Chip
                  key={neuro}
                  label={neuro}
                  onClick={() =>
                    handleArrayToggle('neurological_assessment', neuro)
                  }
                  color={
                    formData.neurological_assessment.includes(neuro)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.neurological_assessment.includes(neuro)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Neurological Assessment Remark"
              value={formData.neurological_assessment_remark}
              onChange={(e) =>
                handleInputChange(
                  'neurological_assessment_remark',
                  e.target.value,
                )
              }
              multiline
              rows={2}
            />
          </Grid>

          {/* Muscle Flexibility */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Muscle Flexibility
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {muscleFlexibilityOptions.map((muscle) => (
                <Chip
                  key={muscle}
                  label={muscle}
                  onClick={() =>
                    handleArrayToggle('muscle_flexibility', muscle)
                  }
                  color={
                    formData.muscle_flexibility.includes(muscle)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.muscle_flexibility.includes(muscle)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Muscle Flexibility Remark"
              value={formData.muscle_flexibility_remark}
              onChange={(e) =>
                handleInputChange('muscle_flexibility_remark', e.target.value)
              }
              multiline
              rows={2}
            />
          </Grid>

          {/* Circumference Measurements */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Circumference Measurements
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {circumferenceOptions.map((measurement) => (
                <Chip
                  key={measurement}
                  label={measurement}
                  onClick={() =>
                    handleArrayToggle('circumference_measurements', measurement)
                  }
                  color={
                    formData.circumference_measurements.includes(measurement)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.circumference_measurements.includes(measurement)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Circumference Measurements Remark"
              value={formData.circumference_measurements_remark}
              onChange={(e) =>
                handleInputChange(
                  'circumference_measurements_remark',
                  e.target.value,
                )
              }
              multiline
              rows={2}
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

          {/* Posture Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Posture Assessment
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {postureOptions.map((posture) => (
                <Chip
                  key={posture}
                  label={posture}
                  onClick={() =>
                    handleArrayToggle('posture_assessment', posture)
                  }
                  color={
                    formData.posture_assessment.includes(posture)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.posture_assessment.includes(posture)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Posture Assessment Remark"
              value={formData.posture_assessment_remark}
              onChange={(e) =>
                handleInputChange('posture_assessment_remark', e.target.value)
              }
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
                      {['Positive', 'Negative', 'Not Tested'].map((opt) => (
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
              {AssessmentOptions.map((assessment) => {
                const selected =
                  formData.clinical_impression.includes(assessment);
                return (
                  <Chip
                    key={assessment}
                    label={assessment}
                    onClick={() =>
                      handleArrayToggle('clinical_impression', assessment)
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
                value={formData.clinical_impression_remark}
                onChange={(e) =>
                  handleInputChange(
                    'clinical_impression_remark',
                    e.target.value,
                  )
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
              placeholder="Avoid heavy lifting, No high-impact activities, Proper body mechanics..."
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
