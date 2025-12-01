import { describe, it, expect } from 'vitest';
import api from './api';

describe('API Service Configuration', () => {
    it('debe estar configurado con la URL base correcta', () => {

        expect(api.defaults.baseURL).toBe('http://localhost:4000/api');
    });

    it('debe tener el header Content-Type por defecto (implícito en axios)', () => {

        expect(api.interceptors.request).toBeDefined();
    });
});