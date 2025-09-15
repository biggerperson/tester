// src/services/geocoding.ts
import { MAPBOX_GEOCODING_ENDPOINT, MAPBOX_TOKEN } from '../config';

export async function geocodeQuery(query: string) {
  const encoded = encodeURIComponent(query);
  const url = `${MAPBOX_GEOCODING_ENDPOINT}/${encoded}.json?access_token=${MAPBOX_TOKEN}&limit=6&autocomplete=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.statusText}`);
  return res.json();
}