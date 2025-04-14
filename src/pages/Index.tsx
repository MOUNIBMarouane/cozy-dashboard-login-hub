
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import Logo from "@/components/ui/Logo";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-8 flex items-center justify-between border-b">
        <Logo />
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center flex-col p-8">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Welcome to <span className="text-primary">DashFlow</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            A beautiful dashboard with authentication and modern UI components.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Log in</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 px-8 border-t text-center text-sm text-muted-foreground">
        <p>© 2025 DashFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
