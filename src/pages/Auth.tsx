import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { 
  Eye, 
  EyeOff, 
  User, 
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

// Floating Label Input Component
const FloatingInput = ({
  id,
  type,
  label,
  value,
  onChange,
  onBlur,
  icon: Icon,
  error,
  touched,
  disabled,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  icon: React.ElementType;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="space-y-2">
      <div className="relative group">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${
          touched && !error && hasValue
            ? 'text-emerald-400' 
            : error && touched
              ? 'text-red-400' 
              : isFocused 
                ? 'text-emerald-400'
                : 'text-muted-foreground'
        }`} />
        
        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-300 pointer-events-none z-10 ${
            isActive
              ? 'top-2 text-xs text-emerald-400'
              : 'top-1/2 -translate-y-1/2 text-base text-muted-foreground'
          }`}
        >
          {label}
        </label>

        <input
          id={id}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          disabled={disabled}
          className={`w-full h-16 pl-12 pr-12 pt-5 pb-2 bg-white/5 border rounded-2xl 
            text-foreground placeholder:text-transparent
            transition-all duration-300 outline-none
            focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${touched && !error && hasValue 
              ? 'border-emerald-400/50' 
              : error && touched 
                ? 'border-red-400/50' 
                : 'border-white/10 hover:border-white/20'
            }`}
        />

        {/* Validation Icons */}
        {touched && !error && hasValue && !showPasswordToggle && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </motion.div>
        )}
        {error && touched && !showPasswordToggle && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
          </motion.div>
        )}

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/10"
            onClick={onTogglePassword}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && touched && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-400 pl-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated Orb Component
const AnimatedOrb = ({ 
  color, 
  size, 
  initialX, 
  initialY,
  duration 
}: { 
  color: string;
  size: number;
  initialX: string;
  initialY: string;
  duration: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${color}`}
    style={{
      width: size,
      height: size,
      left: initialX,
      top: initialY,
    }}
    animate={{
      x: [0, 100, -50, 80, 0],
      y: [0, -80, 60, -40, 0],
      scale: [1, 1.2, 0.9, 1.1, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  />
);

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "fullName":
        if (!value || value.trim().length < 2) {
          return "Full name must be at least 2 characters";
        }
        return "";
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields based on mode
    const fieldsToValidate = mode === "login" 
      ? ["email", "password"]
      : ["fullName", "email", "password", "confirmPassword"];
    
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    if (mode === "login") {
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
    } else {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
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
        description: "Welcome to Dragon AI Robot! Redirecting to your dashboard...",
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate("/dashboard");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setTouched({});
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  const isFormValid = mode === "login"
    ? !validateEmail(formData.email) && !validatePassword(formData.password)
    : formData.fullName.trim().length >= 2 &&
      !validateEmail(formData.email) &&
      !validatePassword(formData.password) &&
      formData.password === formData.confirmPassword;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] relative overflow-hidden flex items-center justify-center">
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedOrb 
          color="bg-emerald-500" 
          size={400} 
          initialX="10%" 
          initialY="20%" 
          duration={20}
        />
        <AnimatedOrb 
          color="bg-blue-500" 
          size={350} 
          initialX="60%" 
          initialY="50%" 
          duration={25}
        />
        <AnimatedOrb 
          color="bg-emerald-400" 
          size={200} 
          initialX="80%" 
          initialY="10%" 
          duration={18}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#050810]">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Glassmorphism Card */}
        <motion.div
          className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {mode === "login" 
                  ? "Sign in to access your trading dashboard" 
                  : "Start your investment journey today"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8 p-6 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg text-emerald-400">
                      {mode === "login" ? "Login Successful!" : "Account Created!"}
                    </h3>
                    <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-5 ${isSuccess ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-4 border-b border-white/10">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Secured with 256-bit encryption</span>
            </div>

            {/* Sign Up Only: Full Name */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FloatingInput
                    id="fullName"
                    type="text"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(value) => handleChange("fullName", value)}
                    onBlur={() => handleBlur("fullName")}
                    icon={User}
                    error={errors.fullName}
                    touched={touched.fullName}
                    disabled={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <FloatingInput
              id="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              onBlur={() => handleBlur("email")}
              icon={Mail}
              error={errors.email}
              touched={touched.email}
              disabled={isLoading}
            />

            {/* Password */}
            <FloatingInput
              id="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              onBlur={() => handleBlur("password")}
              icon={Lock}
              error={errors.password}
              touched={touched.password}
              disabled={isLoading}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Sign Up Only: Confirm Password */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FloatingInput
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(value) => handleChange("confirmPassword", value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    icon={Lock}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    disabled={isLoading}
                    showPasswordToggle
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password Link (Login only) */}
            <AnimatePresence>
              {mode === "login" && (
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-300"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Mode Switch */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-4 text-muted-foreground backdrop-blur-xl">
                  {mode === "login" ? "New to Dragon AI Robot?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="button"
                variant="outline"
                onClick={switchMode}
                className="w-full h-14 text-base font-semibold rounded-2xl border-2 border-white/20 bg-transparent hover:bg-white/10 hover:border-white/30 text-white transition-all duration-300"
                disabled={isLoading}
              >
                {mode === "login" ? "Create an Account" : "Sign In Instead"}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { icon: Bot, label: "AI-Powered" },
            { icon: Shield, label: "Secure" },
            { icon: TrendingUp, label: "24/7 Active" },
          ].map((feature, index) => (
            <motion.div 
              key={feature.label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <feature.icon className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Terms */}
        <motion.p 
          className="text-center mt-6 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          By continuing, you agree to our{" "}
          <button className="text-emerald-400 hover:underline">Terms of Service</button>
          {" "}and{" "}
          <button className="text-emerald-400 hover:underline">Privacy Policy</button>
        </motion.p>
      </div>
    </div>
  );
};

export default Auth;
