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
    userId,
    coupleId,
  }) {
    this.type = type;
    this.content = content;
    this.createdAt = createdAt instanceof Date ? createdAt.toISOString() : createdAt;
    this.username = username;
    this.imageUrl = imageUrl || null;
    this.location = location || null;
    this.songUrl = songUrl || null;
    this.verseUrl = verseUrl || null;
    this.mapUrl = mapUrl || null;
    this.userId = userId;
    this.coupleId = coupleId;
    this.id = id || null;
  }

  toJSON() {
    const obj = {};
    const fields = [
      "type",
      "content",
      "createdAt",
      "username",
      "imageUrl",
      "location",
      "songUrl",
      "verseUrl",
      "mapUrl",
      "userId",
      "coupleId",
    ];

    for (const field of fields) {
      if (this[field] !== undefined && this[field] !== null) {
        obj[field] = this[field];
      }
    }

    return obj;
  }
}