#!/usr/bin/env node

/**
 * Render Deploy Hook Trigger Script
 * Usage:
 *   node scripts/trigger-deploy.js [portfolio|showcase|admin|all]
 */

const https = require('https');

const DEPLOY_HOOKS = {
  portfolio: {
    name: 'Personal Portfolio (my-portfolio)',
    url: process.env.RENDER_DEPLOY_HOOK_PORTFOLIO ||
         process.env.VITE_RENDER_DEPLOY_HOOK_PORTFOLIO ||
         'https://api.render.com/deploy/srv-db5qhc3l550s73b2h2o0?key=dbNKn5ckvVY'
  },
  showcase: {
    name: 'Project Showcase (my-showcase)',
    url: process.env.RENDER_DEPLOY_HOOK_SHOWCASE ||
         process.env.VITE_RENDER_DEPLOY_HOOK_SHOWCASE ||
         'https://api.render.com/deploy/srv-db5qoafavr4c739o9qf0?key=7Usx2xUf1NI'
  },
  admin: {
    name: 'Admin CMS Portal (my-admin)',
    url: process.env.RENDER_DEPLOY_HOOK_ADMIN ||
         process.env.VITE_RENDER_DEPLOY_HOOK_ADMIN ||
         'https://api.render.com/deploy/srv-db5r13g473hc73c43vj0?key=ofHb1sEzg3A'
  }
};

function triggerDeploy(targetKey) {
  const target = DEPLOY_HOOKS[targetKey];
  if (!target) {
    console.error(`❌ Unknown target: "${targetKey}". Choose from: portfolio, showcase, admin, all.`);
    return Promise.reject(new Error(`Unknown target: ${targetKey}`));
  }

  return new Promise((resolve, reject) => {
    console.log(`🚀 Triggering deployment for ${target.name}...`);
    const parsedUrl = new URL(target.url);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Length': 0,
        'User-Agent': 'DeployHookTrigger/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ [${targetKey.toUpperCase()}] Deployment triggered successfully! (Status: ${res.statusCode})`);
          try {
            const json = JSON.parse(body);
            if (json.deploy) {
              console.log(`   Deploy ID: ${json.deploy.id || 'N/A'}`);
              console.log(`   Status:    ${json.deploy.status || 'created'}`);
            }
          } catch {
            // body wasn't JSON or simple string
          }
          resolve({ target: targetKey, success: true });
        } else {
          console.error(`⚠️ [${targetKey.toUpperCase()}] Received HTTP ${res.statusCode}: ${body}`);
          resolve({ target: targetKey, success: false, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ [${targetKey.toUpperCase()}] Error triggering deploy:`, err.message);
      reject(err);
    });

    req.end();
  });
}

async function main() {
  const arg = (process.argv[2] || 'all').toLowerCase();

  console.log('====================================================');
  console.log('       Render Automated Deploy Hook Trigger         ');
  console.log('====================================================\n');

  if (arg === 'all') {
    for (const key of Object.keys(DEPLOY_HOOKS)) {
      try {
        await triggerDeploy(key);
      } catch (err) {
        // continue with other deployments
      }
      console.log('---');
    }
  } else if (DEPLOY_HOOKS[arg]) {
    await triggerDeploy(arg);
  } else {
    console.log(`Usage: node scripts/trigger-deploy.js [portfolio|showcase|admin|all]`);
    process.exit(1);
  }

  console.log('\n✨ Deployment trigger requests completed. Check your Render Dashboard for live build progress!');
}

main().catch(() => process.exit(1));
