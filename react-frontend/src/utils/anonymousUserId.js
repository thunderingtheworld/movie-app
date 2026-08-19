const STORAGE_KEY = "movie-night-anonymous-user-id";

export default function getAnonymousUserId() {
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
