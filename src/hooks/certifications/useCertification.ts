import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Certification, CertificationFormData, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando certificado...',
        success: 'Certificado agregado exitosamente',
        error: 'Error al agregar certificado'
    },
    update: {
        loading: 'Actualizando certificado...',
        success: 'Certificado actualizado exitosamente',
        error: 'Error al actualizar certificado'
    },
    delete: {
        loading: 'Eliminando certificado...',
        success: 'Certificado eliminado exitosamente',
        error: 'Error al eliminar certificado'
    }
};

const useCertification = (classroomId: string) => {
    const [certificationList, setCertificationList] = useState<Certification>();
    const [currentCertification, setCurrentCertification] = useState<Certification | null>(null);
    const [fetchState, setFetchState] = useState<FetchState>({
        loading: false,
        error: null,
        successMessage: null
    });

    // Función para limpiar mensajes después de un tiempo
    const clearMessages = useCallback(() => {
        setTimeout(() => {
            setFetchState(prev => ({
                ...prev,
                error: null,
                successMessage: null
            }));
        }, 5000);
    }, []);

    const fetchData = useCallback(async () => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await apiService.getCertificationsByClassroom(classroomId);
            setCertificationList(response.data.certification);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al cargar los datos';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching data:', error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [classroomId]);

    const getCertificationById = useCallback(async (certificationId: string) => {
        try {
            const response = await apiService.getCertificationById(certificationId);
            setCurrentCertification(response.data.certification);
            return response.data.certification;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ha ocurrido un problema al cargar la información';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            clearMessages();
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [clearMessages]);

    // Efecto inicial con retry
    useEffect(() => {
        const initFetch = async () => {
            try {
                await fetchData();
            } catch (error) {
                // Intenta nuevamente después de 5 segundos en caso de error
                setTimeout(fetchData, 5000);
            }
        };

        initFetch();
    }, [fetchData]);

    const handleAction = useCallback(async (
        action: Action,
        certificationData?: FormData,
        updatedData?: CertificationFormData,
        id?: string,
    ) => {
        const messages = ACTION_MESSAGES[action];

        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));
        try {
            if (action === 'add') {
                const certification = await apiService.addCertification(certificationData!);
                return certification;
            } else if (action === 'update') {
                return await apiService.updateCertification(id!, updatedData!);
            } else if (action === 'delete') {
                return await apiService.deleteCertification(id!);
            } 

            await fetchData();
            setFetchState(prev => ({
                ...prev,
                successMessage: messages.success
            }));
            clearMessages();
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : messages.error;

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            clearMessages();
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [fetchData, clearMessages]);

    // Optimización de funciones retornadas con useCallback
    const addCertification = useCallback(
        (certificationData: FormData) => handleAction('add', certificationData),
        [handleAction]
    );

    const updateCertification = useCallback(
        (id: string, certificationData: CertificationFormData) => handleAction('update', undefined, certificationData, id),
        [handleAction]
    );

    const deleteCertification = useCallback(
        (id: string) => handleAction('delete', undefined, undefined, id),
        [handleAction]
    );

    return {
        certificationList,
        currentCertification,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        getCertificationById,
        addCertification,
        updateCertification,
        deleteCertification
    };
};

export default useCertification;
