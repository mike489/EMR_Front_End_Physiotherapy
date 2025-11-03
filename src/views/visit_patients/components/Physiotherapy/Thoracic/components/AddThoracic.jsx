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

const AddThoracic = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
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

    // Pain Assessment
    pain_location: [],
    pain_level: 0,
    pain_type: '',
    pain_radiation: false,
    radiation_pattern: '',
    breathing_pain: false,
    cough_sneeze_pain: false,

    // Functional Limitations
    functional_limitations: [],
    adl_difficulties: [],
    sleep_disturbance: '',
    work_impact: '',
    breathing_difficulty: '',
    posture_related_pain: '',

    // Thoracic Range of Motion
    rom_flexion_active: '',
    rom_flexion_passive: '',
    rom_extension_active: '',
    rom_extension_passive: '',
    rom_lateral_flexion_left_active: '',
    rom_lateral_flexion_left_passive: '',
    rom_lateral_flexion_right_active: '',
    rom_lateral_flexion_right_passive: '',
    rom_rotation_left_active: '',
    rom_rotation_left_passive: '',
    rom_rotation_right_active: '',
    rom_rotation_right_passive: '',
    rom_pain_pattern: '',

    // Strength Assessment
    strength_upper_trapezius: '',
    strength_middle_trapezius: '',
    strength_lower_trapezius: '',
    strength_rhomboids: '',
    strength_serratus_anterior: '',
    strength_latissimus_dorsi: '',
    strength_erector_spinae: '',
    strength_abdominals: '',
    muscle_grading_system: 'MRC',

    // Special Tests
    special_tests: [],
    tests_results: {},

    // Palpation Findings
    tenderness_locations: [],
    muscle_spasms: [],
    trigger_points: [],
    joint_stiffness: [],
    rib_mobility: {},

    // Posture Assessment
    posture_assessment: [],
    spinal_alignment: '',
    scapular_position: '',
    rib_cage_alignment: '',
    shoulder_height: '',

    // Breathing Assessment
    breathing_pattern: '',
    chest_expansion: {},
    diaphragmatic_breathing: '',
    accessory_muscle_use: [],

    // Neurological Screening
    neurological_symptoms: [],
    dermatome_sensation: {},
    myotome_strength: {},
    reflexes: {},

    // Red Flags Screening
    red_flags: [],
    constitutional_symptoms: false,
    neurological_deficit: false,
    visceral_referral: false,

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

  // Thoracic-Specific Options
  const painLocations = [
    'T1-T4',
    'T5-T8',
    'T9-T12',
    'Interscapular',
    'Paraspinal',
    'Costovertebral',
    'Costochondral',
    'Sternum',
    'Rib Cage',
    'Anterior Chest',
    'Referred to Shoulder',
    'Referred to Arm',
    'Referred to Cervical',
    'Referred to Lumbar',
  ];

  const radiationPatterns = [
    'Intercostal Neuralgia',
    'Dermatomal Pattern',
    'Around Rib Cage',
    'To Anterior Chest',
    'To Abdomen',
    'To Upper Limb',
    'To Cervical Region',
    'To Lumbar Region',
    'Non-dermatomal Pattern',
  ];

  const functionalLimitations = [
    'Deep Breathing',
    'Coughing/Sneezing',
    'Laughing',
    'Twisting/Turning',
    'Bending Forward',
    'Bending Backward',
    'Reaching Overhead',
    'Lifting',
    'Pushing/Pulling',
    'Sitting',
    'Standing',
    'Walking',
    'Sleeping',
    'Driving',
    'Work Activities',
    'Exercise/Sports',
  ];

  const adlDifficulties = [
    'Dressing',
    'Personal Care',
    'Household Chores',
    'Cooking',
    'Cleaning',
    'Work Activities',
    'Driving/Commuting',
    'Sleeping Positions',
    'Reaching High Shelves',
    'Carrying Groceries',
  ];

  const postureAssessment = [
    'Normal Kyphosis',
    'Increased Kyphosis',
    'Decreased Kyphosis',
    'Flat Back',
    'Scoliosis',
    'Forward Head Posture',
    'Rounded Shoulders',
    'Winged Scapulae',
    'Protracted Scapulae',
    'Elevated Shoulders',
    'Anterior Pelvic Tilt',
    'Posterior Pelvic Tilt',
    'Normal Alignment',
  ];

  const breathingPatterns = [
    'Diaphragmatic',
    'Upper Chest',
    'Paradoxical',
    'Apical',
    'Asymmetrical',
    'Restricted',
    'Normal',
  ];

  const accessoryMuscles = [
    'Scalenes',
    'Sternocleidomastoid',
    'Pectoralis',
    'Upper Trapezius',
    'Intercostals',
    'Abdominals',
  ];

  const specialTests = [
    { name: 'Thoracic Spring Test', description: 'Segmental mobility' },
    { name: 'Rib Spring Test', description: 'Rib mobility' },
    {
      name: 'Costovertebral Joint Play',
      description: 'Costovertebral mobility',
    },
    { name: 'Sternal Compression Test', description: 'Sternocostal pathology' },
    {
      name: 'Rib Compression Test',
      description: 'Rib fracture/costochondritis',
    },
    { name: 'Slump Test', description: 'Neural tension' },
    {
      name: 'Upper Limb Tension Tests',
      description: 'Brachial plexus tension',
    },
    { name: 'Thoracic Outlet Tests', description: 'Thoracic outlet syndrome' },
    { name: 'Scapular Assistance Test', description: 'Scapular dyskinesis' },
    { name: 'Scapular Retraction Test', description: 'Scapular stability' },
  ];

  const tendernessLocations = [
    'T1 Spinous Process',
    'T2-T4 Spinous Processes',
    'T5-T8 Spinous Processes',
    'T9-T12 Spinous Processes',
    'Interscapular Region',
    'Paraspinal Muscles',
    'Rhomboid Area',
    'Trapezius',
    'Costovertebral Joints',
    'Costochondral Junctions',
    'Sternum',
    'Rib Angles',
    'Intercostal Spaces',
  ];

  const neurologicalSymptoms = [
    'Numbness Upper Limb',
    'Tingling Upper Limb',
    'Weakness Upper Limb',
    'Hand Clumsiness',
    'Grip Weakness',
    'Radicular Pain',
    'Electric Shock Sensation',
    'Burning Sensation',
  ];

  const thoracicDermatomes = [
    'T1: Medial Forearm',
    'T2: Medial Upper Arm',
    'T3-T4: Chest',
    'T5-T7: Lower Chest',
    'T8-T9: Upper Abdomen',
    'T10: Umbilicus',
    'T11: Lower Abdomen',
    'T12: Inguinal Region',
  ];

  const thoracicMyotomes = [
    'T1: Hand Intrinsics',
    'T2-T12: Intercostals/Abdominals',
  ];

  const reflexes = [
    'Biceps (C5-C6)',
    'Brachioradialis (C5-C6)',
    'Triceps (C7-C8)',
    'Abdominal (T8-T12)',
    'Cremasteric (L1-L2)',
  ];

  const redFlags = [
    'Traumatic Injury',
    'Severe Unremitting Pain',
    'Night Pain',
    'Unexplained Weight Loss',
    'History of Cancer',
    'Fever/Chills',
    'Night Sweats',
    'Bowel/Bladder Dysfunction',
    'Progressive Weakness',
    'Saddle Anesthesia',
    'Cardiac Symptoms',
    'Respiratory Distress',
    'Visceral Symptoms',
  ];

  const treatmentOptions = [
    'Manual Therapy',
    'Joint Mobilization',
    'Thoracic Manipulation',
    'Soft Tissue Mobilization',
    'Rib Mobilization',
    'Myofascial Release',
    'Therapeutic Exercises',
    'Postural Re-education',
    'Scapular Stabilization',
    'Core Strengthening',
    'Breathing Exercises',
    'Stretching Protocol',
    'Mckenzie Method',
    'Neural Mobilization',
    'Modalities (US, TENS, Heat/Ice)',
    'Dry Needling',
    'Taping Techniques',
    'Activity Modification',
    'Workplace Ergonomics',
    'Home Exercise Program',
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
                placeholder="Describe the main thoracic problem..."
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
                  <MenuItem value="postural">Postural</MenuItem>
                  <MenuItem value="repetitive">Repetitive Strain</MenuItem>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mechanism of Injury"
                value={formData.mechanism_of_injury}
                onChange={(e) =>
                  handleInputChange('mechanism_of_injury', e.target.value)
                }
                placeholder="Describe how the injury occurred (lifting, twisting, fall, poor posture, etc.)..."
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
                placeholder="e.g., First episode, recurrent issue"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.breathing_pain}
                    onChange={(e) =>
                      handleInputChange('breathing_pain', e.target.checked)
                    }
                  />
                }
                label="Pain with Breathing"
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
                    value="stabbing"
                    control={<Radio />}
                    label="Stabbing"
                  />
                  <FormControlLabel
                    value="tightness"
                    control={<Radio />}
                    label="Tightness"
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
                    checked={formData.cough_sneeze_pain}
                    onChange={(e) =>
                      handleInputChange('cough_sneeze_pain', e.target.checked)
                    }
                  />
                }
                label="Pain with Cough/Sneeze"
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sleep Disturbance"
                value={formData.sleep_disturbance}
                onChange={(e) =>
                  handleInputChange('sleep_disturbance', e.target.value)
                }
                placeholder="Describe sleep issues related to thoracic pain..."
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
                label="Breathing Difficulty"
                value={formData.breathing_difficulty}
                onChange={(e) =>
                  handleInputChange('breathing_difficulty', e.target.value)
                }
                placeholder="Describe any breathing issues..."
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Posture-Related Pain"
                value={formData.posture_related_pain}
                onChange={(e) =>
                  handleInputChange('posture_related_pain', e.target.value)
                }
                placeholder="Describe posture-related symptoms..."
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
                Thoracic Range of Motion (Degrees)
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
                  {
                    label: 'Lateral Flexion Left Active',
                    field: 'rom_lateral_flexion_left_active',
                  },
                  {
                    label: 'Lateral Flexion Left Passive',
                    field: 'rom_lateral_flexion_left_passive',
                  },
                  {
                    label: 'Lateral Flexion Right Active',
                    field: 'rom_lateral_flexion_right_active',
                  },
                  {
                    label: 'Lateral Flexion Right Passive',
                    field: 'rom_lateral_flexion_right_passive',
                  },
                  {
                    label: 'Rotation Left Active',
                    field: 'rom_rotation_left_active',
                  },
                  {
                    label: 'Rotation Left Passive',
                    field: 'rom_rotation_left_passive',
                  },
                  {
                    label: 'Rotation Right Active',
                    field: 'rom_rotation_right_active',
                  },
                  {
                    label: 'Rotation Right Passive',
                    field: 'rom_rotation_right_passive',
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
                  {
                    label: 'Upper Trapezius',
                    field: 'strength_upper_trapezius',
                  },
                  {
                    label: 'Middle Trapezius',
                    field: 'strength_middle_trapezius',
                  },
                  {
                    label: 'Lower Trapezius',
                    field: 'strength_lower_trapezius',
                  },
                  { label: 'Rhomboids', field: 'strength_rhomboids' },
                  {
                    label: 'Serratus Anterior',
                    field: 'strength_serratus_anterior',
                  },
                  {
                    label: 'Latissimus Dorsi',
                    field: 'strength_latissimus_dorsi',
                  },
                  { label: 'Erector Spinae', field: 'strength_erector_spinae' },
                  { label: 'Abdominals', field: 'strength_abdominals' },
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
                Posture Assessment
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
              <Typography variant="h6" gutterBottom>
                Breathing Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Breathing Pattern</InputLabel>
                    <Select
                      value={formData.breathing_pattern}
                      label="Breathing Pattern"
                      onChange={(e) =>
                        handleInputChange('breathing_pattern', e.target.value)
                      }
                    >
                      {breathingPatterns.map((pattern) => (
                        <MenuItem key={pattern} value={pattern}>
                          {pattern}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Diaphragmatic Breathing</InputLabel>
                    <Select
                      value={formData.diaphragmatic_breathing}
                      label="Diaphragmatic Breathing"
                      onChange={(e) =>
                        handleInputChange(
                          'diaphragmatic_breathing',
                          e.target.value,
                        )
                      }
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="impaired">Impaired</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="paradoxical">Paradoxical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Accessory Muscle Use
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {accessoryMuscles.map((muscle) => (
                      <Chip
                        key={muscle}
                        label={muscle}
                        onClick={() =>
                          handleArrayToggle('accessory_muscle_use', muscle)
                        }
                        color={
                          formData.accessory_muscle_use.includes(muscle)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          formData.accessory_muscle_use.includes(muscle)
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
                Chest Expansion Measurement (cm)
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Axillary Level', field: 'axillary' },
                  { label: 'Nipple Level', field: 'nipple' },
                  { label: 'Xiphoid Level', field: 'xiphoid' },
                ].map((level) => (
                  <Grid item xs={12} sm={4} key={level.field}>
                    <TextField
                      fullWidth
                      label={level.label}
                      type="number"
                      value={formData.chest_expansion[level.field] || ''}
                      onChange={(e) =>
                        handleObjectFieldChange(
                          'chest_expansion',
                          level.field,
                          e.target.value,
                        )
                      }
                      InputProps={{ endAdornment: 'cm' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Rib Mobility Assessment
              </Typography>
              <Grid container spacing={2}>
                {[
                  'Upper Ribs (1-5)',
                  'Middle Ribs (6-10)',
                  'Lower Ribs (11-12)',
                ].map((ribGroup) => (
                  <Grid item xs={12} sm={4} key={ribGroup}>
                    <FormControl fullWidth>
                      <InputLabel>{ribGroup}</InputLabel>
                      <Select
                        value={formData.rib_mobility[ribGroup] || ''}
                        label={ribGroup}
                        onChange={(e) =>
                          handleObjectFieldChange(
                            'rib_mobility',
                            ribGroup,
                            e.target.value,
                          )
                        }
                      >
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="hypomobile">Hypomobile</MenuItem>
                        <MenuItem value="hypermobile">Hypermobile</MenuItem>
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
                Neurological Screening
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dermatome Sensation
                  </Typography>
                  {thoracicDermatomes.map((dermatome) => (
                    <FormControl
                      key={dermatome}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      <InputLabel>{dermatome}</InputLabel>
                      <Select
                        value={formData.dermatome_sensation[dermatome] || ''}
                        label={dermatome}
                        onChange={(e) =>
                          handleObjectFieldChange(
                            'dermatome_sensation',
                            dermatome,
                            e.target.value,
                          )
                        }
                      >
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="diminished">Diminished</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                        <MenuItem value="hyperesthetic">Hyperesthetic</MenuItem>
                      </Select>
                    </FormControl>
                  ))}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Reflexes
                  </Typography>
                  {reflexes.map((reflex) => (
                    <FormControl
                      key={reflex}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      <InputLabel>{reflex}</InputLabel>
                      <Select
                        value={formData.reflexes[reflex] || ''}
                        label={reflex}
                        onChange={(e) =>
                          handleObjectFieldChange(
                            'reflexes',
                            reflex,
                            e.target.value,
                          )
                        }
                      >
                        <MenuItem value="absent">Absent (0)</MenuItem>
                        <MenuItem value="diminished">Diminished (+1)</MenuItem>
                        <MenuItem value="normal">Normal (+2)</MenuItem>
                        <MenuItem value="brisk">Brisk (+3)</MenuItem>
                        <MenuItem value="clonus">Clonus (+4)</MenuItem>
                      </Select>
                    </FormControl>
                  ))}
                </Grid>
              </Grid>
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
                placeholder="Summary of thoracic findings and clinical reasoning..."
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
                placeholder="e.g., Reduce pain by 50%, Improve posture, Increase thoracic mobility..."
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
                placeholder="Activity restrictions, precautions for manipulation..."
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
          <Typography variant="h6">Thoracic Assessment</Typography>
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

export default AddThoracic;
