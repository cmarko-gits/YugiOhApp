/* eslint-disable @typescript-eslint/no-explicit-any */
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
import React, { useState } from "react";
import agent from "../../api/agent";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await agent.User.register({ username, email, password });
      console.log("✅ Register success:", response.data);
    } catch (err : any) {
      console.error("❌ Register error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

   return (
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f5f5f5",
    padding: 2,
  }}
>
  <Paper
    elevation={6}
    sx={{
      padding: 4,
      borderRadius: 3,
      width: "100%",
      maxWidth: 700, // maksimalna širina forme
      boxSizing: "border-box",
    }}
  >
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" mb={2}>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid>
            <Typography variant="body2" color="text.secondary">
              <Link href="/login" variant="body2">
                {"I already have an account"}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Paper>
</Box>

);
}

export default Register;
