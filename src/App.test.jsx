import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos componentes de página para no cargar toda la lógica interna
vi.mock('./pages/LoginPage', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./pages/DashboardPage', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('./pages/AddUserPage', () => ({ default: () => <div>Admin Page</div> }));

describe('App Routing & Security', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.pushState({}, 'Test page', '/');
    });

    it('debe mostrar Login en la ruta raíz /', () => {
        render(<App />);
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('debe redirigir a Login si intento entrar a /dashboard sin token', async () => {
        window.history.pushState({}, 'Test page', '/dashboard');
        render(<App />);

        await waitFor(() => {
            // Como no hay token, debe renderizar Login en vez de Dashboard
            expect(screen.getByText('Login Page')).toBeInTheDocument();
            expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
        });
    });

    it('debe permitir entrar a /dashboard con token', () => {
        localStorage.setItem('token', 'fake-token');
        window.history.pushState({}, 'Test page', '/dashboard');

        render(<App />);
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('debe bloquear a un vendedor de entrar a rutas de admin', () => {
        // Token de vendedor
        const token = btoa(JSON.stringify({ role: 'vendedor' }));
        localStorage.setItem('token', `h.${token}.s`);

        window.history.pushState({}, 'Test page', '/crear-usuario');

        render(<App />);

        // Debe redirigir al dashboard (o home), NO mostrar Admin Page
        expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
        // Según tu lógica RutaAdmin redirige a dashboard si falla
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('debe permitir a un admin entrar a rutas de admin', () => {
        // Token de admin
        const token = btoa(JSON.stringify({ role: 'admin' }));
        localStorage.setItem('token', `h.${token}.s`);

        window.history.pushState({}, 'Test page', '/crear-usuario');

        render(<App />);
        expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
});