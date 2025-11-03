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
  Stepper,
  Step,
  StepLabel,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

const AddHip = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Primary Complaint & History
    primary_complaint: '',
    onset: '',
    duration: '',
    mechanism_of_injury: '',
    aggravating_factors: '',
    easing_factors: '',
    previous_episodes: '',
    dominant_side: 'right',

    // Pain Assessment
    pain_location: [],
    pain_level: 0,
    pain_type: '',
    pain_radiation: false,
    radiation_pattern: '',
    night_pain: false,
    weight_bearing_pain: '',

    // Functional Limitations
    functional_limitations: [],
    adl_difficulties: [],
    sleep_disturbance: '',
    work_impact: '',
    sports_impact: '',
    walking_tolerance: '',
    standing_tolerance: '',

    // Hip Range of Motion
    rom_flexion_active: '',
    rom_flexion_passive: '',
    rom_extension_active: '',
    rom_extension_passive: '',
    rom_abduction_active: '',
    rom_abduction_passive: '',
    rom_adduction_active: '',
    rom_adduction_passive: '',
    rom_ir_active: '',
    rom_ir_passive: '',
    rom_er_active: '',
    rom_er_passive: '',
    rom_pain_pattern: '',

    // Strength Assessment
    strength_flexion: '',
    strength_extension: '',
    strength_abduction: '',
    strength_adduction: '',
    strength_ir: '',
    strength_er: '',
    strength_gluteus_maximus: '',
    strength_gluteus_medius: '',
    strength_hamstrings: '',
    strength_quadriceps: '',
    muscle_grading_system: 'MRC',

    // Special Tests
    special_tests: [],
    tests_results: {},

    // Palpation Findings
    tenderness_locations: [],
    muscle_spasms: [],
    trigger_points: [],
    joint_stiffness: [],
    crepitus: false,

    // Posture & Observation
    posture_assessment: [],
    gait_pattern: '',
    leg_length_discrepancy: '',
    muscle_atrophy: [],
    swelling: '',
    bruising: '',

    // Functional Tests
    functional_tests: {},

    // Red Flags Screening
    red_flags: [],
    neurological_symptoms: false,
    vascular_symptoms: false,

    // Additional Findings
    muscle_imbalance: '',
    joint_play: '',
    previous_treatment: '',
    previous_surgery: '',
    imaging_findings: '',

    // Assessment & Plan
    clinical_impression: '',
    differential_diagnosis: [],
    treatment_plan: [],
    goals: [],
    precautions: '',
    visit_id: visit?.visit_id || '',
  });

  const steps = [
    'Chief Complaint & History',
    'Pain Assessment',
    'Functional Status',
    'Physical Examination',
    'Special Tests & Palpation',
    'Assessment & Plan',
  ];

  // Hip-Specific Options
  const painLocations = [
    'Anterior Hip',
    'Lateral Hip',
    'Posterior Hip',
    'Groin',
    'Buttock',
    'Greater Trochanter',
    'SI Joint',
    'Hip Joint Line',
    'Adductor Origin',
    'Gluteal Region',
    'Referred from Lumbar',
  ];

  const radiationPatterns = [
    'Down Thigh (Anterior)',
    'Down Thigh (Lateral)',
    'To Knee',
    'To Lower Leg',
    'To Groin',
    'To Buttock',
    'To Sacrum',
    'Dermatomal Pattern',
  ];

  const functionalLimitations = [
    'Walking',
    'Stair Climbing',
    'Running',
    'Squatting',
    'Kneeling',
    'Sitting',
    'Standing',
    'Lying on Affected Side',
    'Getting Up from Chair',
    'Getting In/Out of Car',
    'Putting on Shoes/Socks',
    'Sexual Activities',
    'Work Activities',
    'Sports Activities',
  ];

  const adlDifficulties = [
    'Walking Distance',
    'Rising from Chair',
    'Bending Forward',
    'Crossing Legs',
    'Household Chores',
    'Shopping',
    'Driving',
    'Sleeping Comfortably',
    'Personal Hygiene',
    'Dressing Lower Body',
  ];

  const postureAssessment = [
    'Antalgic Gait',
    'Trendelenburg Gait',
    'Compensated Trendelenburg',
    'Lateral Trunk Lean',
    'Increased Lumbar Lordosis',
    'Decreased Lumbar Lordosis',
    'Pelvic Tilt (Anterior)',
    'Pelvic Tilt (Posterior)',
    'Pelvic Obliquity',
    'Femoral Anteversion',
    'Femoral Retroversion',
    'Normal Alignment',
  ];

  const gaitPatterns = [
    'Normal',
    'Antalgic',
    'Trendelenburg',
    'Compensated Trendelenburg',
    'Short Leg Gait',
    'Stiff Hip Gait',
    'Gluteus Maximus Lurch',
    'Circumduction',
    'Vaulting',
  ];

  const muscleAtrophyOptions = [
    'Gluteus Maximus',
    'Gluteus Medius',
    'Quadriceps',
    'Hamstrings',
    'Hip Adductors',
    'Hip Abductors',
    'No Visible Atrophy',
  ];

  const specialTests = [
    { name: 'Thomas Test', description: 'Hip flexor tightness' },
    { name: 'Ober Test', description: 'IT band tightness' },
    { name: 'Trendelenburg Test', description: 'Hip abductor strength' },
    { name: 'FABER/Patrick Test', description: 'SI joint/Hip pathology' },
    { name: 'FADIR Test', description: 'Femoroacetabular impingement' },
    { name: 'Scour Test', description: 'Labral pathology' },
    { name: 'Resisted Straight Leg Raise', description: 'Hip joint pathology' },
    { name: 'Ely Test', description: 'Rectus femoris tightness' },
    { name: '90-90 Hamstring Test', description: 'Hamstring tightness' },
    { name: 'Ober Test', description: 'IT band tightness' },
    { name: 'Piriformis Test', description: 'Piriformis syndrome' },
    {
      name: 'Leg Length Assessment',
      description: 'True vs apparent leg length',
    },
    { name: 'Craig Test', description: 'Femoral anteversion' },
  ];

  const tendernessLocations = [
    'Anterior Hip Joint',
    'Greater Trochanter',
    'IT Band',
    'Gluteus Medius',
    'Gluteus Minimus',
    'Piriformis',
    'SI Joint',
    'Adductor Origin',
    'Psoas',
    'Rectus Femoris',
    'Ischial Tuberosity',
    'Trochanteric Bursa',
  ];

  const functionalTestsOptions = [
    'Single Leg Stance',
    'Step Down Test',
    'Single Leg Squat',
    'Lunge Test',
    'Bridge Test',
    'Sitting to Standing',
    'Gait Observation',
    'Stair Negotiation',
  ];

  const redFlags = [
    'Traumatic Injury',
    'Unable to Bear Weight',
    'Severe Pain at Rest',
    'Night Pain',
    'Fever/Chills',
    'Unexplained Weight Loss',
    'History of Cancer',
    'Sudden Severe Pain',
    'Neurological Deficits',
    'Vascular Compromise',
    'Systemic Symptoms',
    'Bilateral Symptoms',
  ];

  const treatmentOptions = [
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Hip Strengthening',
    'Core Stabilization',
    'Stretching Protocol',
    'Gait Training',
    'Balance Training',
    'Modalities (US, TENS, Heat/Ice)',
    'Dry Needling',
    'Taping Techniques',
    'Activity Modification',
    'Workplace Ergonomics',
    'Home Exercise Program',
    'Patient Education',
    'Assistive Device Training',
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSpecialTestResult = (testName, result) => {
    setFormData((prev) => ({
      ...prev,
      tests_results: {
        ...prev.tests_results,
        [testName]: result,
      },
    }));
  };

  const handleFunctionalTestResult = (testName, result) => {
    setFormData((prev) => ({
      ...prev,
      functional_tests: {
        ...prev.functional_tests,
        [testName]: result,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Primary Complaint"
                value={formData.primary_complaint}
                onChange={(e) =>
                  handleInputChange('primary_complaint', e.target.value)
                }
                placeholder="Describe the main hip problem..."
                multiline
                rows={2}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Onset</InputLabel>
                <Select
                  value={formData.onset}
                  label="Onset"
                  onChange={(e) => handleInputChange('onset', e.target.value)}
                >
                  <MenuItem value="acute">Acute (0-7 days)</MenuItem>
                  <MenuItem value="subacute">Subacute (1-6 weeks)</MenuItem>
                  <MenuItem value="chronic">Chronic ({'>'}6 weeks)</MenuItem>
                  <MenuItem value="insidious">Insidious</MenuItem>
                  <MenuItem value="traumatic">Traumatic</MenuItem>
                  <MenuItem value="overuse">Overuse/Repetitive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 2 weeks, 3 months"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dominant Side</InputLabel>
                <Select
                  value={formData.dominant_side}
                  label="Dominant Side"
                  onChange={(e) =>
                    handleInputChange('dominant_side', e.target.value)
                  }
                >
                  <MenuItem value="right">Right</MenuItem>
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="bilateral">Bilateral</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mechanism of Injury"
                value={formData.mechanism_of_injury}
                onChange={(e) =>
                  handleInputChange('mechanism_of_injury', e.target.value)
                }
                placeholder="Describe how the injury occurred (fall, twisting, overuse, etc.)..."
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Previous Episodes"
                value={formData.previous_episodes}
                onChange={(e) =>
                  handleInputChange('previous_episodes', e.target.value)
                }
                placeholder="e.g., First episode, recurrent issues"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight Bearing Pain"
                value={formData.weight_bearing_pain}
                onChange={(e) =>
                  handleInputChange('weight_bearing_pain', e.target.value)
                }
                placeholder="e.g., Pain with standing, walking, running"
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
                placeholder="What makes it worse?"
                multiline
                rows={2}
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
                placeholder="What makes it better?"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Pain Location (Select all that apply)
              </Typography>
              <FormGroup row>
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
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Pain Level: {formData.pain_level}/10
              </Typography>
              <Slider
                value={formData.pain_level}
                onChange={(_, value) => handleInputChange('pain_level', value)}
                min={0}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Pain Type</FormLabel>
                <RadioGroup
                  value={formData.pain_type}
                  onChange={(e) =>
                    handleInputChange('pain_type', e.target.value)
                  }
                  row
                >
                  <FormControlLabel
                    value="sharp"
                    control={<Radio />}
                    label="Sharp"
                  />
                  <FormControlLabel
                    value="dull"
                    control={<Radio />}
                    label="Dull Ache"
                  />
                  <FormControlLabel
                    value="burning"
                    control={<Radio />}
                    label="Burning"
                  />
                  <FormControlLabel
                    value="aching"
                    control={<Radio />}
                    label="Aching"
                  />
                  <FormControlLabel
                    value="throbbing"
                    control={<Radio />}
                    label="Throbbing"
                  />
                  <FormControlLabel
                    value="stabbing"
                    control={<Radio />}
                    label="Stabbing"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.pain_radiation}
                    onChange={(e) =>
                      handleInputChange('pain_radiation', e.target.checked)
                    }
                  />
                }
                label="Pain Radiates to Other Areas"
              />
              {formData.pain_radiation && (
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Radiation Pattern</InputLabel>
                  <Select
                    value={formData.radiation_pattern}
                    label="Radiation Pattern"
                    onChange={(e) =>
                      handleInputChange('radiation_pattern', e.target.value)
                    }
                  >
                    {radiationPatterns.map((pattern) => (
                      <MenuItem key={pattern} value={pattern}>
                        {pattern}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.night_pain}
                    onChange={(e) =>
                      handleInputChange('night_pain', e.target.checked)
                    }
                  />
                }
                label="Night Pain"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Functional Limitations
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                    variant={
                      formData.functional_limitations.includes(limitation)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Activities of Daily Living (ADL) Difficulties
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {adlDifficulties.map((activity) => (
                  <Chip
                    key={activity}
                    label={activity}
                    onClick={() =>
                      handleArrayToggle('adl_difficulties', activity)
                    }
                    color={
                      formData.adl_difficulties.includes(activity)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      formData.adl_difficulties.includes(activity)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Walking Tolerance"
                value={formData.walking_tolerance}
                onChange={(e) =>
                  handleInputChange('walking_tolerance', e.target.value)
                }
                placeholder="e.g., 10 minutes, 500 meters"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Standing Tolerance"
                value={formData.standing_tolerance}
                onChange={(e) =>
                  handleInputChange('standing_tolerance', e.target.value)
                }
                placeholder="e.g., 5 minutes, 15 minutes"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sleep Disturbance"
                value={formData.sleep_disturbance}
                onChange={(e) =>
                  handleInputChange('sleep_disturbance', e.target.value)
                }
                placeholder="Describe sleep issues related to hip..."
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Impact on Work"
                value={formData.work_impact}
                onChange={(e) =>
                  handleInputChange('work_impact', e.target.value)
                }
                placeholder="How does this affect work?"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Impact on Sports/Recreation"
                value={formData.sports_impact}
                onChange={(e) =>
                  handleInputChange('sports_impact', e.target.value)
                }
                placeholder="How does this affect sports or hobbies?"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Hip Range of Motion (Degrees)
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Flexion Active', field: 'rom_flexion_active' },
                  { label: 'Flexion Passive', field: 'rom_flexion_passive' },
                  { label: 'Extension Active', field: 'rom_extension_active' },
                  {
                    label: 'Extension Passive',
                    field: 'rom_extension_passive',
                  },
                  { label: 'Abduction Active', field: 'rom_abduction_active' },
                  {
                    label: 'Abduction Passive',
                    field: 'rom_abduction_passive',
                  },
                  { label: 'Adduction Active', field: 'rom_adduction_active' },
                  {
                    label: 'Adduction Passive',
                    field: 'rom_adduction_passive',
                  },
                  { label: 'Internal Rotation Active', field: 'rom_ir_active' },
                  {
                    label: 'Internal Rotation Passive',
                    field: 'rom_ir_passive',
                  },
                  { label: 'External Rotation Active', field: 'rom_er_active' },
                  {
                    label: 'External Rotation Passive',
                    field: 'rom_er_passive',
                  },
                ].map((rom) => (
                  <Grid item xs={12} sm={6} md={4} key={rom.field}>
                    <TextField
                      fullWidth
                      label={rom.label}
                      type="number"
                      value={formData[rom.field]}
                      onChange={(e) =>
                        handleInputChange(rom.field, e.target.value)
                      }
                      InputProps={{ endAdornment: '°' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Strength Assessment (0-5 Scale)
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Hip Flexion', field: 'strength_flexion' },
                  { label: 'Hip Extension', field: 'strength_extension' },
                  { label: 'Hip Abduction', field: 'strength_abduction' },
                  { label: 'Hip Adduction', field: 'strength_adduction' },
                  { label: 'Hip Internal Rotation', field: 'strength_ir' },
                  { label: 'Hip External Rotation', field: 'strength_er' },
                  {
                    label: 'Gluteus Maximus',
                    field: 'strength_gluteus_maximus',
                  },
                  { label: 'Gluteus Medius', field: 'strength_gluteus_medius' },
                  { label: 'Hamstrings', field: 'strength_hamstrings' },
                  { label: 'Quadriceps', field: 'strength_quadriceps' },
                ].map((strength) => (
                  <Grid item xs={12} sm={6} md={4} key={strength.field}>
                    <TextField
                      fullWidth
                      label={strength.label}
                      type="number"
                      value={formData[strength.field]}
                      onChange={(e) =>
                        handleInputChange(strength.field, e.target.value)
                      }
                      inputProps={{ min: 0, max: 5, step: 0.5 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Posture & Gait Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gait Pattern</InputLabel>
                    <Select
                      value={formData.gait_pattern}
                      label="Gait Pattern"
                      onChange={(e) =>
                        handleInputChange('gait_pattern', e.target.value)
                      }
                    >
                      {gaitPatterns.map((pattern) => (
                        <MenuItem key={pattern} value={pattern}>
                          {pattern}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Leg Length Discrepancy"
                    value={formData.leg_length_discrepancy}
                    onChange={(e) =>
                      handleInputChange(
                        'leg_length_discrepancy',
                        e.target.value,
                      )
                    }
                    placeholder="e.g., 1cm short, no discrepancy"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Posture Assessment
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                  >
                    {postureAssessment.map((posture) => (
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
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Muscle Atrophy
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {muscleAtrophyOptions.map((muscle) => (
                      <Chip
                        key={muscle}
                        label={muscle}
                        onClick={() =>
                          handleArrayToggle('muscle_atrophy', muscle)
                        }
                        color={
                          formData.muscle_atrophy.includes(muscle)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.muscle_atrophy.includes(muscle)
                            ? 'filled'
                            : 'outlined'
                        }
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Special Tests
              </Typography>
              <Grid container spacing={2}>
                {specialTests.map((test) => (
                  <Grid item xs={12} sm={6} key={test.name}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
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
                        value={formData.tests_results[test.name] || ''}
                        onChange={(e) =>
                          handleSpecialTestResult(test.name, e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="positive"
                          control={<Radio />}
                          label="Positive"
                        />
                        <FormControlLabel
                          value="negative"
                          control={<Radio />}
                          label="Negative"
                        />
                        <FormControlLabel
                          value="not_tested"
                          control={<Radio />}
                          label="Not Tested"
                        />
                      </RadioGroup>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Functional Tests
              </Typography>
              <Grid container spacing={2}>
                {functionalTestsOptions.map((test) => (
                  <Grid item xs={12} sm={6} key={test}>
                    <FormControl fullWidth>
                      <InputLabel>{test}</InputLabel>
                      <Select
                        value={formData.functional_tests[test] || ''}
                        label={test}
                        onChange={(e) =>
                          handleFunctionalTestResult(test, e.target.value)
                        }
                      >
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="mild_impairment">
                          Mild Impairment
                        </MenuItem>
                        <MenuItem value="moderate_impairment">
                          Moderate Impairment
                        </MenuItem>
                        <MenuItem value="severe_impairment">
                          Severe Impairment
                        </MenuItem>
                        <MenuItem value="unable">Unable to Perform</MenuItem>
                        <MenuItem value="not_tested">Not Tested</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Palpation Findings
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {tendernessLocations.map((location) => (
                  <Chip
                    key={location}
                    label={location}
                    onClick={() =>
                      handleArrayToggle('tenderness_locations', location)
                    }
                    color={
                      formData.tenderness_locations.includes(location)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      formData.tenderness_locations.includes(location)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.crepitus}
                    onChange={(e) =>
                      handleInputChange('crepitus', e.target.checked)
                    }
                  />
                }
                label="Crepitus Present"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Red Flags Screening
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {redFlags.map((flag) => (
                  <Chip
                    key={flag}
                    label={flag}
                    onClick={() => handleArrayToggle('red_flags', flag)}
                    color={
                      formData.red_flags.includes(flag) ? 'error' : 'default'
                    }
                    variant={
                      formData.red_flags.includes(flag) ? 'filled' : 'outlined'
                    }
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clinical Impression/Assessment"
                value={formData.clinical_impression}
                onChange={(e) =>
                  handleInputChange('clinical_impression', e.target.value)
                }
                multiline
                rows={3}
                placeholder="Summary of hip findings and clinical reasoning..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Treatment Plan
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {treatmentOptions.map((treatment) => (
                  <Chip
                    key={treatment}
                    label={treatment}
                    onClick={() =>
                      handleArrayToggle('treatment_plan', treatment)
                    }
                    color={
                      formData.treatment_plan.includes(treatment)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      formData.treatment_plan.includes(treatment)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short-term Goals (2-4 weeks)"
                value={formData.goals.join(', ')}
                onChange={(e) =>
                  handleInputChange('goals', e.target.value.split(', '))
                }
                multiline
                rows={2}
                placeholder="e.g., Reduce pain by 50%, Improve walking distance, Restore hip strength..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Precautions & Contraindications"
                value={formData.precautions}
                onChange={(e) =>
                  handleInputChange('precautions', e.target.value)
                }
                multiline
                rows={2}
                placeholder="Weight bearing restrictions, activity limitations..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Imaging Findings"
                value={formData.imaging_findings}
                onChange={(e) =>
                  handleInputChange('imaging_findings', e.target.value)
                }
                multiline
                rows={2}
                placeholder="X-ray, MRI, or US findings if available..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Previous Treatment/Surgery"
                value={formData.previous_treatment}
                onChange={(e) =>
                  handleInputChange('previous_treatment', e.target.value)
                }
                multiline
                rows={2}
                placeholder="Any previous treatments, injections, or surgeries..."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Hip Assessment</Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent dividers>{renderStepContent(activeStep)}</DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isSubmitting}
        >
          Back
        </Button>

        <Box sx={{ flex: 1 }} />

        {activeStep === steps.length - 1 ? (
          <LoadingButton
            onClick={handleSubmit}
            loading={isSubmitting}
            variant="contained"
            disabled={
              !formData.primary_complaint || !formData.clinical_impression
            }
          >
            Submit Assessment
          </LoadingButton>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddHip;
