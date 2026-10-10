const fs = require('fs');
const path = require('path');

const projects = [
  {
    dir: 'portfolio/src',
    replacements: [
      { regex: /^#(ffffff|fff|f8fafc)$/i, replace: "'var(--text-primary)'" },
      { regex: /^#(94a3b8|cbd5e1)$/i, replace: "'var(--text-secondary)'" },
      { regex: /^#(64748b)$/i, replace: "'var(--text-muted)'" }
    ]
  },
  {
    dir: 'project-showcase/src',
    replacements: [
      { regex: /^#(ffffff|fff|f1f5f9|f8fafc)$/i, replace: "'var(--text-pure)'" },
      { regex: /^#(94a3b8|cbd5e1)$/i, replace: "'var(--text-muted)'" },
      { regex: /^#(64748b)$/i, replace: "'var(--text-dim)'" }
    ]
  },
  {
    dir: 'admin/src',
    replacements: [
      { regex: /^#(ffffff|fff|f8fafc)$/i, replace: "'var(--text-main)'" },
      { regex: /^#(94a3b8|cbd5e1)$/i, replace: "'var(--text-muted)'" },
      { regex: /^#(64748b)$/i, replace: "'var(--text-dim)'" }
    ]
  }
];

function processDirectory(directory, replacements) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, replacements);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      const styleRegex = /(color|background|backgroundColor|borderColor|border|background-color|fill|stroke):\s*['"]?(#[a-f0-9]{3,6})['"]?/gi;
      
      content = content.replace(styleRegex, (match, property, hex) => {
         let newValue = match;
         for(const r of replacements) {
             if (r.regex.test(hex)) {
                 // Do not replace background colors that are explicitly meant to be white 
                 // (Unless they are the page background, but usually inline backgrounds are cards etc.)
                 // Wait, if it's a background on a card, it should use var(--bg-card). 
                 // Let's only replace `color` property for now, as that's the main readability issue.
                 if (property.toLowerCase() === 'color') {
                    newValue = `${property}: ${r.replace}`;
                 }
                 break;
             }
         }
         return newValue;
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

const basePath = 'd:/Projects/new portfolio 2026';
for (const proj of projects) {
  processDirectory(path.join(basePath, proj.dir), proj.replacements);
}
