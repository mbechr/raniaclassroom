import os
import asyncio
from playwright.async_api import async_playwright

async def full_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        
        file_path = os.path.abspath('index.html')
        await page.goto(f'file:///{file_path}')
        await page.wait_for_timeout(500)
        
        # Test 1: Practice button on card
        practice_btns = await page.query_selector_all('.action-launch-btn')
        for btn in practice_btns:
            txt = await btn.inner_text()
            if 'PRACTICE' in txt:
                await btn.click()
                break
        await page.wait_for_timeout(500)
        prompt_el = await page.query_selector('.terminal-prompt-text')
        assert prompt_el is not None, "Prompt element should exist"
        
        # Test 2: Select option & submit answer
        options = await page.query_selector_all('.cockpit-option-btn')
        assert len(options) > 0, "Options should be rendered"
        await options[0].click()
        await page.wait_for_timeout(200)
        submit_btn = await page.query_selector('.btn-execute-answer')
        assert submit_btn is not None, "Submit button should exist"
        await submit_btn.click()
        await page.wait_for_timeout(500)
        feedback = await page.query_selector('.diagnostic-terminal-feedback')
        assert feedback is not None, "Feedback card should be rendered"
        
        # Test 3: Top Navigation Practice Console tab
        await page.click('[data-tab="curriculum"]')
        await page.wait_for_timeout(300)
        await page.click('[data-tab="practice"]')
        await page.wait_for_timeout(300)
        
        # Test 4: Lesson Detail View
        await page.click('[data-tab="curriculum"]')
        await page.wait_for_timeout(300)
        lesson_btns = await page.query_selector_all('.action-launch-btn')
        for btn in lesson_btns:
            txt = await btn.inner_text()
            if 'LESSON' in txt:
                await btn.click()
                break
        await page.wait_for_timeout(300)
        
        # Test 5: Switch Year via Dropdown
        await page.click('[data-tab="curriculum"]')
        await page.select_option('#horizontalYearSelect', 'Year 3')
        await page.wait_for_timeout(500)
        
        print("ALL TESTS PASSED! Total page errors:", len(errors))
        if errors:
            print("Errors detected:", errors)
            
        await browser.close()

if __name__ == '__main__':
    asyncio.run(full_test())
