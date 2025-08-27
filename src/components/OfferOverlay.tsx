// src/components/OfferOverlay.tsx
import React from 'react';
import { X, Gift, Sparkles, ArrowRight } from 'lucide-react';

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  const handleActionClick = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto text-center p-8 border border-gray-200 relative dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl transform scale-100 opacity-100 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Thumbnail Image */}
        <div className="mb-6">
          <img
            src="https://res.cloudinary.com/dvue2zenh/image/upload/v1756304933/aknwm73c5cc0elpcfgll.png" // Example Pexels image URL for Vinayaka Chavithi
            alt="Vinayaka Chavithi Offer"
            className="w-full h-40 object-cover rounded-2xl shadow-md mx-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          🎉 Vinayaka Chavithi Offer! 🎉
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Celebrate with us! Get an **additional 50% OFF** on our **Career Pro Max (₹10,000) plan** using code <strong className="text-purple-600 dark:text-neon-purple-400">VNKR50%</strong>. Limited time offer!
        </p>

        {/* Call to Action */}
        <button
          onClick={handleActionClick}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>Claim Your Offer Now!</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Small print */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Offer valid until September 10, 2025. Terms and conditions apply.
        </div>
      </div>
    </div>
  );
};
