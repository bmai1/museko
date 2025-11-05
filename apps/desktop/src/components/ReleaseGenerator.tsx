import { useState } from "react";

async function generateReleaseId() {
  const releaseIdUpperBound = 36000000;

  for (let i = 0; i < 10; ++i) {
    const releaseId = Math.floor(Math.random() * releaseIdUpperBound);
    try {
      const response = await fetch(`https://api.discogs.com/releases/${releaseId}`);
      if (!response.ok) {
        continue;
      }
      const releaseData = await response.json();
      return releaseData;
    } 
    catch (e) {
      console.error(`Release ID ${releaseId} failed with error:`, e);
      continue;
    }
  }

  throw new Error("Failed to find a valid release after 10 attempts");
}

export default function ReleaseGenerator() {
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const newRelease = await generateReleaseId();
      setRelease(newRelease);
    } 
    catch (err) {
      setError("Could not find a valid release.");
    } 
    finally {
      setLoading(false);
    }
  }

  const imageUrl =
    release?.images && release.images.length > 0
      ? release.images[0].uri
      : "/images/unavailable.png";

  const artistNames = release?.artists
    ? release.artists.map((a) => a.name).join(", ")
    : "";

  return (
    <div className="p-4 text-center">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-full hover:text-gray-terminal-light disabled:opacity-50 transition-colors duration 200s"
      >
        {loading ? "Loading..." : "Generate New Release"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {release && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">{release.title}</h2>
          <p className="text-gray-terminal-light">{artistNames}</p>
          <img
            src={imageUrl}
            alt={release.title}
            className="mx-auto mt-4 rounded-lg shadow-md max-h-80"
          />
        </div>
      )}
    </div>
  );
}