// src/features/card/CardPage.tsx
import {
  CardContent,
  CardMedia,
  Container,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../api/agent";
import LoadingPage from "../../layout/Loading/LoadingPage";
import { type CardItem } from "../../model/Card";

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await agent.Card.getById(Number(id));
        setCard(response.data);
      } catch (error) {
        console.error("Failed to fetch card:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!card) return <Typography>Card not found.</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <MuiCard sx={{ display: "flex", gap: 3, p: 3 }}>
        <CardMedia
          component="img"
          image={card.imageUrl}
          alt={card.name}
          sx={{ width: 300, height: 450, objectFit: "cover", borderRadius: 2 }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {card.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {card.desc}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Type: {card.type}
          </Typography>
          {card.attack !== 0 && (
            <Typography variant="subtitle1" color="text.secondary">
              Attack: {card.attack}
            </Typography>
          )}
          {card.defense !== 0 && (
            <Typography variant="subtitle1" color="text.secondary">
              Defense: {card.defense}
            </Typography>
          )}
        </CardContent>
      </MuiCard>
    </Container>
  );
};

export default CardPage;
