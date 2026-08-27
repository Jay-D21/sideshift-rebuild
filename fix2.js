const fs = require('fs');
const files = [
  'src/app/dashboard/billing/page.tsx',
  'src/app/dashboard/settings/page.tsx',
  'src/app/dashboard/submissions/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/let ([a-zA-Z0-9_]+) = \[\]/g, 'let ' + '$' + '1' + ': any[] = []');
    content = content.replace(/let ([a-zA-Z0-9_]+) = \{\}/g, 'let ' + '$' + '1' + ': any = {}');
    
    fs.writeFileSync(file, content);
  }
}
