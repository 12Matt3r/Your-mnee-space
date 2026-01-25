from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_header_focus(page: Page):
    print("Navigating to home page...")
    page.goto("http://localhost:5173/")

    # Wait for the header to be visible
    page.wait_for_selector("header")

    # Click on the body to ensure focus is on the page
    page.click("body")

    # Focus the search input first as a starting point
    search = page.get_by_placeholder("Search agents, creators, content...")
    search.focus()
    print("Focused Search")
    page.screenshot(path="verification/01_focus_search.png")

    # Tab 1: Buy MNEE (likely)
    page.keyboard.press("Tab")
    time.sleep(0.5)
    print("Tab 1")
    page.screenshot(path="verification/02_tab_1.png")

    # Tab 2: Sign In
    page.keyboard.press("Tab")
    time.sleep(0.5)
    print("Tab 2")
    page.screenshot(path="verification/03_focus_signin.png")

    # Tab 3: Sign Up
    page.keyboard.press("Tab")
    time.sleep(0.5)
    print("Tab 3")
    page.screenshot(path="verification/04_focus_signup.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_header_focus(page)
        finally:
            browser.close()
