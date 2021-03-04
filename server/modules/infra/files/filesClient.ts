export abstract class FilesClient {
  public abstract async createFolder(folderName, parentId): Promise<any>;
  public abstract async replaceTextBatch(fileId, replacements: { match: string; replace: string }[]): Promise<any>;
  public abstract async copyFile(fileId, toFolderId): Promise<any>;
  public abstract async getSubFolderByName(folderName, parentId): Promise<any>;
  public abstract async exportPDF(file, destPath): Promise<void>;
  public abstract async upload(filePath, fileName, folderId): Promise<void>;
}
