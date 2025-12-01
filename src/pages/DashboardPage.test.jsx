import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mocks globales
const { mockGet, mockPost, mockDelete } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockDelete: vi.fn()
}));

vi.mock('../services/api', () => ({
    default: { get: mockGet, post: mockPost, delete: mockDelete }
}));

// Datos de prueba
const mockProductos = [
    { id: 1, nombre: 'Mouse Gamer', precio: 10000, stock: 5, imagen: '' },
    { id: 2, nombre: 'Teclado Mecánico', precio: 50000, stock: 2, imagen: '' }
];

describe('DashboardPage (Integración)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.alert = vi.fn(); // Mockear alert
        window.confirm = () => true; // Aceptar confirmaciones automáticamente


        const tokenPayload = btoa(JSON.stringify({ role: 'admin', nombre: 'Admin' }));
        localStorage.setItem('token', `header.${tokenPayload}.firm`);
    });

    it('debe cargar productos y permitir agregarlos al carrito', async () => {
        mockGet.mockResolvedValueOnce({ data: mockProductos });

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);


        await waitFor(() => {
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
            expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
        });


        const addButtons = screen.getAllByText('+');
        fireEvent.click(addButtons[0]); // Click en el primero (Mouse)


        const cartTitle = screen.getByText('🛒 Tu Carrito');
        const cartSection = cartTitle.closest('div').parentElement;

        expect(cartSection).toHaveTextContent('Mouse Gamer');
        expect(cartSection).toHaveTextContent(/\$10[.,]000/);
    });

    it('debe realizar una venta correctamente', async () => {
        mockGet.mockResolvedValueOnce({ data: mockProductos });
        mockPost.mockResolvedValueOnce({}); // Éxito al comprar

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);

        await waitFor(() => screen.getByText('Mouse Gamer'));

        // Agregar al carrito
        const addBtn = screen.getAllByText('+')[0];
        fireEvent.click(addBtn);

        // Pagar con Efectivo
        const payBtn = screen.getByText(/Efectivo/i);
        fireEvent.click(payBtn);

        // Verificar llamada a API
        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/boletas', expect.objectContaining({
                metodoPago: 'EFECTIVO',
                detalles: [{ productoId: 1, cantidad: 1 }]
            }));
            // Verificar que se limpió el carrito (mensaje de vacío)
            expect(screen.getByText('El carrito está vacío')).toBeInTheDocument();
        });
    });

    it('debe permitir eliminar un producto si es admin', async () => {
        mockGet.mockResolvedValueOnce({ data: mockProductos });
        mockDelete.mockResolvedValueOnce({});

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);
        await waitFor(() => screen.getByText('Mouse Gamer'));


        const deleteBtn = screen.getAllByTitle('Eliminar producto (Solo Admin)')[0];
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith('/productos/1');
            // Verificar que desaparece de la lista visualmente
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
        });
    });
});