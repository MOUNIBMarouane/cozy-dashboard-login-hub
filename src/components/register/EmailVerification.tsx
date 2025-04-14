
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useMultiStepForm } from '@/context/form';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import authService from '@/services/authService';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = useParams<{ email?: string }>();
  const navigate = useNavigate();
  const { verifyEmail } = useMultiStepForm();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      // If no email in URL, check if we can grab it from context
      // This is a fallback if redirection didn't work properly
      console.log("No email found in URL params");
    }
  }, [email]);

  // Function to handle resending verification code
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

    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call verifyEmail with email from URL and the entered code
      const success = await authService.verifyEmail(email, verificationCode);
      if (success) {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        // Redirect to welcome page after successful verification
        navigate('/welcome', { 
          state: { 
            verified: true,
            email: email
          }
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email verification failed. Please check the code and try again.",
        });
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during email verification.",
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
            <Input
              id="code"
              placeholder="Enter verification code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-[#1c2333] border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
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
