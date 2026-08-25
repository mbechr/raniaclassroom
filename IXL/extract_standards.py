import urllib.request
import re
import json
from bs4 import BeautifulSoup
import pandas as pd

STANDARD_YEARS = [
    ('Year 1', '/standards/england/english/year-1', 'Key Stage 1'),
    ('Year 2', '/standards/england/english/year-2', 'Key Stage 1'),
    ('Year 3', '/standards/england/english/year-3', 'Key Stage 2'),
    ('Year 4', '/standards/england/english/year-4', 'Key Stage 2'),
    ('Year 5', '/standards/england/english/year-5', 'Key Stage 2'),
    ('Year 6', '/standards/england/english/year-6', 'Key Stage 2'),
    ('Year 7', '/standards/england/english/year-7', 'Key Stage 3'),
    ('Year 8', '/standards/england/english/year-8', 'Key Stage 3'),
    ('Year 9', '/standards/england/english/year-9', 'Key Stage 3'),
    ('Year 10', '/standards/england/english/year-10', 'Key Stage 4 (GCSE)'),
    ('Year 11', '/standards/england/english/year-11', 'Key Stage 4 (GCSE)'),
]

BASE_URL = 'https://uk.ixl.com'

def clean_hierarchy(hierarchy_list):
    # hierarchy_list comes bottom-up e.g. [objective, section, strand]
    # Remove consecutive duplicates while preserving order
    cleaned = []
    for item in hierarchy_list:
        item_str = item.strip()
        if item_str and (not cleaned or cleaned[-1] != item_str):
            cleaned.append(item_str)
    # reverse so it is top-down: [Strand, Section, Objective, ...]
    cleaned.reverse()
    return cleaned

def extract_standards():
    all_records = []
    structured_data = {}
    
    print("Starting England English National Curriculum extraction...")
    
    for year_name, path, key_stage in STANDARD_YEARS:
        url = f"{BASE_URL}{path}"
        print(f"Fetching standards for {year_name} ({key_stage}) from {url}...")
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        try:
            html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
        except Exception as e:
            print(f"Error fetching {year_name}: {e}")
            continue
            
        soup = BeautifulSoup(html, 'html.parser')
        container = soup.find('div', id='dv-listing-standards-alignment')
        if not container:
            print(f"No container found for {year_name}")
            continue
            
        alignments = container.find_all('li', class_='each-alignment')
        print(f"  Found {len(alignments)} mapped skills for {year_name}")
        
        year_skills = []
        for li_align in alignments:
            link = li_align.find('a')
            if not link:
                continue
                
            skill_text_raw = link.get_text(separator=' ', strip=True)
            skill_url = f"{BASE_URL}{link.get('href')}"
            
            # Find hierarchy
            parents = []
            p = li_align.parent
            while p and p != container:
                if p.name == 'li' and 'each-category' in p.get('class', []):
                    h = p.find(['h3', 'h4', 'span', 'p'], recursive=False)
                    if h:
                        parents.append(h.get_text(strip=True))
                elif p.name in ['ul', 'div']:
                    h = p.find_previous_sibling(['h3', 'h4'])
                    if h:
                        parents.append(h.get_text(strip=True))
                p = p.parent
                
            h_clean = clean_hierarchy(parents)
            
            strand = h_clean[0] if len(h_clean) > 0 else "English"
            section = h_clean[1] if len(h_clean) > 1 else ""
            objective = " > ".join(h_clean[2:]) if len(h_clean) > 2 else (section or strand)
            
            code_m = re.search(r'\(\s*([^)]+)\s*\)$', skill_text_raw)
            if code_m:
                skill_code = code_m.group(1).strip()
                skill_title = skill_text_raw[:code_m.start()].strip()
            else:
                skill_code = ""
                skill_title = skill_text_raw
                
            record = {
                'Key Stage': key_stage,
                'Year': year_name,
                'Curriculum Strand': strand,
                'Section / Topic': section,
                'Objective / Requirement': objective,
                'Skill Code': skill_code,
                'Skill Title': skill_title,
                'Skill URL': skill_url
            }
            all_records.append(record)
            year_skills.append(record)
            
        structured_data[year_name] = {
            'year': year_name,
            'key_stage': key_stage,
            'url': url,
            'skills_count': len(year_skills),
            'standards': year_skills
        }
        
    df = pd.DataFrame(all_records)
    csv_file = 'England_National_Curriculum_English_Standards.csv'
    df.to_csv(csv_file, index=False, encoding='utf-8-sig')
    print(f"Saved {len(df)} mapped standards to {csv_file}")
    
    json_file = 'England_National_Curriculum_English_Standards.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(structured_data, f, ensure_ascii=False, indent=2)
    print(f"Saved JSON: {json_file}")
    
    excel_file = 'England_National_Curriculum_English_Standards.xlsx'
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='All Standards Alignment', index=False)
        for y_name in df['Year'].unique():
            sheet_title = y_name[:31]
            sub_df = df[df['Year'] == y_name][['Curriculum Strand', 'Section / Topic', 'Objective / Requirement', 'Skill Code', 'Skill Title', 'Skill URL']]
            sub_df.to_excel(writer, sheet_name=sheet_title, index=False)
    print(f"Saved Excel: {excel_file}")
    print("Done extracting England National Curriculum standards!")

if __name__ == '__main__':
    extract_standards()
