import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '@/config';

const client = new S3Client({
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_key,
  }
});

function getObjectUrl(key: string) {
  const bucketName = config.aws.bucket;
  const region = config.aws.region;
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  return url;
}

async function uploadS3(files: any, bucketName: string) {
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
    const url = getObjectUrl(file.originalname);
    resultUrls.push(url);
    result.push({
      filePath: url,
      fileName: file.originalname,
      name: nameWithoutExtension,
    })
    const command = new PutObjectCommand(params);
    return client.send(command);
  })).then((data) => {
    console.log(data, 'data...');
    data.forEach((res: any, index: number) => {
      if (res.status === 'fulfilled') {
      } else {
        result[index] = undefined;
      }
    })
  });
  return result;
}

export default uploadS3;