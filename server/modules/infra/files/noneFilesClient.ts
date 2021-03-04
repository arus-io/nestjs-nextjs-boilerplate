import { FilesClient } from './filesClient';

let logged = false;
export class NoneFileClient extends FilesClient {
  protected client: any;
  constructor() {
    super();
    if (!logged) {
      console.info('This file client is for dev only');
      logged = true;
    }
  }

  public async createFolder(folderName, parentId) {
    console.log('Folder created', folderName, parentId);
    return { id: `test_${folderName}`, name: folderName };
  }

  public async getSubFolderByName(folderName, parentId) {
    return { id: `test_${folderName}`, name: folderName };
  }

  public async replaceTextBatch(fileId, replacements: { match: string; replace: string }[]) {
    console.log('replace', fileId, replacements);
    return { replies: [{}] };
  }

  public async copyFile(fileId, toFolderId) {
    return { id: fileId + 2, name: 'Copy of template' };
  }

  public async exportPDF(file: any, destPath: any) {
    console.log('Exported to PDF');
  }

  public async upload(filePath, fileName, folderId) {
    console.log('Uploaded complete');
  }
}
