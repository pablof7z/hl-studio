import { test, expect, Page } from '@playwright/test';
import { injectTestPrivKey, TEST_PRIVKEY } from './utils/ndk-auth';

// Helper function to log page content for debugging
async function logPageState(page: Page, label: string) {
    console.log(`\n----- ${label} -----`);
    
    // Log all buttons on the page
    const buttons = await page.getByRole('button').all();
    console.log(`Found ${buttons.length} buttons:`);
    for (let i = 0; i < buttons.length; i++) {
        const buttonText = await buttons[i].textContent();
        const buttonVisible = await buttons[i].isVisible();
        console.log(`  Button ${i+1}: "${buttonText}" (Visible: ${buttonVisible})`);
    }
    
    // Log if form exists
    const formCount = await page.locator('form').count();
    console.log(`Found ${formCount} forms`);

    // Log input elements
    const inputs = await page.locator('input').all();
    console.log(`Found ${inputs.length} input elements:`);
    for (let i = 0; i < inputs.length; i++) {
        const inputType = await inputs[i].getAttribute('type');
        const inputName = await inputs[i].getAttribute('name');
        const inputPlaceholder = await inputs[i].getAttribute('placeholder');
        const inputId = await inputs[i].getAttribute('id');
        let associatedLabelText = 'N/A';
        if (inputId) {
            const labelElement = await page.locator(`label[for="${inputId}"]`).first();
            if (await labelElement.count() > 0) {
                associatedLabelText = (await labelElement.textContent()) || 'Empty Label';
            }
        }
        const inputValue = await inputs[i].inputValue();
        const isVisible = await inputs[i].isVisible();
        console.log(`  Input ${i+1}: type="${inputType}", name="${inputName}", id="${inputId}", placeholder="${inputPlaceholder}", label="${associatedLabelText}", value="${inputValue}", visible=${isVisible}`);
    }
    
    // Log headings and important text for context
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('Headings:', headings);
}

/**
 * E2E test: Login flow using the NDK test private key.
 * 
 * This test injects the test privkey, navigates to the login page,
 * performs login, and asserts that the user is authenticated.
 * 
 * Adjust selectors and assertions to match your app's UI.
 */

test.describe('Login Flow', () => {
    test('should log in with the test private key', async ({ page }) => {
        test.setTimeout(60000); // Increase test timeout for debugging
        
        // Inject the test privkey before page load
        await injectTestPrivKey(page);

        // Go to the login page (adjust path if needed)
        await page.goto('/login');
        console.log('Navigated to login page');
        
        // Initial page state logging
        await logPageState(page, 'INITIAL PAGE STATE');

        // Find and click the nsec login button with better error handling
        const nsecButton = page.getByRole('button', { name: /nsec/i });
        console.log('Looking for nsec button');
        await expect(nsecButton).toBeVisible({ timeout: 10000 });
        console.log('Found nsec button, clicking it');
        await nsecButton.click();
        console.log('Clicked nsec button');
        
        // Log page state after clicking nsec button
        await page.waitForTimeout(1000); // Brief pause to let UI update
        await logPageState(page, 'AFTER CLICKING NSEC BUTTON');
        
        // Wait for form or input to appear with more robust detection
        console.log('Checking for form or input elements...');
        let formFound = false;
        
        try {
            // First try to wait for a form
            await page.waitForSelector('form', { timeout: 8000, state: 'visible' });
            formFound = true;
            console.log('Form found');
        } catch (e) {
            if (e instanceof Error) {
                console.log('No form found, looking for other elements:', e.message);
            } else {
                console.log('No form found, looking for other elements: An unknown error occurred');
            }
            
            // Check if we landed directly on an input screen
            const inputCount = await page.locator('input').count();
            if (inputCount > 0) {
                console.log(`Found ${inputCount} input elements`);
            }
        }
        
        // Wait for the nsec input field to be visible and then fill it
        console.log('Waiting for nsec input field (placeholder "Enter your nsec...")...');
        const nsecInput = page.getByPlaceholder('Enter your nsec...');
        
        try {
            await expect(nsecInput).toBeVisible({ timeout: 15000 }); // Increased timeout
            console.log('Nsec input found and visible, filling it');
            await nsecInput.fill(TEST_PRIVKEY);
            console.log('Filled nsec input');
        } catch (error) {
            console.error('Failed to find or fill nsec input:', error);
            await logPageState(page, 'STATE WHEN NSEC INPUT FAILED');
            throw error; // Re-throw to fail the test clearly
        }
        
        // Log page state after potentially filling the private key
        await logPageState(page, 'AFTER PRIVATE KEY HANDLING');
        
        // Try multiple strategies to submit the form
        console.log('Attempting to submit login form...');
        
        // Strategy 1: Look for type="submit" button in a form that is visible
        const submitBtn = page.locator('form button[type="submit"]');
        if (await submitBtn.count() > 0 && await submitBtn.first().isVisible({timeout: 2000})) {
            console.log('Found visible submit button with type="submit", clicking it');
            await submitBtn.first().click();
        }
        // Strategy 2: Look for any visible button inside a form
        else if (formFound) {
            console.log('Looking for any visible button in the form');
            const formButton = page.locator('form button');
            if (await formButton.count() > 0) {
                const visibleFormButtons = formButton.filter({ has: page.locator(':scope:visible')});
                if (await visibleFormButtons.count() > 0) {
                    console.log(`Found ${await visibleFormButtons.count()} visible buttons in form, clicking first one`);
                    await visibleFormButtons.first().click();
                } else {
                     console.log('No visible buttons found in form, though form exists.');
                }
            } else {
                console.log('No buttons found in form');
            }
        }
        // Strategy 3: Check for login button with nsec text or general "Log in"
        else {
            console.log('Trying to find any login-related button (e.g., "Login with nsec", "Log in")');
            const loginButton = page.locator('button:has-text(/Login with nsec/i), button:has-text(/^Log in$/i)').filter({ has: page.locator(':scope:visible')});
            if (await loginButton.count() > 0) {
                console.log(`Found ${await loginButton.count()} visible login-related buttons, clicking first one: "${await loginButton.first().textContent()}"`);
                await loginButton.first().click();
            } else {
                console.log('No suitable visible login button found by text match.');
            }
        }
        
        // Wait a moment for navigation/state change
        await page.waitForTimeout(2000);
        
        // Log page state after submit attempt
        await logPageState(page, 'AFTER SUBMIT ATTEMPT');
        
        // Check for successful login using multiple selectors
        console.log('Checking for successful login...');
        
        // Capture all text on the page for debugging
        const pageText = await page.locator('body').textContent();
        console.log('Page text includes:', pageText?.substring(0, 500) + '...');
        
        // Try to detect any welcome/success elements
        const possibleSuccessSelectors = [
            page.getByText(/dashboard/i),
            page.getByText(/welcome/i),
            page.getByText(/logged in/i),
            page.getByText(/nostr id:/i),
            page.getByText(/npub/i)
        ];
        
        let loginSuccessful = false;
        
        for (const selector of possibleSuccessSelectors) {
            if (await selector.isVisible({ timeout: 2000 }).catch(() => false)) {
                const text = await selector.textContent();
                console.log(`Login successful! Found text: "${text}"`);
                loginSuccessful = true;
                break;
            }
        }
        
        // Assert that the login was successful
        expect(loginSuccessful, 'Login was not successful').toBeTruthy();
        
        console.log('Test completed successfully');
    });
});
