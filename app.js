
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

const flipbook = new St.PageFlip(
    document.getElementById('flipbook'),
    {
        width: 1000,
        height: 707,

        size: 'stretch',

        minWidth: 250,
        maxWidth: 1400,

        minHeight: 175,
        maxHeight: 1000,

        drawShadow: true,
        maxShadowOpacity: 0.45,

        flippingTime: 1000,

        showCover: true,
        usePortrait: true,
        autoSize: true,

        mobileScrollSupport: true,
        swipeDistance: 30,

        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,

        disableFlipByClick: false
    }
);

// Load all portfolio pages

const pageImages = Array.from(
    { length: portfolio.pages },
    (_, i) =>
        'assets/page-' +
        String(i + 1).padStart(2, '0') +
        '.webp'
);

flipbook.loadFromImages(pageImages);

// Update page counter

function updatePageCounter() {

    const current = flipbook.getCurrentPageIndex() + 1;
    const total = flipbook.getPageCount();

    document.getElementById('counter').textContent =
        current + ' / ' + total;

    document.getElementById('jump').value = current;

    document.getElementById('prev').disabled =
        current === 1;

    document.getElementById('next').disabled =
        current === total;
}

flipbook.on('flip', updatePageCounter);
flipbook.on('changeOrientation', updatePageCounter);

// Previous page

document.getElementById('prev').onclick = () => {
    flipbook.flipPrev();
};

// Next page

document.getElementById('next').onclick = () => {
    flipbook.flipNext();
};

// Jump to specific page

const jumpInput = document.getElementById('jump');

jumpInput.max = portfolio.pages;

jumpInput.onchange = () => {

    const page = Math.max(
        1,
        Math.min(
            portfolio.pages,
            Math.floor(Number(jumpInput.value) || 1)
        )
    );

    flipbook.flip(page - 1);
};

// Zoom controls

const bookstage = document.getElementById('bookstage');

document.getElementById('zoom').onclick = () => {

    bookstage.classList.toggle('zoomed');

    const zoomed = bookstage.classList.contains('zoomed');

    document.getElementById('zoom').textContent =
        zoomed ? 'Reset zoom' : 'Zoom';
};

// Fullscreen controls

document.getElementById('full').onclick = async () => {

    try {

        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await document.getElementById('reader')
                .requestFullscreen();
        }

    } catch (error) {
        console.error('Fullscreen unavailable:', error);
    }
};

// Keyboard navigation

document.getElementById('reader')
    .addEventListener('keydown', event => {

        if (event.target.tagName === 'INPUT') return;

        if (event.key === 'ArrowRight') {
            flipbook.flipNext();
        }

        if (event.key === 'ArrowLeft') {
            flipbook.flipPrev();
        }
    });

updatePageCounter();
