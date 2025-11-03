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

const AddFoot = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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
    dominant_foot: 'right',

    // Pain Assessment
    pain_location: [],
    pain_level: 0,
    pain_type: '',
    pain_radiation: false,
    radiation_pattern: '',
    weight_bearing_pain: '',
    night_pain: false,

    // Functional Limitations
    functional_limitations: [],
    adl_difficulties: [],
    sleep_disturbance: '',
    work_impact: '',
    sports_impact: '',
    walking_tolerance: '',
    standing_tolerance: '',

    // Foot Range of Motion
    rom_ankle_dorsiflexion_active: '',
    rom_ankle_dorsiflexion_passive: '',
    rom_ankle_plantarflexion_active: '',
    rom_ankle_plantarflexion_passive: '',
    rom_inversion_active: '',
    rom_inversion_passive: '',
    rom_eversion_active: '',
    rom_eversion_passive: '',
    rom_1st_mtp_dorsiflexion: '',
    rom_1st_mtp_plantarflexion: '',
    rom_toe_extension: '',
    rom_toe_flexion: '',
    rom_pain_pattern: '',

    // Strength Assessment
    strength_ankle_dorsiflexion: '',
    strength_ankle_plantarflexion: '',
    strength_ankle_inversion: '',
    strength_ankle_eversion: '',
    strength_toe_flexion: '',
    strength_toe_extension: '',
    strength_intrinsics: '',
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

    // Structural Assessment
    foot_type: '',
    arch_height: '',
    deformities: [],
    calluses: [],
    skin_conditions: [],
    swelling: '',
    bruising: '',

    // Gait & Biomechanics
    gait_analysis: [],
    foot_progression_angle: '',
    weight_bearing_pattern: '',
    dynamic_analysis: {},

    // Neurological Assessment
    neurological_symptoms: [],
    sensation: {},
    reflexes: {},
    motor_function: {},

    // Vascular Assessment
    vascular_status: {},
    pulses: {},
    skin_temperature: '',
    edema: '',

    // Footwear Assessment
    footwear_type: '',
    footwear_issues: [],
    orthotics_use: '',
    shoe_wear_pattern: '',

    // Red Flags Screening
    red_flags: [],
    neurological_deficit: false,
    vascular_compromise: false,
    infection_signs: false,

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

  // Foot-Specific Options
  const painLocations = [
    'Medial Ankle',
    'Lateral Ankle',
    'Anterior Ankle',
    'Posterior Ankle',
    'Achilles Tendon',
    'Plantar Heel',
    'Medial Arch',
    'Lateral Arch',
    'Longitudinal Arch',
    'Transverse Arch',
    '1st MTP Joint',
    'Lesser MTP Joints',
    'Metatarsal Heads',
    'Plantar Forefoot',
    'Dorsal Foot',
    'Toes',
    'Sesamoids',
    'Sinus Tarsi',
    'Peroneal Tendons',
    'Posterior Tibial Tendon',
  ];

  const radiationPatterns = [
    'To Toes',
    'To Heel',
    'Up Leg (Anterior)',
    'Up Leg (Posterior)',
    'Up Leg (Lateral)',
    'Up Leg (Medial)',
    'Dermatomal Pattern',
    'Non-dermatomal Pattern',
  ];

  const functionalLimitations = [
    'Walking',
    'Running',
    'Jumping',
    'Stair Climbing',
    'Standing',
    'Squatting',
    'Kneeling',
    'Sports Activities',
    'Work Activities',
    'Household Chores',
    'Driving',
    'Putting on Shoes',
    'Walking on Uneven Surfaces',
    'Walking Barefoot',
    'Toe Walking',
    'Heel Walking',
  ];

  const adlDifficulties = [
    'Walking Distance',
    'Standing Duration',
    'Putting on Shoes/Socks',
    'Personal Hygiene',
    'Shopping',
    'Housework',
    'Work Requirements',
    'Sports Participation',
    'Sleeping Comfortably',
    'Driving Comfort',
  ];

  const footTypes = [
    'Pes Planus (Flat Foot)',
    'Pes Cavus (High Arch)',
    'Neutral Foot',
    'Pronated Foot',
    'Supinated Foot',
    'Planovalgus',
    'Cavovarus',
  ];

  const archHeights = [
    'Very High',
    'High',
    'Normal',
    'Low',
    'Very Low',
    'Collapsed',
  ];

  const deformities = [
    'Hallux Valgus (Bunion)',
    'Hallux Rigidus',
    'Hammer Toes',
    'Claw Toes',
    'Mallet Toes',
    "Tailor's Bunion",
    "Morton's Toe",
    'Pes Planus',
    'Pes Cavus',
    'Forefoot Abductus',
    'Forefoot Adductus',
    'Rearfoot Varus',
    'Rearfoot Valgus',
    'Ankle Equinus',
  ];

  const callusLocations = [
    'Plantar 1st MTP',
    'Plantar 2nd MTP',
    'Plantar 3rd MTP',
    'Plantar 4th MTP',
    'Plantar 5th MTP',
    'Plantar Heel',
    'Dorsal Toes',
    'Lateral 5th MTP',
    'Medial 1st MTP',
  ];

  const skinConditions = [
    'Corns (Hard)',
    'Corns (Soft)',
    'Calluses',
    'Blisters',
    'Ulcers',
    'Dry Skin',
    'Fissures',
    'Warts',
    'Fungal Infection',
    'Normal Skin',
  ];

  const gaitAnalysis = [
    'Antalgic Gait',
    'Equinus Gait',
    'Foot Drop Gait',
    'Excessive Pronation',
    'Excessive Supination',
    'Out-toeing',
    'In-toeing',
    'Short Step Length',
    'Reduced Push-off',
    'Abnormal Heel Strike',
    'Limp',
    'Normal Gait',
  ];

  const neurologicalSymptoms = [
    'Numbness Foot',
    'Tingling Foot',
    'Burning Sensation',
    'Electric Shocks',
    'Weakness Foot',
    'Foot Drop',
    'Toe Clawing',
    'Loss of Balance',
    'Altered Sensation',
  ];

  const specialTests = [
    { name: 'Thompson Test', description: 'Achilles tendon rupture' },
    { name: 'Squeeze Test', description: 'Syndesmosis injury' },
    {
      name: 'Anterior Drawer Test',
      description: 'Anterior talofibular ligament',
    },
    { name: 'Talar Tilt Test', description: 'Calcaneofibular ligament' },
    { name: 'Windlass Test', description: 'Plantar fasciitis' },
    { name: "Tinel's Sign", description: 'Tarsal tunnel syndrome' },
    { name: "Morton's Test", description: "Morton's neuroma" },
    { name: 'Feiss Line', description: 'Arch height assessment' },
    { name: "Jack's Test", description: 'First ray mobility' },
    { name: 'Coleman Block Test', description: 'Hindfoot flexibility' },
    {
      name: 'Silfverskiöld Test',
      description: 'Gastrocnemius vs soleus tightness',
    },
    { name: 'Hubscher Maneuver', description: 'Windlass mechanism' },
  ];

  const tendernessLocations = [
    'Achilles Tendon',
    'Plantar Fascia Origin',
    'Medial Malleolus',
    'Lateral Malleolus',
    'Sinus Tarsi',
    'Peroneal Tendons',
    'Posterior Tibial Tendon',
    'Anterior Tibial Tendon',
    '1st MTP Joint',
    'Lesser MTP Joints',
    'Metatarsal Heads',
    'Navicular Tuberosity',
    'Base of 5th Metatarsal',
    'Calcaneal Tuberosity',
    'Medial Arch',
    'Lateral Arch',
  ];

  const footwearTypes = [
    'Athletic Shoes',
    'Dress Shoes',
    'Sandals',
    'Boots',
    'High Heels',
    'Flats',
    'Custom Orthotics',
    'Work Boots',
    'Minimalist Shoes',
    'Barefoot',
  ];

  const footwearIssues = [
    'Poor Fit',
    'Worn Out Sole',
    'Lack of Arch Support',
    'Narrow Toe Box',
    'High Heels',
    'Poor Cushioning',
    'Improper Sizing',
    'No Heel Counter',
    'Flexible Sole',
    'Rigid Sole',
  ];

  const redFlags = [
    'Unable to Bear Weight',
    'Severe Trauma',
    'Open Wound',
    'Signs of Infection',
    'Severe Swelling',
    'Loss of Pulse',
    'Cold Foot',
    'Numbness/Loss of Sensation',
    'Progressive Weakness',
    'Fever/Chills',
    'History of Diabetes',
    'History of Vascular Disease',
  ];

  const treatmentOptions = [
    'Manual Therapy',
    'Joint Mobilization',
    'Soft Tissue Mobilization',
    'Strengthening Exercises',
    'Stretching Protocol',
    'Balance Training',
    'Gait Training',
    'Modalities (US, TENS, Heat/Ice)',
    'Dry Needling',
    'Taping Techniques',
    'Orthotics Prescription',
    'Footwear Education',
    'Activity Modification',
    'Home Exercise Program',
    'Patient Education',
    'Wound Care',
    'Callus/Corn Debridement',
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
                placeholder="Describe the main foot problem..."
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
                <InputLabel>Dominant Foot</InputLabel>
                <Select
                  value={formData.dominant_foot}
                  label="Dominant Foot"
                  onChange={(e) =>
                    handleInputChange('dominant_foot', e.target.value)
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
                placeholder="Describe how the injury occurred (twisting, fall, overuse, etc.)..."
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sleep Disturbance"
                value={formData.sleep_disturbance}
                onChange={(e) =>
                  handleInputChange('sleep_disturbance', e.target.value)
                }
                placeholder="Describe sleep issues related to foot pain..."
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
                Foot Range of Motion (Degrees)
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    label: 'Ankle Dorsiflexion Active',
                    field: 'rom_ankle_dorsiflexion_active',
                  },
                  {
                    label: 'Ankle Dorsiflexion Passive',
                    field: 'rom_ankle_dorsiflexion_passive',
                  },
                  {
                    label: 'Ankle Plantarflexion Active',
                    field: 'rom_ankle_plantarflexion_active',
                  },
                  {
                    label: 'Ankle Plantarflexion Passive',
                    field: 'rom_ankle_plantarflexion_passive',
                  },
                  { label: 'Inversion Active', field: 'rom_inversion_active' },
                  {
                    label: 'Inversion Passive',
                    field: 'rom_inversion_passive',
                  },
                  { label: 'Eversion Active', field: 'rom_eversion_active' },
                  { label: 'Eversion Passive', field: 'rom_eversion_passive' },
                  {
                    label: '1st MTP Dorsiflexion',
                    field: 'rom_1st_mtp_dorsiflexion',
                  },
                  {
                    label: '1st MTP Plantarflexion',
                    field: 'rom_1st_mtp_plantarflexion',
                  },
                  { label: 'Toe Extension', field: 'rom_toe_extension' },
                  { label: 'Toe Flexion', field: 'rom_toe_flexion' },
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
                  {
                    label: 'Ankle Dorsiflexion',
                    field: 'strength_ankle_dorsiflexion',
                  },
                  {
                    label: 'Ankle Plantarflexion',
                    field: 'strength_ankle_plantarflexion',
                  },
                  {
                    label: 'Ankle Inversion',
                    field: 'strength_ankle_inversion',
                  },
                  { label: 'Ankle Eversion', field: 'strength_ankle_eversion' },
                  { label: 'Toe Flexion', field: 'strength_toe_flexion' },
                  { label: 'Toe Extension', field: 'strength_toe_extension' },
                  { label: 'Foot Intrinsics', field: 'strength_intrinsics' },
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
                    <InputLabel>Foot Type</InputLabel>
                    <Select
                      value={formData.foot_type}
                      label="Foot Type"
                      onChange={(e) =>
                        handleInputChange('foot_type', e.target.value)
                      }
                    >
                      {footTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Arch Height</InputLabel>
                    <Select
                      value={formData.arch_height}
                      label="Arch Height"
                      onChange={(e) =>
                        handleInputChange('arch_height', e.target.value)
                      }
                    >
                      {archHeights.map((height) => (
                        <MenuItem key={height} value={height}>
                          {height}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    Callus Locations
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {callusLocations.map((location) => (
                      <Chip
                        key={location}
                        label={location}
                        onClick={() => handleArrayToggle('calluses', location)}
                        color={
                          formData.calluses.includes(location)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.calluses.includes(location)
                            ? 'filled'
                            : 'outlined'
                        }
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skin Conditions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skinConditions.map((condition) => (
                      <Chip
                        key={condition}
                        label={condition}
                        onClick={() =>
                          handleArrayToggle('skin_conditions', condition)
                        }
                        color={
                          formData.skin_conditions.includes(condition)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.skin_conditions.includes(condition)
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
                  <TextField
                    fullWidth
                    label="Foot Progression Angle"
                    value={formData.foot_progression_angle}
                    onChange={(e) =>
                      handleInputChange(
                        'foot_progression_angle',
                        e.target.value,
                      )
                    }
                    placeholder="e.g., 10° out-toeing, neutral"
                    InputProps={{ endAdornment: '°' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Weight Bearing Pattern</InputLabel>
                    <Select
                      value={formData.weight_bearing_pattern}
                      label="Weight Bearing Pattern"
                      onChange={(e) =>
                        handleInputChange(
                          'weight_bearing_pattern',
                          e.target.value,
                        )
                      }
                    >
                      <MenuItem value="neutral">Neutral</MenuItem>
                      <MenuItem value="pronated">Pronated</MenuItem>
                      <MenuItem value="supinated">Supinated</MenuItem>
                      <MenuItem value="lateral">Lateral Border</MenuItem>
                      <MenuItem value="medial">Medial Border</MenuItem>
                      <MenuItem value="forefoot">Forefoot</MenuItem>
                      <MenuItem value="rearfoot">Rearfoot</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Footwear Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Footwear Type</InputLabel>
                    <Select
                      value={formData.footwear_type}
                      label="Footwear Type"
                      onChange={(e) =>
                        handleInputChange('footwear_type', e.target.value)
                      }
                    >
                      {footwearTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Orthotics Use"
                    value={formData.orthotics_use}
                    onChange={(e) =>
                      handleInputChange('orthotics_use', e.target.value)
                    }
                    placeholder="e.g., Custom orthotics, over-the-counter"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Footwear Issues
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {footwearIssues.map((issue) => (
                      <Chip
                        key={issue}
                        label={issue}
                        onClick={() =>
                          handleArrayToggle('footwear_issues', issue)
                        }
                        color={
                          formData.footwear_issues.includes(issue)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.footwear_issues.includes(issue)
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
                placeholder="Summary of foot findings and clinical reasoning..."
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
                placeholder="e.g., Reduce pain by 50%, Improve walking distance, Restore foot strength..."
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
                placeholder="Weight bearing restrictions, footwear recommendations..."
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
          <Typography variant="h6">Foot Assessment</Typography>
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

export default AddFoot;
