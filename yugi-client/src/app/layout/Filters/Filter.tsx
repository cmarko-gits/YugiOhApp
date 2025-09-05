// src/components/CardFilter.tsx
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface CardFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CardFilter: React.FC<CardFilterProps> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Filter</InputLabel>
      <Select
        value={value}
        label="Filter"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Monster">Monster</MenuItem>
        <MenuItem value="Spell">Spell</MenuItem>
        <MenuItem value="Trap">Trap</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CardFilter;
