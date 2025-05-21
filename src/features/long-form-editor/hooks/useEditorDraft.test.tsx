import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import { act, renderHook } from '@testing-library/react';
import { useEditorDraft } from './useEditorDraft';

// Mocks
jest.mock('@nostr-dev-kit/ndk-hooks', () => ({
    useNDK: jest.fn(),
}));
jest.mock('@/domains/drafts', () => ({
    useDraft: jest.fn(),
    useDraftStore: jest.fn(),
    saveAsCheckpoint: jest.fn(),
    createDraft: jest.fn(),
}));

const mockSetSavingDraft = jest.fn();
const mockIncrementChangeCount = jest.fn();
const mockResetChangeCount = jest.fn();
const mockSaveAsCheckpoint = require('@/domains/drafts').saveAsCheckpoint;
const mockCreateDraft = require('@/domains/drafts').createDraft;

const TEST_DRAFT_ID = 'draft-1';
const TEST_ORIGINAL_KIND = 31234;
const TEST_CONTENT = 'Hello, world!';
const TEST_AUTOSAVE_INTERVAL = 50;

function setupDraftStore({
    autosaveEnabled = true,
    autosaveInterval = TEST_AUTOSAVE_INTERVAL,
    autosaveChangeThreshold = 2,
    changeCountByDraft = {},
} = {}) {
    require('@/domains/drafts').useDraftStore.mockReturnValue({
        autosaveEnabled,
        autosaveInterval,
        autosaveChangeThreshold,
        changeCountByDraft,
        setSavingDraft: mockSetSavingDraft,
        incrementChangeCount: mockIncrementChangeCount,
        resetChangeCount: mockResetChangeCount,
    });
}

function setupDraftHook({ draft = null, latestDraft = null, createDraftFn = () => null } = {}) {
    require('@/domains/drafts').useDraft.mockReturnValue({
        draft,
        latestDraft,
        createDraft: createDraftFn,
    });
}

function setupNDK(ndk = {}) {
    (useNDK as jest.Mock).mockReturnValue({ ndk });
}

describe('useEditorDraft', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('initializes content from latestDraft', () => {
        setupNDK({});
        setupDraftStore();
        setupDraftHook({
            latestDraft: { content: 'init content' },
        });

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        expect(result.current.content).toBe('init content');
    });

    it('calls incrementChangeCount on content change if autosave enabled', () => {
        setupNDK({});
        setupDraftStore();
        setupDraftHook();

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        act(() => {
            result.current.setContent('new content');
        });
        expect(mockIncrementChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('triggers autosave when change count threshold is reached', () => {
        setupNDK({});
        setupDraftStore({
            changeCountByDraft: { [TEST_DRAFT_ID]: 2 },
            autosaveChangeThreshold: 2,
        });
        const fakeDraft = { content: '', publish: jest.fn() };
        const createDraftFn = jest.fn(() => fakeDraft);
        setupDraftHook({ createDraftFn });

        renderHook(() => useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND }));
        expect(createDraftFn).toHaveBeenCalledWith(TEST_ORIGINAL_KIND);
        expect(fakeDraft.content).toBe('');
        expect(mockSaveAsCheckpoint).toHaveBeenCalledWith(fakeDraft);
        expect(mockResetChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('triggers autosave on timer if there are changes', () => {
        setupNDK({});
        setupDraftStore({
            changeCountByDraft: { [TEST_DRAFT_ID]: 1 },
            autosaveInterval: 10,
        });
        const fakeDraft = { content: '', publish: jest.fn() };
        const createDraftFn = jest.fn(() => fakeDraft);
        setupDraftHook({ createDraftFn });

        renderHook(() => useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND }));
        act(() => {
            jest.advanceTimersByTime(10);
        });
        expect(createDraftFn).toHaveBeenCalledWith(TEST_ORIGINAL_KIND);
        expect(mockSaveAsCheckpoint).toHaveBeenCalledWith(fakeDraft);
        expect(mockResetChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('manual save updates existing draft and publishes', async () => {
        setupNDK({});
        setupDraftStore();
        const fakeDraft = {
            content: '',
            publish: jest.fn(),
            tags: [],
        };
        setupDraftHook({ draft: fakeDraft, createDraftFn: () => fakeDraft });

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        act(() => {
            result.current.setContent(TEST_CONTENT);
        });
        await act(async () => {
            await result.current.saveDraft();
        });
        expect(fakeDraft.content).toBe(TEST_CONTENT);
        expect(fakeDraft.publish).toHaveBeenCalled();
        expect(mockResetChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('manual save creates new draft if none exists', async () => {
        setupNDK({});
        setupDraftStore();
        const fakeDraft = {
            content: '',
            publish: jest.fn(),
            tags: [],
        };
        const createDraftFn = jest.fn(() => fakeDraft);
        setupDraftHook({ draft: null, createDraftFn });

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        act(() => {
            result.current.setContent(TEST_CONTENT);
        });
        await act(async () => {
            await result.current.saveDraft();
        });
        expect(createDraftFn).toHaveBeenCalledWith(TEST_ORIGINAL_KIND);
        expect(fakeDraft.content).toBe(TEST_CONTENT);
        expect(fakeDraft.publish).toHaveBeenCalled();
        expect(mockResetChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('manual save in proposal mode encrypts and adds recipient tag', async () => {
        setupNDK({});
        setupDraftStore();
        const encrypt = jest.fn();
        const fakeDraft = {
            content: '',
            publish: jest.fn(),
            encrypt,
            tags: [],
        };
        setupDraftHook({ draft: fakeDraft, createDraftFn: () => fakeDraft });

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        const recipient = new NDKUser({ pubkey: 'pubkey123' });
        act(() => {
            result.current.setIsProposalMode(true);
            result.current.setProposalRecipient(recipient);
            result.current.setContent(TEST_CONTENT);
        });
        await act(async () => {
            await result.current.saveDraft();
        });
        expect(encrypt).toHaveBeenCalledWith(recipient);
        expect(fakeDraft.tags).toContainEqual(['p', 'pubkey123']);
        expect(fakeDraft.publish).toHaveBeenCalled();
        expect(mockResetChangeCount).toHaveBeenCalledWith(TEST_DRAFT_ID);
    });

    it('does not autosave or increment change count if autosave is disabled', () => {
        setupNDK({});
        setupDraftStore({ autosaveEnabled: false });
        setupDraftHook();

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND, autosave: false })
        );
        act(() => {
            result.current.setContent('new content');
        });
        expect(mockIncrementChangeCount).not.toHaveBeenCalled();
    });

    it('exposes proposal mode and recipient state', () => {
        setupNDK({});
        setupDraftStore();
        setupDraftHook();

        const { result } = renderHook(() =>
            useEditorDraft({ draftId: TEST_DRAFT_ID, originalKind: TEST_ORIGINAL_KIND })
        );
        const recipient = new NDKUser({ pubkey: 'pubkey123' });
        act(() => {
            result.current.setIsProposalMode(true);
            result.current.setProposalRecipient(recipient);
        });
        expect(result.current.isProposalMode).toBe(true);
        expect(result.current.proposalRecipient).toBe(recipient);
    });
});
