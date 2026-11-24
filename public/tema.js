// Aplica o tema salvo antes da primeira pintura (evita piscar a Folha para
// quem usa a Bancada). Arquivo separado porque a CSP não permite script inline.
try {
  var t = JSON.parse(localStorage.getItem('smw:tema'));
  if (t === 'folha' || t === 'bancada') document.documentElement.dataset.tema = t;
} catch (e) {}
