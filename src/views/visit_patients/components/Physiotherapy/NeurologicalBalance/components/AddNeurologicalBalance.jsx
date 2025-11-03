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
    short_term_goal: '',
    precautions_and_contraindications: '',

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

          {/* Sensory Assessment */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Sensory Assessment
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {sensoryAssessmentOptions.map((sensory) => (
                <Chip
                  key={sensory}
                  label={sensory}
                  onClick={() =>
                    handleArrayToggle('sensory_assessment', sensory)
                  }
                  color={
                    formData.sensory_assessment.includes(sensory)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.sensory_assessment.includes(sensory)
                      ? 'filled'
                      : 'outlined'
                  }
                  size="small"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Sensory Assessment Remark"
              value={formData.sensory_assessment_remark}
              onChange={(e) =>
                handleInputChange('sensory_assessment_remark', e.target.value)
              }
              multiline
              rows={2}
            />
          </Grid>

          {/* Neurological Assessment Findings */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Neurological Assessment
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {neurologicalAssessmentOptions.map((finding) => (
                <Chip
                  key={finding}
                  label={finding}
                  onClick={() =>
                    handleArrayToggle('neurological_assessment', finding)
                  }
                  color={
                    formData.neurological_assessment.includes(finding)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.neurological_assessment.includes(finding)
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
                'Muscle Atrophy',
                'Fasciculations',
                'Tremor',
                'Abnormal Posture',
                'Skin Changes',
                'Muscle Tone Abnormalities',
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
              placeholder="Improve balance, Reduce neurological symptoms, Enhance functional independence..."
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
              placeholder="Fall precautions, Activity limitations, Safety measures..."
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
