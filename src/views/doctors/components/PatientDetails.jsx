import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Avatar,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stack,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip,
} from "@mui/material";
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Cake as CakeIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Badge as BadgeIcon,
    CreditCard as CardIcon,
    MedicalServices as MedicalIcon,
    History as HistoryIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    AccessTime as TimeIcon,
} from "@mui/icons-material";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function PatientDetails({ patient, open, onClose }) {
    if (!patient) return null;

    const lastVisit = patient.visits && patient.visits.length > 0 ? patient.visits[0] : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={600} color="white">
                        Patient Details
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Header Card: Avatar + Name + EMR + Status */}
                <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: patient.gender === "Male" ? "info.main" : "secondary.main",
                                        fontSize: "2rem",
                                    }}
                                >
                                    {patient.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h5" fontWeight={700}>
                                    {patient.full_name}
                                </Typography>
                                <Stack direction="row" spacing={2} mt={1} alignItems="center">
                                    <Chip
                                        icon={<BadgeIcon />}
                                        label={patient.emr_number}
                                        size="small"
                                        color="primary"
                                    />
                                    {lastVisit ? (
                                        <Chip
                                            icon={
                                                lastVisit.status === "Finished" ? (
                                                    <CheckCircleIcon />
                                                ) : lastVisit.status === "In Progress" ? (
                                                    <TimeIcon />
                                                ) : (
                                                    <CancelIcon />
                                                )
                                            }
                                            label={lastVisit.status}
                                            color={
                                                lastVisit.status === "Finished"
                                                    ? "success"
                                                    : lastVisit.status === "In Progress"
                                                        ? "info"
                                                        : "error"
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            label="No Visit"
                                            size="small"
                                            sx={{ color: "text.secondary", bgcolor: "grey.100" }}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Left Column: Personal Info */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                                Personal Information
                            </Typography>
                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon><CakeIcon color="action" /></ListItemIcon>
                                    <ListItemText
                                        primary="Date of Birth"
                                        secondary={formatDate(patient.date_of_birth)}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><PersonIcon color="action" /></ListItemIcon>
                                    <ListItemText primary="Gender" secondary={patient.gender || "—"} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><PhoneIcon color="action" /></ListItemIcon>
                                    <ListItemText primary="Phone" secondary={patient.phone || "—"} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><EmailIcon color="action" /></ListItemIcon>
                                    <ListItemText primary="Email" secondary={patient.email || "—"} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><BadgeIcon color="action" /></ListItemIcon>
                                    <ListItemText primary="National ID" secondary={patient.national_id || "—"} />
                                </ListItem>
                                {patient.passport_number && (
                                    <ListItem disableGutters>
                                        <ListItemIcon><CardIcon color="action" /></ListItemIcon>
                                        <ListItemText primary="Passport" secondary={patient.passport_number} />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Right Column: Address */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                                Address
                            </Typography>
                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon><HomeIcon color="action" /></ListItemIcon>
                                    <ListItemText
                                        primary="City"
                                        secondary={patient.address?.city || "—"}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Sub-city (Kifle Ketema)"
                                        secondary={patient.address?.kifle_ketema || "—"}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Woreda"
                                        secondary={patient.address?.wereda || "—"}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemText primary="Country" secondary={patient.address?.country || "—"} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Medical Info */}
                <Box mt={3}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                            Medical Overview
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">
                                    Category
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {patient.patient_category || "—"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">
                                    Allergies
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {patient.allergies || "None recorded"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">
                                    Medical Conditions
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {patient.medical_conditions || "None recorded"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Last Visit */}
                {lastVisit ? (
                    <Box mt={3}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                                Last Visit
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Visit Type
                                    </Typography>
                                    <Chip
                                        icon={<MedicalIcon />}
                                        label={lastVisit.visit_type}
                                        size="small"
                                        color="info"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Date
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CalendarIcon fontSize="small" color="action" />
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatDate(lastVisit.visit_date)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        icon={
                                            lastVisit?.status === "Finished" ? (
                                                <CheckCircleIcon />
                                            ) : lastVisit?.status === "In Progress" ? (
                                                <TimeIcon />
                                            ) : (
                                                <CancelIcon />
                                            )
                                        }
                                        label={lastVisit?.status}
                                        color={
                                            lastVisit?.status === "Finished"
                                                ? "success"
                                                : lastVisit?.status === "In Progress"
                                                    ? "info"
                                                    : "error"
                                        }
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Created
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(lastVisit.created_at)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                ) : (
                    <Box mt={3}>
                        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                            <HistoryIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                            <Typography color="text.secondary">No visit history</Typography>
                        </Paper>
                    </Box>
                )}

                {/* Visit History Table */}
                {patient.visits && patient.visits.length > 1 && (
                    <Box mt={3}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                            Visit History
                        </Typography>
                        <Paper elevation={2}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Type</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Created</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {patient.visits.map((visit) => (
                                        <TableRow key={visit.id}>
                                            <TableCell>{visit.visit_type}</TableCell>
                                            <TableCell>{formatDate(visit.visit_date)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={visit?.status}
                                                    size="small"
                                                    color={
                                                        visit?.status === "Finished"
                                                            ? "success"
                                                            : visit?.status === "In Progress"
                                                                ? "warning"
                                                                : "default"
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(visit.created_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}