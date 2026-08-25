import os
import re
import json
import urllib.request
from bs4 import BeautifulSoup
import pandas as pd

YEARS = [
    ('Reception', '/english/reception', 'Early Years'),
    ('Year 1', '/english/year-1', 'Key Stage 1'),
    ('Year 2', '/english/year-2', 'Key Stage 1'),
    ('Year 3', '/english/year-3', 'Key Stage 2'),
    ('Year 4', '/english/year-4', 'Key Stage 2'),
    ('Year 5', '/english/year-5', 'Key Stage 2'),
    ('Year 6', '/english/year-6', 'Key Stage 2'),
    ('Year 7', '/english/year-7', 'Key Stage 3'),
    ('Year 8', '/english/year-8', 'Key Stage 3'),
    ('Year 9', '/english/year-9', 'Key Stage 3'),
    ('Year 10', '/english/year-10', 'Key Stage 4 (GCSE)'),
    ('Year 11', '/english/year-11', 'Key Stage 4 (GCSE)'),
    ('Year 12', '/english/year-12', 'Sixth Form / A-Levels'),
    ('Year 13', '/english/year-13', 'Sixth Form / A-Levels'),
]

BASE_URL = 'https://uk.ixl.com'

def extract_curriculum():
    all_records = []
    structured_data = {}
    
    print("Starting IXL UK English Curriculum extraction...")
    
    summary_rows = []
    
    for year_name, year_path, key_stage in YEARS:
        year_url = f"{BASE_URL}{year_path}"
        print(f"Fetching {year_name} ({key_stage}) from {year_url}...")
        
        req = urllib.request.Request(year_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        try:
            html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
        except Exception as e:
            print(f"Error fetching {year_name}: {e}")
            continue
            
        soup = BeautifulSoup(html, 'html.parser')
        categories = soup.find_all('div', class_='skill-tree-supercategory-category')
        
        year_data = {
            'year': year_name,
            'key_stage': key_stage,
            'url': year_url,
            'total_skills': 0,
            'categories': []
        }
        
        for cat in categories:
            header_el = cat.find(['h2', 'h3', 'div', 'span'], class_=lambda c: c and ('header' in c or 'category' in c or 'title' in c))
            header_raw = header_el.get_text(strip=True) if header_el else ''
            
            match = re.match(r'^([A-Z]+)\.?(.*)$', header_raw)
            if match:
                cat_code = match.group(1).strip()
                cat_name = match.group(2).strip()
            else:
                cat_code = ''
                cat_name = header_raw
                
            cat_skills_list = []
            skill_nodes = cat.find_all('li', class_=lambda c: c and 'skill-tree-skill-node' in c)
            
            for s_idx, skill_node in enumerate(skill_nodes, 1):
                link_el = skill_node.find('a')
                skill_url = f"{BASE_URL}{link_el.get('href')}" if link_el and link_el.get('href') else ''
                
                full_skill_text = skill_node.get_text(separator=' ', strip=True)
                
                num_match = re.match(r'^(\d+)\s+(.*)$', full_skill_text)
                if num_match:
                    skill_num = num_match.group(1)
                    skill_title = num_match.group(2)
                else:
                    skill_num = str(s_idx)
                    skill_title = full_skill_text
                
                full_code = f"{cat_code}.{skill_num}" if cat_code else skill_num
                
                record = {
                    'Key Stage': key_stage,
                    'Year': year_name,
                    'Category Code': cat_code,
                    'Category Name': cat_name,
                    'Skill Code': full_code,
                    'Skill Number': skill_num,
                    'Skill Title': skill_title,
                    'Skill URL': skill_url
                }
                
                all_records.append(record)
                cat_skills_list.append({
                    'code': full_code,
                    'number': skill_num,
                    'title': skill_title,
                    'url': skill_url
                })
                
            year_data['total_skills'] += len(cat_skills_list)
            year_data['categories'].append({
                'category_code': cat_code,
                'category_name': cat_name,
                'skills_count': len(cat_skills_list),
                'skills': cat_skills_list
            })
            
        structured_data[year_name] = year_data
        print(f"  -> Extracted {year_data['total_skills']} skills across {len(year_data['categories'])} categories.")
        
        summary_rows.append({
            'Key Stage': key_stage,
            'Year': year_name,
            'Total Categories': len(year_data['categories']),
            'Total Skills': year_data['total_skills'],
            'URL': year_url
        })
        
    # Save CSV
    df = pd.DataFrame(all_records)
    csv_path = 'IXL_UK_English_Curriculum.csv'
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Saved CSV: {csv_path}")
    
    # Save JSON
    json_path = 'IXL_UK_English_Curriculum.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(structured_data, f, ensure_ascii=False, indent=2)
    print(f"Saved JSON: {json_path}")
    
    # Save Excel with multiple sheets
    excel_path = 'IXL_UK_English_Curriculum.xlsx'
    with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='All Skills', index=False)
        
        summary_df = pd.DataFrame(summary_rows)
        summary_df.to_excel(writer, sheet_name='Summary', index=False)
        
        for y_name in df['Year'].unique():
            sheet_title = y_name[:31]
            sub_df = df[df['Year'] == y_name][['Category Code', 'Category Name', 'Skill Code', 'Skill Title', 'Skill URL']]
            sub_df.to_excel(writer, sheet_name=sheet_title, index=False)
            
    print(f"Saved Excel: {excel_path}")
    
    # Save Markdown
    md_path = 'IXL_UK_English_Curriculum.md'
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("# IXL UK English Curriculum — دليل المنهج الشامل\n\n")
        f.write(f"**إجمالي المهارات:** {len(all_records)} مهارة موزعة من مرحلة التمهيدي (Reception) حتى السنة 13 (Year 13).\n\n")
        f.write("## 📊 ملخص المراحل والسنوات الدراسية\n\n")
        f.write("| المرحلة (Key Stage) | السنة (Year) | عدد الأقسام | عدد المهارات |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        for s in summary_rows:
            f.write(f"| {s['Key Stage']} | [{s['Year']}]({s['URL']}) | {s['Total Categories']} | **{s['Total Skills']}** |\n")
        f.write("\n---\n\n")
        
        for y_name, y_info in structured_data.items():
            f.write(f"## 🎓 {y_name} ({y_info['key_stage']})\n\n")
            f.write(f"- **رابط الصفحة:** {y_info['url']}\n")
            f.write(f"- **إجمالي المهارات:** {y_info['total_skills']} مهارة\n\n")
            
            for cat in y_info['categories']:
                f.write(f"### {cat['category_code']}. {cat['category_name']} ({cat['skills_count']} skills)\n\n")
                for sk in cat['skills']:
                    f.write(f"- **{sk['code']}**: [{sk['title']}]({sk['url']})\n")
                f.write("\n")
            f.write("\n---\n\n")
    print(f"Saved Markdown: {md_path}")
    print("Done extracting all curriculum data!")

if __name__ == '__main__':
    extract_curriculum()
