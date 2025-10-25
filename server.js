import 'dotenv/config';
import express from 'express';
import admin from 'firebase-admin';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Configuration from environment variables
const PORT = process.env.PORT || 3000;

// Check if Firebase credentials are set
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  console.error('ERROR: Firebase credentials must be set in environment variables');
  console.error('Create a .env file with these values. See .env.example');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })
});

const db = admin.firestore();
const songsCollection = db.collection('songs');

console.log('Connected to Firebase');

// Get all songs
app.get('/songs', (req, res) => {
  songsCollection.orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      const songs = [];
      snapshot.forEach(doc => {
        songs.push({ id: doc.id, ...doc.data() });
      });
      res.json(songs);
    })
    .catch(error => {
      console.error('Error getting songs:', error);
      res.status(500).json({ error: 'Failed to get songs' });
    });
});

// Create new song
app.post('/songs', (req, res) => {
  const { title, artist } = req.body;

  if (!title || !artist) {
    res.status(400).json({ error: 'Title and artist are required' });
    return;
  }

  const newSong = {
    title: title,
    artist: artist,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  songsCollection.add(newSong)
    .then(docRef => {
      return docRef.get();
    })
    .then(doc => {
      res.status(201).json({ id: doc.id, ...doc.data() });
    })
    .catch(error => {
      console.error('Error adding song:', error);
      res.status(500).json({ error: 'Failed to save song' });
    });
});

// Delete song by ID
app.delete('/songs/:id', (req, res) => {
  const docRef = songsCollection.doc(req.params.id);

  docRef.get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Song not found' });
        return;
      }

      const songData = { id: doc.id, ...doc.data() };
      return docRef.delete().then(() => songData);
    })
    .then(songData => {
      if (songData) {
        res.json(songData);
      }
    })
    .catch(error => {
      console.error('Error deleting song:', error);
      res.status(500).json({ error: 'Failed to delete song' });
    });
});

app.listen(PORT, () => {
  console.log(`Playlist server running on port ${PORT}`);
});
