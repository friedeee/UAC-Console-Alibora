'use strict';

/* ---------- Outils ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');
const pad = (n) => String(n).padStart(2, '0');
const clock = (seconds) => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
const dateFr = (date) => date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

const store = {
    get(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* la maquette fonctionne aussi sans stockage */ }
    },
};

/* Icônes au style du kit Alibora : contour seul, grille 24, trait 1,8, angles arrondis. */
const ICONS = {
    home: 'M3 10.5 12 3l9 7.5V19a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z',
    grid: 'M5 3h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM16 3h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM5 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM16 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z',
    doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
    mail: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 7.5l9 6 9-6',
    phone: 'M21 16.5v3a2 2 0 0 1-2.2 2 18 18 0 0 1-7.8-2.8 17.8 17.8 0 0 1-5.5-5.5A18 18 0 0 1 2.7 5.2 2 2 0 0 1 4.7 3h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.6 10.9a14.5 14.5 0 0 0 5.5 5.5l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    alert: 'M10.3 4 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0zM12 9.5v4M12 17.2h.01',
    search: 'M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM21 21l-4.9-4.9',
    logout: 'M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M16 17l5-5-5-5M21 12H9',
    check: 'M12 3l8 3v6c0 4.7-3.2 7.7-8 9-4.8-1.3-8-4.3-8-9V6zM9 12l2 2 4-4',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2',
    user: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21a8 8 0 0 1 16 0',
    lock: 'M7 11V7a5 5 0 0 1 10 0v4M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z',
    eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    eyeOff: 'M3 3l18 18M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-3.3 4.2M6.6 6.6A17.6 17.6 0 0 0 2 12s3.6 7 10 7a10.5 10.5 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    book: 'M4 5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 1h14v-3',
};
const icon = (name, size = 20) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const stat = (iconName, label, value, style = '') => `<div class="stat"><span class="tile">${icon(iconName, 24)}</span><div><span>${label}</span><strong ${style ? `style="${style}"` : ''}>${value}</strong></div></div>`;

/* ---------- État ---------- */
const STALE_AFTER_DAYS = 90;

const hoursAgo = (n) => new Date(Date.now() - n * 3600000).toISOString();
const seedMessages = () => Object.fromEntries(Object.entries(MESSAGES_INITIAUX).map(([id, list]) => [id, list.map((m) => ({ from: m.from, author: m.author, text: m.text, date: hoursAgo(m.heuresAvant), read: !m.nonLu }))]));

const state = {
    role: null,
    etabId: null,
    messages: store.get('ali-messages', null) ?? seedMessages(),
    calls: store.get('uac-calls', null) ?? HISTORIQUE_INITIAL.map((call) => ({ ...call, date: daysAgo(call.joursAvant).toISOString() })),
    reports: store.get('ali-reports', null) ?? SIGNALEMENTS_INITIAUX.map((r) => ({ ...r })),
    done: store.get('uac-callbacks-done', []),
    activeCall: null,
    ringing: null,
    simulated: 0,
    reportContext: '',
};

const etabById = (id) => ETABLISSEMENTS.find((e) => e.id === id);
const pendingCallbacks = () => state.calls.filter((c) => c.statut === 'À rappeler' && !state.done.includes(c.id));
const isStale = (etab) => etab.verifieIlYa > STALE_AFTER_DAYS;

function freshnessBadge(etab) {
    const date = dateFr(daysAgo(etab.verifieIlYa));
    return isStale(etab)
        ? `<span class="badge badge-warn">À reconfirmer · mise à jour du ${date}</span>`
        : `<span class="badge badge-ok">Mis à jour par l'école le ${date}</span>`;
}

function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Une information que l'agent peut copier ou noter ---------- */
function answerRow(label, value, source) {
    const data = `data-text="${esc(`${label} : ${value}`)}" data-source="${esc(source)}"`;
    return `<div class="answer">
        <div class="answer-text"><small>${esc(label)}</small>${esc(value)}</div>
        <div class="answer-actions">
            <button class="btn btn-small" type="button" data-copy ${data}>Copier</button>
            <button class="btn btn-small" type="button" data-give ${data}>Communiqué</button>
        </div>
    </div>`;
}

/* ---------- Pages ---------- */
function renderHome() {
    const today = new Date().toDateString();
    const todayCalls = state.calls.filter((c) => new Date(c.date).toDateString() === today);
    const resolved = todayCalls.filter((c) => c.statut === 'Résolu').length;
    const average = todayCalls.length ? Math.round(todayCalls.reduce((sum, c) => sum + c.duree, 0) / todayCalls.length) : 0;
    const callbacks = pendingCallbacks();
    const popular = [...REPONSES].sort((a, b) => b.populaire - a.populaire).slice(0, 5);
    const stale = ETABLISSEMENTS.filter(isStale);

    return `
    <div class="page-head"><div><h1>Bonjour</h1><p>Au téléphone, commencez toujours par la recherche en haut de l'écran.</p></div></div>
    <div class="stats">
        ${stat('phone', 'Appels aujourd\'hui', todayCalls.length)}
        ${stat('check', 'Résolus', resolved)}
        ${stat('alert', 'À rappeler', callbacks.length)}
        ${stat('clock', 'Durée moyenne', clock(average))}
    </div>
    <div class="columns">
        <div>
            <section class="panel"><h2>Questions les plus posées</h2>
                <ul class="row-list">${popular.map((r) => `<li><a class="row-link" href="#/reponses/${r.id}"><span>${esc(r.q)}</span><span class="badge">${esc(r.categorie)}</span></a></li>`).join('')}</ul>
            </section>
            <section class="panel"><h2>Établissements</h2>
                <ul class="row-list">${ETABLISSEMENTS.slice(0, 5).map((e) => `<li><a class="row-link" href="#/etablissement/${e.id}"><span><strong>${esc(e.sigle)}</strong> · ${esc(e.nom)}</span><span class="muted">${esc(e.ville)}</span></a></li>`).join('')}</ul>
                <a href="#/etablissements" class="btn btn-small">Voir les ${ETABLISSEMENTS.length} établissements</a>
            </section>
        </div>
        <div>
            <section class="panel"><h2>À rappeler</h2>
                ${callbacks.length ? `<ul class="row-list">${callbacks.map((c) => `<li><a class="row-link" href="#/appels"><span><strong class="mono">${esc(c.tel)}</strong><br><span class="muted">${esc(c.etab)} · ${esc(c.motif)}</span></span><span class="badge badge-warn">À rappeler</span></a></li>`).join('')}</ul>` : '<p class="empty-note">Aucun rappel en attente.</p>'}
            </section>
            <section class="panel"><h2>Informations à reconfirmer</h2>
                <p class="muted" style="font-size:.84rem;margin-bottom:6px">Pas de mise à jour par l'école depuis plus de ${STALE_AFTER_DAYS} jours : prévenez l'appelant que l'information reste à confirmer.</p>
                <ul class="row-list">${stale.map((e) => `<li><a class="row-link" href="#/etablissement/${e.id}"><strong>${esc(e.sigle)}</strong><span class="badge badge-warn">${e.verifieIlYa} jours</span></a></li>`).join('')}</ul>
            </section>
        </div>
    </div>`;
}

const filters = { etab: { q: '', type: 'Tous', ville: 'Toutes' }, reponses: { q: '', categorie: 'Toutes' }, appels: { tab: 'historique', q: '' } };

function renderEtabs() {
    const types = ['Tous', 'Faculté', 'École', 'Institut'];
    const villes = ['Toutes', ...new Set(ETABLISSEMENTS.map((e) => e.ville))];
    return `
    <div class="page-head"><div><h1>Établissements</h1><p>Facultés, écoles et instituts de l'UAC.</p></div></div>
    <div class="toolbar">
        <label class="sr-only" for="etab-filter">Filtrer</label>
        <input id="etab-filter" type="search" placeholder="Filtrer par nom, sigle ou filière" value="${esc(filters.etab.q)}">
        ${types.map((t) => `<button class="chip" type="button" data-etab-type="${t}" aria-pressed="${filters.etab.type === t}">${t}</button>`).join('')}
        <label class="sr-only" for="etab-ville">Ville</label>
        <select id="etab-ville">${villes.map((v) => `<option value="${esc(v)}" ${filters.etab.ville === v ? 'selected' : ''}>${v === 'Toutes' ? 'Toutes les villes' : esc(v)}</option>`).join('')}</select>
    </div>
    <div id="etab-grid" class="etab-grid"></div>`;
}

function fillEtabGrid() {
    const grid = $('#etab-grid');
    if (!grid) return;
    const q = normalize(filters.etab.q);
    const list = ETABLISSEMENTS.filter((e) => (filters.etab.type === 'Tous' || e.type === filters.etab.type)
        && (filters.etab.ville === 'Toutes' || e.ville === filters.etab.ville)
        && (!q || normalize(`${e.sigle} ${e.nom} ${e.filieres.map((f) => f.nom).join(' ')}`).includes(q)));
    grid.innerHTML = list.length ? list.map((e) => `
        <a class="etab-card" href="#/etablissement/${e.id}">
            <header><span class="sigle">${esc(e.sigle)}</span><span class="badge">${esc(e.type)}</span></header>
            <p>${esc(e.nom)}</p>
            <footer><span>${esc(e.ville)} · ${e.filieres.length} filière(s)</span>${isStale(e) ? '<span class="badge badge-warn">À reconfirmer</span>' : ''}</footer>
        </a>`).join('') : '<p class="empty-note">Aucun établissement ne correspond.</p>';
}

const FICHE_TABS = { essentiel: 'L\'essentiel', filieres: 'Filières', inscription: 'Inscription', contacts: 'Contacts', questions: 'Questions' };

function renderFiche(id, tab = 'essentiel') {
    const e = etabById(id);
    if (!e) return '<p>Établissement introuvable. <a href="#/etablissements">Retour à la liste</a></p>';
    const main = e.contacts[0];
    const key = FICHE_TABS[tab] ? tab : 'essentiel';
    const bodies = {
        essentiel: `
            <div class="columns"><div>
                <section class="panel"><h2>À dire en premier</h2><p>${esc(e.resume)}</p></section>
                <section class="panel"><h2>Infos pratiques</h2>
                    ${answerRow('Lieu', e.lieu, e.sigle)}
                    ${answerRow('Horaires de la scolarité', e.horaires, e.sigle)}
                    ${answerRow('Numéro de la scolarité', main.tel, e.sigle)}
                    ${answerRow('Mode d\'accès', e.acces, e.sigle)}
                </section>
            </div><div>
                <section class="panel"><h2>Dates clés</h2>${e.dates.map((d) => answerRow(d.label, d.valeur, e.sigle)).join('')}</section>
            </div></div>`,
        filieres: `<section class="panel"><div class="table-wrap"><table>
            <thead><tr><th>Filière</th><th>Niveau</th><th>Durée</th><th>Accès</th><th><span class="sr-only">Actions</span></th></tr></thead>
            <tbody>${e.filieres.map((f) => `<tr><td><strong>${esc(f.nom)}</strong></td><td>${esc(f.niveau)}</td><td>${esc(f.duree)}</td><td><span class="badge ${f.acces === 'Concours' ? 'badge-info' : ''}">${esc(f.acces)}</span></td>
                <td style="text-align:right"><button class="btn btn-small" type="button" data-give data-source="${esc(e.sigle)}" data-text="${esc(`Filière ${f.nom} (${f.niveau}, ${f.duree}, accès : ${f.acces})`)}">Communiqué</button></td></tr>`).join('')}</tbody>
        </table></div></section>`,
        inscription: `<div class="columns"><div>
                <section class="panel"><h2>Conditions</h2>${e.conditions.map((c, i) => answerRow(`Condition ${i + 1}`, c, e.sigle)).join('')}</section>
                <section class="panel"><h2>Pièces à fournir</h2>${e.pieces.map((p, i) => answerRow(`Pièce ${i + 1}`, p, e.sigle)).join('')}</section>
            </div><div>
                <section class="panel"><h2>Frais</h2>${e.frais.map((f) => answerRow(f.label, f.montant, e.sigle)).join('')}</section>
            </div></div>`,
        contacts: `<section class="panel">${e.contacts.map((c) => answerRow(c.service, `${c.tel} · ${c.email}`, e.sigle)).join('')}</section>`,
        questions: `<section class="panel">${e.faq.map((f) => answerRow(f.q, f.a, e.sigle)).join('')}</section>`,
    };

    return `
    <a class="breadcrumb" href="#/etablissements">← Établissements</a>
    <div class="fiche-head">
        <div>
            <h1>${esc(e.sigle)} <span class="muted" style="font-weight:500">· ${esc(e.nom)}</span></h1>
            <p style="margin-top:6px">${freshnessBadge(e)} <span class="badge">${esc(e.type)}</span> <span class="badge">${esc(e.ville)}</span></p>
        </div>
        <div class="toolbar" style="margin:0" data-agent-only>
            <a class="btn" href="#/messages/${e.id}">Écrire à l'école</a>
            <button class="btn" type="button" data-report="${esc(`${e.sigle} · ${FICHE_TABS[key]}`)}" data-report-etab="${e.id}">Signaler une erreur</button>
        </div>
    </div>
    ${isStale(e) ? `<p class="returning" style="background:var(--warn-soft)">Dernière mise à jour par l'école il y a ${e.verifieIlYa} jours. Précisez à l'appelant que l'information doit être confirmée.</p>` : ''}
    <div class="tabs" role="tablist">${Object.entries(FICHE_TABS).map(([value, label]) => `<a class="tab ${value === key ? 'active' : ''}" role="tab" aria-selected="${value === key}" style="text-decoration:none" href="#/etablissement/${e.id}/${value}">${label}</a>`).join('')}</div>
    ${bodies[key]}`;
}

function renderAnswers(openId) {
    const categories = ['Toutes', ...new Set(REPONSES.map((r) => r.categorie))];
    return `
    <div class="page-head"><div><h1>Réponses rapides</h1><p>Les réponses communes à tous les établissements.</p></div></div>
    <div class="toolbar">
        <label class="sr-only" for="answer-filter">Filtrer</label>
        <input id="answer-filter" type="search" placeholder="Filtrer les questions" value="${esc(filters.reponses.q)}">
        ${categories.map((c) => `<button class="chip" type="button" data-answer-cat="${esc(c)}" aria-pressed="${filters.reponses.categorie === c}">${esc(c)}</button>`).join('')}
    </div>
    <section class="panel" id="answer-list" data-open="${esc(openId ?? '')}"></section>`;
}

function fillAnswers() {
    const list = $('#answer-list');
    if (!list) return;
    const q = normalize(filters.reponses.q);
    const rows = REPONSES.filter((r) => (filters.reponses.categorie === 'Toutes' || r.categorie === filters.reponses.categorie) && (!q || normalize(`${r.q} ${r.a}`).includes(q)));
    list.innerHTML = rows.length ? rows.map((r) => `<div id="${r.id}">${answerRow(r.q, r.a, r.categorie)}</div>`).join('') : '<p class="empty-note">Aucune réponse ne correspond.</p>';
    const open = list.dataset.open;
    if (open && $(`#${open}`, list)) {
        $(`#${open}`, list).scrollIntoView({ block: 'center' });
        $(`#${open}`, list).style.background = 'var(--primary-soft)';
    }
}

function renderCalls() {
    const tab = filters.appels.tab;
    const callbacks = pendingCallbacks();
    return `
    <div class="page-head"><div><h1>Appels</h1><p>Chaque appel est gardé pour reconnaître les personnes qui rappellent.</p></div></div>
    <div class="tabs" role="tablist">
        <button class="tab ${tab === 'historique' ? 'active' : ''}" type="button" data-calls-tab="historique">Historique</button>
        <button class="tab ${tab === 'rappels' ? 'active' : ''}" type="button" data-calls-tab="rappels">À rappeler (${callbacks.length})</button>
    </div>
    ${tab === 'historique' ? `<div class="toolbar"><label class="sr-only" for="calls-filter">Filtrer</label><input id="calls-filter" type="search" placeholder="Numéro, nom, établissement, motif" value="${esc(filters.appels.q)}"></div><section class="panel"><div class="table-wrap" id="calls-table"></div></section>`
        : `<section class="panel">${callbacks.length ? `<ul class="row-list">${callbacks.map((c) => `<li class="answer"><div class="answer-text"><strong class="mono">${esc(c.tel)}</strong>${c.nom ? ` · ${esc(c.nom)}` : ''}<small>${esc(c.etab)} · ${esc(c.motif)} · ${dateFr(new Date(c.date))}</small>${c.notes ? `<small>${esc(c.notes)}</small>` : ''}</div><button class="btn btn-small" type="button" data-callback-done="${c.id}">Marquer comme rappelé</button></li>`).join('')}</ul>` : '<p class="empty-note">Aucun rappel en attente.</p>'}</section>`}`;
}

function fillCallsTable() {
    const box = $('#calls-table');
    if (!box) return;
    const q = normalize(filters.appels.q);
    const rows = [...state.calls].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id).filter((c) => !q || normalize(`${c.tel} ${c.nom} ${c.etab} ${c.motif} ${c.statut}`).includes(q));
    const tone = { Résolu: 'badge-ok', 'À rappeler': 'badge-warn', Transféré: 'badge-info' };
    box.innerHTML = rows.length ? `<table><thead><tr><th>Date</th><th>Numéro</th><th>Établissement</th><th>Motif</th><th>Durée</th><th>Résultat</th><th>Notes</th></tr></thead><tbody>${rows.map((c) => `<tr>
        <td class="mono">${dateFr(new Date(c.date))}<br><span class="muted">${esc(c.heure)}</span></td>
        <td class="mono">${esc(c.tel)}${c.nom ? `<br><span class="muted">${esc(c.nom)}</span>` : ''}</td>
        <td>${esc(c.etab || '—')}</td><td>${esc(c.motif)}</td><td class="mono">${clock(c.duree)}</td>
        <td><span class="badge ${tone[c.statut] ?? ''}">${esc(c.statut)}</span></td><td>${esc(c.notes)}</td></tr>`).join('')}</tbody></table>` : '<p class="empty-note">Aucun appel ne correspond.</p>';
}

const visibleReports = () => state.reports.filter((r) => state.role === 'agent' || r.etabId === state.etabId);
const openReports = () => visibleReports().filter((r) => r.statut === 'Ouvert');

function renderReports() {
    const isSchool = state.role === 'ecole';
    const rows = visibleReports();
    return `
    <div class="page-head"><div><h1>Signalements</h1><p>${isSchool ? 'Les erreurs repérées par les agents d\'Alibora sur votre fiche.' : 'Les erreurs envoyées aux écoles, et leur suivi.'}</p></div></div>
    <section class="panel">${rows.length ? `<ul class="row-list">${rows.map((r) => `<li class="answer"><div class="answer-text"><strong>${esc(r.context)}</strong><small>${esc(r.when)}</small>${esc(r.text)}</div>
        ${r.statut === 'Corrigé' ? '<span class="badge badge-ok">Corrigé par l\'école</span>' : isSchool ? `<button class="btn btn-small" type="button" data-report-done="${state.reports.indexOf(r)}">Marquer comme corrigé</button>` : '<span class="badge badge-warn">En attente de l\'école</span>'}</li>`).join('')}</ul>` : '<p class="empty-note">Aucun signalement.</p>'}</section>`;
}

/* ---------- Espace école : mise à jour de la fiche ---------- */
function filiereRow(f = { nom: '', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' }) {
    const levels = ['Licence', 'Licence pro.', 'Master', 'Ingénieur', 'Doctorat'];
    return `<div class="form-row" data-filiere>
        <input aria-label="Nom de la filière" data-f="nom" value="${esc(f.nom)}" placeholder="Nom de la filière">
        <select aria-label="Niveau" data-f="niveau">${[...new Set([...levels, f.niveau])].map((l) => `<option ${l === f.niveau ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
        <input aria-label="Durée" data-f="duree" value="${esc(f.duree)}">
        <select aria-label="Accès" data-f="acces">${['Dossier', 'Concours'].map((a) => `<option ${a === f.acces ? 'selected' : ''}>${a}</option>`).join('')}</select>
        <button class="icon-btn" type="button" data-remove-row aria-label="Retirer cette filière">×</button>
    </div>`;
}

function renderSchoolForm() {
    const e = etabById(state.etabId);
    const unread = unreadCount();
    return `
    <div class="page-head"><div><h1>${esc(e.sigle)} · Ma fiche</h1><p>Ce que les agents d'Alibora disent aux personnes qui appellent. Gardez-la à jour.</p></div>
        <a class="btn" href="#/etablissement/${e.id}">Voir comme un agent</a></div>
    <div class="stats">
        ${stat('clock', 'Dernière mise à jour', e.verifieIlYa === 0 ? 'Aujourd\'hui' : `Il y a ${e.verifieIlYa} jours`, 'font-size:1.1rem;margin-top:5px')}
        ${stat('alert', 'Signalements à traiter', openReports().length)}
        ${stat('mail', 'Messages non lus', unread)}
        ${stat('book', 'Filières', e.filieres.length)}
    </div>
    ${isStale(e) ? `<p class="returning" style="background:var(--warn-soft)">Votre fiche n'a pas été mise à jour depuis plus de ${STALE_AFTER_DAYS} jours : les agents préviennent les appelants que l'information reste à confirmer. Vérifiez-la, puis enregistrez.</p>` : ''}
    <form id="school-form" novalidate>
        <section class="panel"><h2>Présentation</h2><div class="form-grid">
            <div class="full"><label for="f-resume">À dire en premier</label><textarea id="f-resume" rows="2" required>${esc(e.resume)}</textarea></div>
            <div><label for="f-lieu">Lieu</label><input id="f-lieu" value="${esc(e.lieu)}" required></div>
            <div><label for="f-horaires">Horaires de la scolarité</label><input id="f-horaires" value="${esc(e.horaires)}" required></div>
            <div class="full"><label for="f-acces">Mode d'accès</label><input id="f-acces" value="${esc(e.acces)}"></div>
        </div></section>
        <section class="panel"><h2>Dates clés</h2><div class="form-grid">${e.dates.map((d, i) => `<div><label for="f-date-${i}">${esc(d.label)}</label><input id="f-date-${i}" value="${esc(d.valeur)}"></div>`).join('')}</div></section>
        <section class="panel"><h2>Frais</h2><div class="form-grid">${e.frais.map((f, i) => `<div><label for="f-frais-${i}">${esc(f.label)}</label><input id="f-frais-${i}" value="${esc(f.montant)}"></div>`).join('')}</div></section>
        <section class="panel"><h2>Contacts</h2><div class="form-grid">${e.contacts.map((c, i) => `<div><label for="f-tel-${i}">${esc(c.service)} : téléphone</label><input id="f-tel-${i}" type="tel" value="${esc(c.tel)}"></div><div><label for="f-mail-${i}">${esc(c.service)} : e-mail</label><input id="f-mail-${i}" type="email" value="${esc(c.email)}"></div>`).join('')}</div></section>
        <section class="panel"><h2>Filières</h2><div id="filiere-rows">${e.filieres.map(filiereRow).join('')}</div>
            <button class="btn btn-small" type="button" id="add-filiere">Ajouter une filière</button></section>
        <div class="form-actions"><p id="form-error" class="error" role="alert" hidden></p><button class="btn btn-primary" type="submit">Publier les modifications</button></div>
    </form>`;
}

function saveSchoolForm(event) {
    event.preventDefault();
    const e = etabById(state.etabId);
    const value = (id) => $(`#${id}`).value.trim();
    const error = $('#form-error');
    const filieres = $$('[data-filiere]').map((row) => Object.fromEntries($$('[data-f]', row).map((field) => [field.dataset.f, field.value.trim()]))).filter((f) => f.nom);

    if (!value('f-resume') || !value('f-lieu') || !value('f-horaires') || !filieres.length) {
        error.textContent = 'Renseignez la présentation, le lieu, les horaires et au moins une filière.';
        error.hidden = false;
        return;
    }

    Object.assign(e, {
        resume: value('f-resume'),
        lieu: value('f-lieu'),
        horaires: value('f-horaires'),
        acces: value('f-acces'),
        conditions: [e.conditions[0], value('f-acces')],
        dates: e.dates.map((d, i) => ({ ...d, valeur: value(`f-date-${i}`) })),
        frais: e.frais.map((f, i) => ({ ...f, montant: value(`f-frais-${i}`) })),
        contacts: e.contacts.map((c, i) => ({ ...c, tel: value(`f-tel-${i}`), email: value(`f-mail-${i}`) })),
        filieres,
        verifieIlYa: 0,
    });

    const saved = store.get('ali-fiches', {});
    saved[e.id] = { resume: e.resume, lieu: e.lieu, horaires: e.horaires, acces: e.acces, conditions: e.conditions, dates: e.dates, frais: e.frais, contacts: e.contacts, filieres: e.filieres, misAJourLe: new Date().toISOString() };
    store.set('ali-fiches', saved);
    toast('Fiche publiée : les agents voient déjà la nouvelle version.');
    refresh();
}

function restoreSavedFiches() {
    Object.entries(store.get('ali-fiches', {})).forEach(([id, fiche]) => {
        const e = etabById(id);
        if (!e) return;
        const { misAJourLe, ...fields } = fiche;
        Object.assign(e, fields, { verifieIlYa: Math.floor((Date.now() - new Date(misAJourLe)) / 86400000) });
    });
}

/* ---------- Messagerie ---------- */
const conversationTitle = (id) => (id === 'equipe' ? 'Équipe Alibora' : state.role === 'ecole' ? 'Agents Alibora' : etabById(id)?.sigle ?? id);
const conversationIds = () => (state.role === 'ecole' ? [state.etabId] : ['equipe', ...ETABLISSEMENTS.map((e) => e.id)]);
const unreadIn = (id) => (state.messages[id] ?? []).filter((m) => m.from !== state.role && !m.read).length;
const unreadCount = () => conversationIds().reduce((sum, id) => sum + unreadIn(id), 0);
const lastMessageAt = (id) => { const list = state.messages[id] ?? []; return list.length ? new Date(list[list.length - 1].date).getTime() : 0; };

function renderMessages(openId) {
    const ids = conversationIds();
    const current = state.role === 'ecole' ? state.etabId : (ids.includes(openId) ? openId : 'equipe');
    const single = state.role === 'ecole';
    const title = conversationTitle(current);
    const sub = current === 'equipe' ? 'Superviseurs et agents' : single ? 'Les agents qui renseignent vos futurs étudiants' : etabById(current).nom;
    return `
    <div class="page-head"><div><h1>Messages</h1><p>${single ? 'Répondez aux questions des agents d\'Alibora.' : 'Posez vos questions à une école ou à l\'équipe, même pendant un appel.'}</p></div></div>
    <div class="chat ${single ? 'single' : ''}">
        ${single ? '' : `<div class="chat-list" id="chat-list" data-current="${esc(current)}"></div>`}
        <section class="chat-thread" data-conversation="${esc(current)}">
            <header class="chat-head"><strong>${esc(title)}</strong><small>${esc(sub)}</small></header>
            <div class="chat-messages" id="chat-messages" role="log" aria-live="polite" tabindex="0"></div>
            <form class="chat-form" id="chat-form">
                <label class="sr-only" for="chat-input">Votre message</label>
                <textarea id="chat-input" rows="2" placeholder="Écrivez votre message…"></textarea>
                <button class="btn btn-primary" type="submit">Envoyer</button>
            </form>
        </section>
    </div>`;
}

function fillChat() {
    const thread = $('.chat-thread');
    if (!thread) return;
    const id = thread.dataset.conversation;
    (state.messages[id] ?? []).forEach((m) => { if (m.from !== state.role) m.read = true; });
    store.set('ali-messages', state.messages);

    const list = $('#chat-list');
    if (list) {
        const ids = [...conversationIds()].sort((a, b) => (a === 'equipe' ? -1 : b === 'equipe' ? 1 : lastMessageAt(b) - lastMessageAt(a)));
        list.innerHTML = ids.map((c) => {
            const messages = state.messages[c] ?? [];
            const last = messages[messages.length - 1];
            const unread = unreadIn(c);
            return `<a class="chat-contact ${c === id ? 'active' : ''}" href="#/messages/${c}" ${c === id ? 'aria-current="true"' : ''}>
                <header><span>${esc(conversationTitle(c))}</span>${unread ? `<span class="count">${unread}</span>` : ''}</header>
                <p>${last ? esc(last.text) : 'Aucun message'}</p></a>`;
        }).join('');
    }

    const box = $('#chat-messages');
    const messages = state.messages[id] ?? [];
    const sigle = etabById(id)?.sigle ?? '';
    box.innerHTML = messages.length ? messages.map((m) => {
        const mine = m.from === state.role;
        const when = new Date(m.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        const give = !mine && state.activeCall ? `<br><button class="btn btn-small" type="button" data-give data-source="${esc(sigle || 'Alibora')}" data-text="${esc(m.text)}">Communiqué</button>` : '';
        return `<div class="bubble ${mine ? 'mine' : ''}"><small>${mine ? 'Vous' : esc(m.author)} · ${when}</small>${esc(m.text)}${give}</div>`;
    }).join('') : '<p class="empty-note">Aucun message pour le moment. Écrivez le premier.</p>';
    box.scrollTop = box.scrollHeight;
    updateCounts();
}

function sendMessage(event) {
    event.preventDefault();
    const input = $('#chat-input');
    const text = input.value.trim();
    if (!text) return;
    const id = $('.chat-thread').dataset.conversation;
    const author = state.role === 'ecole' ? `Scolarité ${etabById(state.etabId).sigle}` : 'Agent démo';
    (state.messages[id] ??= []).push({ from: state.role, author, text, date: new Date().toISOString(), read: true });
    store.set('ali-messages', state.messages);
    input.value = '';
    fillChat();
    input.focus();
    simulateReply(id);
}

/* Réponse automatique, seulement pour faire vivre la démonstration. */
function simulateReply(id) {
    const replies = {
        equipe: { from: 'equipe', author: 'Superviseur Alibora', text: 'Bien reçu, je regarde et je reviens vers vous.' },
        ecole: { from: 'ecole', author: `Scolarité ${etabById(id)?.sigle ?? ''}`, text: 'Bien reçu, nous vérifions et nous vous répondons rapidement.' },
        agent: { from: 'agent', author: 'Agent démo', text: 'Merci, c\'est noté. Je préviens l\'appelant.' },
    };
    const reply = id === 'equipe' ? replies.equipe : state.role === 'ecole' ? replies.agent : replies.ecole;
    const role = state.role;
    setTimeout(() => {
        (state.messages[id] ??= []).push({ ...reply, date: new Date().toISOString(), read: false });
        store.set('ali-messages', state.messages);
        if (state.role !== role) return;
        if ($('.chat-thread')?.dataset.conversation === id) fillChat();
        else { toast(`Nouveau message : ${conversationTitle(id)}`); updateCounts(); }
    }, 1800);
}

/* ---------- Routage ---------- */
function route() {
    const [page = '', a, b] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const view = $('#view');
    const pages = state.role === 'ecole'
        ? {
            fiche: renderSchoolForm,
            // Une école ne consulte que sa propre fiche.
            etablissement: () => renderFiche(state.etabId, a === state.etabId ? b : undefined),
            messages: () => renderMessages(),
            signalements: renderReports,
        }
        : {
            accueil: renderHome,
            etablissements: renderEtabs,
            etablissement: () => renderFiche(a, b),
            reponses: () => renderAnswers(a),
            appels: renderCalls,
            messages: () => renderMessages(a),
            signalements: renderReports,
        };
    view.innerHTML = (pages[page] ?? (state.role === 'ecole' ? renderSchoolForm : renderHome))();
    const fallback = state.role === 'ecole' ? 'fiche' : 'accueil';
    const navKey = page === 'etablissement' ? (state.role === 'ecole' ? 'fiche' : 'etablissements') : (pages[page] ? page : fallback);
    $$('[data-nav]').forEach((link) => {
        const active = link.dataset.nav === navKey;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    fillEtabGrid();
    fillAnswers();
    fillCallsTable();
    fillChat();
    updateCounts();
    window.scrollTo(0, 0);
}

function updateCounts() {
    const set = (id, n) => { const el = $(id); if (el) { el.hidden = n === 0; el.textContent = n; } };
    set('#nav-callbacks', pendingCallbacks().length);
    set('#nav-reports', openReports().length);
    set('#nav-messages', unreadCount());
}

const refresh = () => route();

/* ---------- Recherche globale ---------- */
function searchAll(term) {
    const q = normalize(term.trim());
    if (q.length < 2) return [];
    const groups = [];
    const etabs = ETABLISSEMENTS.filter((e) => normalize(`${e.sigle} ${e.nom} ${e.ville}`).includes(q))
        .map((e) => ({ title: `${e.sigle} · ${e.nom}`, sub: `${e.type} · ${e.ville}`, href: `#/etablissement/${e.id}` }));
    const filieres = ETABLISSEMENTS.flatMap((e) => e.filieres.filter((f) => normalize(f.nom).includes(q))
        .map((f) => ({ title: f.nom, sub: `${e.sigle} · ${f.niveau} · ${f.acces}`, href: `#/etablissement/${e.id}/filieres` })));
    const faq = ETABLISSEMENTS.flatMap((e) => e.faq.filter((f) => normalize(`${f.q} ${f.a}`).includes(q))
        .map((f) => ({ title: f.q, sub: `Question · ${e.sigle}`, href: `#/etablissement/${e.id}/questions` })));
    const answers = REPONSES.filter((r) => normalize(`${r.q} ${r.a} ${r.categorie}`).includes(q))
        .map((r) => ({ title: r.q, sub: `Réponse rapide · ${r.categorie}`, href: `#/reponses/${r.id}` }));
    if (etabs.length) groups.push(['Établissements', etabs.slice(0, 5)]);
    if (filieres.length) groups.push(['Filières', filieres.slice(0, 6)]);
    if (answers.length || faq.length) groups.push(['Réponses', [...answers, ...faq].slice(0, 6)]);
    return groups;
}

function setupSearch() {
    const input = $('#global-search');
    const panel = $('#search-results');
    let active = -1;

    const close = () => { panel.hidden = true; active = -1; };
    const items = () => $$('.search-item', panel);
    const highlight = () => items().forEach((el, i) => {
        el.classList.toggle('active', i === active);
        if (i === active) el.scrollIntoView({ block: 'nearest' });
    });

    input.addEventListener('input', () => {
        active = -1;
        const groups = searchAll(input.value);
        if (input.value.trim().length < 2) { close(); return; }
        panel.innerHTML = groups.length
            ? groups.map(([label, rows]) => `<div class="search-group">${label}</div>${rows.map((r) => `<a class="search-item" style="text-decoration:none" href="${r.href}">${esc(r.title)}<small>${esc(r.sub)}</small></a>`).join('')}`).join('')
            : `<p class="search-empty">Rien pour « ${esc(input.value)} ». Proposez un rappel et signalez ce manque.</p>`;
        panel.hidden = false;
    });

    input.addEventListener('keydown', (event) => {
        const list = items();
        if (event.key === 'ArrowDown' && list.length) { event.preventDefault(); active = (active + 1) % list.length; highlight(); }
        else if (event.key === 'ArrowUp' && list.length) { event.preventDefault(); active = (active - 1 + list.length) % list.length; highlight(); }
        else if (event.key === 'Enter' && list.length) { event.preventDefault(); list[Math.max(active, 0)].click(); }
        else if (event.key === 'Escape') { close(); input.blur(); }
    });

    panel.addEventListener('click', (event) => {
        if (event.target.closest('.search-item')) { close(); input.value = ''; }
    });
    document.addEventListener('click', (event) => { if (!event.target.closest('#search-box')) close(); });
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); input.focus(); input.select(); }
    });
}

/* ---------- Appels ---------- */
function simulateCall() {
    if (state.activeCall || state.ringing) {
        toast(state.activeCall ? 'Terminez d\'abord l\'appel en cours.' : 'Un appel sonne déjà.');
        return;
    }
    const caller = APPELS_SIMULES[state.simulated % APPELS_SIMULES.length];
    state.simulated += 1;
    state.ringing = caller;
    const box = $('#incoming');
    const previous = lastCallFrom(caller.tel);
    box.innerHTML = `<p class="eyebrow">Appel entrant</p><h2 id="incoming-title">${esc(caller.tel)}</h2>
        <p class="muted">${previous ? `A déjà appelé le ${dateFr(new Date(previous.date))} (${esc(previous.etab)})` : 'Nouvel appelant'}</p>
        <div class="incoming-actions"><button class="btn" type="button" id="decline">Ignorer</button><button class="btn btn-call" type="button" id="answer">Décrocher</button></div>`;
    box.hidden = false;
    $('#answer').focus();
    $('#answer').addEventListener('click', answerCall);
    $('#decline').addEventListener('click', () => { state.ringing = null; box.hidden = true; });
}

function lastCallFrom(tel) {
    const digits = onlyDigits(tel);
    return [...state.calls].sort((a, b) => new Date(b.date) - new Date(a.date)).find((c) => onlyDigits(c.tel) === digits);
}

function answerCall() {
    const caller = state.ringing;
    state.ringing = null;
    $('#incoming').hidden = true;
    state.activeCall = { tel: caller.tel, nom: caller.nom === 'Appelant inconnu' ? '' : caller.nom, etab: '', motif: '', statut: 'Résolu', notes: '', infos: [], started: Date.now(), previous: lastCallFrom(caller.tel) };
    const elapsed = () => Math.floor((Date.now() - state.activeCall.started) / 1000);
    $('#callbar-number').textContent = `En ligne avec ${caller.tel}`;
    $('#callbar-time').textContent = '00:00';
    $('#callbar').hidden = false;
    state.timer = setInterval(() => { $('#callbar-time').textContent = clock(elapsed()); }, 1000);
    renderSheet();
    $('#call-sheet').hidden = false;
    $('#global-search').focus();
}

function renderSheet() {
    const call = state.activeCall;
    const sheet = $('#call-sheet');
    sheet.innerHTML = `
        <h2>Fiche d'appel</h2>
        <p class="script">« Alibora, service de renseignement UAC, bonjour. Que puis-je pour vous ? »</p>
        ${call.previous ? `<p class="returning"><strong>Déjà appelé le ${dateFr(new Date(call.previous.date))}</strong><br>${esc(call.previous.etab)} · ${esc(call.previous.motif)}${call.previous.notes ? `<br>${esc(call.previous.notes)}` : ''}</p>` : ''}
        <form id="sheet-form" novalidate>
            <div class="field"><label for="sheet-name">Nom (facultatif)</label><input id="sheet-name" value="${esc(call.nom)}" autocomplete="off"></div>
            <div class="field"><label for="sheet-etab">Établissement concerné</label><select id="sheet-etab"><option value="">Général / aucun</option>${ETABLISSEMENTS.map((e) => `<option ${call.etab === e.sigle ? 'selected' : ''}>${esc(e.sigle)}</option>`).join('')}</select></div>
            <div class="field"><label for="sheet-motif">Motif de l'appel</label><select id="sheet-motif" aria-describedby="motif-error"><option value="">Choisir…</option>${MOTIFS.map((m) => `<option ${call.motif === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select><p id="motif-error" class="error" hidden>Choisissez le motif pour terminer.</p></div>
            <div class="field"><span class="panel-title" style="display:block;color:var(--muted);font-size:.82rem;font-weight:600;margin-bottom:4px">Informations communiquées</span><ul class="given" id="given-list"></ul></div>
            <div class="field"><label for="sheet-notes">Notes</label><textarea id="sheet-notes" rows="3">${esc(call.notes)}</textarea></div>
            <fieldset class="field" style="border:0;margin:0 0 11px;padding:0"><legend style="padding:0;margin-bottom:4px;color:var(--muted);font-size:.82rem;font-weight:600">Résultat</legend>
                <div class="radio-row">${['Résolu', 'À rappeler', 'Transféré'].map((s) => `<label><input type="radio" name="sheet-status" value="${s}" ${call.statut === s ? 'checked' : ''}>${s}</label>`).join('')}</div>
            </fieldset>
            <button class="btn btn-danger btn-wide" type="submit">Terminer et enregistrer</button>
        </form>`;
    renderGiven();
    $('#sheet-name').addEventListener('input', (e) => { call.nom = e.target.value; });
    $('#sheet-etab').addEventListener('change', (e) => { call.etab = e.target.value; });
    $('#sheet-motif').addEventListener('change', (e) => { call.motif = e.target.value; $('#motif-error').hidden = true; });
    $('#sheet-notes').addEventListener('input', (e) => { call.notes = e.target.value; });
    $$('input[name="sheet-status"]').forEach((radio) => radio.addEventListener('change', (e) => { call.statut = e.target.value; }));
    $('#sheet-form').addEventListener('submit', endCall);
}

function renderGiven() {
    const call = state.activeCall;
    const list = $('#given-list');
    if (!list) return;
    list.innerHTML = call.infos.length
        ? call.infos.map((info, i) => `<li><span>${esc(info)}</span><button type="button" data-remove-given="${i}" aria-label="Retirer">×</button></li>`).join('')
        : '<li style="background:none;padding:0" class="empty-note">Cliquez sur « Communiqué » à côté d\'une information.</li>';
}

function endCall(event) {
    event.preventDefault();
    const call = state.activeCall;
    if (!call.motif) {
        $('#motif-error').hidden = false;
        $('#sheet-motif').focus();
        return;
    }
    clearInterval(state.timer);
    const now = new Date();
    state.calls.push({
        id: Date.now(),
        date: now.toISOString(),
        heure: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        tel: call.tel,
        nom: call.nom.trim(),
        etab: call.etab,
        motif: call.motif,
        duree: Math.floor((Date.now() - call.started) / 1000),
        statut: call.statut,
        notes: [call.notes.trim(), ...call.infos].filter(Boolean).join(' · '),
        infos: call.infos,
    });
    store.set('uac-calls', state.calls);
    state.activeCall = null;
    $('#call-sheet').hidden = true;
    $('#callbar').hidden = true;
    toast('Appel enregistré.');
    refresh();
}

/* ---------- Actions communes ---------- */
function setupActions() {
    document.addEventListener('click', async (event) => {
        const target = event.target.closest('button, a');
        if (!target) return;
        const d = target.dataset;

        if ('copy' in d) {
            try { await navigator.clipboard.writeText(d.text); toast('Copié.'); } catch { toast('Copie impossible dans ce navigateur.'); }
        } else if ('give' in d) {
            if (!state.activeCall) { toast('Disponible pendant un appel : essayez « Simuler un appel ».'); return; }
            const text = `${d.source} — ${d.text}`;
            if (!state.activeCall.infos.includes(text)) state.activeCall.infos.push(text);
            if (!state.activeCall.etab && etabBySigle(d.source)) { state.activeCall.etab = d.source; $('#sheet-etab').value = d.source; }
            renderGiven();
            toast('Ajouté à la fiche d\'appel.');
        } else if (d.removeGiven !== undefined) {
            state.activeCall.infos.splice(Number(d.removeGiven), 1);
            renderGiven();
        } else if (d.removeRow !== undefined) {
            target.closest('[data-filiere]').remove();
        } else if (target.id === 'add-filiere') {
            $('#filiere-rows').insertAdjacentHTML('beforeend', filiereRow());
            $('#filiere-rows [data-filiere]:last-child input').focus();
        } else if (d.report) {
            state.reportContext = d.report;
            state.reportEtab = d.reportEtab;
            $('#report-context').textContent = d.report;
            $('#report-text').value = '';
            $('#report-dialog').showModal();
        } else if (d.reportDone !== undefined) {
            state.reports[Number(d.reportDone)].statut = 'Corrigé';
            store.set('ali-reports', state.reports);
            toast('Signalement marqué comme corrigé.');
            refresh();
        } else if (d.callbackDone) {
            state.done.push(Number(d.callbackDone));
            store.set('uac-callbacks-done', state.done);
            toast('Rappel marqué comme fait.');
            refresh();
        } else if (d.etabType) {
            filters.etab.type = d.etabType;
            $$('[data-etab-type]').forEach((chip) => chip.setAttribute('aria-pressed', chip.dataset.etabType === d.etabType));
            fillEtabGrid();
        } else if (d.answerCat) {
            filters.reponses.categorie = d.answerCat;
            $$('[data-answer-cat]').forEach((chip) => chip.setAttribute('aria-pressed', chip.dataset.answerCat === d.answerCat));
            fillAnswers();
        } else if (d.callsTab) {
            filters.appels.tab = d.callsTab;
            refresh();
        }
    });

    document.addEventListener('input', (event) => {
        if (event.target.id === 'etab-filter') { filters.etab.q = event.target.value; fillEtabGrid(); }
        if (event.target.id === 'answer-filter') { filters.reponses.q = event.target.value; $('#answer-list').dataset.open = ''; fillAnswers(); }
        if (event.target.id === 'calls-filter') { filters.appels.q = event.target.value; fillCallsTable(); }
    });
    document.addEventListener('change', (event) => {
        if (event.target.id === 'etab-ville') { filters.etab.ville = event.target.value; fillEtabGrid(); }
    });

    document.addEventListener('submit', (event) => {
        if (event.target.id === 'chat-form') sendMessage(event);
        if (event.target.id === 'school-form') saveSchoolForm(event);
    });
    document.addEventListener('keydown', (event) => {
        if (event.target.id === 'chat-input' && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.target.form.requestSubmit();
        }
    });

    $('#report-cancel').addEventListener('click', () => $('#report-dialog').close());
    $('#report-form').addEventListener('submit', (event) => {
        const text = $('#report-text').value.trim();
        if (!text) { event.preventDefault(); return; }
        state.reports.unshift({ etabId: state.reportEtab, context: state.reportContext, text, statut: 'Ouvert', when: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) });
        store.set('ali-reports', state.reports);
        toast('Signalement envoyé à l\'école.');
        updateCounts();
    });
}

const etabBySigle = (sigle) => ETABLISSEMENTS.find((e) => e.sigle === sigle);

function setupTheme() {
    const apply = (theme) => { document.documentElement.dataset.theme = theme; };
    let theme = store.get('uac-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(theme);
    $('#theme-toggle').addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        apply(theme);
        store.set('uac-theme', theme);
    });
}

function buildNav() {
    const count = (id) => `<span id="${id}" class="count" hidden></span>`;
    $('#main-nav').innerHTML = state.role === 'ecole'
        ? `<a href="#/fiche" data-nav="fiche">${icon('doc')}Ma fiche</a>
           <a href="#/signalements" data-nav="signalements">${icon('alert')}Signalements ${count('nav-reports')}</a>
           <a href="#/messages" data-nav="messages">${icon('mail')}Messages ${count('nav-messages')}</a>`
        : `<a href="#/accueil" data-nav="accueil">${icon('home')}Accueil</a>
           <a href="#/etablissements" data-nav="etablissements">${icon('grid')}Établissements</a>
           <a href="#/reponses" data-nav="reponses">${icon('doc')}Réponses rapides</a>
           <a href="#/messages" data-nav="messages">${icon('mail')}Messages ${count('nav-messages')}</a>
           <a href="#/appels" data-nav="appels">${icon('phone')}Appels ${count('nav-callbacks')}</a>
           <a href="#/signalements" data-nav="signalements">${icon('alert')}Signalements ${count('nav-reports')}</a>`;
}

function openApp() {
    state.role = $('input[name="login-role"]:checked').value;
    state.etabId = state.role === 'ecole' ? $('#login-etab').value : null;
    const school = state.etabId ? etabById(state.etabId) : null;
    document.body.classList.toggle('role-ecole', state.role === 'ecole');
    $('#brand-sub').textContent = school ? 'Espace école' : 'Console de renseignement';
    $('#user-name').textContent = school ? `Scolarité ${school.sigle}` : 'Agent démo';
    $('#user-initials').textContent = school ? school.sigle.slice(0, 2) : 'AD';
    buildNav();
    $('#login').hidden = true;
    $('#app').hidden = false;
    location.hash = school ? '#/fiche' : '#/accueil';
    route();
}

function logout() {
    if (state.activeCall) { toast('Terminez d\'abord l\'appel en cours.'); return; }
    if (state.ringing) { state.ringing = null; $('#incoming').hidden = true; }
    state.role = null;
    state.etabId = null;
    document.body.classList.remove('role-ecole');
    $('#app').hidden = true;
    $('#login').hidden = false;
    history.replaceState(null, '', location.pathname);
}

/* ---------- Démarrage ---------- */
$$('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
restoreSavedFiches();
$('#login-etab').innerHTML = ETABLISSEMENTS.map((e) => `<option value="${e.id}">${esc(e.sigle)} · ${esc(e.nom)}</option>`).join('');
$$('input[name="login-role"]').forEach((radio) => radio.addEventListener('change', () => {
    const isSchool = $('input[name="login-role"]:checked').value === 'ecole';
    $('#login-school').hidden = !isSchool;
    $('#login-id').value = isSchool ? 'scolarite.demo' : 'agent.demo';
    updateForgotHelp();
}));

function updateForgotHelp() {
    const isSchool = $('input[name="login-role"]:checked').value === 'ecole';
    $('#forgot-help').textContent = isSchool
        ? 'Écrivez à info@alibora.com : l\'équipe Alibora vous enverra un nouveau mot de passe.'
        : 'Demandez à votre superviseur Alibora de vous donner un nouveau mot de passe.';
}
updateForgotHelp();

$('#forgot-pass').addEventListener('click', (event) => {
    const help = $('#forgot-help');
    help.hidden = !help.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!help.hidden));
});

/* Œil barré tant que le mot de passe est caché, œil ouvert quand il est visible. */
function updateEye() {
    const hidden = $('#login-pass').type === 'password';
    const button = $('#toggle-pass');
    const label = hidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe';
    button.innerHTML = icon(hidden ? 'eyeOff' : 'eye');
    button.setAttribute('aria-pressed', String(!hidden));
    button.setAttribute('aria-label', label);
    button.title = label;
}
$('#toggle-pass').addEventListener('click', () => {
    const input = $('#login-pass');
    input.type = input.type === 'password' ? 'text' : 'password';
    updateEye();
    input.focus();
});
updateEye();
$('#logout').addEventListener('click', logout);
setupTheme();
setupSearch();
setupActions();
window.addEventListener('hashchange', () => { if (!$('#app').hidden) route(); });
$('#simulate-call').addEventListener('click', simulateCall);
$('#login-form').addEventListener('submit', (event) => { event.preventDefault(); openApp(); });
