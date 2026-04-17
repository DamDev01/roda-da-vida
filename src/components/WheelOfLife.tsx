import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BatteryCharging,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Layers3,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import jsPDF from 'jspdf';

import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Topic {
  name: string;
  wheelLabel?: string;
}

interface Section {
  id: string;
  title: string;
  topics: Topic[];
  color: string;
  cardNumber: number;
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
    id: 'metodologia-5-corpos',
    title: 'METODOLOGIA DOS 5 CORPOS',
    topics: [
      { name: 'Corpo Físico (CF)', wheelLabel: 'CF' },
      { name: 'Corpo Mental (CM)', wheelLabel: 'CM' },
      { name: 'Corpo Emocional (CE)', wheelLabel: 'CE' },
      { name: 'Corpo Espiritual (CESP)', wheelLabel: 'CESP' },
      { name: 'Corpo Autêntico (CA)', wheelLabel: 'CA' },
    ],
    color: '#1E40AF',
    cardNumber: 1,
  },
  {
    id: 'banco-de-energia',
    title: 'BANCO DE ENERGIA',
    topics: [
      { name: 'Depósitos', wheelLabel: 'Depósitos' },
      { name: 'Retiradas', wheelLabel: 'Retiradas' },
    ],
    color: '#F59E0B',
    cardNumber: 2,
  },
  {
    id: 'estrategias-aplicadas',
    title: 'ESTRATÉGIAS APLICADAS',
    topics: [
      { name: 'Comando Mental (CM)', wheelLabel: 'CM' },
      { name: 'Comando do Tempo (CT)', wheelLabel: 'CT' },
      { name: 'Fechamento de Ciclo (FC)', wheelLabel: 'FC' },
      { name: 'START (STA)', wheelLabel: 'STA' },
      { name: 'SKANER (SKA)', wheelLabel: 'SKA' },
      { name: 'Presença (PRE)', wheelLabel: 'PRE' },
      { name: 'Armadura de Cristal (ACR)', wheelLabel: 'ACR' },
      { name: 'Independência Emocional (INDE)', wheelLabel: 'INDE' },
      { name: '+Autenticidade - Ansiedade (AUT)', wheelLabel: 'AUT' },
      { name: 'Estratégia da Ponte - Saber falar e ouvir (PON)', wheelLabel: 'PON' },
    ],
    color: '#10B981',
    cardNumber: 3,
  },
  {
    id: 'tracos-neurodivergentes',
    title: 'TRAÇOS NEURODIVERGENTES',
    topics: [
      { name: 'Masking (Mascaramento) (MASK)', wheelLabel: 'MASK' },
      { name: 'Inércia Autista (IAU)', wheelLabel: 'IAU' },
      { name: 'Hiperfoco (HIPF)', wheelLabel: 'HIPF' },
      { name: 'Ruminação (RUM)', wheelLabel: 'RUM' },
      { name: 'Alexitimia (ALE)', wheelLabel: 'ALE' },
      { name: 'Hiperempatia (HEPT)', wheelLabel: 'HEPT' },
      { name: 'Ímã de Energia (IEN)', wheelLabel: 'IEN' },
      { name: 'Transtornos Sensoriais (TSEN)', wheelLabel: 'TSEN' },
    ],
    color: '#DC2626',
    cardNumber: 4,
  },
];

const wheelSectionOrder = [
  'metodologia-5-corpos',
  'banco-de-energia',
  'tracos-neurodivergentes',
  'estrategias-aplicadas',
];

const methodologyGuides: MethodologyGuide[] = [
  {
    title: 'METODOLOGIA DOS 5 CORPOS',
    shortDescription: 'Entenda o nível de energia disponível em cada corpo avaliado.',
    modalIntro:
      'Esta leitura mostra como sua energia está distribuída entre diferentes dimensões da sua vida. O objetivo não é responder bonito, e sim enxergar com clareza onde existe recurso, desgaste ou necessidade de cuidado.',
    whatToEvaluate: 'Qual é o meu nível de energia para cada um dos 5 corpos.',
    usageExplanation: [
      'Observe como você está no momento atual antes de marcar cada item.',
      'Considere o estado real de cada corpo, sem responder pelo que gostaria de sentir.',
      'Use a escala para representar com honestidade o nível de energia percebido.',
    ],
    evaluationPrompt:
      'Pergunta de avaliação para cada um dos 5 corpos: Numa escala de 1 a 10, como estou sentindo o nível de energia e bem estar em cada um dos 5 Corpos?',
    interpretationText:
      'Notas baixas indicam corpos que pedem mais recuperação, organização ou suporte. Notas mais altas mostram onde existe mais estabilidade e disponibilidade no momento.',
    practicalExample:
      'Exemplo: se o Corpo Mental estiver alto e o Corpo Emocional estiver baixo, você pode estar conseguindo executar tarefas, mas com desgaste interno acumulado.',
  },
  {
    title: 'BANCO DE ENERGIA',
    shortDescription: 'Registre como a sua energia circulou no período avaliado.',
    modalIntro:
      'O Banco de Energia funciona como uma fotografia do período escolhido. Ele ajuda a separar o que abastece sua vida do que consome sua energia de forma recorrente.',
    whatToEvaluate: 'O mês trabalhado com uma área da vida definida, a Trilha do mês.',
    usageExplanation: [
      'Defina primeiro o período de referência antes de preencher depósitos e retiradas.',
      'Registre o que aumentou sua energia e o que consumiu sua energia nesse intervalo.',
      'Use este bloco como fotografia do período, não como média geral da vida.',
    ],
    evaluationPrompt:
      'Pergunta de avaliação: Numa escala de 1 a 10, o quanto me dediquei em abastecer com depósitos de energia? O quanto ainda sinto minha e energia drenada?',
    interpretationText:
      'Quando as retiradas pesam mais que os depósitos, isso revela sobrecarga, desgaste ou um ritmo pouco sustentável. O valor do exercício está em enxergar esse padrão com objetividade.',
    practicalExample:
      'Exemplo: excesso de demandas, barulho e interações longas podem entrar como retiradas; descanso, previsibilidade e pausas reais podem aparecer como depósitos.',
    reminders: [
      'Dúvidas sobre como fazer seu Banco de Energia Diário? Veja o tutorial (link).',
    ],
  },
  {
    title: 'ESTRATÉGIAS APLICADAS',
    shortDescription: 'Avalie o quanto as estratégias estão sendo usadas no seu gerenciamento de vida.',
    modalIntro:
      'Aqui o foco é presença prática, não intenção. A proposta é medir o quanto as estratégias realmente aparecem no seu cotidiano e ajudam no gerenciamento da vida.',
    whatToEvaluate: 'Em uma escala de 1 a 10, avalie o quanto está fazendo uso das estratégias para elevar suas habilidades de gerenciamento da vida.',
    usageExplanation: [
      'Use a escala de 1 a 10 para indicar a intensidade de uso das estratégias que você conhece e aplica.',
      'Para estratégias que ainda não conhece ou não utiliza, mantenha nota 0.',
      'Aqui, o zero representa estratégia ausente na avaliação, não uma estratégia com desempenho ruim.',
      'Se a estratégia não fizer sentido para seus traços e desafios, mantenha zero.',
    ],
    evaluationPrompt: 'Pergunta de avaliação: o quanto essa estratégia está presente no meu dia a dia de forma útil e aplicável?',
    interpretationText:
      'Pontuações altas mostram estratégias já incorporadas. Pontuações baixas não significam fracasso; elas mostram onde ainda existe espaço para treino, adaptação ou priorização.',
    practicalExample:
      'Exemplo: você pode conhecer uma estratégia como START, mas, se quase nunca a utiliza na prática, a nota precisa refletir essa ausência para o mapa ficar honesto.',
  },
  {
    title: 'TRAÇOS NEURODIVERGENTES',
    shortDescription: 'Mapeie a intensidade com que cada traço aparece no seu perfil autista.',
    modalIntro:
      'Nesta leitura, o importante é reconhecer intensidade e impacto, e não rotular o traço como bom ou ruim. O mapa ajuda a compreender o funcionamento com mais precisão.',
    whatToEvaluate: 'Analise, em escala de 1 a 10, o quanto esses traços estão presentes no seu perfil autista.',
    usageExplanation: [
      'Quanto mais intenso o traço, maior deve ser o número selecionado.',
      'Se você não tiver determinado traço no seu sistema, mantenha nota 0.',
      'O zero indica ausência do traço, e não intensidade mínima.',
    ],
    evaluationPrompt: 'Pergunta de avaliação: com que intensidade esse traço aparece no meu funcionamento?',
    interpretationText:
      'Traços mais intensos costumam exigir mais estratégia, mais ajuste ambiental e mais previsibilidade. O objetivo aqui é orientar o cuidado, e não fazer julgamento.',
    practicalExample:
      'Exemplo: um hiperfoco muito alto pode ser um recurso para determinadas tarefas, mas também pode dificultar pausas, transições e mudanças de contexto.',
  },
];

const guideIcons = [Sparkles, BatteryCharging, Layers3, Brain];
const evaluationNote =
  'A nossa Roda da Vida é uma fotografia mensal da sua energia nas áreas importantes da sua vida, e você a preenche uma vez por mês. Transforme isso em objetivos possíveis e revisite depois para acompanhar a sua evolução. Ela não existe para provar que você está falhando, mas para mostrar onde faz sentido colocar atenção e cuidado primeiro. Avalie cada campo numa escala de 0 a 10.';
const insignificantWords = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
const trackOptions = [
  'Trilha da Energia',
  'Trilha do Sensorial',
  'Trilha do Trabalho',
  'Trilha da Casa e Família',
  'Trilha do Autocuidado',
  'Trilha da Gestão Financeira',
  'Trilha da Comunicação',
  'Trilha da Preservação da Bioenergia',
];
export function WheelOfLife() {
  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [selectedGuideTitle, setSelectedGuideTitle] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isTrackSelectorOpen, setIsTrackSelectorOpen] = useState(false);

  const wheelSections = wheelSectionOrder
    .map((sectionId) => sections.find((section) => section.id === sectionId))
    .filter((section): section is Section => Boolean(section));
  const sectionById = Object.fromEntries(sections.map((section) => [section.id, section]));

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

  useEffect(() => {
    if (!isTrackSelectorOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTrackSelectorOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isTrackSelectorOpen]);

  const size = 900;
  const center = size / 2;
  const innerRadius = 60;
  const scoreMaxRadius = 278;
  const topicBandOuterRadius = 310;
  const outerRingWidth = 40;
  const levels = 10;
  const topicLabelRadius = (scoreMaxRadius + topicBandOuterRadius) / 2;

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

  const getSectionStartAngle = (sectionIndex: number) => ((sectionIndex + 3) % 4) * 90;
  const getSectionEndAngle = (sectionIndex: number) => getSectionStartAngle(sectionIndex) + 90;

  const getTextPathId = (index: number) => `textPath-${index}`;
  const getTopicTextPathId = (sectionIndex: number, topicIndex: number) => `topicTextPath-${sectionIndex}-${topicIndex}`;

  const getTopicLabel = (topic: Topic) => {
    if (topic.wheelLabel) return topic.wheelLabel;

    const topicName = topic.name;
    const sanitizedWords = topicName
      .replace(/[()]/g, ' ')
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0)
      .filter((word) => !insignificantWords.has(word.toLowerCase()));

    if (sanitizedWords.length === 0) return '';

    const abbreviateWord = (word: string) => word.slice(0, Math.min(word.length, 3)).toUpperCase();

    if (sanitizedWords.length === 1) {
      return abbreviateWord(sanitizedWords[0]);
    }

    return `${sanitizedWords[0][0]?.toUpperCase() ?? ''}. ${abbreviateWord(sanitizedWords[1])}`;
  };

  const formatDateLabel = (value: string) => {
    if (!value) return 'Não informada';

    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
  };

  const lightenColor = (hex: string, amount: number) => {
    const normalizedHex = hex.replace('#', '');
    const safeAmount = Math.min(Math.max(amount, 0), 1);
    const channels = normalizedHex.match(/.{1,2}/g);

    if (!channels || channels.length !== 3) return hex;

    const [r, g, b] = channels.map((channel) => parseInt(channel, 16));
    const lighten = (value: number) => Math.round(value + (255 - value) * safeAmount);

    return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
  };

  const getValue = (sectionId: string, topicIndex: number): number => {
    const key = `${sectionId}-${topicIndex}`;
    return values[key] || 0;
  };

  const setValue = (sectionId: string, topicIndex: number, value: number) => {
    const key = `${sectionId}-${topicIndex}`;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTrackSelection = (track: string) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((item) => item !== track) : [...prev, track],
    );
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
        const leftMargin = 10;
        const contentWidth = pageWidth - 2 * leftMargin;
        const imgWidth = 132;
        const imgHeight = 132;
        const x = (pageWidth - imgWidth) / 2;
        const pageHeight = 297;
        const bottomMargin = 12;
        let currentY = 14;
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

        const ensureSpace = (neededHeight: number) => {
          if (currentY + neededHeight <= pageHeight - bottomMargin) return;
          pdf.addPage();
          currentY = 15;
        };

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text('Roda da Vida Personalizada', pageWidth / 2, currentY, { align: 'center' });
        currentY += 7;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(`Data: ${formatDateLabel(selectedDate)}`, leftMargin, currentY);
        currentY += 5;

        const selectedTracksText = selectedTracks.length ? selectedTracks.join(' | ') : 'Nenhuma trilha selecionada';
        const trackLines = pdf.splitTextToSize(`Trilhas selecionadas: ${selectedTracksText}`, contentWidth);
        pdf.text(trackLines, leftMargin, currentY);
        currentY += trackLines.length * 4 + 3;

        pdf.addImage(imgData, 'PNG', x, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 8;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(15, 23, 42);
        pdf.text('Resumo dos quadrantes', leftMargin, currentY);
        currentY += 6;

        sections.forEach((section) => {
          const estimatedHeight = 14 + section.topics.length * 7;
          ensureSpace(estimatedHeight);

          const rgb = hexToRgb(section.color);
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          pdf.rect(leftMargin, currentY, contentWidth, 2, 'F');

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(8);
          pdf.setTextColor(rgb.r, rgb.g, rgb.b);
          pdf.text(`${section.cardNumber}. ${section.title}`, leftMargin + 2, currentY + 6);

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);

          section.topics.forEach((topic, topicIndex) => {
            const value = getValue(section.id, topicIndex);
            const topicY = currentY + 11 + topicIndex * 7;

            pdf.setFontSize(7);
            pdf.text(topic.name, leftMargin + 2, topicY);

            pdf.setTextColor(100, 116, 139);
            pdf.text(`${value}`, leftMargin + contentWidth - 8, topicY);

            pdf.setFillColor(229, 231, 235);
            pdf.rect(leftMargin + 2, topicY + 1, barWidth, barHeight, 'F');

            if (value > 0) {
              pdf.setFillColor(rgb.r, rgb.g, rgb.b);
              const fillWidth = (barWidth * value) / 10;
              pdf.rect(leftMargin + 2, topicY + 1, fillWidth, barHeight, 'F');
            }

            pdf.setTextColor(51, 65, 85);
          });

          currentY += estimatedHeight + 3;
        });

        pdf.save('roda-da-vida.pdf');
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const resetValues = () => {
    setValues({});
    setSelectedDate('');
    setSelectedTracks([]);
    setIsTrackSelectorOpen(false);
  };

  return (
    <Tabs defaultValue="avaliacao" className="w-full">
      <div className="mb-6 flex justify-center">
        <TabsList className="h-auto rounded-2xl bg-white/80 p-1 shadow-lg backdrop-blur">
          <TabsTrigger value="avaliacao" className="rounded-xl px-4 py-2">
            Roda de Avaliação
          </TabsTrigger>
          <TabsTrigger value="guia" className="rounded-xl px-4 py-2">
            Guia das Metodologias
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="avaliacao">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-6xl rounded-[1.7rem] border border-slate-200/80 bg-[linear-gradient(155deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] p-5 shadow-[0_30px_70px_rgba(15,23,42,0.08)] md:p-6">
            <div className="grid gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-slate-700">
                  <CalendarDays size={16} />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Data da avaliação</p>
                </div>
                <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Use esse campo para registrar o mês ou o dia de referência desta fotografia da roda.
                </p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Trilhas selecionadas</p>
                    <p className="mt-1 text-sm text-slate-600">Escolha uma ou mais trilhas para acompanhar junto com a avaliação.</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    onClick={() => setIsTrackSelectorOpen((prev) => !prev)}
                  >
                    Caixa de seleção
                    <ChevronDown size={16} className={`transition-transform ${isTrackSelectorOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isTrackSelectorOpen && (
                  <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {trackOptions.map((track) => {
                      const checked = selectedTracks.includes(track);

                      return (
                        <label
                          key={track}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-200"
                        >
                          <span>{track}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-slate-700"
                            checked={checked}
                            onChange={() => toggleTrackSelection(track)}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTracks.length > 0 ? (
                    selectedTracks.map((track) => (
                      <span
                        key={track}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        <Check size={12} />
                        {track}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Nenhuma trilha selecionada.</span>
                  )}
                </div>
              </section>
            </div>
          </div>

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
                {wheelSections.map((section, index) => {
                  const startAngle = getSectionStartAngle(index);
                  const endAngle = getSectionEndAngle(index);
                  const midRadius = topicBandOuterRadius + outerRingWidth / 2;
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

                {wheelSections.map((section, sectionIndex) => {
                  const sectionAngleStart = getSectionStartAngle(sectionIndex);
                  const anglePerTopic = 90 / section.topics.length;

                  return section.topics.map((topic, topicIndex) => {
                    const startAngle = sectionAngleStart + topicIndex * anglePerTopic + 1.5;
                    const endAngle = sectionAngleStart + (topicIndex + 1) * anglePerTopic - 1.5;
                    const start = polarToCartesian(startAngle, topicLabelRadius);
                    const end = polarToCartesian(endAngle, topicLabelRadius);

                    return (
                      <path
                        key={getTopicTextPathId(sectionIndex, topicIndex)}
                        id={getTopicTextPathId(sectionIndex, topicIndex)}
                        d={`M ${start.x} ${start.y} A ${topicLabelRadius} ${topicLabelRadius} 0 0 1 ${end.x} ${end.y}`}
                        fill="none"
                      />
                    );
                  });
                })}
              </defs>

              {Array.from({ length: levels + 1 }, (_, i) => {
                const radius = innerRadius + ((scoreMaxRadius - innerRadius) / levels) * i;
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

              {wheelSections.map((section, sectionIndex) => {
                const sectionAngleStart = getSectionStartAngle(sectionIndex);
                const anglePerTopic = 90 / section.topics.length;

                return section.topics.map((topic, topicIndex) => {
                  const angle = sectionAngleStart + topicIndex * anglePerTopic;
                  const innerPoint = polarToCartesian(angle, innerRadius);
                  const outerPoint = polarToCartesian(angle, scoreMaxRadius);

                  return (
                    <line
                      key={`radial-${section.id}-${topic.name}`}
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

              {wheelSections.map((section, index) => {
                const startAngle = getSectionStartAngle(index);
                const endAngle = getSectionEndAngle(index);

                return (
                  <path
                    key={`outer-ring-${section.id}`}
                    d={createArc(startAngle, endAngle, topicBandOuterRadius, topicBandOuterRadius + outerRingWidth)}
                    fill={section.color}
                  />
                );
              })}

              {wheelSections.map((section, sectionIndex) => {
                const sectionAngleStart = getSectionStartAngle(sectionIndex);
                const anglePerTopic = 90 / section.topics.length;
                const topicBandFill = lightenColor(section.color, 0.72);

                return section.topics.map((topic, topicIndex) => {
                  const startAngle = sectionAngleStart + topicIndex * anglePerTopic;
                  const endAngle = sectionAngleStart + (topicIndex + 1) * anglePerTopic;

                  return (
                    <path
                      key={`topic-band-${section.id}-${topic.name}`}
                      d={createArc(startAngle, endAngle, scoreMaxRadius, topicBandOuterRadius)}
                      fill={topicBandFill}
                      stroke={section.color}
                      strokeOpacity="0.18"
                      strokeWidth="0.8"
                    />
                  );
                });
              })}

              {wheelSections.map((section, index) => (
                <text
                  key={`text-${section.id}`}
                  fill="white"
                  className="text-xs"
                  style={{ fontWeight: 700, letterSpacing: '0.05em' }}
                >
                  <textPath href={`#${getTextPathId(index)}`} startOffset="50%" textAnchor="middle">
                    {section.title}
                  </textPath>
                </text>
              ))}

              {wheelSections.map((section, sectionIndex) =>
                section.topics.map((topic, topicIndex) => (
                  <text
                    key={`topic-text-${section.id}-${topic.name}`}
                    fill={section.color}
                    className="text-[10px]"
                    style={{ fontWeight: 700, letterSpacing: '0.08em' }}
                  >
                    <textPath
                      href={`#${getTopicTextPathId(sectionIndex, topicIndex)}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {getTopicLabel(topic)}
                    </textPath>
                  </text>
                )),
              )}

              {wheelSections.map((section, sectionIndex) => {
                const sectionAngleStart = getSectionStartAngle(sectionIndex);
                const anglePerTopic = 90 / section.topics.length;

                return section.topics.map((topic, topicIndex) => {
                  const value = getValue(section.id, topicIndex);
                  if (value === 0) return null;

                  const startAngle = sectionAngleStart + topicIndex * anglePerTopic;
                  const endAngle = sectionAngleStart + (topicIndex + 1) * anglePerTopic;
                  const valueRadius = innerRadius + ((scoreMaxRadius - innerRadius) / levels) * value;

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
                      key={`fill-${section.id}-${topic.name}`}
                      d={path}
                      fill={section.color}
                      fillOpacity="0.4"
                      stroke={section.color}
                      strokeWidth="1"
                    />
                  );
                });
              })}

              {wheelSections.map((section, sectionIndex) => {
                const sectionAngleStart = getSectionStartAngle(sectionIndex);
                const anglePerTopic = 90 / section.topics.length;
                const levelSize = (scoreMaxRadius - innerRadius) / levels;

                return section.topics.map((topic, topicIndex) => {
                  const value = getValue(section.id, topicIndex);
                  if (value === 0) return null;

                  const middleAngle = sectionAngleStart + topicIndex * anglePerTopic + anglePerTopic / 2;
                  const valueLabels = Array.from({ length: value }, (_, index) => {
                    const currentLevel = index + 1;
                    const labelRadius = innerRadius + levelSize * Math.max(currentLevel - 0.45, 0.75);
                    const point = polarToCartesian(middleAngle, labelRadius);

                    return (
                      <text
                        key={`value-text-${section.id}-${topic.name}-${currentLevel}`}
                        x={point.x}
                        y={point.y}
                        fill={section.color}
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {currentLevel}
                      </text>
                    );
                  });

                  return <g key={`value-label-group-${section.id}-${topic.name}`}>{valueLabels}</g>;
                });
              })}
            </svg>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border-t-4 bg-white p-6 shadow-lg"
                style={{ borderColor: section.color }}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-sm uppercase tracking-wide" style={{ color: section.color }}>
                    {section.title}
                  </h3>
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold"
                    style={{
                      color: section.color,
                      borderColor: lightenColor(section.color, 0.38),
                      backgroundColor: lightenColor(section.color, 0.84),
                    }}
                  >
                    {section.cardNumber}
                  </span>
                </div>
                <div className="space-y-3">
                  {section.topics.map((topic, topicIndex) => {
                    const value = getValue(section.id, topicIndex);
                    const key = `${section.id}-${topicIndex}`;
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
                          onChange={(e) => setValue(section.id, topicIndex, parseInt(e.target.value, 10))}
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

                        <div className="mb-4 rounded-lg border p-4" style={{
                          borderColor: lightenColor(accentColor, 0.6),
                          backgroundColor: lightenColor(accentColor, 0.92),
                        }}>
                          <p className="text-sm leading-6 text-slate-700">{guide.shortDescription}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500">{section?.topics.length ?? 0} tópicos</span>
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
                                {section?.topics.length ?? 0} tópicos
                              </span>
                              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                                Leitura guiada
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-4 md:p-5">
                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Introdução</p>
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
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pergunta de avaliação</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.evaluationPrompt}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Como interpretar</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.interpretationText}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Exemplo prático</p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{guide.practicalExample}</p>
                          </section>

                          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tópicos avaliados</p>
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
