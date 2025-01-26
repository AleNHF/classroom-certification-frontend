// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import AppRoutes from './routes/AppRoutes';
import { PlatformProvider } from './context/PlatformContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <PlatformProvider>
                    <AppRoutes />
                </PlatformProvider>
            </AuthProvider>
        </Router>
    </React.StrictMode>
);
