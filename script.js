// 데스티니 매트릭스 메인 컨트롤러 클래스
class DestinyMatrixCalculator {
    constructor() {
        this.shareImageGenerator = new ShareImageGenerator();
        this.completeMatrixCalculator = new CompleteDestinyMatrixCalculator();
        this.matrixVisualization = new MatrixVisualization();
        this.premiumAnalysis = new PremiumAnalysis();
        this.premiumAnalysis.setMatrixCalculator(this.completeMatrixCalculator);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('birthdateForm');
        const shareButton = document.getElementById('shareButton');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit();
        });

        shareButton.addEventListener('click', () => {
            this.shareResult();
        });

        // 실시간 날짜 유효성 검사
        const birthdateInput = document.getElementById('birthdate');
        birthdateInput.addEventListener('input', () => {
            this.validateBirthdateInput(birthdateInput.value);
        });
        birthdateInput.addEventListener('blur', () => {
            this.validateBirthdateInput(birthdateInput.value);
        });
    }

    validateBirthdateInput(value) {
        if (!value) {
            this.hideError();
            return true;
        }

        const validation = this.validateBirthdate(value);
        if (!validation.isValid) {
            this.showError(validation.message);
            return false;
        } else {
            this.hideError();
            return true;
        }
    }

    async handleFormSubmit() {
        const birthdateInput = document.getElementById('birthdate');
        const birthdate = birthdateInput.value;

        // 입력 유효성 검사
        const validation = this.validateBirthdate(birthdate);
        if (!validation.isValid) {
            this.showError(validation.message);
            this.shakeInput();
            return;
        }

        this.hideError();
        this.showLoading();

        // 계산 시뮬레이션을 위한 지연
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 전체 매트릭스 계산
            const matrixData = this.completeMatrixCalculator.calculateCompleteMatrix(birthdate);
            const centralNumber = matrixData.P_Core;

            // 전체 매트릭스 시각화
            this.matrixVisualization.generateFullMatrixChart(matrixData, 'fullMatrixVisualization');

            await this.displayResults(centralNumber, birthdate, matrixData);
        } catch (error) {
            this.showError('계산 중 오류가 발생했습니다. 다시 시도해주세요.');
            console.error('Calculation error:', error);
        } finally {
            this.hideLoading();
        }
    }

    validateBirthdate(birthdate) {
        if (!birthdate) {
            return { isValid: false, message: '생년월일을 입력해주세요.' };
        }
        
        const date = new Date(birthdate);
        const now = new Date();
        
        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
            return { isValid: false, message: '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)' };
        }
        
        // 현재 날짜(시간 무시)보다 이후인지 확인
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        if (inputDate > today) {
            return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' };
        }
        
        // 1900년 이후인지 확인
        if (date.getFullYear() < 1900) {
            return { isValid: false, message: '1900년 이후 날짜만 입력 가능합니다.' };
        }

        // 각 월의 최대 일수 유효성 추가
        const [year, month, day] = birthdate.split('-').map(Number);
        
        // 월 범위 확인 (1-12)
        if (month < 1 || month > 12) {
            return { isValid: false, message: '올바른 월을 입력해주세요. (01-12)' };
        }

        const lastDayOfMonth = new Date(year, month, 0).getDate();
        if (day > lastDayOfMonth || day < 1) {
            return { isValid: false, message: `${year}년 ${month}월에는 ${day}일이 없습니다.` };
        }

        // 윤년 특별 확인
        if (month === 2 && day === 29) {
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            if (!isLeapYear) {
                return { isValid: false, message: `${year}년은 윤년이 아니므로 2월 29일은 존재하지 않습니다.` };
            }
        }

        return { isValid: true, message: '' };
    }

    async displayResults(centralNumber, birthdate, matrixData) {
        // 가운데 숫자 표시
        const centralNumberElement = document.getElementById('centralNumber');
        centralNumberElement.textContent = centralNumber;
        
        // 생년월일 정보 표시
        const birthdateInfo = document.getElementById('birthdateInfo');
        birthdateInfo.textContent = `생년월일: ${birthdate}`;

        // 해석 내용 표시
        this.displayInterpretation(centralNumber);

        // 마스터 넘버 특별 섹션
        if (centralNumber === 11 || centralNumber === 22) {
            this.showMasterNumberSection(centralNumber);
        } else {
            this.hideMasterNumberSection();
        }

        // 공유 이미지 생성 및 표시
        await this.generateAndShowShareImage(centralNumber, birthdate);

        // 결과 섹션 표시
        document.getElementById('resultsSection').classList.remove('hidden');
        
        // 결과 섹션으로 스크롤
        setTimeout(() => {
            document.getElementById('resultsSection').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 300);

        // 애니메이션 효과 적용
        this.animateInterpretationSections();

        // 로컬 스토리지에 결과 저장
        this.saveResult(centralNumber, birthdate);
    }

    animateInterpretationSections() {
        const sections = document.querySelectorAll('#interpretationSection [data-animate="true"]');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, (index + 1) * 200);
        });
    }

    async generateAndShowShareImage(centralNumber, birthdate) {
        try {
            const imageDataUrl = await this.shareImageGenerator.generateShareImage(centralNumber, birthdate);
            
            // 공유 이미지를 표시할 섹션 업데이트
            const shareImageContainer = document.getElementById('shareImageContainer');
            shareImageContainer.innerHTML = `
                <img 
                    src="${imageDataUrl}" 
                    alt="데스티니 매트릭스 결과 공유 이미지" 
                    class="w-full max-w-sm mx-auto rounded-3xl shadow-2xl opacity-0 transform scale-95 transition-all duration-500"
                    onload="this.style.opacity='1'; this.style.transform='scale(1)';"
                >
                <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        id="downloadImageBtn"
                        class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        이미지 저장하기
                    </button>
                    <button 
                        id="shareImageBtn"
                        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        결과 공유하기
                    </button>
                </div>
            `;

            // 이벤트 리스너 추가
            document.getElementById('downloadImageBtn').addEventListener('click', () => {
                this.downloadImage(imageDataUrl, `destiny-matrix-${centralNumber}.png`);
            });

            document.getElementById('shareImageBtn').addEventListener('click', () => {
                this.shareResult();
            });

        } catch (error) {
            console.error('Failed to generate share image:', error);
            const shareImageContainer = document.getElementById('shareImageContainer');
            shareImageContainer.innerHTML = `
                <div class="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
                    <p class="text-red-400 mb-4">이미지 생성에 실패했습니다.</p>
                    <p class="text-red-300 text-sm mb-4">Canvas API가 지원되지 않거나 메모리가 부족할 수 있습니다.</p>
                    <button 
                        id="shareButtonFallback"
                        class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        텍스트로 결과 공유하기
                    </button>
                </div>
            `;
            document.getElementById('shareButtonFallback').addEventListener('click', () => {
                this.shareResult();
            });
        }
    }

    downloadImage(dataUrl, filename) {
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showTemporaryMessage('이미지가 다운로드되었습니다!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showTemporaryMessage('다운로드에 실패했습니다.', 'error');
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showTemporaryMessage('클립보드에 복사되었습니다!', 'success');
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        
        try {
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            const successful = document.execCommand('copy');
            if (successful) {
                this.showTemporaryMessage('클립보드에 복사되었습니다!', 'success');
            } else {
                this.showTemporaryMessage('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showTemporaryMessage('복사 기능을 사용할 수 없습니다.', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    displayInterpretation(centralNumber) {
        const interpretation = INTERPRETATIONS[centralNumber];
        
        if (!interpretation) {
            console.warn(`No interpretation found for number: ${centralNumber}`);
            const interpretationSection = document.getElementById('interpretationSection');
            interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">
                <p class="text-lg font-semibold mb-2">해석 데이터 오류</p>    
                <p>숫자 ${centralNumber}에 대한 해석 데이터를 찾을 수 없습니다. 관리자에게 문의해주세요.</p>
            </div>`;
            return;
        }

        // 성격과 재능 섹션
        const personalityElement = document.getElementById('personalityContent');
        personalityElement.innerHTML = `
            <h4 class="text-lg font-semibold mb-3 text-emerald-200">주요 특성</h4>
            <p class="mb-4">${interpretation.personality}</p>
            <h4 class="text-lg font-semibold mb-3 text-emerald-200">타고난 재능</h4>
            <p>${interpretation.talents}</p>
        `;

        // 삶의 과제와 조언 섹션
        const challengesElement = document.getElementById('challengesContent');
        challengesElement.innerHTML = `
            <h4 class="text-lg font-semibold mb-3 text-amber-200">삶의 과제</h4>
            <p class="mb-4">${interpretation.challenges}</p>
            <h4 class="text-lg font-semibold mb-3 text-amber-200">조언</h4>
            <p>${interpretation.advice}</p>
        `;
    }

    showMasterNumberSection(centralNumber) {
        const masterNumberSection = document.getElementById('masterNumberSection');
        const masterNumberContent = document.getElementById('masterNumberContent');
        
        const interpretation = INTERPRETATIONS[centralNumber];
        if (!interpretation || !interpretation.masterNumber) {
            console.warn(`Master number interpretation not found for: ${centralNumber}`);
            this.hideMasterNumberSection();
            return;
        }
        
        masterNumberContent.innerHTML = `
            <div class="bg-purple-400/10 rounded-2xl p-6 border border-purple-300/20">
                <h4 class="text-lg font-semibold mb-3 text-purple-200">마스터 넘버 ${centralNumber}의 특별한 의미</h4>
                <p class="mb-4">${interpretation.masterNumber}</p>
                <div class="text-sm text-purple-300 bg-purple-500/20 rounded-xl p-4">
                    <strong>⭐ 마스터 넘버는 특별한 영적 에너지를 가지고 있습니다.</strong><br>
                    이는 높은 잠재력과 함께 더 큰 책임을 의미하며, 당신의 영혼이 선택한 특별한 경로입니다.
                </div>
            </div>
        `;
        
        masterNumberSection.classList.remove('hidden');
    }

    hideMasterNumberSection() {
        const masterNumberSection = document.getElementById('masterNumberSection');
        masterNumberSection.classList.add('hidden');
    }

    shakeInput() {
        const birthdateInput = document.getElementById('birthdate');
        birthdateInput.classList.add('shake-animation');
        setTimeout(() => {
            birthdateInput.classList.remove('shake-animation');
        }, 600);
    }

    showLoading() {
        const loadingSection = document.getElementById('loadingSection');
        const resultsSection = document.getElementById('resultsSection');
        const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');
        
        loadingSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        premiumAnalysisSection.classList.add('hidden');
        
        // 버튼 비활성화
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.disabled = true;
        calculateBtn.textContent = '계산 중...';
    }

    hideLoading() {
        const loadingSection = document.getElementById('loadingSection');
        loadingSection.classList.add('hidden');
        
        // 버튼 복구
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.disabled = false;
        calculateBtn.textContent = '데스티니 매트릭스 차트 생성하기';
    }

    showError(message) {
        const errorElement = document.getElementById('dateError');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // 입력 필드에 오류 스타일 적용
        const birthdateInput = document.getElementById('birthdate');
        birthdateInput.classList.add('border-red-500', 'focus:ring-red-500');
    }

    hideError() {
        const errorElement = document.getElementById('dateError');
        errorElement.classList.add('hidden');
        
        // 입력 필드 오류 스타일 제거
        const birthdateInput = document.getElementById('birthdate');
        birthdateInput.classList.remove('border-red-500', 'focus:ring-red-500');
    }

    saveResult(centralNumber, birthdate) {
        const result = {
            centralNumber,
            birthdate,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('destinyMatrixLastResult', JSON.stringify(result));
        } catch (error) {
            console.warn('Failed to save result to localStorage:', error);
        }
    }

    shareResult() {
        const centralNumber = document.getElementById('centralNumber').textContent;
        const shareText = `✨ 저의 데스티니 매트릭스 가운데 숫자는 ${centralNumber}입니다! 
        
당신의 운명의 숫자는 무엇일까요? 🔮
지금 바로 확인해보세요! 

${window.location.href}

#데스티니매트릭스 #운명의숫자 #numerology`;

        if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
            navigator.share({
                title: '데스티니 매트릭스 결과',
                text: shareText,
                url: window.location.href
            }).catch(error => {
                console.log('Web Share API failed:', error);
                this.copyToClipboard(shareText);
            });
        } else {
            // Web Share API 미지원 브라우저를 위한 폴백
            this.copyToClipboard(shareText);
        }
    }

    showTemporaryMessage(message, type = 'success') {
        // 기존 메시지 제거
        const existingMessage = document.getElementById('temporaryMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.id = 'temporaryMessage';
        
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        messageDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // 슬라이드 인 애니메이션
        setTimeout(() => {
            messageDiv.classList.remove('translate-x-full', 'opacity-0');
            messageDiv.classList.add('translate-x-0', 'opacity-100');
        }, 10);
        
        // 슬라이드 아웃 애니메이션 및 제거
        setTimeout(() => {
            messageDiv.classList.remove('translate-x-0', 'opacity-100');
            messageDiv.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    // 페이지 로드 시 마지막 결과 로드 (옵션)
    loadLastResult() {
        try {
            const lastResult = localStorage.getItem('destinyMatrixLastResult');
            if (lastResult) {
                const result = JSON.parse(lastResult);
                // 원한다면 마지막 결과를 폼에 미리 채워넣을 수 있음
                // const birthdateInput = document.getElementById('birthdate');
                // birthdateInput.value = result.birthdate;
            }
        } catch (error) {
            console.warn('Failed to load last result:', error);
        }
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    const app = new DestinyMatrixCalculator();
    // app.loadLastResult(); // 필요시 주석 해제
});
