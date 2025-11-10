
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

import Backend from "services/backend";
import GetToken from "utils/auth-token";
import hasPermission from "utils/auth/hasPermission";

import PageContainer from "ui-component/MainPage";
import NurseLogsTable from "./components/NurseLogsTable";
import NurseLogForm from "./components/NurseLogForm";
import NurseLogView from "./components/NurseLogView";

export default function NurseLogsIndex() {
    const [logs, setLogs] = useState([]);
    const [patients, setPatients] = useState([]);
    const [visits, setVisits] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openForm, setOpenForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: "",
        visit_id: "",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        intervention: "",
        evaluation: "",
        note_type: "general",
        requires_follow_up: false,
        follow_up_at: "",
        follow_up_note: "",
        supervised_by: "",
        supervisor_comment: "",
    });

    // Fetch all nurse logs
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = await GetToken();
            const response = await fetch(`${Backend.auth}${Backend.nurseLogs}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) setLogs(data.data?.data?.data || []);
            else toast.warning("Failed to fetch nurse logs");
        } catch (err) {
            toast.error(err.message || "Error fetching nurse logs");
        } finally {
            setLoading(false);
        }
    };

    // Fetch patients, visits, and supervisors
    const fetchOptions = async () => {
        try {
            const token = await GetToken();

            const [patientsRes, visitsRes, supervisorsRes] = await Promise.all([
                fetch(`${Backend.auth}${Backend.patients}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    }
                }),
                fetch(`${Backend.auth}${Backend.getVisits}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    }
                }),
                fetch(`${Backend.auth}${Backend.users}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                         Accept: "application/json",
                        "Content-Type": "application/json",
                    }
                }),
            ]);

            const [patientsData, visitsData, supervisorsData] = await Promise.all([
                patientsRes.json(),
                visitsRes.json(),
                supervisorsRes.json(),
            ]);

            if (patientsData.success) setPatients(patientsData.data?.data || []);
            if (visitsData.success) setVisits(visitsData.data?.data || []);
            if (supervisorsData.success) setSupervisors(supervisorsData.data?.data || []);

        } catch {
            toast.error("Error fetching options data");
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchOptions();
    }, []);

    // Open add/edit form
    const handleOpenForm = (log = null) => {
        if (log) {
            setEditMode(true);
            setSelectedLog(log);
            setFormData({
                patient_id: log.patient_id,
                visit_id: log.visit_id,
                subjective: log.subjective,
                objective: log.objective,
                assessment: log.assessment,
                plan: log.plan,
                intervention: log.intervention,
                evaluation: log.evaluation,
                note_type: log.note_type,
                requires_follow_up: log.requires_follow_up,
                follow_up_at: log.follow_up_at,
                follow_up_note: log.follow_up_note,
                supervised_by: log.supervised_by,
                supervisor_comment: log.supervisor_comment,
            });
        } else {
            setEditMode(false);
            setFormData({
                patient_id: "",
                visit_id: "",
                subjective: "",
                objective: "",
                assessment: "",
                plan: "",
                intervention: "",
                evaluation: "",
                note_type: "general",
                requires_follow_up: false,
                follow_up_at: "",
                follow_up_note: "",
                supervised_by: "",
                supervisor_comment: "",
            });
        }
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditMode(false);
        setSelectedLog(null);
    };

    // Open view dialog
    const handleOpenView = (log) => {
        setSelectedLog(log);
        setOpenViewDialog(true);
    };

    const handleCloseView = () => {
        setOpenViewDialog(false);
        setSelectedLog(null);
    };

    return (
        <PageContainer
            title="Nurse Logs"
            maxWidth="lg"
            sx={{ mt: 4, mb: 4 }}
            rightOption={
                hasPermission("create_nurse_log") && (
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                        Add Log
                    </Button>
                )
            }
        >
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <NurseLogsTable
                    logs={logs}
                    onEdit={handleOpenForm}
                    onDelete={fetchLogs} // implement proper delete
                    onView={handleOpenView}
                />
            )}

            <NurseLogForm
                open={openForm}
                onClose={handleCloseForm}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
                patients={patients}
                visits={visits}
                supervisors={supervisors}
                refreshList={fetchLogs}
                selectedLog={selectedLog}
            />

            <NurseLogView
                open={openViewDialog}
                onClose={handleCloseView}
                log={selectedLog}
            />

            <ToastContainer />
        </PageContainer>
    );
}
