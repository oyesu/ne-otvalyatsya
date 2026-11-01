// set to true to show the training block
const SHOW_TRAINING = false;

// all prices live here: change the price field
const SERVICES = [
  {title: 'Наращивание волос', text: 'Длина и объём, которые выглядят естественно и держатся.', price: 'от 9 900 ₽', featured: true},
  {title: 'Сложное окрашивание', text: 'AirTouch, мелирование, балаяж, шатуш. Тонирование и укладка по желанию входят в стоимость.', price: 'от 4 900 ₽', featured: true},
  {title: 'Однотонное окрашивание и тонирование', text: 'Уход и укладка входят в стоимость.', price: 'от 2 800 ₽', featured: true},
  {title: 'Кератин и холодное восстановление', text: 'Возвращаем волосам гладкость и блеск.', price: 'По запросу'},
  {title: 'Женские стрижки', text: 'Стрижка с учётом формы лица и структуры волос.', price: 'от 1 200 ₽'},
  {title: 'Мужские стрижки и барбершоп', text: 'Стрижка, оформление бороды.', price: 'от 1 000 ₽'},
  {title: 'Подарочные сертификаты', text: 'Подарите волосы, которые не отвалятся.', price: 'Номинал на выбор'}
];

// optional block, controlled by the flag above
const TRAINING = {title: 'Обучение мастеров', text: 'Студия обучает мастеров салонов красоты.', price: 'По запросу'};

const services = SHOW_TRAINING ? SERVICES.concat(TRAINING) : SERVICES;

// draw service cards and fill the form select
const mainBox = document.getElementById('services-main');
const extraBox = document.getElementById('services-extra');
const select = document.getElementById('service');

services.forEach(s => {
  const card = document.createElement('article');
  card.className = s.featured ? 'card card--featured reveal' : 'card reveal';
  card.innerHTML =
    '<h3>' + s.title + '</h3>' +
    '<p>' + s.text + '</p>' +
    '<span class="card__price">' + s.price + '</span>';
  (s.featured ? mainBox : extraBox).appendChild(card);

  const option = document.createElement('option');
  option.textContent = s.title;
  select.appendChild(option);
});

// mobile menu
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

// reveal on scroll
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(e => {
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

  if (!ok) {
    form.querySelector('[aria-invalid=true]').focus();
    return;
  }

  // todo: connect sending
  console.log('Заявка:', Object.fromEntries(new FormData(form)));
  document.getElementById('form-ok').hidden = false;
  form.reset();
});
