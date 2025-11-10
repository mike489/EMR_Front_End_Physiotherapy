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

const AddNeurologicals = ({ open, isSubmitting, onClose, onSubmit, visit }) => {
  const [formData, setFormData] = useState({
    complaints: '',
    pmh: '',
    hpi: '',
    red_flags: [],
    red_flags_remark: '',
    aggravating_factors: '',
    easing_factors: '',
    neurological_symptoms: [],
    symptom_triggers: [],
    cognitive_status: '',
    radiation_location: '',
    functional_limitations_adl: [],
    functional_limitations_adl_remark: '',

    pain_location: [],

    // Neurological-specific fields
    cranial_nerve_assessment: [],
    cranial_nerve_assessment_remark: '',
    sensory_assessment: [],
    sensory_assessment_remark: '',
    neurological_assessment: [],
    neurological_assessment_remark: '',

    // Special tests
    special_tests: [],

    // Palpation
    palpations: [],
    palpations_remark: '',

    // Biomechanical
    biomechanical: [],
    biomechanical_remark: '',

    // Observation
    observation: [],
    observation_remark: '',

    // Clinical and treatment
    clinical_impression: [],
    clinical_impression_remark: '',
    treatment_plans: [],
    treatment_plans_remark: '',

    precautions_and_contraindications: '',

    // Strength assessment fields (NEW)
    strength_elbow_extension_right: '',
    strength_elbow_extension_left: '',
    strength_elbow_flexion_right: '',
    strength_elbow_flexion_left: '',
    strength_grip_right: '',
    strength_grip_left: '',
    strength_wrist_extension_right: '',
    strength_wrist_extension_left: '',
    strength_wrist_flexion_right: '',
    strength_wrist_flexion_left: '',

    // Shoulder and hip strength fields (NEW)
    shoulder_flexors_right: '',
    shoulder_flexors_left: '',
    shoulder_abductors_right: '',
    shoulder_abductors_left: '',
    shoulder_ext_rotation_right: '',
    shoulder_ext_rotation_left: '',
    shoulder_int_rotation_right: '',
    shoulder_int_rotation_left: '',
    shoulder_extension_right: '',
    shoulder_extension_left: '',
    shoulder_elevation_right: '',
    shoulder_elevation_left: '',
    shoulder_retraction_right: '',
    shoulder_retraction_left: '',
    shoulder_depression_right: '',
    shoulder_depression_left: '',
    shoulder_protraction_right: '',
    shoulder_protraction_left: '',
    hip_adductors_right: '',
    hip_adductors_left: '',
    knee_flexors_right: '',
    knee_flexors_left: '',
    knee_extensors_right: '',
    knee_extensors_left: '',
    hip_extensors_right: '',
    hip_extensors_left: '',
    hip_flexors_right: '',
    hip_flexors_left: '',
    hip_abductors_right: '',
    hip_abductors_left: '',
    shoulder_remark: '',

    short_term_goal: '',

    visit_id: visit?.visit_id || '',
  });

  const [showRemarks, setShowRemarks] = useState({
    redFlags: false,
    neurologicalSymptoms: false,
    functionalLimitations: false,
    observations: false,
    assessmentPlan: false,
    treatmentPlan: false,
  });

  // Neurological-specific symptoms
  const neurologicalSymptoms = [
    'Headache',
    'Dizziness/Vertigo',
    'Numbness',
    'Tingling/Paresthesia',
    'Weakness',
    'Coordination Problems',
    'Balance Issues',
    'Vision Changes',
    'Hearing Changes',
    'Speech Difficulties',
    'Memory Problems',
    'Cognitive Changes',
    'Tremor',
    'Seizures',
    'Loss of Consciousness',
  ];

  // Symptom triggers
  const symptomTriggers = [
    'Stress',
    'Fatigue',
    'Physical Activity',
    'Postural Changes',
    'Temperature Changes',
    'Bright Lights',
    'Loud Noises',
    'Certain Movements',
    'Time of Day',
    'Diet/Fasting',
    'Medication Changes',
  ];

  // Cognitive status options
  const cognitiveStatusOptions = [
    'Alert and Oriented x4',
    'Mild Cognitive Impairment',
    'Moderate Cognitive Issues',
    'Severe Cognitive Deficits',
    'Fluctuating Consciousness',
    'Disoriented',
    'Confused',
  ];

  const functionalLimitations = [
    'Walking/Mobility',
    'Balance',
    'Fine Motor Skills',
    'Coordination',
    'Memory',
    'Concentration',
    'Speech/Communication',
    'Vision',
    'Hearing',
    'Self Care',
    'Work Tasks',
    'Driving',
    'Social Activities',
  ];

  const redFlags = [
    'Sudden Severe Headache',
    'Loss of Consciousness',
    'Seizure',
    'Sudden Weakness',
    'Sudden Vision Loss',
    'Sudden Speech Difficulty',
    'Confusion/Disorientation',
    'Fever with Neurological Symptoms',
    'Recent Head Trauma',
    'Worsening Symptoms',
    'Bowel/Bladder Incontinence',
  ];

  // Neurological-specific special tests
  const specialTests = [
    {
      name: 'Romberg Test',
      description: 'Proprioception and balance assessment',
    },
    {
      name: 'Finger-to-Nose Test',
      description: 'Cerebellar function and coordination',
    },
    {
      name: 'Heel-to-Shin Test',
      description: 'Lower extremity coordination',
    },
    {
      name: 'Rapid Alternating Movements',
      description: 'Motor coordination assessment',
    },
    {
      name: 'Gait Assessment',
      description: 'Walking pattern and balance evaluation',
    },
  ];

  // Cranial nerve assessment
  const cranialNerveOptions = [
    'I - Olfactory (Smell)',
    'II - Optic (Vision)',
    'III - Oculomotor (Eye Movement)',
    'IV - Trochlear (Eye Movement)',
    'V - Trigeminal (Facial Sensation)',
    'VI - Abducens (Eye Movement)',
    'VII - Facial (Facial Movement)',
    'VIII - Vestibulocochlear (Hearing/Balance)',
    'IX - Glossopharyngeal (Swallowing)',
    'X - Vagus (Swallowing/Speech)',
    'XI - Accessory (Shoulder Movement)',
    'XII - Hypoglossal (Tongue Movement)',
  ];

  // Sensory assessment
  const sensoryAssessmentOptions = [
    'Light Touch',
    'Pinprick',
    'Temperature',
    'Vibration',
    'Proprioception',
    'Two-point Discrimination',
    'Stereognosis',
    'Graphesthesia',
  ];

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

  // Neurological assessment findings
  const neurologicalAssessmentOptions = [
    'Hyperreflexia',
    'Hyporeflexia',
    'Clonus',
    'Babinski Sign',
    'Hoffmann Sign',
    'Muscle Fasciculations',
    'Muscle Atrophy',
    'Spasticity',
    'Rigidity',
    'Tremor',
  ];

  // Neurological-specific assessment options
  const AssessmentOptions = [
    'Peripheral Neuropathy',
    'Radiculopathy',
    'Myelopathy',
    'Cerebrovascular Accident (CVA)',
    'Transient Ischemic Attack (TIA)',
    'Multiple Sclerosis',
    "Parkinson's Disease",
    'Peripheral Nerve Injury',
    'Carpal Tunnel Syndrome',
    'Migraine Headache',
    'Tension Headache',
    'Vertigo/Dizziness',
    'Cognitive Disorder',
  ];

  const treatmentOptions = [
    'Neuromuscular Re-education',
    'Balance Training',
    'Gait Training',
    'Coordination Exercises',
    'Sensory Re-education',
    'Cognitive Rehabilitation',
    'Vestibular Rehabilitation',
    'Therapeutic Exercises',
    'Manual Therapy',
    'Pain Management',
    'Education and Counseling',
  ];

  const clinicalImpressionOptions = [
    'Upper Motor Neuron Signs',
    'Lower Motor Neuron Signs',
    'Sensory Deficits',
    'Motor Deficits',
    'Coordination Impairment',
    'Balance Deficits',
    'Cognitive Impairment',
    'Gait Abnormalities',
    'Reflex Abnormalities',
    'Functional instability of lumbopelvic region',
    'Weakness or Paralysis',
    'Loss of sensation',
    'Muscle Tone Abnormalities',
    'Movement Deficits: Difficulty with coordination, balance, or specific movements like reaching, grasping, or walking',
    'Abnormal Posture',
    'Involuntary Movements: tics, tremors, or other abnormal movements that may be associated with neurological conditions',
    'Gait Abnormalities',
  ];

  const tendernessOptions = [
    'Not Tender',
    'Mildly Tender',
    'Moderately Tender',
    'Severely Tender',
  ];

  // Neurological-specific palpation tests
  const palpationTests = [
    { key: 'cervical_spine', label: 'Cervical Spine' },
    { key: 'trapezius', label: 'Trapezius' },
    { key: 'scalenes', label: 'Scalenes' },
    { key: 'supraspinatus', label: 'Supraspinatus' },
    { key: 'brachial_plexus', label: 'Brachial Plexus Area' },
    { key: 'carpal_tunnel', label: 'Carpal Tunnel' },
    { key: 'sciatic_nerve', label: 'Sciatic Nerve Pathway' },
    { key: 'peroneal_nerve', label: 'Peroneal Nerve' },
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
          <Typography variant="h6">Neurological Assessment</Typography>
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
        {/* Observations Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {[
              'Abnormal Posture',
              'Muscle Atrophy',
              'Muscle Fasciculations',
              'Tremor at Rest',
              'Tremor with Movement',
              'Involuntary Movements',
              'Abnormal Gait Pattern',
              'Balance Impairment',
              'Asymmetrical Movement',
              'Decreased Coordination',
              'Muscle Spasticity',
              'Muscle Rigidity',
              'Joint Contractures',
              'Foot Drop',
              'Waddling Gait',
              'Scissoring Gait',
              'Shuffling Gait',
              'Antalgic Gait',
              'Skin Changes',
              'Swelling/Edema',
              'Muscle Guarding',
              'Facial Asymmetry',
              'Ptosis (Drooping Eyelid)',
              'Speech Difficulties',
              'Cognitive Changes',
              'Sensory Neglect',
              'Visual Tracking Issues',
              'Nystagmus',
              'Poor Endurance',
              'Fatigue with Activity',
            ].map((observation) => (
              <Chip
                key={observation}
                label={observation}
                onClick={() => handleArrayToggle('observation', observation)}
                color={
                  formData.observation.includes(observation)
                    ? 'primary'
                    : 'default'
                }
                variant={
                  formData.observation.includes(observation)
                    ? 'filled'
                    : 'outlined'
                }
                size="small"
              />
            ))}
          </Box>
          <Collapse in={showRemarks.observations}>
            <TextField
              fullWidth
              label="Observation Remark"
              value={formData.observation_remark}
              onChange={(e) =>
                handleInputChange('observation_remark', e.target.value)
              }
              multiline
              rows={2}
              sx={{ mb: 2 }}
              placeholder="Additional observations or details..."
            />
          </Collapse>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Sensation Assessment */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
            Sensation Assessment
          </Typography>

          {/* Sensation Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                    Sensation
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Right
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Left
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Light Touch */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      Light Touch
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_light_touch_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_light_touch_right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                        <MenuItem value="Hyperesthetic">Hyperesthetic</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_light_touch_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_light_touch_left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                        <MenuItem value="Hyperesthetic">Hyperesthetic</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                {/* Deep Sensation */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      Deep
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_deep_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_deep_right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_deep_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_deep_left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>

                {/* Proprioception */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      Proprioception
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_proprioception_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_proprioception_right',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={formData.sensation_proprioception_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'sensation_proprioception_left',
                            e.target.value,
                          )
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value="Intact">Intact</MenuItem>
                        <MenuItem value="Impaired">Impaired</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* Additional Sensory Modalities */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Additional Sensory Modalities
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {[
              'Pinprick',
              'Temperature',
              'Vibration',
              'Two-point Discrimination',
            ].map((modality) => (
              <Chip
                key={modality}
                label={modality}
                onClick={() =>
                  handleArrayToggle('sensory_assessment', modality)
                }
                color={
                  formData.sensory_assessment.includes(modality)
                    ? 'primary'
                    : 'default'
                }
                variant={
                  formData.sensory_assessment.includes(modality)
                    ? 'filled'
                    : 'outlined'
                }
                size="small"
              />
            ))}
          </Box>

          {/* General Sensory Remark */}
          <TextField
            fullWidth
            label="Sensory Assessment Remark"
            value={formData.sensory_assessment_remark}
            onChange={(e) =>
              handleInputChange('sensory_assessment_remark', e.target.value)
            }
            multiline
            rows={2}
            placeholder="Overall sensory findings, dermatomal patterns, or additional observations..."
          />
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Neurological Symptoms Assessment */}
        <Typography variant="h5" gutterBottom>
          Neurological Symptoms
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
              <Typography variant="subtitle2">Neurological Symptoms</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => toggleRemark('neurologicalSymptoms')}
                size="small"
                variant="outlined"
              >
                Other
              </Button>
            </Box>
            <FormGroup row sx={{ flexWrap: 'wrap' }}>
              {neurologicalSymptoms.map((symptom) => (
                <FormControlLabel
                  key={symptom}
                  control={
                    <Checkbox
                      checked={formData.neurological_symptoms.includes(symptom)}
                      onChange={() =>
                        handleArrayToggle('neurological_symptoms', symptom)
                      }
                    />
                  }
                  label={symptom}
                />
              ))}
            </FormGroup>
            <Collapse in={showRemarks.neurologicalSymptoms}>
              <TextField
                fullWidth
                label="Neurological Symptoms Remark"
                value={formData.neurological_symptoms_remark}
                onChange={(e) =>
                  handleInputChange(
                    'neurological_symptoms_remark',
                    e.target.value,
                  )
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Symptom Triggers
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {symptomTriggers.map((trigger) => (
                <Chip
                  key={trigger}
                  label={trigger}
                  onClick={() => handleArrayToggle('symptom_triggers', trigger)}
                  color={
                    formData.symptom_triggers.includes(trigger)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.symptom_triggers.includes(trigger)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cognitive Status</InputLabel>
              <Select
                value={formData.cognitive_status}
                onChange={(e) =>
                  handleInputChange('cognitive_status', e.target.value)
                }
                label="Cognitive Status"
              >
                <MenuItem value="">
                  <em>-Select-</em>
                </MenuItem>
                {cognitiveStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
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
              placeholder="Describe radiation pattern of symptoms..."
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Neurological Examination */}
        <Typography variant="h5" gutterBottom>
          Neurological Examination
        </Typography>
        <Grid container spacing={2}>
          {/* Cranial Nerve Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Cranial Nerve Assessment
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {cranialNerveOptions.map((nerve) => (
                <Chip
                  key={nerve}
                  label={nerve}
                  onClick={() =>
                    handleArrayToggle('cranial_nerve_assessment', nerve)
                  }
                  color={
                    formData.cranial_nerve_assessment.includes(nerve)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.cranial_nerve_assessment.includes(nerve)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Cranial Nerve Assessment Remark"
              value={formData.cranial_nerve_assessment_remark}
              onChange={(e) =>
                handleInputChange(
                  'cranial_nerve_assessment_remark',
                  e.target.value,
                )
              }
              multiline
              rows={2}
            />
          </Grid>

          {/* Palpation Assessment */}
          {/* <Grid item xs={12}>
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
          </Grid> */}

          {/* Strength Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Strength
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Strength</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Right
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Left
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Elbow extension
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_elbow_extension_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_elbow_extension_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_elbow_extension_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_elbow_extension_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Elbow flex.
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_elbow_flexion_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_elbow_flexion_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_elbow_flexion_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_elbow_flexion_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Grip strength
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_grip_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_grip_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_grip_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_grip_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Wrist ext.
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_wrist_extension_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_extension_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_wrist_extension_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_extension_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Wrist flex.
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_wrist_flexion_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_flexion_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.strength_wrist_flexion_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'strength_wrist_flexion_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Shoulder Strength Assessment */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Shoulder
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Shoulder</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Right
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Left
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Flexors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_flexors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_flexors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_flexors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_flexors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Abductors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_abductors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_abductors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_abductors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_abductors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Ext. Rotation
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_ext_rotation_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_ext_rotation_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_ext_rotation_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_ext_rotation_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Int. Rotation
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_int_rotation_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_int_rotation_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_int_rotation_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_int_rotation_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Extension
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_extension_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_extension_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_extension_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_extension_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Elevation
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_elevation_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_elevation_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_elevation_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_elevation_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Retraction
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_retraction_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_retraction_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_retraction_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_retraction_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Depression
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_depression_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_depression_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_depression_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_depression_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Protraction
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_protraction_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_protraction_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.shoulder_protraction_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'shoulder_protraction_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Hip adductors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_adductors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_adductors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_adductors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_adductors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Knee flexors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.knee_flexors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'knee_flexors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.knee_flexors_left || ''}
                        onChange={(e) =>
                          handleInputChange('knee_flexors_left', e.target.value)
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Knee extensors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.knee_extensors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'knee_extensors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.knee_extensors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'knee_extensors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Hip extensors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_extensors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_extensors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_extensors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_extensors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Hip Flexors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_flexors_right || ''}
                        onChange={(e) =>
                          handleInputChange('hip_flexors_right', e.target.value)
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_flexors_left || ''}
                        onChange={(e) =>
                          handleInputChange('hip_flexors_left', e.target.value)
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Hip Abductors
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_abductors_right || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_abductors_right',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={formData.hip_abductors_left || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'hip_abductors_left',
                            e.target.value,
                          )
                        }
                        placeholder="Grade"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <TextField
                        fullWidth
                        label="REMARK"
                        value={formData.shoulder_remark || ''}
                        onChange={(e) =>
                          handleInputChange('shoulder_remark', e.target.value)
                        }
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Additional notes on shoulder and hip strength assessment..."
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
            Neurological deficits/Impairments found on examination
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

        <Divider sx={{ my: 2 }} />

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

        <Divider sx={{ my: 2 }} />

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
              placeholder="Improve balance, Reduce neurological symptoms, Enhance functional independence..."
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

export default AddNeurologicals;
