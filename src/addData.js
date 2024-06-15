const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function addNfts() {
  const start = 1;
  const end = 100; // Adjust range as needed

  for (let tokenId = start; tokenId <= end; tokenId++) {
    const tokenURI = `https://api.opensea.io/api/v1/asset/YOUR_CONTRACT_ADDRESS/${tokenId}`;
    const response = await fetch(tokenURI);
    const data = await response.json();

    await db.collection('nfts').doc(`${tokenId}`).set({
      token_id: tokenId,
      name: data.name,
      image: data.image,
      description: data.description,
      attributes: data.attributes,
    });

    console.log(`Successfully added NFT ${tokenId}`);
  }
}

addNfts().catch(console.error);
