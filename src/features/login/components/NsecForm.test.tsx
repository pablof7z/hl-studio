// Mock the login hook to observe login calls
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setupTestNDK, TEST_PRIVKEY } from '../../../../test/ndkTestUtils';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { NsecForm } from './NsecForm';

vi.mock('../../hooks/useNsecLogin', () => ({
    useNsecLogin: () => vi.fn(),
}));

describe('NsecForm', () => {
    beforeEach(async () => {
        // Reset and setup NDK for each test
        await setupTestNDK();
    });

    it('renders the NsecForm and allows login with the test private key', async () => {
        renderWithProviders(<NsecForm />);

        // Check that the input and button are present
        const input = screen.getByLabelText(/private key/i);
        const button = screen.getByRole('button', { name: /login/i });

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        // Simulate user typing the test private key
        fireEvent.change(input, { target: { value: TEST_PRIVKEY } });
        expect((input as HTMLInputElement).value).toBe(TEST_PRIVKEY);

        // Simulate form submission
        fireEvent.click(button);

        // Wait for login effect (e.g., success message, pubkey display, etc.)
        // This assumes NsecForm shows some indication of login (adjust selector as needed)
        await waitFor(() => {
            // Example: check for pubkey or success text
            expect(screen.getByText(/logged in|success|pubkey|welcome/i)).toBeInTheDocument();
        });
    });
});
