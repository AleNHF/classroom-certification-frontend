import { useState, useCallback } from "react";
import apiService from "../../services/apiService";

const useSummary = () => {
  const [data, setData] = useState<any>(null);
  const [observation, setObservation] = useState<any>();
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

  const addObservation = useCallback(async (formId: number, addObservation: { observation: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.addObservation(formId, addObservation);
      setObservation(response.data);
    } catch (error: any) {
      setError(error.message || "Ocurrió un error al añadir la observación");
      throw error;
    }
  }, []);

  return {
    data,
    observation,

    loading,
    error,

    calculateSummary,
    addObservation
  };
};

export default useSummary;