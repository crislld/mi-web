(() => {
  document.documentElement.lang = 'en';
  // Translate the complete visible copy of the English edition. Academic paper
  // titles already written in English are left untouched by the service.
  const translate = async text => {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0].map(part => part[0]).join('');
  };
  const translations = new Map([
    ['Inicio','Home'], ['Sobre mí','About'], ['Investigación','Research'], ['Publicaciones','Publications'], ['Divulgación','Outreach'], ['Contacto','Contact'], ['Proyectos','Projects'], ['Laboratorio','Laboratory'], ['Laboratorio Virtual','Virtual Lab'], ['Ver CV completo','View full CV'], ['Descargar curriculum','Download CV'], ['Descargar CV','Download CV'], ['LÍNEA DE INVESTIGACIÓN','RESEARCH AREA'], ['Introducción','Introduction'], ['INTRODUCCIÓN','INTRODUCTION'], ['Volver a Investigación','Back to Research'], ['Explorar línea','Explore area'], ['Explorar proceso','Explore process'], ['Conoce mi investigación →','Explore my research →'], ['Áreas de investigación','Research areas'], ['Publicaciones seleccionadas','Selected publications'], ['Ver todas las publicaciones','View all publications'], ['PERFIL PROFESIONAL','PROFESSIONAL PROFILE'], ['Formación','Education'], ['Posición actual','Current position'], ['Especialización','Expertise'], ['Colaboraciones','Collaborations'], ['Fenotipado Vegetal','Plant Phenotyping'], ['Teledetección','Remote Sensing'], ['Uso eficiente del agua','Efficient Water Use'], ['Inteligencia Artificial','Artificial Intelligence'], ['Agricultura de precisión','Precision Agriculture'], ['Plataformas UAV','UAV Platforms'], ['Fenotipado','Phenotyping'], ['Divulgación científica','Science outreach'], ['Galería','Gallery'], ['Próximamente','Coming soon'], ['Canal de YouTube','YouTube channel'], ['Volver','Back'], ['Aplicaciones','Applications'], ['APLICACIONES','APPLICATIONS'], ['Variables que se miden','MEASURED VARIABLES'], ['Información obtenida mediante fenotipado','Information obtained through phenotyping'], ['Mejora genética','Plant breeding'], ['Selección varietal','Varietal selection'], ['Respuesta al estrés','Stress response'], ['Estado hídrico','Water status'], ['Cobertura vegetal','Vegetation cover'], ['Altura','Height'], ['Temperatura','Temperature'], ['Biomasa','Biomass'], ['Índices espectrales','Spectral indices'], ['Investigación | Innovación | Agricultura','Research | Innovation | Agriculture'], ['Investigador · EEAD-CSIC','Researcher · EEAD-CSIC'], ['Investigador ARAID · EEAD-CSIC','ARAID Researcher · EEAD-CSIC'], ['Zaragoza, España','Zaragoza, Spain'], ['Leer publicación →','Read publication →'], ['Ver publicaciones','View publications'], ['Todos','All'], ['Año','Year'], ['Revista','Journal'], ['Autores','Authors'], ['Título','Title'], ['Buscar publicaciones','Search publications'], ['Sin resultados','No results'], ['Curriculum Vitae','Curriculum Vitae']
  ]);
  const long = new Map([
    ['Cuantificación objetiva de las características morfológicas y fisiológicas de los cultivos mediante sensores remotos, plataformas UAV e inteligencia artificial.','Objective quantification of crop morphological and physiological traits using remote sensors, UAV platforms and artificial intelligence.'],
    ['Mi investigación se centra en el desarrollo de tecnologías avanzadas para monitorizar cultivos, optimizar el uso del agua y mejorar la sostenibilidad de los sistemas agrícolas mediante teledetección, sensores remotos e inteligencia artificial.','My research focuses on developing advanced technologies to monitor crops, optimise water use and improve the sustainability of agricultural systems through remote sensing, sensors and artificial intelligence.'],
    ['Soy Investigador ARAID en la Estación Experimental de Aula Dei (EEAD-CSIC), donde desarrollo mi actividad en el ámbito de la agricultura de precisión, la teledetección y el fenotipado de cultivos.','I am an ARAID Researcher at the Aula Dei Experimental Station (EEAD-CSIC), where I work in precision agriculture, remote sensing and crop phenotyping.'],
    ['El objetivo de este trabajo es generar conocimiento que contribuya a una agricultura más eficiente, resiliente y sostenible frente a los retos del cambio climático.','The aim of this work is to generate knowledge that contributes to more efficient, resilient and sustainable agriculture in response to climate-change challenges.']
  ]);
  const clean = s => s.replace(/\s+/g, ' ').trim();
  const fixedHeadings = [
    ['resumen', '', 'Overview'],
    ['perfil', 'profesional', 'Professional Profile'],
    ['trayectoria', 'científica', 'Scientific Career'],
    ['centros', 'investigación', 'Research Institutions'],
    ['áreas', 'especialización', 'Areas of Expertise'],
    ['proyectos', 'destacados', 'Featured Research Projects'],
    ['consulta', 'trayectoria', 'Explore the Complete Career'],
    ['contacto', '', 'Contact'],
    ['correo', 'electrónico', 'Email'],
    ['centro', 'investigación', 'Research Centre'],
    ['dirección', '', 'Address'],
    ['perfiles', 'científicos', 'Research Profiles'],
    ['localización', '', 'Location'],
    ['ciencia', 'comparte', 'Science Is Meant to Be Shared'],
    ['charlas', 'exposiciones', 'Talks, Conferences and Exhibitions'],
    ['presentaciones', 'congresos', 'Conference Presentations'],
    ['organizas', 'charla', 'Are You Organising a Talk, Event or Exhibition?'],
    ['dato', 'conocimiento', 'From Data to Knowledge'],
    ['publicaciones', 'seleccionadas', 'Selected Publications'],
    ['artículos', 'científicos', 'Scientific Articles'],
    ['experiencias', 'interactivas', 'Interactive Experiences'],
    ['vuelo', 'teledetección', 'Flight and Remote Sensing'],
    ['simulador', 'vuelo', 'Scientific Flight Simulator'],
    ['tecnologías', 'utilizadas', 'Technologies Used'],
    ['adquisición', '', 'Data Acquisition'],
    ['procesamiento', '', 'Processing'],
    ['conocimiento', '', 'Knowledge'],
    ['clasificación', '', 'Classification'],
    ['predicción', '', 'Prediction'],
    ['segmentación', '', 'Segmentation'],
    ['estimación', '', 'Estimation'],
    ['detección', '', 'Detection'],
    ['análisis', 'multivariable', 'Multivariate Analysis'],
    ['apoyo', 'decisión', 'Decision Support'],
    ['inteligencia', 'servicio', 'Artificial Intelligence for Agriculture'],
    ['tecnologías', 'empleadas', 'Technologies Used'],
    ['observación', 'satélite', 'Satellite Observation'],
    ['agricultura', 'sostenible', 'Sustainable Agriculture'],
    ['gestión', 'agua', 'Efficient Water Management'],
    ['decisiones', 'datos', 'Data-Driven Decisions'],
    ['proceso', 'investigación', 'Research Workflow'],
    ['captación', '', 'Data Capture'],
    ['aplicación', '', 'Application'],
    ['casos', 'estudio', 'Case Studies'],
    ['aplicaciones', 'investigación', 'Research Applications'],
    ['cultivos', 'extensivos', 'Field Crops'],
    ['retos', 'científicos', 'Scientific Challenges'],
    ['detección', 'estrés hídrico', 'Early Water-Stress Detection'],
    ['escalado', 'información', 'Scaling Information'],
    ['automatización', 'análisis', 'Automated Analysis'],
    ['agricultura', 'resiliente', 'Resilient Agriculture'],
    ['vuelo', 'precisión', 'Precision Flight'],
    ['uso eficiente', 'agua', 'Efficient Water Use'],
    ['fenotipado', 'vegetal', 'Plant Phenotyping'],
    ['inteligencia', 'artificial', 'Artificial Intelligence'],
    ['plataformas', 'uav', 'UAV Platforms'],
    ['teledetección', '', 'Remote Sensing'],
    ['investigación', '', 'Research'],
    ['laboratorio', 'virtual', 'Virtual Laboratory'],
    ['divulgación', '', 'Science Outreach'],
    ['publicaciones', '', 'Publications'],
    ['contacto', '', 'Contact']
  ];
  // Headings sometimes contain <br>, <em> or spans. Translate the complete
  // heading before walking individual text nodes, so it can never be split
  // into a Spanish first line and an English second line.
  document.querySelectorAll('h1, h2, h3').forEach(element => {
    const value = clean(element.textContent);
    const lower = value.toLocaleLowerCase('es');
    const heading = fixedHeadings.find(([first, second]) => lower.includes(first) && (!second || lower.includes(second)));
    if (heading) element.textContent = heading[2];
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const key = clean(node.nodeValue);
    const lower = key.toLocaleLowerCase('es');
    const heading = fixedHeadings.find(([first, second]) => lower.includes(first) && (!second || lower.includes(second)));
    if (heading && node.parentElement && /^H[1-3]$/.test(node.parentElement.tagName)) {
      node.nodeValue = heading[2];
      return;
    }
    const replacement = long.get(key) || translations.get(key);
    if (replacement) {
      // Source pages are formatted with line breaks. Match their whitespace
      // flexibly, rather than requiring an exact one-line text node.
      const pattern = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
      node.nodeValue = node.nodeValue.replace(pattern, replacement);
    }
  });
  document.querySelectorAll('[alt]').forEach(el => el.alt = el.alt.replace('David Gómez Candón','David Gómez Candón').replace('Investigación','Research').replace('fenotipado vegetal','plant phenotyping'));
  document.title = document.title.replace('Investigación','Research').replace('Publicaciones','Publications').replace('Divulgación','Outreach').replace('Fenotipado vegetal','Plant Phenotyping').replace('Teledetección','Remote Sensing').replace('Agua','Water');
  // Translate the remaining paragraphs, captions and controls after the
  // editorial glossary above has handled the terminology used throughout.
  const remaining = [];
  const all = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (all.nextNode()) {
    const node = all.currentNode;
    const value = clean(node.nodeValue);
    if (value.length > 2 && /[áéíóúñ¿¡]|\b(el|la|los|las|de|para|con|una|del)\b/i.test(value) && !translations.has(value) && !long.has(value)) remaining.push([node, value]);
  }
  Promise.all(remaining.map(async ([node, value]) => {
    try { node.nodeValue = await translate(value); } catch (_) { /* keeps original copy if offline */ }
  })).then(() => { document.title = document.title.replace('Página','Page'); });
})();
