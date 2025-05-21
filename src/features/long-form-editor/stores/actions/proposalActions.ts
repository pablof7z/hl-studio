import { NDKUser } from '@nostr-dev-kit/ndk';
import { useEditorStore } from '../editorStore';

/**
 * Toggle proposal mode
 * @param enabled Whether proposal mode is enabled
 */
export function toggleProposalMode(enabled: boolean): void {
    const prevRecipient = useEditorStore.getState().proposalRecipient;
    // Debug: log enabled, resulting isProposalMode, and proposalRecipient

    console.debug('[editorStore] toggleProposalMode:', {
        enabled,
        isProposalMode: enabled,
        proposalRecipient: enabled ? prevRecipient : null,
    });
    useEditorStore.setState({
        isProposalMode: enabled,
        // Clear recipient if disabling
        proposalRecipient: enabled ? prevRecipient : null,
    });
}

/**
 * Set the proposal recipient
 * @param recipient The recipient user
 */
export function setProposalRecipient(recipient: NDKUser | null): void {
    // Debug: log recipient

    console.debug('[editorStore] setProposalRecipient:', { recipient });
    useEditorStore.setState({ proposalRecipient: recipient });
}
