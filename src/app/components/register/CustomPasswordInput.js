import { useState } from "react";
import { useField } from "formik";

import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const CustomPasswordInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  // visibility of password
  const [passwordType, setPasswordType] = useState("password");

  const toggleShowPassword = () => {
    passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  };

  let eyeIcon =
    passwordType === "password" ? (
      <AiOutlineEyeInvisible size={20} />
    ) : (
      <AiOutlineEye size={20} />
    );
  // end of stuff about visibility of password

  return (
    <div className="pb-6">
      <label className="label">{label}</label>
      <div className="flex">
        <input
          {...field}
          {...props}
          type={passwordType}
          className={`input-ghost w-[100%] bg-slate-50 border-b ${
            meta.error && meta.touched ? "border-rose-500" : "border-gray-900"
          }`}
        />
        <span
          className="-ml-8 my-auto cursor-pointer"
          onClick={toggleShowPassword}
        >
          {eyeIcon}
        </span>
      </div>
      <p className="w-[95%] mx-auto pt-2 text-xs italic">
        Password must be at least 8 characters long, contain one capital letter,
        one number and one special character
      </p>
      {meta.error && meta.touched && (
        <p className="pt-2 text-sm text-rose-600">{meta.error}</p>
      )}
    </div>
  );
};

export default CustomPasswordInput;