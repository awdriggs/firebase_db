// Get references to DOM elements
const form = document.getElementById('song-form');
const playlistDiv = document.getElementById('playlist');

// Load and display all songs
function loadSongs() {
  fetch('/songs')
    .then(response => response.json())
    .then(songs => {
      displaySongs(songs);
    })
    .catch(error => {
      console.error('Error loading songs:', error);
    });
}

// Display songs in the playlist div
function displaySongs(songs) {
  if (songs.length === 0) {
    playlistDiv.innerHTML = '<p>No songs in playlist yet!</p>';
    return;
  }

  let html = '<ul>';
  songs.forEach(song => {
    html += `
      <li>
        <strong>${song.title}</strong> by ${song.artist}
        <button onclick="deleteSong('${song.id}')">Delete</button>
      </li>
    `;
  });
  html += '</ul>';

  playlistDiv.innerHTML = html;
}

// Add a new song
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const artist = document.getElementById('artist').value;

  fetch('/songs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, artist })
  })
  .then(response => response.json())
  .then(newSong => {
    console.log('Song added:', newSong);
    form.reset();
    loadSongs();
  })
  .catch(error => {
    console.error('Error adding song:', error);
  });
});

// Delete a song
function deleteSong(id) {
  fetch(`/songs/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(deletedSong => {
    console.log('Song deleted:', deletedSong);
    loadSongs();
  })
  .catch(error => {
    console.error('Error deleting song:', error);
  });
}

// Load songs when page loads
loadSongs();
