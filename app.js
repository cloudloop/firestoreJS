const admin = require('firebase-admin');
const readline = require('readline');

// Path to your Firebase service account key file
const serviceAccount = require('./secrets/thefirebaseexperiment-firebase-adminsdk-f4oml-d36c24b796.json');

//-------------
// This part initializes the Firestore Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({
    persistence: true, // Enable offline persistence
  });
//-------------

//Enable readline input from command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.on('close', () => {
console.log('Exiting...');
console.log('');
process.exit(0);
});

async function promptForCommand() {
rl.question('Enter command (create/read/delete/exit): ', async (command) => {
    switch (command.toLowerCase()) {
        case 'createsubcol':
            // List all root-level collections
            db.listCollections()
                .then(collections => {
                collections.forEach(collection => {
                    console.log('Collection ID:', collection.id);
                });
                })
                .then(() => {
                    rl.question('Select you collection from the above: ', (collectionName) => {
                        const collectionRef = db.collection(`${collectionName}`)
                        collectionRef.listDocuments()
                            .then(() => {
                                rl.question('Select you Docs from the above: ', (DocsName) => {
                                    
                                })
                            })
                    })
                })
            subCollectionRef = rootCollectionRef.doc('documentId').collection('subCollectionName');
            break;
        case 'seecols':
            // List all root-level collections
            db.listCollections()
            .then(collections => {
                collections.forEach(collection => {
                console.log('Collection ID:', collection.id);
                });
            })
            .then(() => promptForCommand())
            .catch(error => {
                console.error('Error listing collections:', error);
                promptForCommand();
            });
            break;
        case 'seedocs':
            // List all root-level collections
            db.listCollections()
                .then(collections => {
                collections.forEach(collection => {
                    console.log('Collection ID:', collection.id);
                });
                })
                .then(() => 
                    rl.question('Select you collection from the above: ', (collectionName) => {
                        const collectionRef = db.collection(`${collectionName}`)
                        collectionRef.listDocuments()
                            .then(documentRefs => {
                                // Iterate over the document references and retrieve data
                                const promises = documentRefs.map(docRef => {
                                    return docRef.get()
                                    .then(doc => {
                                        if (doc.exists) {
                                        console.log('Document ID:', doc.id, '=>', doc.data());
                                        } else {
                                        console.log('Document not found:', doc.id);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error retrieving document:', error);
                                        promptForCommand();
                                    });

                                })
                                .catch(error => {
                                console.error('Error listing documents:', error);
                                promptForCommand();
                                })
                                // Wait for all promises to complete
                                return Promise.all(promises);
                            })
                            .then(() => {promptForCommand()})
                        })
                    )
                .catch(error => {
                console.error('Error listing collections:', error);
                promptForCommand();
                });
            break;
        case 'create':
            // Ask for collection, document names, and data, then call createCollection()
            rl.question('Enter collection name: ', (collectionName) => {
                rl.question('Enter document name: ', (documentName) => {
                    rl.question('Enter input (as key:"value"-pairs): ', (input) => {
                        const validJSONInput = `{${input}}`;
                        createDocument(collectionName, documentName,validJSONInput)
                        .then(()=> promptForCommand())
                        .catch((error) => {
                            console.error('Error:', error)
                            promptForCommand(); // Repeat after operation)
                            });
                });
            });
            });
            break;
        case 'read':
            rl.close();
            // Ask for collection name, then call readCollection()
            break;
        case 'delete':
            rl.close();
            // Ask for collection name, then call deleteCollection()
            break;
        case 'exit':
            rl.close();
            return;
        default:
            console.log('Invalid command. Try again');
            promptForCommand();
    }
});
};

// Create Collection
async function createDocument(collectionName, documentName,userInput) {
    const docRef = db.doc(`${collectionName}/${documentName}`);
    try {
        const inputData = JSON.parse(userInput);
        docRef.set({inputData});
        console.log(`Document created: ${documentName} added to collection ${collectionName}`);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

// Read collection
async function readCollection(collectionName) {
    const collectionRef = db.collection(`${collectionName}`);
    collectionRef.listDocuments();
    // Implementation of reading a collection
  }

// Delete Collection
async function deleteCollection(collectionName) {
    // Implementation of deleting a collection
  }

// // Reference to a root-level collection
// const rootCollectionRef = db.collection('rootCollection');

// // Create a document in the root collection
// const rootDocRef = await rootCollectionRef.add({
//   name: 'Root Document'
// });

// // Reference to a subcollection inside the document
// const subCollectionRef = rootDocRef.collection('subcollection');

// // Now you can create documents within the subcollection
// const subDoc1Ref = await subCollectionRef.add({
//   subDocName: 'Subdocument 1'
// });

// const subDoc2Ref = await subCollectionRef.add({
//   subDocName: 'Subdocument 2'
// });

async function main () {
    //await readCollection();
    await promptForCommand();
};

main();