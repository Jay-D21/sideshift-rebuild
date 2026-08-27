import re
import os

files = [
  'src/app/dashboard/analytics/page.tsx',
  'src/app/dashboard/billing/page.tsx',
  'src/app/dashboard/settings/page.tsx',
  'src/app/dashboard/submissions/page.tsx'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # In case I replaced const { data: name } with something bad, I will just fix the supabase type.
        # Let's fix missing auth parentheses or something
        content = re.sub(r'const \{ data: ([a-zA-Z0-9_]+) \}: \{ data: any\[\] \| null \} = \(await supabase', r'const { data: \g<1> } = await (supabase as any)', content)
        content = re.sub(r'const \{ data: brand \}: \{ data: any \} = \(await supabase', r'const { data: brand } = await (supabase as any)', content)
        
        # fix let var = [] -> let var: any[] = []
        content = re.sub(r'let ([a-zA-Z0-9_]+) = \[\]', r'let \g<1>: any[] = []', content)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
print("Done")
