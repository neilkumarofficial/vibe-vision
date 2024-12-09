"use client";
import React, { useState, useCallback } from "react";
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
import { SparklesCore } from "../ui/sparkles";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('No Message');
  const [emailVerificationStage, setEmailVerificationStage] = useState<'initial' | 'verifying' | 'verified'>('initial');

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const checkEmailExistence = useCallback(async (email: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/check-email`, { email });
      return response.data.exists;
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  }, []);

  const sendPasswordResetLink = useCallback(async (email: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error('Failed to send reset link');
    }
  }, []);

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    setEmailVerificationStage('verifying');

    try {
      // Step 1: Check if email exists in the system
      const emailExists = await checkEmailExistence(data.email);

      if (!emailExists) {
        setToastMessage("No account found with this email");
        setToastVisible(true);
        setEmailVerificationStage('initial');
        return;
      }

      // Step 2: Send password reset link
      await sendPasswordResetLink(data.email);

      setEmailVerificationStage('verified');
      setToastMessage("Password reset link sent to your email");
      setToastVisible(true);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to process your request";
      setToastMessage(errorMessage);
      setToastVisible(true);
      setEmailVerificationStage('initial');
    } finally {
      setIsLoading(false);
    }
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
                Forgot Password
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center text-white/70">
              {emailVerificationStage === 'initial'
                ? "Enter your email to reset your password"
                : emailVerificationStage === 'verifying'
                  ? "Verifying your account..."
                  : "Reset link sent successfully"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="neil@example.com"
                  {...form.register("email")}
                  disabled={emailVerificationStage !== 'initial'}
                  className={`
                    ${emailVerificationStage === 'verified'
                      ? "border-green-500"
                      : emailVerificationStage === 'verifying'
                        ? "opacity-50 cursor-not-allowed"
                        : "border-white/20 bg-white/10 focus:border-purple-500"}
                    text-white placeholder-white/50
                  `}
                />
                <AnimatePresence>
                  {form.formState.errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm"
                    >
                      {form.formState.errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  type="submit"
                  disabled={
                    isLoading ||
                    emailVerificationStage === 'verified' ||
                    emailVerificationStage === 'verifying'
                  }
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin text-white" />
                  ) : emailVerificationStage === 'verified' ? (
                    <Icons.check className="mr-2 h-4 w-4 text-green-400" />
                  ) : (
                    ""
                  )}
                  {emailVerificationStage === 'verified' ? "Link Sent" : "Send Reset Link"}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          {emailVerificationStage === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pb-6 text-sm text-white/70"
            >
              Check your email for the password reset link.
              <br />
              Link expires in 15 minutes.
            </motion.div>
          )}

          {emailVerificationStage === 'initial' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pb-6"
            >
              <Link
                href="/login"
                className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                Back to Login
              </Link>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <MessageToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        isError={toastMessage.includes("Failed") || toastMessage.includes("No account")}
      />
    </div>
  );
};