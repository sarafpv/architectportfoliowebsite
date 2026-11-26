
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
