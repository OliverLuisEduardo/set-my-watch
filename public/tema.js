// Aplica o tema salvo antes da primeira pintura (evita piscar o tema claro para
// quem usa o escuro). Arquivo separado porque a CSP não permite script inline.
try {
  var t = JSON.parse(localStorage.getItem('smw:tema'));
  if (t === 'claro' || t === 'escuro') document.documentElement.dataset.tema = t;
} catch (e) {}
