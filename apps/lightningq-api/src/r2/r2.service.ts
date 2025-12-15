import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import * as https from 'https';
import { randomUUID } from 'crypto';

@Injectable()
export class R2Service {
  private client: S3Client;

  constructor() {
    console.log("🔥 R2 ENDPOINT:", process.env.R2_ENDPOINT_URL);
    console.log("🔥 R2 PUBLIC URL:", process.env.R2_PUBLIC_BASE_URL);

    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.3',
          keepAlive: true,
        }),
      }),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    userFolder?: string
  ) {
    const ext = file.originalname.split('.').pop();

    // Sanitize folder names (remove trailing slashes)
    const cleanFolder = folder.replace(/\/+$/, '');
    const cleanUserFolder = userFolder ? userFolder.replace(/\/+$/, '') : null;

    // If userFolder exists → signatures/user_4
    const finalFolder = cleanUserFolder
      ? `${cleanFolder}/${cleanUserFolder}`
      : cleanFolder;

    // Full final path
    const fileName = `${finalFolder}/${randomUUID()}.${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Return public R2 URL
    return `${process.env.R2_PUBLIC_BASE_URL}/${fileName}`;
  }
}
