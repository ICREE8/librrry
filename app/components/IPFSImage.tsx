'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Define public IPFS gateways to try
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

// Default placeholder image if none of the gateways work
const PLACEHOLDER_IMAGE = '/placeholder-image.jpg';

interface IPFSImageProps {
  ipfsUri: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function IPFSImage({
  ipfsUri,
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  objectFit = 'cover'
}: IPFSImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gatewayIndex, setGatewayIndex] = useState<number>(0);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Extract CID from IPFS URI
  const extractCID = (uri: string): string | null => {
    if (!uri) return null;
    
    // Handle ipfs:// protocol
    if (uri.startsWith('ipfs://')) {
      return uri.substring(7);
    }
    
    // Handle ipfs/CID format
    const ipfsPathMatch = uri.match(/\/ipfs\/([^/?#]+)/);
    if (ipfsPathMatch) {
      return ipfsPathMatch[1];
    }
    
    return uri; // If it's already just a CID
  };

  // Wrap tryNextGateway in useCallback
  const tryNextGateway = useCallback(() => {
    if (gatewayIndex < IPFS_GATEWAYS.length - 1) {
      setGatewayIndex(gatewayIndex + 1);
      setLoadError(false);
    } else {
      console.error('All IPFS gateways failed to load the image');
      setImageUrl(PLACEHOLDER_IMAGE);
      setIsLoading(false);
    }
  }, [gatewayIndex]);

  useEffect(() => {
    const cid = extractCID(ipfsUri);
    if (!cid) {
      console.error('Invalid IPFS URI:', ipfsUri);
      setImageUrl(PLACEHOLDER_IMAGE);
      setIsLoading(false);
      return;
    }

    const gatewayUrl = IPFS_GATEWAYS[gatewayIndex] + cid;
    console.log(`Trying IPFS gateway: ${gatewayUrl}`);
    
    // Check if the image can be loaded from this gateway
    const img = new window.Image();
    img.onload = () => {
      setImageUrl(gatewayUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setLoadError(true);
      tryNextGateway();
    };
    img.src = gatewayUrl;

    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [ipfsUri, gatewayIndex, tryNextGateway]);

  // Show loading state or placeholder
  if (isLoading || loadError) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        {isLoading && (
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )}
      </div>
    );
  }

  // Render the actual image
  return fill ? (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt={alt}
        className={className}
        fill={true}
        sizes={sizes || '100vw'}
        priority={priority}
        style={{ objectFit }}
      />
    </div>
  ) : (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      width={width || 300}
      height={height || 200}
      priority={priority}
      style={{ objectFit }}
    />
  );
} 