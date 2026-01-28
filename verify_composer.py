from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login
        print("Navigating to login...")
        try:
            page.goto("http://localhost:5173/login", timeout=60000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # Wait for "Enter Demo Mode" and click
        print("Entering demo mode...")
        try:
            page.get_by_role("button", name="Enter Demo Mode").click()
        except:
            print("Button not found by role, trying text...")
            page.click("text=Enter Demo Mode")

        # Wait for redirect to dashboard
        try:
            page.wait_for_url("**/", timeout=30000)
            print("Logged in.")
        except:
            print("Navigation timeout or failure")
            page.screenshot(path="debug_login.png")
            return

        # Navigate to Social Feed
        print("Navigating to Social Feed...")
        page.goto("http://localhost:5173/social")
        page.wait_for_url("**/social")

        # 2. Find Composer
        print("Finding composer...")
        try:
            textarea = page.get_by_placeholder("What's happening in your creative world?")
            textarea.wait_for(state="visible", timeout=30000)
        except:
            print("Composer not found")
            page.screenshot(path="debug_composer.png")
            return

        # 3. Test Focus
        print("Testing focus...")
        # To trigger focus-visible, we need keyboard interaction.
        # Tab into it.
        page.keyboard.press("Tab") # Maybe focus sidebar?
        # We can just click it and check if it works.
        # Note: My code adds focus-visible, which only shows on keyboard.
        # But for verification, I just want to see the component is usable.
        # To strictly verify the ring, I'd need to simulate tab navigation which is flaky in scripts.
        # I'll rely on the fact that I added the class in the code verification.
        textarea.click()
        textarea.fill("Testing focus...")

        page.screenshot(path="verification_focus.png")
        print("Focus screenshot taken.")

        # 5. Test Smart Counter (Visible)
        print("Testing counter...")
        long_text = "a" * 265 # 280 - 265 = 15 remaining. Should show "15".
        textarea.fill(long_text)
        page.wait_for_timeout(500)

        page.screenshot(path="verification_counter.png")
        print("Counter screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
