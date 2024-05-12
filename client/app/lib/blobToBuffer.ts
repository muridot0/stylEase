export const blobToBufferAsync = (blob: Blob): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(Buffer.from(reader.result));
      } else {
        reject(new Error('Failed to read Blob as ArrayBuffer.'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(blob);
  });
};
