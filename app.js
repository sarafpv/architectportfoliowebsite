
const $ = id => document.getElementById(id);

const asset = n =>
    'assets/page-' + String(n).padStart(2, '0') + '.webp';

const el = (tag, text, cls) => {
    let e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
};

function enlarge(src) {
    $('large').src = src;
    $('viewer').showModal();
}

// Selected works and project galleries

for (const [i, p] of portfolio.projects.entries()) {

    let b = el('button', null, 'project');

    let im = el('img');

    im.src = 'assets/' + p.image;
    im.alt = p.name + ' project artwork';
    im.loading = 'lazy';

    b.append(
        im,
        el('small', String(i + 1).padStart(2, '0') + ' / ' + p.type),
        el('h3', p.name + ' ↗'),
        el('small', p.location)
    );

    b.onclick = () => {

        let d = $('detailbody');

        d.replaceChildren(
            el('p', p.type, 'eyebrow'),
            el('h2', p.name),
            el('p', p.location + ' · ' + p.meta),
            el('p', p.description)
        );

        for (let n of p.pages) {

            let im = el('img', null, 'detail-image');

            im.src = asset(n);
            im.alt = p.name + ' portfolio page ' + n;
            im.loading = 'lazy';
            im.tabIndex = 0;

            im.onclick = () => enlarge(im.src);

            im.onkeydown = e => {
                if (e.key === 'Enter') {
                    enlarge(im.src);
                }
            };

            d.append(im);
        }

        $('detail').showModal();
    };

    $('projects').append(b);
}

// Dialog controls

for (let id of ['detail', 'viewer']) {

    $(id).querySelector('.close').onclick = () => {
        $(id).close();
    };

    $(id).addEventListener('click', e => {
        if (e.target === $(id)) {
            $(id).close();
        }
    });
}

// About section

$('person').textContent = portfolio.name;

for (let k of ['bio', 'education', 'skills', 'activities']) {
    $(k).textContent = portfolio[k];
}

// Contact section

$('email').textContent = 'Email me ↗';
$('email').href = 'mailto:' + portfolio.email;

// Automatic copyright year

$('year').textContent = new Date().getFullYear();




// Realistic portfolio flipbook

function initFlipbook() {

    const status = document.getElementById('bookstatus');
    const container = document.getElementById('flipbook');
    const reader = document.getElementById('reader');
    const stage = document.getElementById('bookstage');

    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const counter = document.getElementById('counter');
    const jump = document.getElementById('jump');
    const zoom = document.getElementById('zoom');
    const full = document.getElementById('full');

    if (!window.St || !window.St.PageFlip) {
        if (status) {
            status.hidden = false;
            status.textContent = 'Flipbook library failed to load.';
        }
        return;
    }

    const book = new window.St.PageFlip(container, {

        width: 1000,
        height: 707,

        size: 'stretch',

        minWidth: 250,
        maxWidth: 1200,

        minHeight: 175,
        maxHeight: 850,

        drawShadow: true,
        maxShadowOpacity: 0.45,

        flippingTime: 900,

        showCover: true,
        usePortrait: true,
        autoSize: true,

        mobileScrollSupport: true,
        swipeDistance: 30,

        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false
    });

    window.portfolioFlipbook = book;

    const images = Array.from(
        { length: portfolio.pages },
        (_, i) => asset(i + 1)
    );

    function updateCounter() {

        const current = book.getCurrentPageIndex() + 1;
        const total = book.getPageCount();

        counter.textContent = current + ' / ' + total;

        jump.value = current;
        jump.max = total;

        prev.disabled = current <= 1;
        next.disabled = current >= total;
    }

    // Register events before loading pages

    book.on('init', () => {
        if (status) status.hidden = true;
        updateCounter();
    });

    book.on('flip', event => {

        const current = Number(event.data) + 1;

        counter.textContent =
            current + ' / ' + book.getPageCount();

        jump.value = current;

        updateCounter();
    });

    book.on('changeState', event => {
        if (event.data === 'read') {
            updateCounter();
        }
    });

    book.on('changeOrientation', () => {
        updateCounter();
    });

    book.loadFromImages(images);

    // Previous page

    prev.addEventListener('click', event => {
        event.preventDefault();
        book.flipPrev('bottom');
    });

    // Next page

    next.addEventListener('click', event => {
        event.preventDefault();
        book.flipNext('bottom');
    });

    // Jump to page

    function goToPage() {

        const page = Math.max(
            1,
            Math.min(
                book.getPageCount(),
                Math.floor(Number(jump.value) || 1)
            )
        );

        book.turnToPage(page - 1);
        updateCounter();
    }

    jump.addEventListener('change', goToPage);

    jump.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            goToPage();
        }
    });

    // Zoom

    zoom.addEventListener('click', () => {

        stage.classList.toggle('zoomed');

        zoom.textContent =
            stage.classList.contains('zoomed')
                ? 'Reset zoom'
                : 'Zoom';
    });

    // Fullscreen

    full.addEventListener('click', async () => {

        try {

            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await reader.requestFullscreen();
            }

        } catch (error) {
            console.error(error);
        }
    });

    document.addEventListener('fullscreenchange', () => {

        full.textContent = document.fullscreenElement
            ? 'Exit full screen'
            : 'Full screen';

        requestAnimationFrame(() => book.update());
    });

    // Keyboard navigation

    reader.tabIndex = 0;

    reader.addEventListener('keydown', event => {

        if (event.target.tagName === 'INPUT') return;

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            book.flipNext();
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            book.flipPrev();
        }
    });

    updateCounter();
}

try {
    initFlipbook();
} catch (error) {

    console.error('Flipbook error:', error);

    const status = document.getElementById('bookstatus');

    if (status) {
        status.hidden = false;
        status.textContent = error.message;
    }
}
