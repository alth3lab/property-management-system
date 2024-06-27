"use client";
import InputField from "../../Inputs/InputField";
import { useForm } from "react-hook-form";
import SimpleSelect from "../../MUIInputs/SimpleSelect";
import { Button, Typography } from "@mui/material";

export default function MainForm({
  inputs,
  onSubmit,
  differentButton,
  btnText,
  formTitle,
  subTitle = "",
  formStyle,
  variant,
  children,
  _className,
}) {
  const { formState, register, handleSubmit, watch, trigger, control } =
    useForm();
  const { errors } = formState;
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={
        "flex flex-col items-center justify-center w-full  p-5 py-6 bg-gray-100 rounded shadow-md   " +
        _className
      }
      style={{
        ...formStyle,
      }}
    >
      <Typography
        variant="h4"
        className="mb-4 font-bold text-[--color_primary]"
      >
        {formTitle}
      </Typography>
      {subTitle && (
        <Typography
          variant="subtitle1"
          className="mb-4 font-bold text-[--color_secondary]"
        >
          {subTitle}
        </Typography>
      )}
      <div className={"w-full"}>
        {inputs.map((input) => {
          if (input.data.type === "select") {
            return (
              <SimpleSelect
                key={input.data.id}
                select={input}
                register={register}
                errors={errors}
                variant={variant}
              />
            );
          } else {
            return (
              <InputField
                key={input.data.id}
                input={input}
                register={register}
                errors={errors}
                variant={variant}
                watch={watch}
                trigger={trigger}
              />
            );
          }
        })}
        {children}
      </div>
      {differentButton ? (
        differentButton
      ) : (
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          className={"mt-5 w-full  p-3 capitalize text-white font-bold"}
        >
          {btnText}
        </Button>
      )}
    </form>
  );
}
