"use client";
import React from "react";

type AuthPageProps = {
  type: "login" | "register";
};
import { useState } from "react";
import img from "@/../public/images/login-walpaper.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LoginResponse } from "@/interfaces/LoginResponse";
import { setCookie } from "nookies";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function AuthPage({ type }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    if (accessToken) {
      router.replace("/");
    }
  }, [searchParams, router]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // if (type === "register") {
    //   if (
    //     !form.fullName ||
    //     !form.email ||
    //     !form.password ||
    //     !form.repeatPassword
    //   ) {
    //     setError("Tüm alanları doldurun.");
    //     return;
    //   }
    //   if (form.password !== form.repeatPassword) {
    //     setError("Şifreler eşleşmiyor.");
    //     return;
    //   }
    //   const [firstName, ...rest] = form.fullName.trim().split(" ");
    //   const lastName = rest.join(" ");
    //   try {
    //     await registerUser(firstName, lastName, form.email, form.password);
    //     router.replace("/login");
    //   } catch {
    //     setError("Kayıt başarısız.");
    //   }
    // } else
    if (type === "login") {
      if (!form.email || !form.password) {
        setError("Tüm alanları doldurun.");
        return;
      }
      try {
        const response = await clxRequest.post<LoginResponse>("/auth/login", {
          email: form.email,
          password: form.password,
        });
        if (response.accessToken) {
          setCookie(null, "accessToken", response.accessToken);
          router.replace("/");
        } else {
          setError("Email or password is incorrect.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Email or password is incorrect.");
      }
    }
  };
  return (
    <div
      className="h-screen text-white flex justify-center items-center"
      style={{
        background: "linear-gradient(180deg, #0F2027 0%, #25434F 50%, #203A43 100%)",
      }}
    >
      <div className="form flex-1 flex flex-col justify-center h-full">
        <div
          className="max-w-md h-[80vh] w-full mx-auto rounded-xl p-8 "
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Logo</h1>
            <h2 className="text-xl font-semibold mb-4">
              Welcome{type === "register" ? "!" : " back!"}
            </h2>
            {/* <button
              onClick={() => (window.location.href = process.env.NEXT_PUBLIC_API_URL+"/auth/google")}
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#FFFFFF1A] hover:bg-[#FFFFFF2A] text-white py-2 rounded-lg font-medium mb-4"
            >
              <FcGoogle className="text-3xl bg-[#FFFFFF1A] rounded-4xl p-1" />
              Sign {type === "register" ? "up" : "in"} with Google
            </button>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="mx-2 text-sm text-gray-400">Or use Email</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div> */}
          </div>

          <form onSubmit={handleSubmit}>
            {/* {type === "register" && (
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF1A] text-white focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
            )} */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">EMAIL</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF1A] text-white focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF1A] text-white focus:outline-none pr-10"
                  placeholder="********"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </span>
              </div>
            </div>
            {/* {type === "register" && (
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1">
                  REPEAT PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="repeatPassword"
                    value={form.repeatPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF1A] text-white focus:outline-none pr-10"
                    placeholder="********"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                    <AiOutlineEye size={20} />
                  </span>
                </div>
              </div>
            )} */}
            {error && <div className="text-red-400 text-xs mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#50AF11] hover:bg-lime-600 text-white font-semibold py-3 rounded-lg mt-2 mb-3"
            >
              {type === "register" ? "SIGN UP" : "LOG IN"}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 mb-4">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit amet
          </p>
          {/* <div className="text-center text-xs text-gray-300">
            Already have an account?{" "}
            <Link
              href={type === "register" ? "login" : "register"}
              className="text-lime-400 hover:underline font-semibold"
            >
              {type === "register" ? "LOG IN" : "SIGN UP"}
            </Link>
          </div> */}
        </div>
      </div>
      <div className="walpaper flex-1 h-full">
        <Image
          src={img}
          width={1}
          height={1}
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default AuthPage;
