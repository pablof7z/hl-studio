import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { DraftButton } from './DraftButton';

// Mocks
jest.mock('@/ui/atoms/Button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('@/ui/molecules/Tooltip', () => ({
    Tooltip: ({ content, children }: any) => (
        <div data-testid="tooltip" data-content={content}>
            {children}
        </div>
    ),
}));
jest.mock('@/domains/drafts', () => ({
    useDraftStatus: jest.fn(),
}));
jest.mock('date-fns', () => ({
    formatDistanceToNow: jest.fn(() => '2 minutes ago'),
}));

const { useDraftStatus } = require('@/domains/drafts');
const { formatDistanceToNow } = require('date-fns');

describe('DraftButton', () => {
    const baseProps = {
        draftId: 'draft-1',
        onSave: jest.fn(),
        className: 'test-class',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('DraftButton should display the correct status color based on status', () => {
        const statuses = {
            unsaved: 'bg-yellow-500',
            saving: 'bg-blue-500 animate-pulse',
            saved: 'bg-green-500',
            error: 'bg-red-500',
        };
        Object.entries(statuses).forEach(([status, color]) => {
            useDraftStatus.mockReturnValue({ status, lastSaved: 123, error: null });
            render(<DraftButton {...baseProps} />);
            const indicator = screen.getByRole('button').querySelector('span');
            expect(indicator).toHaveClass(color);
        });
    });

    test('DraftButton should display the correct label based on status', () => {
        useDraftStatus.mockReturnValue({ status: 'saving', lastSaved: 123, error: null });
        render(<DraftButton {...baseProps} />);
        expect(screen.getByRole('button')).toHaveTextContent('Saving...');

        useDraftStatus.mockReturnValue({ status: 'unsaved', lastSaved: null, error: null });
        render(<DraftButton {...baseProps} />);
        expect(screen.getByRole('button')).toHaveTextContent('Save Draft');
    });

    test('DraftButton should display the last saved time when available', () => {
        useDraftStatus.mockReturnValue({ status: 'saved', lastSaved: 123, error: null });
        (formatDistanceToNow as jest.Mock).mockReturnValue('5 minutes ago');
        render(<DraftButton {...baseProps} />);
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip.getAttribute('data-content')).toContain('Last saved 5 minutes ago');
    });

    test('DraftButton should call onSave when clicked', () => {
        useDraftStatus.mockReturnValue({ status: 'unsaved', lastSaved: null, error: null });
        const onSave = jest.fn();
        render(<DraftButton {...baseProps} onSave={onSave} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onSave).toHaveBeenCalled();
    });

    test("DraftButton should be disabled when status is 'saving'", () => {
        useDraftStatus.mockReturnValue({ status: 'saving', lastSaved: 123, error: null });
        render(<DraftButton {...baseProps} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('DraftButton should show error message in tooltip if error exists', () => {
        useDraftStatus.mockReturnValue({
            status: 'error',
            lastSaved: 123,
            error: { message: 'Save failed' },
        });
        render(<DraftButton {...baseProps} />);
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip.getAttribute('data-content')).toContain('Error: Save failed');
    });
});
