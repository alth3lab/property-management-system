import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

export function MultiSelectInput({
  route,
  items,
  setItems,
  label,
  width = "48%",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const req = await fetch("/api/" + route);
      const res = await req.json();
      setData(res);
      setLoading(false);
    }

    getData();
  }, [route]);

  function handleChange(event, value) {
    setItems(value);
  }

  return (
    <Autocomplete
      onChange={(event, value) => handleChange(event, value)}
      multiple
      id="tags-filled"
      sx={{
        minWidth: 200,
        width,
      }}
      defaultValue={items}
      options={data}
      loading={loading}
      value={items} // Set the selected items as the value
      getOptionLabel={(option) => option.name} // This is crucial to display the name correctly
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            variant="outlined"
            label={option.name}
            {...getTagProps({ index })}
            style={{ backgroundColor: "#ffffff", color: "#000000" }} // Updated chip colors
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={(e) => handleInputChange(e.target.value)}
          InputProps={{
            ...params.InputProps,
            style: { backgroundColor: "#ffffff", color: "#000000" }, // Updated input field colors
          }}
          InputLabelProps={{
            style: { color: "#000000" }, // Updated label color
          }}
        />
      )}
    />
  );
}
