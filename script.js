// set to true to show sensitive services
const SHOW_SENSITIVE_SERVICES = false;

const ICONS = {
  engine:'<path d="M4 9h3l2-2h6l1 2h3v7h-3l-1 2H9l-2-2H4z"/>',
  susp:'<path d="M8 3h8M8 21h8M9 6l6 2-6 2 6 2-6 2 6 2"/>',
  bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  diag:'<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
  starter:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  oil:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  gear:'<path d="M6 4v16M12 4v16M18 4v16M6 12h12"/>',
  chip:'<rect x="7" y="7" width="10" height="10"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  cloud:'<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A4.5 4.5 0 0 1 17 18z"/>',
  lock:'<rect x="5" y="11" width="14" height="9"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
};

const AFTER = 'Стоимость после диагностики';

// main services, always shown
const SERVICES = [
  {i:'engine', t:'Ремонт бензиновых двигателей', d:'Определяем причину и ремонтируем без лишних замен.', p:AFTER},
  {i:'susp', t:'Ремонт ходовой части', d:'Подвеска, стойки, рычаги, сайлентблоки.', p:AFTER},
  {i:'bolt', t:'Автоэлектрика', d:'Поиск и устранение неисправностей электрики и электроники.', p:AFTER},
  {i:'diag', t:'Диагностика', d:'Дымогенератор, эндоскопия, компьютерная диагностика.', p:'от 0 ₽'},
  {i:'starter', t:'Ремонт стартеров и генераторов', d:'Проверка, ремонт или замена.', p:AFTER},
  {i:'oil', t:'Техобслуживание', d:'Замена масла в ДВС, тормозных колодок, фильтров.', p:'от 0 ₽'},
  {i:'gear', t:'Масло в АКПП и МКПП', d:'Замена масла в коробках передач.', p:'от 0 ₽'},
  {i:'chip', t:'Чип-тюнинг Stage 1', d:'Программная настройка работы двигателя.', p:'от 0 ₽'},
  {i:'box', t:'Запчасти', d:'В наличии и под заказ.', p:'Цена по запросу'}
];

// sensitive services, controlled by the flag
const SENSITIVE_SERVICES = [
  {i:'cloud', t:'Удаление катализатора и сажевого фильтра', d:'Описание уточнит владелец.', p:AFTER},
  {i:'cloud', t:'Отключение систем экологии', d:'AdBlue, DPF, GPF, Euro2. Описание уточнит владелец.', p:AFTER},
  {i:'lock', t:'Отключение иммобилайзера', d:'IMMO OFF. Описание уточнит владелец.', p:AFTER}
];

const grid = document.getElementById('services-grid');
const list = SHOW_SENSITIVE_SERVICES ? SERVICES.concat(SENSITIVE_SERVICES) : SERVICES;
list.forEach(s => {
  const el = document.createElement('article');
  el.className = 'card reveal';
  el.innerHTML =
    '<svg class="icon icon--large" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[s.i] + '</svg>' +
    '<h3>' + s.t + '</h3>' +
    '<p>' + s.d + '</p>' +
    '<span class="card__price">' + s.p + '</span>';
  grid.appendChild(el);
});

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  burger.setAttribute('aria-expanded', open);
});

nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('nav--open');
  }
});

const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('reveal--visible');
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.15}) : null;

document.querySelectorAll('.reveal').forEach(el => {
  io ? io.observe(el) : el.classList.add('reveal--visible');
});

// form validation
const form = document.getElementById('form');

// earliest date is now
const timeInput = document.getElementById('time');
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
timeInput.min = now.toISOString().slice(0, 16);
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const err = f.parentElement.querySelector('.form__error');
    let msg = '';
    if (!f.value.trim()) msg = 'Заполните это поле';
    else if (f.type === 'tel' && f.value.replace(/\D/g, '').length < 10) msg = 'Введите телефон полностью';
    err.textContent = msg;
    f.setAttribute('aria-invalid', !!msg);
    if (msg) ok = false;
  });
  if (!ok) { form.querySelector('[aria-invalid=true]').focus(); return; }
  // todo: connect sending
  console.log('Заявка:', Object.fromEntries(new FormData(form)));
  document.getElementById('form-ok').hidden = false;
  form.reset();
});
