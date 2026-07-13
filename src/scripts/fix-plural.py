import os
import glob

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace(old, new)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)

for filepath in glob.glob(r'c:\Users\DIKKA\Documents\01-Projects\15-Electrotion\electrotion-web\backend\src\api\**\*.ts', recursive=True):
    replace_in_file(filepath, "Portfolioes", "Portfolios")
    replace_in_file(filepath, "portfolioes", "portfolios")

replace_in_file(r'c:\Users\DIKKA\Documents\01-Projects\15-Electrotion\electrotion-web\src\features\home\components\PortfoliosShowcase.tsx', "res.portfolioes", "res.portfolios")

print("Fixed Portfolioes -> Portfolios")
