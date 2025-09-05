import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Yu-Gi-Oh-Duel-Monsters-Logo-2001.png";

const Header = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        boxShadow: 1,
        borderBottom: "1px solid #e0e0e0",
                  margin: "0",
          padding:"0",
        backgroundColor: "#ffffff",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,

          width: "100%",
        }}
      >
        {/* Logo + Title */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: 90, width: "auto", marginRight: 12 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, color: "#1976d2" }}
          >
            DuelMaster
          </Typography>
        </Box>

        {/* Navigacija */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {!token ? (
            <>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                  borderWidth: 1.5,
                  "&:hover": { backgroundColor: "#e3f2fd", borderColor: "#1976d2" },
                }}
              >
                Login
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#115293" },
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <Button
              color="error"
              variant="outlined"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                borderWidth: 1.5,
                "&:hover": { backgroundColor: "#fce4ec", borderColor: "#d32f2f" },
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
