# Vercel Deployment Guide

This guide will help you set up the NFT minting application for deployment on Vercel.

## Prerequisites

Before deploying, make sure you have:

1. A Vercel account: [Sign up here](https://vercel.com/signup) if you don't have one
2. A GitHub repository with your code

## Environment Variables

Set the following environment variables in your Vercel project settings:

| Variable Name | Description |
|---------------|-------------|
| `REACT_APP_WALLETCONNECT_PROJECT_ID` | Your WalletConnect Project ID (get one at [WalletConnect Cloud](https://cloud.walletconnect.com/)) |
| `PINATA_API_KEY` | Your Pinata API Key for IPFS storage |
| `PINATA_API_SECRET` | Your Pinata API Secret |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Your OnchainKit API Key |
| `NEXT_PUBLIC_DEFAULT_IMAGE_CID` | Default IPFS CID for NFT images (already set to `QmZ4vLGb5KWQeqC3qJxQgjuV8GV1YBDwgdU4AJth3HVdEz`) |

## Deployment Steps

1. Connect your GitHub repository to Vercel
   - Log in to your Vercel account
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the "basebathches-2025" directory as the root directory if your repo has multiple projects

2. Configure project settings
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. Add Environment Variables
   - Add all the variables listed above in the "Environment Variables" section
   - Make sure to keep sensitive values like API keys private

4. Deploy
   - Click "Deploy"
   - Wait for the build to complete

## Troubleshooting

If you encounter any build errors:

1. Check that all environment variables are correctly set
2. Ensure WalletConnect Project ID is valid
3. Verify that Pinata API keys are correct if you're using IPFS image upload functionality

For issues with network detection or chain switching, remember that the app is configured to work with Base Sepolia testnet exclusively.

## Performance Optimizations

For better performance with Vercel:

1. Enable the Vercel Edge Network for better global distribution
2. Consider using Vercel's Image Optimization features for the NFT images
3. Set up Vercel Analytics to monitor application performance

## Support

If you need assistance with deployment or encounter issues, please create an issue in the GitHub repository or contact the development team. 