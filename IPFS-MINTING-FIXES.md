# IPFS Minting Fixes

This document outlines the improvements made to the IPFS minting functionality in the CarP2P application.

## Overview of Changes

The following issues have been identified and fixed:

1. **Mismatch in function parameter structure**: The `mintVehicleNFT` hook was updated to accept a properly typed object with `vehicleData` and `tokenMetadata`.

2. **Better error handling for missing IPFS Pinata credentials**: The upload API now gracefully handles missing API keys by using a default image.

3. **Improved user feedback during IPFS upload and minting**: Added separate loading states for IPFS upload and minting processes, with a clear visualization in the UI.

4. **Default image handling**: Added a proper default image CID and fallback mechanism if image upload fails.

5. **Better error presentation**: Added a dedicated error screen with retry functionality.

## Implementation Details

### 1. Hook Parameter Structure Fix

The `useVehicleNFT` hook was updated to:
- Accept parameters in an object format matching how it's called in the component 
- Use a TypeScript type definition for better type safety
- Not require initial values at hook initialization time

### 2. IPFS Upload API Improvements

The IPFS upload API endpoint now:
- Checks for Pinata credentials and provides a graceful fallback
- Handles errors during image and metadata uploads separately
- Uses a consistent default image CID
- Includes more detailed error information
- Preserves response structure for better client handling

### 3. UI Feedback Improvements

The tokenize page now:
- Shows distinct loading states for IPFS upload vs. NFT minting
- Provides a spinning indicator with descriptive text
- Disables the submit button during processing
- Shows a dedicated error screen with retry option
- Preserves user form data if errors occur

## Environment Variables

For proper functionality in production, make sure Vercel has these environment variables configured:

- `PINATA_API_KEY`: Your Pinata API key
- `PINATA_API_SECRET`: Your Pinata API secret
- `NEXT_PUBLIC_DEFAULT_IMAGE_CID`: A fallback IPFS CID for default car image (optional)

## Testing the Flow

1. Complete the multi-step form with vehicle information
2. Submit the form
3. The application will upload metadata and image to IPFS (with proper loading indicators)
4. Upon successful IPFS upload, it will mint the NFT
5. User will be redirected to a success page or shown appropriate error messages

## Troubleshooting

If issues persist:
- Check Vercel environment variables
- Verify that the contract address in `addresses.json` is correct
- Ensure the wallet has enough funds for gas fees
- Check browser console for detailed error messages 