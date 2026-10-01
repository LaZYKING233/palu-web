const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const menuLabel = menuToggle?.querySelector('.menu-label');

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (menuLabel) menuLabel.textContent = '菜单';
};

menuToggle?.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  nav?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  if (menuLabel) menuLabel.textContent = willOpen ? '关闭' : '菜单';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  // threshold 必须是 0：.reveal 里可能有整章正文那么高的元素（比如手册的章节列表），
  // 按比例触发的话它需要露出自身高度的一定比例才生效，直接跳锚点时永远达不到，
  // 结果是整块内容一直停在 opacity: 0。任意一点进入视口就显示。
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  revealItems.forEach((item) => observer.observe(item));
}

// 兜底：直接带 #锚点进来、或点击锚点跳转后，浏览器是瞬时定位的，
// 观察器可能来不及触发。这里主动把已经进入（或已滚过）视口的元素点亮。
const revealPassed = () => {
  revealItems.forEach((item) => {
    if (item.classList.contains('is-visible')) return;
    if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add('is-visible');
  });
};
window.addEventListener('pageshow', revealPassed);
window.addEventListener('hashchange', () => setTimeout(revealPassed, 60));
revealPassed();

// 手册：跳到某个章节时顺手把它展开，否则会停在一行标题上
const openChapter = (id) => {
  const target = document.getElementById(id);
  if (target?.tagName === 'DETAILS') target.open = true;
};
const chapterLinks = document.querySelectorAll('a[href^="#ch-"]');
chapterLinks.forEach((link) => link.addEventListener('click', () => openChapter(link.hash.slice(1))));
if (window.location.hash.startsWith('#ch-')) openChapter(window.location.hash.slice(1));

