import { useEffect, useState } from 'react';
import { ArrowRight, BatteryCharging, BookOpen, Brain, Download, Layers3, RotateCcw, Sparkles, X } from 'lucide-react';
import jsPDF from 'jspdf';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Topic {
  name: string;
}

interface Section {
  title: string;
  topics: Topic[];
  color: string;
}

interface MethodologyGuide {
  title: string;
  shortDescription: string;
  modalIntro: string;
  whatToEvaluate: string;
  usageExplanation: string[];
  evaluationPrompt: string;
  interpretationText: string;
  practicalExample: string;
  reminders?: string[];
}

const sections: Section[] = [
  {
    title: 'METODOLOGIA DOS 5 CORPOS',
    topics: [
      { name: 'Corpo Fisico' },
      { name: 'Corpo Mental' },
      { name: 'Corpo Emocional' },
      { name: 'Corpo Espiritual' },
      { name: 'Corpo Autentico' },
    ],
    color: '#1E40AF',
  },
  {
    title: 'BANCO DE ENERGIA',
    topics: [
      { name: 'Depositos' },
      { name: 'Retiradas' },
    ],
    color: '#F59E0B',
  },
  {
    title: 'ESTRATEGIAS APLICADAS',
    topics: [
      { name: 'Comando Mental' },
      { name: 'Comando do Tempo' },
      { name: 'Fechamento de Ciclo' },
      { name: 'START' },
      { name: 'SKANER' },
      { name: 'Presenca' },
      { name: 'Armadura de Cristal' },
    ],
    color: '#10B981',
  },
  {
    title: 'TRACOS NEURODIVERGENTES',
    topics: [
      { name: 'Masking (Mascaramento)' },
      { name: 'Inercia Autista' },
      { name: 'Hiperfoco' },
      { name: 'Ruminacao' },
      { name: 'Alexitimia' },
      { name: 'Hiperempatia' },
      { name: 'Ima de Energia' },
      { name: 'Transtornos Sensoriais' },
    ],
    color: '#EC4899',
  },
];

const methodologyGuides: MethodologyGuide[] = [
  {
    title: 'METODOLOGIA DOS 5 CORPOS',
    shortDescription: 'Entenda o nivel de energia disponivel em cada corpo avaliado.',
    modalIntro:
      'Esta leitura mostra como sua energia esta distribuida entre diferentes dimensoes da sua vida. O objetivo nao e responder bonito, e sim enxergar com clareza onde existe recurso, desgaste ou necessidade de cuidado.',
    whatToEvaluate: 'Qual o meu nivel de energia para cada um dos corpos?',
    usageExplanation: [
      'Observe como voce esta no momento atual antes de marcar cada item.',
      'Considere o estado real de cada corpo, sem responder pelo que gostaria de sentir.',
      'Use a escala para representar com honestidade o nivel de energia percebido.',
    ],
    evaluationPrompt: 'Pergunta de avaliacao para cada item: qual o meu nivel de energia neste corpo agora?',
    interpretationText:
      'Notas baixas indicam corpos que pedem mais recuperacao, organizacao ou suporte. Notas mais altas mostram onde existe mais estabilidade e disponibilidade no momento.',
    practicalExample:
      'Exemplo: se o corpo mental estiver alto e o emocional estiver baixo, voce pode estar conseguindo executar tarefas, mas com desgaste interno acumulado.',
  },
  {
    title: 'BANCO DE ENERGIA',
    shortDescription: 'Registre como sua energia circulou no periodo avaliado.',
    modalIntro:
      'O Banco de Energia funciona como uma fotografia do periodo escolhido. Ele ajuda a separar o que abastece sua vida do que consome sua energia de forma recorrente.',
    whatToEvaluate: 'Qual o periodo que esta avaliando?',
    usageExplanation: [
      'Defina primeiro o periodo de referencia antes de preencher depositos e retiradas.',
      'Registre o que aumentou sua energia e o que consumiu sua energia nesse intervalo.',
      'Use este bloco como fotografia do periodo, nao como media geral da vida.',
    ],
    evaluationPrompt: 'Pergunta de avaliacao: neste periodo, o que abasteceu e o que drenou minha energia?',
    interpretationText:
      'Quando as retiradas pesam mais que os depositos, isso revela sobrecarga, desgaste ou um ritmo pouco sustentavel. O valor do exercicio esta em enxergar esse padrao com objetividade.',
    practicalExample:
      'Exemplo: excesso de demandas, barulho e interacoes longas podem entrar como retiradas; descanso, previsibilidade e pausas reais podem aparecer como depositos.',
    reminders: [
      'Dúvidas sobre como fazer seu BE? Veja tutorial (link).',
      'A explicacao completa do Banco de Energia tambem sera apresentada na etapa de tutorial na HM que acompanha o material escrito.',
    ],
  },
  {
    title: 'ESTRATEGIAS APLICADAS',
    shortDescription: 'Avalie o quanto as estrategias estao sendo usadas no seu gerenciamento de vida.',
    modalIntro:
      'Aqui o foco e presenca pratica, nao intencao. A proposta e medir o quanto as estrategias realmente aparecem no seu cotidiano e ajudam no gerenciamento da vida.',
    whatToEvaluate: 'Em uma escala de 1 a 10, avalie o quanto esta fazendo uso das estrategias para elevar suas habilidades de gerenciamento da vida.',
    usageExplanation: [
      'Use a escala de 1 a 10 para indicar intensidade de uso das estrategias que voce conhece e aplica.',
      'Para estrategias que ainda nao conhece ou nao utiliza, mantenha nota 0.',
      'Aqui, o zero representa estrategia ausente na avaliacao, nao uma estrategia com desempenho ruim.',
      'Se a estrategia nao fizer sentido para seus tracos e desafios, mantenha zero.',
    ],
    evaluationPrompt: 'Pergunta de avaliacao: quanto essa estrategia esta presente no meu dia a dia de forma util e aplicavel?',
    interpretationText:
      'Pontuacoes altas mostram estrategias ja incorporadas. Pontuacoes baixas nao significam fracasso; elas mostram onde ainda existe espaco para treino, adaptacao ou priorizacao.',
    practicalExample:
      'Exemplo: voce pode conhecer uma estrategia como START, mas se quase nunca a utiliza na pratica, a nota precisa refletir essa ausencia para o mapa ficar honesto.',
  },
  {
    title: 'TRACOS NEURODIVERGENTES',
    shortDescription: 'Mapeie a intensidade com que cada traco aparece no seu perfil autista.',
    modalIntro:
      'Nesta leitura, o importante e reconhecer intensidade e impacto, e nao rotular o traco como bom ou ruim. O mapa ajuda a compreender o funcionamento com mais precisao.',
    whatToEvaluate: 'Analise, em escala de 1 a 10, o quanto esses tracos estao presentes no seu perfil autista.',
    usageExplanation: [
      'Quanto mais intenso o traco, maior deve ser o numero selecionado.',
      'Se voce nao tiver determinado traco no seu sistema, mantenha nota 0.',
      'O zero indica ausencia do traco, e nao intensidade minima.',
    ],
    evaluationPrompt: 'Pergunta de avaliacao: com que intensidade esse traco aparece no meu funcionamento?',
    interpretationText:
      'Tracos mais intensos costumam exigir mais estrategia, mais ajuste ambiental e mais previsibilidade. O objetivo aqui e orientar cuidado, e nao fazer julgamento.',
    practicalExample:
      'Exemplo: um hiperfoco muito alto pode ser um recurso para determinadas tarefas, mas tambem pode dificultar pausas, transicoes e mudancas de contexto.',
  },
];

const guideIcons = [Sparkles, BatteryCharging, Layers3, Brain];
const evaluationNote =
  'A nossa roda da vida e uma fotografia mensal da sua energia nas areas importantes da sua vida e voce preenche uma vez por mes. Transforme isso em objetivos possiveis e revisite depois para acompanhar a sua evolucao. Ela nao existe para te provar que esta falhando, mas para te mostrar onde faz sentido colocar atencao e cuidado primeiro. Avalie cada campo numa escala de 0 a 10.';

export function WheelOfLife() {
  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [selectedGuideTitle, setSelectedGuideTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGuideTitle) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedGuideTitle(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedGuideTitle]);

  const size = 900;
  const center = size / 2;
  const innerRadius = 60;
  const maxRadius = 310;
  const outerRingWidth = 40;
  const levels = 10;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const startInner = polarToCartesian(endAngle, innerR);
    const endInner = polarToCartesian(startAngle, innerR);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${start.x} ${start.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ');
  };

  const getTextPathId = (index: number) => `textPath-${index}`;

  const getValue = (sectionIndex: number, topicIndex: number): number => {
    const key = `${sectionIndex}-${topicIndex}`;
    return values[key] || 0;
  };

  const setValue = (sectionIndex: number, topicIndex: number, value: number) => {
    const key = `${sectionIndex}-${topicIndex}`;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const downloadPDF = () => {
    const svgElement = document.querySelector('#wheel-of-life svg') as SVGElement;
    if (!svgElement) return;

    const svgClone = svgElement.cloneNode(true) as SVGElement;
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const imgWidth = 140;
        const imgHeight = 140;
        const x = (pageWidth - imgWidth) / 2;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        let currentY = y + imgHeight + 10;
        const leftMargin = 10;
        const columnWidth = (pageWidth - 2 * leftMargin) / 2;
        const barHeight = 3;
        const barWidth = 50;

        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
        };

        sections.forEach((section, sectionIndex) => {
          const column = sectionIndex % 2;
          const xPos = leftMargin + column * columnWidth;

          if (sectionIndex === 2) {
            pdf.addPage();
            currentY = 15;
          }

          const yPos = currentY;
          const rgb = hexToRgb(section.color);
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          pdf.rect(xPos, yPos, columnWidth - 5, 2, 'F');

          pdf.setFontSize(8);
          pdf.setTextColor(rgb.r, rgb.g, rgb.b);
          pdf.setFont('helvetica', 'bold');
          pdf.text(section.title, xPos + 2, yPos + 6);

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);

          section.topics.forEach((topic, topicIndex) => {
            const value = getValue(sectionIndex, topicIndex);
            const topicY = yPos + 11 + topicIndex * 7;

            pdf.setFontSize(7);
            pdf.text(topic.name, xPos + 2, topicY);

            pdf.setFontSize(7);
            pdf.setTextColor(100, 116, 139);
            pdf.text(`${value}`, xPos + columnWidth - 10, topicY);

            pdf.setFillColor(229, 231, 235);
            pdf.rect(xPos + 2, topicY + 1, barWidth, barHeight, 'F');

            if (value > 0) {
              pdf.setFillColor(rgb.r, rgb.g, rgb.b);
              const fillWidth = (barWidth * value) / 10;
              pdf.rect(xPos + 2, topicY + 1, fillWidth, barHeight, 'F');
            }

            pdf.setTextColor(51, 65, 85);
          });

          if (column === 1) {
            const maxTopics = Math.max(sections[sectionIndex - 1]?.topics.length || 0, section.topics.length);
            currentY += 11 + maxTopics * 7 + 5;
          }
        });

        pdf.save('roda-da-vida.pdf');
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const resetValues = () => {
    setValues({});
  };

  return (
    <Tabs defaultValue="avaliacao" className="w-full">
      <div className="mb-6 flex justify-center">
        <TabsList className="h-auto rounded-2xl bg-white/80 p-1 shadow-lg backdrop-blur">
          <TabsTrigger value="avaliacao" className="rounded-xl px-4 py-2">
            Roda de Avaliacao
          </TabsTrigger>
          <TabsTrigger value="guia" className="rounded-xl px-4 py-2">
            Guia das Metodologias
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="avaliacao">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-6xl rounded-xl border-t-4 bg-white p-6 shadow-lg" style={{ borderColor: '#DC2626' }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600">
                Nota
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Preenchimento mensal</span>
            </div>
            <p className="max-w-5xl text-sm leading-7 text-slate-700">{evaluationNote}</p>
          </div>

          <div id="wheel-of-life" className="overflow-x-auto rounded-2xl bg-white p-6 shadow-2xl md:p-12">
            <svg width={size} height={size}>
              <defs>
                {sections.map((section, index) => {
                  const startAngle = index * 90;
                  const endAngle = (index + 1) * 90;
                  const midRadius = maxRadius + outerRingWidth / 2;
                  const start = polarToCartesian(startAngle, midRadius);
                  const end = polarToCartesian(endAngle, midRadius);

                  return (
                    <path
                      key={getTextPathId(index)}
                      id={getTextPathId(index)}
                      d={`M ${start.x} ${start.y} A ${midRadius} ${midRadius} 0 0 1 ${end.x} ${end.y}`}
                      fill="none"
                    />
                  );
                })}
              </defs>

              {Array.from({ length: levels + 1 }, (_, i) => {
                const radius = innerRadius + ((maxRadius - innerRadius) / levels) * i;
                return (
                  <circle
                    key={`circle-${i}`}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="0.5"
                  />
                );
              })}

              {sections.map((section, sectionIndex) => {
                const sectionAngleStart = sectionIndex * 90;
                const anglePerTopic = 90 / section.topics.length;

                return section.topics.map((topic, topicIndex) => {
                  const angle = sectionAngleStart + topicIndex * anglePerTopic;
                  const innerPoint = polarToCartesian(angle, innerRadius);
                  const outerPoint = polarToCartesian(angle, maxRadius);

                  return (
                    <line
                      key={`radial-${sectionIndex}-${topicIndex}`}
                      x1={innerPoint.x}
                      y1={innerPoint.y}
                      x2={outerPoint.x}
                      y2={outerPoint.y}
                      stroke="#d1d5db"
                      strokeWidth="0.5"
                    />
                  );
                });
              })}

              {sections.map((section, index) => {
                const startAngle = index * 90;
                const endAngle = (index + 1) * 90;

                return (
                  <path
                    key={`outer-ring-${index}`}
                    d={createArc(startAngle, endAngle, maxRadius, maxRadius + outerRingWidth)}
                    fill={section.color}
                  />
                );
              })}

              {sections.map((section, index) => (
                <text
                  key={`text-${index}`}
                  fill="white"
                  className="text-xs"
                  style={{ fontWeight: 700, letterSpacing: '0.05em' }}
                >
                  <textPath href={`#${getTextPathId(index)}`} startOffset="50%" textAnchor="middle">
                    {section.title}
                  </textPath>
                </text>
              ))}

              {sections.map((section, sectionIndex) => {
                const sectionAngleStart = sectionIndex * 90;
                const anglePerTopic = 90 / section.topics.length;

                return section.topics.map((topic, topicIndex) => {
                  const value = getValue(sectionIndex, topicIndex);
                  if (value === 0) return null;

                  const startAngle = sectionAngleStart + topicIndex * anglePerTopic;
                  const endAngle = sectionAngleStart + (topicIndex + 1) * anglePerTopic;
                  const valueRadius = innerRadius + ((maxRadius - innerRadius) / levels) * value;

                  const start = polarToCartesian(startAngle, valueRadius);
                  const end = polarToCartesian(endAngle, valueRadius);
                  const innerStart = polarToCartesian(startAngle, innerRadius);
                  const innerEnd = polarToCartesian(endAngle, innerRadius);

                  const path = [
                    `M ${innerStart.x} ${innerStart.y}`,
                    `L ${start.x} ${start.y}`,
                    `A ${valueRadius} ${valueRadius} 0 0 1 ${end.x} ${end.y}`,
                    `L ${innerEnd.x} ${innerEnd.y}`,
                    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
                    'Z',
                  ].join(' ');

                  return (
                    <path
                      key={`fill-${sectionIndex}-${topicIndex}`}
                      d={path}
                      fill={section.color}
                      fillOpacity="0.4"
                      stroke={section.color}
                      strokeWidth="1"
                    />
                  );
                });
              })}
            </svg>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="rounded-xl border-t-4 bg-white p-6 shadow-lg"
                style={{ borderColor: section.color }}
              >
                <h3 className="mb-4 text-sm uppercase tracking-wide" style={{ color: section.color }}>
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.topics.map((topic, topicIndex) => {
                    const value = getValue(sectionIndex, topicIndex);
                    const key = `${sectionIndex}-${topicIndex}`;
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label htmlFor={key} className="cursor-pointer text-xs text-slate-700">
                            {topic.name}
                          </label>
                          <span className="min-w-[2rem] text-right text-xs font-semibold text-slate-500">
                            {value}
                          </span>
                        </div>
                        <input
                          id={key}
                          type="range"
                          min="0"
                          max="10"
                          value={value}
                          onChange={(e) => setValue(sectionIndex, topicIndex, parseInt(e.target.value, 10))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg"
                          style={{
                            background: `linear-gradient(to right, ${section.color} 0%, ${section.color} ${
                              value * 10
                            }%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 rounded-lg bg-slate-500 px-4 py-2 text-white transition-colors hover:bg-slate-600"
              onClick={resetValues}
            >
              <RotateCcw size={16} />
              Resetar
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              onClick={downloadPDF}
            >
              <Download size={16} />
              Baixar PDF
            </button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="guia">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.97),rgba(241,245,249,0.92))] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.11)] md:p-8">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/90 to-transparent" />
            <div className="absolute -left-14 top-8 h-36 w-36 rounded-full bg-sky-100/80 blur-3xl" />
            <div className="absolute right-0 top-12 h-44 w-44 rounded-full bg-amber-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative mb-8 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-[0_12px_26px_rgba(15,23,42,0.07)]">
                <BookOpen size={15} />
                Guia de metodologia
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-semibold tracking-[-0.035em] text-slate-900 md:text-3xl">
                Abra cada metodologia em um modal claro, elegante e responsivo.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Os cards funcionam apenas como acesso visual. O texto explicativo completo fica dentro do modal.
              </p>
            </div>

            <div className="relative grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {methodologyGuides.map((guide) => {
                const section = sections.find((item) => item.title === guide.title);
                const accentColor = section?.color ?? '#334155';
                const Icon = guideIcons[sections.findIndex((item) => item.title === guide.title)] ?? BookOpen;
                const isOpen = selectedGuideTitle === guide.title;

                return (
                  <div key={guide.title} className="space-y-4">
                    <button
                      type="button"
                      className="group relative h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                      onClick={() => setSelectedGuideTitle((prev) => (prev === guide.title ? null : guide.title))}
                    >
                      <div
                        className="h-full rounded-xl border-t-4 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="text-sm uppercase tracking-wide" style={{ color: accentColor }}>
                            {guide.title}
                          </div>
                          <div style={{ color: accentColor }}>
                            <Icon size={18} />
                          </div>
                        </div>

                        <p className="mb-4 text-sm leading-6 text-slate-600">{guide.shortDescription}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500">{section?.topics.length ?? 0} topicos</span>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                            {isOpen ? 'Fechar' : 'Abrir'}
                            <ArrowRight
                              size={16}
                              className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                            />
                          </span>
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="overflow-hidden rounded-xl border-t-4 bg-white shadow-lg" style={{ borderColor: accentColor }}>
                        <div
                          className="relative overflow-hidden p-6 text-white"
                          style={{
                            background: `linear-gradient(145deg, ${accentColor}, #0f172a)`,
                          }}
                        >
                          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                          <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-black/25 blur-2xl" />
                          <button
                            type="button"
                            aria-label="Fechar painel"
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white transition-colors hover:bg-black/35"
                            onClick={() => setSelectedGuideTitle(null)}
                          >
                            <X size={14} />
                          </button>
                          <div className="pr-10">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Guia completo</p>
                            <h3 className="mt-2 text-lg font-semibold uppercase">{guide.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-white/90">{guide.shortDescription}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                                {section?.topics.length ?? 0} topicos
                              </span>
                              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                                Leitura guiada
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-4 md:p-5">
                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Introducao</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.modalIntro}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Como usar</p>
                            <div className="mt-3 space-y-3">
                              {guide.usageExplanation.map((item, index) => (
                                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: accentColor }}>
                                    Passo {index + 1}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-slate-700">{item}</p>
                                </div>
                              ))}
                            </div>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">O que avaliar</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.whatToEvaluate}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pergunta de avaliacao</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.evaluationPrompt}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Como interpretar</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.interpretationText}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Exemplo pratico</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.practicalExample}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Topicos avaliados</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {section?.topics.map((topic) => (
                                <span
                                  key={topic.name}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                >
                                  {topic.name}
                                </span>
                              ))}
                            </div>
                          </section>

                          {guide.reminders && (
                            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Lembretes</p>
                              <div className="mt-3 space-y-2">
                                {guide.reminders.map((reminder) => (
                                  <p key={reminder} className="text-sm leading-6 text-amber-900">
                                    {reminder}
                                  </p>
                                ))}
                              </div>
                            </section>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
