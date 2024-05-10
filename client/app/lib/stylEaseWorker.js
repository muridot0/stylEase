// import * as mi from '@magenta/image';
// const model = new mi.ArbitraryStyleTransferNetwork();
// const model = require('@magenta/image');
self.onmessage = function (event) {
  const { scaledContentImageData, scaledStyleImageData } = event.data
  console.log(event)
  // Run the stylize function
  // model.initialize().then(() =>
  //   model
  //     .stylize(scaledContentImageData, scaledStyleImageData)
  //     .then((imageData) => {
  //       self.postMessage(imageData) // Send the result back to the main thread
  //     })
  // )
}
