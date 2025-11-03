// components/CardInfo.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { toast } from "react-toastify";

const CardInfo = ({ card }) => {
  const [editableCard, setEditableCard] = useState(card);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableCard(card);
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validation: ensure amount and expiry are positive numbers
    if (
      !editableCard.amount ||
      !editableCard.expire_date_count ||
      isNaN(editableCard.amount) ||
      isNaN(editableCard.expire_date_count)
    ) {
      toast.error("Please enter valid numeric values.");
      return;
    }

    toast.success("Card details updated!");
    setIsEditing(false);
    // Here you can also call your backend API to persist changes
  };

  const handleCancel = () => {
    setEditableCard(card);
    setIsEditing(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 350,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        background: "#ffffff",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Card Details
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
          {isEditing ? (
            <TextField
              name="amount"
              value={editableCard.amount || ""}
              onChange={handleChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {editableCard.amount}
            </Typography>
          )}
        </Box>
        {!isEditing && (
          <Typography variant="body2" color="text.secondary">
            Amount
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <AccessTimeIcon color="secondary" sx={{ mr: 1 }} />
          {isEditing ? (
            <TextField
              name="expire_date_count"
              value={editableCard.expire_date_count || ""}
              onChange={handleChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {editableCard.expire_date_count} days
            </Typography>
          )}
        </Box>
        {!isEditing && (
          <Typography variant="body2" color="text.secondary">
            Expire in
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          {isEditing ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardInfo;
