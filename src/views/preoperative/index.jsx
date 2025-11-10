import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

import Backend from "services/backend";
import GetToken from "utils/auth-token";
import PageContainer from "ui-component/MainPage";
import NotesTable from "./components/NotesTable";
import AddNoteForm from "./components/AddNoteForm";
import Fallbacks from "utils/components/Fallbacks";

const NOTE_TYPES = [
  { value: "note", label: "Note" },
  { value: "summary", label: "Summary" },
  { value: "comment", label: "Comment" },
  { value: "memo", label: "Memo" },
];

export default function NotesIndex() {
  const [patients, setPatients] = useState([]); 
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [perPage, setPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const [formData, setFormData] = useState({
    patient_id: "",
    content: "",
  });

  // -------------------------
  // Fetch All Patients
  // -------------------------
 const fetchPatients = async () => {
  const token = await GetToken();
  const Api = `${Backend.auth}${Backend.patients}`;

  try {
    const res = await fetch(Api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (data.success) {
      // handle both paginated and flat array responses
      const patientsList = Array.isArray(data.data)
        ? data.data
        : data.data?.data || [];

      setPatients(patientsList);
    } else {
      toast.warning(data.message || "Failed to load patients");
      setPatients([]);
    }
  } catch (err) {
    toast.error(err.message || "Error fetching patients");
    setPatients([]);
  }
};


  // -------------------------
  // Fetch Notes
  // -------------------------
  const fetchNotes = async (page = 1, perPage = 10, type = "") => {
    const token = await GetToken();
    let Api = `${Backend.auth}${Backend.memo}?page=${page}&per_page=${perPage}`;


    try {
      setLoading(true);
      const res = await fetch(Api, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();

      if (data.success) {
        setNotes(data.data || []);
        setPagination({
          page: data.data?.current_page || 1,
          perPage: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          lastPage: data.data?.last_page || 1,
        });
      } else {
        toast.warning(data.data.message || "Failed to fetch notes");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Initial Load
  // -------------------------
  useEffect(() => {
    fetchPatients();
    fetchNotes(1, perPage, typeFilter);
  }, [perPage, typeFilter]);

  // -------------------------
  // Add Note
  // -------------------------
  const handleAddNote = async () => {
    if (!formData.patient_id) {
      toast.warning("Please select a patient");
      return;
    }

    if (!formData.content.replace(/<[^>]*>/g, "").trim()) {
      toast.warning("Please enter note content");
      return;
    }

    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.memo}`;

    const payload = {
      patient_id: formData.patient_id,
      content: formData.content,
    };

    try {
      setLoading(true);
      const res = await fetch(Api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Note added!");
        setFormData({ patient_id: "", content: "" });
        setOpenForm(false);
        fetchNotes(pagination.page, perPage, typeFilter);
      } else {
        toast.warning(data.data.message || "Failed to add note");
      }
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Loading
  // -------------------------
  if (loading && !notes.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // -------------------------
  // Empty Notes
  // -------------------------
  if (!notes.length) {
    return (
      <PageContainer title="Patient Notes" maxWidth="lg">
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Fallbacks
            severity="evaluation"
            title="No Notes Found"
            description="Start adding notes for a patient."
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ mt: 2 }}
            onClick={() => setOpenForm(true)}
          >
            Add Note
          </Button>
        </Box>

        <AddNoteForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddNote}
          loading={loading}
          patients={patients} 
        />

        <ToastContainer />
      </PageContainer>
    );
  }

  // -------------------------
  // Main Render
  // -------------------------
  return (
    <PageContainer
      title="Patient Notes"
      maxWidth="lg"
      rightOption={
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2, textTransform: "none" }}
          onClick={() => setOpenForm(true)}
        >
          Add Note
        </Button>
      }
    >
      

      <NotesTable notes={notes} />

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              {[5, 10, 20, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Pagination
          count={pagination.lastPage}
          page={pagination.page}
          onChange={(e, value) => fetchNotes(value, perPage, typeFilter)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

      <AddNoteForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddNote}
        loading={loading}
        patients={patients}
      />

      <ToastContainer />
    </PageContainer>
  );
}
