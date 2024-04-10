const BYTES_PER_MEGA_BYTE = 1000000

const convertBytestoMegabytes = (bytes: number) =>
  (bytes / BYTES_PER_MEGA_BYTE).toFixed(2)

export { convertBytestoMegabytes }
