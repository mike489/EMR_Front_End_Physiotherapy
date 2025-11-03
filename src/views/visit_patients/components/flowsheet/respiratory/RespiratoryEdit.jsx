import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import ReactQuill from 'react-quill'; // Import react-quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

// Utility to strip HTML tags for validation
const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const RespiratoryEdit = ({ assessment, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        respiratory_type: '',
        respiratory_pattern: '',
        chest_pattern: '',
        cough: '',
        bilateral_breath_sound: '',
        right_left_breath_sound: '',
        specific_location: '',
        spectrum_description: '',
    });
    const [errors, setErrors] = useState({
        respiratory_type: '',
        respiratory_pattern: '',
        chest_pattern: '',
        cough: '',
        bilateral_breath_sound: '',
        right_left_breath_sound: '',
        specific_location: '',
        spectrum_description: '',
    });

    // Options for select fields
    const typeOptions = ['normal', 'abnormal'];
    const patternOptions = ['regular', 'irregular'];
    const coughOptions = ['no', 'yes'];
    const breathSoundOptions = ['normal', 'abnormal'];
    const locationOptions = [
        'left upper lobe',
        'left lower lobe',
        'right upper lobe',
        'right lower lobe',
        'bilateral',
    ];

    // Quill modules for toolbar configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    };

    useEffect(() => {
        if (assessment) {
            setFormData({
                respiratory_type: assessment.respiratory_type || '',
                respiratory_pattern: assessment.respiratory_pattern || '',
                chest_pattern: assessment.cheat_pattern || '',
                cough: assessment.cough || '',
                bilateral_breath_sound: assessment.bilateral_breath_sound || '',
                right_left_breath_sound: assessment.right_left_breath_sound || '',
                specific_location: assessment.specific_location || '',
                spectrum_description: assessment.spectrum_description || '',
            });
        }
    }, [assessment]);

    // ---------------- VALIDATION ----------------
    const validateForm = () => {
        const newErrors = {
            respiratory_type: '',
            respiratory_pattern: '',
            chest_pattern: '',
            cough: '',
            bilateral_breath_sound: '',
            right_left_breath_sound: '',
            specific_location: '',
            spectrum_description: '',
        };
        let valid = true;

        if (!formData.respiratory_type) {
            newErrors.respiratory_type = 'Respiratory type is required';
            valid = false;
        } else if (!typeOptions.includes(formData.respiratory_type)) {
            newErrors.respiratory_type = 'Invalid respiratory type selected';
            valid = false;
        }

        if (!formData.respiratory_pattern) {
            newErrors.respiratory_pattern = 'Respiratory pattern is required';
            valid = false;
        } else if (!patternOptions.includes(formData.respiratory_pattern)) {
            newErrors.respiratory_pattern = 'Invalid respiratory pattern selected';
            valid = false;
        }

        if (!formData.chest_pattern) {
            newErrors.chest_pattern = 'Chest pattern is required';
            valid = false;
        } else if (!typeOptions.includes(formData.chest_pattern)) {
            newErrors.chest_pattern = 'Invalid chest pattern selected';
            valid = false;
        }

        if (!formData.cough) {
            newErrors.cough = 'Cough status is required';
            valid = false;
        } else if (!coughOptions.includes(formData.cough)) {
            newErrors.cough = 'Invalid cough status selected';
            valid = false;
        }

        if (!formData.bilateral_breath_sound) {
            newErrors.bilateral_breath_sound = 'Bilateral breath sound is required';
            valid = false;
        } else if (!breathSoundOptions.includes(formData.bilateral_breath_sound)) {
            newErrors.bilateral_breath_sound = 'Invalid bilateral breath sound selected';
            valid = false;
        }

        if (!formData.right_left_breath_sound) {
            newErrors.right_left_breath_sound = 'Right/Left breath sound is required';
            valid = false;
        } else if (!breathSoundOptions.includes(formData.right_left_breath_sound)) {
            newErrors.right_left_breath_sound = 'Invalid right/left breath sound selected';
            valid = false;
        }

        if (!formData.specific_location) {
            newErrors.specific_location = 'Specific location is required';
            valid = false;
        } else if (!locationOptions.includes(formData.specific_location)) {
            newErrors.specific_location = 'Invalid specific location selected';
            valid = false;
        }

        const plainText = stripHtml(formData.spectrum_description);
        if (!plainText) {
            newErrors.spectrum_description = 'Spectrum description is required';
            valid = false;
        } else if (plainText.length > 500) {
            newErrors.spectrum_description = 'Spectrum description must not exceed 500 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // ---------------- HANDLERS ----------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.trim() }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleQuillChange = (value) => {
        setFormData((prev) => ({ ...prev, spectrum_description: value }));
        setErrors((prev) => ({ ...prev, spectrum_description: '' }));
    };

    const handleBlur = () => {
        validateForm();
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        const token = await GetToken();
        const Api = `${Backend.auth}${Backend.respiratoryAssessments}/${assessment.id}`;
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
        };

        const payload = {
            respiratory_type: formData.respiratory_type,
            respiratory_pattern: formData.respiratory_pattern,
            cheat_pattern: formData.chest_pattern,
            cough: formData.cough,
            bilateral_breath_sound: formData.bilateral_breath_sound,
            right_left_breath_sound: formData.right_left_breath_sound,
            specific_location: formData.specific_location,
            spectrum_description: formData.spectrum_description,
        };

        setSubmitting(true);
        try {
            const response = await fetch(Api, {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Respiratory assessment updated successfully!');
                setErrors({
                    respiratory_type: '',
                    respiratory_pattern: '',
                    chest_pattern: '',
                    cough: '',
                    bilateral_breath_sound: '',
                    right_left_breath_sound: '',
                    specific_location: '',
                    spectrum_description: '',
                });
                if (onClose) onClose();
            } else if (data.status === 422 && data.data?.errors) {
                setErrors({
                    respiratory_type: data.data.errors.respiratory_type?.[0] || '',
                    respiratory_pattern: data.data.errors.respiratory_pattern?.[0] || '',
                    chest_pattern: data.data.errors.cheat_pattern?.[0] || '',
                    cough: data.data.errors.cough?.[0] || '',
                    bilateral_breath_sound: data.data.errors.bilateral_breath_sound?.[0] || '',
                    right_left_breath_sound: data.data.errors.right_left_breath_sound?.[0] || '',
                    specific_location: data.data.errors.specific_location?.[0] || '',
                    spectrum_description: data.data.errors.spectrum_description?.[0] || '',
                });
                toast.error(data.data.message || 'Validation failed');
            } else {
                toast.error(data.data?.message || 'Failed to update assessment');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Edit Respiratory Assessment
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Respiratory Type"
                        name="respiratory_type"
                        value={formData.respiratory_type}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.respiratory_type}
                        helperText={errors.respiratory_type || 'Select respiratory type'}
                        required
                    >
                        {typeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Respiratory Pattern"
                        name="respiratory_pattern"
                        value={formData.respiratory_pattern}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.respiratory_pattern}
                        helperText={errors.respiratory_pattern || 'Select respiratory pattern'}
                        required
                    >
                        {patternOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Chest Pattern"
                        name="chest_pattern"
                        value={formData.chest_pattern}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.chest_pattern}
                        helperText={errors.chest_pattern || 'Select chest pattern'}
                        required
                    >
                        {typeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Cough"
                        name="cough"
                        value={formData.cough}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.cough}
                        helperText={errors.cough || 'Select cough status'}
                        required
                    >
                        {coughOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Bilateral Breath Sound"
                        name="bilateral_breath_sound"
                        value={formData.bilateral_breath_sound}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.bilateral_breath_sound}
                        helperText={errors.bilateral_breath_sound || 'Select bilateral breath sound'}
                        required
                    >
                        {breathSoundOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Right/Left Breath Sound"
                        name="right_left_breath_sound"
                        value={formData.right_left_breath_sound}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.right_left_breath_sound}
                        helperText={errors.right_left_breath_sound || 'Select right/left breath sound'}
                        required
                    >
                        {breathSoundOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Specific Location"
                        name="specific_location"
                        value={formData.specific_location}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!errors.specific_location}
                        helperText={errors.specific_location || 'Select specific location'}
                        required
                    >
                        {locationOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Spectrum Description *
                    </Typography>
                    <ReactQuill
                        value={formData.spectrum_description}
                        onChange={handleQuillChange}
                        onBlur={handleBlur}
                        modules={quillModules}
                        style={{
                            minHeight: '150px',
                            border: errors.spectrum_description ? '1px red' : '1px #ccc',
                            borderRadius: '4px',
                        }}
                    />
                    <Typography
                        variant="caption"
                        color={errors.spectrum_description ? 'error' : 'textSecondary'}
                        sx={{ mt: 1, display: 'block' }}
                    >
                        {errors.spectrum_description || 'Enter spectrum description (max 500 characters)'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    {onClose && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                            disabled={submitting}
                            sx={{ minWidth: 120, mr: 2 }}
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Update Assessment'}
                        </Button>
                    )}
                    {onClose && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={onClose}
                            sx={{ minWidth: 120 }}
                        >
                            Cancel
                        </Button>
                    )}
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
};

export default RespiratoryEdit;