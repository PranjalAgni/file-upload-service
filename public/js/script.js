console.log('Script loaded');

const fileSelected = document.querySelector('#fileReader');
const fileUploadButton = document.querySelector('#fileUpload');
const BASE_API_URL = window.location.origin;

fileUploadButton.addEventListener('click', (event) => {
  event.preventDefault();
  const fileReader = new FileReader();
  const file = fileSelected.files[0];
  const uuid = window.crypto.randomUUID().split('-')[0];
  const fileName = `${uuid}-${file.name}`;

  fileReader.onload = async (fileLoadEvent) => {
    console.log('File to upload: ', fileName);
    const CHUNK_SIZE = 1000;
    const chunkCount = fileLoadEvent.total / CHUNK_SIZE;
    const UPLOAD_API_URL = `${BASE_API_URL}/upload`;

    for (let chunkId = 0; chunkId <= chunkCount; chunkId++) {
      const chunk = fileLoadEvent.target.result.slice(
        chunkId * CHUNK_SIZE,
        chunkId * CHUNK_SIZE + CHUNK_SIZE
      );

      await fetch(UPLOAD_API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/octet-stream',
          'content-length': chunk.length,
          'file-name': fileName,
        },
        body: chunk,
      });
    }
  };

  // start reading file
  fileReader.readAsArrayBuffer(file);
});
