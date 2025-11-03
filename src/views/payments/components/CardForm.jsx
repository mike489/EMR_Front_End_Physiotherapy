import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";
import GetToken from "utils/auth-token";
import Backend from "services/backend";

const CardForm = ({ card, onUpdate }) => {
  const [cardData, setCardData] = useState({ amount: "", expire_date_count: "" });

  useEffect(() => {
    if (card && (card.amount || card.expire_date_count)) {
      setCardData(card);
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!cardData.amount || !cardData.expire_date_count) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = await GetToken();
      const Api = `${Backend.auth}${Backend.updatePaymentSettings}`;
      const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "application/json",
      };

      const payload = {
        card: {
          amount: cardData.amount,
          expire_date_count: cardData.expire_date_count,
        },
      };

      const response = await fetch(Api, {
        method: "POST",
        headers: header,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Card updated successfully!");
        // Update parent state with new card data
        onUpdate({ amount: cardData.amount, expire_date_count: cardData.expire_date_count });
        // Reset form fields after successful save
        setCardData({ amount: "", expire_date_count: "" });
      } else {
        toast.error(responseData.message || "Failed to update card");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Paper sx={{ p: 4, margin: "auto", mt: 5, display: "flex", border:0, borderRadius:0, flexDirection: { xs: "column", md: "row" }, bgcolor: '#f5f5f5' }}>
      <Box sx={{ flexDirection: "column", mr: { md: 4 }, mb: { xs: 2, md: 0 } }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: 20, fontFamily: "Arial" }}>
          Card Information
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Update your card amount and expiration details
        </Typography>
      </Box>
      <Paper sx={{ p: 4, borderRadius: 1, boxShadow: 1, borderColor: "gray", mx: 4,  width: '100%', border:0, }}>
        <Box sx={{ mt: 2, margin: "auto" }}>
          <TextField
            label="Amount"
            name="amount"
            value={cardData.amount}
            onChange={handleChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            label="Expire Days"
            name="expire_date_count"
            value={cardData.expire_date_count}
            onChange={handleChange}
            fullWidth
            type="number"
            margin="normal"
          />
        </Box>

        < Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3}}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Paper>
    </Paper>
  );
};

export default CardForm;