/**
 * Determines the text to display on the confirmation dialog action button
 * based on the context of the action being performed.
 */
export function getConfirmationButtonText(options: {
    isProposal?: boolean;
    isScheduled?: boolean;
    customText?: string;
}): string {
    const { isProposal = false, isScheduled = false, customText } = options;

    // If this is a proposal, always show "Send Proposal"
    if (isProposal) {
        return "Send Proposal";
    }

    // If we are scheduling, show "Schedule Post"
    if (isScheduled) {
        return "Schedule Post";
    }

    // Otherwise, use custom text or default to "Publish Now"
    return customText || "Publish Now";
}