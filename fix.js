const fs = require('fs');
const files = [
  'src/app/dashboard/analytics/page.tsx',
  'src/app/dashboard/billing/page.tsx',
  'src/app/dashboard/settings/page.tsx',
  'src/app/dashboard/submissions/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Revert my corrupted line
  content = content.replace(/const \{ data: campaigns \} = \(await[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n/g, '');
  
  // Actually, let's just make the data types any
  content = content.replace(/const \{ data: ([a-zA-Z0-9_]+) \} = await supabase/g, 'const { data:  }: { data: any[] | null } = (await supabase');
  content = content.replace(/const \{ data: brand \} = await supabase/g, 'const { data: brand }: { data: any } = (await supabase');
  
  // We need to add the closing parenthesis for the await
  content = content.replace(/const \{ data: ([a-zA-Z0-9_]+) \}: \{ data: any\[\] \| null \} = \(await supabase\n\s*\.from\('([^']+)'\)\n\s*\.select\('([^']+)'\)\n\s*\.eq\('([^']+)', ([^)]+)\)/g, 'const { data:  }: { data: any[] | null } = await supabase.from(\'\').select(\'\').eq(\'\', ) as any');
  
  // Actually regex replacing TypeScript AST is hard. Let's just do a simpler trick:
  // Replace const { data: x } = await supabase with const { data: x } = await (supabase as any)
  
  fs.writeFileSync(file, content);
}
