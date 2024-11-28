import { useState, useCallback } from "react";
import apiService from "../../services/apiService";

const useSummary = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para añadir un resumen
  const addSummary = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.addSummary(formId);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al añadir el resumen");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener resúmenes
  const getSummaries = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getSummaries(formId);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al obtener los resúmenes");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    addSummary,
    getSummaries,
  };
};

export default useSummary;