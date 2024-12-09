"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input2";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { BASE_URL } from "@/config";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label2";
import { signIn } from "next-auth/react";
import { Icon } from "@iconify/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | 'twitter' | null>(null);
  const [localStorageInstance, setLocalStorageInstance] = useState<Storage | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setErrorMessage(null);

    const url = `${BASE_URL}/api/auth/signin`;
    try {
      const response = await axios.post(url, data);
      const { jwtToken, name, email } = response.data;

      localStorageInstance?.setItem('token', jwtToken);
      localStorageInstance?.setItem('loggedInUser', name);
      localStorageInstance?.setItem('loggedInUserEmail', email);

      window.location.href = "/entertainment-hub";
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google' | 'twitter') => {
    setSocialLoading(provider);
    try {
      const result = await signIn(provider, {
        redirect: true,
        callbackUrl: '/entertainment-hub'
      });

      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Social login error:', error);
      setErrorMessage('Social login failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setLocalStorageInstance(localStorage)
  }, []);

  // Social login button configurations
  const socialButtons = [
    {
      provider: 'github',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="currentColor"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.0005 1C18.303 1.00296 12.7923 3.02092 8.45374 6.69305C4.11521 10.3652 1.23181 15.452 0.319089 21.044C-0.593628 26.636 0.523853 32.3684 3.47174 37.2164C6.41963 42.0643 11.0057 45.7115 16.4099 47.5059C17.6021 47.7272 18.0512 46.9883 18.0512 46.36C18.0512 45.7317 18.0273 43.91 18.0194 41.9184C11.3428 43.3608 9.93197 39.101 9.93197 39.101C8.84305 36.3349 7.26927 35.6078 7.26927 35.6078C5.09143 34.1299 7.43223 34.1576 7.43223 34.1576C9.84455 34.3275 11.1123 36.6194 11.1123 36.6194C13.2504 40.2667 16.7278 39.2116 18.0949 38.5952C18.3095 37.0501 18.9335 35.999 19.621 35.4023C14.2877 34.8017 8.68408 32.7548 8.68408 23.6108C8.65102 21.2394 9.53605 18.9461 11.156 17.2054C10.9096 16.6047 10.087 14.1785 11.3905 10.8829C11.3905 10.8829 13.4054 10.2427 17.9916 13.3289C21.9253 12.2592 26.0757 12.2592 30.0095 13.3289C34.5917 10.2427 36.6026 10.8829 36.6026 10.8829C37.9101 14.1706 37.0875 16.5968 36.8411 17.2054C38.4662 18.9464 39.353 21.2437 39.317 23.6187C39.317 32.7824 33.7015 34.8017 28.3602 35.3905C29.2186 36.1334 29.9856 37.5836 29.9856 39.8122C29.9856 43.0051 29.9578 45.5736 29.9578 46.36C29.9578 46.9962 30.391 47.7391 31.6071 47.5059C37.0119 45.7113 41.5984 42.0634 44.5462 37.2147C47.4941 32.3659 48.611 26.6326 47.6972 21.0401C46.7835 15.4476 43.8986 10.3607 39.5587 6.68921C35.2187 3.01771 29.7067 1.00108 24.0085 1H24.0005Z"
          />
        </svg>
      )
    },
    {
      provider: 'google',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="none"
          {...props}
        >
          <path
            d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
            fill="#4285F4"
          />
          <path
            d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
            fill="#34A853"
          />
          <path
            d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
            fill="#FBBC04"
          />
          <path
            d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
            fill="#EA4335"
          />
        </svg>
      )
    },
    {
      provider: 'twitter',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="none"
          {...props}
        >
          <path
            d="M15.095 43.5014C33.2083 43.5014 43.1155 28.4946 43.1155 15.4809C43.1155 15.0546 43.1155 14.6303 43.0867 14.2079C45.0141 12.8138 46.6778 11.0877 48 9.11033C46.2028 9.90713 44.2961 10.4294 42.3437 10.6598C44.3996 9.42915 45.9383 7.49333 46.6733 5.21273C44.7402 6.35994 42.6253 7.16838 40.4198 7.60313C38.935 6.02428 36.9712 4.97881 34.8324 4.6285C32.6935 4.27818 30.4988 4.64256 28.5879 5.66523C26.677 6.68791 25.1564 8.31187 24.2615 10.2858C23.3665 12.2598 23.1471 14.4737 23.6371 16.5849C19.7218 16.3885 15.8915 15.371 12.3949 13.5983C8.89831 11.8257 5.81353 9.33765 3.3408 6.29561C2.08146 8.4636 1.69574 11.0301 2.2622 13.4725C2.82865 15.9148 4.30468 18.0495 6.38976 19.4418C4.82246 19.3959 3.2893 18.9731 1.92 18.2092V18.334C1.92062 20.6077 2.7077 22.8112 4.14774 24.5707C5.58778 26.3303 7.59212 27.5375 9.8208 27.9878C8.37096 28.3832 6.84975 28.441 5.37408 28.1567C6.00363 30.1134 7.22886 31.8244 8.87848 33.0506C10.5281 34.2768 12.5197 34.9569 14.5747 34.9958C12.5329 36.6007 10.1946 37.7873 7.69375 38.4878C5.19287 39.1882 2.57843 39.3886 0 39.0777C4.50367 41.9677 9.74385 43.5007 15.095 43.4937"
            fill="#1DA1F2"
          />
        </svg>
      )
    }
  ];

  // Animation variants (kept from previous implementation)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const socialButtonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.95, rotate: -5 }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex overflow-y-hidden"
    >
      <div className="relative flex-1 hidden items-center justify-center min-h-screen bg-transparent lg:flex">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 w-full max-w-lg"
        >
          <motion.img
            variants={itemVariants}
            src="logo.webp"
            width={100}
            className="rounded-full"
          />
          <motion.div className=" mt-10 space-y-3">
            <motion.h3
              variants={itemVariants}
              className="text-white text-3xl md:text-4xl lg:text-5xl font-normal font-geist tracking-tighter"
            >
              Welcome Back to Your AI Creation Hub
            </motion.h3>

            <Separator className="h-px bg-white/20 w-[100px] mr-auto" />

            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-md md:text-xl font-geist tracking-tight"
            >
              Log in to access tools for AI-generated music, comedy videos, and viral content creation. Perfect for Instagram, TikTok, and beyond!
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex items-center -space-x-2 overflow-hidden"
            >
              <img
                src="https://randomuser.me/api/portraits/women/79.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <p className="text-sm text-gray-400 font-medium translate-x-5">
                Join 5.000+ users
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
        <div
          className="absolute inset-0 my-auto h-full"
          style={
            {
              // background: "linear- gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)", filter: "blur(118px)"
            }
          }
        >
          <div className="absolute  inset-0 opacity-15  w-full w-full bg-transparent  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <img
            className="absolute inset-x-0 -top-20 opacity-25 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center min-h-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md md:max-w-lg space-y-8 px-4 text-gray-600 sm:px-0 z-20"
        >
          <motion.div variants={itemVariants} className="relative">
            <img
              src="logo.webp"
              width={100}
              className="lg:hidden rounded-full"
            />
            <div className="mt-5 space-y-2">
              <motion.h3
                variants={itemVariants}
                className="flex items-center text-3xl font-semibold tracking-tighter sm:text-4xl"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4BC0C8] to-[#C779D0] mr-2">Log in</span>🙏
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C779D0] to-[#FEAC5E]"> - Welcome back to VibeVision</span>
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-gray-400"
              >
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </Link>
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-x-3"
          >
            {socialButtons.map((social) => (
              <motion.button
                key={social.provider}
                variants={socialButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSocialLogin(social.provider as any)}
                disabled={socialLoading === social.provider}
                className="group flex transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] border-white/10 items-center justify-center py-5 border rounded-lg hover:bg-transparent/50 duration-150 active:bg-transparent/50 disabled:opacity-50"
              >
                {socialLoading === social.provider ? (
                  <div className="animate-spin">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </div>
                ) : (
                  <social.icon
                    className={cn(
                      "w-6 h-6 group-hover:scale-110 transition-transform",
                      {
                        "text-black dark:text-white": social.provider === 'github',
                        "text-[#4285F4]": social.provider === 'google',
                        "text-[#1DA1F2]": social.provider === 'twitter'
                      }
                    )}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <Separator className="my-6" />

          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            variants={containerVariants}
            className="space-y-5"
          >
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={containerVariants}
              className="space-y-3"
            >
              <motion.div variants={itemVariants}>
                <Label className="font-medium text-gray-300">Email</Label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Input
                    type="email"
                    {...form.register("email")}
                    className="w-full bg-transparent border-white/10 text-white focus:border-indigo-600"
                    placeholder="neil@example.com"
                  />
                </motion.div>
                <AnimatePresence>
                  {form.formState.errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {form.formState.errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label className=" font-medium text-gray-300">Password</Label>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="relative"
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="w-full pr-10"
                  />
                  <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2/3 pb-3 -translate-y-1/2"
              >
                {showPassword ?  (<Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />)}
              </button>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
                  )}
                </motion.div>
                <AnimatePresence>
                  {form.formState.errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {form.formState.errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-400"
                >
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full font-geist tracking-tighter text-center rounded-md bg-gradient-to-br from-purple-400 to-purple-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear"
                    }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      className=" h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </motion.div>
                ) : (
                  "Log in"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </motion.main>
  );
}