import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('uses the exact Baidu HTML verification tag', () => {
  assert.match(
    html,
    /<meta name="baidu-site-verification" content="codeva-jeCgWdhzDJ" \/>/,
  );
});

test('uses current product positioning and social metadata', () => {
  assert.match(html, /<title>QFO量化回测平台 \| A股量化研究与回测工具<\/title>/);
  assert.match(html, /免费开源、本地运行的 A 股量化研究与回测平台/);
  assert.match(html, /<h1>免费开源的 A 股量化回测平台<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.qfo-quant-platform\.com\/"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /name="twitter:card"/);
  assert.match(html, /type="application\/ld\+json"/);
  const structuredData = JSON.parse(
    html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '',
  );
  assert.equal(structuredData.softwareVersion, 'latest');
  assert.match(structuredData.downloadUrl, /releases\/latest\/download\/QFO-Quant-Platform\.zip/);
  assert.doesNotMatch(html, /教学网站|组合风控|智能选股与因子/);
});

test('separates primary conversion actions from secondary learning links', () => {
  const hero = html.match(/<section class="hero" id="overview">([\s\S]*?)<\/section>/)?.[1] || '';
  const actions = hero.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] || '';
  const learningLinks = hero.match(/<nav class="hero-learning-links"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';

  assert.equal((actions.match(/class="button/g) || []).length, 2);
  assert.match(
    actions,
    /data-release-download[\s\S]*?>查看 GitHub</,
  );
  assert.doesNotMatch(actions, /bilibili\.com|#quickstart/);
  assert.match(
    learningLinks,
    /BV1yDbQ6cEW7\/"[^>]*>73秒项目总览<[\s\S]*?BV18Cby6XEfR\/"[^>]*>完整教学<[\s\S]*?href="#quickstart">三步快速开始</,
  );
});

test('offers a stable release download', () => {
  assert.match(html, /releases\/latest\/download\/QFO-Quant-Platform\.zip/);
  assert.doesNotMatch(html, /archive\/refs\/tags\/v1\.0\.0\.zip/);
  assert.doesNotMatch(html, />v1\.0\.0</);
});

test('links the independent Codex cleanup tool without implying QFO integration', () => {
  const noticeIndex = html.indexOf('id="notice"');
  const toolIndex = html.indexOf('id="other-tools"');
  const contactIndex = html.indexOf('id="contact"');
  assert.ok(noticeIndex < toolIndex && toolIndex < contactIndex);

  const section = html.match(/<section class="section" id="other-tools">([\s\S]*?)<\/section>/)?.[1] || '';
  assert.match(section, /作者的其他开源工具/);
  assert.match(section, /chatgpt-codex-local-history-cleanup-tool/);
  assert.match(section, /chatgpt-codex-local-history-cleanup-tool\/releases\/latest/);
  assert.match(section, /与 QFO 功能和数据互不关联/);
  assert.match(section, /target="_blank" rel="noopener noreferrer"/);
});

test('routes user questions to Discussions and reproducible bugs to Issue Forms', () => {
  const contact = html.match(/<section class="section" id="contact">([\s\S]*?)<\/section>/)?.[1] || '';
  assert.match(contact, /安装或操作问题/);
  assert.match(contact, /QFO-Quant-Platform\/discussions/);
  assert.match(contact, />进入 Discussions</);
  assert.match(contact, /QFO-Quant-Platform\/issues\/new\/choose/);
  assert.match(contact, />提交 Issue</);
});

test('shows at least six real product previews', () => {
  const preview = html.match(/<section class="section" id="preview">([\s\S]*?)<\/section>/)?.[1] || '';
  assert.ok((preview.match(/<figure>/g) || []).length >= 6);
  assert.match(preview, /因子模块/);
  assert.match(preview, /可视化/);
});

test('contains mobile overflow protections', () => {
  assert.match(css, /\.top-nav a\s*{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.side-nav\s*{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.hero-actions\s*{[^}]*flex-wrap:\s*wrap/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.guide-content table\s*{[^}]*display:\s*block[^}]*overflow-x:\s*auto/s);
});

test('sizes images and lazily loads preview media', () => {
  assert.match(css, /img\s*{[^}]*height:\s*auto/s);
  const images = [...html.matchAll(/<img\s+[^>]+>/g)].map((match) => match[0]);
  assert.ok(images.length >= 7);
  for (const image of images) {
    assert.match(image, /\swidth="\d+"/);
    assert.match(image, /\sheight="\d+"/);
  }
  for (const image of images.slice(1)) assert.match(image, /loading="lazy"/);
});

test('labels sandbox controls and demonstration results', () => {
  assert.match(html, /演示数据 · 非真实回测/);
  for (const id of ['capital', 'risk', 'factor']) {
    assert.match(html, new RegExp(`<input[^>]+id="${id}"[^>]+aria-label="[^"]+"`));
  }
});

test('ships crawler metadata files', () => {
  const robots = readFileSync(new URL('../robots.txt', import.meta.url), 'utf8');
  const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/www\.qfo-quant-platform\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.qfo-quant-platform\.com\/<\/loc>/);
});

test('publishes a beginner guide hub and links it from the homepage', () => {
  const guidesPath = new URL('../guides/index.html', import.meta.url);
  assert.ok(existsSync(guidesPath), 'missing guides/index.html');
  assert.match(html, /href="guides\/">新手教程<\/a>/);
  assert.match(html, /id="guides"/);

  const guides = readFileSync(guidesPath, 'utf8');
  assert.match(guides, /Windows 首次安装与常见错误/);
  assert.match(guides, /首次数据同步为什么需要 2～4 小时/);
  assert.match(guides, /股票、ETF、可转债筛选有什么区别/);
});

test('publishes three focused and cross-linked beginner guides', () => {
  const files = [
    ['windows-install.html', /run_first_time\.bat/, /安装失败反馈/],
    ['first-data-sync.html', /2～4 小时/, /强制补历史/],
    ['asset-screening.html', /股票/, /ETF/, /可转债/, /不构成投资建议/],
  ];

  for (const [name, ...patterns] of files) {
    const path = new URL(`../guides/${name}`, import.meta.url);
    assert.ok(existsSync(path), `missing guides/${name}`);
    const guide = readFileSync(path, 'utf8');
    assert.match(guide, /rel="canonical" href="https:\/\/www\.qfo-quant-platform\.com\/guides\//);
    assert.match(guide, /href="\.\/">返回教程中心<\/a>/);
    for (const pattern of patterns) assert.match(guide, pattern);
  }
});

test('lists every beginner guide in the sitemap', () => {
  const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  for (const route of [
    '/guides/',
    '/guides/windows-install.html',
    '/guides/first-data-sync.html',
    '/guides/asset-screening.html',
  ]) {
    assert.match(sitemap, new RegExp(`<loc>https://www\\.qfo-quant-platform\\.com${route.replaceAll('.', '\\.')}`));
  }
});

test('loads Vercel Web Analytics', () => {
  assert.match(html, /window\.va\s*=\s*window\.va\s*\|\|\s*function/);
  assert.match(html, /<script defer src="\/_vercel\/insights\/script\.js"><\/script>/);
});

test('loads Vercel Speed Insights', () => {
  assert.match(html, /window\.si\s*=\s*window\.si\s*\|\|\s*function/);
  assert.match(html, /<script defer src="\/_vercel\/speed-insights\/script\.js"><\/script>/);
});

test('updates download links from the latest GitHub release', () => {
  assert.match(html, /data-release-download/);
  assert.match(html, /data-release-tag/);
  assert.match(html, /data-release-date/);
  assert.match(app, /api\.github\.com\/repos\/yeh2017\/QFO-Quant-Platform\/releases\/latest/);
  assert.match(app, /QFO-Quant-Platform\.zip/);
  assert.match(app, /browser_download_url/);
  assert.match(app, /zipball_url/);
  assert.match(app, /initLatestRelease\(\)/);
});

test('sets baseline security headers on every route', () => {
  const rule = vercel.headers?.find((entry) => entry.source === '/(.*)');
  assert.ok(rule, 'missing global Vercel header rule');
  const headers = Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]));
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.match(headers['Permissions-Policy'], /camera=\(\)/);
  assert.match(headers['Content-Security-Policy'], /default-src 'self'/);
  assert.match(headers['Content-Security-Policy'], /connect-src 'self' https:\/\/api\.github\.com/);
});

test('uses a dedicated social sharing image', () => {
  assert.match(html, /property="og:image" content="https:\/\/www\.qfo-quant-platform\.com\/assets\/qfo-share\.webp"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:image" content="https:\/\/www\.qfo-quant-platform\.com\/assets\/qfo-share\.webp"/);
});

test('ships a concise branded 404 page', () => {
  const notFound = readFileSync(new URL('../404.html', import.meta.url), 'utf8');
  assert.match(notFound, /<title>页面未找到 \| QFO量化回测平台<\/title>/);
  assert.match(notFound, /name="robots" content="noindex, follow"/);
  assert.match(notFound, /href="\/"[^>]*>返回首页<\/a>/);
  assert.match(notFound, /href="https:\/\/github\.com\/yeh2017\/QFO-Quant-Platform"/);
});
