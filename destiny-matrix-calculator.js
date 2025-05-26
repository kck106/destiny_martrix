// 완전한 데스티니 매트릭스 차트 계산 클래스
class CompleteDestinyMatrixCalculator {
    constructor() {
        this.matrixData = null;
        // 동시성 문제 해결을 위한 계산 상태 관리
        this.isCalculating = false;
        this.calculationId = 0; // 각 계산에 고유 ID 부여
    }

    // 개선된 숫자 축소 함수 (22 이하 유지, 22 초과만 자릿수 합산하여 22 이하로 만듦)
    reduceNumber(num) {
        try {
            // 입력 유효성 검사
            if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
                throw new Error(`유효하지 않은 숫자입니다: ${num}`);
            }

            // 0이거나 음수인 경우 처리
            if (num <= 0) {
                console.warn(`reduceNumber: Input is zero or negative: ${num}. Returning 1 as fallback.`);
                return 1;
            }

            // 정수로 변환하여 시작
            let result = Math.floor(Math.abs(num));

            // 새로운 규칙: 1-22 범위이면 그대로 반환
            if (result >= 1 && result <= 22) {
                return result;
            }

            // 22 초과인 경우에만 반복적으로 자릿수 합산
            const maxIterations = 10; // 무한 루프 방지
            let iterations = 0;

            while (result > 22 && iterations < maxIterations) {
                const digitSum = this.sumDigitsSimple(result);
                
                // 무한 루프 방지: 합산 결과가 이전과 같으면 오류
                if (digitSum === result) {
                    throw new Error(`자릿수 합산이 무한 루프에 빠졌습니다: ${result}`);
                }
                
                result = digitSum;
                iterations++;
            }

            // 최대 반복 횟수 초과 검사
            if (iterations >= maxIterations) {
                throw new Error(`숫자 축소에 너무 많은 반복이 필요합니다: 원본값 ${num}`);
            }

            // 최종 결과가 유효 범위인지 확인
            if (!Number.isInteger(result) || result < 1 || result > 22) {
                throw new Error(`최종 결과가 유효 범위(1-22)를 벗어났습니다: ${result}`);
            }

            return result;

        } catch (error) {
            console.error(`reduceNumber failed for input ${num}:`, error);
            throw new Error(`숫자 계산 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 개선된 자릿수 합산 함수
    sumDigitsSimple(number) {
        try {
            if (typeof number !== 'number' || isNaN(number) || !isFinite(number)) {
                throw new Error(`유효하지 않은 숫자입니다: ${number}`);
            }

            const numStr = String(Math.floor(Math.abs(number)));
            let sum = 0;

            for (let i = 0; i < numStr.length; i++) {
                const digit = parseInt(numStr[i], 10);
                if (isNaN(digit) || digit < 0 || digit > 9) {
                    throw new Error(`유효하지 않은 자릿수가 발견되었습니다: '${numStr[i]}'`);
                }
                sum += digit;
            }

            return sum;

        } catch (error) {
            console.error(`sumDigitsSimple error for input ${number}:`, error);
            throw error;
        }
    }

    // 중간 계산용 자릿수 합산 (reduceNumber를 사용하지 않는 순수 합산)
    sumDigits(number) {
        try {
            return this.sumDigitsSimple(number);
        } catch (error) {
            console.error(`sumDigits error for input ${number}:`, error);
            throw new Error(`중간 숫자 합산 중 오류 발생: ${error.message}`);
        }
    }

    // 동시성 문제 해결을 위한 개선된 전체 매트릭스 계산
    async calculateCompleteMatrix(birthdateString) {
        // 동시 계산 방지
        if (this.isCalculating) {
            throw new Error('이미 계산이 진행 중입니다. 잠시 후 다시 시도해주세요.');
        }

        // 계산 상태 설정 및 고유 ID 생성
        this.isCalculating = true;
        const currentCalculationId = ++this.calculationId;

        try {
            // 입력 유효성 검사
            if (!birthdateString || typeof birthdateString !== 'string') {
                throw new Error('생년월일 입력이 누락되었거나 형식이 잘못되었습니다.');
            }

            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(birthdateString)) {
                throw new Error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.');
            }

            // 계산 중단 확인 (다른 계산이 시작된 경우)
            if (this.calculationId !== currentCalculationId) {
                throw new Error('계산이 중단되었습니다.');
            }

            // 생년월일 파싱 및 검증
            const [yearStr, monthStr, dayStr] = birthdateString.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);

            // 숫자 변환 검증
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                throw new Error('생년월일의 숫자 형식이 올바르지 않습니다.');
            }

            // 날짜 유효성 검증
            const testDate = new Date(year, month - 1, day);
            if (testDate.getFullYear() !== year ||
                testDate.getMonth() + 1 !== month ||
                testDate.getDate() !== day) {
                throw new Error('존재하지 않는 날짜입니다. 올바른 날짜를 입력해주세요.');
            }

            // 날짜 범위 검증
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const inputDate = new Date(year, month - 1, day);

            if (inputDate > today) {
                throw new Error('미래 날짜는 입력할 수 없습니다.');
            }

            if (year < 1900) {
                throw new Error('1900년 이후 날짜만 계산 가능합니다.');
            }

            console.log(`Starting calculation for: ${birthdateString} (ID: ${currentCalculationId})`);

            // 계산 중단 확인
            if (this.calculationId !== currentCalculationId) {
                throw new Error('계산이 중단되었습니다.');
            }

            // 각 요소의 자릿수 합산 (중간값 계산)
            const yearDigitsSum = this.sumDigits(year);
            const monthDigitsSum = this.sumDigits(month);
            const dayDigitsSum = this.sumDigits(day);

            // 전체 자릿수 합산
            const fullSumOriginal = yearDigitsSum + monthDigitsSum + dayDigitsSum;

            console.log(`Intermediate sums: year=${yearDigitsSum}, month=${monthDigitsSum}, day=${dayDigitsSum}, total=${fullSumOriginal}`);

            // 계산 중단 확인
            if (this.calculationId !== currentCalculationId) {
                throw new Error('계산이 중단되었습니다.');
            }

            // 핵심 포인트들 계산 (A1-A4) - 22 초과 시에만 reduceNumber 적용
            const A1 = this.reduceNumber(day);
            const A2 = this.reduceNumber(month);
            const A3 = this.reduceNumber(yearDigitsSum);
            const A4 = this.reduceNumber(A1 + A2 + A3);

            // 중앙 포인트
            const P_Core = this.reduceNumber(fullSumOriginal);

            // 카르마 테일
            const KarmaTail = this.reduceNumber(day + fullSumOriginal);

            console.log(`Main points calculated: A1=${A1}, A2=${A2}, A3=${A3}, A4=${A4}, P_Core=${P_Core}, KarmaTail=${KarmaTail}`);

            // 계산 중단 확인
            if (this.calculationId !== currentCalculationId) {
                throw new Error('계산이 중단되었습니다.');
            }

            // 나머지 포인트들 계산
            const L1 = this.reduceNumber(A1 + P_Core);
            const L2 = this.reduceNumber(A2 + P_Core);
            const L3 = this.reduceNumber(A3 + P_Core);
            const L4 = this.reduceNumber(A4 + P_Core);

            const M1 = this.reduceNumber(A1 + A2);
            const M2 = this.reduceNumber(A2 + A4);
            const M3 = this.reduceNumber(A4 + A3);
            const M4 = this.reduceNumber(A3 + A1);

            const V1 = this.reduceNumber(A1 + L1);
            const V2 = this.reduceNumber(L1 + P_Core);
            const V3 = this.reduceNumber(P_Core + L4);
            const V4 = this.reduceNumber(L4 + A4);

            const H1 = this.reduceNumber(A2 + L2);
            const H2 = this.reduceNumber(L2 + P_Core);
            const H3 = this.reduceNumber(P_Core + L3);
            const H4 = this.reduceNumber(L3 + A3);

            // 최종 계산 중단 확인
            if (this.calculationId !== currentCalculationId) {
                throw new Error('계산이 중단되었습니다.');
            }

            console.log('All points calculated.');

            // 매트릭스 데이터 구성
            const matrixData = {
                birthdate: birthdateString,
                year,
                month,
                day,
                P_Core,
                A1, A2, A3, A4,
                KarmaTail,
                L1, L2, L3, L4,
                M1, M2, M3, M4,
                V1, V2, V3, V4,
                H1, H2, H3, H4,
                yearDigitsSum,
                monthDigitsSum,
                dayDigitsSum,
                fullSumOriginal,
                calculationId: currentCalculationId // 계산 ID 포함
            };

            // 계산 결과 유효성 검증
            if (!this.validateMatrixData(matrixData)) {
                throw new Error('계산 결과 검증에 실패했습니다. 다시 시도해주세요.');
            }

            // 성공적인 계산만 저장
            this.matrixData = matrixData;

            console.log(`Matrix calculation completed successfully (ID: ${currentCalculationId})`);
            return this.matrixData;

        } catch (error) {
            console.error(`Matrix calculation failed (ID: ${currentCalculationId}):`, error);
            
            // 구체적인 오류 메시지 생성
            let userMessage = error.message;
            
            if (userMessage.includes('이미 계산이 진행 중입니다')) {
                userMessage = '이전 계산이 아직 진행 중입니다. 잠시 후 다시 시도해주세요.';
            } else if (userMessage.includes('계산이 중단되었습니다')) {
                userMessage = '새로운 계산 요청으로 인해 이전 계산이 중단되었습니다.';
            } else if (userMessage.includes('날짜')) {
                userMessage = `날짜 입력 오류: ${userMessage}`;
            } else if (userMessage.includes('숫자 계산 중 오류') || userMessage.includes('자릿수')) {
                userMessage = `계산 처리 오류: ${userMessage}`;
            } else if (userMessage.includes('검증에 실패')) {
                userMessage = `계산 결과 검증 오류: ${userMessage}`;
            }

            throw new Error(userMessage);

        } finally {
            // 계산 상태 해제
            this.isCalculating = false;
        }
    }

    // 계산 결과 유효성 검증
    validateMatrixData(data) {
        try {
            if (!data || typeof data !== 'object') {
                console.error('validateMatrixData: Invalid data object');
                return false;
            }

            // 모든 계산된 숫자 필드 검증
            const numbersToCheck = [
                'P_Core', 'A1', 'A2', 'A3', 'A4', 'KarmaTail',
                'L1', 'L2', 'L3', 'L4', 'M1', 'M2', 'M3', 'M4',
                'V1', 'V2', 'V3', 'V4', 'H1', 'H2', 'H3', 'H4'
            ];

            for (const numberKey of numbersToCheck) {
                const value = data[numberKey];
                if (!Number.isInteger(value) || value < 1 || value > 22) {
                    console.error(`validateMatrixData: Invalid value for ${numberKey}: ${value} (expected 1-22 integer)`);
                    return false;
                }
            }

            // 기본 날짜 정보 검증
            if (!data.year || !data.month || !data.day || !data.birthdate) {
                console.error('validateMatrixData: Missing basic date information');
                return false;
            }

            return true;

        } catch (error) {
            console.error('validateMatrixData error:', error);
            return false;
        }
    }

    // 계산 중단 메서드 (필요시 외부에서 호출)
    cancelCalculation() {
        if (this.isCalculating) {
            this.calculationId++; // ID 증가하여 현재 계산을 무효화
            this.isCalculating = false;
            console.log('Calculation cancelled by external request');
        }
    }

    // 특별한 에너지 식별
    identifySpecialEnergies() {
        try {
            if (!this.matrixData || !this.validateMatrixData(this.matrixData)) {
                console.warn('identifySpecialEnergies: No valid matrix data available');
                return {
                    masterNumbers: [],
                    karmaNumbers: [],
                    repeatingNumbers: {},
                    dominantEnergies: []
                };
            }

            const specialEnergies = {
                masterNumbers: [],
                karmaNumbers: [],
                repeatingNumbers: {},
                dominantEnergies: []
            };

            const pointData = [
                { position: 'P_Core', number: this.matrixData.P_Core },
                { position: 'A1', number: this.matrixData.A1 },
                { position: 'A2', number: this.matrixData.A2 },
                { position: 'A3', number: this.matrixData.A3 },
                { position: 'A4', number: this.matrixData.A4 },
                { position: 'KarmaTail', number: this.matrixData.KarmaTail },
                { position: 'L1', number: this.matrixData.L1 },
                { position: 'L2', number: this.matrixData.L2 },
                { position: 'L3', number: this.matrixData.L3 },
                { position: 'L4', number: this.matrixData.L4 },
                { position: 'M1', number: this.matrixData.M1 },
                { position: 'M2', number: this.matrixData.M2 },
                { position: 'M3', number: this.matrixData.M3 },
                { position: 'M4', number: this.matrixData.M4 },
                { position: 'V1', number: this.matrixData.V1 },
                { position: 'V2', number: this.matrixData.V2 },
                { position: 'V3', number: this.matrixData.V3 },
                { position: 'V4', number: this.matrixData.V4 },
                { position: 'H1', number: this.matrixData.H1 },
                { position: 'H2', number: this.matrixData.H2 },
                { position: 'H3', number: this.matrixData.H3 },
                { position: 'H4', number: this.matrixData.H4 }
            ];

            const allNumbers = [];

            pointData.forEach(point => {
                const num = point.number;
                if (typeof num === 'number' && Number.isInteger(num) && num >= 1 && num <= 22) {
                    allNumbers.push(num);

                    // 마스터 넘버 식별
                    if (num === 11 || num === 22) {
                        specialEnergies.masterNumbers.push({
                            number: num,
                            position: point.position,
                            meaning: this.getPositionMeaning(point.position)
                        });
                    }

                    // 카르마 넘버 식별
                    if ([13, 14, 16, 19].includes(num)) {
                        const meaning = point.position === 'KarmaTail' ? '과거생/조상 카르마' : this.getPositionMeaning(point.position);
                        specialEnergies.karmaNumbers.push({
                            number: num,
                            position: point.position,
                            meaning: meaning
                        });
                    }

                    // 반복되는 숫자 카운트
                    specialEnergies.repeatingNumbers[num] = (specialEnergies.repeatingNumbers[num] || 0) + 1;
                } else {
                    console.warn(`identifySpecialEnergies: Invalid number at position ${point.position}: ${num}`);
                }
            });

            // 지배적인 에너지 식별
            specialEnergies.dominantEnergies = Object.entries(specialEnergies.repeatingNumbers)
                .filter(([num, count]) => count >= 3 && parseInt(num) >= 1 && parseInt(num) <= 22)
                .map(([num, count]) => ({
                    number: parseInt(num),
                    frequency: count,
                    percentage: allNumbers.length > 0 ? Math.round((count / allNumbers.length) * 100) : 0
                }))
                .sort((a, b) => b.frequency - a.frequency);

            return specialEnergies;

        } catch (error) {
            console.error('identifySpecialEnergies error:', error);
            return {
                masterNumbers: [],
                karmaNumbers: [],
                repeatingNumbers: {},
                dominantEnergies: []
            };
        }
    }

    // 포지션 의미 매핑
    getPositionMeaning(position) {
        const meanings = {
            'P_Core': '핵심 자아, 컴포트 존',
            'A1': '개인의 본질, 개성 (생일)',
            'A2': '남성 에너지, 관계 (생월)',
            'A3': '여성 에너지, 관계 (생년)',
            'A4': '영적 과제, 조상 라인',
            'KarmaTail': '과거생/조상 카르마',
            'L1': '내면의 잠재력 (A1-P_Core)',
            'L2': '감정과 직관 (A2-P_Core)',
            'L3': '표현과 소통 (A3-P_Core)',
            'L4': '실현과 완성 (A4-P_Core)',
            'M1': '초기 관계 에너지 (A1-A2)',
            'M2': '변화와 도전 (A2-A4)',
            'M3': '성취와 결과 (A4-A3)',
            'M4': '새로운 시작 (A3-A1)',
            'V1': '상승 에너지 (A1-L1)',
            'V2': '내적 균형 (L1-P_Core)',
            'V3': '외적 표현 (P_Core-L4)',
            'V4': '완성 에너지 (L4-A4)',
            'H1': '좌측 흐름 (A2-L2)',
            'H2': '내적 조화 (L2-P_Core)',
            'H3': '외적 조화 (P_Core-L3)',
            'H4': '우측 흐름 (L3-A3)'
        };

        return meanings[position] || '알 수 없는 에너지 포인트';
    }

    // 주요 라인 계산
    calculateMajorLines() {
        try {
            if (!this.matrixData || !this.validateMatrixData(this.matrixData)) {
                console.warn('calculateMajorLines: No valid matrix data available');
                return {};
            }

            const getNumber = (key) => this.matrixData[key];

            return {
                skyEarthLine: {
                    name: '하늘-땅 라인 (운명 라인)',
                    points: [
                        getNumber('A1'), getNumber('V1'), getNumber('L1'),
                        getNumber('V2'), getNumber('P_Core'), getNumber('V3'),
                        getNumber('L4'), getNumber('V4'), getNumber('A4')
                    ],
                    meaning: '개인의 운명과 영적 성장 경로'
                },
                maleFemale: {
                    name: '남성-여성 라인 (관계 라인)',
                    points: [
                        getNumber('A2'), getNumber('H1'), getNumber('L2'),
                        getNumber('H2'), getNumber('P_Core'), getNumber('H3'),
                        getNumber('L3'), getNumber('H4'), getNumber('A3')
                    ],
                    meaning: '관계 역학과 소통 패턴'
                },
                relationshipLine: {
                    name: '핵심 관계 라인',
                    points: [
                        getNumber('A2'), getNumber('L2'), getNumber('P_Core'),
                        getNumber('L3'), getNumber('A3')
                    ],
                    meaning: '핵심 관계와 파트너십'
                },
                talentLine: {
                    name: '재능 라인',
                    points: [
                        getNumber('A1'), getNumber('L1'), getNumber('P_Core')
                    ],
                    meaning: '타고난 재능과 강점'
                },
                spiritualLine: {
                    name: '영적 라인',
                    points: [
                        getNumber('A4'), getNumber('L4'), getNumber('P_Core'),
                        getNumber('KarmaTail')
                    ],
                    meaning: '영적 과제와 카르마'
                }
            };

        } catch (error) {
            console.error('calculateMajorLines error:', error);
            return {};
        }
    }

    // GPT 분석용 데이터 준비
    prepareGPTAnalysisData() {
        try {
            if (!this.matrixData || !this.validateMatrixData(this.matrixData)) {
                console.warn('prepareGPTAnalysisData: No valid matrix data available');
                return null;
            }

            const specialEnergies = this.identifySpecialEnergies();
            const majorLines = this.calculateMajorLines();

            const gptData = {
                user_info: {
                    birthdate: this.matrixData.birthdate,
                    year: this.matrixData.year,
                    month: this.matrixData.month,
                    day: this.matrixData.day
                },
                matrix_positions: {
                    P_Core: this.matrixData.P_Core,
                    A1: this.matrixData.A1, A2: this.matrixData.A2,
                    A3: this.matrixData.A3, A4: this.matrixData.A4,
                    KarmaTail: this.matrixData.KarmaTail,
                    L1: this.matrixData.L1, L2: this.matrixData.L2,
                    L3: this.matrixData.L3, L4: this.matrixData.L4,
                    M1: this.matrixData.M1, M2: this.matrixData.M2,
                    M3: this.matrixData.M3, M4: this.matrixData.M4,
                    V1: this.matrixData.V1, V2: this.matrixData.V2,
                    V3: this.matrixData.V3, V4: this.matrixData.V4,
                    H1: this.matrixData.H1, H2: this.matrixData.H2,
                    H3: this.matrixData.H3, H4: this.matrixData.H4
                },
                special_energies: specialEnergies,
                major_lines: majorLines,
                position_meanings: {
                    P_Core: this.getPositionMeaning('P_Core'),
                    A1: this.getPositionMeaning('A1'),
                    A2: this.getPositionMeaning('A2'),
                    A3: this.getPositionMeaning('A3'),
                    A4: this.getPositionMeaning('A4'),
                    KarmaTail: this.getPositionMeaning('KarmaTail')
                },
                calculation_details: {
                    yearDigitsSum: this.matrixData.yearDigitsSum,
                    monthDigitsSum: this.matrixData.monthDigitsSum,
                    dayDigitsSum: this.matrixData.dayDigitsSum,
                    fullSumOriginal: this.matrixData.fullSumOriginal
                }
            };

            console.log('Prepared GPT analysis data:', gptData);
            return gptData;

        } catch (error) {
            console.error('prepareGPTAnalysisData error:', error);
            return null;
        }
    }

    // 매트릭스 데이터 가져오기
    getMatrixData() {
        return this.matrixData;
    }

    // 조언 제안
    getSuggestedActions() {
        try {
            if (!this.matrixData || !this.validateMatrixData(this.matrixData)) {
                console.warn('getSuggestedActions: No valid matrix data available');
                return [];
            }

            const suggestions = [];
            const specialEnergies = this.identifySpecialEnergies();

            // 마스터 넘버 조언
            if (specialEnergies.masterNumbers.length > 0) {
                const numbers = specialEnergies.masterNumbers.map(m => m.number).join(', ');
                suggestions.push({
                    category: '마스터 넘버 활용',
                    action: `매트릭스에 마스터 넘버(${numbers})가 있습니다. 높은 직관력과 잠재력을 인식하고, 이를 긍정적으로 발휘할 수 있는 활동(예: 명상, 창의적 작업, 리더십)에 집중하세요. 과도한 압박감이나 불안을 관리하는 것이 중요합니다.`,
                    priority: 'high'
                });
            }

            // 카르마 넘버 조언
            if (specialEnergies.karmaNumbers.length > 0) {
                const karmaTailIsKarma = specialEnergies.karmaNumbers.some(k => k.position === 'KarmaTail');
                const otherKarma = specialEnergies.karmaNumbers.filter(k => k.position !== 'KarmaTail').map(k => `${k.number}`);

                let actionText = `매트릭스에 카르마 넘버(${specialEnergies.karmaNumbers.map(k => k.number).join(', ')})가 나타납니다. 이는 과거 생에서 가져온 해결되지 않은 과제를 의미하며, 해당 에너지 영역에서 의식적인 노력과 성장이 필요합니다.`;
                
                if (karmaTailIsKarma) {
                    actionText += ` 특히 카르마 테일(${this.matrixData.KarmaTail})에 카르마 넘버가 있는 경우, 과거의 패턴을 반복하지 않도록 깊은 성찰이 중요합니다.`;
                }

                suggestions.push({
                    category: '카르마 과제',
                    action: actionText,
                    priority: 'high'
                });
            }

            // 지배적 에너지 조언
            if (specialEnergies.dominantEnergies.length > 0) {
                const dominant = specialEnergies.dominantEnergies[0];
                suggestions.push({
                    category: '지배적 에너지 관리',
                    action: `숫자 ${dominant.number}가 매트릭스에 ${dominant.frequency}번 나타나(${dominant.percentage}%) 매우 지배적인 에너지입니다. 숫자 ${dominant.number}의 긍정적인 측면을 강화하고, 부정적인 측면이 나타나지 않도록 의식적으로 관리하는 것이 중요합니다.`,
                    priority: 'medium'
                });
            }

            if (suggestions.length === 0) {
                suggestions.push({
                    category: '일반 조언',
                    action: '당신의 매트릭스를 통해 자신에 대해 더 깊이 이해하고, 각 숫자의 긍정적인 에너지를 삶에 통합하는 노력을 해보세요.',
                    priority: 'low'
                });
            }

            return suggestions;

        } catch (error) {
            console.error('getSuggestedActions error:', error);
            return [];
        }
    }
}

// 전역으로 내보내기
window.CompleteDestinyMatrixCalculator = CompleteDestinyMatrixCalculator;
