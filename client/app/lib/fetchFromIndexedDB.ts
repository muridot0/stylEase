// export default function fetchFromIndexedDB(nodeId: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open('stylEase', 1)

//     request.onerror = function (event) {
//       console.error('IndexedDB error:', (event.target as any).errorCode)
//     }

//     request.onsuccess = function (event) {
//       const db = (event.target as any).result as IDBDatabase

//       const transaction = db.transaction(['stylEased'], 'readwrite')
//       const objectStore = transaction.objectStore('stylEased')

//       // Check if a record with the same ID exists
//       const getRequest = objectStore.get(nodeId)


//       getRequest.onsuccess = function (event) {

//         const stylEasedImage = (event.target as any).result

//         if(!stylEasedImage) return;

//         console.log('i go here')

//         return stylEasedImage
//       }
//     }
//   })
// }

export default function fetchFromIndexedDB(nodeId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('stylEase', 1);

    request.onerror = function (event) {
      console.error('IndexedDB error:', (event.target as any).errorCode);
      reject('IndexedDB error');
    };

    request.onsuccess = function (event) {
      const db = (event.target as any).result as IDBDatabase;

      const transaction = db.transaction(['stylEased'], 'readwrite');
      const objectStore = transaction.objectStore('stylEased');

      // Check if a record with the same ID exists
      const getRequest = objectStore.get(nodeId);

      getRequest.onsuccess = function (event) {
        const stylEasedImage = (event.target as any).result;

        if (!stylEasedImage) {
          reject('Record not found');
        } else {
          resolve(stylEasedImage);
        }
      };

      getRequest.onerror = function (event) {
        reject('Error fetching record from IndexedDB');
      };
    };
  });
}
