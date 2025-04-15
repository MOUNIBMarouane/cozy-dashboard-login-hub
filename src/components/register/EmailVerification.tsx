
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import authService from '@/services/authService';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = useParams<{ email?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      console.log("No email found in URL params");
    }
  }, [email]);

  const handleResendCode = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email is missing. Please ensure you have a valid email.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resendVerificationCode(email);
      toast({
        title: "Success",
        description: "Verification code has been resent to your email.",
      });
    } catch (error: any) {
      console.error("Error resending verification code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend verification code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email is missing. Please ensure you have a valid email in the URL.",
      });
      setIsLoading(false);
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await authService.verifyEmail(email, verificationCode);
      if (success) {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        navigate('/welcome', { 
          state: { 
            verified: true,
            email: email
          }
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "The verification code you entered is incorrect. Please check and try again.",
        });
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "The verification code is invalid or has expired. Please request a new code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <Card className="w-full max-w-md p-8 border-gray-800 bg-gradient-to-b from-[#161b22] to-[#0d1117] shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2 px-8 pt-6 border-b border-gray-800">
          <DocuVerseLogo className="mx-auto h-10 w-auto text-docuBlue" />
          <CardTitle className="text-2xl font-semibold text-white mt-4">Email Verification</CardTitle>
          <CardDescription className="text-gray-400">
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 pt-6">
          <div className="mx-auto bg-blue-900/20 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            We've sent a verification code to:
            <p className="font-medium text-blue-400 mt-1">{email}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code" className="text-gray-300">Verification Code</Label>
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              className="gap-2"
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}  {/* Add the index prop here to fix the error */}
                      {...slot}
                      className="w-10 h-12 text-lg border-gray-700 bg-[#1c2333] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleVerifyEmail} 
              disabled={isLoading}
              className="w-full bg-docuBlue hover:bg-docuBlue-700"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
            
            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </div>
          
          <div className="flex justify-center pt-4 border-t border-gray-800 mt-4">
            <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
