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

const AddAnkle = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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

    // Ankle-specific fields
    palpations: [],
    palpations_remark: '',
    biomechanical: [],
    biomechanical_remark: '',
    observation: [],
    observation_remark: '',

    // ROM for ankle
    range_of_motion: {
      dorsiflexion: { left: '', right: '' },
      plantarflexion: { left: '', right: '' },
      inversion: { left: '', right: '' },
      eversion: { left: '', right: '' },
    },
    rom_remark: '',

    // Strength for ankle
    strength_dorsiflexion_right: '',
    strength_dorsiflexion_left: '',
    strength_plantarflexion_right: '',
    strength_plantarflexion_left: '',
    strength_inversion_right: '',
    strength_inversion_left: '',
    strength_eversion_right: '',
    strength_eversion_left: '',
    strength_remark: '',

    // Special tests for ankle
    special_tests: [],
    special_tests_remark: '',

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

  // Ankle-specific pain locations
  const painLocations = [
    'Medial Malleolus',
    'Lateral Malleolus',
    'Achilles Tendon',
    'Anterior Ankle',
    'Posterior Ankle',
    'Subtalar Joint',
    'Sinus Tarsi',
    'Peroneal Tendons',
    'Deltoid Ligament',
  ];

  // Ankle-specific functional limitations
  const functionalLimitations = [
    'Walking',
    'Running',
    'Stair Climbing',
    'Standing',
    'Squatting',
    'Sports Activities',
    'Balance Issues',
    'Uneven Surfaces',
    'Dressing',
    'Driving',
    'Work Tasks',
    'Self Care',
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

  // Ankle-specific special tests
  const specialTests = [
    {
      name: 'Anterior Drawer Test',
      description: 'Anterior talofibular ligament integrity',
    },
    {
      name: 'Thompson Test',
      description: 'Achilles tendon rupture',
    },
    {
      name: 'Squeeze Test',
      description: 'Syndesmotic injury',
    },
    {
      name: 'Talar Tilt Test',
      description: 'Calcaneofibular ligament integrity',
    },
    {
      name: 'External Rotation Test',
      description: 'Syndesmosis injury',
    },
  ];

  // Ankle-specific assessment options
  const AssessmentOptions = [
    'Ankle Sprain',
    'Achilles Tendinopathy',
    'Plantar Fasciitis',
    'Peroneal Tendinopathy',
    'Tarsal Tunnel Syndrome',
    'Ankle Osteoarthritis',
    'Stress Fracture',
    'Syndesmotic Injury',
    'Chronic Ankle Instability',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Balance Training',
    'Proprioceptive Training',
    'Strengthening Program',
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Activity Modification',
    'Gait Training',
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
    'Balance Deficits',
    'Gait Abnormalities',
    'Joint Stiffness',
    'Swelling',
    'Instability',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  // Ankle-specific strength tests
  const strengthTests = [
    { key: 'dorsiflexion', label: 'Dorsiflexion' },
    { key: 'plantarflexion', label: 'Plantarflexion' },
    { key: 'inversion', label: 'Inversion' },
    { key: 'eversion', label: 'Eversion' },
  ];

  // Ankle-specific palpation tests
  const palpationTests = [
    { key: 'medial_malleolus', label: 'Medial Malleolus' },
    { key: 'lateral_malleolus', label: 'Lateral Malleolus' },
    { key: 'achilles_tendon', label: 'Achilles Tendon' },
    { key: 'peroneal_tendons', label: 'Peroneal Tendons' },
    { key: 'deltoid_ligament', label: 'Deltoid Ligament' },
    { key: 'anterior_talofibular', label: 'ATFL' },
    { key: 'calcaneofibular', label: 'CFL' },
    { key: 'sinus_tarsi', label: 'Sinus Tarsi' },
  ];

  // Ankle-specific ROM tests
  const romTests = [
    { key: 'dorsiflexion', label: 'Dorsiflexion', normal: '20°' },
    { key: 'plantarflexion', label: 'Plantarflexion', normal: '50°' },
    { key: 'inversion', label: 'Inversion', normal: '35°' },
    { key: 'eversion', label: 'Eversion', normal: '15°' },
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
          <Typography variant="h6">Ankle & Foot Assessment</Typography>
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
                        value={formData.range_of_motion[test.key]?.right || ''}
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

          {/* Gait and Balance */}
          {/* Biomechanical Gait Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Biomechanical Gait
            </Typography>

            {/* Abnormal Pronation Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Patient demonstrates abnormal pronation during
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Select Phase</InputLabel>
                <Select
                  value={formData.abnormal_pronation_phase || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'abnormal_pronation_phase',
                      e.target.value,
                    )
                  }
                  label="Select Phase"
                >
                  <MenuItem value="early">Early</MenuItem>
                  <MenuItem value="mid">Mid</MenuItem>
                  <MenuItem value="terminal">Terminal</MenuItem>
                  <MenuItem value="throughout">
                    Throughout stance phase
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Inadequate Calcaneal Eversion Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Inadequate calcaneal eversion at loading response on the:
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Select Side</InputLabel>
                <Select
                  value={formData.calcaneal_eversion_side || ''}
                  onChange={(e) =>
                    handleInputChange('calcaneal_eversion_side', e.target.value)
                  }
                  label="Select Side"
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Functional Hallux Limitus Section */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.functional_hallux_limitus || false}
                    onChange={(e) =>
                      handleInputChange(
                        'functional_hallux_limitus',
                        e.target.checked,
                      )
                    }
                  />
                }
                label="Patient demonstrates functional hallux limitus gait"
              />

              {formData.functional_hallux_limitus && (
                <FormControl fullWidth size="small" sx={{ mt: 1, ml: 3 }}>
                  <InputLabel>Select Side</InputLabel>
                  <Select
                    value={formData.hallux_limitus_side || ''}
                    onChange={(e) =>
                      handleInputChange('hallux_limitus_side', e.target.value)
                    }
                    label="Select Side"
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            {/* Remark Field */}
            <TextField
              fullWidth
              label="Remark"
              value={formData.biomechanical_gait_remark || ''}
              onChange={(e) =>
                handleInputChange('biomechanical_gait_remark', e.target.value)
              }
              multiline
              rows={2}
              size="small"
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

                  {/* Pedal pulse */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2">Pedal pulse</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests?.pedal_pulse_right || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'pedal_pulse_right',
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
                          <MenuItem value="diminished">Diminished</MenuItem>
                          <MenuItem value="brisk">Brisk</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.special_tests?.pedal_pulse_left || ''}
                          onChange={(e) =>
                            handleSpecialTestResult(
                              'pedal_pulse_left',
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
                          <MenuItem value="diminished">Diminished</MenuItem>
                          <MenuItem value="brisk">Brisk</MenuItem>
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
                handleInputChange('clinical_impression_remark', e.target.value)
              }
              multiline
              rows={2}
              placeholder="Specify other clinical impressions..."
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
              placeholder="Improve walking distance, Reduce pain during weight bearing..."
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
              placeholder="Weight bearing restrictions, Activity limitations..."
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

export default AddAnkle;
