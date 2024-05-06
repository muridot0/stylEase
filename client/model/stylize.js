import * as tf from '@tensorflow/tfjs-node'
import { dir } from 'console'
import * as fs from 'fs'
import * as path from 'path'

const run = async () => {
  const modelSrc = 'file://./mobilenet_model/model.json'
  const model = await tf.loadGraphModel(modelSrc)
  // console.log(model)

  const MOBILE_NET_INPUT_WIDTH = 224
  const MOBILE_NET_INPUT_HEIGHT = 224

  const stylePath = path.join('./images', 'style.jpeg')
  const styleImage = fs.readFileSync(stylePath)

  console.log(stylePath)
  console.log(styleImage)

  const image = tf.node.decodeImage(styleImage)

  console.log(image)
  tf.tidy(function () {
    let answer = model.predict(
      tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3])
    )
    console.log(answer.shape)
  })
  // model.predict()
}

run()
