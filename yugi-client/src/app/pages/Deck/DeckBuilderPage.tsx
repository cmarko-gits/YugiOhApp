import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeckBuilderContent from "../../features/Deck/DeckBuilderContent";
import LoadingPage from "../../layout/Loading/LoadingPage";

const DeckBuilderPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading) return <LoadingPage />;

  if (!isLoggedIn) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Morate biti ulogovani da biste kreirali svoj deck
        </Typography>
        <Typography>
          Molimo vas da se prijavite ili registrujete da biste koristili ovu funkcionalnost.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <DeckBuilderContent />
    </Container>
  );
};

export default DeckBuilderPage;
