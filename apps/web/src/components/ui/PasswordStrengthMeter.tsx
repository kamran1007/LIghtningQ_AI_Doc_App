import React from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  showRequirements = true 
}) => {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, requirements: {}, strength: 'none' };
    
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    
    const strengthLevels = {
      0: { strength: 'none', color: 'bg-gray-300', text: 'No password' },
      1: { strength: 'very-weak', color: 'bg-red-500', text: 'Very Weak' },
      2: { strength: 'weak', color: 'bg-red-400', text: 'Weak' },
      3: { strength: 'fair', color: 'bg-yellow-500', text: 'Fair' },
      4: { strength: 'good', color: 'bg-green-400', text: 'Good' },
      5: { strength: 'strong', color: 'bg-green-500', text: 'Strong' }
    };
    
    return {
      score,
      requirements,
      ...strengthLevels[score as keyof typeof strengthLevels]
    };
  };

  const strengthData = getPasswordStrength(password);
  
  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthData.color}`}
            style={{ width: `${(strengthData.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[80px]">
          {strengthData.text}
        </span>
      </div>

      {/* Requirements List */}
      {showRequirements && password && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <RequirementItem 
              met={strengthData.requirements.minLength} 
              text="At least 8 characters" 
            />
            <RequirementItem 
              met={strengthData.requirements.hasUpperCase} 
              text="One uppercase letter (A-Z)" 
            />
            <RequirementItem 
              met={strengthData.requirements.hasLowerCase} 
              text="One lowercase letter (a-z)" 
            />
            <RequirementItem 
              met={strengthData.requirements.hasNumbers} 
              text="One number (0-9)" 
            />
            <RequirementItem 
              met={strengthData.requirements.hasSpecialChar} 
              text="One special character (!@#$%^&*)" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    <span>{text}</span>
  </div>
);

export default PasswordStrengthMeter;