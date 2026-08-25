import os
import sys
import base64
import json
import urllib.request
import webbrowser

REPO_OWNER = "mbechr"
REPO_NAME = "raniaclassroom"
BRANCH = "main"

FILES_TO_UPLOAD = [
    "index.html",
    "styles.css",
    "app.js",
    "lessons_engine.js",
    "data.js",
    "IXL_UK_English_Curriculum.xlsx",
    "England_National_Curriculum_English_Standards.xlsx"
]

def upload_via_api(token):
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "IXL-AutoDeploy"
    }
    
    print(f"\n🚀 Deploying files to https://github.com/{REPO_OWNER}/{REPO_NAME} (Branch: {BRANCH})...\n")
    
    for filename in FILES_TO_UPLOAD:
        if not os.path.exists(filename):
            continue
            
        print(f"Uploading {filename}...", end=" ", flush=True)
        
        with open(filename, "rb") as f:
            content_bytes = f.read()
            
        content_b64 = base64.b64encode(content_bytes).decode("utf-8")
        
        # Check if file exists to get SHA for update
        url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{filename}"
        sha = None
        
        try:
            req = urllib.request.Request(url, headers=headers)
            res = urllib.request.urlopen(req)
            if res.getcode() == 200:
                data = json.loads(res.read().decode("utf-8"))
                sha = data.get("sha")
        except Exception:
            pass # File does not exist yet
            
        payload = {
            "message": f"Deploy {filename}",
            "content": content_b64,
            "branch": BRANCH
        }
        if sha:
            payload["sha"] = sha
            
        data_json = json.dumps(payload).encode("utf-8")
        
        try:
            put_req = urllib.request.Request(url, data=data_json, headers=headers, method="PUT")
            with urllib.request.urlopen(put_req) as response:
                if response.getcode() in [200, 201]:
                    print("✅ DONE")
                else:
                    print(f"⚠️ Status: {response.getcode()}")
        except Exception as e:
            print(f"❌ Error: {e}")

    print("\n🎉 All files uploaded successfully!")
    print(f"🌐 Live URL: https://{REPO_OWNER}.github.io/{REPO_NAME}/")
    print(f"⚙️ Pages Settings: https://github.com/{REPO_OWNER}/{REPO_NAME}/settings/pages\n")
    webbrowser.open(f"https://github.com/{REPO_OWNER}/{REPO_NAME}/settings/pages")

def main():
    print("=" * 60)
    print(f"  IXL UK English — Automatic GitHub Deployment Tool")
    print(f"  Repository: https://github.com/{REPO_OWNER}/{REPO_NAME}")
    print("=" * 60)
    
    token_file = "github_token.txt"
    token = ""
    
    if os.path.exists(token_file):
        with open(token_file, "r", encoding="utf-8") as f:
            token = f.read().strip()
            
    if not token:
        print("\nChoose an option:")
        print("1. Enter GitHub Personal Access Token (Automatic 1-Click Upload)")
        print("2. Open GitHub Upload Page in Browser (Drag & Drop in 5 seconds)")
        choice = input("\nSelect (1 or 2): ").strip()
        
        if choice == "1":
            print("\nPaste your GitHub Token (create one at https://github.com/settings/tokens with 'repo' scope):")
            token = input("Token: ").strip()
            if token:
                with open(token_file, "w", encoding="utf-8") as f:
                    f.write(token)
                upload_via_api(token)
                return
        else:
            upload_url = f"https://github.com/{REPO_OWNER}/{REPO_NAME}/upload/{BRANCH}"
            print(f"\nOpening {upload_url} in browser...")
            webbrowser.open(upload_url)
            os.system(f'explorer /select,"{os.path.abspath("index.html")}"')
            print("Drag the files into GitHub and click 'Commit changes'!")
            return
    else:
        upload_via_api(token)

if __name__ == "__main__":
    main()
