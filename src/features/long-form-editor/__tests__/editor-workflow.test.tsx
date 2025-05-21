import NDK, { NDKArticle, NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest';

// Mock EditorWorkflow component
vi.mock('../components/EditorWorkflow', () => ({
    default: () => <div data-testid="editor-workflow" />,
}));

// Extend NDK type to include mock publish method
declare module '@nostr-dev-kit/ndk' {
    interface NDK {
        publish: (event: NDKEvent) => Promise<void>;
    }
}

// Mock EditorWorkflow component with proper typing
const EditorWorkflow = () => <div data-testid="editor-workflow" />;
vi.mock('../components/EditorWorkflow', () => ({
    default: EditorWorkflow,
}));

// Mock components with proper types
vi.mock('../components/EditorWorkflow', () => ({
    default: () => <div data-testid="editor-workflow" />,
}));

vi.mock('../components/ConfirmationPage', () => ({
    default: () => <div data-testid="confirmation-page" />,
}));

vi.mock('../components/TagsEditor', () => ({
    default: () => <div data-testid="tags-editor" />,
}));

vi.mock('../components/SocialPreview', () => ({
    default: () => <div data-testid="social-preview" />,
}));

vi.mock('../components/SchedulingOptions', () => ({
    default: () => <div data-testid="scheduling-options" />,
}));

const TEST_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000000';

vi.mock('@nostr-dev-kit/ndk-hooks', () => ({
    useNDK: vi.fn(),
}));

describe('Editor Workflow', () => {
    let ndk: NDK;
    let signer: NDKPrivateKeySigner;

    beforeEach(() => {
        ndk = new NDK({ explicitRelayUrls: ['wss://test-relay'] });
        signer = new NDKPrivateKeySigner(TEST_PRIVKEY);
        ndk.signer = signer;
        // Mock publish with proper typing
        // Add publish method to NDK instance with proper typing
        const mockPublish = vi.fn().mockImplementation((event: NDKArticle) => {
            return Promise.resolve();
        });
        (ndk as NDK & { publish: typeof mockPublish }).publish = mockPublish;

        (useNDK as vi.Mock).mockReturnValue({ ndk });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('Basic publishing flow', async () => {
        render(<EditorWorkflow />);

        // 1. Create article content
        const editor = screen.getByRole('textbox');
        fireEvent.change(editor, { target: { value: 'Test article content' } });

        // 2. Click "Continue"
        fireEvent.click(screen.getByText('Continue'));

        // 3. Verify confirmation page displays with correct preview
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Test article content')).toBeInTheDocument();

        // 4. Click "Publish Now"
        fireEvent.click(screen.getByText('Publish Now'));

        // 5. Verify article is published
        await waitFor(() => {
            expect(ndk.publish).toHaveBeenCalledWith(expect.any(NDKArticle));
        });
    });

    test('Scheduled publishing flow', async () => {
        render(<EditorWorkflow />);

        // 1. Create article content
        const editor = screen.getByRole('textbox');
        fireEvent.change(editor, { target: { value: 'Scheduled article' } });

        // 2. Click "Continue"
        fireEvent.click(screen.getByText('Continue'));

        // 3. Set a future publish date
        const dateInput = screen.getByLabelText('Publish Date');
        fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

        // 4. Click "Schedule"
        fireEvent.click(screen.getByText('Schedule'));

        // 5. Verify article is scheduled
        await waitFor(() => {
            expect(ndk.publish).toHaveBeenCalledWith(expect.any(NDKArticle));
            const publishedEvent = (ndk.publish as vi.Mock).mock.calls[0][0];
            expect(publishedEvent.tags).toContainEqual(['published_at', '1735603200']);
        });
    });

    test('Tag editing on confirmation page', async () => {
        render(<EditorWorkflow />);

        // 1. Create article with initial tags
        const editor = screen.getByRole('textbox');
        fireEvent.change(editor, { target: { value: 'Article with tags' } });
        fireEvent.click(screen.getByText('Continue'));

        // 2. Add/remove tags on confirmation page
        const tagsInput = screen.getByLabelText('Tags');
        fireEvent.change(tagsInput, { target: { value: 'technology' } });
        fireEvent.keyDown(tagsInput, { key: 'Enter' });
        fireEvent.change(tagsInput, { target: { value: 'nostr' } });
        fireEvent.keyDown(tagsInput, { key: 'Enter' });

        // 3. Publish
        fireEvent.click(screen.getByText('Publish Now'));

        // 4. Verify final tags are correct
        await waitFor(() => {
            const publishedEvent = (ndk.publish as jest.Mock).mock.calls[0][0];
            expect(publishedEvent.tags).toEqual(
                expect.arrayContaining([
                    ['t', 'technology'],
                    ['t', 'nostr'],
                ])
            );
        });
    });

    test('Social preview customization', async () => {
        render(<EditorWorkflow />);

        // 1. Create article
        const editor = screen.getByRole('textbox');
        fireEvent.change(editor, { target: { value: 'Article with social preview' } });
        fireEvent.click(screen.getByText('Continue'));

        // 2. Customize social preview
        const titleInput = screen.getByLabelText('Title');
        const descriptionInput = screen.getByLabelText('Description');
        fireEvent.change(titleInput, { target: { value: 'Custom Title' } });
        fireEvent.change(descriptionInput, { target: { value: 'Custom Description' } });

        // 3. Publish
        fireEvent.click(screen.getByText('Publish Now'));

        // 4. Verify social preview metadata is correct
        await waitFor(() => {
            const publishedEvent = (ndk.publish as jest.Mock).mock.calls[0][0];
            expect(publishedEvent.tags).toEqual(
                expect.arrayContaining([
                    ['title', 'Custom Title'],
                    ['summary', 'Custom Description'],
                ])
            );
        });
    });

    test('Navigation between editor and confirmation', async () => {
        render(<EditorWorkflow />);

        // 1. Create article
        const editor = screen.getByRole('textbox');
        fireEvent.change(editor, { target: { value: 'Initial content' } });
        fireEvent.click(screen.getByText('Continue'));

        // 2. Click "Back to Editor"
        fireEvent.click(screen.getByText('Back to Editor'));

        // 3. Verify return to editor with content preserved
        expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument();

        // 4. Make changes
        fireEvent.change(editor, { target: { value: 'Updated content' } });

        // 5. Click "Continue" again
        fireEvent.click(screen.getByText('Continue'));

        // 6. Verify changes reflected in preview
        expect(screen.getByText('Updated content')).toBeInTheDocument();
    });
});
