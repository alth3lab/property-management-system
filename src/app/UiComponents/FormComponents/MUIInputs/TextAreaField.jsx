import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

export default function TextAreaField({
  control,
  input,
  register,
  variant,
  errors,

}) {
  const inputData = input.data;
  const fullWidth=input.fullWidth
  const {  label, id } = inputData;
  return (
    <Controller
      name={label}
      control={control}
      render={({ field:{value,onChange} }) => (
        <TextField
            id={id}

          label={label}
          multiline
          rows={4}
          fullWidth={fullWidth?fullWidth:true}
          sx={input.sx}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          variant={variant}
          {...register(id, input.pattern)}
          error={Boolean(errors[id])}
          helperText={errors[id]?.message }
          className={"mb-3"}
        />
      )}
    />
  );
}
