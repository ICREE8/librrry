import { NextRequest, NextResponse } from 'next/server';
import PinataClient from '@pinata/sdk';
import { Readable } from 'stream';

// Default image CID to use if no image is provided or if there's an error
const DEFAULT_IMAGE_CID = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_CID || 'QmZ4vLGb5KWQeqC3qJxQgjuV8GV1YBDwgdU4AJth3HVdEz';

// Check if Pinata credentials are available
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

// Create Pinata client if credentials are available
const pinata = PINATA_API_KEY && PINATA_API_SECRET 
  ? new PinataClient({
      pinataApiKey: PINATA_API_KEY,
      pinataSecretApiKey: PINATA_API_SECRET,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Pinata client is available
    if (!pinata) {
      console.warn('Pinata API credentials are missing. Using default image.');
      const metadata = await request.formData().then(form => form.get('metadata') as string);
      
      if (!metadata) {
        return NextResponse.json({ error: 'Metadata is required' }, { status: 400 });
      }
      
      // Parse metadata and add default image
      const metadataObj = JSON.parse(metadata);
      metadataObj.image = `ipfs://${DEFAULT_IMAGE_CID}`;
      
      // Return a mock metadata URI since we can't upload to IPFS
      return NextResponse.json({ 
        metadataUri: `ipfs://${DEFAULT_IMAGE_CID}`,
        warning: 'Using default image due to missing Pinata credentials'
      }, { status: 200 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const metadata = formData.get('metadata') as string;
    const placa = formData.get('placa') as string;

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 });
    }

    let imageCid = '';
    if (imageFile) {
      try {
        // Convert File to Buffer and create a readable stream
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const fileName = `car-image-${placa || 'unknown'}.${imageFile.name.split('.').pop()}`;
        const imageUploadResult = await pinata.pinFileToIPFS(stream, {
          pinataMetadata: {
            name: fileName,
          },
        });
        imageCid = `ipfs://${imageUploadResult.IpfsHash}`;
      } catch (imageError) {
        console.error('Error uploading image to IPFS:', imageError);
        imageCid = `ipfs://${DEFAULT_IMAGE_CID}`;
      }
    } else {
      console.log('No image provided, using default image');
      imageCid = `ipfs://${DEFAULT_IMAGE_CID}`;
    }

    const metadataObj = JSON.parse(metadata);
    metadataObj.image = imageCid;
    
    try {
      const metadataUploadResult = await pinata.pinJSONToIPFS(metadataObj, {
        pinataMetadata: {
          name: `metadata-${placa || 'unknown'}.json`,
        },
      });
      const metadataUri = `ipfs://${metadataUploadResult.IpfsHash}`;
      
      return NextResponse.json({ metadataUri }, { status: 200 });
    } catch (metadataError) {
      console.error('Error uploading metadata to IPFS:', metadataError);
      return NextResponse.json({ 
        error: 'Failed to upload metadata to IPFS', 
        details: (metadataError as Error).message 
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error in IPFS upload process:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to process upload request', 
      details: errorMessage 
    }, { status: 500 });
  }
}