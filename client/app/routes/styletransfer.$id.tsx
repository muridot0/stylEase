import { ActionFunction } from '@remix-run/node'
import * as tf from '@tensorflow/tfjs-node'


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  console.log(formData)
}