const { BufferStream } = require('./utils');
const { Storage: CloudStorage } = require('@google-cloud/storage');
const {
  readFile,
  access,
  writeFile,
  createReadStream,
  createWriteStream,
  unlink,
  constants: { F_OK }
} = require('fs');
const { getPath } = require('../utils');

module.exports = class {
  constructor() {
    this.storage = new CloudStorage();
    this.bucket = null;
    this.isCloud = process.env.GCLOUD_STORAGE_ACTIVE === 'true';
    console.log(`Google Cloud storage is ${this.isCloud ? '' : 'not '}active`);
  }

  setup() {
    if (this.isCloud) {
      this.bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    }
  }

  async read(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      const result = await file.download();
      return result[0];
    }
    return new Promise((resolve, reject) =>
      readFile(getPath(fileName), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    );
  }

  async exists(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      const result = await file.exists();
      return result[0];
    }
    return new Promise(resolve => access(getPath(fileName), F_OK, err => resolve(err === null)));
  }

  async write(fileName, data) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      await file.save(data, { resumable: false });
      return;
    }
    return new Promise((resolve, reject) =>
      writeFile(getPath(fileName), data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  }

  async delete(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      await file.delete();
      return;
    }
    return new Promise((resolve, reject) =>
      unlink(getPath(fileName), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  }

  async createReadStream(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      const readStream = file.createReadStream();
      // This is an ugly workaround, because directly piping a readable stream from a cloud bucket file to
      // the Google Drive API does not seem to work: exhaust the readable stream, store the data in a buffer,
      // and return another stream that reads from this buffer.
      // @see https://stackoverflow.com/questions/57151911/unable-to-pipe-file-read-stream-from-google-cloud-storage-to-google-drive-api
      const chunks = [];
      await new Promise(resolve => readStream.on('data', chunk => chunks.push(chunk)).on('end', resolve));
      return new BufferStream(Buffer.concat(chunks));
    }
    return createReadStream(getPath(fileName));
  }

  createWriteStream(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      return file.createWriteStream({ resumable: false });
    }
    return createWriteStream(getPath(fileName));
  }
};
