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
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Backend from "services/backend";
import GetToken from "utils/auth-token";
import { toast, ToastContainer } from "react-toastify";
import Laboratory from "./Laboratory";

const LaboratoryDoctorTab = ({ goToResults }) => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState("");
  const [labResults, setLabResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openLabModal, setOpenLabModal] = useState(false);

  // Fetch all visits
  const fetchVisits = async () => {
    setLoading(true);
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.getVisits}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const response = await fetch(Api, { method: "GET", headers });
      const data = await response.json();

      if (data.success) {
        const visitData = Array.isArray(data.data?.data) ? data.data.data : [];
        setVisits(visitData);
        if (visitData.length) setSelectedVisit(visitData[0].visit_id);
      } else {
        toast.warning(data.message || "No visits found");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching visits");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lab results for selected visit
  const fetchLabResults = async (visitId) => {
    if (!visitId) return;
    setLoading(true);
    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.patientLaboratories}/${visitId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      };
      const response = await fetch(Api, { method: "GET", headers });
      const data = await response.json();

      if (data.success) {
        const sortedData = (data.data || [])
          .map((category) => ({
            ...category,
            tests: (category.tests || []).sort((a, b) =>
              (a.test || "").localeCompare(b.test || "")
            ),
          }))
          .sort((a, b) =>
            (a.group_name || "").localeCompare(b.group_name || "")
          );
        setLabResults(sortedData);
        setFilteredResults(sortedData);
      } else {
        setLabResults([]);
        setFilteredResults([]);
        toast.warning(data.message || "No laboratory results found");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching lab results");
    } finally {
      setLoading(false);
    }
  };

  // Handle visit selection
  const handleVisitChange = (e) => {
    const visitId = e.target.value;
    setSelectedVisit(visitId);
    fetchLabResults(visitId);
  };

  // Handle search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = labResults.map((category) => ({
      ...category,
      tests: (category.tests || []).filter((test) =>
        test.test.toLowerCase().includes(query)
      ),
    })).filter(category => category.tests.length > 0);

    setFilteredResults(filtered);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (selectedVisit) fetchLabResults(selectedVisit);
  }, [selectedVisit]);

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
      {/* Header with Visit Select & Search */}
        <Typography variant="h4" sx={{ fontWeight: "bold", mb:4 }}>
          Laboratory Tests
        </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}>

        
            <Box display="flex" flexDirection="column" gap={2} flex={0.5}>
          <TextField
            select
            label="Select Visit"
            value={selectedVisit}
            onChange={handleVisitChange}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>All Patients</em>
            </MenuItem>
            {visits.map((visit) => (
              <MenuItem key={visit.visit_id || visit.id} value={visit.visit_id || visit.id}>
                {visit.patient_name || `Visit ${visit.visit_id}`}
              </MenuItem>
            ))}
          </TextField>

            </Box>
       <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <IconButton
            color="primary"
            onClick={() => setOpenLabModal(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            <AddIcon />
          </IconButton>

       </Stack>
        </Box>
  

      {/* Lab Results */}
      {filteredResults.length ? (
        filteredResults.map((category) => (
          <Card key={category.id} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "medium", color: "primary.main" }}>
                {category.group_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List dense>
                {category.tests.map((test) => (
                  <Paper key={test.id} sx={{ mb: 1, borderRadius: 1, p: 1 }}>
                    <ListItem>
                      <ListItemText primary={test.test} />
                      {test.result && (
                        <Button variant="outlined" color="primary" onClick={() => goToResults("lab")}>
                          View Result
                        </Button>
                      )}
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      ) : (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery
              ? "No results match your search"
              : "No laboratory tests available for this visit"}
          </Typography>
        </Box>
      )}

      {/* Laboratory Modal */}
      <Laboratory
        visit={{ visit_id: selectedVisit }}
        open={openLabModal}
        onClose={() => {
          setOpenLabModal(false);
          fetchLabResults(selectedVisit);
        }}
      />

      <ToastContainer />
    </Box>
  );
};

export default LaboratoryDoctorTab;
