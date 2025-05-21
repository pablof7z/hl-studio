import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { DraftHistorySidebar } from './DraftHistorySidebar';

// Mocks
jest.mock('@/ui/atoms/Button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('@/domains/drafts', () => ({
    useDraftHistory: jest.fn(),
}));
jest.mock('date-fns', () => ({
    format: jest.fn((date, fmt) => '2025-05-20 12:00:00'),
}));

const { useDraftHistory } = require('@/domains/drafts');
const { format } = require('date-fns');

const mockHistory = [
    {
        event: {
            id: '1',
            content: 'Draft v1',
            created_at: 1716192000, // 2025-05-20 12:00:00 UTC
        },
    },
    {
        event: {
            id: '2',
            content: 'Draft v2',
            created_at: 1716195600, // 2025-05-20 13:00:00 UTC
        },
    },
];

describe('DraftHistorySidebar', () => {
    const baseProps = {
        draftId: 'draft-1',
        isOpen: true,
        onClose: jest.fn(),
        onPreview: jest.fn(),
        onRestore: jest.fn(),
        currentContent: 'Current content',
    };

    beforeEach(() => {
        useDraftHistory.mockReturnValue({ history: mockHistory });
        jest.clearAllMocks();
    });

    test('DraftHistorySidebar should not render when isOpen is false', () => {
        render(<DraftHistorySidebar {...baseProps} isOpen={false} />);
        expect(screen.queryByText('Draft History')).toBeNull();
    });

    test('DraftHistorySidebar should render a list of history items', () => {
        render(<DraftHistorySidebar {...baseProps} />);
        expect(screen.getByText('Draft History')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /2025-05-20 12:00:00|2025-05-20 13:00:00/ })).toHaveLength(2);
    });

    test("DraftHistorySidebar should call onPreview with the selected item's content when clicked", () => {
        render(<DraftHistorySidebar {...baseProps} />);
        const historyButtons = screen.getAllByRole('button', { name: /2025-05-20/ });
        fireEvent.click(historyButtons[1]);
        expect(baseProps.onPreview).toHaveBeenCalledWith('Draft v2');
    });

    test('DraftHistorySidebar should show preview mode UI when a version is selected', () => {
        render(<DraftHistorySidebar {...baseProps} />);
        const historyButtons = screen.getAllByRole('button', { name: /2025-05-20/ });
        fireEvent.click(historyButtons[0]);
        expect(screen.getByText('Exit Preview')).toBeInTheDocument();
        expect(screen.getByText('Restore This Version')).toBeInTheDocument();
    });

    test("DraftHistorySidebar should call onRestore when the 'Restore This Version' button is clicked", () => {
        render(<DraftHistorySidebar {...baseProps} />);
        const historyButtons = screen.getAllByRole('button', { name: /2025-05-20/ });
        fireEvent.click(historyButtons[0]);
        fireEvent.click(screen.getByText('Restore This Version'));
        expect(baseProps.onRestore).toHaveBeenCalledWith('Draft v1');
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    test("DraftHistorySidebar should call onPreview with the original content when 'Exit Preview' is clicked", () => {
        render(<DraftHistorySidebar {...baseProps} />);
        const historyButtons = screen.getAllByRole('button', { name: /2025-05-20/ });
        fireEvent.click(historyButtons[0]);
        fireEvent.click(screen.getByText('Exit Preview'));
        expect(baseProps.onPreview).toHaveBeenCalledWith('Current content');
    });

    test('DraftHistorySidebar should display the correct timestamp and labels for each item', () => {
        render(<DraftHistorySidebar {...baseProps} />);
        expect(screen.getByText('2025-05-20 12:00:00')).toBeInTheDocument();
        expect(screen.getByText('2025-05-20 13:00:00')).toBeInTheDocument();
    });
});
