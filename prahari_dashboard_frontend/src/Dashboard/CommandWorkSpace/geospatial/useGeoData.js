import { useEffect, useRef, useState } from 'react';
import indiaDistrictsUrl from '../../../assets/geo/india_districts.geojson?url';
import { MOCK_SCAM_TYPES, MOCK_GEO_COMPLAINTS, MOCK_GEO_DISTRICT_STATS, MOCK_GEO_TREND } from '../mockCommandData';

const DEBOUNCE_MS = 350;

const buildQuery = ({ scamTypes, startDate, endDate }) => {
  const params = new URLSearchParams();
  for (const s of scamTypes) params.append('scam_type', s);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  return params.toString();
};

// Fetches complaints/districts/trend for the given filters, debounced so
// rapid filter changes (e.g. toggling several scam-type checkboxes) don't
// fire a request per keystroke/click.
export const useGeoData = (filters, isDemoUser = false) => {
  const [data, setData] = useState({
    complaints: [],
    districtStats: [],
    trend: null,
    loading: true,
    error: null,
  });

  const debounceRef = useRef(null);
  const [lastFetch, setLastFetch] = useState(Date.now());

  // Polling mechanism
  useEffect(() => {
    if (isDemoUser) return;
    const intervalId = setInterval(() => {
      setLastFetch(Date.now());
    }, 15000); // Poll every 15 seconds
    return () => clearInterval(intervalId);
  }, [isDemoUser]);

  useEffect(() => {
    // Demo/mock logins never get a real backend session, so the protected
    // /api/geo/* routes always 401 for them -- show sample data instead.
    if (isDemoUser) {
      setData({
        complaints: MOCK_GEO_COMPLAINTS.complaints,
        districtStats: MOCK_GEO_DISTRICT_STATS.districts,
        trend: MOCK_GEO_TREND,
        loading: false,
        error: null,
      });
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const qs = buildQuery(filters);
        const [complaintsRes, districtsRes, trendRes] = await Promise.all([
          fetch(`/api/geo/complaints?${qs}`),
          fetch(`/api/geo/districts/stats?${qs}`),
          fetch(`/api/geo/trend?${qs}`),
        ]);
        if (!complaintsRes.ok) throw new Error(`Complaints request failed (${complaintsRes.status})`);
        if (!districtsRes.ok) throw new Error(`District stats request failed (${districtsRes.status})`);
        if (!trendRes.ok) throw new Error(`Trend request failed (${trendRes.status})`);

        const [complaintsJson, districtsJson, trendJson] = await Promise.all([
          complaintsRes.json(),
          districtsRes.json(),
          trendRes.json(),
        ]);

        setData({
          complaints: complaintsJson.complaints,
          districtStats: districtsJson.districts,
          trend: trendJson,
          loading: false,
          error: null,
        });
      } catch (e) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: e.message || 'Something went wrong. Please try again.',
        }));
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [filters.scamTypes, filters.startDate, filters.endDate, lastFetch, isDemoUser]);

  return data;
};

// District boundary GeoJSON + the canonical scam-type list rarely/never
// change, so these are fetched once, independent of filter state.
export const useStaticGeoResources = (isDemoUser = false) => {
  const [districtsRaw, setDistrictsRaw] = useState(null);
  const [scamTypes, setScamTypes] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch(indiaDistrictsUrl)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setDistrictsRaw(json);
      })
      .catch(() => {
        if (!cancelled) setDistrictsRaw({ type: 'FeatureCollection', features: [] });
      });

    if (isDemoUser) {
      setScamTypes(MOCK_SCAM_TYPES);
      return () => {
        cancelled = true;
      };
    }

    fetch('/api/geo/scam-types')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.scam_types) setScamTypes(json.scam_types);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isDemoUser]);

  return { districtsRaw, scamTypes };
};
