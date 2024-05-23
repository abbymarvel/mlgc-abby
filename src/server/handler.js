const modelPredict = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');

const predictionHistories = [];

// Handler for prediction request
async function postPredict(req, h) {
  const { image } = req.payload;
  const { model } = req.server.app;

  // Perform model prediction
  const { confidenceScore, label, suggestion } = await modelPredict(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Create prediction data object
  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  // Store prediction history
  predictionHistories.push(data);

  await storeData(id,data);

  // Prepare and send response
  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully',
    data,
  });
  response.code(201);
  return response;
}

// Handler for fetching prediction histories
async function getHistories(req, h) {
  try {
    // Map prediction histories to desired format
    const data = predictionHistories.map(({ id, result, createdAt, suggestion }) => ({
      id,
      history: {
        result,
        createdAt,
        suggestion,
        id,
      },
    }));

    // Prepare and send response
    const response = h.response({
      status: 'success',
      data,
    });
    return response;
  } catch (error) {
    // Handle errors and send response
    return h.response({ message: error.message });
  }
}

module.exports = {
  getHistories,
  postPredict,
};
