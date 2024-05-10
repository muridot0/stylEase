import { imageDataToBase64 } from './base64ToImageData'

//TODO: create a function to initialise the indexedDB

function storeImageDataInIndexedDB(imageData: ImageData, id: string) {
  const request = indexedDB.open('stylEase', 1)

  request.onerror = function (event) {
    console.error('IndexedDB error:', (event.target as any).errorCode)
  }

  request.onsuccess = function (event) {
    const db = (event.target as any).result as IDBDatabase
  }

  request.onupgradeneeded = function (event) {
    const db = (event.target as any).result as IDBDatabase
    db.createObjectStore('stylEased', { keyPath: 'id' })

    const base64String = imageDataToBase64(imageData)

    if (!base64String) {
      console.error('Failed to convert ImageData to base64String.')
      return
    }

    const transaction = db.transaction(['stylEased'], 'readwrite')
    const objectStore = transaction.objectStore('stylEased')
    const addRequest = objectStore.add(base64String, id)

    addRequest.onsuccess = function (event: Event) {
      console.log('Image data stored successfully')
    }

    addRequest.onerror = function (event: Event) {
      console.error('Error storing image data:', (event.target as any).error)
    }
  }
}

export { storeImageDataInIndexedDB }
