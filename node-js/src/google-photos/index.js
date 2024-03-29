const axios = require("axios");

const regex =
  /\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]*)"/g;

function extractPhotos(content) {
  const links = new Set();
  let match;
  let total = 0;

  while ((match = regex.exec(content)) && total < 10) {
    links.add(match[1]);
    total += 1;
  }
  return Array.from(links);
}

async function getAlbum(id) {
  const response = await axios.get(`https://photos.app.goo.gl/${id}`);
  return extractPhotos(response.data);
}

module.exports = {
  getAlbum,
};
