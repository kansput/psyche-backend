const { Storage } = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

// Konfigurasi Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

const bucketName = process.env.GCS_BUCKET_NAME;
const modelFilePath = process.env.MODEL_FILE_PATH;
let model;

// Fungsi untuk mengunduh model
async function downloadModel() {
  const localPath = path.resolve(__dirname, `../temp/${path.basename(modelFilePath)}`);
  if (!fs.existsSync(localPath)) {
    console.log('Downloading model...');
    await storage.bucket(bucketName).file(modelFilePath).download({ destination: localPath });
    console.log(`Model downloaded to ${localPath}`);
  }
  return tf.loadGraphModel(`file://${localPath}`);
}

// Fungsi untuk memuat model (cache)
async function getModel() {
  if (!model) {
    model = await downloadModel();
  }
  return model;
}

// Fungsi prediksi
async function predict(input) {
  const loadedModel = await getModel();
  const tensorInput = tf.tensor(input);
  const result = loadedModel.predict(tensorInput).arraySync();
  return result;
}

module.exports = { predict };
