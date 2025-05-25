// 데스티니 매트릭스 시각화 클래스 (개선)
class MatrixVisualization {
    constructor() {
        this.svgNS = 'http://www.w3.org/2000/svg';
        this.matrixData = null;
        this.currentTooltip = null;
    }

    // 전체 매트릭스 차트 생성 (개선)
    generateFullMatrixChart(matrixData, containerId) {
        this.matrixData = matrixData;
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        if (!matrixData) {
            console.error('Matrix data is null or undefined');
            container.innerHTML = '<p class="text-red-400 text-center p-4">매트릭스 데이터를 불러올 수 없습니다.</p>';
            return;
        }

        try {
            // 기존 내용 제거
            container.innerHTML = '';

            // SVG 요소 생성
            const svg = document.createElementNS(this.svgNS, 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '500');
            svg.setAttribute('viewBox', '0 0 600 500');
            svg.setAttribute('class', 'matrix-chart');
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', '데스티니 매트릭스 차트');

            // 배경 그라데이션 및 패턴 정의
            this.createDefinitions(svg);

            // 매트릭스 구조 그리기
            this.drawMatrixStructure(svg);

            // 포인트들 그리기
            this.drawMatrixPoints(svg);

            // 특별한 에너지 표시
            this.highlightSpecialEnergies(svg);

            // 컨테이너에 추가
            container.appendChild(svg);

            // 접근성을 위한 설명 추가
            this.addAccessibilityDescription(container);

        } catch (error) {
            console.error('Error generating matrix chart:', error);
            container.innerHTML = '<p class="text-red-400 text-center p-4">차트 생성 중 오류가 발생했습니다.</p>';
        }
    }

    // 정의 섹션 생성 (그라데이션, 필터 등)
    createDefinitions(svg) {
        const defs = document.createElementNS(this.svgNS, 'defs');
        
        // 중앙 포인트 그라데이션
        const coreGradient = document.createElementNS(this.svgNS, 'radialGradient');
        coreGradient.setAttribute('id', 'coreGradient');
        coreGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3730a3;stop-opacity:1" />
        `;

        // 주요 포인트 그라데이션
        const mainGradient = document.createElementNS(this.svgNS, 'radialGradient');
        mainGradient.setAttribute('id', 'mainGradient');
        mainGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
        `;

        // 카르마 그라데이션
        const karmaGradient = document.createElementNS(this.svgNS, 'radialGradient');
        karmaGradient.setAttribute('id', 'karmaGradient');
        karmaGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
        `;

        // 글로우 효과 필터
        const glowFilter = document.createElementNS(this.svgNS, 'filter');
        glowFilter.setAttribute('id', 'glow');
        glowFilter.setAttribute('x', '-50%');
        glowFilter.setAttribute('y', '-50%');
        glowFilter.setAttribute('width', '200%');
        glowFilter.setAttribute('height', '200%');
        glowFilter.innerHTML = `
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;

        defs.appendChild(coreGradient);
        defs.appendChild(mainGradient);
        defs.appendChild(karmaGradient);
        defs.appendChild(glowFilter);
        svg.appendChild(defs);
    }

    // 매트릭스 구조 그리기 (개선)
    drawMatrixStructure(svg) {
        // 외부 다이아몬드 라인
        const outerLines = [
            { x1: 300, y1: 50, x2: 550, y2: 250, class: 'destiny-line' },  // 상단-우측
            { x1: 550, y1: 250, x2: 300, y2: 450, class: 'destiny-line' }, // 우측-하단
            { x1: 300, y1: 450, x2: 50, y2: 250, class: 'destiny-line' },  // 하단-좌측
            { x1: 50, y1: 250, x2: 300, y2: 50, class: 'destiny-line' }    // 좌측-상단
        ];

        // 중앙 십자 라인
        const centerLines = [
            { x1: 50, y1: 250, x2: 550, y2: 250, class: 'relationship-line' },  // 수평 (관계 라인)
            { x1: 300, y1: 50, x2: 300, y2: 450, class: 'spiritual-line' }       // 수직 (영적 라인)
        ];

        // 내부 연결 라인들
        const innerLines = [
            { x1: 175, y1: 125, x2: 425, y2: 125, class: 'inner-line' },
            { x1: 175, y1: 375, x2: 425, y2: 375, class: 'inner-line' },
            { x1: 175, y1: 125, x2: 175, y2: 375, class: 'inner-line' },
            { x1: 425, y1: 125, x2: 425, y2: 375, class: 'inner-line' }
        ];

        // 라인 그리기
        [...outerLines, ...centerLines, ...innerLines].forEach(line => {
            const lineEl = document.createElementNS(this.svgNS, 'line');
            lineEl.setAttribute('x1', line.x1);
            lineEl.setAttribute('y1', line.y1);
            lineEl.setAttribute('x2', line.x2);
            lineEl.setAttribute('y2', line.y2);
            lineEl.setAttribute('class', `matrix-line ${line.class}`);
            
            // 라인 유형에 따른 스타일 적용
            const styles = this.getLineStyles(line.class);
            Object.keys(styles).forEach(attr => {
                lineEl.setAttribute(attr, styles[attr]);
            });
            
            svg.appendChild(lineEl);
        });
    }

    // 라인 스타일 정의
    getLineStyles(lineClass) {
        const styles = {
            'destiny-line': {
                'stroke': 'rgba(255, 255, 255, 0.4)',
                'stroke-width': '2',
                'stroke-dasharray': '5,3'
            },
            'relationship-line': {
                'stroke': 'rgba(34, 197, 94, 0.5)',
                'stroke-width': '3'
            },
            'spiritual-line': {
                'stroke': 'rgba(139, 92, 246, 0.5)',
                'stroke-width': '3'
            },
            'inner-line': {
                'stroke': 'rgba(255, 255, 255, 0.2)',
                'stroke-width': '1'
            }
        };
        
        return styles[lineClass] || styles['inner-line'];
    }

    // 매트릭스 포인트들 그리기 (개선)
    drawMatrixPoints(svg) {
        if (!this.matrixData) return;

        const positions = this.getPointPositions();

        Object.entries(positions).forEach(([key, pos]) => {
            const value = this.matrixData[key];
            if (value !== undefined && value !== null) {
                this.drawPoint(svg, pos.x, pos.y, value, pos.type, pos.label, key, pos.importance);
            } else {
                console.warn(`Missing value for matrix point: ${key}`);
            }
        });
    }

    // 포인트 위치 정의 (개선)
    getPointPositions() {
        return {
            // 주요 꼭지점 (A1-A4)
            A1: { x: 300, y: 50, type: 'main', label: '생일', importance: 'high' },
            A2: { x: 50, y: 250, type: 'main', label: '생월', importance: 'high' },
            A3: { x: 550, y: 250, type: 'main', label: '생년', importance: 'high' },
            A4: { x: 300, y: 450, type: 'main', label: '영적과제', importance: 'high' },
            
            // 중앙 포인트 (가장 중요)
            P_Core: { x: 300, y: 250, type: 'core', label: '핵심', importance: 'critical' },
            
            // 카르마 테일
            KarmaTail: { x: 400, y: 380, type: 'karma', label: '카르마', importance: 'high' },
            
            // 내부 라인 포인트들 (L1-L4)
            L1: { x: 300, y: 150, type: 'inner', label: 'L1', importance: 'medium' },
            L2: { x: 150, y: 250, type: 'inner', label: 'L2', importance: 'medium' },
            L3: { x: 450, y: 250, type: 'inner', label: 'L3', importance: 'medium' },
            L4: { x: 300, y: 350, type: 'inner', label: 'L4', importance: 'medium' },
            
            // 중간 포인트들 (M1-M4)
            M1: { x: 175, y: 125, type: 'middle', label: 'M1', importance: 'low' },
            M2: { x: 175, y: 375, type: 'middle', label: 'M2', importance: 'low' },
            M3: { x: 425, y: 375, type: 'middle', label: 'M3', importance: 'low' },
            M4: { x: 425, y: 125, type: 'middle', label: 'M4', importance: 'low' },
            
            // 세로 라인 포인트들 (V1-V4)
            V1: { x: 300, y: 100, type: 'line', label: 'V1', importance: 'low' },
            V2: { x: 300, y: 200, type: 'line', label: 'V2', importance: 'low' },
            V3: { x: 300, y: 300, type: 'line', label: 'V3', importance: 'low' },
            V4: { x: 300, y: 400, type: 'line', label: 'V4', importance: 'low' },
            
            // 가로 라인 포인트들 (H1-H4)
            H1: { x: 100, y: 250, type: 'line', label: 'H1', importance: 'low' },
            H2: { x: 200, y: 250, type: 'line', label: 'H2', importance: 'low' },
            H3: { x: 400, y: 250, type: 'line', label: 'H3', importance: 'low' },
            H4: { x: 500, y: 250, type: 'line', label: 'H4', importance: 'low' }
        };
    }

    // 개별 포인트 그리기 (개선)
    drawPoint(svg, x, y, value, type, label, key, importance) {
        const group = document.createElementNS(this.svgNS, 'g');
        group.setAttribute('class', `matrix-point ${type} importance-${importance}`);
        group.setAttribute('data-key', key);
        group.setAttribute('data-value', value);
        group.setAttribute('data-importance', importance);

        // 포인트 스타일 결정
        const styles = this.getPointStyle(type, importance);
        
        // 원 그리기
        const circle = document.createElementNS(this.svgNS, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', styles.radius);
        circle.setAttribute('fill', styles.fill);
        circle.setAttribute('stroke', styles.stroke);
        circle.setAttribute('stroke-width', styles.strokeWidth);
        circle.setAttribute('class', 'matrix-circle');

        // 숫자 텍스트
        const numberText = document.createElementNS(this.svgNS, 'text');
        numberText.setAttribute('x', x);
        numberText.setAttribute('y', y + 5);
        numberText.setAttribute('text-anchor', 'middle');
        numberText.setAttribute('fill', 'white');
        numberText.setAttribute('font-family', 'Arial, sans-serif');
        numberText.setAttribute('font-size', styles.fontSize);
        numberText.setAttribute('font-weight', 'bold');
        numberText.textContent = value;

        // 라벨 텍스트 (주요 포인트와 핵심만)
        if ((type === 'main' || type === 'core') && importance !== 'low') {
            const labelText = document.createElementNS(this.svgNS, 'text');
            labelText.setAttribute('x', x);
            labelText.setAttribute('y', y + styles.radius + 20);
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
            labelText.setAttribute('font-family', 'Arial, sans-serif');
            labelText.setAttribute('font-size', '12');
            labelText.textContent = label;
            group.appendChild(labelText);
        }

        // 마스터 넘버 또는 특별한 숫자 강조
        if (this.isSpecialNumber(value)) {
            this.addSpecialEffects(circle, value);
        }

        group.appendChild(circle);
        group.appendChild(numberText);
        
        // 인터랙션 이벤트 추가
        this.addInteractionEvents(group, key, value, label, type);
        
        svg.appendChild(group);
    }

    // 포인트 스타일 가져오기 (개선)
    getPointStyle(type, importance) {
        const baseStyles = {
            core: { radius: 35, fontSize: '24', strokeWidth: 3 },
            main: { radius: 25, fontSize: '18', strokeWidth: 2 },
            karma: { radius: 20, fontSize: '16', strokeWidth: 2 },
            inner: { radius: 15, fontSize: '14', strokeWidth: 1 },
            middle: { radius: 12, fontSize: '12', strokeWidth: 1 },
            line: { radius: 8, fontSize: '10', strokeWidth: 1 }
        };

        const fillColors = {
            core: 'url(#coreGradient)',
            main: 'url(#mainGradient)',
            karma: 'url(#karmaGradient)',
            inner: 'rgba(34, 197, 94, 0.8)',
            middle: 'rgba(59, 130, 246, 0.8)',
            line: 'rgba(168, 85, 247, 0.8)'
        };

        const strokeColors = {
            critical: 'rgba(255, 215, 0, 0.9)',  // 금색
            high: 'rgba(255, 255, 255, 0.8)',    // 밝은 흰색
            medium: 'rgba(255, 255, 255, 0.6)',  // 중간 흰색
            low: 'rgba(255, 255, 255, 0.4)'      // 흐린 흰색
        };

        const style = baseStyles[type] || baseStyles.line;
        
        return {
            ...style,
            fill: fillColors[type] || fillColors.line,
            stroke: strokeColors[importance] || strokeColors.low
        };
    }

    // 특별한 숫자 확인 (확장)
    isSpecialNumber(value) {
        // 마스터 넘버, 카르마 넘버 확인
        return value === 11 || value === 22 || [13, 14, 16, 19].includes(value);
    }

    // 특별 효과 추가 (개선)
    addSpecialEffects(circle, value) {
        if (value === 11 || value === 22) {
            // 마스터 넘버 글로우 효과
            circle.setAttribute('filter', 'url(#glow)');
            circle.style.filter = 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.8))';
            
            // 펄스 애니메이션
            const animate = document.createElementNS(this.svgNS, 'animate');
            animate.setAttribute('attributeName', 'stroke-width');
            animate.setAttribute('values', `${circle.getAttribute('stroke-width')};${parseInt(circle.getAttribute('stroke-width')) + 2};${circle.getAttribute('stroke-width')}`);
            animate.setAttribute('dur', '3s');
            animate.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(animate);
            
        } else if ([13, 14, 16, 19].includes(value)) {
            // 카르마 넘버 경고 효과
            circle.setAttribute('stroke', '#ef4444');
            
            // 크기 변화 애니메이션
            const animate = document.createElementNS(this.svgNS, 'animate');
            animate.setAttribute('attributeName', 'r');
            animate.setAttribute('values', `${circle.getAttribute('r')};${parseInt(circle.getAttribute('r')) + 3};${circle.getAttribute('r')}`);
            animate.setAttribute('dur', '2s');
            animate.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(animate);
        }
    }

    // 인터랙션 이벤트 추가 (개선)
    addInteractionEvents(group, key, value, label, type) {
        let originalRadius = null;
        
        group.addEventListener('mouseenter', (e) => {
            const circle = group.querySelector('.matrix-circle');
            originalRadius = parseInt(circle.getAttribute('r'));
            circle.setAttribute('r', originalRadius + 3);
            group.style.cursor = 'pointer';
            group.style.filter = 'brightness(1.2)';
            
            this.showTooltip(e, key, value, label, type);
        });

        group.addEventListener('mouseleave', () => {
            const circle = group.querySelector('.matrix-circle');
            if (originalRadius !== null) {
                circle.setAttribute('r', originalRadius);
            }
            group.style.cursor = 'default';
            group.style.filter = 'none';
            
            this.hideTooltip();
        });

        group.addEventListener('mousemove', (e) => {
            this.updateTooltipPosition(e);
        });

        // 클릭 이벤트 (추가 정보 표시)
        group.addEventListener('click', () => {
            this.showPointDetails(key, value, label, type);
        });
    }

    // 향상된 툴팁 표시
    showTooltip(event, key, value, label, type) {
        this.hideTooltip(); // 기존 툴팁 제거
        
        const meaning = this.getPositionMeaning(key);
        const isSpecial = this.isSpecialNumber(value);
        
        const tooltip = document.createElement('div');
        tooltip.id = 'matrix-tooltip';
        tooltip.className = 'fixed bg-black/90 text-white p-3 rounded-lg shadow-xl z-50 pointer-events-none max-w-xs';
        
        tooltip.innerHTML = `
            <div class="font-bold text-lg ${isSpecial ? 'text-yellow-300' : 'text-blue-300'}">${key}: ${value}</div>
            <div class="text-sm text-gray-300 mt-1">${meaning}</div>
            ${isSpecial ? '<div class="text-xs text-yellow-200 mt-1">✨ 특별한 에너지</div>' : ''}
            <div class="text-xs text-gray-400 mt-2">클릭하면 자세한 정보를 볼 수 있습니다</div>
        `;
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
        this.updateTooltipPosition(event);
    }

    // 툴팁 위치 업데이트
    updateTooltipPosition(event) {
        if (this.currentTooltip) {
            const rect = this.currentTooltip.getBoundingClientRect();
            let left = event.clientX + 10;
            let top = event.clientY - 10;
            
            // 화면 경계 확인 및 조정
            if (left + rect.width > window.innerWidth) {
                left = event.clientX - rect.width - 10;
            }
            if (top < 0) {
                top = event.clientY + 10;
            }
            
            this.currentTooltip.style.left = left + 'px';
            this.currentTooltip.style.top = top + 'px';
        }
    }

    // 툴팁 숨기기
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    // 포인트 상세 정보 표시
    showPointDetails(key, value, label, type) {
        const meaning = this.getPositionMeaning(key);
        const isSpecial = this.isSpecialNumber(value);
        
        // 모달이나 사이드패널 형태로 상세 정보 표시
        console.log(`Detailed info for ${key}:`, { value, label, type, meaning, isSpecial });
        
        // 임시로 알림창 표시 (실제로는 모달 컴포넌트 구현 권장)
        alert(`
${label} (${key}): ${value}

의미: ${meaning}

${isSpecial ? '⭐ 이것은 특별한 에너지 숫자입니다!' : ''}

이 포지션은 ${type} 유형의 에너지를 나타냅니다.
        `.trim());
    }

    // 특유 에너지 하이라이트 (개선)
    highlightSpecialEnergies(svg) {
        if (!this.matrixData) return;

        const specialNumbers = Object.entries(this.matrixData)
            .filter(([key, value]) => this.isSpecialNumber(value))
            .map(([key, value]) => ({ key, value }));

        if (specialNumbers.length > 0) {
            // 특별한 에너지가 있음을 나타내는 표시 추가
            const legend = document.createElementNS(this.svgNS, 'g');
            legend.setAttribute('transform', 'translate(10, 10)');
            
            specialNumbers.forEach((item, index) => {
                const rect = document.createElementNS(this.svgNS, 'rect');
                rect.setAttribute('x', 0);
                rect.setAttribute('y', index * 25);
                rect.setAttribute('width', 120);
                rect.setAttribute('height', 20);
                rect.setAttribute('rx', 10);
                rect.setAttribute('fill', 'rgba(255, 215, 0, 0.1)');
                rect.setAttribute('stroke', 'rgba(255, 215, 0, 0.5)');
                
                const text = document.createElementNS(this.svgNS, 'text');
                text.setAttribute('x', 60);
                text.setAttribute('y', index * 25 + 14);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', 'rgba(255, 215, 0, 0.9)');
                text.setAttribute('font-size', '10');
                text.setAttribute('font-weight', 'bold');
                text.textContent = `${item.key}: ${item.value}`;
                
                legend.appendChild(rect);
                legend.appendChild(text);
            });
            
            svg.appendChild(legend);
        }
    }

    // 포지션 의미 가져오기 (개선)
    getPositionMeaning(key) {
        const meanings = {
            P_Core: '핵심 자아, 컴포트 존 - 가장 중요한 에너지',
            A1: '개인의 본질, 개성 (생일) - 타고난 성격과 재능',
            A2: '남성 에너지, 관계 (생월) - 행동력과 추진력',
            A3: '여성 에너지, 관계 (생년) - 감정과 직감',
            A4: '영적 과제, 조상 라인 - 이생의 학습 과제',
            KarmaTail: '과거생/조상 카르마 - 해결해야 할 카르마',
            L1: '내면의 잠재력 - 숨겨진 능력',
            L2: '감정과 직관 - 내면의 지혜',
            L3: '표현과 소통 - 외부와의 연결',
            L4: '실현과 완성 - 목표 달성 능력',
            M1: '초기 관계 에너지 - 첫인상과 시작',
            M2: '변화와 도전 - 성장의 기회',
            M3: '성취와 결과 - 노력의 결실',
            M4: '새로운 시작 - 혁신과 창조',
            V1: '상승 에너지 - 성장과 발전',
            V2: '내적 균형 - 조화와 안정',
            V3: '외적 표현 - 세상과의 소통',
            V4: '완성 에너지 - 목표의 달성',
            H1: '좌측 흐름 - 내적 에너지의 시작',
            H2: '내적 조화 - 감정의 균형',
            H3: '외적 조화 - 행동의 균형',
            H4: '우측 흐름 - 외적 에너지의 완성'
        };
        
        return meanings[key] || '에너지 포인트';
    }

    // 특정 라인 하이라이트 (개선)
    highlightLine(lineType) {
        const lines = {
            vertical: ['A1', 'V1', 'L1', 'V2', 'P_Core', 'V3', 'L4', 'V4', 'A4'],
            horizontal: ['A2', 'H1', 'L2', 'H2', 'P_Core', 'H3', 'L3', 'H4', 'A3'],
            relationship: ['A2', 'L2', 'P_Core', 'L3', 'A3'],
            karma: ['P_Core', 'KarmaTail'],
            talent: ['A1', 'L1', 'P_Core']
        };

        const linePoints = lines[lineType];
        if (!linePoints) return;

        // 모든 포인트 투명도/스타일 초기화
        this.resetHighlight();

        // 선택된 라인의 포인트들 강조
        linePoints.forEach(pointKey => {
            const point = document.querySelector(`[data-key="${pointKey}"]`);
            if (point) {
                point.style.opacity = '1';
                point.style.filter = 'brightness(1.3) drop-shadow(0 0 8px rgba(255,255,255,0.6))';
                point.classList.add('highlighted');
            }
        });

        // 해당 라인 강조
        const lineElements = document.querySelectorAll(`.${lineType}-line`);
        lineElements.forEach(line => {
            line.style.stroke = 'rgba(255, 215, 0, 0.8)';
            line.style.strokeWidth = '4';
        });
    }

    // 하이라이트 초기화 (개선)
    resetHighlight() {
        const allPoints = document.querySelectorAll('.matrix-point');
        allPoints.forEach(point => {
            point.style.opacity = '1';
            point.style.filter = 'none';
            point.classList.remove('highlighted');
        });

        const allLines = document.querySelectorAll('.matrix-line');
        allLines.forEach(line => {
            // 원래 스타일로 복구
            line.style.stroke = '';
            line.style.strokeWidth = '';
        });
    }

    // 접근성을 위한 설명 추가
    addAccessibilityDescription(container) {
        const description = document.createElement('div');
        description.className = 'sr-only'; // 스크린 리더용
        description.innerHTML = `
            <h3>데스티니 매트릭스 차트 설명</h3>
            <p>이 차트는 생년월일을 기반으로 계산된 22개의 에너지 포인트를 시각적으로 표현합니다.</p>
            <ul>
                <li>중앙의 큰 원은 핵심 에너지(${this.matrixData?.P_Core})를 나타냅니다.</li>
                <li>네 모서리의 원은 생일(${this.matrixData?.A1}), 생월(${this.matrixData?.A2}), 생년(${this.matrixData?.A3}), 영적과제(${this.matrixData?.A4})를 나타냅니다.</li>
                <li>각 점에 마우스를 올리면 자세한 정보를 볼 수 있습니다.</li>
            </ul>
        `;
        container.appendChild(description);
    }

    // 차트 내보내기 기능
    exportChart(format = 'svg') {
        const svg = document.querySelector('.matrix-chart');
        if (!svg) {
            console.error('No chart found to export');
            return null;
        }

        if (format === 'svg') {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            return URL.createObjectURL(blob);
        } else if (format === 'png') {
            // SVG to PNG 변환 (복잡한 로직이므로 별도 구현 필요)
            console.log('PNG export not yet implemented');
            return null;
        }
    }

    // 매트릭스 데이터 유효성 검사
    validateMatrixData(data) {
        const requiredKeys = ['P_Core', 'A1', 'A2', 'A3', 'A4'];
        for (const key of requiredKeys) {
            if (!data[key] && data[key] !== 0) {
                console.error(`Missing required matrix data: ${key}`);
                return false;
            }
        }
        return true;
    }
}

// 전역으로 내보내기
window.MatrixVisualization = MatrixVisualization;

