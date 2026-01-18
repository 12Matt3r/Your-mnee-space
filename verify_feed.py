from playwright.sync_api import sync_playwright, expect
import time

def verify_timeline(page):
    # Navigate to the social feed
    page.goto("http://localhost:5173/social")

    # Wait for content to load
    page.wait_for_selector("article")

    # Check if posts are visible
    posts = page.locator("article")
    expect(posts.first).to_be_visible()

    # Take a screenshot of the initial state
    page.screenshot(path="initial_feed.png")

    # Scroll down to trigger infinite scroll
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

    # Wait a bit for more posts to load
    time.sleep(2)

    # Take another screenshot
    page.screenshot(path="scrolled_feed.png")

    print("Verification complete. Screenshots saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_timeline(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error.png")
        finally:
            browser.close()
