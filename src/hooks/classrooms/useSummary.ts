import { useState, useCallback, useRef } from "react";
import apiService from "../../services/apiService";

const useSummary = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track summary creation to prevent multiple simultaneous attempts
  const isCreatingRef = useRef(false);

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

  const getSummaries = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      let response = await apiService.getSummaries(formId);
      const summaryData = response.data?.summary;

      // Check if no summaries exist
      if (
        summaryData &&
        Array.isArray(summaryData.data) &&
        summaryData.data.length === 0 &&
        summaryData.message === "No se encontraron registros para este formulario."
      ) {
        // Use ref to prevent multiple simultaneous creation attempts
        if (!isCreatingRef.current) {
          try {
            isCreatingRef.current = true;
            await apiService.addSummary(formId);
            // Fetch summaries again after creation
            response = await apiService.getSummaries(formId);
            setData(response.data);
          } catch (createErr) {
            setError("Error al crear resumen");
            console.error(createErr);
          } finally {
            isCreatingRef.current = false;
          }
        }
      } else {
        // If summaries already exist, just set the data
        setData(response.data);
      }
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