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

const AddKnee = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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

    // Knee-specific fields
    palpations: [],
    palpations_remark: '',
    biomechanical: [],
    biomechanical_remark: '',
    observation: [],
    observation_remark: '',

    // ROM for knee
    range_of_motion: {
      flexion: { left: '', right: '' },
      extension: { left: '', right: '' },
      abduction: { left: '', right: '' },
      adduction: { left: '', right: '' },
    },
    rom_remark: '',

    // Strength for knee (updated based on image)
    strength_flexion_right: '',
    strength_flexion_left: '',
    strength_extension_right: '',
    strength_extension_left: '',
    strength_abduction_right: '',
    strength_abduction_left: '',
    strength_adduction_right: '',
    strength_adduction_left: '',
    strength_hamstrings_right: '',
    strength_hamstrings_left: '',
    strength_quads_right: '',
    strength_quads_left: '',
    strength_dorsiflexion_right: '',
    strength_dorsiflexion_left: '',
    strength_planter_flexion_right: '',
    strength_planter_flexion_left: '',
    strength_remark: '',

    // Special tests for knee
    special_tests: {
      lachmanns_right: '',
      lachmanns_left: '',
      varus_stress_30_right: '',
      varus_stress_30_left: '',
      varus_stress_0_right: '',
      varus_stress_0_left: '',
      valgus_stress_24_right: '',
      valgus_stress_24_left: '',
      valgus_stress_0_right: '',
      valgus_stress_0_left: '',
      cost_test_right: '',
      cost_test_left: '',
      mokkenny_right: '',
      mokkenny_left: '',
      priori_shirt_right: '',
      priori_shirt_left: '',
    },
    special_tests_remark: '',

    // Circulation - new section based on image
    circulation: {
      lower_extremity_right: '',
      lower_extremity_left: '',
      dorsal_pedal_pulse_right: '',
      dorsal_pedal_pulse_left: '',
      posterior_tibial_pulse_right: '',
      posterior_tibial_pulse_left: '',
    },
    circulation_remark: '',

    // Girth measurements - new section based on image
    girth: {
      total_right: '',
      total_left: '',
      above_patella_right: '',
      above_patella_left: '',
      below_patella_right: '',
      below_patella_left: '',
    },
    girth_remark: '',

    // Incision - new section based on image
    incision: {
      eligibility: false,
      minor_scudding: false,
      no_incision: false,
    },

    // Neurological Scan
    neurological_scan: {
      reflexes: {
        l3_l4: { left: '', right: '' },
        l5_s1: { left: '', right: '' },
      },
      sensory: {
        l3: { left: '', right: '' },
        l4: { left: '', right: '' },
        l5: { left: '', right: '' },
        s1: { left: '', right: '' },
        s2: { left: '', right: '' },
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
    specialTests: false,
    circulation: false,
    girth: false,
  });

  // Knee-specific pain locations
  const painLocations = [
    'Anterior Knee',
    'Medial Knee',
    'Lateral Knee',
    'Posterior Knee',
    'Patella',
    'Patellar Tendon',
    'Medial Joint Line',
    'Lateral Joint Line',
    'Popliteal Fossa',
  ];

  // Knee-specific functional limitations
  const functionalLimitations = [
    'Walking',
    'Stair Climbing',
    'Squatting',
    'Kneeling',
    'Running',
    'Jumping',
    'Sitting for Prolonged Periods',
    'Standing for Prolonged Periods',
    'Sports Activities',
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

  // Knee-specific special tests
  const specialTests = [
    {
      name: 'Lachman Test',
      description: 'ACL integrity',
    },
    {
      name: 'Anterior Drawer Test',
      description: 'ACL integrity',
    },
    {
      name: 'Posterior Drawer Test',
      description: 'PCL integrity',
    },
    {
      name: 'McMurray Test',
      description: 'Meniscal tear',
    },
    {
      name: 'Valgus Stress Test',
      description: 'MCL integrity',
    },
    {
      name: 'Varus Stress Test',
      description: 'LCL integrity',
    },
  ];

  // Knee-specific assessment options
  const AssessmentOptions = [
    'Patellofemoral Pain Syndrome',
    'Meniscal Tear',
    'ACL Tear',
    'PCL Tear',
    'MCL Sprain',
    'LCL Sprain',
    'Knee Osteoarthritis',
    'Patellar Tendinitis',
    'Iliotibial Band Syndrome',
  ];

  const treatmentOptions = [
    'Therapeutic Exercises',
    'Range of Motion Exercises',
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
    'Joint Stiffness',
    'Swelling',
    'Instability',
    'Muscle Imbalance',
    'Gait Dysfunction',
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

  // Knee-specific strength tests (updated based on image)
  const strengthTests = [
    { key: 'flexion', label: 'Hip Flexion' },
    { key: 'extension', label: 'Hip Extension' },
    { key: 'abduction', label: 'Hip Abduction' },
    { key: 'adduction', label: 'Hip Adduction' },
    { key: 'hamstrings', label: 'Hamstrings' },
    { key: 'quads', label: 'Quads' },
    { key: 'dorsiflexion', label: 'Dorsiflexion' },
    { key: 'planter_flexion', label: 'Planter Flexion' },
  ];

  // Knee-specific palpation tests
  const palpationTests = [
    { key: 'medial_joint_line', label: 'Medial Joint Line' },
    { key: 'lateral_joint_line', label: 'Lateral Joint Line' },
    { key: 'patella', label: 'Patella' },
    { key: 'patellar_tendon', label: 'Patellar Tendon' },
    { key: 'quadriceps_tendon', label: 'Quadriceps Tendon' },
    { key: 'medial_collateral_ligament', label: 'Medial Collateral Ligament' },
    {
      key: 'lateral_collateral_ligament',
      label: 'Lateral Collateral Ligament',
    },
    { key: 'pes_anserine', label: 'Pes Anserine' },
    { key: 'popliteal_fossa', label: 'Popliteal Fossa' },
  ];

  // Knee-specific ROM tests
  const romTests = [
    { key: 'flexion', label: 'Flexion', normal: '135°' },
    { key: 'extension', label: 'Extension', normal: '0°' },
    { key: 'abduction', label: 'Abduction', normal: '10°' },
    { key: 'adduction', label: 'Adduction', normal: '10°' },
  ];

  const testOptions = ['Negative', 'Positive', 'Equivocal', 'Not Tested'];

  const pulseOptions = ['Present', 'Absent', 'Weak', 'Bounding', 'Not Tested'];

  const handleSpecialTestChange = (testKey, side, value) => {
    const fullKey = `${testKey}_${side}`;
    setFormData((prev) => ({
      ...prev,
      special_tests: {
        ...prev.special_tests,
        [fullKey]: value,
      },
    }));
  };

  const handleCirculationChange = (testKey, side, value) => {
    const fullKey = `${testKey}_${side}`;
    setFormData((prev) => ({
      ...prev,
      circulation: {
        ...prev.circulation,
        [fullKey]: value,
      },
    }));
  };

  const handleGirthChange = (testKey, side, value) => {
    const fullKey = `${testKey}_${side}`;
    setFormData((prev) => ({
      ...prev,
      girth: {
        ...prev.girth,
        [fullKey]: value,
      },
    }));
  };

  const handleIncisionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      incision: {
        ...prev.incision,
        [field]: value,
      },
    }));
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
          <Typography variant="h6">Knee Assessment</Typography>
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
                  <TableCell>ROM</TableCell>
                  <TableCell align="center">Right</TableCell>
                  <TableCell align="center">Left</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2">Flexion (N=135°)</Typography>
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
                      <Typography variant="body2">Extension (N=0°)</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="medium"
                      type="number"
                      value={formData.range_of_motion.extension?.right || ''}
                      onChange={(e) =>
                        handleRomChange('extension', 'right', e.target.value)
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
                      value={formData.range_of_motion.extension?.left || ''}
                      onChange={(e) =>
                        handleRomChange('extension', 'left', e.target.value)
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

        {/* <Grid item xs={12}>
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
                
                <TableRow>
                  <TableCell colSpan={3} sx={{ backgroundColor: 'grey.100' }}>
                    <Typography variant="subtitle2">Reflexes</Typography>
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
                <TableRow>
                  <TableCell component="th" scope="row">
                    L₅-S₁
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={
                          formData.neurological_scan.reflexes.l5_s1.right || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'l5_s1',
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
                          formData.neurological_scan.reflexes.l5_s1.left || ''
                        }
                        onChange={(e) =>
                          handleNeurologicalChange(
                            'reflexes',
                            'l5_s1',
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
                  <TableCell
                    colSpan={3}
                    sx={{ backgroundColor: 'grey.100', mt: 2 }}
                  >
                    <Typography variant="subtitle2">Sensory</Typography>
                  </TableCell>
                </TableRow>
                {['l3', 'l4', 'l5', 's1', 's2'].map((nerve) => (
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
        </Grid> */}

        <Divider sx={{ my: 3 }} />
        {/* Physical Examination */}
        <Typography variant="h5" gutterBottom>
          Physical Examination
        </Typography>
        <Grid container spacing={2}>
          {/* Strength Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Strength (MMT)
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Special Test
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('specialTests')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell align="center">Right</TableCell>
                    <TableCell align="center">Left</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Lachmann's
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.special_tests.lachmanns_right || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'lachmanns',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                          value={formData.special_tests.lachmanns_left || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'lachmanns',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                      Varus Stress 30° & 0°
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.varus_stress_30_right || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'varus_stress_30',
                                'right',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>30° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.varus_stress_0_right || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'varus_stress_0',
                                'right',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>0° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.varus_stress_30_left || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'varus_stress_30',
                                'left',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>30° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.varus_stress_0_left || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'varus_stress_0',
                                'left',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>0° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      Valgus Stress 24° & 0°
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.valgus_stress_24_right ||
                              ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'valgus_stress_24',
                                'right',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>24° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.valgus_stress_0_right || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'valgus_stress_0',
                                'right',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>0° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.valgus_stress_24_left || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'valgus_stress_24',
                                'left',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>24° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={
                              formData.special_tests.valgus_stress_0_left || ''
                            }
                            onChange={(e) =>
                              handleSpecialTestChange(
                                'valgus_stress_0',
                                'left',
                                e.target.value,
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>0° -Select-</em>
                            </MenuItem>
                            {testOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      COST-Test
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.special_tests.cost_test_right || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'cost_test',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                          value={formData.special_tests.cost_test_left || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'cost_test',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                      Mokkenny
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={formData.special_tests.mokkenny_right || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'mokkenny',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                          value={formData.special_tests.mokkenny_left || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'mokkenny',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                      Priori Shirt
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.special_tests.priori_shirt_right || ''
                          }
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'priori_shirt',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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
                          value={formData.special_tests.priori_shirt_left || ''}
                          onChange={(e) =>
                            handleSpecialTestChange(
                              'priori_shirt',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {testOptions.map((option) => (
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

            <Collapse in={showRemarks.specialTests}>
              <TextField
                fullWidth
                label="Special Tests Remark"
                value={formData.special_tests_remark}
                onChange={(e) =>
                  handleInputChange('special_tests_remark', e.target.value)
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Grid>

          {/* Circulation Section - New based on image */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Circulation
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('circulation')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>

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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Lower Extremity
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.circulation.lower_extremity_right || ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'lower_extremity',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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
                            formData.circulation.lower_extremity_left || ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'lower_extremity',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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
                      Dorsal Pedal Pulse
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.circulation.dorsal_pedal_pulse_right || ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'dorsal_pedal_pulse',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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
                            formData.circulation.dorsal_pedal_pulse_left || ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'dorsal_pedal_pulse',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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
                      Posterior Tibial Pulse
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={
                            formData.circulation.posterior_tibial_pulse_right ||
                            ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'posterior_tibial_pulse',
                              'right',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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
                            formData.circulation.posterior_tibial_pulse_left ||
                            ''
                          }
                          onChange={(e) =>
                            handleCirculationChange(
                              'posterior_tibial_pulse',
                              'left',
                              e.target.value,
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-Select-</em>
                          </MenuItem>
                          {pulseOptions.map((option) => (
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

            <Collapse in={showRemarks.circulation}>
              <TextField
                fullWidth
                label="Circulation Remark"
                value={formData.circulation_remark}
                onChange={(e) =>
                  handleInputChange('circulation_remark', e.target.value)
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Grid>

          {/* Girth Section - New based on image */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Girth
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('girth')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>

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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Total
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.total_right || ''}
                        onChange={(e) =>
                          handleGirthChange('total', 'right', e.target.value)
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.total_left || ''}
                        onChange={(e) =>
                          handleGirthChange('total', 'left', e.target.value)
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      (Above patella)
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.above_patella_right || ''}
                        onChange={(e) =>
                          handleGirthChange(
                            'above_patella',
                            'right',
                            e.target.value,
                          )
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.above_patella_left || ''}
                        onChange={(e) =>
                          handleGirthChange(
                            'above_patella',
                            'left',
                            e.target.value,
                          )
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      (Below patella)
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.below_patella_right || ''}
                        onChange={(e) =>
                          handleGirthChange(
                            'below_patella',
                            'right',
                            e.target.value,
                          )
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={formData.girth.below_patella_left || ''}
                        onChange={(e) =>
                          handleGirthChange(
                            'below_patella',
                            'left',
                            e.target.value,
                          )
                        }
                        placeholder="cm"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Collapse in={showRemarks.girth}>
              <TextField
                fullWidth
                label="Girth Remark"
                value={formData.girth_remark}
                onChange={(e) =>
                  handleInputChange('girth_remark', e.target.value)
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Grid>

          {/* Incision Section - New based on image */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Incision
              </Typography>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.incision.eligibility || false}
                    onChange={(e) =>
                      handleIncisionChange('eligibility', e.target.checked)
                    }
                  />
                }
                label="Eligibility"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.incision.minor_scudding || false}
                    onChange={(e) =>
                      handleIncisionChange('minor_scudding', e.target.checked)
                    }
                  />
                }
                label="Minor Scudding"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.incision.no_incision || false}
                    onChange={(e) =>
                      handleIncisionChange('no_incision', e.target.checked)
                    }
                  />
                }
                label="No Incision"
              />
            </FormGroup>

            <TextField
              fullWidth
              label="Incision Remark"
              value={formData.incision_remark}
              onChange={(e) =>
                handleInputChange('incision_remark', e.target.value)
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
              'Decreased soft tissue mobility',
              'Decreased accessory motions tibiofemoral and/or patellofemoral joints',
              'Hypermobility/instability of the knee',
              'Decreased strength of hip / knee',
              'Adaptive shortening of muscles',
              'Decreased balance/kineshetic awareness',
              'Faulty foot mechanics contributing to anterior knee pain',
              'Decreased quad control',
              'Post operative swelling',
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
              placeholder="Improve knee range of motion, Reduce pain during walking..."
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

export default AddKnee;
