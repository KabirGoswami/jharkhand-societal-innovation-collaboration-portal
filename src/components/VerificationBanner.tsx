import React from 'react';
import { useAuth } from '../AuthContext';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export const VerificationBanner = () => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.verificationStatus !== 'PENDING' || dismissed) {
    return null;
  }

  return (
    <div className="bg-[#FAF7F2] border-l-4 border-[#BC5434] p-4 mb-6 flex items-start justify-between shadow-sm">
      <div className="flex items-center">
        <AlertCircle className="text-[#BC5434] mr-3 h-5 w-5" />
        <div className="text-sm">
          <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block mb-0.5">Verification Pending</span>
          <p className="text-stone-600 font-serif italic">
            Your profile is being reviewed. Some features may be limited until verified.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-stone-400 hover:text-stone-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
