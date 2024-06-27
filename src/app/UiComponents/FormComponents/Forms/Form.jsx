import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useForm } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import TextAreaField from "@/app/UiComponents/FormComponents/MUIInputs/TextAreaField";
import { MuiTextField } from "@/app/UiComponents/FormComponents/MUIInputs/MuiTextField";
import { MuiSelect } from "@/app/UiComponents/FormComponents/MUIInputs/MuiSelect";
import { MuiDatePicker } from "@/app/UiComponents/FormComponents/MUIInputs/MuiDatePicker";
import MuiFileField from "@/app/UiComponents/FormComponents/MUIInputs/MuiFileField";
import MuiSwitchField from "@/app/UiComponents/FormComponents/MUIInputs/MuiSwitchField";
import { useRef } from "react";
import SimpleSelect from "@/app/UiComponents/FormComponents/MUIInputs/SimpleSelect";

const locales = ["en-gb"];

export function Form({
  formStyle,
  onSubmit,
  inputs,
  variant,
  formTitle,
  subTitle,
  btnText,
  differentButton,
  children,
  extraData,
  disabled,
  reFetch,
}) {
  const {
    formState,
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
  } = useForm();
  const { errors } = formState;
  const formRef = useRef();
  return (
    <Box
      className="bg-white  rounded shadow-md my-4"
      sx={{
        p: { xs: 2, md: 4 },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ ...formStyle }}
          ref={formRef}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {formTitle}
          </Typography>
          <Typography variant="subtitle1" className="mb-4 font-bold">
            {subTitle}
          </Typography>
          <div className="main w-full flex  gap-4 flex-wrap">
            {inputs.map((input) => {
              switch (input.data.type) {
                case "text":
                  return (
                    <MuiTextField
                      variant={variant}
                      register={register}
                      input={input}
                      errors={errors}
                      trigger={trigger}
                      watch={watch}
                      key={input.data.id}
                    />
                  );
                case "simpleSelect":
                  return (
                    <SimpleSelect
                      errors={errors}
                      register={register}
                      variant={variant}
                      select={input}
                      key={input.data.id}
                      extraData={extraData}
                      disabled={disabled}
                      reFetch={reFetch}
                      control={control}
                      triggerValue={setValue}
                    />
                  );
                case "textarea":
                  return (
                    <TextAreaField
                      errors={errors}
                      input={input}
                      register={register}
                      variant={variant}
                      control={control}
                      key={input.data.id}
                    />
                  );
                case "select":
                  return (
                    <MuiSelect
                      errors={errors}
                      register={register}
                      variant={variant}
                      select={input}
                      key={input.data.id}
                      extraData={extraData}
                      disabled={disabled}
                      reFetch={reFetch}
                      control={control}
                      triggerValue={setValue}
                    />
                  );
                case "date":
                  return (
                    <MuiDatePicker
                      input={input}
                      control={control}
                      key={input.data.id}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                    />
                  );
                case "file":
                  return (
                    <MuiFileField
                      control={control}
                      input={input}
                      variant={variant}
                      register={register}
                      errors={errors}
                      key={input.data.id}
                    />
                  );
                case "switch":
                  return (
                    <MuiSwitchField
                      register={register}
                      control={control}
                      input={input}
                      key={input.data.id}
                    />
                  );
                case "number":
                  return (
                    <MuiTextField
                      variant={variant}
                      register={register}
                      input={input}
                      errors={errors}
                      trigger={trigger}
                      watch={watch}
                      key={input.data.id}
                    />
                  );
                default:
                  return null;
              }
            })}
            {children}
          </div>
          {differentButton ? (
            differentButton
          ) : (
            <Button
              type={"submit"}
              variant={"contained"}
              sx={{
                mt: 2,
                px: 4,
                py: 1,
              }}
            >
              {btnText}
            </Button>
          )}
        </form>
      </LocalizationProvider>
    </Box>
  );
}
