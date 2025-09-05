// src/components/SearchBar.tsx
import { TextField } from "@mui/material";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search cards"
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;
