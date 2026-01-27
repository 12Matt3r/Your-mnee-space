from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_buttons(page: Page):
    print("Navigating to login...")
    page.goto("http://localhost:5173/login")

    print("Clicking Enter Demo Mode...")
    page.wait_for_selector("text=Enter Demo Mode")
    page.click("text=Enter Demo Mode")

    print("Waiting for dashboard...")
    page.wait_for_selector("text=Good evening", timeout=10000)

    print("Navigating to Social Feed...")
    page.click("text=Social Feed")

    print("Waiting for timeline...")
    page.wait_for_selector("text=For you", timeout=10000)

    print("Waiting for posts...")
    page.wait_for_selector("article", timeout=10000)

    # Scroll a bit
    page.mouse.wheel(0, 500)
    time.sleep(2)

    print("Checking for Tip buttons...")
    try:
        expect(page.locator("text=Tip 5").first).to_be_visible()
        print("Tip button found.")
    except:
        print("Tip button NOT found.")

    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/buttons_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        try:
            verify_buttons(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error_screenshot_2.png")
        finally:
            browser.close()
