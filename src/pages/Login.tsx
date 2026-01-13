import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Bot,
  Shield,
  TrendingUp
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Animation states
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") {
      setErrors({ ...errors, email: validateEmail(formData.email) });
    } else {
      setErrors({ ...errors, password: validatePassword(formData.password) });
    }
  };

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      if (field === "email") {
        setErrors({ ...errors, email: validateEmail(value) });
      } else {
        setErrors({ ...errors, password: validatePassword(value) });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setIsLoading(false);
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before logging in.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSuccess(true);
    toast({
      title: "Login Successful! 🎉",
      description: "Redirecting to your dashboard...",
    });
    
    // Wait for success animation before redirecting
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate("/dashboard");
  };

  const isFormValid = !validateEmail(formData.email) && !validatePassword(formData.password);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            {/* Logo and Header */}
            <div 
              className={`text-center mb-8 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                    <Bot className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                    <TrendingUp className="w-3 h-3 text-accent-foreground" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back to{" "}
                <span className="text-gradient">AI Wealth Builder</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your investment dashboard
              </p>
            </div>

            {/* Success State */}
            {isSuccess && (
              <div 
                className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-2xl animate-scale-in"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-accent">Login Successful!</h3>
                    <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                </div>
              </div>
            )}

            {/* Login Form Card */}
            <div 
              className={`transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${isSuccess ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50 space-y-5 backdrop-blur-xl">
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-4 border-b border-border/50">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>Secured with 256-bit encryption</span>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        touched.email && !errors.email 
                          ? 'text-accent' 
                          : errors.email 
                            ? 'text-destructive' 
                            : 'text-muted-foreground group-focus-within:text-primary'
                      }`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 h-12 transition-all duration-300 ${
                          touched.email && !errors.email 
                            ? 'border-accent focus-visible:ring-accent' 
                            : errors.email 
                              ? 'border-destructive focus-visible:ring-destructive' 
                              : ''
                        }`}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        disabled={isLoading}
                        required
                      />
                      {touched.email && !errors.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-scale-in" />
                      )}
                      {errors.email && touched.email && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive animate-scale-in" />
                      )}
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link
                        to="#"
                        className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                        onClick={() => toast({
                          title: "Password Reset",
                          description: "Password reset functionality coming soon!",
                        })}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        touched.password && !errors.password 
                          ? 'text-accent' 
                          : errors.password 
                            ? 'text-destructive' 
                            : 'text-muted-foreground group-focus-within:text-primary'
                      }`} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-12 h-12 transition-all duration-300 ${
                          touched.password && !errors.password 
                            ? 'border-accent focus-visible:ring-accent' 
                            : errors.password 
                              ? 'border-destructive focus-visible:ring-destructive' 
                              : ''
                        }`}
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                      disabled={isLoading}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-muted-foreground cursor-pointer select-none"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full h-12 text-base" 
                    size="lg"
                    disabled={isLoading || !isFormValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">
                        New to AI Wealth Builder?
                      </span>
                    </div>
                  </div>

                  {/* Register Link Button */}
                  <Link to="/register" className="block">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 text-base border-2 hover:border-primary/50" 
                      size="lg"
                      disabled={isLoading}
                    >
                      Create an Account
                    </Button>
                  </Link>
                </div>
              </form>
            </div>

            {/* Features */}
            <div 
              className={`mt-8 grid grid-cols-3 gap-4 transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {[
                { icon: Bot, label: "AI-Powered" },
                { icon: Shield, label: "Secure" },
                { icon: TrendingUp, label: "24/7 Active" },
              ].map((feature, index) => (
                <div 
                  key={feature.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/30 text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Terms */}
            <p 
              className={`text-center mt-6 text-xs text-muted-foreground transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              By signing in, you agree to our{" "}
              <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
