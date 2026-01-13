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
  User, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Bot,
  Shield,
  TrendingUp
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

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

  const validateField = (field: string, value: string | boolean) => {
    switch (field) {
      case "fullName":
        if (!value || (typeof value === "string" && value.trim().length < 2)) {
          return "Full name must be at least 2 characters";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Email is required";
        if (typeof value === "string" && !emailRegex.test(value)) {
          return "Please enter a valid email";
        }
        break;
      case "phone":
        if (value && typeof value === "string" && value.length < 10) {
          return "Please enter a valid phone number";
        }
        break;
      case "password":
        if (!value) return "Password is required";
        if (typeof value === "string" && value.length < 6) {
          return "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        break;
      case "agreeTerms":
        if (!value) return "You must agree to the terms";
        break;
    }
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
    });

    if (error) {
      setIsLoading(false);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please login instead.";
      } else if (error.message.includes("Password")) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSuccess(true);
    toast({
      title: "Account Created! 🎉",
      description: "Welcome to AI Wealth Builder! Redirecting to your dashboard...",
    });
    
    // Wait for success animation before redirecting
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate("/dashboard");
  };

  const isFormValid = 
    formData.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    formData.agreeTerms;

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
                Create <span className="text-gradient">Account</span>
              </h1>
              <p className="text-muted-foreground">
                Start your investment journey today
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
                    <h3 className="font-semibold text-lg text-accent">Account Created!</h3>
                    <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                </div>
              </div>
            )}

            {/* Form */}
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

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative group">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        touched.fullName && !errors.fullName 
                          ? 'text-accent' 
                          : errors.fullName 
                            ? 'text-destructive' 
                            : 'text-muted-foreground group-focus-within:text-primary'
                      }`} />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        className={`pl-10 h-12 ${
                          touched.fullName && !errors.fullName 
                            ? 'border-accent' 
                            : errors.fullName 
                              ? 'border-destructive' 
                              : ''
                        }`}
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        disabled={isLoading}
                        required
                      />
                      {touched.fullName && !errors.fullName && formData.fullName && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                      )}
                      {errors.fullName && touched.fullName && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                      )}
                    </div>
                    {errors.fullName && touched.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
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
                        className={`pl-10 h-12 ${
                          touched.email && !errors.email 
                            ? 'border-accent' 
                            : errors.email 
                              ? 'border-destructive' 
                              : ''
                        }`}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        disabled={isLoading}
                        required
                      />
                      {touched.email && !errors.email && formData.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                      )}
                      {errors.email && touched.email && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                      )}
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10 h-12"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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
                        className={`pl-10 pr-12 h-12 ${
                          touched.password && !errors.password 
                            ? 'border-accent' 
                            : errors.password 
                              ? 'border-destructive' 
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative group">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        touched.confirmPassword && !errors.confirmPassword 
                          ? 'text-accent' 
                          : errors.confirmPassword 
                            ? 'text-destructive' 
                            : 'text-muted-foreground group-focus-within:text-primary'
                      }`} />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-12 h-12 ${
                          touched.confirmPassword && !errors.confirmPassword 
                            ? 'border-accent' 
                            : errors.confirmPassword 
                              ? 'border-destructive' 
                              : ''
                        }`}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
                      disabled={isLoading}
                      className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link to="#" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeTerms && touched.agreeTerms && (
                    <p className="text-sm text-destructive">{errors.agreeTerms}</p>
                  )}

                  {/* Submit */}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Login Link */}
            <p 
              className={`text-center mt-6 text-muted-foreground transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
