import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Divider,
    Paper,
    Button,
    Grid,
    IconButton,
    useTheme,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Laboratory from "./Laboratory"; // import modal for creating tests

const LaboratoryDoctorTab = ({ visit, goToResults }) => {
    const theme = useTheme();
    const [labResults, setLabResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openLabModal, setOpenLabModal] = useState(false);
    const navigate = useNavigate();

    // fetch ordered labs
    const handleFetchingLab = async () => {
        const token = await GetToken();
        const Api = `${Backend.auth}${Backend.patientLaboratories}/${visit.visit_id}`;
        const header = {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
        };

        try {
            setLoading(true);
            const response = await fetch(Api, { method: "GET", headers: header });
            const responseData = await response.json();

            if (responseData.success) {
                // Sort categories and tests alphabetically
                const sortedData = (responseData.data || [])
                    .map(category => ({
                        ...category,
                        tests: (category.tests || []).sort((a, b) => 
                            (a.test || '').localeCompare(b.test || '')
                        )
                    }))
                    .sort((a, b) => 
                        (a.group_name || '').localeCompare(b.group_name || '')
                    );
                setLabResults(sortedData);
            } else {
                toast.warning(responseData.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchingLab();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 4 }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                    Laboratory Tests List
                </Typography>
                <IconButton
                    color="primary"
                    aria-label="add laboratory test"
                    onClick={() => setOpenLabModal(true)}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            color: 'white',
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {labResults.map((category) => (
                <Card key={category.id} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: "medium", color: "primary.main" }}
                        >
                            {category.group_name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {category.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <List dense>
                            {category.tests.map((test) => (
                                <Paper
                                    key={test.id}
                                    elevation={1}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 1,
                                        backgroundColor: "background.paper",
                                    }}
                                >
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body1"
                                                    component="span"
                                                    sx={{
                                                        fontWeight: "normal",
                                                    }}
                                                >
                                                    {test.test}
                                                </Typography>
                                            }
                                        />

                                        {test.result ? (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => goToResults('lab')}
                                                sx={{ ml: 2 }}
                                            >
                                                View Result
                                            </Button>

                                        ) : null}
                                    </ListItem>
                                </Paper>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}

            {labResults.length === 0 && !loading && (
                <Box textAlign="center" py={6}>
                    <Typography variant="h6" color="text.secondary">
                        No laboratory tests available
                    </Typography>
                </Box>
            )}

            {/* Laboratory modal */}
            <Laboratory
                visit={visit}
                open={openLabModal}
                onClose={() => {
                    setOpenLabModal(false);
                    handleFetchingLab(); // refresh after creating
                }}
            />

            <ToastContainer />
        </Box>
    );
};

export default LaboratoryDoctorTab;
