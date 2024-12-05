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
      return response.data;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al añadir el resumen");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSummaries = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getSummaries(formId);
      const summaryData = response.data?.summary;

      if (
        summaryData &&
        Array.isArray(summaryData.data) &&
        summaryData.data.length === 0 &&
        summaryData.message === "No se encontraron registros para este formulario."
      ) {
        if (!isCreatingRef.current) {
          try {
            isCreatingRef.current = true;
            // Add summary and immediately get the newly created summary
            const newSummary = await addSummary(formId);
            setData(newSummary);
          } catch (createErr) {
            setError("Error al crear resumen");
            console.error(createErr);
          } finally {
            isCreatingRef.current = false;
          }
        }
      } else {
        // Update summary and use the response directly
        const updatedResponse = await apiService.updateSummary(formId);
        setData(updatedResponse.data);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al obtener los resúmenes");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addSummary]);

  const updateSummary = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateSummary(formId);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar el resumen");
      throw err;
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
    updateSummary
  };
};

export default useSummary;