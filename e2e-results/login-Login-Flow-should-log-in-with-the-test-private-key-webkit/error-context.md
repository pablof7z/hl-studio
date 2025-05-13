# Test info

- Name: Login Flow >> should log in with the test private key
- Location: /Users/pablofernandez/src/hl-studo/e2e/login.spec.ts:35:9

# Error details

```
Error: Login was not successful

expect(received).toBeTruthy()

Received: false
    at /Users/pablofernandez/src/hl-studo/e2e/login.spec.ts:160:61
```

# Page snapshot

```yaml
- heading "Sign in to Nostr" [level=2]
- button "Login with NIP-07 Extension"
- button "Login with nsec"
- button "Login with Bunker"
- button "Login with NostrConnect"
- textbox "Enter your nsec..."
- button "Login with nsec"
- strong: "Auth Error (nsec):"
- text: Invalid private key provided.
- button "Dismiss"
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
   60 |         // Wait for form or input to appear with more robust detection
   61 |         console.log('Checking for form or input elements...');
   62 |         let formFound = false;
   63 |         
   64 |         try {
   65 |             // First try to wait for a form
   66 |             await page.waitForSelector('form', { timeout: 8000, state: 'visible' });
   67 |             formFound = true;
   68 |             console.log('Form found');
   69 |         } catch (e) {
   70 |             console.log('No form found, looking for other elements:', e.message);
   71 |             
   72 |             // Check if we landed directly on an input screen
   73 |             const inputCount = await page.locator('input').count();
   74 |             if (inputCount > 0) {
   75 |                 console.log(`Found ${inputCount} input elements`);
   76 |             }
   77 |         }
   78 |         
   79 |         // If a private key input appears, fill it
   80 |         console.log('Checking for private key input field...');
   81 |         const privkeyInput = page.getByLabel(/private key/i);
   82 |         
   83 |         if (await privkeyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
   84 |             console.log('Private key input found, filling it');
   85 |             await privkeyInput.fill(TEST_PRIVKEY);
   86 |             console.log('Filled private key input');
   87 |         } else {
   88 |             console.log('No private key input found or not visible');
   89 |         }
   90 |         
   91 |         // Log page state after potentially filling the private key
   92 |         await logPageState(page, 'AFTER PRIVATE KEY HANDLING');
   93 |         
   94 |         // Try multiple strategies to submit the form
   95 |         console.log('Attempting to submit login form...');
   96 |         
   97 |         // Strategy 1: Look for type="submit" button in a form
   98 |         const submitBtn = page.locator('form button[type="submit"]');
   99 |         if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  100 |             console.log('Found submit button with type="submit", clicking it');
  101 |             await submitBtn.click();
  102 |         } 
  103 |         // Strategy 2: Look for any button inside a form
  104 |         else if (formFound) {
  105 |             console.log('Looking for any button in the form');
  106 |             const formButton = page.locator('form button');
  107 |             if (await formButton.count() > 0) {
  108 |                 console.log(`Found ${await formButton.count()} buttons in form, clicking first one`);
  109 |                 await formButton.first().click();
  110 |             } else {
  111 |                 console.log('No buttons found in form');
  112 |             }
  113 |         } 
  114 |         // Strategy 3: Check for login button with nsec text
  115 |         else {
  116 |             console.log('Trying to find any login-related button');
  117 |             const loginButton = page.locator('button:has-text("Login with nsec"), button:has-text("Log in")');
  118 |             if (await loginButton.count() > 0) {
  119 |                 console.log('Found login button, clicking it');
  120 |                 await loginButton.first().click();
  121 |             } else {
  122 |                 console.log('No login button found');
  123 |             }
  124 |         }
  125 |         
  126 |         // Wait a moment for navigation/state change
  127 |         await page.waitForTimeout(2000);
  128 |         
  129 |         // Log page state after submit attempt
  130 |         await logPageState(page, 'AFTER SUBMIT ATTEMPT');
  131 |         
  132 |         // Check for successful login using multiple selectors
  133 |         console.log('Checking for successful login...');
  134 |         
  135 |         // Capture all text on the page for debugging
  136 |         const pageText = await page.locator('body').textContent();
  137 |         console.log('Page text includes:', pageText?.substring(0, 500) + '...');
  138 |         
  139 |         // Try to detect any welcome/success elements
  140 |         const possibleSuccessSelectors = [
  141 |             page.getByText(/dashboard/i),
  142 |             page.getByText(/welcome/i),
  143 |             page.getByText(/logged in/i),
  144 |             page.getByText(/nostr id:/i),
  145 |             page.getByText(/npub/i)
  146 |         ];
  147 |         
  148 |         let loginSuccessful = false;
  149 |         
  150 |         for (const selector of possibleSuccessSelectors) {
  151 |             if (await selector.isVisible({ timeout: 2000 }).catch(() => false)) {
  152 |                 const text = await selector.textContent();
  153 |                 console.log(`Login successful! Found text: "${text}"`);
  154 |                 loginSuccessful = true;
  155 |                 break;
  156 |             }
  157 |         }
  158 |         
  159 |         // Assert that the login was successful
> 160 |         expect(loginSuccessful, 'Login was not successful').toBeTruthy();
      |                                                             ^ Error: Login was not successful
  161 |         
  162 |         console.log('Test completed successfully');
  163 |     });
  164 | });
  165 |
```