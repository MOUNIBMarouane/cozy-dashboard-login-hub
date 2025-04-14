
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "@/components/auth/SignupForm";
import Logo from "@/components/ui/Logo";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo className="mb-2" />
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
