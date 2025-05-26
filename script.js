// 데스티니 매트릭스 메인 컨트롤러 클래스
class DestinyMatrixCalculator {
    constructor() {
        this.shareImageGenerator = new ShareImageGenerator();
        // CompleteDestinyMatrixCalculator 클래스는 이미 전역에 노출되어 있다고 가정
        if (typeof CompleteDestinyMatrixCalculator === 'undefined') {
             console.error("Error: CompleteDestinyMatrixCalculator class not found. Make sure destiny-matrix-calculator.js is loaded BEFORE script.js.");
             //throw new Error("Required calculator component missing."); // 초기화 실패 처리로 대체
        }
        this.completeMatrixCalculator = new CompleteDestinyMatrixCalculator();
         // MatrixVisualization, PremiumAnalysis 클래스 존재 여부도 확인 (초기화 오류 방지)
         if (typeof MatrixVisualization === 'undefined' || typeof PremiumAnalysis === 'undefined') {
              console.error("Error: Required visualization or analysis component missing. Make sure corresponding JS files are loaded.");
             //throw new Error("Required visualization or analysis component missing."); // 초기화 실패 처리로 대체
         }
        this.matrixVisualization = new MatrixVisualization();
        this.premiumAnalysis = new PremiumAnalysis();

        // Calculator 인스턴스를 PremiumAnalysis에 주입 (의존성 주입)
        this.premiumAnalysis.setMatrixCalculator(this.completeMatrixCalculator);

        // 이벤트 리스너 초기화
        this.initializeEventListeners();
         // 앱 초기화 시 로딩 상태 제거 및 버튼 활성화 확인
         this.hideLoading();
         const calculateBtn = document.getElementById('calculateBtn');
         if (calculateBtn) {
             calculateBtn.disabled = false;
         } else {
             console.warn("Calculate button not found during initialization.");
         }

        console.log('DestinyMatrixCalculator initialized.');
    }

    // 모든 이벤트 리스너를 설정하는 함수
    initializeEventListeners() {
        console.log('Initializing event listeners...');
        const form = document.getElementById('birthdateForm');
        // const shareButton = document.getElementById('shareButton'); // shareButton은 이미지 생성 후 동적으로 생성되므로 여기에 이벤트 리스너 추가하지 않음
        const birthdateInput = document.getElementById('birthdate');
        const calculateBtn = document.getElementById('calculateBtn');

        // 폼 제출 이벤트
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // 기본 폼 제출 방지
                await this.handleFormSubmit(); // 비동기 폼 제출 핸들러 호출
            });
            console.log('Form submit listener added.');
        } else {
            console.error("Birthdate form (ID 'birthdateForm') not found!");
            this.showTemporaryMessage('시스템 오류: 필수 요소(폼)를 찾을 수 없습니다.', 'error');
        }

        // 실시간 날짜 유효성 검사 및 피드백 (input, blur 이벤트)
        if (birthdateInput) {
            birthdateInput.addEventListener('input', () => {
                this.validateBirthdateInput(birthdateInput.value);
            });
            birthdateInput.addEventListener('blur', () => {
                this.validateBirthdateInput(birthdateInput.value);
            });
             // 페이지 로드 시 초기 입력 필드 상태에 대한 유효성 검사 수행
            this.validateBirthdateInput(birthdateInput.value); // 페이지 로드 시 현재 값 검사

            console.log('Birthdate input listeners added.');
        } else {
            console.error("Birthdate input (ID 'birthdate') not found");
            this.showTemporaryMessage('시스템 오류: 필수 요소(생년월일 입력 필드)를 찾을 수 없습니다.', 'error');
        }

        // 계산 버튼 상태 초기화 (활성화)
        if (calculateBtn) {
            calculateBtn.disabled = false;
             console.log('Calculate button initialized.');
        } else {
            console.warn("Calculate button (ID 'calculateBtn') not found.");
        }

         console.log('Event listeners initialization complete.');
    }

    // 동시성 문제 해결을 위한 개선된 폼 제출 핸들러는 Wh5Qz 버전에 없었으므로,
    // JfngO에 포함된 Wh5Qz 작업 결과 문서 내용을 기반으로 재구성합니다.
    // (Note: User referenced LUqf6 results, which points back to Wh5Qz for script.js.
    // The provided text for script.js in the JfngO doc is *different* from the Wh5Qz ref section,
    // but the prompt asks me to use the Wh5Qz version. I will use the Wh5Qz version provided in the JfngO ref doc,
    // assuming that was the intended "latest" version before the image error report).
    // Reverting to the simpler handleFormSubmit from the provided Wh5Qz script.js section.

     async handleFormSubmit() {
        try {
            const birthdateInput = document.getElementById('birthdate');
            const resultsSection = document.getElementById('resultsSection');
            const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');

            if (!birthdateInput) {
                throw new Error('입력 필드를 찾을 수 없습니다.');
            }

            const birthdate = birthdateInput.value.trim();

            // 입력 유효성 검사
            const validation = this.validateBirthdate(birthdate);
            if (!validation.isValid) {
                this.showError(validation.message);
                this.shakeInput();
                return;
            }

            console.log(`Starting calculation for birthdate: ${birthdate}`);

            this.hideError();
            this.showLoading();

            // 계산 시뮬레이션을 위한 지연 (선택적, 제거 가능)
            // await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 상태 확인용 지연

            // 전체 매트릭스 계산
            console.log('Calling completeMatrixCalculator.calculateCompleteMatrix...');
             // Calculator 클래스에 동시성 로직이 있다면, 해당 로직에 의해 이전 계산은 무시되거나 취소될 수 있습니다.
             // 여기 script.js에서는 간단히 호출하고 결과를 기다립니다.
            const matrixData = await this.completeMatrixCalculator.calculateCompleteMatrix(birthdate);

            // 계산 결과 유효성 최종 확인 (calculator 내부에서도 하지만, 외부에서도 기본 확인)
            if (!matrixData || typeof matrixData !== 'object' || !matrixData.P_Core) {
                 throw new Error('계산 결과 객체가 생성되지 않았거나 유효하지 않습니다.');
             }

            console.log('Matrix data calculated:', matrixData);

            const centralNumber = matrixData.P_Core;

            // 전체 매트릭스 시각화 (만약 matrixVisualization가 Canvas나 SVG를 생성한다면)
            // 시각화 자체의 성공 여부와 이미지 생성은 분리
            console.log('Attempting matrix visualization...');
            try {
                 if (this.matrixVisualization && typeof this.matrixVisualization.generateFullMatrixChart === 'function') {
                     this.matrixVisualization.generateFullMatrixChart(matrixData, 'fullMatrixVisualization');
                     console.log('Matrix visualization generated.');
                 } else {
                      console.warn('MatrixVisualization component or method not available.');
                      // 시각화 기능이 없어도 이미지 생성은 시도
                 }
            } catch (visError) {
                 console.error('Error generating matrix visualization:', visError);
                 // 시각화 오류는 이미지 생성/결과 표시에 치명적이지 않을 수 있으므로 throw하지 않음
                 this.showTemporaryMessage('매트릭스 차트 시각화 중 오류가 발생했지만, 계산 결과는 확인 가능합니다.', 'warning', 5000);
            }


            console.log('Displaying results...');
            await this.displayResults(centralNumber, birthdate, matrixData);

            // 심층 분석 표시 (결과 표시 후)
            this.displayPremiumAnalysis(); // PremiumAnalysis 클래스를 사용

            // 성공 메시지 표시
            this.showTemporaryMessage('데스티니 매트릭스 계산 및 분석이 완료되었습니다!', 'success');
            console.log('Calculation completed successfully');

        } catch (error) {
            console.error('Form submission or calculation error:', error);

            // 에러 메시지 표시 (Calculator에서 던진 메시지 활용)
            let userMessage = error.message || '알 수 없는 오류가 발생했습니다.';

            // 로딩 상태 해제 전에 오류 메시지를 표시할 수 있도록 showTemporaryMessage 호출
            this.showTemporaryMessage(userMessage, 'error', 10000); // 에러 메시지는 좀 더 오래 표시

            // 오류 발생 시 결과 섹션 및 프리미엄 분석 섹션이 숨겨진 상태 유지
            const resultsSection = document.getElementById('resultsSection');
            const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');
            if (resultsSection) resultsSection.classList.add('hidden');
            if (premiumAnalysisSection) premiumAnalysisSection.classList.add('hidden');

        } finally {
            // 처리 상태 해제 및 UI 복원
            this.hideLoading();
            console.log('Form submission handling finished.');
        }
    }


    validateBirthdateInput(value) {
        const dateErrorElement = document.getElementById('dateError');
        const birthdateInput = document.getElementById('birthdate');

        if (!dateErrorElement || !birthdateInput) {
            console.error("Validation elements not found");
            return true;
        }

        if (!value) {
            this.hideError();
            birthdateInput.classList.remove('border-green-500');
            return true;
        }

        const validation = this.validateBirthdate(value);
        if (!validation.isValid) {
            this.showError(validation.message);
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

            const date = new Date(year, month - 1, day); // month는 0부터 시작

            if (date.getFullYear() !== year ||
                date.getMonth() + 1 !== month ||
                date.getDate() !== day ||
                date.getTime() !== date.getTime()) { // Invalid Date check
                return { isValid: false, message: '입력된 날짜가 유효하지 않습니다.' };
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
             if (day < 1 || day > 31) {
                  return { isValid: false, message: '일은 1-31 사이의 값이어야 합니다.' };
             }


            return { isValid: true, message: '' };

        } catch (error) {
            console.error('Date validation error:', error);
            return { isValid: false, message: '날짜 검증 중 알 수 없는 오류가 발생했습니다.' };
        }
    }

    async displayResults(centralNumber, birthdate, matrixData) {
        try {
            console.log(`Displaying results for central number: ${centralNumber}, birthdate: ${birthdate}`);

            // 가운데 숫자 표시
            const centralNumberElement = document.getElementById('centralNumber');
            if (centralNumberElement) {
                centralNumberElement.textContent = centralNumber;
                 console.log(`Central number ${centralNumber} displayed.`);
            } else {
                console.warn('Central number element (ID "centralNumber") not found. Cannot display central number.');
            }

            // 생년월일 정보 표시
            const birthdateInfo = document.getElementById('birthdateInfo');
            if (birthdateInfo) {
                birthdateInfo.textContent = `생년월일: ${birthdate}`;
                 console.log(`Birthdate info "${birthdate}" displayed.`);
            } else {
                console.warn('Birthdate info element (ID "birthdateInfo") not found. Cannot display birthdate.');
            }

            // 가운데 숫자에 따른 해석 내용 표시
            this.displayInterpretation(centralNumber);

            // 마스터 넘버(11, 22)인 경우 특별 섹션 표시
            if (centralNumber === 11 || centralNumber === 22) {
                this.showMasterNumberSection(centralNumber);
            } else {
                this.hideMasterNumberSection();
            }

            // 계산된 매트릭스 데이터에 기반한 조언 섹션 표시
            this.displaySuggestedActions(); // Wh5Qz 버전에는 없었지만, JfngO 버전에는 있었으므로 포함

            // 결과 이미지 생성 및 표시 (비동기 작업)
            await this.generateAndShowShareImage(matrixData); // matrixData 객체 전달로 변경

            // 결과 섹션 전체 표시 (숨김 해제)
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                console.log('Results section made visible.');
            } else {
                console.error('Results section (ID "resultsSection") not found. Cannot make it visible.');
                throw new Error('결과 표시 영역을 찾을 수 없습니다.');
            }

            // 결과 섹션으로 스크롤 이동
            setTimeout(() => {
                if (resultsSection) {
                    resultsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    console.log('Scrolled to results section.');
                }
            }, 300);

            // 애니메이션 효과 적용
            this.animateInterpretationSections();

            // 계산 결과 로컬 스토리지에 저장
            this.saveResult(centralNumber, birthdate);

            console.log('Display results process finished.');

        } catch (error) {
            console.error('Display results error:', error);
            // 이 함수 내에서 발생한 오류를 상위 호출자에게 다시 throw
            throw new Error(`결과 표시 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    animateInterpretationSections() {
        try {
            const sections = document.querySelectorAll('#interpretationSection [data-animate="true"], #masterNumberSection [data-animate="true"], #suggestedActionsSection [data-animate="true"], #premiumAnalysisSection [data-animate="true"]'); // 모든 애니메이션 대상 섹션 포함

             if (sections.length === 0) {
                 console.log('No sections found with data-animate="true". Skipping animation.');
                 return;
            }

            sections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                 section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'; // 애니메이션 속성 추가

                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 150 + 200); // 인덱스에 따라 지연 시간 증가
            });
             console.log(`${sections.length} sections animation applied.`);

        } catch (error) {
            console.error('Animation error:', error);
        }
    }

     // generateAndShowShareImage 함수 수정: matrixData 객체를 인자로 받도록 변경
    async generateAndShowShareImage(matrixData) {
        console.log('Attempting to generate and show share image...');
        const shareImageContainer = document.getElementById('shareImageContainer');
        if (!shareImageContainer) {
            console.error("Share image container (ID 'shareImageContainer') not found. Cannot display share image.");
            return; // 이미지가 표시되지 않아도 다른 결과는 표시되어야 하므로 여기서 throw 하지 않음.
        }

        try {
            // 이미지 생성 중임을 나타내는 UI 표시
            shareImageContainer.innerHTML = `
                <div class="text-center text-slate-400 p-8">
                    <svg class="animate-spin h-8 w-8 text-slate-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    결과 이미지 생성 중...
                </div>
            `;
             console.log('Share image container updated to loading state.');


            // 이미지 생성 로직 호출 (ShareImageGenerator 클래스 사용)
            // generateShareImage 함수는 matrixData 객체를 받음
            const imageDataUrl = await this.shareImageGenerator.generateShareImage(matrixData);

             if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/png;base64,')) {
                  throw new Error('이미지 생성 결과가 유효한 Data URL 형식이 아닙니다.');
             }
             console.log('Share image Data URL generated successfully.');


            // 생성된 이미지를 화면에 표시하고 다운로드/공유 버튼 추가
             // matrixData에서 centralNumber와 birthdate를 직접 사용
            const centralNumber = matrixData.P_Core;
            const birthdate = matrixData.birthdate;

            shareImageContainer.innerHTML = `
                <img
                    src="${imageDataUrl}"
                    alt="데스티니 매트릭스 결과 공유 이미지"
                    class="w-full max-w-sm mx-auto rounded-3xl shadow-2xl opacity-0 transform scale-95 transition-all duration-500"
                    onload="this.style.opacity='1'; this.style.transform='scale(1)';" // 이미지 로드 완료 시 애니메이션 적용
                >
                <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        id="downloadImageBtn"
                        class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        이미지 저장하기
                    </button>
                     ${navigator.share && navigator.canShare && navigator.canShare({ files: [] }) ? `
                     <button
                         id="shareImageBtn"
                         class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                     >
                         결과 공유하기
                     </button>
                     ` : ''} <!-- Web Share API Level 2 (파일 공유) 지원 여부에 따라 버튼 표시 -->
                </div>
            `;
            console.log('Share image and buttons displayed.');


            // 다운로드 버튼 이벤트 리스너 추가
            const downloadBtn = document.getElementById('downloadImageBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    // 이미지 파일명 생성 (예: destiny-matrix-15-1990-01-15.png)
                    const filename = `destiny-matrix-${centralNumber}-${birthdate}.png`;
                    this.downloadImage(imageDataUrl, filename); // 다운로드 함수 호출
                });
                console.log('Download button listener added.');
            } else {
                console.warn("Download button (ID 'downloadImageBtn') not found after dynamic creation.");
            }

            // 공유 버튼 이벤트 리스너 추가 (Web Share API 레벨 2 지원 시)
            const shareImgBtn = document.getElementById('shareImageBtn');
            if (shareImgBtn) {
                shareImgBtn.addEventListener('click', async () => {
                    console.log('Share image button clicked.');
                    try {
                         // Data URL을 Blob으로 변환하여 파일 생성
                        const blob = await (await fetch(imageDataUrl)).blob();
                        const filename = `destiny-matrix-${centralNumber}-${birthdate}.png`;
                        const file = new File([blob], filename, { type: blob.type });

                        // 공유 텍스트 생성
                        const shareText = `✨ 저의 데스티니 매트릭스 가운데 숫자는 ${centralNumber}입니다!
당신의 운명의 숫자는 무엇일까요? 🔮
지금 바로 확인해보세요! ${window.location.href}
#데스티니매트릭스 #운명의숫자 #numerology`;

                        // Web Share API Level 2 (파일 공유) 지원 여부 최종 확인
                        if (navigator.canShare && navigator.canShare({ files: [file], text: shareText, url: window.location.href })) {
                            await navigator.share({
                                files: [file], // 이미지 파일 공유
                                title: '나의 데스티니 매트릭스 결과',
                                text: shareText,
                                url: window.location.href // 페이지 URL 공유
                            });
                            console.log('Image file shared successfully via Web Share API.');
                        } else {
                            console.warn('Web Share API Level 2 not fully supported for sharing files with text/url, falling back to text share.');
                            // 이미지 공유가 지원되지 않으면 텍스트 공유로 대체
                            this.showTemporaryMessage('이미지 공유는 지원되지 않아 텍스트로 공유합니다.', 'info');
                            this.shareResult(centralNumber, birthdate); // 텍스트 공유 함수 호출
                        }
                    } catch (error) {
                        console.error('Error sharing image file:', error);
                         // 이미지 공유 중 오류 발생 시 텍스트 공유로 대체
                        this.showTemporaryMessage('이미지 공유에 실패했습니다. 텍스트로 공유합니다.', 'info');
                        this.shareResult(centralNumber, birthdate);
                    }
                });
                console.log('Share image button listener added.');
            } // else: Share button was not displayed if API not supported

            console.log('Generate and show share image process finished.');

        } catch (error) {
            console.error('Failed to generate share image:', error);
            // 이미지 생성 실패 시 대체 UI 표시 및 텍스트 공유 버튼 제공
            shareImageContainer.innerHTML = `
                <div class="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
                    <p class="text-red-400 mb-4 font-semibold">결과 이미지 생성에 실패했습니다.</p>
                    <p class="text-red-300 text-sm mb-4">${error.message || '알 수 없는 오류가 발생했습니다.'}</p>
                    <p class="text-red-300 text-sm mb-4">브라우저 환경 또는 내부 문제일 수 있습니다.</p>
                    <button
                        id="shareButtonFallback"
                        class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        텍스트로 결과 공유하기
                    </button>
                </div>
            `;
             console.log('Share image generation failed. Fallback UI displayed.');
            const shareButtonFallback = document.getElementById('shareButtonFallback');
            if (shareButtonFallback) {
                shareButtonFallback.addEventListener('click', () => {
                    // 실패 시에도 중앙 숫자는 알 수 있으므로 넘겨줌
                    const matrixData = this.completeMatrixCalculator.getMatrixData();
                    const centralNumberFallback = matrixData ? matrixData.P_Core : '?';
                    const birthdateFallback = matrixData ? matrixData.birthdate : '?'; // 생년월일도 함께 전달
                    this.shareResult(centralNumberFallback, birthdateFallback); // 텍스트 공유 함수 호출
                });
                console.log('Fallback share button listener added.');
            } else {
                 console.warn("Fallback share button (ID 'shareButtonFallback') not found after image generation failure.");
            }
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
            console.log(`Image downloaded: ${filename}`);
        } catch (error) {
            console.error('Download failed:', error);
            this.showTemporaryMessage('이미지 다운로드에 실패했습니다. 브라우저 설정을 확인해주세요.', 'error');
        }
    }

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
                console.log('Text copied to clipboard using fallback method (execCommand).');
            } else {
                this.showTemporaryMessage('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
                console.warn('Fallback copy command (execCommand) failed.');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showTemporaryMessage('복사 기능을 사용할 수 없습니다.', 'error');
        }

        document.body.removeChild(textArea);
    }

    displayInterpretation(centralNumber) {
        console.log(`Displaying interpretation for central number: ${centralNumber}`);
        try {
            // window.getInterpretation 함수를 통해 해석 데이터 가져옴 (interpretations.js에서 제공)
            if (typeof window.getInterpretation !== 'function') {
                 console.error("Error: window.getInterpretation function not found. Make sure interpretations.js is loaded.");
                 const interpretationSection = document.getElementById('interpretationSection');
                 if(interpretationSection){
                      interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">
                         <p class="text-lg font-semibold mb-2">해석 데이터 로드 오류</p>
                         <p>해석 데이터를 불러오는 함수를 찾을 수 없습니다. 스크립트 파일 로딩 순서를 확인해주세요.</p>
                      </div>`;
                      interpretationSection.classList.remove('hidden');
                 }
                 this.hideMasterNumberSection(); // 관련 섹션 숨김
                 return;
            }

            const interpretation = window.getInterpretation(centralNumber);

            // 해석 내용이 표시될 각 영역 요소 가져오기
            const interpretationSection = document.getElementById('interpretationSection'); // 전체 해석 섹션
            const personalityElement = document.getElementById('personalityContent'); // 성격/재능 영역
            const challengesElement = document.getElementById('challengesContent'); // 과제/조언 영역
            const relationshipElement = document.getElementById('relationshipContent'); // 관계 영역 (있다면)
            const careerElement = document.getElementById('careerContent'); // 직업/재물 영역 (있다면)


            // 필수 해석 영역 요소가 없으면 오류 처리
            if (!interpretationSection || !personalityElement || !challengesElement) {
                console.error("Essential interpretation section elements not found (interpretationSection, personalityContent, challengesContent). Cannot display interpretation.");
                if(interpretationSection) interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">해석 섹션 필수 레이아웃 요소 오류</div>`;
                 this.hideMasterNumberSection(); // 관련 섹션 숨김
                return;
            }

            // 해당 숫자에 대한 해석 데이터가 없는 경우
            if (!interpretation) {
                console.warn(`No interpretation data found for number: ${centralNumber}`);
                interpretationSection.innerHTML = `<div class="text-amber-400 text-center p-8 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                    <p class="text-lg font-semibold mb-2">해석 데이터 없음</p>
                    <p>숫자 ${centralNumber}에 대한 해석 데이터를 찾을 수 없습니다. 데이터 파일을 확인해주세요.</p>
                </div>`;
                interpretationSection.classList.remove('hidden');
                this.hideMasterNumberSection(); // 마스터 넘버 섹션도 숨김
                return;
            }

            // 해석 데이터를 가져왔으면 각 영역에 내용 채우기
            // personalityContent 영역
            if (personalityElement) {
                 personalityElement.innerHTML = `
                     <h4 class="text-lg font-semibold mb-3 text-emerald-200">주요 특성</h4>
                     <p class="mb-4">${interpretation.personality || '해석 데이터 없음'}</p>
                     <h4 class="text-lg font-semibold mb-3 text-emerald-200">타고난 재능</h4>
                     <p>${interpretation.talents || '해석 데이터 없음'}</p>
                 `;
                  personalityElement.parentElement.setAttribute('data-animate', 'true');
            }


            // challengesContent 영역
            if (challengesElement) {
                 challengesElement.innerHTML = `
                     <h4 class="text-lg font-semibold mb-3 text-amber-200">삶의 과제</h4>
                     <p class="mb-4">${interpretation.challenges || '해석 데이터 없음'}</p>
                     <h4 class="text-lg font-semibold mb-3 text-amber-200">조언</h4>
                     <p>${interpretation.advice || '해석 데이터 없음'}</p>
                 `;
                 challengesElement.parentElement.setAttribute('data-animate', 'true');
            }

            // relationshipContent 영역 (해석 데이터에 관계 필드가 있는 경우에만 표시)
            if (relationshipElement) { // 요소가 HTML에 존재하는지 먼저 확인
                if (interpretation.relationship) {
                    relationshipElement.innerHTML = `
                        <h4 class="text-lg font-semibold mb-3 text-rose-200">관계 에너지</h4>
                        <p>${interpretation.relationship}</p>
                    `;
                    relationshipElement.parentElement.classList.remove('hidden'); // 관계 섹션 숨김 해제
                    relationshipElement.parentElement.setAttribute('data-animate', 'true'); // 애니메이션 속성 추가
                } else {
                    relationshipElement.parentElement.classList.add('hidden'); // 관계 데이터 없으면 숨김
                    relationshipElement.parentElement.removeAttribute('data-animate');
                }
            } else {
                 console.warn("Relationship interpretation element (ID 'relationshipContent') not found.");
            }


            // careerContent 영역 (해석 데이터에 직업 필드가 있는 경우에만 표시)
            if (careerElement) { // 요소가 HTML에 존재하는지 먼저 확인
                 if (interpretation.career) {
                     careerElement.innerHTML = `
                         <h4 class="text-lg font-semibold mb-3 text-indigo-200">직업/재물 에너지</h4>
                         <p>${interpretation.career}</p>
                     `;
                     careerElement.parentElement.classList.remove('hidden'); // 직업 섹션 숨김 해제
                     careerElement.parentElement.setAttribute('data-animate', 'true'); // 애니메이션 속성 추가
                 } else {
                     careerElement.parentElement.classList.add('hidden'); // 직업 데이터 없으면 숨김
                     careerElement.parentElement.removeAttribute('data-animate');
                 }
             } else {
                 console.warn("Career interpretation element (ID 'careerContent') not found.");
             }


            // 전체 해석 섹션 표시 (숨김 해제)
            interpretationSection.classList.remove('hidden');
            interpretationSection.setAttribute('data-animate', 'true'); // 전체 섹션 컨테이너에도 애니메이션 속성 추가
            console.log(`Interpretation for ${centralNumber} displayed.`);


        } catch (error) {
            console.error('Display interpretation error:', error);
             const interpretationSection = document.getElementById('interpretationSection');
             if(interpretationSection){
                  interpretationSection.innerHTML = `<div class="text-red-400 text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">
                     <p class="text-lg font-semibold mb-2">해석 표시 오류</p>
                     <p>해석 데이터를 가져오거나 화면에 표시하는 중 오류가 발생했습니다. 콘솔을 확인해주세요.</p>
                  </div>`;
                  interpretationSection.classList.remove('hidden');
             }
             this.hideMasterNumberSection(); // 오류 발생 시 마스터 넘버 섹션도 숨김
        }
    }

    // 마스터 넘버(11, 22)인 경우 특별 섹션을 화면에 표시하는 함수
    showMasterNumberSection(centralNumber) {
        console.log(`Showing master number section for ${centralNumber}...`);
        try {
            const masterNumberSection = document.getElementById('masterNumberSection'); // 마스터 넘버 섹션 전체
            const masterNumberContent = document.getElementById('masterNumberContent'); // 마스터 넘버 내용 영역

            if (!masterNumberSection || !masterNumberContent) {
                console.error("Master number section elements not found (masterNumberSection or masterNumberContent). Cannot show section.");
                return;
            }

            // 해당 숫자에 대한 마스터 넘버 해석 데이터를 가져옴
            const interpretation = window.getInterpretation ? window.getInterpretation(centralNumber) : null;

            // 마스터 넘버 해석 데이터가 없으면 섹션을 숨김
            if (!interpretation || !interpretation.masterNumber) {
                console.warn(`Master number specific interpretation data not found for: ${centralNumber}. Hiding section.`);
                this.hideMasterNumberSection();
                return;
            }

            // 마스터 넘버 내용 영역에 데이터 채우기
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
            console.log(`Master number content for ${centralNumber} updated.`);

            // 마스터 넘버 섹션 표시 (숨김 해제)
            masterNumberSection.classList.remove('hidden');
            masterNumberSection.setAttribute('data-animate', 'true'); // 애니메이션 속성 추가
            console.log(`Master number section made visible.`);

        } catch (error) {
            console.error('Show master number section error:', error);
             // 오류 발생 시 섹션 숨김
            this.hideMasterNumberSection();
        }
    }

    // 마스터 넘버 섹션을 숨기는 함수
    hideMasterNumberSection() {
        console.log('Hiding master number section...');
        try {
            const masterNumberSection = document.getElementById('masterNumberSection');
            if (masterNumberSection) {
                masterNumberSection.classList.add('hidden'); // 숨김 처리
                masterNumberSection.removeAttribute('data-animate'); // 애니메이션 속성 제거
                // 애니메이션 관련 스타일 초기화 (다음 표시 시 애니메이션이 다시 적용되도록)
                masterNumberSection.style.opacity = '';
                masterNumberSection.style.transform = '';
                console.log('Master number section hidden.');
            } else {
                console.warn("Master number section (ID 'masterNumberSection') not found when trying to hide.");
            }
        } catch (error) {
            console.error('Hide master number section error:', error);
        }
    }

    // 계산된 매트릭스 데이터에 기반한 추천 조치 목록을 표시하는 함수
    displaySuggestedActions() {
        console.log('Displaying suggested actions...');
        try {
            const actionsContainer = document.getElementById('suggestedActionsContent'); // 조치 목록이 표시될 컨테이너
            const actionsSection = document.getElementById('suggestedActionsSection'); // 조치 섹션 전체

            if (!actionsContainer || !actionsSection) {
                console.warn("Suggested actions section elements not found (suggestedActionsContent or suggestedActionsSection). Cannot display actions.");
                return;
            }

            // CompleteDestinyMatrixCalculator 클래스에서 계산된 조치 목록 가져옴
            const suggestions = this.completeMatrixCalculator.getSuggestedActions();

            // 조치 목록이 없거나 비어있으면 섹션을 숨김
            if (!suggestions || suggestions.length === 0) {
                actionsSection.classList.add('hidden'); // 섹션 숨김
                actionsSection.removeAttribute('data-animate'); // 애니메이션 속성 제거
                actionsContainer.innerHTML = ''; // 내용 비우기
                console.log('No suggested actions to display. Section hidden.');
                return;
            }

            // 조치 목록을 HTML 문자열로 변환하여 컨테이너에 삽입
            const actionsHtml = suggestions.map(sugg => `
                <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-3 last:mb-0">
                    <h5 class="text-md font-semibold text-violet-300 mb-2">${sugg.category}</h5>
                    <p class="text-slate-300 text-sm">${sugg.action}</p>
                </div>
            `).join('');

            actionsContainer.innerHTML = actionsHtml;
            console.log(`Generated HTML for ${suggestions.length} suggested actions.`);

            // 조치 섹션 표시 (숨김 해제)
            actionsSection.classList.remove('hidden');
            actionsSection.setAttribute('data-animate', 'true'); // 애니메이션 속성 추가
            console.log('Suggested actions section made visible.');

        } catch (error) {
            console.error('Display suggested actions error:', error);
             const actionsSection = document.getElementById('suggestedActionsSection');
             const actionsContainer = document.getElementById('suggestedActionsContent');
             if(actionsSection && actionsContainer){
                 actionsContainer.innerHTML = `<div class="text-red-400 text-center p-4">조언을 불러오는 중 오류가 발생했습니다.</div>`;
                 actionsSection.classList.remove('hidden'); // 오류 시에도 섹션 자체는 보이게 할 수 있음
                 actionsSection.setAttribute('data-animate', 'true');
             }
        }
    }

    // 프리미엄 분석 섹션을 표시하는 함수 (PremiumAnalysis 클래스 사용)
     displayPremiumAnalysis() {
         console.log('Attempting to display premium analysis...');
         try {
             const premiumAnalysisSection = document.getElementById('premiumAnalysisSection'); // 프리미엄 분석 섹션 전체
             const premiumAnalysisContent = document.getElementById('premiumAnalysisContent'); // 분석 내용 영역

             if (!premiumAnalysisSection || !premiumAnalysisContent) {
                 console.warn("Premium analysis section elements not found (premiumAnalysisSection or premiumAnalysisContent). Cannot display analysis.");
                 return;
             }

             // PremiumAnalysis 클래스에 계산된 매트릭스 데이터를 전달
             // setMatrixCalculator를 통해 이미 전달되었으므로 여기서는 getAnalysis 호출만
             if (!this.premiumAnalysis || typeof this.premiumAnalysis.getAnalysis !== 'function') {
                  console.warn('PremiumAnalysis component or getAnalysis method not available.');
                  premiumAnalysisSection.classList.add('hidden'); // 컴포넌트 없으면 섹션 숨김
                  premiumAnalysisSection.removeAttribute('data-animate');
                  return;
             }

             // getAnalysis는 분석 결과를 즉시 반환하거나 비동기일 수 있습니다.
             // 여기서는 동기 함수라고 가정합니다.
             const analysisResult = this.premiumAnalysis.getAnalysis();

             if (!analysisResult || !analysisResult.title || !analysisResult.content) {
                 console.log('No premium analysis data available or analysis result is empty.');
                 // 분석 결과가 없으면 섹션을 숨김
                 premiumAnalysisSection.classList.add('hidden');
                 premiumAnalysisSection.removeAttribute('data-animate');
                 premiumAnalysisContent.innerHTML = '';
                 return;
             }

             // 분석 결과를 HTML로 구성하여 내용 영역에 삽입
             let contentHtml = `<h4 class="text-xl font-bold text-teal-300 mb-4">${analysisResult.title}</h4>`;
             // 분석 내용이 문자열 배열일 경우 각 항목을 문단으로 표시
             if (Array.isArray(analysisResult.content)) {
                 contentHtml += analysisResult.content.map(paragraph => `<p class="mb-4 last:mb-0">${paragraph}</p>`).join('');
             } else {
                 // 문자열일 경우 그대로 삽입
                 contentHtml += `<p>${analysisResult.content}</p>`;
             }

              // 추가적인 분석 세부 정보가 있다면 여기에 추가
              if (analysisResult.details) {
                  contentHtml += `<div class="mt-6 pt-4 border-t border-slate-600/50">
                                   <h5 class="text-lg font-semibold text-blue-300 mb-3">추가 분석</h5>`;
                  if (Array.isArray(analysisResult.details)) {
                     contentHtml += analysisResult.details.map(item => `<p class="text-sm text-slate-300 mb-2 last:mb-0">${item}</p>`).join('');
                  } else if (typeof analysisResult.details === 'object') {
                       contentHtml += Object.entries(analysisResult.details).map(([key, value]) =>
                            `<p class="text-sm text-slate-300 mb-2 last:mb-0"><strong>${key}:</strong> ${value}</p>`
                       ).join('');
                  } else {
                       contentHtml += `<p class="text-sm text-slate-300">${analysisResult.details}</p>`;
                  }
                  contentHtml += `</div>`;
              }


             premiumAnalysisContent.innerHTML = contentHtml;
             console.log('Premium analysis content updated.');

             // 프리미엄 분석 섹션 표시 (숨김 해제)
             premiumAnalysisSection.classList.remove('hidden');
             premiumAnalysisSection.setAttribute('data-animate', 'true'); // 애니메이션 속성 추가
             console.log('Premium analysis section made visible.');

         } catch (error) {
             console.error('Display premium analysis error:', error);
              const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');
              const premiumAnalysisContent = document.getElementById('premiumAnalysisContent');
              if(premiumAnalysisSection && premiumAnalysisContent){
                  premiumAnalysisContent.innerHTML = `<div class="text-red-400 text-center p-4">심층 분석을 불러오는 중 오류가 발생했습니다.</div>`;
                  premiumAnalysisSection.classList.remove('hidden'); // 오류 시에도 섹션 자체는 보이게 할 수 있음
                  premiumAnalysisSection.setAttribute('data-animate', 'true');
              }
         }
     }

    shakeInput() {
        try {
            const birthdateInput = document.getElementById('birthdate');
            if (birthdateInput) {
                birthdateInput.classList.add('shake-animation');
                setTimeout(() => {
                    birthdateInput.classList.remove('shake-animation');
                }, 600);
                 console.log('Shake animation class added.');
            } else {
                console.warn("Birthdate input (ID 'birthdate') not found when trying to shake.");
            }
        } catch (error) {
            console.error('Shake input error:', error);
        }
    }

    showLoading() {
        console.log('UI: Activating loading state...');
        try {
            const loadingSection = document.getElementById('loadingSection');
            const resultsSection = document.getElementById('resultsSection');
            const premiumAnalysisSection = document.getElementById('premiumAnalysisSection');
            const calculateBtn = document.getElementById('calculateBtn');

            if (loadingSection) {
                 loadingSection.classList.remove('hidden');
                 loadingSection.setAttribute('data-animate', 'true'); // 애니메이션 적용
            } else {
                 console.warn("Loading section (ID 'loadingSection') not found.");
            }
            if (resultsSection) resultsSection.classList.add('hidden');
            if (premiumAnalysisSection) premiumAnalysisSection.classList.add('hidden');

            if (calculateBtn) {
                calculateBtn.disabled = true;
                calculateBtn.textContent = '계산 중...';
                calculateBtn.classList.add('loading');
            } else {
                 console.warn("Calculate button (ID 'calculateBtn') not found.");
            }

            console.log('Loading state activated');
        } catch (error) {
            console.error('Show loading error:', error);
        }
    }

    hideLoading() {
        console.log('UI: Deactivating loading state...');
        try {
            const loadingSection = document.getElementById('loadingSection');
            const calculateBtn = document.getElementById('calculateBtn');

            if (loadingSection) {
                 loadingSection.classList.add('hidden');
                 loadingSection.removeAttribute('data-animate');
            } else {
                 console.warn("Loading section (ID 'loadingSection') not found when trying to hide.");
            }


            if (calculateBtn) {
                calculateBtn.disabled = false;
                calculateBtn.textContent = '데스티니 매트릭스 차트 생성하기';
                calculateBtn.classList.remove('loading');
            } else {
                 console.warn("Calculate button (ID 'calculateBtn') not found when trying to restore state.");
            }

            console.log('Loading state deactivated');
        } catch (error) {
            console.error('Hide loading error:', error);
        }
    }

    showError(message) {
        console.log('UI: Showing error message:', message);
        try {
            const errorElement = document.getElementById('dateError');
            const birthdateInput = document.getElementById('birthdate');

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
                 console.log('Error message displayed in dateError element.');
            } else {
                 console.warn("Error element (ID 'dateError') not found. Showing temporary message instead.");
                 this.showTemporaryMessage(message, 'error', 5000);
            }

            if (birthdateInput) {
                birthdateInput.classList.add('border-red-500', 'focus:ring-red-500');
                birthdateInput.classList.remove('border-green-500');
                 console.log('Error styling applied to birthdate input.');
            } else {
                 console.warn("Birthdate input element (ID 'birthdate') not found for error styling.");
            }
        } catch (error) {
            console.error('Show error failed:', error);
        }
    }

    hideError() {
        console.log('UI: Hiding error message...');
        try {
            const errorElement = document.getElementById('dateError');
            const birthdateInput = document.getElementById('birthdate');

            if (errorElement) {
                 errorElement.classList.add('hidden');
                 errorElement.textContent = ''; // 내용도 비워줌
                 console.log('Error message hidden.');
            } else {
                 console.warn("Error element (ID 'dateError') not found when trying to hide.");
                  const tempErrorMsg = document.getElementById('tempNotification');
                  if(tempErrorMsg && tempErrorMsg.classList.contains('bg-red-500')){
                       tempErrorMsg.remove();
                       console.log('Temporary error message removed.');
                  }
            }

            if (birthdateInput) {
                birthdateInput.classList.remove('border-red-500', 'focus:ring-red-500');
                // 성공 시 green-500이 다시 추가되므로 여기서 제거는 red 스타일만
                 console.log('Error styling removed from birthdate input.');
            } else {
                 console.warn("Birthdate input element (ID 'birthdate') not found when trying to remove error styling.");
            }
        } catch (error) {
            console.error('Hide error failed:', error);
        }
    }

    saveResult(centralNumber, birthdate) {
        console.log('Saving result to localStorage...');
        try {
            const result = {
                centralNumber,
                birthdate,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('destinyMatrixLastResult', JSON.stringify(result));
            console.log('Result saved to localStorage successfully.');
        } catch (error) {
            console.warn('Failed to save result to localStorage:', error);
        }
    }

     // shareResult 함수 수정: centralNumber와 birthdate를 인자로 받도록 변경
    shareResult(centralNumber = '?', birthdate = '결과') {
        console.log('Attempting to share result (text based)...');
        try {
             // 인자로 받지 못했다면 화면에서 가져옴 (fallback)
            if (centralNumber === '?') {
                const centralNumberElement = document.getElementById('centralNumber');
                centralNumber = centralNumberElement?.textContent || '?'; // 요소가 없거나 내용이 없으면 '?'
            }
            if (birthdate === '결과') {
                 const birthdateInfoElement = document.getElementById('birthdateInfo');
                 const birthdateText = birthdateInfoElement?.textContent || '결과';
                 const match = birthdateText.match(/\d{4}-\d{2}-\d{2}/);
                 birthdate = match ? match[0] : '결과';
             }


            const shareText = `✨ 저의 데스티니 매트릭스 가운데 숫자는 ${centralNumber}입니다!

당신의 운명의 숫자는 무엇일까요? 🔮
지금 바로 확인해보세요!

${window.location.href}

#데스티니매트릭스 #운명의숫자 #numerology`;

            if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
                 console.log('Web Share API for text is available. Calling share...');
                navigator.share({
                    title: '나의 데스티니 매트릭스 결과',
                    text: shareText,
                    url: window.location.href
                }).then(() => {
                    console.log('Text shared successfully via Web Share API.');
                     this.showTemporaryMessage('결과가 공유되었습니다!', 'success');
                }).catch(error => {
                     console.warn('Web Share API text share was cancelled or failed:', error);
                     if (error.name !== 'AbortError') { // 사용자가 취소한 경우 (AbortError)는 메시지 안 띄움
                         this.showTemporaryMessage('공유에 실패했습니다. 클립보드에 복사합니다.', 'info');
                         this.copyToClipboard(shareText);
                     } else {
                          console.log('Web Share API share was aborted by user.');
                     }
                });
            } else {
                 console.warn('Web Share API not available for text share, falling back to clipboard.');
                this.showTemporaryMessage('공유 기능을 지원하지 않아 클립보드에 복사했습니다.', 'info');
                this.copyToClipboard(shareText);
            }
        } catch (error) {
            console.error('Share result error:', error);
            this.showTemporaryMessage('결과 공유 중 알 수 없는 오류가 발생했습니다.', 'error');
        }
    }

    showTemporaryMessage(message, type = 'info', duration = null) {
         console.log(`Showing temporary message: Type=${type}, Message="${message}"`);
         try {
             const existingMessage = document.getElementById('tempNotification');
             if (existingMessage) {
                 existingMessage.remove();
                 console.log('Removed existing temporary message.');
             }

             const messageDiv = document.createElement('div');
             messageDiv.id = 'tempNotification';

             const bgColor = type === 'success' ? 'bg-green-500' :
                            type === 'error' ? 'bg-red-500' :
                            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

             messageDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0`;
             messageDiv.style.maxWidth = '90%'; // 작은 화면에서 잘리지 않도록 최대 너비 제한

             const messageLines = message.split('\n');
             if (messageLines.length > 1) {
                 messageDiv.innerHTML = messageLines.map(line => `<div>${line}</div>`).join('');
                 messageDiv.style.whiteSpace = 'pre-line';
                  messageDiv.style.maxWidth = '400px';
             } else {
                 messageDiv.textContent = message;
             }

             document.body.appendChild(messageDiv);
              console.log('Temporary message element appended to body.');


             setTimeout(() => {
                 messageDiv.classList.remove('translate-x-full', 'opacity-0');
                 messageDiv.classList.add('translate-x-0', 'opacity-100');
                 console.log('Temporary message animation started.');
             }, 50);

             const displayDuration = duration !== null ? duration : (type === 'error' ? 10000 : 3000);

             setTimeout(() => {
                 if (document.body.contains(messageDiv)) {
                     messageDiv.classList.remove('translate-x-0', 'opacity-100');
                     messageDiv.classList.add('translate-x-full', 'opacity-0');
                      console.log('Temporary message hiding animation started.');

                     setTimeout(() => {
                         if (document.body.contains(messageDiv)) {
                             document.body.removeChild(messageDiv);
                             console.log('Temporary message element removed from body.');
                         }
                     }, 300);
                 }
             }, displayDuration);

         } catch (error) {
             console.error('Show temporary message error:', error);
         }
     }
     // CompleteDestinyMatrixCalculator의 getSuggestedActions 호출
     displaySuggestedActions() {
         console.log('Displaying suggested actions...');
         try {
             const actionsContainer = document.getElementById('suggestedActionsContent');
             const actionsSection = document.getElementById('suggestedActionsSection');

             if (!actionsContainer || !actionsSection) {
                 console.warn("Suggested actions section elements not found.");
                 return;
             }

             if (!this.completeMatrixCalculator || typeof this.completeMatrixCalculator.getSuggestedActions !== 'function') {
                  console.warn("CompleteMatrixCalculator or getSuggestedActions method not available.");
                  actionsSection.classList.add('hidden');
                  actionsSection.removeAttribute('data-animate');
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
             console.log(`Generated HTML for ${suggestions.length} suggested actions.`);

             actionsSection.classList.remove('hidden');
             actionsSection.setAttribute('data-animate', 'true');
             console.log('Suggested actions section made visible.');

         } catch (error) {
             console.error('Display suggested actions error:', error);
              const actionsSection = document.getElementById('suggestedActionsSection');
              const actionsContainer = document.getElementById('suggestedActionsContent');
              if(actionsSection && actionsContainer){
                  actionsContainer.innerHTML = `<div class="text-red-400 text-center p-4">조언을 불러오는 중 오류가 발생했습니다.</div>`;
                  actionsSection.classList.remove('hidden'); // 오류 시에도 섹션 자체는 보이게 할 수 있음
                  actionsSection.setAttribute('data-animate', 'true');
              }
         }
     }
}

// DOMContentLoaded 이벤트 발생 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM fully loaded. Initializing Destiny Matrix Calculator application.');
         // 모든 필요한 JS 파일이 <script> 태그로 로드되었는지 확인 필요
         // 예: interpretations.js, matrix-visualization.js, premium-analysis.js, share-image-generator.js
         if (typeof CompleteDestinyMatrixCalculator === 'undefined' || typeof MatrixVisualization === 'undefined' || typeof PremiumAnalysis === 'undefined' || typeof ShareImageGenerator === 'undefined' || typeof getInterpretation === 'function' === false) {
              throw new Error("필수 스크립트 파일(destiny-matrix-calculator.js, interpretations.js, matrix-visualization.js, premium-analysis.js, share-image-generator.js 등) 중 일부가 로드되지 않았거나 순서가 잘못되었습니다.");
         }

        const app = new DestinyMatrixCalculator(); // 애플리케이션 인스턴스 생성
        console.log('Destiny Matrix Calculator application initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize Destiny Matrix Calculator application:', error);

        // 애플리케이션 초기화 실패 시 사용자에게 오류 메시지 표시
        const initializationErrorDiv = document.createElement('div');
        initializationErrorDiv.className = 'fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white p-8 z-[100]'; // 전체 화면 오버레이
        initializationErrorDiv.innerHTML = `
            <h1 class="text-2xl font-bold text-red-500 mb-4">애플리케이션 초기화 오류</h1>
            <p class="text-lg text-center mb-6">페이지 로딩 중 문제가 발생했습니다.</p>
            <p class="text-sm text-slate-300 text-center mb-8">${error.message || '자세한 정보는 브라우저 콘솔을 확인해주세요.'}</p>
            <button onclick="window.location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                페이지 새로고침
            </button>
             <p class="text-xs text-slate-400 mt-4">문제가 지속되면 브라우저를 변경하거나 개발자에게 문의해주세요.</p>
        `;
        document.body.appendChild(initializationErrorDiv);

        // 초기화 실패 시 로딩 상태를 제거하고 버튼을 비활성화하여 사용자가 시도하지 못하도록 함
        const loadingSection = document.getElementById('loadingSection');
        if(loadingSection) loadingSection.classList.add('hidden');

        const calculateBtn = document.getElementById('calculateBtn');
        if(calculateBtn) {
            calculateBtn.disabled = true;
            calculateBtn.textContent = '오류 발생';
            calculateBtn.classList.remove('loading');
        }
    }
});

