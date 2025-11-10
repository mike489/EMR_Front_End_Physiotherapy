
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import GetToken from "utils/auth-token";
import Backend from "services/backend";

const NurseLogForm = ({
    open,
    onClose,
    editMode,
    formData,
    setFormData,
    patients,
    visits,
    supervisors,
    refreshList,
    selectedLog,
}) => {
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.patient_id || !formData.visit_id)
            return toast.warning("Please fill required fields");

        const token = await GetToken();
        const apiUrl = editMode
            ? `${Backend.auth}${Backend.nurseLogs}/${selectedLog.id}`
            : `${Backend.auth}${Backend.nurseLogs}`;
        const method = editMode ? "PUT" : "POST";

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",

                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editMode ? "Log updated!" : "Log added!");
                refreshList();
                onClose();
            } else {
                toast.warning(data.data?.message || "Operation failed");
            }
        } catch (err) {
            toast.error(err.message || "Error submitting form");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{editMode ? "Edit Nurse Log" : "Add Nurse Log"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Patient"
                            value={formData.patient_id}
                            fullWidth
                            onChange={(e) => handleChange("patient_id", e.target.value)}
                        >
                            {patients.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.full_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Visit"
                            value={formData.visit_id}
                            fullWidth
                            onChange={(e) => handleChange("visit_id", e.target.value)}
                        >
                            {visits
                                .filter(v => v.patient_id === formData.patient_id)
                                .map((v) => (
                                    <MenuItem key={v.visit_id} value={v.visit_id}>
                                        {v.visit_date} - {v.patient_name}
                                    </MenuItem>
                                ))}
                        </TextField>

                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.subjective}
                            onChange={(value) => handleChange("subjective", value)}
                            placeholder="Subjective"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.objective}
                            onChange={(value) => handleChange("objective", value)}
                            placeholder="Objective"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.assessment}
                            onChange={(value) => handleChange("assessment", value)}
                            placeholder="Assessment"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.plan}
                            onChange={(value) => handleChange("plan", value)}
                            placeholder="Plan"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.intervention}
                            onChange={(value) => handleChange("intervention", value)}
                            placeholder="Intervention"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.evaluation}
                            onChange={(value) => handleChange("evaluation", value)}
                            placeholder="Evaluation"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.requires_follow_up}
                                    onChange={(e) => handleChange("requires_follow_up", e.target.checked)}
                                />
                            }
                            label="Requires Follow-up"
                        />
                    </Grid>

                    {formData.requires_follow_up && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Follow-up At"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.follow_up_at}
                                onChange={(e) => handleChange("follow_up_at", e.target.value)}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Supervisor"
                            value={formData.supervised_by}
                            fullWidth
                            onChange={(e) => handleChange("supervised_by", e.target.value)}
                        >
                            {supervisors.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <ReactQuill
                            theme="snow"
                            value={formData.supervisor_comment}
                            onChange={(value) => handleChange("supervisor_comment", value)}
                            placeholder="Supervisor Comment"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {editMode ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NurseLogForm;
