// 데스티니 매트릭스 메인 컨트롤러 클래스
class DestinyMatrixCalculator {
    constructor() {
        // 동시성 문제 해결을 위한 상태 관리
        this.isProcessing = false;
        this.currentCalculationPromise = null;
        
        // 필요한 의존성 인스턴스 생성
        this.shareImageGenerator = new ShareImageGenerator();
        this.completeMatrixCalculator = new CompleteDestinyMatrixCalculator();
        this.matrixVisualization = new MatrixVisualization();
        this.premiumAnalysis = new PremiumAnalysis();

        // Calculator 인스턴스를 PremiumAnalysis에 주입
        this.premiumAnalysis.setMatrixCalculator(this.completeMatrixCalculator);

        // 이벤트 리스너 초기화
        this.initializeEventListeners();

        console.log('DestinyMatrixCalculator initialized.');
    }

    initializeEventListeners() {
        const form = document.getElementById('birthdateForm');
        const shareButton = document.getElementById('shareButton');
        const birthdateInput = document.getElementById('birthdate');
        const calculateBtn = document.getElementById('calculateBtn');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit();
            });
        } else {
            console.error("Birthdate form (ID 'birthdateForm') not found!");
            this.showTemporaryMessage('시스템 오류: 폼 요소를 찾을 수 없습니다.', 'error');
        }

        // 초기에는 공유 버튼 숨김
        if (shareButton) {
            shareButton.style.display = 'none';
        } else {
            console.warn("Share button (ID 'shareButton') not found.");
        }

        // 실시간 날짜 유효성 검사
        if (birthdateInput) {
            birthdateInput.addEventListener('input', () => {
                this.hideError();
                this.validateBirthdateInput(birthdateInput.value);
            });
            birthdateInput.addEventListener('blur', () => {
                this.validateBirthdateInput(birthdateInput.value);
            });
            this.validateBirthdateInput(birthdateInput.value);
        } else {
            console.error("Birthdate input (ID 'birthdate') not found");
            this.showTemporaryMessage('시스템 오류: 생년월일 입력 필드를 찾을 수 없습니다.', 'error');
        }

        if (calculateBtn) {
            calculateBtn.disabled = false;
        }
    }

    // 동시성 문제 해결을 위한 개선된 폼 제출 핸들러
    async handleFormSubmit() {
        // 이미 처리 중인 경우 중복 실행 방지
        if (this.isProcessing) {
            this.showTemporaryMessage('이미 계산이 진행 중입니다. 잠시만 기다려주세요.', 'warning');
            return;
        }

        const birthdateInput = document.getElementById('birthdate');
        const calculateBtn = document.getElementById('calculateBtn');
        const resultsSection = document.getElementById('resultsSection');
        const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');

        if (!birthdateInput || !calculateBtn || !resultsSection || !premiumAnalysisSection) {
            console.error("Required elements for form submission not found.");
            this.showTemporaryMessage('시스템 오류: 페이지 요소 로드 실패.', 'error');
            return;
        }

        const birthdate = birthdateInput.value.trim();

        // 입력 유효성 최종 검사
        const validation = this.validateBirthdate(birthdate);
        if (!validation.isValid) {
            this.showError(validation.message);
            this.shakeInput();
            return;
        }

        console.log(`Starting calculation for birthdate: ${birthdate}`);

        // 처리 상태 설정
        this.isProcessing = true;

        // 이전 계산이 진행 중이라면 취소
        if (this.completeMatrixCalculator.isCalculating) {
            this.completeMatrixCalculator.cancelCalculation();
        }

        // 오류 메시지 및 결과 섹션 숨김, 로딩 표시
        this.hideError();
        this.showLoading();
        resultsSection.classList.add('hidden');
        premiumAnalysisSection.classList.add('hidden');

        try {
            // 전체 매트릭스 계산 실행 (현재는 동시성 제어를 계산 클래스 내에서 처리)
            console.log('Calling calculateCompleteMatrix...');
            this.currentCalculationPromise = this.completeMatrixCalculator.calculateCompleteMatrix(birthdate);
            const matrixData = await this.currentCalculationPromise;

            // 계산 결과 유효성 최종 확인
            if (!matrixData || !this.completeMatrixCalculator.validateMatrixData(matrixData)) {
                throw new Error('계산 결과가 유효하지 않습니다. 내부 로직 오류 가능성.');
            }

            console.log('Matrix data calculated successfully:', matrixData);

            const centralNumber = matrixData.P_Core;

            // 전체 매트릭스 시각화 생성 및 표시
            console.log('Generating matrix visualization...');
            this.matrixVisualization.generateFullMatrixChart(matrixData, 'fullMatrixVisualization');

            console.log('Displaying results...');
            await this.displayResults(centralNumber, birthdate, matrixData);

            this.showTemporaryMessage('매트릭스 계산이 완료되었습니다!', 'success');
            console.log('Calculation process finished');

        } catch (error) {
            console.error('Calculation or Display error:', error);

            // 더욱 구체적인 오류 메시지 제공
            let userMessage = '계산 중 오류가 발생했습니다.';
            let detailedError = error.message || '알 수 없는 오류';

            if (detailedError.includes('이미 계산이 진행 중입니다') || detailedError.includes('계산이 중단되었습니다')) {
                userMessage = `동시 접근 오류: ${detailedError}`;
            } else if (detailedError.includes('생년월일 입력') || detailedError.includes('날짜 입력 오류')) {
                userMessage = `입력 오류: ${detailedError}`;
            } else if (detailedError.includes('날짜 형식') || detailedError.includes('존재하지 않는 날짜')) {
                userMessage = `날짜 형식 오류: ${detailedError}`;
            } else if (detailedError.includes('계산 처리 오류') || detailedError.includes('자릿수') || detailedError.includes('숫자 축소')) {
                userMessage = `계산 처리 오류: ${detailedError}\n다른 날짜로 다시 시도해보세요.`;
            } else if (detailedError.includes('계산 결과 검증') || detailedError.includes('유효하지 않습니다')) {
                userMessage = `계산 결과 검증 오류: ${detailedError}\n페이지를 새로고침 후 다시 시도해보세요.`;
            } else if (detailedError.includes('시각화') || detailedError.includes('표시 오류')) {
                userMessage = `결과 표시 오류: ${detailedError}\n페이지를 새로고침 후 다시 시도해보세요.`;
            } else {
                userMessage = `예상치 못한 오류가 발생했습니다: ${detailedError}\n문제가 지속되면 새로고침 후 다시 시도해보세요.`;
            }

            this.showTemporaryMessage(userMessage, 'error');

        } finally {
            // 처리 상태 해제 및 UI 복원
            this.isProcessing = false;
            this.currentCalculationPromise = null;
            this.hideLoading();
            
            if (calculateBtn) {
                calculateBtn.disabled = false;
            }
        }
    }

    // 입력 필드 유효성 검사 및 피드백 표시
    validateBirthdateInput(value) {
        const dateErrorElement = document.getElementById('dateError');
        const birthdateInput = document.getElementById('birthdate');

        if (!dateErrorElement || !birthdateInput) {
            console.error("Validation feedback elements not found");
            return true;
        }

        if (!value) {
            this.hideError();
            birthdateInput.classList.remove('border-green-500', 'border-red-500', 'focus:ring-red-500');
            return true;
        }

        const clientValidation = this.validateBirthdate(value);

        if (!clientValidation.isValid) {
            this.showError(clientValidation.message);
            birthdateInput.classList.add('border-red-500', 'focus:ring-red-500');
            birthdateInput.classList.remove('border-green-500');
            return false;
        } else {
            this.hideError();
            birthdateInput.classList.remove('border-red-500', 'focus:ring-red-500');
            birthdateInput.classList.add('border-green-500');
            return true;
        }
    }

    // 클라이언트 측 날짜 유효성 검사
    validateBirthdate(birthdate) {
        try {
            if (!birthdate || typeof birthdate !== 'string') {
                return { isValid: false, message: '생년월일을 입력해주세요.' };
            }

            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(birthdate)) {
                return { isValid: false, message: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)' };
            }

            const [yearStr, monthStr, dayStr] = birthdate.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);

            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                return { isValid: false, message: '생년월일 숫자를 올바르게 입력해주세요.' };
            }

            const date = new Date(year, month - 1, day);

            if (date.getFullYear() !== year ||
                date.getMonth() + 1 !== month ||
                date.getDate() !== day ||
                date.getTime() !== date.getTime()) {
                return { isValid: false, message: '입력된 날짜가 유효하지 않습니다. (예: 2월 30일)' };
            }

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const inputDate = new Date(year, month - 1, day);

            if (inputDate > today) {
                return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' };
            }

            if (year < 1900) {
                return { isValid: false, message: '1900년 이후 날짜만 입력 가능합니다.' };
            }

            if (year > now.getFullYear()) {
                return { isValid: false, message: `연도는 현재 연도(${now.getFullYear()})를 초과할 수 없습니다.` };
            }

            if (month < 1 || month > 12) {
                return { isValid: false, message: '월은 1-12 사이의 값이어야 합니다.' };
            }

            return { isValid: true, message: '' };

        } catch (error) {
            console.error('Date validation error:', error);
            return { isValid: false, message: '날짜 검증 중 알 수 없는 오류가 발생했습니다.' };
        }
    }

    // 계산 결과를 화면에 표시
    async displayResults(centralNumber, birthdate, matrixData) {
        try {
            console.log(`Displaying results for central number: ${centralNumber}`);

            const centralNumberElement = document.getElementById('centralNumber');
            if (centralNumberElement) {
                centralNumberElement.textContent = centralNumber;
            } else {
                console.warn('Central number element (ID "centralNumber") not found');
            }

            const birthdateInfo = document.getElementById('birthdateInfo');
            if (birthdateInfo) {
                birthdateInfo.textContent = `생년월일: ${birthdate}`;
            } else {
                console.warn('Birthdate info element (ID "birthdateInfo") not found');
            }

            this.displayInterpretation(centralNumber);

            if (centralNumber === 11 || centralNumber === 22) {
                this.showMasterNumberSection(centralNumber);
            } else {
                this.hideMasterNumberSection();
            }

            this.displaySuggestedActions();

            await this.generateAndShowShareImage(centralNumber, birthdate);

            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                console.log('Results section displayed');
            } else {
                console.error('Results section (ID "resultsSection") not found');
            }

            setTimeout(() => {
                if (resultsSection) {
                    resultsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);

            this.animateInterpretationSections();
            this.saveResult(centralNumber, birthdate);

            console.log('Display results process finished');

        } catch (error) {
            console.error('Display results error:', error);
            throw new Error(`결과 표시 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 해석 섹션에 애니메이션 효과 적용
    animateInterpretationSections() {
        try {
            const sectionsToAnimate = document.querySelectorAll('#interpretationSection [data-animate="true"], #premiumAnalysisSection [data-animate="true"]');

            sectionsToAnimate.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 100 + 200);
            });
        } catch (error) {
            console.error('Animate interpretation sections error:', error);
        }
    }

    // 공유 이미지 생성 및 표시
    async generateAndShowShareImage(centralNumber, birthdate) {
        const shareImageContainer = document.getElementById('shareImageContainer');
        if (!shareImageContainer) {
            console.error("Share image container (ID 'shareImageContainer') not found");
            return;
        }

        try {
            shareImageContainer.innerHTML = `
                <div class="text-center text-slate-400 p-8">
                    <svg class="animate-spin h-8 w-8 text-slate-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    결과 이미지 생성 중...
                </div>
            `;

            const matrixData = this.completeMatrixCalculator.getMatrixData();
            if (!matrixData) {
                throw new Error('이미지 생성을 위한 매트릭스 데이터가 없습니다.');
            }
            const imageDataUrl = await this.shareImageGenerator.generateShareImage(matrixData);

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
                     ${navigator.share && navigator.canShare ? `
                     <button
                         id="shareImageBtn"
                         class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                     >
                         결과 공유하기
                     </button>
                     ` : ''}
                </div>
            `;

            const downloadBtn = document.getElementById('downloadImageBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.downloadImage(imageDataUrl, `destiny-matrix-${centralNumber}-${birthdate}.png`);
                });
            } else {
                console.warn("Download button not found after image generation.");
            }

            const shareImgBtn = document.getElementById('shareImageBtn');
            if (shareImgBtn) {
                shareImgBtn.addEventListener('click', async () => {
                    try {
                        const blob = await (await fetch(imageDataUrl)).blob();
                        const filename = `destiny-matrix-${centralNumber}-${birthdate}.png`;
                        const file = new File([blob], filename, { type: blob.type });

                        const shareText = `✨ 저의 데스티니 매트릭스 가운데 숫자는 ${centralNumber}입니다!
당신의 운명의 숫자는 무엇일까요? 🔮
지금 바로 확인해보세요! ${window.location.href}
#데스티니매트릭스 #운명의숫자 #numerology`;

                        if (navigator.canShare && navigator.canShare({ files: [file], text: shareText, url: window.location.href })) {
                            await navigator.share({
                                files: [file],
                                title: '나의 데스티니 매트릭스 결과',
                                text: shareText,
                                url: window.location.href
                            });
                            console.log('Image file shared successfully via Web Share API.');
                        } else {
                            console.warn('Web Share API Level 2 not supported, falling back to text share.');
                            this.shareResult();
                        }
                    } catch (error) {
                        console.error('Error sharing image file:', error);
                        this.showTemporaryMessage('이미지 공유에 실패했습니다. 텍스트로 공유합니다.', 'info');
                        this.shareResult();
                    }
                });
            }

        } catch (error) {
            console.error('Failed to generate share image:', error);
            shareImageContainer.innerHTML = `
                <div class="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
                    <p class="text-red-400 mb-4">결과 이미지 생성에 실패했습니다.</p>
                    <p class="text-red-300 text-sm mb-4">Canvas API가 지원되지 않거나, 브라우저 호환성 문제일 수 있습니다.</p>
                    <button
                        id="shareButtonFallback"
                        class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        텍스트로 결과 공유하기
                    </button>
                </div>
            `;
            const shareButtonFallback = document.getElementById('shareButtonFallback');
            if (shareButtonFallback) {
                shareButtonFallback.addEventListener('click', () => {
                    const matrixData = this.completeMatrixCalculator.getMatrixData();
                    const centralNumber = matrixData ? matrixData.P_Core : '?';
                    this.shareResult(centralNumber, birthdate);
                });
            } else {
                console.warn("Fallback share button not found after image generation failure.");
            }
        }
    }

    // 이미지 다운로드 기능
    downloadImage(dataUrl, filename) {
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showTemporaryMessage('이미지가 다운로드되었습니다!', 'success');
            console.log(`Image downloaded: ${filename}`);
        } catch (error) {
            console.error('Download failed:', error);
            this.showTemporaryMessage('이미지 다운로드에 실패했습니다.', 'error');
        }
    }

    // 텍스트 클립보드 복사
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showTemporaryMessage('클립보드에 복사되었습니다!', 'success');
                console.log('Text copied to clipboard using Clipboard API.');
            }).catch(err => {
                console.warn('Clipboard API writeText failed, falling back:', err);
                this.fallbackCopy(text);
            });
        } else {
            console.warn('Clipboard API not available, falling back.');
            this.fallbackCopy(text);
        }
    }

    // 클립보드 복사 대체 방법
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
                console.log('Text copied to clipboard using fallback method.');
            } else {
                this.showTemporaryMessage('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
                console.warn('Fallback copy command failed.');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showTemporaryMessage('복사 기능을 사용할 수 없습니다.', 'error');
        }

        document.body.removeChild(textArea);
    }

    // 가운데 숫자에 따른 해석 내용을 표시
    displayInterpretation(centralNumber) {
        try {
            const interpretation = window.getInterpretation ? window.getInterpretation(centralNumber) : null;

            const interpretationSection = document.getElementById('interpretationSection');
            const personalityElement = document.getElementById('personalityContent');
            const challengesElement = document.getElementById('challengesContent');

            if (!interpretationSection || !personalityElement || !challengesElement) {
                console.error("Interpretation section elements not found");
                if(interpretationSection) interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">해석 섹션 레이아웃 오류</div>`;
                return;
            }

            if (!interpretation) {
                console.warn(`No interpretation data found for number: ${centralNumber}`);
                interpretationSection.innerHTML = `<div class="text-amber-400 text-center p-8 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                    <p class="text-lg font-semibold mb-2">해석 데이터 없음</p>
                    <p>숫자 ${centralNumber}에 대한 해석 데이터를 찾을 수 없습니다. 관리자에게 문의하거나 나중에 다시 시도해주세요.</p>
                </div>`;
                this.hideMasterNumberSection();
                return;
            }

            personalityElement.innerHTML = `
                <h4 class="text-lg font-semibold mb-3 text-emerald-200">주요 특성</h4>
                <p class="mb-4">${interpretation.personality || '해석 데이터 없음'}</p>
                <h4 class="text-lg font-semibold mb-3 text-emerald-200">타고난 재능</h4>
                <p>${interpretation.talents || '해석 데이터 없음'}</p>
            `;

            challengesElement.innerHTML = `
                <h4 class="text-lg font-semibold mb-3 text-amber-200">삶의 과제</h4>
                <p class="mb-4">${interpretation.challenges || '해석 데이터 없음'}</p>
                <h4 class="text-lg font-semibold mb-3 text-amber-200">조언</h4>
                <p>${interpretation.advice || '해석 데이터 없음'}</p>
            `;

            const relationshipElement = document.getElementById('relationshipContent');
            if (relationshipElement && interpretation.relationship) {
                relationshipElement.innerHTML = `
                    <h4 class="text-lg font-semibold mb-3 text-rose-200">관계 에너지</h4>
                    <p>${interpretation.relationship}</p>
                `;
                relationshipElement.parentElement.setAttribute('data-animate', 'true');
            }
            
            const careerElement = document.getElementById('careerContent');
            if (careerElement && interpretation.career) {
                careerElement.innerHTML = `
                    <h4 class="text-lg font-semibold mb-3 text-indigo-200">직업/재물 에너지</h4>
                    <p>${interpretation.career}</p>
                `;
                careerElement.parentElement.setAttribute('data-animate', 'true');
            }

            interpretationSection.classList.remove('hidden');
            interpretationSection.setAttribute('data-animate', 'true');

        } catch (error) {
            console.error('Display interpretation error:', error);
            const interpretationSection = document.getElementById('interpretationSection');
            if(interpretationSection){
                interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">
                   <p class="text-lg font-semibold mb-2">해석 표시 오류</p>
                   <p>해석 데이터를 불러오거나 표시하는 중 오류가 발생했습니다.</p>
                </div>`;
                interpretationSection.classList.remove('hidden');
            }
        }
    }

    // 마스터 넘버 섹션 표시
    showMasterNumberSection(centralNumber) {
        try {
            const masterNumberSection = document.getElementById('masterNumberSection');
            const masterNumberContent = document.getElementById('masterNumberContent');

            if (!masterNumberSection || !masterNumberContent) {
                console.error("Master number section elements not found");
                return;
            }

            const interpretation = window.getInterpretation ? window.getInterpretation(centralNumber) : null;

            if (!interpretation || !interpretation.masterNumber) {
                console.warn(`Master number specific interpretation not found for: ${centralNumber}`);
                this.hideMasterNumberSection();
                return;
            }

            masterNumberContent.innerHTML = `
                <div class="bg-purple-400/10 rounded-2xl p-6 border border-purple-300/20">
                    <h4 class="text-lg font-semibold mb-3 text-purple-200">⭐ 마스터 넘버 ${centralNumber}의 특별한 의미</h4>
                    <p class="mb-4">${interpretation.masterNumber}</p>
                    <div class="text-sm text-purple-300 bg-purple-500/20 rounded-xl p-4">
                        <strong>⚡ 마스터 넘버는 강력한 영적 에너지와 잠재력을 의미합니다.</strong><br>
                        이는 일반적인 숫자보다 더 큰 도전과 기회를 가져올 수 있으며, 의식적인 개발과 균형이 중요합니다.
                    </div>
                </div>
            `;

            masterNumberSection.classList.remove('hidden');
            masterNumberSection.setAttribute('data-animate', 'true');
            console.log(`Master number section shown for ${centralNumber}`);
        } catch (error) {
            console.error('Show master number section error:', error);
            this.hideMasterNumberSection();
        }
    }

    // 마스터 넘버 섹션 숨김
    hideMasterNumberSection() {
        try {
            const masterNumberSection = document.getElementById('masterNumberSection');
            if (masterNumberSection) {
                masterNumberSection.classList.add('hidden');
                masterNumberSection.removeAttribute('data-animate');
                masterNumberSection.style.opacity = '';
                masterNumberSection.style.transform = '';
                console.log('Master number section hidden.');
            }
        } catch (error) {
            console.error('Hide master number section error:', error);
        }
    }

    // 추천 조치 표시
    displaySuggestedActions() {
        try {
            const actionsContainer = document.getElementById('suggestedActionsContent');
            const actionsSection = document.getElementById('suggestedActionsSection');

            if (!actionsContainer || !actionsSection) {
                console.warn("Suggested actions elements not found");
                return;
            }

            const suggestions = this.completeMatrixCalculator.getSuggestedActions();

            if (!suggestions || suggestions.length === 0) {
                actionsSection.classList.add('hidden');
                actionsSection.removeAttribute('data-animate');
                actionsContainer.innerHTML = '';
                console.log('No suggested actions to display.');
                return;
            }

            const actionsHtml = suggestions.map(sugg => `
                <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-3 last:mb-0">
                    <h5 class="text-md font-semibold text-violet-300 mb-2">${sugg.category}</h5>
                    <p class="text-slate-300 text-sm">${sugg.action}</p>
                </div>
            `).join('');

            actionsContainer.innerHTML = actionsHtml;

            actionsSection.classList.remove('hidden');
            actionsSection.setAttribute('data-animate', 'true');
            console.log(`Displayed ${suggestions.length} suggested actions.`);

        } catch (error) {
            console.error('Display suggested actions error:', error);
            const actionsSection = document.getElementById('suggestedActionsSection');
            const actionsContainer = document.getElementById('suggestedActionsContent');
            if(actionsSection && actionsContainer){
                actionsContainer.innerHTML = `<div class="text-red-400 text-center p-4">조언을 불러오는 중 오류가 발생했습니다.</div>`;
                actionsSection.classList.remove('hidden');
                actionsSection.setAttribute('data-animate', 'true');
            }
        }
    }

    // 입력 필드 흔들기 애니메이션
    shakeInput() {
        try {
            const birthdateInput = document.getElementById('birthdate');
            if (birthdateInput) {
                birthdateInput.classList.add('shake-animation');
                setTimeout(() => {
                    birthdateInput.classList.remove('shake-animation');
                }, 600);
            }
        } catch (error) {
            console.error('Shake input error:', error);
        }
    }

    // 로딩 상태 UI 표시
    showLoading() {
        try {
            const loadingSection = document.getElementById('loadingSection');
            const resultsSection = document.getElementById('resultsSection');
            const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');
            const calculateBtn = document.getElementById('calculateBtn');

            if (loadingSection) loadingSection.classList.remove('hidden');
            if (resultsSection) resultsSection.classList.add('hidden');
            if (premiumAnalysisSection) premiumAnalysisSection.classList.add('hidden');

            if (calculateBtn) {
                calculateBtn.disabled = true;
                calculateBtn.textContent = '계산 중...';
                calculateBtn.classList.add('loading');
            }

            console.log('UI: Loading state activated.');
        } catch (error) {
            console.error('Show loading error:', error);
        }
    }

    // 로딩 상태 UI 숨김
    hideLoading() {
        try {
            const loadingSection = document.getElementById('loadingSection');
            const calculateBtn = document.getElementById('calculateBtn');

            if (loadingSection) loadingSection.classList.add('hidden');

            if (calculateBtn) {
                calculateBtn.disabled = false;
                calculateBtn.textContent = '데스티니 매트릭스 차트 생성하기';
                calculateBtn.classList.remove('loading');
            }

            console.log('UI: Loading state deactivated.');
        } catch (error) {
            console.error('Hide loading error:', error);
        }
    }

    // 오류 메시지 표시
    showError(message) {
        try {
            const errorElement = document.getElementById('dateError');
            const birthdateInput = document.getElementById('birthdate');

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
            } else {
                console.warn("Error element not found.");
                this.showTemporaryMessage(message, 'error');
            }

            if (birthdateInput) {
                birthdateInput.classList.add('border-red-500', 'focus:ring-red-500');
                birthdateInput.classList.remove('border-green-500');
            } else {
                console.warn("Birthdate input element not found for error styling.");
            }

        } catch (error) {
            console.error('Show error failed:', error);
        }
    }

    // 오류 메시지 숨김
    hideError() {
        try {
            const errorElement = document.getElementById('dateError');
            const birthdateInput = document.getElementById('birthdate');

            if (errorElement) {
                errorElement.classList.add('hidden');
            } else {
                const tempErrorMsg = document.getElementById('tempNotification');
                if(tempErrorMsg && tempErrorMsg.textContent.includes('오류')){
                     tempErrorMsg.remove();
                }
            }

            if (birthdateInput) {
                birthdateInput.classList.remove('border-red-500', 'focus:ring-red-500');
            }

        } catch (error) {
            console.error('Hide error failed:', error);
        }
    }

    // 계산 결과 로컬 스토리지에 저장
    saveResult(centralNumber, birthdate) {
        try {
            const result = {
                centralNumber,
                birthdate,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('destinyMatrixLastResult', JSON.stringify(result));
            console.log('Result saved to localStorage.');
        } catch (error) {
            console.warn('Failed to save result to localStorage:', error);
        }
    }

    // 결과 공유 (텍스트 기반)
    shareResult(centralNumber = '?', birthdate = '결과') {
        try {
            if (centralNumber === '?') {
                const centralNumberElement = document.getElementById('centralNumber');
                centralNumber = centralNumberElement?.textContent || '?';
            }

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
                }).then(() => {
                    console.log('Text shared successfully via Web Share API.');
                }).catch(error => {
                    console.warn('Web Share API text share failed:', error);
                    this.showTemporaryMessage('공유 창 호출에 실패했습니다. 클립보드에 복사합니다.', 'info');
                    this.copyToClipboard(shareText);
                });
            } else {
                console.warn('Web Share API not available for text share, falling back to clipboard.');
                this.copyToClipboard(shareText);
            }
        } catch (error) {
            console.error('Share result error:', error);
            this.showTemporaryMessage('결과 공유 중 알 수 없는 오류가 발생했습니다.', 'error');
        }
    }

    // 화면 상단/하단에 임시 메시지 표시
    showTemporaryMessage(message, type = 'info', duration = null) {
        try {
            const existingMessage = document.getElementById('tempNotification');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.id = 'tempNotification';

            const bgColor = type === 'success' ? 'bg-green-500' :
                           type === 'error' ? 'bg-red-500' :
                           type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

            messageDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0`;
            messageDiv.style.maxWidth = '90%';

            const messageLines = message.split('\n');
            if (messageLines.length > 1) {
                messageDiv.innerHTML = messageLines.map(line => `<div>${line}</div>`).join('');
                messageDiv.style.whiteSpace = 'pre-line';
                messageDiv.style.maxWidth = '400px';
            } else {
                messageDiv.textContent = message;
            }

            document.body.appendChild(messageDiv);

            setTimeout(() => {
                messageDiv.classList.remove('translate-x-full', 'opacity-0');
                messageDiv.classList.add('translate-x-0', 'opacity-100');
            }, 50);

            const displayDuration = duration !== null ? duration : (type === 'error' ? 10000 : 3000);

            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    messageDiv.classList.remove('translate-x-0', 'opacity-100');
                    messageDiv.classList.add('translate-x-full', 'opacity-0');

                    setTimeout(() => {
                        if (document.body.contains(messageDiv)) {
                            document.body.removeChild(messageDiv);
                        }
                    }, 300);
                }
            }, displayDuration);

            console.log(`Temporary message displayed: Type=${type}, Message="${message}"`);

        } catch (error) {
            console.error('Show temporary message error:', error);
            alert(`오류 알림 시스템 오류 발생! 원본 메시지: ${message}`);
        }
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM fully loaded. Initializing Destiny Matrix Calculator application.');
        const app = new DestinyMatrixCalculator();
        console.log('Destiny Matrix Calculator application initialized.');
    } catch (error) {
        console.error('Failed to initialize Destiny Matrix Calculator application:', error);

        const initializationErrorDiv = document.createElement('div');
        initializationErrorDiv.className = 'fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white p-8 z-[100]';
        initializationErrorDiv.innerHTML = `
            <h1 class="text-2xl font-bold text-red-500 mb-4">애플리케이션 초기화 오류</h1>
            <p class="text-lg text-center mb-6">페이지 로딩 중 문제가 발생했습니다.</p>
            <p class="text-sm text-slate-300 text-center mb-8">${error.message || '자세한 정보는 콘솔을 확인해주세요.'}</p>
            <button onclick="window.location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                페이지 새로고침
            </button>
             <p class="text-xs text-slate-400 mt-4">문제가 지속되면 브라우저를 변경하거나 개발자에게 문의해주세요.</p>
        `;
        document.body.appendChild(initializationErrorDiv);

        const loadingSection = document.getElementById('loadingSection');
        if(loadingSection) loadingSection.classList.add('hidden');

        const calculateBtn = document.getElementById('calculateBtn');
        if(calculateBtn) calculateBtn.disabled = true;
    }
});
