// 공유 이미지 생성기 클래스 (개선)
class ShareImageGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.initCanvas();
    }

    initCanvas() {
        try {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 1000;
            this.ctx = this.canvas.getContext('2d');
            
            if (!this.ctx) {
                throw new Error('Canvas 2D context is not supported');
            }
            
            // 캔버스 기본 배경 설정
            this.ctx.fillStyle = '#1e1b4b';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } catch (error) {
            console.error('Canvas initialization failed:', error);
            throw error;
        }
    }

    // 숫자별 핵심 메시지 정의 (확장)
    getNumberMessage(number) {
        const messages = {
            1: {
                title: "선구자의 리더십",
                subtitle: "새로운 길을 개척하는 용기를 가지세요",
                color: "#FF6B6B",
                keywords: ["독립성", "창의력", "리더십", "혁신"]
            },
            2: {
                title: "조화로운 협력자",
                subtitle: "함께할 때 더욱 빛나는 당신",
                color: "#4ECDC4", 
                keywords: ["공감", "협동", "균형", "평화"]
            },
            3: {
                title: "창의적 표현자",
                subtitle: "밝은 에너지로 세상을 물들이세요",
                color: "#45B7D1",
                keywords: ["표현력", "창의성", "소통", "기쁨"]
            },
            4: {
                title: "안정적인 건설자",
                subtitle: "꾸준함이 만드는 견고한 성공",
                color: "#96CEB4",
                keywords: ["성실함", "책임감", "안정", "체계"]
            },
            5: {
                title: "자유로운 모험가",
                subtitle: "변화를 통해 성장하는 영혼",
                color: "#FFEAA7",
                keywords: ["자유", "모험", "적응력", "변화"]
            },
            6: {
                title: "사랑의 돌봄이",
                subtitle: "따뜻한 마음으로 세상을 품으세요",
                color: "#DDA0DD",
                keywords: ["사랑", "헌신", "조화", "치유"]
            },
            7: {
                title: "지혜로운 탐구자", 
                subtitle: "깊은 사색으로 진리를 찾아가세요",
                color: "#A8E6CF",
                keywords: ["지성", "탐구", "신비", "직관"]
            },
            8: {
                title: "강력한 실행자",
                subtitle: "의지력으로 꿈을 현실로 만드세요",
                color: "#FFD93D",
                keywords: ["야망", "실행력", "성공", "권위"]
            },
            9: {
                title: "포용하는 완성자",
                subtitle: "따뜻한 마음으로 세상을 치유하세요",
                color: "#FF8B94",
                keywords: ["포용", "완성", "치유", "봉사"]
            },
            11: {
                title: "영감의 메신저",
                subtitle: "직감으로 세상에 빛을 전하세요",
                color: "#C7CEEA",
                keywords: ["직관", "영감", "비전", "스승"]
            },
            22: {
                title: "마스터 빌더",
                subtitle: "큰 꿈을 현실로 만드는 특별한 힘",
                color: "#B19CD9", 
                keywords: ["실현", "건설", "대업", "변화"]
            }
        };

        // 예외 처리 및 기본값
        if (!messages[number]) {
            console.warn(`No specific share image message for number: ${number}. Using default.`);
            return {
                title: `운명의 숫자 ${number}`,
                subtitle: "당신만의 특별한 에너지를 발견하세요",
                color: "#6366f1",
                keywords: ["에너지", "운명", "숫자", "발견"]
            };
        }

        return messages[number];
    }

    // 그라데이션 배경 생성 (개선)
    createGradientBackground(color) {
        try {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            
            // 기본 색상에서 다양한 톤 생성
            const lighterColor = this.adjustColorBrightness(color, 40);
            const darkerColor = this.adjustColorBrightness(color, -20);
            const darkestColor = this.adjustColorBrightness(color, -50);

            gradient.addColorStop(0, lighterColor);
            gradient.addColorStop(0.3, color + 'DD');
            gradient.addColorStop(0.7, darkerColor + 'EE');
            gradient.addColorStop(1, darkestColor);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } catch (error) {
            console.error('Error creating gradient background:', error);
            // 폴백으로 단색 배경
            this.ctx.fillStyle = color || '#1e1b4b';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // 색상 밝기 조절 (개선)
    adjustColorBrightness(color, amount) {
        try {
            // HEX 색상 검증
            if (!color || typeof color !== 'string' || !color.startsWith('#')) {
                console.warn('Invalid color format:', color);
                return '#6366f1'; // 기본 색상
            }

            const colorValue = color.replace('#', '');
            if (colorValue.length !== 6) {
                console.warn('Invalid hex color length:', color);
                return '#6366f1';
            }

            const num = parseInt(colorValue, 16);
            if (isNaN(num)) {
                console.warn('Invalid hex color:', color);
                return '#6366f1';
            }

            const R = Math.max(0, Math.min(255, (num >> 16) + amount));
            const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
            const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));

            return "#" + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
        } catch (error) {
            console.error('Error adjusting color brightness:', error);
            return '#6366f1';
        }
    }

    // 둥근 사각형 그리기 (개선)
    roundRect(x, y, width, height, radius) {
        try {
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.arcTo(x + width, y, x + width, y + height, radius);
            this.ctx.arcTo(x + width, y + height, x, y + height, radius);
            this.ctx.arcTo(x, y + height, x, y, radius);
            this.ctx.arcTo(x, y, x + width, y, radius);
            this.ctx.closePath();
        } catch (error) {
            console.error('Error drawing rounded rectangle:', error);
            // 폴백으로 일반 사각형
            this.ctx.rect(x, y, width, height);
        }
    }

    // 텍스트 그림자 효과
    drawTextWithShadow(text, x, y, shadowColor = 'rgba(0, 0, 0, 0.5)', shadowOffset = 2) {
        this.ctx.save();
        
        // 그림자 그리기
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillText(text, x + shadowOffset, y + shadowOffset);
        
        // 메인 텍스트 그리기
        this.ctx.restore();
        this.ctx.fillText(text, x, y);
    }

    // 메인 결과 이미지 생성 (개선)
    async generateShareImage(centralNumber, birthdate) {
        try {
            if (!centralNumber || !birthdate) {
                throw new Error('필수 파라미터가 누락되었습니다.');
            }

            const message = this.getNumberMessage(parseInt(centralNumber));
            
            // 캔버스 초기화
            this.initCanvas();
            
            // 배경 그라데이션
            this.createGradientBackground(message.color);

            // 상단 장식 요소들
            this.drawDecorativeElements();

            // 메인 제목
            this.drawMainTitle();

            // 중앙 숫자 카드
            this.drawCentralNumberCard(centralNumber, message, birthdate);

            // 핵심 메시지
            this.drawMainMessage(message);

            // 키워드 태그들
            this.drawKeywordTags(message.keywords);

            // 하단 정보
            this.drawBottomInfo();

            return this.canvas.toDataURL('image/png', 0.9);

        } catch (error) {
            console.error('Error generating share image:', error);
            throw new Error(`이미지 생성 실패: ${error.message}`);
        }
    }

    // 장식 요소 그리기 (개선)
    drawDecorativeElements() {
        const elements = [
            { type: 'circle', x: 100, y: 100, size: 40, opacity: 0.15 },
            { type: 'circle', x: 700, y: 150, size: 30, opacity: 0.12 },
            { type: 'circle', x: 150, y: 450, size: 25, opacity: 0.1 },
            { type: 'circle', x: 650, y: 500, size: 35, opacity: 0.13 },
            { type: 'star', x: 400, y: 700, size: 20, opacity: 0.08 },
            { type: 'star', x: 750, y: 350, size: 15, opacity: 0.1 }
        ];

        elements.forEach(element => {
            this.ctx.save();
            this.ctx.globalAlpha = element.opacity;
            this.ctx.fillStyle = '#FFFFFF';
            
            if (element.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (element.type === 'star') {
                this.drawStar(element.x, element.y, element.size);
            }
            
            this.ctx.restore();
        });
    }

    // 별 모양 그리기
    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const sx = x + Math.cos(angle) * radius;
            const sy = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(sx, sy);
            } else {
                this.ctx.lineTo(sx, sy);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    // 메인 제목 그리기 (개선)
    drawMainTitle() {
        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 48px "Arial Black", sans-serif';
        this.ctx.textAlign = 'center';
        
        this.drawTextWithShadow(
            '데스티니 매트릭스',
            this.canvas.width / 2,
            120,
            'rgba(0, 0, 0, 0.3)',
            3
        );
        
        this.ctx.restore();
    }

    // 중앙 숫자 카드 그리기 (개선)
    drawCentralNumberCard(number, message, birthdate) {
        const cardX = this.canvas.width / 2 - 220;
        const cardY = 180;
        const cardWidth = 440;
        const cardHeight = 280;

        try {
            // 카드 그림자
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#000000';
            this.roundRect(cardX + 8, cardY + 8, cardWidth, cardHeight, 30);
            this.ctx.fill();
            this.ctx.restore();

            // 카드 배경
            const cardBgColor = this.adjustColorBrightness(message.color, 60) + 'F5';
            this.ctx.fillStyle = cardBgColor;
            this.roundRect(cardX, cardY, cardWidth, cardHeight, 30);
            this.ctx.fill();
            
            // 카드 테두리
            this.ctx.strokeStyle = message.color;
            this.ctx.lineWidth = 4;
            this.roundRect(cardX, cardY, cardWidth, cardHeight, 30);
            this.ctx.stroke();

            // 숫자 표시 (더 큰 크기)
            this.ctx.save();
            this.ctx.fillStyle = message.color;
            this.ctx.font = 'bold 180px "Impact", sans-serif';
            this.ctx.textAlign = 'center';
            
            // 숫자 그림자 효과
            this.drawTextWithShadow(
                number,
                this.canvas.width / 2,
                cardY + 170,
                'rgba(0, 0, 0, 0.2)',
                4
            );
            this.ctx.restore();

            // "당신의 운명의 숫자" 텍스트
            this.ctx.fillStyle = '#333333';
            this.ctx.font = 'bold 24px "Arial", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('당신의 운명의 숫자', this.canvas.width / 2, cardY + 220);

            // 생년월일 표시
            this.ctx.fillStyle = '#666666';
            this.ctx.font = '18px "Arial", sans-serif';
            this.ctx.fillText(`생년월일: ${birthdate}`, this.canvas.width / 2, cardY + 250);

        } catch (error) {
            console.error('Error drawing central number card:', error);
        }
    }

    // 메인 메시지 그리기 (개선)
    drawMainMessage(message) {
        const messageY = 520;
        
        this.ctx.save();
        
        // 제목
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 40px "Arial", sans-serif';
        this.ctx.textAlign = 'center';
        
        this.drawTextWithShadow(
            message.title,
            this.canvas.width / 2,
            messageY,
            'rgba(0, 0, 0, 0.4)',
            2
        );

        // 부제목 (개행 처리)
        this.ctx.font = '26px "Arial", sans-serif';
        const subtitleLines = this.wrapText(message.subtitle, this.canvas.width - 100);
        
        subtitleLines.forEach((line, index) => {
            this.drawTextWithShadow(
                line,
                this.canvas.width / 2,
                messageY + 60 + (index * 35),
                'rgba(0, 0, 0, 0.3)',
                1
            );
        });
        
        this.ctx.restore();
    }

    // 텍스트 줄바꿈 처리
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const testWidth = this.ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }

    // 키워드 태그 그리기 (개선)
    drawKeywordTags(keywords) {
        if (!keywords || !Array.isArray(keywords)) {
            console.warn('Invalid keywords for tag drawing');
            return;
        }

        const tagY = 650;
        const tagHeight = 50;
        const tagPadding = 20;
        const gap = 15;

        // 각 태그의 너비 계산
        this.ctx.font = 'bold 20px "Arial", sans-serif';
        const tagWidths = keywords.map(keyword => this.ctx.measureText(keyword).width + tagPadding * 2);
        const totalWidth = tagWidths.reduce((sum, width) => sum + width, 0) + (keywords.length - 1) * gap;
        
        let currentX = (this.canvas.width - totalWidth) / 2;

        keywords.forEach((keyword, index) => {
            const tagWidth = tagWidths[index];

            try {
                // 태그 배경 그림자
                this.ctx.save();
                this.ctx.globalAlpha = 0.2;
                this.ctx.fillStyle = '#000000';
                this.roundRect(currentX + 2, tagY + 2, tagWidth, tagHeight, tagHeight / 2);
                this.ctx.fill();
                this.ctx.restore();

                // 태그 배경
                this.ctx.save();
                this.ctx.globalAlpha = 0.95;
                this.ctx.fillStyle = '#FFFFFF';
                this.roundRect(currentX, tagY, tagWidth, tagHeight, tagHeight / 2);
                this.ctx.fill();
                this.ctx.restore();

                // 태그 텍스트
                this.ctx.fillStyle = '#333333';
                this.ctx.font = 'bold 20px "Arial", sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(keyword, currentX + tagWidth / 2, tagY + tagHeight / 2 + 7);

                currentX += tagWidth + gap;
            } catch (error) {
                console.error('Error drawing keyword tag:', error);
            }
        });
    }

    // 하단 정보 그리기 (개선)
    drawBottomInfo() {
        const bottomY = this.canvas.height - 200;
        
        try {
            // 반투명 바 배경
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#FFFFFF';
            this.roundRect(50, bottomY, this.canvas.width - 100, 140, 25);
            this.ctx.fill();
            this.ctx.restore();

            // 메인 공유 텍스트
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 32px "Arial", sans-serif';
            this.ctx.textAlign = 'center';
            
            this.drawTextWithShadow(
                '나의 운명 숫자 결과',
                this.canvas.width / 2,
                bottomY + 50,
                'rgba(0, 0, 0, 0.3)',
                2
            );

            // 하위 텍스트
            this.ctx.font = '24px "Arial", sans-serif';
            this.drawTextWithShadow(
                '당신도 확인해보세요!',
                this.canvas.width / 2,
                bottomY + 90,
                'rgba(0, 0, 0, 0.3)',
                1
            );

            // 브랜드 정보 (선택적)
            this.ctx.font = '16px "Arial", sans-serif';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText('destiny-matrix.com', this.canvas.width / 2, bottomY + 120);

        } catch (error) {
            console.error('Error drawing bottom info:', error);
        }
    }

    // 이미지 다운로드 지원
    downloadImage(filename = 'destiny-matrix-result.png') {
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = this.canvas.toDataURL('image/png', 0.9);
            link.click();
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    }

    // 캔버스 상태 검증
    validateCanvas() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context is not initialized');
            return false;
        }
        
        if (this.canvas.width <= 0 || this.canvas.height <= 0) {
            console.error('Canvas has invalid dimensions');
            return false;
        }
        
        return true;
    }

    // 디버깅용 캔버스 정보
    getCanvasInfo() {
        return {
            width: this.canvas?.width || 0,
            height: this.canvas?.height || 0,
            hasContext: !!this.ctx,
            isValid: this.validateCanvas()
        };
    }
}

// 전역으로 내보내기
window.ShareImageGenerator = ShareImageGenerator;

