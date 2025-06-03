import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  const [usernameStatus, setUsernameStatus] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      shops: [{ name: "" }, { name: "" }, { name: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shops",
  });

  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const watchShops = watch("shops");

  const validateUsername = async (username) => {
    if (!username.trim()) {
      setUsernameStatus("");
      return "Username is required";
    }

    try {
      const res = await axiosInstance.get("/api/auth/check-username", {
        params: { username },
      });

      if (res.data.exists) {
        setUsernameStatus("");
        return "Username already taken";
      } else {
        setUsernameStatus(" Username is available");
        return true;
      }
    } catch {
      setUsernameStatus("");
      return "Error validating username";
    }
  };

  const validateShopName = async (val, index) => {
    const name = val.trim().toLowerCase();
    if (!name) return "Shop name is required";

    const otherNames = watchShops
      .map((s, i) => i !== index && s.name.trim().toLowerCase())
      .filter(Boolean);

    if (otherNames.includes(name)) return "Shop name must be unique";

    try {
      const res = await axiosInstance.get("/api/auth/check-shopname", {
        params: { name },
      });
      return res.data.exists
        ? "Shop name already taken"
        : "Shop name available" & true;
    } catch {
      return "Error validating shop name";
    }
  };

  const onSubmit = async (data) => {
    setSignupError("");

    const shopNames = data.shops.map((s) => s.name.trim()).filter(Boolean);
    const uniqueShops = new Set(shopNames);

    if (shopNames.length < 3) {
      setSignupError("Please enter at least 3 unique shop names.");
      return;
    }
    if (shopNames.length !== uniqueShops.size) {
      setSignupError("Shop names must be unique.");
      return;
    }

    try {
      await axiosInstance.post("/api/auth/signup", {
        username: data.username,
        password: data.password,
        shopNames,
      });
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Signup failed.";
      setSignupError(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Create Your Account
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="font-semibold text-gray-700 mb-1 block"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            {...register("username", {
              required: true,
              validate: validateUsername,
            })}
            className="w-full border px-4 py-2 rounded"
          />
          {errors.username ? (
            <p className="text-sm text-red-600 mt-1 font-medium">
              {errors.username.message}
            </p>
          ) : usernameStatus ? (
            <p className="text-sm text-green-600 mt-1 font-medium">
              {usernameStatus}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="font-semibold text-gray-700 mb-1 block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/,
                  message:
                    "Must include a number, a special character, and a letter",
                },
              })}
              className="w-full border px-4 py-2 rounded pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-2 right-3 text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Shop Names */}
        <div className="mb-5">
          <label className="font-semibold text-gray-700 mb-2 block">
            Shop Names (At least 3 unique)
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 items-center">
              <input
                {...register(`shops.${index}.name`, {
                  required: "Shop name is required",
                  validate: (val) => validateShopName(val, index),
                })}
                placeholder={`Shop ${index + 1}`}
                className="flex-1 border px-4 py-2 rounded"
              />
              {fields.length > 3 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.shops &&
            errors.shops.map(
              (err, i) =>
                err?.name && (
                  <p key={i} className="text-red-600 text-sm mb-1">
                    Shop {i + 1}: {err.name.message}
                  </p>
                )
            )}

          <button
            type="button"
            onClick={() => append({ name: "" })}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            + Add another shop
          </button>
        </div>

        {/* Error + Submit */}
        {signupError && (
          <p className="text-center text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">
            {signupError}
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
