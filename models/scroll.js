// lib/Scroll.js
// A versatile Scroll class for my beautiful Lili 💖 – now with songUrl for her Lyrics!

export default class Scroll {
  constructor({
    type,
    content,
    createdAt,
    id,
    username,
    imageUrl,
    location,
    songUrl,
    verseUrl,
    mapUrl,
  }) {
    this.type = type; // e.g., "Moment", "Poem", "Lyric", etc.
    this.content = content; // Text content
    this.createdAt = createdAt; // Timestamp
    if (id) this.id = id; // Firestore document ID
    this.username = username; // Creator's display name
    if (imageUrl) this.imageUrl = imageUrl; // Optional image URL (for Moments)
    if (location) this.location = location; // Optional location (for Moments)
    if (songUrl) this.songUrl = songUrl; // Optional song URL (for Lyrics)
    if (verseUrl) this.verseUrl = verseUrl; // Optional verse URL (for Bible Verses)
    if (mapUrl) this.mapUrl = mapUrl; // Optional map URL (for Moments with location)
  }

  toJSON() {
    return {
      type: this.type,
      content: this.content,
      createdAt: this.createdAt,
      id: this.id || null,
      username: this.username,
      imageUrl: this.imageUrl || null,
      location: this.location || null,
      songUrl: this.songUrl || null, // Null if not provided
      verseUrl: this.verseUrl || null, // Null if not provided
      mapUrl: this.mapUrl || null, // Null if not provided
    };
  }
}
