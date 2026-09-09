const { chromium } = require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 await page.screenshot({path:path.join(__dirname,'preview-desktop.png'),fullPage:true});
 await page.locator('[data-action="resources"]').click();
 if(!await page.getByText('86.50',{exact:true}).isVisible())throw Error('Resource panel missing');
 await page.locator('#close').click();
 await page.locator('[data-action="network-refresh"]').click();
 await page.locator('#captcha').fill('P4LU');await page.locator('[data-action="captcha-submit"]').click();
 await page.locator('[data-action="settings"]').click();await page.locator('[data-action="shortcuts"]').click();
 await page.locator('[name="shortcut"]:checked').first().uncheck();await page.locator('[data-action="save-shortcuts"]').click();
 for(const role of ['teacher','freshman','guest','admin','student']){
  await page.locator('#role').selectOption(role);
  const label={teacher:'学生成绩查询',freshman:'待办事项',guest:'请先绑定校园账号 →',admin:'管理后台',student:'学业情况查询'}[role];
  if(!await page.getByText(label,{exact:true}).first().isVisible())throw Error('Missing role entry '+role);
 }
 for(const state of ['empty','expired','unbound','normal'])await page.locator('#scenario').selectOption(state);
 await page.locator('#toast').evaluate(el=>el.classList.remove('visible'));
 await page.evaluate(()=>{shortcuts.student=['gpa-calculator','electricity'];render()});
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);
 }
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:path.join(__dirname,'preview-home-mobile.png'),fullPage:true});
 await page.locator('.home-screen [data-tab="profile"]').click();
 if(!await page.locator('.profile-screen').isVisible())throw Error('Mobile tab failure');
 await page.screenshot({path:path.join(__dirname,'preview-profile-mobile.png'),fullPage:true});
 await page.locator('#theme').click();
 await page.screenshot({path:path.join(__dirname,'preview-dark-mobile.png'),fullPage:true});
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: 5 roles, 4 states, 5 viewport widths, resources, captcha, shortcuts, mobile navigation; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
