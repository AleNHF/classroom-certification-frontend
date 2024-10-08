// utils/tokenUtils.ts
export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    try {
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error("Error decodificando el token:", error);
        return true;
    }
};
