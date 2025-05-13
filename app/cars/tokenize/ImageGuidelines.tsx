'use client';

import { useState } from 'react';

export default function ImageGuidelines() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
      >
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
        </svg>
        Image Upload Guidelines
      </button>
      
      {isOpen && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200">
          <h4 className="font-semibold text-lg mb-2">For Best Results:</h4>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li><strong>Size:</strong> 1200 x 900 pixels (4:3 aspect ratio)</li>
            <li><strong>Format:</strong> JPG or PNG (JPG preferred for photos)</li>
            <li><strong>File size:</strong> Under 10MB (smaller is better)</li>
            <li><strong>Lighting:</strong> Well-lit, clear images of your vehicle</li>
            <li><strong>Angles:</strong> Include front, side, and interior views if possible</li>
          </ul>
          <p className="font-medium">Your image will be converted to an NFT and stored on IPFS - a permanent, decentralized file system.</p>
        </div>
      )}
    </div>
  );
} 