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
      console.log(`[Storage.read] about to download ${fileName}`);
      const result = await file.download();
      console.log(`[Storage.read] ${fileName} downloaded successfully`);
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
      console.log(`[Storage.write] about to save ${fileName}`);
      await file.save(data, { resumable: false });
      console.log(`[Storage.write] ${fileName} saved successfully`);
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

  createReadStream(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      return file.createReadStream();
    }
    return createReadStream(getPath(fileName));
  }

  createWriteStream(fileName) {
    if (this.isCloud) {
      const file = this.bucket.file(fileName);
      return file.createWriteStream();
    }
    return createWriteStream(getPath(fileName));
  }
};
