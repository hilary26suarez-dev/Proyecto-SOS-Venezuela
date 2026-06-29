export const MARCH_STEPS = [
  {
    id: 'M',
    letter: 'M',
    title: 'HEMORRAGIA MASIVA',
    subtitle: 'Massive Hemorrhage — Prioridad #1',
    color: '#CC0000',
    icon: '🩸',
    description: 'La pérdida de sangre masiva mata antes que cualquier otra lesión. Actúa primero.',
    warning: 'NO esperes. Actúa en los primeros 3 minutos.',
    steps: [
      {
        title: 'Evalúa el sangrado',
        detail: 'Si la sangre sale pulsando o empapando vendajes en segundos → Es una arteria. Actúa INMEDIATAMENTE.',
      },
      {
        title: 'Torniquete en extremidades',
        detail: 'Coloca el torniquete "ALTO Y APRETADO" — 5 a 7 cm sobre la herida. Gira hasta que el sangrado se detenga completamente. Anota la hora de aplicación con marcador o sangre del dedo sobre la piel.',
        note: 'MITO PELIGROSO: El torniquete NO causa amputación si se aplica correctamente. SÍ salva vidas. Puede estar puesto hasta 2 horas con seguridad.',
      },
      {
        title: 'Heridas de unión (axila, ingle, cuello)',
        detail: 'No puedes poner torniquete aquí. Aplica EMPAQUETAMIENTO: introduce gasa (preferiblemente hemostática) directamente en la herida con presión constante. Usa tus dedos si no hay gasa. Mantén presión mínimo 3 minutos SIN SOLTAR.',
      },
      {
        title: 'Presión directa',
        detail: 'Para heridas menores: presión directa con tela limpia. Si se empapa, NO la retires — agrega más encima y continúa presionando.',
      },
    ],
    supplies: ['Torniquete CAT o banda ancha', 'Gasas hemostáticas', 'Tela limpia o ropa'],
  },
  {
    id: 'A',
    letter: 'A',
    title: 'VÍA AÉREA',
    subtitle: 'Airway — Asegura que pueda respirar',
    color: '#FF8C00',
    icon: '🫁',
    description: 'Un paciente inconsciente pierde tono muscular. La lengua puede bloquear la garganta.',
    steps: [
      {
        title: 'Evalúa consciencia',
        detail: '¿La persona responde? → Habla. ¿No responde? → Activa protocolo de vía aérea.',
      },
      {
        title: 'Elevación del mentón',
        detail: 'Coloca una mano en la frente. Con dos dedos de la otra mano levanta el mentón hacia arriba. Esto mueve la lengua hacia adelante y abre la vía aérea.',
        note: 'Si sospechas lesión de cuello: usa tracción mandibular (jaw thrust) — empuja la mandíbula hacia adelante desde los ángulos sin mover el cuello.',
      },
      {
        title: 'Limpia la boca',
        detail: 'Si hay vómito, sangre o dientes sueltos en la boca → retira con el dedo en gancho. Voltea la cabeza si hay riesgo de ahogamiento.',
      },
      {
        title: 'Posición de recuperación',
        detail: 'Paciente inconsciente que respira: colócalo de lado (posición lateral de seguridad). Esto previene que se ahogue con vómito.',
      },
    ],
    supplies: ['Nada especial requerido', 'Guantes si están disponibles'],
  },
  {
    id: 'R',
    letter: 'R',
    title: 'RESPIRACIÓN',
    subtitle: 'Respiration — Heridas en el pecho',
    color: '#FF6600',
    icon: '💨',
    description: 'Una herida penetrante en el tórax puede colapsar el pulmón. Reconócela.',
    steps: [
      {
        title: 'Signos de neumotórax',
        detail: 'Herida "soplante" en el pecho. Dificultad severa para respirar. Respiración asimétrica (un lado no sube). La víctima se deteriora rápido.',
      },
      {
        title: 'Sello torácico de 3 lados',
        detail: 'Cubre la herida con plástico limpio (bolsa, envoltura). Sella 3 lados con cinta. Deja un lado ABIERTO — esto crea una válvula que permite salir aire pero no entrar.',
        note: 'NUNCA apliques un sello completamente cerrado. Puede causar neumotórax a tensión = muerte.',
      },
      {
        title: 'Monitorea constantemente',
        detail: 'Si el paciente empeora con el sello puesto: levanta el sello temporalmente para permitir que salga aire acumulado, luego vuelve a sellarlo.',
      },
      {
        title: 'Fractura de costillas',
        detail: 'NO vendas el tórax con presión circunferencial. El paciente necesita expandir el pecho para respirar. Solo soporte.',
      },
    ],
    supplies: ['Plástico limpio (bolsa, envoltura)', 'Cinta médica', 'Sello torácico ventilado (si hay)'],
  },
  {
    id: 'C',
    letter: 'C',
    title: 'CIRCULACIÓN',
    subtitle: 'Circulation — Evalúa el shock',
    color: '#CC4400',
    icon: '❤️',
    description: 'Después del sangrado activo, evalúa el estado circulatorio general.',
    steps: [
      {
        title: 'Signos de shock hipovolémico',
        detail: 'Piel pálida, fría y húmeda (diaforesis). Confusión o agitación inexplicable. Sed intensa. Pulso rápido y débil. Estos son signos de que el cuerpo está compensando la pérdida de volumen.',
      },
      {
        title: 'Revisita el control de sangrado',
        detail: 'Revisa todos los torniquetes y vendajes. ¿Siguen apretados? ¿Hay resangrado? Apretar más si hay resangrado activo.',
      },
      {
        title: 'Posición anti-shock',
        detail: 'Si no hay lesión en columna: eleva las piernas 30 cm para mejorar el retorno venoso al corazón. Mantén al paciente horizontal.',
      },
      {
        title: 'Hidratación oral',
        detail: 'SOLO si está consciente y puede tragar: agua a sorbos. Nunca fuerces líquidos a inconscientes.',
      },
    ],
    supplies: ['Nada adicional', 'Agua limpia si el paciente está consciente'],
  },
  {
    id: 'H',
    letter: 'H',
    title: 'HIPOTERMIA',
    subtitle: 'Hypothermia/Head — Previene la muerte fría',
    color: '#0066CC',
    icon: '🌡️',
    description: 'La hipotermia bloquea la coagulación. Con hemorragia activa, es mortal. También evalúa lesión de cráneo.',
    steps: [
      {
        title: 'Prevención inmediata del frío',
        detail: 'Retira ropa húmeda. Separa al paciente del suelo con cartón, mochila o cualquier barrera. El suelo roba calor corporal más rápido que el viento.',
      },
      {
        title: 'Manta térmica de mylar',
        detail: 'Envuelve al paciente completamente. El lado dorado/plata refleja el calor corporal de vuelta. Cubre la cabeza — se pierde hasta 30% del calor por ahí.',
      },
      {
        title: 'Signos de TEC (lesión de cráneo)',
        detail: 'Inconsciencia. Pupilas asimétricas o no reactivas. Líquido claro por nariz u oídos. Vómito en proyectil. Deterioro neurológico progresivo.',
        note: 'Si sospechas TEC: NO le des agua ni alimento. NO lo muevas a menos que sea absolutamente necesario. Inmoviliza cuello.',
      },
      {
        title: 'Monitoreo continuo',
        detail: 'Cada 5 minutos: verifica respiración, nivel de consciencia, color de piel, sangrado activo. Habla con el paciente aunque parezca inconsciente.',
      },
    ],
    supplies: ['Manta térmica mylar', 'Ropa seca', 'Barrera del suelo (cartón, mochila)'],
  },
];

export const TRIAGE_COLORS = {
  rojo: { label: 'ROJO — Inmediato', desc: 'Riesgo de vida. Requiere atención ahora.', color: '#CC0000' },
  amarillo: { label: 'AMARILLO — Diferido', desc: 'Grave pero puede esperar 1-2 horas.', color: '#FFB800' },
  verde: { label: 'VERDE — Menor', desc: 'Lesiones leves. Puede esperar.', color: '#007700' },
  negro: { label: 'NEGRO — Expectante', desc: 'Sin signos vitales o lesiones incompatibles con la vida.', color: '#333333' },
};
