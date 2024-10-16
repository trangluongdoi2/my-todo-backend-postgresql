import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import config from '@/config';
import { getFileNameWithoutExtension } from '@/common/file';
import fs from "fs";
import path from "path";

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

  private getKeyUploadByProjectId(projectId: number, fileName: string) {
    return `uploads/${projectId}/${fileName}`;
  }

  async getObject({ key, projectId }: any) {
    const keyQuery = this.getKeyUploadByProjectId(projectId, key);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: keyQuery,
    });
    try {
      const res = await this.client.send(command);
      // Need research why the base64 is allow create blob and 'uint-8' is not
      const data =  await res.Body?.transformToString('base64');
      return data;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  private getKeyUploadByUserId(userId: number, fileName: string) {
    return `uploads/users/${userId}/${fileName}`;
  }

  private getObjectUrl(key: string) {
    const url = `${config.aws.cdn_url}/${key}`;
    return url;
  }

  // async uploadS3Test(projectId: number, uploadParams: any) {
  //   const filePath = path.join(__dirname, '../uploads/hehe49.jpg');
  //   const fileStream = fs.createReadStream(filePath);
  //   const key = this.getKeyUploadByProjectId(projectId, 'hehe49.jpg');
  //   const upload = new Upload({
  //     client: this.client,
  //     params: {
  //       Bucket: this.bucket,
  //       Key: key,
  //       Body: fileStream,
  //       ContentType: uploadParams.ContentType,
  //     },
  //   });
  //   upload.on("httpUploadProgress", (progress) => {
  //     console.log(progress);
  //   });
  //   try {
  //     const result = await upload.done();
  //     console.log("Upload successful:", result);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // }

  async uploadS3(projectId: number, uploadParams: any, files: any) {
    const resultUrls: any[] = [];
    const result: Array<Record<string, any> | undefined> = [];
    await Promise.allSettled(files.map((file: any) => {
      const nameWithoutExtension = getFileNameWithoutExtension(file.originalname);
      const metaData = {
        name: nameWithoutExtension,
      }
      const key = this.getKeyUploadByProjectId(projectId, file.originalname);
      const params = {
        Bucket: uploadParams.Bucket,
        Key: key,
        ContentType: uploadParams.ContentType,
        Body: file.buffer,
        MetaData: metaData,
      }
      const url = this.getObjectUrl(key);
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

  async uploadS3MultiPart(projectId: number, uploadParams: any, files: any) {
    const result: Array<Record<string, any> | undefined> = [];
    const promises: Promise<any>[] = [];
    try {
      files.map((file: any) => {
        const key = this.getKeyUploadByProjectId(projectId, file.originalname);
        const upload = new Upload({
          client: this.client,
          params: {
            Bucket: this.bucket,
            Key: key,
            ContentType: uploadParams.ContentType,
            Body: file.buffer,
          },
        });
        // upload.on('httpUploadProgress', (progress) => {
        // });
        promises.push(upload.done());
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error(`Multipart upload was aborted. ${error.message}`);
      } else {
        throw error;
      }
    }
    const res = await Promise.all(promises);
    res.map((item: any) => {
      result.push({
        filePath: item.Location,
        fileName: item.originalname || '',
        name: getFileNameWithoutExtension(item.Key),
      })
    });
    return result;
  }

  async uploadS3MultiPart2(projectId: number, uploadParams: any, files: any) {
    let uploadId: string;
    try {
      const firstFile = files[0];
      const key = this.getKeyUploadByProjectId(projectId, files.originalname);
      const multipartUpload = await this.client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      uploadId = multipartUpload.UploadId as string;

      const uploadPromises = [];
      // Multipart uploads require a minimum size of 100 MB per part.
      const minPartSize = 100 * 1024 * 1024; // 100 MB
      // Calculate part size to be within allowable range
      const partSize = Math.max(Math.ceil(firstFile.Body.length / 100), minPartSize);
      // Calculate the number of parts
      const numParts = Math.ceil(firstFile.Body.length / partSize);

      // Upload each part.
      for (let i = 0; i < numParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, firstFile.Body.length);
        uploadPromises.push(
          this.client.send(
            new UploadPartCommand({
              Bucket: this.bucket,
              Key: key,
              UploadId: uploadId,
              Body: firstFile.Body.slice(start, end),
              PartNumber: i + 1,
            }))
            .then((d) => d)
        );
      }
      const uploadResults = await Promise.all(uploadPromises);
      // Run CompleteMultipartUploadCommand after the upload all parts
      const completeUploading = await this.client.send(
        new CompleteMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: uploadResults.map(({ ETag }, i) => ({
              ETag,
              PartNumber: i + 1,
            })),
          },
        })
      );
      console.log(completeUploading, '==> completeUploading...');
      // return [completeUploading];
      return [];

    } catch (error) {
      console.error(error, '==> error...');
    }
  }

  async handleUploadImage(projectId: number, files: File[] = []) {
    if (!files?.length) {
      return [];
    }
    try {
      const uploadParams = {
        ContentType: 'image/jpeg',
        Bucket: this.bucket,
      }
      return await this.uploadS3(projectId, uploadParams, files);
    } catch (error) {
      return [];
    }
  }

  async handleUploadVideo(projectId: number, files: File[] = []) {
    if (!files?.length) {
      return [];
    }
    const uploadParams = {
      ContentType: 'video/*',
      Bucket: this.bucket,
    }
    return await this.uploadS3MultiPart(projectId, uploadParams, files);
  }
}

export default new UploadS3Service();