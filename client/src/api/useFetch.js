import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        if ("token") {
          headers.Authorization = `Bearer ${"token"}`;
        }
        const response = await fetch(url, { headers });
        if (response.status === 401) {
          // logout();
          return;
        }
        if (!response.ok) {
          throw new Error("Fetch Failed");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
    setLoading(false);
  }, [url]);
  return { data, error, loading };
};
