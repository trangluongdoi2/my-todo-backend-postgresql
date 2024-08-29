import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '@/config';
import uploadS3 from '@/utils/uploadS3';

class UploadS3Service {
  private client;
  private bucket;
  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: config.aws.access_key,
        secretAccessKey: config.aws.secret_key,
      }
    });
    this.bucket = config.aws.bucket;
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    try {
      const res = await this.client.send(command);
      // Need research why the base64 is allow create blob and 'uint-8' is not
      const data =  await res.Body?.transformToString('base64');
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  getObjectUrl(key: string) {
    const bucketName = this.bucket;
    const region = config.aws.region;
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return url;
  }

  async uploadS3(files: any, bucketName: string) {
    const resultUrls: any[] = [];
    const result: Array<Record<string, any> | undefined> = [];
    await Promise.allSettled(files.map((file: any) => {
      const [nameWithoutExtension] = file.originalname.split(/(?=\.[^.]+$)/);
      const metaData = {
        name: nameWithoutExtension,
      }
      const params = {
        Bucket: bucketName,
        Key: file.originalname,
        ContentType: 'image/jpeg',
        Body: file.buffer,
        MetaData: metaData,
      }
      const url = this.getObjectUrl(file.originalname);
      resultUrls.push(url);
      result.push({
        filePath: url,
        fileName: file.originalname,
        name: nameWithoutExtension,
      })
      const command = new PutObjectCommand(params);
      return this.client.send(command);
    })).then((data) => {
      data.forEach((res: any, index: number) => {
        if (res.status === 'fulfilled') {
        } else {
          result[index] = undefined;
        }
      })
    });
    return result;
  }

  async handle(files: File[] = []) {
    if (!files?.length) {
      return [];
    }
    try {
      return await uploadS3(files, this.bucket);
    } catch (error) {
      return [];
    }
  }
}

export default new UploadS3Service();