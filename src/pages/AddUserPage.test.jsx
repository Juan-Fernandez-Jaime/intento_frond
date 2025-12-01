import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserPage from './AddUserPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const { mockGet, mockPost, mockDelete } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockDelete: vi.fn()
}));

vi.mock('../services/api', () => ({
    default: { get: mockGet, post: mockPost, delete: mockDelete, patch: vi.fn() }
}));

const mockUsers = [
    { id: 1, nombre: 'Admin User', email: 'admin@test.com', role: 'admin' }
];

describe('AddUserPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('debe listar usuarios y permitir crear uno nuevo', async () => {
        mockGet.mockResolvedValueOnce({ data: mockUsers });
        mockPost.mockResolvedValueOnce({});
        mockGet.mockResolvedValueOnce({ data: [...mockUsers, { id: 2, nombre: 'Nuevo', email: 'n@t.com', role: 'vendedor' }] });

        render(<BrowserRouter><AddUserPage /></BrowserRouter>);


        await waitFor(() => expect(screen.getByText('Admin User')).toBeInTheDocument());


        const inputs = screen.getAllByRole('textbox');



        const container = screen.getByText('👤 Registrar Nuevo Usuario').closest('div');


        fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Nuevo Vendedor' } });

        fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'new@vendor.com' } });
        fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: '123456' } });


        fireEvent.click(screen.getByText('Crear Usuario'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
        });
    });
});