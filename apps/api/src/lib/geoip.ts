type GeoData = {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
};

export const getGeoData = async (ip: string): Promise<GeoData> => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  if (!response.ok) throw new Error("IP lookup failed");
  return response.json();
};
