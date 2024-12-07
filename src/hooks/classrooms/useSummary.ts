import { useState, useCallback } from "react";
import apiService from "../../services/apiService";

const useSummary = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSummary = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.addSummary(formId);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al añadir el resumen");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    calculateSummary
  };
};

export default useSummary;