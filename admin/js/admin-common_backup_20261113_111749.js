// admin-common.js - Lógica partilhada do painel de administração
// CONNECTION MOZAMBIQUE

const STORAGE_KEY = 'cm_site_content';
const ACTIVITY_KEY = 'cm_site_activity';
const VISITS_KEY = 'cm_site_visits';
const ORCAMENTOS_KEY = 'cm_site_orcamentos';
const CONTACTOS_KEY = 'cm_site_contactos';

const DEFAULT_CONTENT = {
  textos: {
    heroTitle: 'Gestão de TI, Cibersegurança e Soluções de Redes',
    heroSubtitle: 'Parceiro de confiança em Moçambique para infraestruturas seguras, monitorização 24/7 e continuidade do negócio.',
    servicosTitulo: 'Os Nossos Serviços',
    servicosSubtitulo: 'Soluções de redes, formação, suporte técnico e videovigilância em Moçambique'
  },
  slider: [
    './public/MONTAGEM DE TUBOS METALICOS.png',
    './public/Slide1.jpeg',
    './public/Slide2.jpeg',
    './public/Slide3.jpeg',
    './public/Slide4.jpeg',
    './public/Slide5.jpeg',
    './public/Slide6.jpeg',
    './public/Managed IT.jfif'
  ],
  servicos: [
    {
      id: 'redes',
      titulo: 'Redes & Cabos',
      descricaoCurta: 'Cabeamento estruturado, Wi-Fi empresarial e optimização de redes para máximo desempenho, estabilidade e conectividade.',
      imagem: './public/redes-cablagem.jpg',
      badge: 'REDES & CABOS',
      tituloLongo: 'Infraestrutura de Rede e Cabeamento',
      descricaoLonga: 'Projetamos, instalamos e otimizamos redes empresariais para garantir desempenho, estabilidade e conectividade fiável em todo o seu espaço.',
      itens: ['Cabeamento estruturado (Cat6 / Cat6A / fibra)', 'Redes Wi-Fi empresariais e coverage planning', 'Switch, routers e segmentação de rede', 'Diagnóstico e otimização de performance', 'Documentação e etiquetagem profissional'],
      ativo: true
    },
    {
      id: 'consultoria',
      titulo: 'Consultoria (Treinamento)',
      descricaoCurta: 'Formação em literacia digital, capacitação de equipas e consultoria técnica para potenciar o uso das tecnologias.',
      imagem: './public/formacao-informatica.jpg',
      badge: 'CONSULTORIA (TREINAMENTO)',
      tituloLongo: 'Formação e Capacitação Técnica',
      descricaoLonga: 'Capacitamos as suas equipas com formação prática em literacia digital, ferramentas de produtividade e boas práticas de TI.',
      itens: ['Formação em literacia digital', 'Capacitação em software e ferramentas de trabalho', 'Treinamento de monitores e utilizadores', 'Consultoria técnica e roadmap de transformação', 'Sessões presenciais ou online'],
      ativo: true
    },
    {
      id: 'helpdesk',
      titulo: 'Helpdesk',
      descricaoCurta: 'Suporte técnico dedicado, gestão de tickets e resolução rápida de incidentes para manter a sua operação a funcionar.',
      imagem: './public/helpdesk-suporte.jpg',
      badge: 'HELPDESK',
      tituloLongo: 'Suporte Técnico e Helpdesk',
      descricaoLonga: 'Oferecemos suporte técnico remoto e presencial, com gestão de tickets e SLA definidos.',
      itens: ['Suporte remoto e presencial', 'Gestão de tickets e prioritização', 'Monitorização proactiva', 'Resolução de incidentes de TI', 'Relatórios de desempenho'],
      ativo: true
    },
    {
      id: 'cftv',
      titulo: 'CFTV',
      descricaoCurta: 'Sistemas de videovigilância, gravação e monitorização para segurança física das suas instalações.',
      imagem: './public/sistema-CFTV.jpg',
      badge: 'CFTV',
      tituloLongo: 'Videovigilância e CFTV',
      descricaoLonga: 'Instalamos e configuramos sistemas de CFTV modernos com gravação, acesso remoto e integração com outras soluções de segurança.',
      itens: ['Câmeras IP e analógicas', 'Gravadores NVR/DVR', 'Acesso remoto via app', 'Monitorização 24/7', 'Manutenção e expansão'],
      ativo: true
    }
  ],
  solucoes: [
    { id: 'infraestrutura', titulo: 'Infraestrutura e redes', descricao: 'Projetos de redes, cabeamento e Wi-Fi empresarial.', imagem: './public/InfraestruturaRedeCabeamentoEstruturado.jpg', ativo: true },
    { id: 'seguranca', titulo: 'Segurança digital', descricao: 'Cibersegurança, firewalls e proteção de dados.', imagem: './public/ciberseguranca.jpg', ativo: true },
    { id: 'continuidade', titulo: 'Backup e continuidade', descricao: 'Backup, recuperação de desastres e continuidade do negócio.', imagem: './public/cloud-backup.jpg', ativo: true }
  ],
  empresas: [
    { id: 'adpp', nome: 'ADPP MOÇAMBIQUE', logo: './public/ADPP.png', ativo: true },
    { id: 'technoserve', nome: 'TechnoServe', logo: './public/Techno Serve.png', ativo: true },
    { id: 'unhcr', nome: 'UNHCR / ACNUR', logo: './public/UnhcrAcnur.png', ativo: true },
    { id: 'inm', nome: 'INM', logo: './public/INM.png', ativo: true }
  ],
  sobre: {
    titulo: 'Sobre Nós',
    texto: 'A CONNECTION MOZAMBIQUE, LDA é uma empresa moçambicana especializada em soluções tecnológicas, redes, cibersegurança e suporte técnico.',
    missao: 'Fornecer soluções de TI fiáveis e inovadoras que impulsionam o sucesso dos nossos clientes.',
    visao: 'Ser o parceiro tecnológico de referência em Moçambique.',
    valores: ['Excelência técnica', 'Compromisso com o cliente', 'Inovação', 'Integridade']
  },
  recursos: [
    { id: 'r1', titulo: 'Boas práticas de cibersegurança', tipo: 'Artigo', link: '#', imagem: './public/boas-praticas-de-ciberseguranca-com-autenticacao-multifator-1024x576.jpg.webp', ativo: true },
    { id: 'r2', titulo: 'Tipos de serviços de cibersegurança', tipo: 'Guia', link: '#', imagem: './public/6936030f1813d360788539c8_types-of-cybersecurity- ervices.jpg', ativo: true }
  ]
};

const AVAILABLE_IMAGES = [
  'Slide1.jpeg', 'Slide2.jpeg', 'Slide3.jpeg', 'Slide4.jpeg', 'Slide5.jpeg', 'Slide6.jpeg',
  'redes-cablagem.jpg', 'formacao-informatica.jpg', 'helpdesk-suporte.jpg', 'sistema-CFTV.jpg',
  'ciberseguranca.jpg', 'cctv-seguranca-electronica.jpg', 'InfraestruturaRedeCabeamentoEstruturado.jpg',
  'Managed IT.jfif', 'MONTAGEM DE TUBOS METALICOS.png', 'Consultoria.jpg', 'Consultoria1.webp',
  'Helpdesk.jfif', 'Helpdesk 2.jfif', 'Helpdesk247.jfif', 'Seguranca.jfif',
  'REdes.jfif', 'Redes1.jfif', 'Redes2.jfif', 'Redes3.jfif', 'Redes4.jfif', 'Redes5.jfif', 'Redes8.jfif',
  'assistencia-informatica.jpg', 'cloud-backup.jpg', 'consultoria-ti.jpg',
  'logo.png', 'ADPP.png', 'Techno Serve.png', 'UnhcrAcnur.png', 'INM.png',
  'boas-praticas-de-ciberseguranca-com-autenticacao-multifator-1024x576.jpg.webp',
  '6936030f1813d360788539c8_types-of-cybersecurity- ervices.jpg'
];

function requireAuth() {
  if (sessionStorage.getItem('cm_admin_auth') !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  sessionStorage.removeItem('cm_admin_auth');
  sessionStorage.removeItem('cm_admin_user');
  sessionStorage.removeItem('cm_admin_name');
  window.location.href = 'login.html';
}

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        textos: { ...DEFAULT_CONTENT.textos, ...(parsed.textos || {}) },
        slider: Array.isArray(parsed.slider) && parsed.slider.length ? parsed.slider : DEFAULT_CONTENT.slider.slice(),
        servicos: Array.isArray(parsed.servicos) && parsed.servicos.length ? parsed.servicos : DEFAULT_CONTENT.servicos.map(s => ({ ...s, itens: [...(s.itens || [])] })),
        solucoes: Array.isArray(parsed.solucoes) && parsed.solucoes.length ? parsed.solucoes : DEFAULT_CONTENT.solucoes.map(s => ({ ...s })),
        empresas: Array.isArray(parsed.empresas) && parsed.empresas.length ? parsed.empresas : DEFAULT_CONTENT.empresas.map(s => ({ ...s })),
        sobre: { ...DEFAULT_CONTENT.sobre, ...(parsed.sobre || {}), valores: (parsed.sobre && parsed.sobre.valores) || [...DEFAULT_CONTENT.sobre.valores] },
        recursos: Array.isArray(parsed.recursos) && parsed.recursos.length ? parsed.recursos : DEFAULT_CONTENT.recursos.map(s => ({ ...s }))
      };
    }
  } catch (e) { console.warn(e); }
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
}

function saveContent(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  logActivity('admin', 'conteudo_atualizado', 'Conteúdo do site atualizado pelo administrador');
  return true;
}

function exportContent() {
  const data = loadContent();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'connection-mozambique-content.json';
  a.click();
  URL.revokeObjectURL(url);
}

function resetToDefault() {
  if (confirm('Tem a certeza que deseja restaurar todo o conteúdo para os valores originais?')) {
    localStorage.removeItem(STORAGE_KEY);
    logActivity('admin', 'conteudo_restaurado', 'Conteúdo restaurado para valores padrão');
    return true;
  }
  return false;
}

function imgPath(path) {
  if (!path) return '../public/logo.png';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('./')) return '../' + path.slice(2);
  if (path.startsWith('public/')) return '../' + path;
  return path;
}

function logActivity(user, action, detail, meta) {
  try {
    const list = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    list.unshift({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      ts: new Date().toISOString(),
      user: user || 'visitante',
      action,
      detail: detail || '',
      meta: meta || {},
      page: (typeof location !== 'undefined' ? location.pathname.split('/').pop() : '') || ''
    });
    if (list.length > 500) list.length = 500;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list));
  } catch (e) {}
}

function getActivity(limit) {
  try {
    const list = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    return limit ? list.slice(0, limit) : list;
  } catch (e) { return []; }
}

function getVisits() {
  try { return JSON.parse(localStorage.getItem(VISITS_KEY) || '[]'); } catch (e) { return []; }
}

function recordVisit(page) {
  try {
    const visits = getVisits();
    const sessionId = sessionStorage.getItem('cm_visit_session') || ('s-' + Date.now());
    sessionStorage.setItem('cm_visit_session', sessionId);
    visits.unshift({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      ts: new Date().toISOString(),
      page: page || (location.pathname.split('/').pop() || 'index.html'),
      sessionId,
      referrer: document.referrer || '',
      ua: (navigator.userAgent || '').slice(0, 120)
    });
    if (visits.length > 1000) visits.length = 1000;
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    logActivity('visitante', 'page_view', 'Visitou ' + (page || location.pathname), { page });
  } catch (e) {}
}

function getOrcamentos() {
  try { return JSON.parse(localStorage.getItem(ORCAMENTOS_KEY) || '[]'); } catch (e) { return []; }
}

function saveOrcamento(data) {
  const list = getOrcamentos();
  list.unshift({ id: Date.now().toString(), ts: new Date().toISOString(), ...data, status: 'novo' });
  localStorage.setItem(ORCAMENTOS_KEY, JSON.stringify(list));
  logActivity(data.email || data.nome || 'visitante', 'orcamento', 'Pedido de orçamento: ' + (data.servico || ''), data);
}

function getContactos() {
  try { return JSON.parse(localStorage.getItem(CONTACTOS_KEY) || '[]'); } catch (e) { return []; }
}

function saveContacto(data) {
  const list = getContactos();
  list.unshift({ id: Date.now().toString(), ts: new Date().toISOString(), ...data, status: 'novo' });
  localStorage.setItem(CONTACTOS_KEY, JSON.stringify(list));
  logActivity(data.email || data.nome || 'visitante', 'contacto', 'Mensagem de contacto', data);
}

function getStats() {
  const content = loadContent();
  const visits = getVisits();
  const activity = getActivity();
  const orcamentos = getOrcamentos();
  const contactos = getContactos();
  const today = new Date().toISOString().slice(0, 10);
  const visitsToday = visits.filter(v => (v.ts || '').startsWith(today)).length;
  const uniqueSessions = new Set(visits.map(v => v.sessionId)).size;
  return {
    servicos: (content.servicos || []).filter(s => s.ativo !== false).length,
    solucoes: (content.solucoes || []).filter(s => s.ativo !== false).length,
    empresas: (content.empresas || []).filter(s => s.ativo !== false).length,
    recursos: (content.recursos || []).filter(s => s.ativo !== false).length,
    slider: (content.slider || []).length,
    visitasTotal: visits.length,
    visitasHoje: visitsToday,
    sessoes: uniqueSessions,
    orcamentos: orcamentos.length,
    contactos: contactos.length,
    atividades: activity.length
  };
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso; }
}

function actionBadge(action) {
  const map = {
    page_view: 'secondary',
    orcamento: 'primary',
    contacto: 'info',
    conteudo_atualizado: 'success',
    login: 'dark',
    delete: 'danger',
    edit: 'warning'
  };
  return map[action] || 'secondary';
}
