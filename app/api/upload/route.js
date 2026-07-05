import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = requireAdmin(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'pushpo', resource_type: 'auto' },
        (err, res) => {
          if (err) reject(new Error(err.message));
          else resolve(res);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
