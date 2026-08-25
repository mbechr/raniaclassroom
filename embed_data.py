with open('IXL_UK_English_Curriculum.json', 'r', encoding='utf-8') as f:
    data_json = f.read()

with open('curriculum_viewer.html', 'r', encoding='utf-8') as f:
    html = f.read()

placeholder = '<script id="dataScript">\n        // Inject curriculum JSON\n    </script>'
replacement = '<script>\nconst INLINE_DATA = ' + data_json + ';\nlet curriculumData = INLINE_DATA;\n</script>'

if placeholder in html:
    html = html.replace(placeholder, replacement)
    html = html.replace('let curriculumData = {};', '')
    html = html.replace("async function init() {\n            try {\n                const response = await fetch('IXL_UK_English_Curriculum.json');\n                curriculumData = await response.json();\n                renderCurriculum();\n            } catch (e) {\n                console.error(\"Could not fetch JSON directly, checking inline\", e);\n            }\n        }", "function init() { renderCurriculum(); }")

with open('curriculum_viewer.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Embedded data successfully!")
