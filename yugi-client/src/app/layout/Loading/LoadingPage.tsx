import { Box } from "@mui/material";
import loadingCard from "../../../assets/loading_card.jpg"; // tvoja slika karte
import "./LoadingPage.css"; // CSS za animaciju rotacije

interface Props{
   message ?:string
}


const LoadingPage = ({message="Loading ..."}:Props) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <img src={loadingCard} alt={message} className="rotating-card" />
    </Box>
  );
};

export default LoadingPage;
