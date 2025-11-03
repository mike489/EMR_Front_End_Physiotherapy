import React, { useEffect, useState } from "react";
import GetToken from "utils/auth-token";
import Backend from "services/backend";
import { toast , ToastContainer} from "react-toastify";
import CardForm from "./components/CardForm";
import { CircularProgress, Box } from "@mui/material";
import PageContainer from 'ui-component/MainPage';


export default function Index() {
    const [card, setCard] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchCard = async () => {
        const token = await GetToken();
        const Api = `${Backend.auth}${Backend.getPaymentSettings}`;
        const header = {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(Api, { method: "GET", headers: header });
            const responseData = await response.json();

            if (responseData.success) {
                setCard(responseData.data.card);
            } else {
                toast.warning(responseData.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCardUpdate = (updatedCard) => {
        setCard(updatedCard);
    };

    useEffect(() => {
        fetchCard();
    }, []);

    if (loading) return 
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
    </Box>;

    return (
        <PageContainer title="Payments" bgcolor="#f5f5f5">
            <Box sx={{ mb: 2 }}>
                <CardForm card={card} onUpdate={handleCardUpdate} />
            </Box>
            <ToastContainer />
        </PageContainer>
        );
}