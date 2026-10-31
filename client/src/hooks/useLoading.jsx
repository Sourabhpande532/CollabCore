import { useState } from "react";

const useLoading = (initialState = true) => {
  const [loading, setLoading] = useState(initialState);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  return { loading, startLoading, stopLoading };
};

export default useLoading;
