from playwright.sync_api import sync_playwright
import time

def verify_social_feed():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Go to Login
        print("Navigating to login...")
        page.goto("http://localhost:5173/login")

        # 2. Click Demo Mode
        print("Clicking Demo Mode...")
        page.get_by_role("button", name="Enter Demo Mode").click()

        # 3. Wait for home page
        print("Waiting for home page...")
        page.wait_for_url("http://localhost:5173/", timeout=10000)

        # 4. Navigate to social
        print("Navigating to social feed...")
        page.goto("http://localhost:5173/social")

        # 5. Wait for timeline to load
        print("Waiting for timeline...")
        try:
            page.wait_for_selector('textarea[placeholder="What\'s happening in your creative world?"]', timeout=10000)
        except Exception as e:
            print(f"Warning: Could not find composer. {e}")
            # fallback
            page.wait_for_timeout(3000)

        # 6. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification.png")

        browser.close()

if __name__ == "__main__":
    verify_social_feed()
