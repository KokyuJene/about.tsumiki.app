const THEME_KEY = 'tsumiki_theme';

let blogPosts = [];
let blogCurrentTag = 'all';
let blogLoadError = '';

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  const moonIcon = document.getElementById('moonIcon');
  const sunIcon = document.getElementById('sunIcon');
  if (moonIcon) moonIcon.style.display = isDark ? 'none' : '';
  if (sunIcon) sunIcon.style.display = isDark ? '' : 'none';
  const heroLogo = document.getElementById('heroLogo');
  if (heroLogo) {
    heroLogo.src = isDark
      ? 'https://tsumiki.app/tsumiki_logo_akarui.svg'
      : 'https://tsumiki.app/tsumiki_logo.svg';
  }
  const siteLogo = document.getElementById('siteLogo');
  if (siteLogo) {
    siteLogo.src = isDark
      ? 'https://tsumiki.app/tsumiki_logo_akarui.svg'
      : 'https://tsumiki.app/tsumiki_logo.svg';
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    applyTheme(true);
  } else if (saved === 'light') {
    applyTheme(false);
  } else {
    applyTheme(false);
  }
}

function toggleTheme() {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function renderBlogPosts(tag) {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  if (blogLoadError) {
    grid.innerHTML = `<div class="empty-state">${blogLoadError}</div>`;
    return;
  }
  const filtered = tag === 'all' ? blogPosts : blogPosts.filter(p => p.tag === tag);
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">記事がまだありません。<br>近日公開予定です。</div>';
    return;
  }
  grid.innerHTML = filtered.map((p, i) => {
    const bodyHtml = p.contentHtml
      ? p.contentHtml
      : (p.content || []).map(line => `<p>${line}</p>`).join('');
    return `
      <div class="blog-entry${p.open ? ' open' : ''}" id="post-${i}">
        <div class="blog-header" data-post-id="${i}">
          <div class="blog-head-main">
            <div class="blog-meta">
              <span class="blog-tag">${p.tagLabel || ''}</span>
            </div>
            <div class="blog-title">${p.title}</div>
            <div class="blog-excerpt">${p.excerpt || ''}</div>
          </div>
          <span class="blog-date">${p.date}</span>
          <svg class="blog-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="blog-body">
          <div class="blog-content">${bodyHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleBlogPost(i) {
  const entry = document.getElementById(`post-${i}`);
  if (entry) entry.classList.toggle('open');
}

function filterBlogTag(tag, btn) {
  blogCurrentTag = tag;
  document.querySelectorAll('#tagFilter .nav-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBlogPosts(tag);
}

async function initBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state">読み込み中...</div>';
  try {
    const postsUrl = new URL('posts.json', location.href).toString();
    const res = await fetch(postsUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    blogPosts = Array.isArray(data) ? data : (data.posts || []);
    blogLoadError = '';
  } catch (err) {
    blogPosts = [];
    blogLoadError = 'posts.json の読み込みに失敗しました。URLを確認してください。';
  }
  renderBlogPosts(blogCurrentTag);
}

function bindBlogEvents() {
  const tagFilter = document.getElementById('tagFilter');
  if (tagFilter) {
    tagFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-pill[data-tag]');
      if (!btn) return;
      filterBlogTag(btn.getAttribute('data-tag'), btn);
    });
  }

  const grid = document.getElementById('blogGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const header = e.target.closest('.blog-header');
      if (!header) return;
      const postId = header.getAttribute('data-post-id');
      if (postId) toggleBlogPost(postId);
    });
  }
}

const CHANGELOG_VERSIONS = [
  {
    version: 'v1.14.0', date: '2026.05.08', type: 'minor', open: true,
    summary: 'ロゴの追加。',
    items: [
      { tag:'add',    text:'ロゴを追加' },
      { tag:'change',    text:'navの上部にあるツミキappをsvgに' },
      { tag:'fix',    text:'ToDo優先度カラーのカスタムカラーピッカーのバグ修正' },
    ],
  },
  {
    version: 'v1.13.0', date: '2026.04.30', type: 'minor', open: true,
    summary: '',
    items: [
      { tag:'change',    text:'音楽自動再生に調整を加えました(タップで自動再開の有効時間の設定項目の追加)' },
      { tag:'change',    text:'デザインの統一' },
      { tag:'add',    text:'ToDoリストの並び替え機能の追加' },
      { tag:'add',    text:'ToDo優先度カラーのカスタムカラーピッカーを追加' },
    ],
  },
  {
    version: 'v1.12.0', date: '2026.4.25', type: 'major', open: true,
    summary: 'favicon v2に変更したり、結構色々小さいですが変わりました。',
    items: [
      { tag:'change',    text:'favicon - v2に変更' },
      { tag:'add',    text:'faviconにて複数の解像度に対応' },
      { tag:'change',    text:'音楽自動再生を追加' },
      { tag:'add',    text:'一時停止時間の記録の追加' },
      { tag:'add',    text:'時刻によって変わるバーがリスト内の記録に追加(これでわかりやすく!)' },
      { tag:'fix',    text:'音楽のゾンビバグなどを修正' },
      { tag:'change',    text:'名称をツミキからツミキappへ統合' },
      { tag:'remove',    text:'時刻によって変わるテーマカラーの設定機能の削除' },
    ],
  },
  {
    version: 'v1.11.0', date: '2025.4.7', type: 'minor', open: false,
    summary: '独自ドメインへの移行',
    items: [
      { tag:'change',    text:'https://tsumiki.app ドメインを購入/移行' },
      { tag:'add',    text:'時刻によって変わるテーマカラーの設定機能の追加' },
    ],
  },
  {
    version: 'v1.05.0-v1.10.0', date: '2025.12.14-2026.3.24', type: 'major', open: false,
    summary: '同じくまとめさせてもらいます...!',
    items: [
      { tag:'add', text:'カスタムポップアップ追加' },
      { tag:'add', text:'このサイトについてポップアップを追加' },
      { tag:'', text:'---' },
      { tag:'add', text:'データのエクスポート/インポートの追加' },
      { tag:'add', text:'ガイドの追加' },
      { tag:'', text:'---' },
      { tag:'change', text:'チュートリアルの日本語の修正' },
      { tag:'', text:'---' },
      { tag:'change', text:'ToDoの大幅進化(繰り返し機能, 優先度追加)' },
      { tag:'fix', text:'iOS等でToDoが追加できない問題の修正' },
      { tag:'add', text:'グラフ機能の追加' },
      { tag:'', text:'---' },
      { tag:'change', text:'再生ボタンなどのアイコンの色味の調整(<a href="https://github.com/KokyuJene/kokyujene.github.io/commit/d35e74c8ae82b0858810775be1843f146a0ac1e7#diff-d5190905b2090c0c7a252febb3da6c70415137953b4787c02958c4d2d006540e" target="_blank" style="text-decoration: underline;">違いはこちら</a>)' },
      { tag:'add', text:'英語対応' },
      { tag:'', text:'---' },
      { tag:'add', text:'フォント17種類追加' },
      { tag:'add', text:'タイマー作動中の設定ボタン無効化を追加' },
      { tag:'add', text:'サイトアクセス時のアニメーション追加' },
      { tag:'', text:'---' },
      { tag:'add', text:'ToDo V2登場(カレンダー, 進行度などなど...)' },
      { tag:'', text:'---' },
      { tag:'add', text:'フォーカスモード(ポモドーロテクニック)を追加' },
      { tag:'', text:'---' },
      { tag:'change', text:'tools.super-hiko14.com/study/に移行' },
      { tag:'', text:'---' },
      { tag:'add', text:'音楽でプレイリスト機能を追加(気分で音楽のプレイリストを変更できます)' },
      { tag:'', text:'メモ: ちなみにこれらは当時呼んでいたバージョンとは少し違います。ここまでは当時のバージョン名称でいう10.0までまとめました。' },
    ],
  },
  {
    version: 'v1.00.0-v1.05.0', date: '2025.11.30-2025.12.13', type: 'major', open: false,
    summary: '都合上まとめさせてもらいます...!',
    items: [
      { tag:'add', text:'ストップウォッチ形式のタイマー機能' },
      { tag:'add', text:'一時停止/再開に対応' },
      { tag:'add', text:'履歴リスト' },
      { tag:'add', text:'ダークモード対応' },
      { tag:'add', text:'ローカルストレージ保存' },
      { tag:'', text:'---' },
      { tag:'add', text:'統計機能の追加' },
      { tag:'', text:'---' },
      { tag:'add', text:'設定画面の追加' },
      { tag:'add', text:'テーマ6色追加' },
      { tag:'add', text:'favicon - v1を追加' },
      { tag:'', text:'---' },
      { tag:'add', text:'音楽機能追加(ループ, 前/次, ループ, シャッフル, .mp3,.wav,.flac,.m4a,.aac,.ogg,.webm対応, 音量調整機能搭載)' },
      { tag:'add', text:'ToDo機能追加(完了か否か, 削除機能のみ)' },
      { tag:'', text:'---' },
      { tag:'change', text:'テーマカラーCSSの整理' },
      { tag:'add', text:'音楽のフォルダインポート対応' },
      { tag:'fix', text:'音楽機能の動画やexeファイルをインポートできた問題を修正' },
      { tag:'', text:'---' },
      { tag:'change', text:'デザイン刷新(テーマカラー)' },
      { tag:'', text:'メモ: ちなみにこれらは当時呼んでいたバージョンとは少し違います。ここまでは当時のバージョン名称でいう5.0までまとめました。' },
    ],
  },
];

function changelogBadgeClass(type) {
  return type === 'major' ? 'badge-major' : type === 'minor' ? 'badge-minor' : 'badge-patch';
}
function changelogBadgeLabel(type) {
  return type === 'major' ? 'Major' : type === 'minor' ? 'Minor' : 'Patch';
}
function changelogTagClass(tag) {
  return 'tag-' + tag;
}
function changelogTagLabel(tag) {
  return { add:'追加', fix:'修正', change:'変更', remove:'削除' }[tag] || tag;
}

function renderChangelog() {
  const tl = document.getElementById('timeline');
  if (!tl) return;
  tl.innerHTML = CHANGELOG_VERSIONS.map((v, i) => `
    <div class="cl-entry${v.open ? ' open' : ''}" id="entry-${i}">
      <div class="cl-header" data-index="${i}">
        <span class="cl-version">${v.version}</span>
        <span class="cl-badge ${changelogBadgeClass(v.type)}">${changelogBadgeLabel(v.type)}</span>
        <span class="cl-date">${v.date}</span>
        <svg class="cl-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="cl-body">
        <p class="cl-summary">${v.summary}</p>
        <div class="cl-items">
          ${v.items.map(item => `
            <div class="cl-item">
              <span class="cl-tag ${changelogTagClass(item.tag)}">${changelogTagLabel(item.tag)}</span>
              <span class="cl-item-text">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function bindChangelogEvents() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  timeline.addEventListener('click', (e) => {
    const header = e.target.closest('.cl-header');
    if (!header) return;
    const index = header.getAttribute('data-index');
    const entry = document.getElementById(`entry-${index}`);
    if (entry) entry.classList.toggle('open');
  });
}

function bindThemeButton() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindThemeButton();
  bindBlogEvents();
  bindChangelogEvents();
  initBlog();
  renderChangelog();
});
