// FREE geocoding for India using OpenStreetMap Nominatim (no API key needed).
// Swap this out for Google Places later just by changing this one file.
export async function searchIndianPlaces(query) {
  if (!query || query.length < 2) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'PayanamApp/1.0' } });
  const data = await res.json();
  return data.map((d) => ({
    name: d.display_name,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
  }));
}
