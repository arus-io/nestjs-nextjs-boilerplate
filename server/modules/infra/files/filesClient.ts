export abstract class FilesClient {
  public abstract createFolder(folderName, parentId): Promise<any>;
  public abstract replaceTextBatch(fileId, replacements: { match: string; replace: string }[]): Promise<any>;
  public abstract copyFile(fileId, toFolderId): Promise<any>;
  public abstract getSubFolderByName(folderName, parentId): Promise<any>;
  public abstract exportPDF(file, destPath): Promise<void>;
  public abstract upload(filePath, fileName, folderId): Promise<void>;
}
