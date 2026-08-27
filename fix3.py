import os
import re

files = [
  'src/app/dashboard/billing/page.tsx',
  'src/app/dashboard/settings/page.tsx',
  'src/app/dashboard/submissions/page.tsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("const { data:  }: { data: any[] | null } = (await supabase", "const { data: brand } = await (supabase as any)")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
