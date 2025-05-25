// 프리미엄 분석 관리 클래스 (개선)
class PremiumAnalysis {
    constructor() {
        this.matrixCalculator = null;
        this.isAnalyzing = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'goToPremiumBtn') {
                this.startPremiumAnalysis();
            }
        });
    }

    // 프리미엄 분석 시작 (동적 데이터 지원 개선)
    async startPremiumAnalysis() {
        if (this.isAnalyzing) return;

        this.isAnalyzing = true;
        
        try {
            this.showPremiumLoading();
            
            // 실제 사용자 데이터로 분석 생성
            let analysisReportContent;
            if (this.matrixCalculator && this.matrixCalculator.matrixData) {
                analysisReportContent = await this.generateRealTimeReport(this.matrixCalculator.matrixData);
            } else {
                console.warn('No matrix calculator data available, using fallback report');
                analysisReportContent = await this.fetchPreGeneratedReport();
            }
            
            await this.displayPremiumResults(analysisReportContent);
            
        } catch (error) {
            console.error('Premium analysis failed:', error);
            this.showError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            this.isAnalyzing = false;
            this.hidePremiumLoading();
        }
    }

    // 매트릭스 계산기 설정
    setMatrixCalculator(calculator) {
        this.matrixCalculator = calculator;
    }

    // 실시간 보고서 생성 (새로운 기능)
    async generateRealTimeReport(matrixData) {
        console.log("실시간 분석 보고서를 생성하고 있습니다...", matrixData);
        
        // 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 3000));

        const specialEnergies = this.matrixCalculator.identifySpecialEnergies();
        const majorLines = this.matrixCalculator.calculateMajorLines();

        return `
            <div class="space-y-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
                        당신의 데스티니 매트릭스 심층 분석 보고서
                    </h2>
                    <div class="text-lg text-slate-300 space-y-2">
                        <p><strong>생년월일:</strong> ${matrixData.birthdate} | <strong>가운데 숫자:</strong> ${matrixData.P_Core}</p>
                        <p class="text-sm text-slate-400 max-w-4xl mx-auto leading-relaxed">
                            이 보고서는 당신의 생년월일(${matrixData.birthdate})에 기반하여 계산된 데스티니 매트릭스 전체 차트의 복합적인 에너지 흐름과 패턴을 심층적으로 분석한 결과입니다. 당신의 고유한 에너지 지도를 통해 인생의 주요 영역에 대한 통찰과 실질적인 조언을 얻으시기 바랍니다.
                        </p>
                    </div>
                </div>

                ${this.generateMatrixVisualization(matrixData)}
                ${this.generateLifePathSection(matrixData, specialEnergies)}
                ${this.generatePersonalitySection(matrixData, specialEnergies)}
                ${this.generateTalentSection(matrixData, specialEnergies)}
                ${this.generateChallengeSection(matrixData, specialEnergies)}
                ${this.generateRelationshipSection(matrixData)}
                ${this.generateFinancialSection(matrixData)}
                ${this.generateSpiritualSection(matrixData, specialEnergies)}
                ${this.generateSpecialEnergiesSection(specialEnergies)}
                ${this.generateConclusionSection(matrixData)}
            </div>
        `;
    }

    // 매트릭스 시각화 섹션
    generateMatrixVisualization(matrixData) {
        return `
            <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-indigo-300/20 shadow-2xl">
                <h3 class="text-2xl font-bold text-indigo-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                    당신의 전체 에너지 차트 시각화
                </h3>
                ${this.generateDynamicSVGChart(matrixData)}
            </div>
        `;
    }

    // 동적 SVG 차트 생성
    generateDynamicSVGChart(matrixData) {
        return `
            <p class="text-slate-300 mb-6">
                다음은 당신의 생년월일로 계산된 데스티니 매트릭스 전체 차트의 에너지 배치입니다. 각 위치의 숫자는 1부터 22까지의 타로 대 아르카나 에너지를 나타내며, 해당 위치의 의미와 결합되어 당신의 삶에 영향을 미칩니다.
            </p>
            
            <div class="flex justify-center mb-6">
                <svg width="600" height="650" xmlns="http://www.w3.org/2000/svg" class="max-w-full h-auto">
                    <!-- Matrix Base Shape -->
                    <rect x="50" y="50" width="500" height="550" rx="20" ry="20" fill="#ffffff08" stroke="#ffffff20"/>

                    <!-- Central Diamond -->
                    <line x1="300" y1="80" x2="520" y2="325" stroke="#ffffff40" stroke-width="2"/>
                    <line x1="520" y1="325" x2="300" y2="570" stroke="#ffffff40" stroke-width="2"/>
                    <line x1="300" y1="570" x2="80" y2="325" stroke="#ffffff40" stroke-width="2"/>
                    <line x1="80" y1="325" x2="300" y2="80" stroke="#ffffff40" stroke-width="2"/>

                    <!-- Central Cross -->
                    <line x1="80" y1="325" x2="520" y2="325" stroke="#ffffff40" stroke-width="2"/>
                    <line x1="300" y1="80" x2="300" y2="570" stroke="#ffffff40" stroke-width="2"/>

                    <!-- Main Corners (A1-A4) -->
                    <circle cx="300" cy="80" r="25" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                    <text x="300" y="85" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">${matrixData.A1}</text>
                    <circle cx="80" cy="325" r="25" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                    <text x="80" y="330" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">${matrixData.A2}</text>
                    <circle cx="520" cy="325" r="25" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                    <text x="520" y="330" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">${matrixData.A3}</text>
                    <circle cx="300" cy="570" r="25" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                    <text x="300" y="575" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">${matrixData.A4}</text>

                    <!-- Center (P_Core) -->
                    <circle cx="300" cy="325" r="35" fill="#6366f1" stroke="#fff" stroke-width="3"/>
                    <text x="300" y="335" font-family="Arial" font-size="30" text-anchor="middle" fill="#fff">${matrixData.P_Core}</text>

                    <!-- Karma Tail -->
                    <circle cx="400" cy="470" r="20" fill="#ef4444" stroke="#fff" stroke-width="2"/>
                    <text x="400" y="475" font-family="Arial" font-size="16" text-anchor="middle" fill="#fff">${matrixData.KarmaTail}</text>

                    <!-- Inner Lines (L1-L4) -->
                    <circle cx="300" cy="202" r="15" fill="#3b82f6"/>
                    <text x="320" y="207" font-family="Arial" font-size="12" text-anchor="start" fill="#fff">${matrixData.L1}</text>
                    <circle cx="190" cy="325" r="15" fill="#3b82f6"/>
                    <text x="170" y="330" font-family="Arial" font-size="12" text-anchor="end" fill="#fff">${matrixData.L2}</text>
                    <circle cx="410" cy="325" r="15" fill="#3b82f6"/>
                    <text x="430" y="330" font-family="Arial" font-size="12" text-anchor="start" fill="#fff">${matrixData.L3}</text>
                    <circle cx="300" cy="448" r="15" fill="#3b82f6"/>
                    <text x="320" y="453" font-family="Arial" font-size="12" text-anchor="start" fill="#fff">${matrixData.L4}</text>

                    <!-- Middle Points (M1-M4) -->
                    <circle cx="190" cy="202" r="15" fill="#22c55e"/>
                    <text x="170" y="190" font-family="Arial" font-size="12" text-anchor="end" fill="#fff">${matrixData.M1}</text>
                    <circle cx="190" cy="448" r="15" fill="#22c55e"/>
                    <text x="170" y="460" font-family="Arial" font-size="12" text-anchor="end" fill="#fff">${matrixData.M2}</text>
                    <circle cx="410" cy="448" r="15" fill="#22c55e"/>
                    <text x="430" y="460" font-family="Arial" font-size="12" text-anchor="start" fill="#fff">${matrixData.M3}</text>
                    <circle cx="410" cy="202" r="15" fill="#22c55e"/>
                    <text x="430" y="190" font-family="Arial" font-size="12" text-anchor="start" fill="#fff">${matrixData.M4}</text>

                    <text x="300" y="620" font-family="Arial" font-size="12" text-anchor="middle" fill="#ffffffa0">
                        당신만의 고유한 에너지 배치도 (생년월일: ${matrixData.birthdate})
                    </text>
                </svg>
            </div>
        `;
    }

    // 인생 경로 섹션
    generateLifePathSection(matrixData, specialEnergies) {
        const coreEnergy = matrixData.P_Core;
        const spiritualTask = matrixData.A4;
        const karmaEnergy = matrixData.KarmaTail;

        return `
            <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-indigo-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-indigo-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
                    </svg>
                    인생 경로 및 사명
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신의 데스티니 매트릭스에서 핵심 에너지는 <strong class="text-purple-200">${coreEnergy}</strong>이며, 영적 과제는 <strong class="text-purple-200">${spiritualTask}</strong>입니다. 이는 당신의 이번 생의 주요 사명이 ${this.getLifePathDescription(coreEnergy, spiritualTask)}에 있음을 나타냅니다.</p>
                    
                    <p>카르마 에너지 <strong class="text-red-300">${karmaEnergy}</strong>는 ${this.getKarmaDescription(karmaEnergy)}를 의미하며, 이를 극복하는 것이 당신의 중요한 성장 과제입니다.</p>
                    
                    ${specialEnergies.masterNumbers.length > 0 ? `<p class="bg-purple-500/20 rounded-lg p-4 border border-purple-300/30"><strong class="text-purple-200">✨ 마스터 넘버의 특별한 사명:</strong> 당신의 매트릭스에 마스터 넘버 ${specialEnergies.masterNumbers.map(m => m.number).join(', ')}가 포함되어 있어, 더 높은 영적 목적과 인류의 발전에 기여할 특별한 사명을 가지고 있습니다.</p>` : ''}
                </div>
            </div>
        `;
    }

    // 성격 섹션  
    generatePersonalitySection(matrixData, specialEnergies) {
        const coreEnergy = matrixData.P_Core;
        const birthEnergy = matrixData.A1;
        const monthEnergy = matrixData.A2;
        const yearEnergy = matrixData.A3;

        return `
            <div class="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-8 border border-emerald-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-emerald-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    핵심 성격 및 내면 에너지
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신의 핵심 자아는 <strong class="text-emerald-200">${coreEnergy} 에너지</strong>로 이루어져 있습니다. ${this.getPersonalityDescription(coreEnergy)}</p>
                    
                    <div class="grid md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-emerald-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-emerald-200 mb-2">생일 에너지 (${birthEnergy})</h5>
                            <p class="text-sm">${this.getEnergyDescription(birthEnergy, '개성')}</p>
                        </div>
                        <div class="bg-emerald-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-emerald-200 mb-2">생월 에너지 (${monthEnergy})</h5>
                            <p class="text-sm">${this.getEnergyDescription(monthEnergy, '행동력')}</p>
                        </div>
                        <div class="bg-emerald-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-emerald-200 mb-2">생년 에너지 (${yearEnergy})</h5>
                            <p class="text-sm">${this.getEnergyDescription(yearEnergy, '감정')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 재능 섹션
    generateTalentSection(matrixData, specialEnergies) {
        const talentLine = [matrixData.A1, matrixData.L1, matrixData.P_Core];
        
        return `
            <div class="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-blue-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.5 3A6.5 6.5 0 003 9.5c0 5.61 6.5 13.5 6.5 13.5s6.5-7.89 6.5-13.5A6.5 6.5 0 009.5 3zm0 8.5a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                    타고난 재능 및 잠재력
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신의 재능 라인(${talentLine.join(' - ')})은 ${this.getTalentDescription(talentLine)}을 나타냅니다.</p>
                    
                    ${specialEnergies.dominantEnergies.length > 0 ? `
                        <div class="bg-blue-500/20 rounded-lg p-4 border border-blue-300/30">
                            <h5 class="font-semibold text-blue-200 mb-3">🌟 지배적 에너지 분석</h5>
                            ${specialEnergies.dominantEnergies.map(energy => `
                                <p class="text-sm mb-2"><strong>${energy.number}</strong> 에너지가 전체의 ${energy.percentage}% (${energy.frequency}회)를 차지하며, 이는 ${this.getDominantEnergyMeaning(energy.number)}를 의미합니다.</p>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <p>이러한 재능들을 ${this.getTalentAdvice(matrixData.P_Core)} 분야에서 활용하면 큰 성과를 이룰 수 있을 것입니다.</p>
                </div>
            </div>
        `;
    }

    // 과제 섹션
    generateChallengeSection(matrixData, specialEnergies) {
        return `
            <div class="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-amber-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-amber-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    주요 과제 및 극복 지점
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신이 이번 생에서 마주해야 할 주요 과제는 카르마 에너지 <strong class="text-amber-200">${matrixData.KarmaTail}</strong>과 깊이 연결되어 있습니다.</p>
                    
                    <p>${this.getChallengeDescription(matrixData.KarmaTail, matrixData.P_Core)}</p>
                    
                    ${specialEnergies.karmaNumbers.length > 0 ? `
                        <div class="bg-amber-500/20 rounded-lg p-4 border border-amber-300/30">
                            <h5 class="font-semibold text-amber-200 mb-3">⚡ 카르마 넘버 특별 과제</h5>
                            ${specialEnergies.karmaNumbers.map(karma => `
                                <p class="text-sm mb-2"><strong>${karma.number}</strong> (${karma.position}): ${this.getKarmaNumberMeaning(karma.number)}</p>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <p class="bg-amber-500/10 rounded-lg p-4 border-l-4 border-amber-400">
                        <strong class="text-amber-200">💡 극복 조언:</strong> ${this.getOvercomeAdvice(matrixData.KarmaTail, matrixData.P_Core)}
                    </p>
                </div>
            </div>
        `;
    }

    // 관계 섹션
    generateRelationshipSection(matrixData) {
        const relationshipLine = [matrixData.A2, matrixData.L2, matrixData.P_Core, matrixData.L3, matrixData.A3];
        
        return `
            <div class="bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-rose-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-rose-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20,12A2,2 0 0,0 18,10A2,2 0 0,0 16,12A2,2 0 0,0 18,14A2,2 0 0,0 20,12M6,10A2,2 0 0,0 4,12A2,2 0 0,0 6,14A2,2 0 0,0 8,12A2,2 0 0,0 6,10M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
                    </svg>
                    관계 에너지 및 조언
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신의 관계 라인(${relationshipLine.join(' → ')})은 역동적이고 다층적인 관계 패턴을 보여줍니다.</p>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-rose-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-rose-200 mb-2">남성적 에너지 (${matrixData.A2})</h5>
                            <p class="text-sm">${this.getRelationshipEnergyDescription(matrixData.A2, 'masculine')}</p>
                        </div>
                        <div class="bg-rose-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-rose-200 mb-2">여성적 에너지 (${matrixData.A3})</h5>
                            <p class="text-sm">${this.getRelationshipEnergyDescription(matrixData.A3, 'feminine')}</p>
                        </div>
                    </div>
                    
                    <p>${this.getRelationshipAdvice(relationshipLine)}</p>
                </div>
            </div>
        `;
    }

    // 재정 섹션
    generateFinancialSection(matrixData) {
        return `
            <div class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-green-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                    </svg>
                    재정 및 경력 잠재력
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>핵심 에너지 <strong class="text-green-200">${matrixData.P_Core}</strong>는 ${this.getFinancialPotential(matrixData.P_Core)}을 나타냅니다.</p>
                    
                    <p>${this.getCareerAdvice(matrixData.P_Core, matrixData.A1, matrixData.A4)}</p>
                    
                    <div class="bg-green-500/20 rounded-lg p-4 border border-green-300/30">
                        <h5 class="font-semibold text-green-200 mb-2">💰 재정 운영 조언</h5>
                        <p class="text-sm">${this.getFinancialAdvice(matrixData.P_Core)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 영적 섹션
    generateSpiritualSection(matrixData, specialEnergies) {
        return `
            <div class="bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-violet-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-violet-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
                    </svg>
                    영적 성장 경로
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p>당신의 영적 여정은 영적 과제 <strong class="text-violet-200">${matrixData.A4}</strong>과 카르마 에너지 <strong class="text-violet-200">${matrixData.KarmaTail}</strong>에 의해 크게 영향을 받습니다.</p>
                    
                    <p>${this.getSpiritualDescription(matrixData.A4, matrixData.KarmaTail, matrixData.P_Core)}</p>
                    
                    ${specialEnergies.masterNumbers.length > 0 ? `
                        <div class="bg-violet-500/20 rounded-lg p-4 border border-violet-300/30">
                            <h5 class="font-semibold text-violet-200 mb-3">🔮 마스터 넘버 영적 의미</h5>
                            ${specialEnergies.masterNumbers.map(master => `
                                <p class="text-sm mb-2"><strong>${master.number}</strong> (${master.position}): ${this.getMasterNumberSpiritualMeaning(master.number)}</p>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <p>${this.getSpiritualAdvice(matrixData.A4, specialEnergies.masterNumbers.length > 0)}</p>
                </div>
            </div>
        `;
    }

    // 특별 에너지 섹션
    generateSpecialEnergiesSection(specialEnergies) {
        if (specialEnergies.masterNumbers.length === 0 && specialEnergies.karmaNumbers.length === 0 && specialEnergies.dominantEnergies.length === 0) {
            return '';
        }

        return `
            <div class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-300/20 shadow-2xl">
                <h4 class="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                    특별한 에너지 패턴 분석
                </h4>
                <div class="text-slate-300 leading-relaxed space-y-6">
                    ${specialEnergies.masterNumbers.length > 0 ? `
                        <div class="bg-yellow-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-yellow-200 mb-3">✨ 마스터 넘버 (${specialEnergies.masterNumbers.map(m => m.number).join(', ')})</h5>
                            <p>이는 당신이 특별한 영적 사명과 높은 잠재력을 가지고 있음을 의미합니다. 더 큰 책임과 함께 인류에게 기여할 수 있는 특별한 능력을 가지고 있습니다.</p>
                        </div>
                    ` : ''}
                    
                    ${specialEnergies.karmaNumbers.length > 0 ? `
                        <div class="bg-red-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-red-200 mb-3">⚡ 카르마 넘버 (${specialEnergies.karmaNumbers.map(k => k.number).join(', ')})</h5>
                            <p>과거로부터 이어진 카르마적 과제를 가지고 있어, 특정 영역에서의 학습과 성장이 필요합니다. 이를 극복하면 큰 발전을 이룰 수 있습니다.</p>
                        </div>
                    ` : ''}
                    
                    ${specialEnergies.dominantEnergies.length > 0 ? `
                        <div class="bg-blue-500/10 rounded-lg p-4">
                            <h5 class="font-semibold text-blue-200 mb-3">🔄 지배적 에너지</h5>
                            <p>특정 숫자가 반복적으로 나타나는 것은 해당 에너지가 당신의 삶에 강한 영향을 미치고 있음을 의미합니다. 이 에너지를 균형있게 활용하는 것이 중요합니다.</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // 결론 섹션
    generateConclusionSection(matrixData) {
        return `
            <div class="text-center mt-12 p-8 bg-gradient-to-br from-slate-600/20 to-slate-700/20 backdrop-blur-lg rounded-3xl border border-slate-400/20">
                <h4 class="text-2xl font-bold text-slate-200 mb-4">마무리 메시지</h4>
                <div class="text-slate-300 leading-relaxed space-y-4">
                    <p class="text-lg"><strong class="text-slate-200">기억하세요:</strong> 당신의 매트릭스는 정해진 운명이 아닌, 당신이 가지고 태어난 에너지의 지도입니다.</p>
                    <p>이 분석을 통해 자신을 더 깊이 이해하고, 잠재력을 최대한 발휘하며, 과제를 극복하여 조화롭고 의미 있는 인생을 만들어가시길 바랍니다.</p>
                    <p class="text-sm text-slate-400 mt-6">
                        * 이 분석은 ${matrixData.birthdate} 생년월일을 기반으로 생성된 개인화된 결과입니다.<br>
                        * 매트릭스는 당신의 가능성을 보여주는 도구이며, 최종적인 선택은 항상 당신에게 달려있습니다.
                    </p>
                </div>
            </div>
        `;
    }

    // 보조 함수들 (설명 생성)
    getLifePathDescription(core, spiritual) {
        // 핵심 에너지와 영적 과제에 따른 인생 경로 설명
        const descriptions = {
            1: "리더십과 혁신을 통한 새로운 길 개척",
            2: "조화와 협력을 통한 평화로운 세상 만들기",
            3: "창의성과 표현을 통한 기쁨 전파",
            4: "안정성과 체계를 통한 견고한 기반 구축",
            5: "자유와 변화를 통한 새로운 경험 추구",
            6: "사랑과 봉사를 통한 치유와 조화",
            7: "지혜와 탐구를 통한 진리 발견",
            8: "성취와 권위를 통한 현실적 성공",
            9: "완성과 봉사를 통한 인류 기여",
            11: "영감과 직관을 통한 영적 메신저 역할",
            22: "실현과 건설을 통한 세상의 변화"
        };
        return descriptions[core] || "균형과 조화를 통한 자아실현";
    }

    getKarmaDescription(karmaNumber) {
        const descriptions = {
            13: "정체와 게으름을 극복하고 꾸준한 노력을 통한 변화 추구",
            14: "과도함과 탐욕을 절제하고 균형잡힌 삶",
            16: "영적 오만함을 낮추고 겸손한 배움",
            19: "독립성의 오남용을 피하고 타인과의 협력"
        };
        return descriptions[karmaNumber] || "과거의 패턴을 극복하고 새로운 성장을 추구하는 것";
    }

    getPersonalityDescription(coreEnergy) {
        const descriptions = {
            1: "강한 독립성과 리더십을 가진 개척자 정신을 가지고 있습니다",
            2: "조화로운 관계와 협력을 중시하는 평화로운 성향을 보입니다",
            3: "밝고 창의적인 에너지로 주변을 즐겁게 만드는 표현가 기질이 있습니다",
            4: "안정적이고 체계적인 접근을 선호하는 현실주의자입니다",
            5: "자유롭고 역동적인 변화를 추구하는 모험가 성격입니다",
            6: "따뜻한 돌봄과 봉사를 통해 사랑을 표현하는 치유자입니다",
            7: "깊이 있는 탐구와 성찰을 좋아하는 지혜로운 탐구자입니다",
            8: "강한 의지와 실행력으로 목표를 달성하는 성취자입니다",
            9: "포용력 넓은 완성된 인격으로 타인을 이해하는 현자입니다",
            11: "높은 직감과 영적 감수성을 가진 특별한 영감의 메신저입니다",
            22: "큰 비전을 현실로 만드는 강력한 실현 능력을 가진 마스터 빌더입니다"
        };
        return descriptions[coreEnergy] || "균형잡힌 에너지를 가지고 있습니다";
    }

    getEnergyDescription(energy, type) {
        const base = this.getPersonalityDescription(energy);
        const typeDescriptions = {
            '개성': '이는 당신의 독특한 개성과 타고난 성격을 형성합니다.',
            '행동력': '이는 당신의 행동 패턴과 외부 세계에 대한 접근 방식을 나타냅니다.',
            '감정': '이는 당신의 감정적 반응과 내면의 직감을 나타냅니다.'
        };
        return `${base}. ${typeDescriptions[type] || ''}`;
    }

    getTalentDescription(talentLine) {
        // 재능 라인의 숫자들로부터 재능 설명 생성
        const [birth, potential, core] = talentLine;
        return `타고난 ${birth}번 에너지의 개성, ${potential}번의 잠재 능력, 그리고 ${core}번의 핵심 역량이 조화를 이루어 독특하고 강력한 재능의 조합`;
    }

    getDominantEnergyMeaning(energy) {
        const meanings = {
            1: "강력한 리더십과 독립성이 삶 전반에 큰 영향",
            2: "협력과 조화에 대한 강한 욕구와 능력",
            3: "창의적 표현과 소통에 대한 타고난 재능",
            4: "체계성과 안정성을 추구하는 강한 성향",
            5: "변화와 자유에 대한 끊임없는 추구",
            6: "돌봄과 사랑을 통한 치유 능력의 강조",
            7: "깊이 있는 탐구와 영적 성장에 대한 강한 욕구",
            8: "성취와 성공에 대한 강력한 추진력",
            9: "완성과 봉사에 대한 높은 의식"
        };
        return meanings[energy] || "특별한 에너지 패턴";
    }

    getTalentAdvice(coreEnergy) {
        const advice = {
            1: "리더십, 기업가 정신, 혁신",
            2: "상담, 중재, 팀워크 중심 업무",
            3: "예술, 창작, 커뮤니케이션",
            4: "경영, 관리, 체계적인 업무",
            5: "여행, 언론, 다양한 경험 분야",
            6: "치료, 교육, 서비스업",
            7: "연구, 분석, 영적 지도",
            8: "비즈니스, 금융, 경영진 역할",
            9: "예술, 상담, 인도주의적 활동"
        };
        return advice[coreEnergy] || "다양한";
    }

    getChallengeDescription(karmaEnergy, coreEnergy) {
        // 카르마와 핵심 에너지에 따른 과제 설명
        return `이 에너지는 ${this.getKarmaDescription(karmaEnergy)}를 의미하며, 당신의 핵심 ${coreEnergy} 에너지와 상호작용하여 성장의 기회를 제공합니다.`;
    }

    getKarmaNumberMeaning(karmaNumber) {
        const meanings = {
            13: "변화에 대한 저항과 정체를 극복하고 꾸준한 노력이 필요",
            14: "과도함과 탐욕을 절제하고 균형잡힌 삶의 필요성",
            16: "영적 오만함을 버리고 겸손한 학습 자세 필요",
            19: "독단적 성향을 줄이고 타인과의 협력이 중요"
        };
        return meanings[karmaNumber] || "특별한 카르마적 과제";
    }

    getOvercomeAdvice(karmaEnergy, coreEnergy) {
        return `${coreEnergy}번 핵심 에너지의 긍정적 측면을 활용하여 꾸준한 노력과 인내로 카르마 과제를 극복하세요. 자신을 성찰하고 변화에 열린 마음을 가지는 것이 중요합니다.`;
    }

    getRelationshipEnergyDescription(energy, type) {
        const energyDesc = this.getEnergyDescription(energy, '관계');
        const typeDesc = type === 'masculine' ? '적극적이고 행동 지향적인' : '감정적이고 직관적인';
        return energyDesc.replace('당신의', `${typeDesc} 당신의`);
    }

    getRelationshipAdvice(relationshipLine) {
        return `이러한 다양한 에너지들을 조화시키는 것이 관계에서의 주요 과제입니다. 서로 다른 에너지들 간의 균형을 찾고, 상대방의 에너지도 이해하고 존중하는 자세가 필요합니다.`;
    }

    getFinancialPotential(coreEnergy) {
        const potentials = {
            1: "독립적인 사업과 리더십 역할에서 재정적 성공 가능성이 높습니다",
            2: "협력과 파트너십을 통한 안정적인 재정 운영에 적합합니다",
            3: "창의적이고 표현적인 분야에서 재정적 기회를 발견할 수 있습니다",
            4: "체계적인 저축과 장기 투자를 통한 안정적인 재정 구축이 가능합니다",
            5: "다양한 소득원과 변화하는 기회를 통한 재정 성장이 가능합니다",
            6: "서비스업이나 돌봄 관련 분야에서 안정적인 수입을 얻을 수 있습니다",
            7: "전문지식과 연구를 통한 특화된 분야에서 높은 수익이 가능합니다",
            8: "비즈니스와 투자를 통한 큰 재정적 성취가 가능합니다",
            9: "인도주의적 활동과 완성된 기술로 안정적인 수익 창출이 가능합니다"
        };
        return potentials[coreEnergy] || "균형잡힌 재정 관리가 가능합니다";
    }

    getCareerAdvice(coreEnergy, birthEnergy, spiritualEnergy) {
        return `당신의 ${coreEnergy}번 핵심 에너지와 ${birthEnergy}번 개성, ${spiritualEnergy}번 영적 과제를 종합하면, 개인의 독특함을 살리면서도 더 큰 의미를 추구할 수 있는 분야에서 성공할 가능성이 높습니다.`;
    }

    getFinancialAdvice(coreEnergy) {
        const advice = {
            1: "독립적인 투자 결정과 새로운 기회 포착에 집중하세요",
            2: "안정적인 저축과 신뢰할 수 있는 파트너와의 공동 투자를 고려하세요",
            3: "창의적인 프로젝트에 투자하고 다양한 수익원을 개발하세요",
            4: "장기 저축 계획과 안정적인 투자 상품을 활용하세요",
            5: "포트폴리오를 다양화하고 변화하는 시장 기회를 놓치지 마세요",
            6: "가족과 공동체를 위한 재정 계획을 세우세요",
            7: "신중한 분석을 통한 투자와 전문성을 활용한 수익 창출을 고려하세요",
            8: "적극적인 투자와 비즈니스 기회 확장에 집중하세요",
            9: "사회적 가치와 수익을 함께 고려한 투자를 고려하세요"
        };
        return advice[coreEnergy] || "균형잡힌 재정 관리를 유지하세요";
    }

    getSpiritualDescription(spiritualTask, karmaEnergy, coreEnergy) {
        return `${spiritualTask}번 영적 과제는 당신이 이번 생에서 달성해야 할 영적 성장의 방향을 제시하며, ${karmaEnergy}번 카르마는 극복해야 할 과거의 패턴을 나타냅니다. 이 두 에너지가 ${coreEnergy}번 핵심 에너지와 조화를 이루면서 영적 발전의 길을 제시합니다.`;
    }

    getMasterNumberSpiritualMeaning(masterNumber) {
        const meanings = {
            11: "높은 직감력과 영적 메신저 역할을 통해 타인에게 영감을 주는 사명",
            22: "물질 세계에서 영적 이상을 실현하는 마스터 빌더의 사명"
        };
        return meanings[masterNumber] || "특별한 영적 사명";
    }

    getSpiritualAdvice(spiritualTask, hasMasterNumbers) {
        let advice = "영적 성장을 위해서는 일상적인 명상이나 성찰의 시간을 가지고, 내면의 목소리에 귀 기울이는 것이 중요합니다.";
        
        if (hasMasterNumbers) {
            advice += " 특히 마스터 넘버를 가진 당신은 더 높은 영적 책임을 가지고 있으므로, 자신의 경험과 깨달음을 다른 이들과 나누는 것이 영적 성장에 도움이 될 것입니다.";
        }
        
        return advice;
    }

    // 프리미엄 로딩 화면 표시
    showPremiumLoading() {
        const loadingSection = document.getElementById('premiumLoadingSection');
        const resultsSection = document.getElementById('resultsSection');
        
        loadingSection.classList.remove('hidden');
        resultsSection.style.opacity = '0.3';
        resultsSection.style.pointerEvents = 'none';
        
        this.animateLoadingProgress();
    }

    // 로딩 프로그레스 애니메이션 (개선)
    async animateLoadingProgress() {
        const progressBar = document.getElementById('premiumProgressBar');
        const loadingMessage = document.getElementById('premiumLoadingMessage');
        
        const messages = [
            '사용자의 매트릭스 데이터를 분석하고 있습니다...',
            '22개 에너지 포인트의 상호작용을 계산 중입니다...',
            '개인화된 인생 경로를 생성하고 있습니다...',
            'AI 기반 심층 분석을 완성 중입니다...',
            '최종 보고서를 준비하고 있습니다...'
        ];

        const totalDuration = 6000;
        const stepDuration = totalDuration / messages.length;

        for (let i = 0; i < messages.length; i++) {
            loadingMessage.textContent = messages[i];
            const progress = ((i + 1) / messages.length) * 100;
            progressBar.style.width = progress + '%';
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
        
        progressBar.style.width = '100%';
    }

    // 프리미엄 로딩 숨기기
    hidePremiumLoading() {
        const loadingSection = document.getElementById('premiumLoadingSection');
        const resultsSection = document.getElementById('resultsSection');
        
        loadingSection.classList.add('hidden');
        resultsSection.style.opacity = '1';
        resultsSection.style.pointerEvents = 'auto';
    }

    // 미리 생성된 보고서 내용 가져오기 (폴백)
    async fetchPreGeneratedReport() {
        console.log("폴백 보고서를 가져오는 중...");
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        return `
            <div class="space-y-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
                        샘플 데스티니 매트릭스 심층 분석 보고서
                    </h2>
                    <div class="text-lg text-slate-300 space-y-2">
                        <p><strong>생년월일:</strong> 1992-09-14 | <strong>가운데 숫자:</strong> 8</p>
                        <p class="text-sm text-slate-400 max-w-4xl mx-auto leading-relaxed">
                            이는 샘플 보고서입니다. 실제 서비스에서는 사용자의 생년월일을 기반으로 개인화된 분석이 제공됩니다.
                        </p>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-indigo-300/20 shadow-2xl">
                    <h3 class="text-2xl font-bold text-indigo-300 mb-6">샘플 보고서 알림</h3>
                    <p class="text-slate-300 mb-4">
                        현재 표시되는 내용은 데모 목적의 샘플 보고서입니다. 실제 서비스에서는 사용자의 정확한 생년월일을 바탕으로 다음이 제공됩니다:
                    </p>
                    <ul class="text-slate-300 space-y-2 ml-6">
                        <li>• 개인화된 매트릭스 차트 계산</li>
                        <li>• 사용자별 맞춤 에너지 분석</li>
                        <li>• 실시간 AI 기반 심층 해석</li>
                        <li>• 개인의 특별한 숫자 패턴 식별</li>
                        <li>• 구체적인 인생 조언과 방향성</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // 프리미엄 분석 결과 표시 (개선)
    async displayPremiumResults(analysisReportContent) {
        const premiumSection = document.getElementById('premiumAnalysisSection');
        const premiumContent = document.getElementById('premiumAnalysisContent');
        const premiumBirthdate = document.getElementById('premiumBirthdate');
        const premiumCentralNumber = document.getElementById('premiumCentralNumber');

        try {
            // 기본 정보 업데이트
            if (this.matrixCalculator && this.matrixCalculator.matrixData) {
                premiumBirthdate.textContent = this.matrixCalculator.matrixData.birthdate || 'YYYY-MM-DD';
                premiumCentralNumber.textContent = this.matrixCalculator.matrixData.P_Core || '?';
            } else {
                premiumBirthdate.textContent = '1992-09-14';
                premiumCentralNumber.textContent = '8';
            }

            // 분석 내용 삽입
            if (premiumContent) {
                premiumContent.innerHTML = analysisReportContent;
                
                // 애니메이션 효과 추가
                this.animatePremiumContent();
            } else {
                console.error('Premium analysis content container not found');
                throw new Error('컨테이너를 찾을 수 없습니다.');
            }

            // 프리미엄 섹션 표시
            premiumSection.classList.remove('hidden');
            
            // 부드러운 스크롤
            setTimeout(() => {
                premiumSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);

        } catch (error) {
            console.error('Error displaying premium results:', error);
            this.showError('결과 표시 중 오류가 발생했습니다.');
        }
    }

    // 프리미엄 컨텐츠 애니메이션
    animatePremiumContent() {
        const sections = document.querySelectorAll('#premiumAnalysisContent > div');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // 오류 메시지 표시 (개선)
    showError(message) {
        // 기존 오류 메시지 제거
        const existingError = document.getElementById('premiumError');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.id = 'premiumError';
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 자동 제거
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                errorDiv.style.transform = 'translateX(100%)';
                errorDiv.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(errorDiv)) {
                        document.body.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// 전역으로 내보내기
window.PremiumAnalysis = PremiumAnalysis;

