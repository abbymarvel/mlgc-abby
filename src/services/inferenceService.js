const tf = require('@tensorflow/tfjs-node');

async function modelPredict(model, image) {
    // Preprocess the image
    const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

    // Get the prediction from the model
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    // Determine the label based on confidence score
    let label;
    let suggestion;

    if (confidenceScore === 0) {
        label = 'failed';
        suggestion = 'failed';
    } else {
        label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';
        suggestion = label === 'Cancer' ? 'Segera periksa ke dokter!' : 'Anda sehat!';
    }

    // Return the result
    return { confidenceScore, label, suggestion };
}

module.exports = modelPredict;