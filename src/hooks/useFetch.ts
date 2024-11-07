import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://ergast.com/api/f1/";

const useFetch = (url: string) => {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API + url);
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(
              `Error: ${err.response.status} ${err.response.statusText}`
            );
          } else if (err.request) {
            setError("Error: No response received from server");
          } else {
            setError(`Error: ${err.message}`);
          }
        } else {
          setError("Error: An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
