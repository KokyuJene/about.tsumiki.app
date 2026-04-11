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
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileFullscreen.classList.toggle('hidden');
            
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
                if (mobileIcon) mobileIcon.src = 'sozai/images/menu.webp';
            });
        });
        
        // 背景クリックで閉じる
        mobileFullscreen.addEventListener('click', (e) => {
            if (e.target === mobileFullscreen) {
                mobileMenuToggle.classList.remove('active');
                mobileFullscreen.classList.add('hidden');
                if (mobileIcon) mobileIcon.src = 'sozai/images/menu.webp';
            }
        });
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
});