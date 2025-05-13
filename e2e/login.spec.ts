import { test, expect } from '@playwright/test';
import { injectTestPrivKey, TEST_PRIVKEY } from './utils/ndk-auth';

// Helper function to log page content for debugging
async function logPageState(page, label) {
    console.log(`\n----- ${label} -----`);
    
    // Log all buttons on the page
    const buttons = await page.getByRole('button').all();
    console.log(`Found ${buttons.length} buttons:`);
    for (let i = 0; i < buttons.length; i++) {
        const buttonText = await buttons[i].textContent();
        console.log(`  Button ${i+1}: "${buttonText}"`);
    }
    
    // Log if form exists
    const formCount = await page.locator('form').count();
    console.log(`Found ${formCount} forms`);
    
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
            console.log('No form found, looking for other elements:', e.message);
            
            // Check if we landed directly on an input screen
            const inputCount = await page.locator('input').count();
            if (inputCount > 0) {
                console.log(`Found ${inputCount} input elements`);
            }
        }
        
        // If a private key input appears, fill it
        console.log('Checking for private key input field...');
        const privkeyInput = page.getByLabel(/private key/i);
        
        if (await privkeyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Private key input found, filling it');
            await privkeyInput.fill(TEST_PRIVKEY);
            console.log('Filled private key input');
        } else {
            console.log('No private key input found or not visible');
        }
        
        // Log page state after potentially filling the private key
        await logPageState(page, 'AFTER PRIVATE KEY HANDLING');
        
        // Try multiple strategies to submit the form
        console.log('Attempting to submit login form...');
        
        // Strategy 1: Look for type="submit" button in a form
        const submitBtn = page.locator('form button[type="submit"]');
        if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Found submit button with type="submit", clicking it');
            await submitBtn.click();
        } 
        // Strategy 2: Look for any button inside a form
        else if (formFound) {
            console.log('Looking for any button in the form');
            const formButton = page.locator('form button');
            if (await formButton.count() > 0) {
                console.log(`Found ${await formButton.count()} buttons in form, clicking first one`);
                await formButton.first().click();
            } else {
                console.log('No buttons found in form');
            }
        } 
        // Strategy 3: Check for login button with nsec text
        else {
            console.log('Trying to find any login-related button');
            const loginButton = page.locator('button:has-text("Login with nsec"), button:has-text("Log in")');
            if (await loginButton.count() > 0) {
                console.log('Found login button, clicking it');
                await loginButton.first().click();
            } else {
                console.log('No login button found');
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
