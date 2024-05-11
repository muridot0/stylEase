import { imageDataToBase64 } from './base64ToImageData'

function storeImageDataInIndexedDB(imageData: ImageData, id: string) {
  const request = indexedDB.open('stylEase', 1)

  request.onerror = function (event) {
    console.error('IndexedDB error:', (event.target as any).errorCode)
  }

  request.onsuccess = function (event) {
    const db = (event.target as any).result as IDBDatabase

    const base64String = imageDataToBase64(imageData)

    if (!base64String) {
      console.error('Failed to convert ImageData to base64String.')
      return
    }

    const transaction = db.transaction(['stylEased'], 'readwrite')
    const objectStore = transaction.objectStore('stylEased')

    // Check if a record with the same ID exists
    const getRequest = objectStore.get(id)

    getRequest.onsuccess = function (event) {
      const existingRecord = (event.target as any).result

      // If a record with the same ID exists, delete it
      if (existingRecord) {
        const deleteRequest = objectStore.delete(id)
        deleteRequest.onsuccess = function (event) {
          console.log('Existing record deleted successfully')
          // Proceed to add the new record
          addNewRecord()
        }
        deleteRequest.onerror = function (event) {
          console.error(
            'Error deleting existing record:',
            (event.target as any).error
          )
        }
      } else {
        // If no record with the same ID exists, directly add the new record
        addNewRecord()
      }
    }

    getRequest.onerror = function (event) {
      console.error(
        'Error checking for existing record:',
        (event.target as any).error
      )
    }

    function addNewRecord() {
      const addRequest = objectStore.add(base64String, id)
      addRequest.onsuccess = function (event: Event) {
        console.log('Image data stored successfully')
      }
      addRequest.onerror = function (event: Event) {
        console.error('Error storing image data:', (event.target as any).error)
      }
    }
  }

  request.onupgradeneeded = function (event) {
    const db = (event.target as any).result as IDBDatabase
    db.createObjectStore('stylEased', { keyPath: 'id' })
  }
}

export { storeImageDataInIndexedDB }
