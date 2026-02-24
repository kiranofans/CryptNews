import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PinterestWidgetProps {
  url: string;
  media: string;
  description: string;
  compact?: boolean;
}

export const PinterestWidget: React.FC<PinterestWidgetProps> = ({ url, media, description, compact = false }) => {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`;
    
    // Open in a popup window centered on screen
    const width = 750;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      pinterestUrl, 
      'pinterest-share', 
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
    );
  };

  if (compact) {
    return (
      <button
        onClick={handleSave}
        className="flex items-center bg-white rounded-full overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 group"
      >
        <div className="p-2 bg-white text-red-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
          </svg>
        </div>
        <div className="bg-red-600 text-white px-3 py-2 font-bold text-xs">
          Save
        </div>
      </button>
    );
  }

  return (
    <div 
      className="flex items-stretch rounded-full overflow-hidden shadow-xl cursor-pointer transition-transform transform hover:scale-105"
      onClick={handleSave}
    >
      {/* Left side - Board Selection (Mock) */}
      <div className="bg-white flex items-center px-3 py-1.5 space-x-2 hover:bg-gray-50 transition-colors">
        <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
        </svg>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-gray-500 leading-none mb-0.5">Save to board</span>
          <div className="flex items-center">
            <span className="text-sm font-bold text-gray-900 leading-none">Pinterest</span>
            <ChevronDown className="w-3 h-3 ml-1 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Right side - Save Button */}
      <div className="bg-red-600 hover:bg-red-700 text-white flex items-center px-4 py-1.5 font-bold text-sm transition-colors">
        Save
      </div>
    </div>
  );
};
