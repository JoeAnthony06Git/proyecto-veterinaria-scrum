export interface UploadableFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface IStorageService {
  uploadFile(file: UploadableFile, folder: string): Promise<string>;
}