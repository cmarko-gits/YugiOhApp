import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, token, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "#f5f5f5", padding: 2 }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%", maxWidth: 700 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={2}>Login</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField label="Email" type="email" variant="outlined" margin="normal" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" variant="outlined" margin="normal" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mt: 3, mb: 2 }}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  <Link href="/register" variant="body2">{"Don't have an account? Register"}</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
