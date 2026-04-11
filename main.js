document.addEventListener('DOMContentLoaded', () => {
    // PC ハンバーガーメニュー
    const pcMenuToggle = document.getElementById('menuToggle');
    const pcDropdown = document.getElementById('pcDropdown');
    const pcIcon = pcMenuToggle ? pcMenuToggle.querySelector('.hamburger-icon') : null;
    
    if (pcMenuToggle) {
        pcMenuToggle.addEventListener('click', () => {
            pcMenuToggle.classList.toggle('active');
            pcDropdown.classList.toggle('hidden');
            
            // アイコン画像を切り替え
            if (pcMenuToggle.classList.contains('active')) {
                if (pcIcon) pcIcon.src = 'sozai/images/close.webp';
            } else {
                if (pcIcon) pcIcon.src = 'sozai/images/menu.webp';
            }
        });
        
        // メニュー外をクリックしたら閉じる
        document.addEventListener('click', (e) => {
            if (!pcDropdown.contains(e.target) && !pcMenuToggle.contains(e.target)) {
                pcMenuToggle.classList.remove('active');
                pcDropdown.classList.add('hidden');
                if (pcIcon) pcIcon.src = 'sozai/images/menu.webp';
            }
        });
    }
    
    // スマホ ハンバーガーメニュー
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileFullscreen = document.getElementById('mobileFullscreen');
    const mobileIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('.hamburger-icon') : null;

    const updateMobileNavScrollState = () => {
        if (!mobileFullscreen) {
            return;
        }
        const isOpen = !mobileFullscreen.classList.contains('hidden');
        document.body.classList.toggle('mobile-nav-open', isOpen);
    };
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileFullscreen.classList.toggle('hidden');
            updateMobileNavScrollState();
            
            // アイコン画像を切り替え
            if (mobileMenuToggle.classList.contains('active')) {
                if (mobileIcon) mobileIcon.src = 'sozai/images/close.webp';
            } else {
                if (mobileIcon) mobileIcon.src = 'sozai/images/menu.webp';
            }
        });
        
        // メニュー内のリンククリックで閉じる
        const mobileLinks = mobileFullscreen.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileFullscreen.classList.add('hidden');
                updateMobileNavScrollState();
                if (mobileIcon) mobileIcon.src = 'sozai/images/menu.webp';
            });
        });
        
        // 背景クリックで閉じる
        mobileFullscreen.addEventListener('click', (e) => {
            if (e.target === mobileFullscreen) {
                mobileMenuToggle.classList.remove('active');
                mobileFullscreen.classList.add('hidden');
                updateMobileNavScrollState();
                if (mobileIcon) mobileIcon.src = 'sozai/images/menu.webp';
            }
        });

        updateMobileNavScrollState();
    }

    const mainVisual = document.querySelector('.main-visual');
    const mainVisualImg = mainVisual ? mainVisual.querySelector('img') : null;

    const updateMainVisualAutoPan = () => {
        if (!mainVisual || !mainVisualImg) {
            return;
        }

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) {
            mainVisual.classList.remove('auto-pan');
            mainVisual.style.removeProperty('--pan-distance');
            return;
        }

        const overflowX = mainVisualImg.scrollWidth - mainVisual.clientWidth;
        if (overflowX > 0) {
            mainVisual.style.setProperty('--pan-distance', `${overflowX}px`);
            mainVisual.classList.add('auto-pan');
        } else {
            mainVisual.classList.remove('auto-pan');
            mainVisual.style.removeProperty('--pan-distance');
        }
    };

    if (mainVisualImg) {
        if (mainVisualImg.complete) {
            updateMainVisualAutoPan();
        } else {
            mainVisualImg.addEventListener('load', updateMainVisualAutoPan);
        }
    }

    window.addEventListener('resize', updateMainVisualAutoPan);
    window.addEventListener('orientationchange', updateMainVisualAutoPan);

    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 768px)').matches) {
            document.body.classList.remove('mobile-nav-open');
        }
    });

    // ダークモード切り替え機能
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const moonIcon = 'https://kokyujene.super-hiko14.com/images/moon.webp';
    const sunIcon = 'https://kokyujene.super-hiko14.com/images/sun.webp';

    const updateThemeIcon = (isDark) => {
        if (themeIcon) {
            themeIcon.src = isDark ? sunIcon : moonIcon;
        }
    };

    // 初期状態の反映（OS設定や保存された設定があればここで処理）
    // 今回はシンプルに現在のbodyのクラスで判定
    updateThemeIcon(document.body.classList.contains('dark'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            updateThemeIcon(isDark);
            
            // ローカルストレージに保存する場合
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ページ読み込み時に保存されたテーマを適用
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark');
        updateThemeIcon(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 保存がない場合はOS設定に従う
        document.body.classList.add('dark');
        updateThemeIcon(true);
    }
});