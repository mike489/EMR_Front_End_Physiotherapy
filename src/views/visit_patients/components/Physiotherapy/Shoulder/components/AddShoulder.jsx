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

const AddShoulder = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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
    dominant_hand: 'right',

    // Pain Assessment
    pain_location: [],
    pain_level: 0,
    pain_type: '',
    pain_radiation: false,
    radiation_pattern: '',
    night_pain: false,

    // Functional Limitations
    functional_limitations: [],
    adl_difficulties: [],
    sleep_disturbance: '',
    work_impact: '',
    sports_impact: '',

    // Shoulder Range of Motion
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
    rom_horizontal_abduction_active: '',
    rom_horizontal_abduction_passive: '',
    rom_horizontal_adduction_active: '',
    rom_horizontal_adduction_passive: '',
    rom_pain_pattern: '',

    // Strength Assessment
    strength_flexion: '',
    strength_extension: '',
    strength_abduction: '',
    strength_adduction: '',
    strength_ir: '',
    strength_er: '',
    strength_empty_can: '',
    strength_lift_off: '',
    strength_belly_press: '',
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
    shoulder_position: '',
    muscle_atrophy: [],
    swelling: '',
    bruising: '',

    // Red Flags Screening
    red_flags: [],
    instability_episodes: false,
    locking_catching: false,
    neurological_symptoms: false,

    // Functional Tests
    functional_tests: {},

    // Additional Findings
    muscle_imbalance: '',
    joint_play: '',
    scapular_dyskinesis: '',
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

  // Shoulder-Specific Options
  const painLocations = [
    'Anterior Shoulder',
    'Lateral Shoulder',
    'Posterior Shoulder',
    'Acromioclavicular Joint',
    'Sternoclavicular Joint',
    'Bicipital Groove',
    'Subacromial Space',
    'Rotator Cuff',
    'Deltoid',
    'Trapezius',
    'Scapular Region',
    'Referred from Cervical',
  ];

  const radiationPatterns = [
    'Down Arm (Radicular)',
    'To Elbow',
    'To Hand/Fingers',
    'To Scapula',
    'To Neck',
    'To Chest',
    'Dermatomal Pattern',
  ];

  const functionalLimitations = [
    'Overhead Activities',
    'Reaching Behind Back',
    'Reaching Across Body',
    'Lifting Objects',
    'Pushing/Pulling',
    'Throwing',
    'Sleeping on Affected Side',
    'Dressing/Undressing',
    'Personal Hygiene',
    'Driving',
    'Work Activities',
    'Sports Activities',
    'Household Chores',
  ];

  const adlDifficulties = [
    'Combing Hair',
    'Brushing Teeth',
    'Washing Back',
    'Fastening Bra',
    'Putting on Shirt',
    'Reaching High Shelf',
    'Carrying Groceries',
    'Opening Jars',
    'Computer Work',
    'Sleeping Comfortably',
  ];

  const postureAssessment = [
    'Rounded Shoulders',
    'Forward Head Posture',
    'Winged Scapula',
    'Elevated Shoulder',
    'Depressed Shoulder',
    'Protracted Scapula',
    'Retracted Scapula',
    'Anterior Tilt',
    'Posterior Tilt',
    'Normal Alignment',
  ];

  const muscleAtrophyOptions = [
    'Supraspinatus',
    'Infraspinatus',
    'Deltoid',
    'Trapezius',
    'Serratus Anterior',
    'No Visible Atrophy',
  ];

  const specialTests = [
    { name: 'Neer Impingement Test', description: 'Subacromial impingement' },
    { name: 'Hawkins-Kennedy Test', description: 'Subacromial impingement' },
    { name: 'Empty Can Test', description: 'Supraspinatus integrity' },
    { name: 'Drop Arm Test', description: 'Rotator cuff tear' },
    { name: 'Lift-off Test', description: 'Subscapularis integrity' },
    { name: 'Belly Press Test', description: 'Subscapularis integrity' },
    { name: 'Apprehension Test', description: 'Anterior instability' },
    { name: 'Relocation Test', description: 'Anterior instability' },
    { name: 'Sulcus Sign', description: 'Inferior instability' },
    { name: "O'Brien Test", description: 'SLAP lesion' },
    { name: "Speed's Test", description: 'Biceps tendon pathology' },
    { name: "Yergason's Test", description: 'Biceps tendon stability' },
    { name: 'Cross-body Adduction Test', description: 'AC joint pathology' },
    { name: 'Scarf Test', description: 'AC joint pathology' },
  ];

  const tendernessLocations = [
    'Bicipital Groove',
    'AC Joint',
    'Subacromial Space',
    'Supraspinatus Tendon',
    'Infraspinatus Tendon',
    'Teres Minor',
    'Subscapularis',
    'Deltoid Insertion',
    'Trapezius',
    'Levator Scapulae',
    'Sternoclavicular Joint',
    'Scapular Borders',
  ];

  const functionalTestsOptions = [
    'Apley Scratch Test',
    'Hand Behind Back',
    'Hand to Opposite Shoulder',
    'Wall Push-up',
    'Scapular Stability',
    'Functional Reach Test',
  ];

  const redFlags = [
    'Severe Trauma',
    'Sudden Weakness',
    'Numbness/Tingling Arm',
    'Neck Pain with Radiation',
    'Unexplained Weight Loss',
    'History of Cancer',
    'Fever/Chills',
    'Night Sweats',
    'Constant Severe Pain',
    'Joint Swelling/Warmth',
    'Systemic Symptoms',
  ];

  const treatmentOptions = [
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Rotator Cuff Strengthening',
    'Scapular Stabilization',
    'Range of Motion Exercises',
    'Stretching Protocol',
    'Postural Re-education',
    'Modalities (US, TENS, Heat/Ice)',
    'Dry Needling',
    'Kinesio Taping',
    'Activity Modification',
    'Workplace Ergonomics',
    'Sports-specific Training',
    'Home Exercise Program',
    'Patient Education',
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
                placeholder="Describe the main shoulder problem..."
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
                <InputLabel>Dominant Hand</InputLabel>
                <Select
                  value={formData.dominant_hand}
                  label="Dominant Hand"
                  onChange={(e) =>
                    handleInputChange('dominant_hand', e.target.value)
                  }
                >
                  <MenuItem value="right">Right</MenuItem>
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="ambidextrous">Ambidextrous</MenuItem>
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
                placeholder="Describe how the injury occurred (fall, lifting, throwing, etc.)..."
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
                placeholder="e.g., First episode, recurrent dislocations"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.instability_episodes}
                    onChange={(e) =>
                      handleInputChange(
                        'instability_episodes',
                        e.target.checked,
                      )
                    }
                  />
                }
                label="History of Instability"
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sleep Disturbance"
                value={formData.sleep_disturbance}
                onChange={(e) =>
                  handleInputChange('sleep_disturbance', e.target.value)
                }
                placeholder="Describe sleep issues related to shoulder..."
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
                Shoulder Range of Motion (Degrees)
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
                  {
                    label: 'Horizontal Abduction Active',
                    field: 'rom_horizontal_abduction_active',
                  },
                  {
                    label: 'Horizontal Abduction Passive',
                    field: 'rom_horizontal_abduction_passive',
                  },
                  {
                    label: 'Horizontal Adduction Active',
                    field: 'rom_horizontal_adduction_active',
                  },
                  {
                    label: 'Horizontal Adduction Passive',
                    field: 'rom_horizontal_adduction_passive',
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
                  { label: 'Flexion', field: 'strength_flexion' },
                  { label: 'Extension', field: 'strength_extension' },
                  { label: 'Abduction', field: 'strength_abduction' },
                  { label: 'Adduction', field: 'strength_adduction' },
                  { label: 'Internal Rotation', field: 'strength_ir' },
                  { label: 'External Rotation', field: 'strength_er' },
                  {
                    label: 'Empty Can (Supraspinatus)',
                    field: 'strength_empty_can',
                  },
                  {
                    label: 'Lift-off (Subscapularis)',
                    field: 'strength_lift_off',
                  },
                  {
                    label: 'Belly Press (Subscapularis)',
                    field: 'strength_belly_press',
                  },
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
                Posture & Observation
              </Typography>
              <Grid container spacing={2}>
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

                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                        <MenuItem value="limited">Limited</MenuItem>
                        <MenuItem value="painful">Painful</MenuItem>
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
                placeholder="Summary of findings and clinical reasoning..."
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
                placeholder="e.g., Reduce pain by 50%, Improve overhead reach, Restore functional strength..."
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
                placeholder="Any activity restrictions or precautions..."
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
          <Typography variant="h6">Shoulder Assessment</Typography>
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

export default AddShoulder;
