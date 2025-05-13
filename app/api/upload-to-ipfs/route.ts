import { NextRequest, NextResponse } from 'next/server';
import PinataClient from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const metadata = formData.get('metadata') as string;

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 });
    }

    let imageCid = '';
    if (imageFile) {
      // Convert File to Buffer and create a readable stream
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const fileName = `car-image-${formData.get('placa')}.${imageFile.name.split('.').pop()}`;
      const imageUploadResult = await pinata.pinFileToIPFS(stream, {
        pinataMetadata: {
          name: fileName,
        },
      });
      imageCid = `ipfs://${imageUploadResult.IpfsHash}`;
    } else {
      imageCid = 'ipfs://QmDefaultImage';
    }

    const metadataObj = JSON.parse(metadata);
    metadataObj.image = imageCid;
    const metadataUploadResult = await pinata.pinJSONToIPFS(metadataObj, {
      pinataMetadata: {
        name: `metadata-${formData.get('placa')}.json`,
      },
    });
    const metadataUri = `ipfs://${metadataUploadResult.IpfsHash}`;

    return NextResponse.json({ metadataUri }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json({ error: 'Failed to upload to IPFS: ' + error.message }, { status: 500 });
  }
}