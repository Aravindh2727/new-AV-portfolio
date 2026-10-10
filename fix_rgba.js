const fs = require('fs');
const path = require('path');

const projects = [
  {
    dir: 'portfolio/src',
    borderVar: 'var(--border-subtle)',
    bgVar: 'var(--pill-bg)'
  },
  {
    dir: 'project-showcase/src',
    borderVar: 'var(--border-tech)',
    bgVar: 'var(--pill-bg)'
  },
  {
    dir: 'admin/src',
    borderVar: 'var(--border-color)',
    bgVar: 'var(--bg-hover)'
  },
  {
    dir: 'shared/theme',
    borderVar: 'var(--border-subtle, var(--border-tech, var(--border-color)))',
    bgVar: 'var(--pill-bg)'
  }
];

function processDirectory(directory, borderVar, bgVar) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, borderVar, bgVar);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Replace inline backgrounds
      content = content.replace(/background:\s*['"]rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)['"]/gi, `background: '${bgVar}'`);
      content = content.replace(/backgroundColor:\s*['"]rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)['"]/gi, `backgroundColor: '${bgVar}'`);
      
      // Replace inline borders
      content = content.replace(/border:\s*['"]1px solid rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)['"]/gi, `border: '1px solid ${borderVar}'`);
      content = content.replace(/borderBottom:\s*['"]1px solid rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)['"]/gi, `borderBottom: '1px solid ${borderVar}'`);
      content = content.replace(/borderColor:\s*['"]rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)['"]/gi, `borderColor: '${borderVar}'`);
      
      // For Admin projects.jsx line 322: proj.featured ? 'rgba(...)' : 'rgba(255,255,255,0.08)'
      content = content.replace(/'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\)'/gi, (match) => {
         // if this is somehow matched alone
         return `'${borderVar}'`; // We assume most lone 'rgba(255...)' in styles are borders, but in our regex earlier we handled keys. For exact string matches in ternaries:
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
  processDirectory(path.join(basePath, proj.dir), proj.borderVar, proj.bgVar);
}
