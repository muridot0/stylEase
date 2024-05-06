import * as tf from '@tensorflow/tfjs-node'

const run = async () => {
  const model = await tf.loadGraphModel('file://./style_transfer_model/model.json')
  const image = './images'
  console.log(model)
  model.predict()
}

run()
