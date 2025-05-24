import { getConfirmationButtonText } from './getConfirmationButtonText';

describe('getConfirmationButtonText', () => {
    it('returns "Send Proposal" when isProposal is true', () => {
        expect(getConfirmationButtonText({ isProposal: true })).toBe('Send Proposal');
        expect(getConfirmationButtonText({ isProposal: true, isScheduled: true })).toBe('Send Proposal');
        expect(getConfirmationButtonText({ isProposal: true, customText: 'Custom' })).toBe('Send Proposal');
    });

    it('returns "Schedule Post" when isScheduled is true and not a proposal', () => {
        expect(getConfirmationButtonText({ isScheduled: true })).toBe('Schedule Post');
        expect(getConfirmationButtonText({ isScheduled: true, customText: 'Custom' })).toBe('Schedule Post');
    });

    it('returns custom text when provided and not a proposal or scheduled', () => {
        expect(getConfirmationButtonText({ customText: 'Custom Action' })).toBe('Custom Action');
    });

    it('returns "Publish Now" as default when no special conditions apply', () => {
        expect(getConfirmationButtonText({})).toBe('Publish Now');
        expect(getConfirmationButtonText({ isProposal: false, isScheduled: false })).toBe('Publish Now');
    });
});