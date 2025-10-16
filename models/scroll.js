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
  removeNulls(obj) {
    const cleanObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        value !== null &&
        value !== undefined &&
        typeof value !== "function"
      ) {
        cleanObj[key] = value;
      }
    }
    return cleanObj;
  }

  toJSON() {
    const obj = {
      type: this.type,
      content: this.content,
      createdAt:
        this.createdAt instanceof Date
          ? this.createdAt.toISOString()
          : this.createdAt,
      id: this.id || null,
      username: this.username,
      imageUrl: this.imageUrl || null,
      location: this.location || null,
      songUrl: this.songUrl || null,
      verseUrl: this.verseUrl || null,
      mapUrl: this.mapUrl || null,
    };
    return this.removeNulls(obj);
  }
}
