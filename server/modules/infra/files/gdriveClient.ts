import { FilesClient } from './filesClient';
import fs from 'fs';
import readline from 'readline';

const { google } = require('googleapis');
const drive = google.drive('v3');
const docs = google.docs('v1');

export class GDriveClient extends FilesClient {
  constructor(credsFilePath: string) {
    super();
    const scopes = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.appdata',
    ];
    const auth = new google.auth.GoogleAuth({
      keyFile: credsFilePath,
      scopes,
    });

    google.options({ auth });
  }

  public async createFolder(folderName, parentId) {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    };
    const res = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name',
    });
    res.data.isNew = true;
    return res.data;
  }

  public async getSubFolderByName(folderName, parentId) {
    const res = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents`,
      // q: `name='${folderName}' and '${parentId}'in parents`,
      fields: 'files(id, name)',
    });
    return res.data.files && res.data.files[0];
  }

  public async replaceTextBatch(fileId, replacements: { match: string; replace: string }[]) {
    const requests = replacements.map((r) => ({
      replaceAllText: {
        containsText: {
          text: r.match,
          matchCase: true,
        },
        replaceText: r.replace,
      },
    }));
    const res = await docs.documents.batchUpdate({
      documentId: fileId,
      resource: {
        requests,
      },
    });
    return res.data;
  }

  public async copyFile(fileId, toFolderId) {
    const file = await drive.files.get({
      fileId,
      fields: 'id, name',
    });
    console.log('generating template', file.data);
    const res = await drive.files.copy({
      fileId,
      resource: {
        parents: [toFolderId],
        name: file?.data?.name,
      },
    });
    return res.data;
  }

  public async exportPDF(file, destPath) {
    const dest = fs.createWriteStream(destPath);
    const res = await drive.files.export({ fileId: file.id, mimeType: 'application/pdf' }, { responseType: 'stream' });
    await new Promise((resolve, reject) => {
      res.data.on('error', reject).pipe(dest).on('error', reject).on('finish', resolve);
    });
  }

  public async upload(filePath, fileName, folderId) {
    const fileSize = fs.statSync(filePath).size;
    const res = await drive.files.create(
      {
        requestBody: {
          parents: [folderId],
          name: fileName,
        },
        media: {
          body: fs.createReadStream(filePath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          // @ts-ignore:
          readline.clearLine();
          // @ts-ignore:
          readline.cursorTo(0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      },
    );
    return res.data;
  }

  public async __cleanup() {
    // const res2 = await drive.files.get({
    //   fileId: '1sLGV73EdLYdlcSjFrPxq1sj6pC4kM5gf18kZWKSZHLE',
    //   fields: 'parents',
    // });
    const res2 = await drive.files.list({});

    res2.data.files.forEach(async (f) => {
      try {
        const r = await drive.files.delete({ fileId: f.id });
        console.log(r);
      } catch (e) {
        console.log('er', e);
      }
    });
    console.log(res2.data);
  }
}
