import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

export function MuiNumberField({
  input,
  variant = "contained",
  register,
  errors,
  watch,
  trigger,
}) {
  const [inputData, setInputData] = useState(input.data);
  const [type, setType] = useState(null);
  const fieldValue = watch(inputData.id);

  useEffect(() => {
    if (type) {
      trigger(inputData.id);
    }
  }, [fieldValue]);

  return (
    <TextField
      fullWidth
      sx={input.sx && input.sx}
      className={"mb-3"}
      label={inputData.label}
      onInput={() => setType(true)}
      variant={variant}
      error={Boolean(errors[inputData.id])}
      helperText={errors[inputData.id]?.message || inputData.helperText}
      defaultValue={input.value}
      type="number"
      {...register(inputData.id, input.pattern)}
    />
  );
}
