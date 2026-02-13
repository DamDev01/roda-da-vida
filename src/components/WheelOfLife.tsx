import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';

interface Topic {
  name: string;
}

interface Section {
  title: string;
  topics: Topic[];
  color: string;
}

const sections: Section[] = [
  {
    title: "METODOLOGIA DOS 5 CORPOS",
    topics: [
      { name: "Corpo Físico" },
      { name: "Corpo Mental" },
      { name: "Corpo Emocional" },
      { name: "Corpo Espiritual" },
      { name: "Corpo Autêntico" }
    ],
    color: "#1E40AF"
  },
  {
    title: "BANCO DE ENERGIA",
    topics: [
      { name: "Depósitos" },
      { name: "Retiradas" }
    ],
    color: "#F59E0B"
  },
  {
    title: "ESTRATÉGIAS APLICADAS",
    topics: [
      { name: "Comando Mental" },
      { name: "Comando do Tempo" },
      { name: "Fechamento de Ciclo" },
      { name: "START" },
      { name: "SKANER" },
      { name: "Presença" },
      { name: "Armadura de Cristal" }
    ],
    color: "#10B981"
  },
  {
    title: "TRAÇOS NEURODIVERGENTES",
    topics: [
      { name: "Masking (Mascaramento)" },
      { name: "Inércia Autista" },
      { name: "Hiperfoco" },
      { name: "Ruminação" },
      { name: "Hiperempatia" },
      { name: "Ímã de Energia" },
      { name: "Transtornos Sensoriais" }
    ],
    color: "#EC4899"
  }
];

export function WheelOfLife() {
  const [values, setValues] = useState<{[key: string]: number}>({});
  
  const size = 900;
  const center = size / 2;
  const innerRadius = 60;
  const maxRadius = 310; // Reduzido de 320 para 310 para dar espaço ao número 10
  const outerRingWidth = 40;
  const levels = 10;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const startInner = polarToCartesian(endAngle, innerR);
    const endInner = polarToCartesian(startAngle, innerR);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      `M ${start.x} ${start.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      `Z`
    ].join(' ');
  };

  const getTextPathId = (index: number) => `textPath-${index}`;

  const getValue = (sectionIndex: number, topicIndex: number): number => {
    const key = `${sectionIndex}-${topicIndex}`;
    return values[key] || 0;
  };

  const setValue = (sectionIndex: number, topicIndex: number, value: number) => {
    const key = `${sectionIndex}-${topicIndex}`;
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // Calcular total de tópicos para distribuição uniforme
  const totalTopics = sections.reduce((sum, section) => sum + section.topics.length, 0);
  
  // Criar array de todos os tópicos com ângulos
  let currentAngle = 0;
  const allTopics: Array<{
    sectionIndex: number;
    topicIndex: number;
    topic: Topic;
    angle: number;
    color: string;
    sectionTitle: string;
  }> = [];

  sections.forEach((section, sectionIndex) => {
    const sectionAngleStart = sectionIndex * 90;
    const anglePerTopic = 90 / section.topics.length;
    
    section.topics.forEach((topic, topicIndex) => {
      const angle = sectionAngleStart + topicIndex * anglePerTopic + anglePerTopic / 2;
      allTopics.push({
        sectionIndex,
        topicIndex,
        topic,
        angle,
        color: section.color,
        sectionTitle: section.title
      });
    });
  });

  const downloadPDF = () => {
    const svgElement = document.querySelector('#wheel-of-life svg') as SVGElement;
    if (!svgElement) return;

    // Clonar o SVG para não afetar o original
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Serializar o SVG
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Criar uma imagem a partir do SVG
    const img = new Image();
    img.onload = () => {
      // Criar um canvas para converter SVG em PNG
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Preencher fundo branco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar a imagem SVG
        ctx.drawImage(img, 0, 0);
        
        // Converter para PNG
        const imgData = canvas.toDataURL('image/png');
        
        // Criar PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const imgWidth = 140;
        const imgHeight = 140;
        const x = (pageWidth - imgWidth) / 2;
        const y = 10;
        
        // Adicionar a roda
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        // Posição inicial para os controles
        let currentY = y + imgHeight + 10;
        const leftMargin = 10;
        const columnWidth = (pageWidth - 2 * leftMargin) / 2;
        const barHeight = 3;
        const barWidth = 50;
        
        // Função para converter hex to RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };
        
        // Adicionar controles de cada seção
        sections.forEach((section, sectionIndex) => {
          const column = sectionIndex % 2;
          const xPos = leftMargin + column * columnWidth;
          
          if (sectionIndex === 2) {
            // Nova página após 2 seções
            pdf.addPage();
            currentY = 15;
          }
          
          const yPos = sectionIndex < 2 ? currentY : currentY;
          
          // Borda colorida no topo
          const rgb = hexToRgb(section.color);
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          pdf.rect(xPos, yPos, columnWidth - 5, 2, 'F');
          
          // Título da seção
          pdf.setFontSize(8);
          pdf.setTextColor(rgb.r, rgb.g, rgb.b);
          pdf.setFont('helvetica', 'bold');
          pdf.text(section.title, xPos + 2, yPos + 6);
          
          // Tópicos com barras
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          
          section.topics.forEach((topic, topicIndex) => {
            const value = getValue(sectionIndex, topicIndex);
            const topicY = yPos + 11 + topicIndex * 7;
            
            // Nome do tópico
            pdf.setFontSize(7);
            pdf.text(topic.name, xPos + 2, topicY);
            
            // Valor
            pdf.setFontSize(7);
            pdf.setTextColor(100, 116, 139);
            pdf.text(`${value}`, xPos + columnWidth - 10, topicY);
            
            // Barra de fundo (cinza)
            pdf.setFillColor(229, 231, 235);
            pdf.rect(xPos + 2, topicY + 1, barWidth, barHeight, 'F');
            
            // Barra de progresso (colorida)
            if (value > 0) {
              pdf.setFillColor(rgb.r, rgb.g, rgb.b);
              const fillWidth = (barWidth * value) / 10;
              pdf.rect(xPos + 2, topicY + 1, fillWidth, barHeight, 'F');
            }
            
            pdf.setTextColor(51, 65, 85);
          });
          
          // Ajustar altura para próxima seção
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
    <div className="flex flex-col items-center gap-8">
      <div id="wheel-of-life" className="bg-white rounded-2xl shadow-2xl p-12">
        <svg width={size} height={size}>
          <defs>
            {/* Definir paths para texto curvado */}
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

          {/* Círculos concêntricos */}
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

          {/* Linhas radiais para cada tópico */}
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

          {/* Anéis externos coloridos */}
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

          {/* Texto curvado nas bordas externas */}
          {sections.map((section, index) => (
            <text key={`text-${index}`} fill="white" className="text-xs" style={{ fontWeight: 700, letterSpacing: '0.05em' }}>
              <textPath href={`#${getTextPathId(index)}`} startOffset="50%" textAnchor="middle">
                {section.title}
              </textPath>
            </text>
          ))}

          {/* Áreas preenchidas com valores */}
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
              const largeArcFlag = "0";
              
              const path = [
                `M ${innerStart.x} ${innerStart.y}`,
                `L ${start.x} ${start.y}`,
                `A ${valueRadius} ${valueRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                `L ${innerEnd.x} ${innerEnd.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
                `Z`
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

      {/* Controles interativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderColor: section.color }}
          >
            <h3
              className="mb-4 text-sm uppercase tracking-wide"
              style={{ color: section.color }}
            >
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.topics.map((topic, topicIndex) => {
                const value = getValue(sectionIndex, topicIndex);
                const key = `${sectionIndex}-${topicIndex}`;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={key}
                        className="text-xs text-slate-700 cursor-pointer"
                      >
                        {topic.name}
                      </label>
                      <span className="text-xs text-slate-500 min-w-[2rem] text-right" style={{ fontWeight: 600 }}>
                        {value}
                      </span>
                    </div>
                    <input
                      id={key}
                      type="range"
                      min="0"
                      max="10"
                      value={value}
                      onChange={(e) => setValue(sectionIndex, topicIndex, parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${section.color} 0%, ${section.color} ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={resetValues}
        >
          <RotateCcw size={16} />
          Resetar
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={downloadPDF}
        >
          <Download size={16} />
          Baixar PDF
        </button>
      </div>
    </div>
  );
}