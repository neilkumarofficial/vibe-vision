"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import { Input } from "../ui/input2";
import { Label } from "../ui/label2";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@/config";
import MessageToast from "../ui/MessageToast";
import { Icons } from "../ui/icons";
import { useSearchParams } from "next/navigation";
import { SparklesCore } from "../ui/sparkles";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!@#$%^&*()]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('No Message');
  const [tokenValidation, setTokenValidation] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function validateResetToken() {
      if (!token) {
        setTokenValidation('invalid');
        return;
      }

      try {
        const response = await axios.post(`${BASE_URL}/api/auth/validate-reset-token`, { token });
        if (response.data.valid) {
          setTokenValidation('valid');
        } else {
          setTokenValidation('invalid');
        }
      } catch (error) {
        setTokenValidation('invalid');
      }
    }

    validateResetToken();
  }, [token]);

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (tokenValidation !== 'valid') {
      setToastMessage("Invalid or expired reset token");
      setToastVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        token,
        newPassword: data.password
      });

      setToastMessage(response.data.message || "Password reset successfully!");
      setToastVisible(true);

      // Redirect to login after successful reset
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      setToastMessage(errorMessage);
      setToastVisible(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (tokenValidation === 'checking') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <Icons.spinner className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (tokenValidation === 'invalid') {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
        {/* Sparkle Background Effect */}
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="forgot-password-sparkles"
            background="purple"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            particleColor="#FFFFFF"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-black/70 backdrop-blur-lg border border-white/20 text-white">
            <CardHeader className="space-y-1 w-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div className="max-w-sm w-full text-gray-600 space-y-8">
                  <motion.div className="text-left">
                    <img
                      src="logo.webp"
                      width={100}
                      className="m-auto rounded-full"
                    />
                  </motion.div>
                </motion.div>
                <CardTitle className="text-center text-red-500 text-2xl">
                  Invalid Reset Link
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-white/80">
                The password reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                Request a new reset link
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
      {/* Sparkle Background Effect */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="forgot-password-sparkles"
          background="purple"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          particleColor="#FFFFFF"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-black/70 backdrop-blur-lg border border-white/20 text-white">
          <CardHeader className="space-y-1 w-full flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div className="max-w-sm w-full text-gray-600 space-y-8">
                <motion.div className="text-left">
                  <img
                    src="logo.webp"
                    width={100}
                    className="m-auto rounded-full"
                  />
                </motion.div>
              </motion.div>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Reset Password
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center text-white/70">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-white/80">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...form.register("password")}
                    className={`
                      pr-10 text-white 
                      border-white/20 bg-white/10 
                      focus:border-purple-500
                      placeholder-white/50
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-white/60 space-y-1">
                  Password requirements:
                  <ul className="list-disc list-inside">
                    <li>At least 8 characters</li>
                    <li>Uppercase and lowercase letters</li>
                    <li>Include a number</li>
                    <li>Special character required</li>
                  </ul>
                </div>

                <AnimatePresence>
                  {form.formState.errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm"
                    >
                      {form.formState.errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword" className="text-white/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...form.register("confirmPassword")}
                    className={`
                      pr-10 text-white 
                      border-white/20 bg-white/10 
                      focus:border-purple-500
                      placeholder-white/50
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {form.formState.errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm"
                    >
                      {form.formState.errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin text-white" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          {/* Back to Login Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center pb-6"
          >
            <Link
              href="/login"
              className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </motion.div>
        </Card>
      </motion.div>

      <MessageToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        isError={toastMessage.includes("Failed")}
      />
    </div>
  );
}