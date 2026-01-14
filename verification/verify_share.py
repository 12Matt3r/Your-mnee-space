from playwright.sync_api import Page, expect, sync_playwright
import time

def test_share_functionality(page: Page):
    print("Navigating to social page...")
    # 1. Navigate to social feed
    page.goto("http://localhost:5173/social")

    # Wait for content to load
    print("Waiting for articles...")
    page.wait_for_selector("article", timeout=15000)

    # 2. Find the share button
    # The share button has aria-label="Share post"
    print("Finding share button...")
    share_button = page.get_by_label("Share post").first

    # 3. Click it
    print("Clicking share button...")
    share_button.click()

    # 4. Wait for toast
    print("Checking for toast...")
    # Use a more generic selector for the toast, looking for text
    # "Link copied to clipboard!" or "Shared successfully!"
    # Since headless might not support share API, it likely falls back to clipboard
    toast_locator = page.get_by_text("Link copied to clipboard!")

    # Wait for it to be visible
    try:
        expect(toast_locator).to_be_visible(timeout=5000)
        print("Toast found!")
    except AssertionError:
        # Maybe it used share API?
        print("Clipboard toast not found, checking for Share API success...")
        success_toast = page.get_by_text("Shared successfully!")
        expect(success_toast).to_be_visible(timeout=5000)
        print("Share success toast found!")

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant clipboard permissions if possible
        context = browser.new_context(permissions=["clipboard-write", "clipboard-read"])
        page = context.new_page()
        try:
            test_share_functionality(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
