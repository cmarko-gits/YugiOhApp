import {
  CardContent,
  CardMedia,
  Container,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "../../layout/Loading/LoadingPage";
import { clearCard, fetchCardById } from "../../slices/cardSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";


const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedCard, loading } = useAppSelector((state) => state.card);

  useEffect(() => {
    if (id) dispatch(fetchCardById(Number(id)));
    dispatch(clearCard());

  }, [id, dispatch]);

  if (loading) return <LoadingPage />;
  if (!selectedCard) return <Typography>Card not found.</Typography>;

  const card = selectedCard;

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
          {card.attack !== null && (
            <Typography variant="subtitle1" color="text.secondary">
              Attack: {card.attack}
            </Typography>
          )}
          {card.defense !== null && (
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
