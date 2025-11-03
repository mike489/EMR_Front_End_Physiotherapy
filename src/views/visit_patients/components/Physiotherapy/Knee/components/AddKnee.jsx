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

const AddKnee = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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
    dominant_leg: 'right',
    injury_context: '',

    // Pain Assessment
    pain_location: [],
    pain_level: 0,
    pain_type: '',
    pain_radiation: false,
    radiation_pattern: '',
    weight_bearing_pain: '',
    night_pain: false,
    swelling_timing: '',

    // Functional Limitations
    functional_limitations: [],
    adl_difficulties: [],
    sleep_disturbance: '',
    work_impact: '',
    sports_impact: '',
    walking_tolerance: '',
    standing_tolerance: '',
    stair_negotiation: '',

    // Knee Range of Motion
    rom_flexion_active: '',
    rom_flexion_passive: '',
    rom_extension_active: '',
    rom_extension_passive: '',
    rom_hyperextension: '',
    rom_pain_pattern: '',

    // Strength Assessment
    strength_quadriceps: '',
    strength_hamstrings: '',
    strength_hip_flexors: '',
    strength_hip_abductors: '',
    strength_hip_adductors: '',
    strength_gluteus_maximus: '',
    strength_gluteus_medius: '',
    strength_gastrocnemius: '',
    muscle_grading_system: 'MRC',

    // Special Tests
    special_tests: [],
    tests_results: {},

    // Ligament Tests
    ligament_tests: {},

    // Meniscus Tests
    meniscus_tests: {},

    // Palpation Findings
    tenderness_locations: [],
    muscle_spasms: [],
    trigger_points: [],
    joint_stiffness: [],
    crepitus: false,
    effusion: '',

    // Structural Assessment
    alignment: '',
    deformities: [],
    muscle_atrophy: [],
    swelling_location: [],
    bruising: '',
    surgical_scars: [],

    // Gait & Biomechanics
    gait_analysis: [],
    weight_bearing_status: '',
    dynamic_alignment: {},
    functional_tests: {},

    // Neurological Assessment
    neurological_symptoms: [],
    sensation: {},
    reflexes: {},
    motor_function: {},

    // Patellofemoral Assessment
    patellofemoral_characteristics: [],
    patellar_position: '',
    patellar_mobility: '',
    q_angle: '',

    // Red Flags Screening
    red_flags: [],
    locking_catching: false,
    giving_way: false,
    instability_episodes: '',

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
    'Special Tests & Biomechanics',
    'Assessment & Plan',
  ];

  // Knee-Specific Options
  const painLocations = [
    'Anterior Knee',
    'Medial Knee',
    'Lateral Knee',
    'Posterior Knee',
    'Patellar',
    'Medial Joint Line',
    'Lateral Joint Line',
    'Patellar Tendon',
    'Quadriceps Tendon',
    'Pes Anserine',
    'IT Band',
    'Retropatellar',
    'Suprapatellar',
    'Infrapatellar',
    'Referred from Hip',
    'Referred from Lumbar',
  ];

  const radiationPatterns = [
    'Up Thigh (Anterior)',
    'Up Thigh (Posterior)',
    'Down Leg (Anterior)',
    'Down Leg (Posterior)',
    'To Calf',
    'To Foot',
    'Dermatomal Pattern',
    'Non-dermatomal Pattern',
  ];

  const functionalLimitations = [
    'Walking',
    'Running',
    'Jumping',
    'Stair Climbing',
    'Stair Descending',
    'Squatting',
    'Kneeling',
    'Sitting for Prolonged Time',
    'Standing',
    'Pivoting/Twisting',
    'Sports Activities',
    'Work Activities',
    'Household Chores',
    'Driving',
    'Sleeping Positions',
    'Rising from Chair',
  ];

  const adlDifficulties = [
    'Walking Distance',
    'Standing Duration',
    'Stair Negotiation',
    'Getting Up/Down from Floor',
    'Putting on Shoes/Socks',
    'Personal Hygiene',
    'Shopping',
    'Housework',
    'Work Requirements',
    'Sports Participation',
    'Sleeping Comfortably',
    'Driving Comfort',
  ];

  const alignmentOptions = [
    'Neutral Alignment',
    'Genu Varum (Bow-legged)',
    'Genu Valgum (Knock-kneed)',
    'Genu Recurvatum (Hyperextension)',
    'Flexion Contracture',
    'Rotational Malalignment',
    'Combined Deformity',
  ];

  const deformities = [
    'Joint Effusion',
    'Muscle Atrophy',
    'Patellar Malalignment',
    'Bony Deformity',
    'Swelling',
    'Ecchymosis',
    'Surgical Scars',
    'Genu Varum',
    'Genu Valgum',
    'Genu Recurvatum',
    'Flexion Contracture',
  ];

  const muscleAtrophyOptions = [
    'Quadriceps',
    'Hamstrings',
    'Gluteus Medius',
    'Gluteus Maximus',
    'Calf Muscles',
    'No Visible Atrophy',
  ];

  const swellingLocations = [
    'Suprapatellar',
    'Prepatellar',
    'Infrapatellar',
    'Medial Joint',
    'Lateral Joint',
    'Diffuse',
    'Pes Anserine',
    "Baker's Cyst",
  ];

  const gaitAnalysis = [
    'Antalgic Gait',
    'Stiff Knee Gait',
    'Flexion Contracture Gait',
    'Varus Thrust',
    'Valgus Thrust',
    'Quadriceps Avoidance',
    'Lateral Trunk Lean',
    'Short Step Length',
    'Reduced Knee Flexion',
    'Reduced Knee Extension',
    'Normal Gait',
  ];

  const neurologicalSymptoms = [
    'Numbness Thigh',
    'Numbness Leg',
    'Numbness Foot',
    'Tingling Thigh',
    'Tingling Leg',
    'Tingling Foot',
    'Weakness Leg',
    'Burning Sensation',
    'Electric Shocks',
    'Loss of Balance',
  ];

  const patellofemoralCharacteristics = [
    'Patellar Crepitus',
    'Patellar Tenderness',
    'Retropatellar Pain',
    'Peripatellar Pain',
    'Patellar Instability',
    'Patellar Maltracking',
    'J-sign',
    'Lateral Patellar Compression',
    'Patellar Hypomobility',
    'Patellar Hypermobility',
  ];

  const specialTests = [
    {
      name: 'Lachman Test',
      description: 'Anterior cruciate ligament integrity',
    },
    { name: 'Anterior Drawer Test', description: 'Anterior cruciate ligament' },
    {
      name: 'Posterior Drawer Test',
      description: 'Posterior cruciate ligament',
    },
    { name: 'Pivot Shift Test', description: 'Rotational ACL instability' },
    { name: 'Valgus Stress Test', description: 'Medial collateral ligament' },
    { name: 'Varus Stress Test', description: 'Lateral collateral ligament' },
    { name: 'McMurray Test', description: 'Meniscal pathology' },
    { name: 'Apley Compression Test', description: 'Meniscal pathology' },
    { name: 'Thessaly Test', description: 'Meniscal pathology' },
    { name: 'Patellar Grind Test', description: 'Patellofemoral arthritis' },
    { name: "Clarke's Test", description: 'Patellofemoral pain syndrome' },
    { name: 'Ober Test', description: 'IT band tightness' },
    { name: 'Noble Compression Test', description: 'IT band syndrome' },
    { name: 'Ege Test', description: 'Meniscal pathology' },
  ];

  const ligamentTests = [
    'Lachman Test',
    'Anterior Drawer',
    'Posterior Drawer',
    'Valgus Stress 0°',
    'Valgus Stress 30°',
    'Varus Stress 0°',
    'Varus Stress 30°',
    'Pivot Shift',
    'Reverse Pivot Shift',
    'Slocum Test',
  ];

  const meniscusTests = [
    'McMurray Test',
    'Apley Compression',
    'Thessaly Test 20°',
    'Ege Test',
    'Bounce Home Test',
    'Steinmann Test',
    'Childress Test',
  ];

  const tendernessLocations = [
    'Medial Joint Line',
    'Lateral Joint Line',
    'Patellar Tendon',
    'Quadriceps Tendon',
    'Pes Anserine',
    'IT Band Insertion',
    'Medial Collateral Ligament',
    'Lateral Collateral Ligament',
    'Retropatellar Surface',
    'Suprapatellar Pouch',
    'Infrapatellar Fat Pad',
    'Fibular Head',
    'Tibial Tubercle',
    "Baker's Cyst Area",
  ];

  const functionalTestsOptions = [
    'Single Leg Squat',
    'Step Down Test',
    'Single Leg Hop',
    'Triple Hop Test',
    'Crossover Hop Test',
    '6-meter Timed Hop',
    'Balance Tests',
    'Agility Tests',
  ];

  const redFlags = [
    'Unable to Bear Weight',
    'Severe Trauma',
    'Gross Deformity',
    'Signs of Infection',
    'Severe Swelling',
    'Loss of Pulse',
    'Cold Foot',
    'Numbness/Loss of Sensation',
    'Progressive Weakness',
    'Locked Knee',
    'Recurrent Giving Way',
    'Fever/Chills',
  ];

  const treatmentOptions = [
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Strengthening Exercises',
    'Neuromuscular Re-education',
    'Balance Training',
    'Proprioception Training',
    'Gait Training',
    'Modalities (US, TENS, Heat/Ice)',
    'Dry Needling',
    'Taping Techniques',
    'Bracing',
    'Activity Modification',
    'Home Exercise Program',
    'Patient Education',
    'Aquatic Therapy',
    'Return to Sport Training',
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

  const handleObjectFieldChange = (objectField, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [objectField]: {
        ...prev[objectField],
        [key]: value,
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
                placeholder="Describe the main knee problem..."
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
                  <MenuItem value="post_surgical">Post-surgical</MenuItem>
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
                <InputLabel>Dominant Leg</InputLabel>
                <Select
                  value={formData.dominant_leg}
                  label="Dominant Leg"
                  onChange={(e) =>
                    handleInputChange('dominant_leg', e.target.value)
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
                placeholder="Describe how the injury occurred (twisting, direct blow, fall, etc.)..."
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Injury Context"
                value={formData.injury_context}
                onChange={(e) =>
                  handleInputChange('injury_context', e.target.value)
                }
                placeholder="e.g., Sports injury, work-related, fall at home..."
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
                placeholder="e.g., First episode, recurrent instability"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Swelling Timing"
                value={formData.swelling_timing}
                onChange={(e) =>
                  handleInputChange('swelling_timing', e.target.value)
                }
                placeholder="e.g., Immediate, delayed, chronic"
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
                label="Instability Episodes"
                value={formData.instability_episodes}
                onChange={(e) =>
                  handleInputChange('instability_episodes', e.target.value)
                }
                placeholder="e.g., Frequency of giving way"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Neurological Symptoms (Select all that apply)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {neurologicalSymptoms.map((symptom) => (
                  <Chip
                    key={symptom}
                    label={symptom}
                    onClick={() =>
                      handleArrayToggle('neurological_symptoms', symptom)
                    }
                    color={
                      formData.neurological_symptoms.includes(symptom)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      formData.neurological_symptoms.includes(symptom)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stair Negotiation"
                value={formData.stair_negotiation}
                onChange={(e) =>
                  handleInputChange('stair_negotiation', e.target.value)
                }
                placeholder="e.g., Unable, painful, normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.locking_catching}
                    onChange={(e) =>
                      handleInputChange('locking_catching', e.target.checked)
                    }
                  />
                }
                label="Locking/Catching Sensation"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.giving_way}
                    onChange={(e) =>
                      handleInputChange('giving_way', e.target.checked)
                    }
                  />
                }
                label="Giving Way/Instability"
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
                placeholder="Describe sleep issues related to knee pain..."
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
                Knee Range of Motion (Degrees)
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
                  { label: 'Hyperextension', field: 'rom_hyperextension' },
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
                  { label: 'Quadriceps', field: 'strength_quadriceps' },
                  { label: 'Hamstrings', field: 'strength_hamstrings' },
                  { label: 'Hip Flexors', field: 'strength_hip_flexors' },
                  { label: 'Hip Abductors', field: 'strength_hip_abductors' },
                  { label: 'Hip Adductors', field: 'strength_hip_adductors' },
                  {
                    label: 'Gluteus Maximus',
                    field: 'strength_gluteus_maximus',
                  },
                  { label: 'Gluteus Medius', field: 'strength_gluteus_medius' },
                  { label: 'Gastrocnemius', field: 'strength_gastrocnemius' },
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
                Structural Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Alignment</InputLabel>
                    <Select
                      value={formData.alignment}
                      label="Alignment"
                      onChange={(e) =>
                        handleInputChange('alignment', e.target.value)
                      }
                    >
                      {alignmentOptions.map((alignment) => (
                        <MenuItem key={alignment} value={alignment}>
                          {alignment}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Q Angle"
                    value={formData.q_angle}
                    onChange={(e) =>
                      handleInputChange('q_angle', e.target.value)
                    }
                    placeholder="e.g., 15°, normal range"
                    InputProps={{ endAdornment: '°' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Deformities (Select all that apply)
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                  >
                    {deformities.map((deformity) => (
                      <Chip
                        key={deformity}
                        label={deformity}
                        onClick={() =>
                          handleArrayToggle('deformities', deformity)
                        }
                        color={
                          formData.deformities.includes(deformity)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.deformities.includes(deformity)
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
                  <Typography variant="subtitle1" gutterBottom>
                    Swelling Locations
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {swellingLocations.map((location) => (
                      <Chip
                        key={location}
                        label={location}
                        onClick={() =>
                          handleArrayToggle('swelling_location', location)
                        }
                        color={
                          formData.swelling_location.includes(location)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.swelling_location.includes(location)
                            ? 'filled'
                            : 'outlined'
                        }
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Patellofemoral Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Patellar Position</InputLabel>
                    <Select
                      value={formData.patellar_position}
                      label="Patellar Position"
                      onChange={(e) =>
                        handleInputChange('patellar_position', e.target.value)
                      }
                    >
                      <MenuItem value="neutral">Neutral</MenuItem>
                      <MenuItem value="lateral">Lateral</MenuItem>
                      <MenuItem value="medial">Medial</MenuItem>
                      <MenuItem value="alta">Alta (High)</MenuItem>
                      <MenuItem value="baja">Baja (Low)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Patellar Mobility</InputLabel>
                    <Select
                      value={formData.patellar_mobility}
                      label="Patellar Mobility"
                      onChange={(e) =>
                        handleInputChange('patellar_mobility', e.target.value)
                      }
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="hypomobile">Hypomobile</MenuItem>
                      <MenuItem value="hypermobile">Hypermobile</MenuItem>
                      <MenuItem value="lateral_restricted">
                        Lateral Restricted
                      </MenuItem>
                      <MenuItem value="medial_restricted">
                        Medial Restricted
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Patellofemoral Characteristics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {patellofemoralCharacteristics.map((characteristic) => (
                      <Chip
                        key={characteristic}
                        label={characteristic}
                        onClick={() =>
                          handleArrayToggle(
                            'patellofemoral_characteristics',
                            characteristic,
                          )
                        }
                        color={
                          formData.patellofemoral_characteristics.includes(
                            characteristic,
                          )
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.patellofemoral_characteristics.includes(
                            characteristic,
                          )
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
                Special Tests - Ligaments
              </Typography>
              <Grid container spacing={2}>
                {ligamentTests.map((test) => (
                  <Grid item xs={12} sm={6} key={test}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{test}</InputLabel>
                      <Select
                        value={formData.ligament_tests[test] || ''}
                        label={test}
                        onChange={(e) =>
                          handleObjectFieldChange(
                            'ligament_tests',
                            test,
                            e.target.value,
                          )
                        }
                      >
                        <MenuItem value="positive">Positive</MenuItem>
                        <MenuItem value="negative">Negative</MenuItem>
                        <MenuItem value="painful">Painful</MenuItem>
                        <MenuItem value="not_tested">Not Tested</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Special Tests - Meniscus
              </Typography>
              <Grid container spacing={2}>
                {meniscusTests.map((test) => (
                  <Grid item xs={12} sm={6} key={test}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{test}</InputLabel>
                      <Select
                        value={formData.meniscus_tests[test] || ''}
                        label={test}
                        onChange={(e) =>
                          handleObjectFieldChange(
                            'meniscus_tests',
                            test,
                            e.target.value,
                          )
                        }
                      >
                        <MenuItem value="positive">Positive</MenuItem>
                        <MenuItem value="negative">Negative</MenuItem>
                        <MenuItem value="painful">Painful</MenuItem>
                        <MenuItem value="not_tested">Not Tested</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Special Tests
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
                Gait & Biomechanics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Gait Analysis
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                  >
                    {gaitAnalysis.map((pattern) => (
                      <Chip
                        key={pattern}
                        label={pattern}
                        onClick={() =>
                          handleArrayToggle('gait_analysis', pattern)
                        }
                        color={
                          formData.gait_analysis.includes(pattern)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.gait_analysis.includes(pattern)
                            ? 'filled'
                            : 'outlined'
                        }
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Weight Bearing Status</InputLabel>
                    <Select
                      value={formData.weight_bearing_status}
                      label="Weight Bearing Status"
                      onChange={(e) =>
                        handleInputChange(
                          'weight_bearing_status',
                          e.target.value,
                        )
                      }
                    >
                      <MenuItem value="full">Full Weight Bearing</MenuItem>
                      <MenuItem value="partial">
                        Partial Weight Bearing
                      </MenuItem>
                      <MenuItem value="touch_down">
                        Touch Down Weight Bearing
                      </MenuItem>
                      <MenuItem value="non_weight_bearing">
                        Non-Weight Bearing
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Effusion"
                    value={formData.effusion}
                    onChange={(e) =>
                      handleInputChange('effusion', e.target.value)
                    }
                    placeholder="e.g., None, trace, 1+, 2+, 3+"
                  />
                </Grid>
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
                          handleObjectFieldChange(
                            'functional_tests',
                            test,
                            e.target.value,
                          )
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
                placeholder="Summary of knee findings and clinical reasoning..."
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
                placeholder="e.g., Reduce pain by 50%, Improve walking distance, Restore knee strength..."
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
                placeholder="Weight bearing restrictions, range of motion limits..."
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
                placeholder="X-ray, MRI findings if available..."
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
          <Typography variant="h6">Knee Assessment</Typography>
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

export default AddKnee;
