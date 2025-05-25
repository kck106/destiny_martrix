// 완전한 데스티니 매트릭스 차트 계산 클래스
class CompleteDestinyMatrixCalculator {
    constructor() {
        this.matrixData = null;
    }

    // 숫자 축소 함수 (22 이하 유지, 22 초과만 자릿수 합산하여 22 이하로 만듦)
    reduceNumber(num) {
        // 0이거나 음수인 경우 (예외 처리)
        if (num <= 0) {
            console.warn(`Invalid number for reduction: ${num}`);
            return 1; // 기본값으로 1 반환
        }
        
        // 새로운 규칙: 숫자가 22 이하이면 그대로 반환 (1부터 22까지)
        if (num >= 1 && num <= 22) {
            return num;
        }
        
        // 숫자가 22보다 큰 경우에만 자릿수 합산
        let sum = 0;
        const numStr = String(num);
        for (let i = 0; i < numStr.length; i++) {
            const digit = parseInt(numStr[i], 10);
            if (!isNaN(digit)) { // Added check for safety
                sum += digit;
            }
        }
        
        // 자릿수 합산 결과에 대해 재귀적으로 reduceNumber 호출
        // 합산 결과가 다시 22보다 클 수 있으므로 반복이 필요
        return this.reduceNumber(sum); 
    }

    // 자릿수 합산 함수 (중간 계산에 사용)
    sumDigits(number) {
        if (typeof number !== 'number' || isNaN(number)) {
            console.warn(`Invalid input for sumDigits: ${number}`);
            return 0;
        }
        
        return Math.abs(number).toString()
            .split('')
            .map(Number)
            .reduce((sum, digit) => sum + digit, 0);
    }

    // 전체 매트릭스 계산
    calculateCompleteMatrix(birthdateString) {
        // 입력 유효성 검사 (YYYY-MM-DD 형식 및 유효한 날짜)
        if (!birthdateString || typeof birthdateString !== 'string') {
            throw new Error('생년월일이 올바르지 않습니다.');
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(birthdateString)) {
            throw new Error('날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');
        }

        try {
            // 생년월일 파싱
            const [year, month, day] = birthdateString.split('-').map(Number);
            
            // 추가 날짜 유효성 검증 (script.js의 validateBirthdate와 일치해야 함)
            const testDate = new Date(birthdateString);
             if (isNaN(testDate.getTime()) || testDate.getFullYear() !== year || testDate.getMonth() + 1 !== month || testDate.getDate() !== day) {
                 throw new Error('입력된 날짜가 유효하지 않습니다.');
             }
             if (year < 1900 || year > new Date().getFullYear()) {
                 throw new Error('연도가 유효하지 않습니다. (1900년 이후)');
             }

            // 각 요소의 자릿수 합산 (중간값)
            const yearDigitsSum = this.sumDigits(year);
            const monthDigitsSum = this.sumDigits(month);
            const dayDigitsSum = this.sumDigits(day);
            
            // 전체 자릿수 합산 (중간값)
            const fullSumOriginal = yearDigitsSum + monthDigitsSum + dayDigitsSum;
            
            // 핵심 포인트들 계산 (A1-A4) - 새로운 reduceNumber 규칙 적용
            // A1: 생일 - 생일 자체 숫자에 reduceNumber 적용 (예: 10일 -> 10, 14일 -> 14)
            const A1 = this.reduceNumber(day);           
            // A2: 생월 - 생월 자체 숫자에 reduceNumber 적용 (예: 9월 -> 9)
            const A2 = this.reduceNumber(month);         
            // A3: 생년 - 생년의 자릿수 합에 reduceNumber 적용 (예: 1992 -> 21 -> 21)
            const A3 = this.reduceNumber(yearDigitsSum);          
            // A4: 하단 꼭지점 - A1, A2, A3 합에 reduceNumber 적용
            const A4 = this.reduceNumber(A1 + A2 + A3);           
            
            // 중앙 포인트 (P_Core) - 전체 합산에 reduceNumber 적용
            const P_Core = this.reduceNumber(fullSumOriginal);
            
            // 카르마 테일 - 생일과 전체 합의 합에 reduceNumber 적용
            const KarmaTail = this.reduceNumber(day + fullSumOriginal);
            
            // 내부 라인 포인트들 (L1-L4) - 인접한 주요 포인트들 합산에 reduceNumber 적용
            const L1 = this.reduceNumber(A1 + P_Core);
            const L2 = this.reduceNumber(A2 + P_Core);
            const L3 = this.reduceNumber(A3 + P_Core);
            const L4 = this.reduceNumber(A4 + P_Core);
            
            // 중간 포인트들 (M1-M4) - 인접한 주요 꼭지점들 합산에 reduceNumber 적용
            const M1 = this.reduceNumber(A1 + A2);
            const M2 = this.reduceNumber(A2 + A4);
            const M3 = this.reduceNumber(A4 + A3);
            const M4 = this.reduceNumber(A3 + A1);
            
            // 세로 라인 포인트들 (V1-V4) - 인접 포인트들 합산에 reduceNumber 적용
            const V1 = this.reduceNumber(A1 + L1);
            const V2 = this.reduceNumber(L1 + P_Core);
            const V3 = this.reduceNumber(P_Core + L4);
            const V4 = this.reduceNumber(L4 + A4);
            
            // 가로 라인 포인트들 (H1-H4) - 인접 포인트들 합산에 reduceNumber 적용
            const H1 = this.reduceNumber(A2 + L2);
            const H2 = this.reduceNumber(L2 + P_Core);
            const H3 = this.reduceNumber(P_Core + L3);
            const H4 = this.reduceNumber(L3 + A3);

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
                // 계산 중간값들 (디버깅 또는 분석용)
                yearDigitsSum,
                monthDigitsSum,
                dayDigitsSum,
                fullSumOriginal
            };

            // 계산 결과 유효성 검증
            if (!this.validateMatrixData(matrixData)) {
                console.error('매트릭스 계산 결과에 예상치 못한 값이 포함되어 있습니다.', matrixData);
            }

            this.matrixData = matrixData;
            return this.matrixData;
            
        } catch (error) {
            console.error('Matrix calculation error:', error);
            throw new Error(`매트릭스 계산 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 계산 결과 유효성 검증 (1-22 범위 허용)
    validateMatrixData(data) {
        const numbersToCheck = [
            'P_Core', 'A1', 'A2', 'A3', 'A4', 'KarmaTail',
            'L1', 'L2', 'L3', 'L4', 'M1', 'M2', 'M3', 'M4',
            'V1', 'V2', 'V3', 'V4', 'H1', 'H2', 'H3', 'H4'
        ];

        for (const numberKey of numbersToCheck) {
            const value = data[numberKey];
            // 유효 범위: 1-22 (새로운 규칙에 따름)
            if (value < 1 || value > 22 || typeof value !== 'number' || isNaN(value)) {
                console.error(`Invalid matrix value for ${numberKey}: ${value}`);
                return false;
            }
        }

        // 기본 날짜 정보 검증
        if (!data.year || !data.month || !data.day || !data.birthdate) {
            console.error('Missing basic date information');
            return false;
        }

        return true;
    }

    // 특별한 에너지 식별 (11, 22, 카르마 넘버)
    identifySpecialEnergies() {
        if (!this.matrixData) return {};

        const specialEnergies = {
            masterNumbers: [], // 11, 22
            karmaNumbers: [], // 13, 14, 16, 19
            repeatingNumbers: {}, // 1-22 범위 내 반복되는 숫자
            dominantEnergies: [] // 3회 이상 나타나는 숫자 (1-22 범위)
        };

        // 모든 계산된 숫자 수집
        const allNumbers = [
            this.matrixData.P_Core, this.matrixData.A1, this.matrixData.A2, this.matrixData.A3, this.matrixData.A4,
            this.matrixData.KarmaTail, this.matrixData.L1, this.matrixData.L2, this.matrixData.L3, this.matrixData.L4,
            this.matrixData.M1, this.matrixData.M2, this.matrixData.M3, this.matrixData.M4,
            this.matrixData.V1, this.matrixData.V2, this.matrixData.V3, this.matrixData.V4,
            this.matrixData.H1, this.matrixData.H2, this.matrixData.H3, this.matrixData.H4
        ];

        const positionNames = [
            'P_Core', 'A1', 'A2', 'A3', 'A4', 'KarmaTail',
            'L1', 'L2', 'L3', 'L4', 'M1', 'M2', 'M3', 'M4',
            'V1', 'V2', 'V3', 'V4', 'H1', 'H2', 'H3', 'H4'
        ];

        // 마스터 넘버 식별
        allNumbers.forEach((num, index) => {
            if (num === 11 || num === 22) {
                specialEnergies.masterNumbers.push({
                    number: num,
                    position: positionNames[index],
                    meaning: this.getPositionMeaning(positionNames[index])
                });
            }
        });

        // 카르마 넘버 식별 (13, 14, 16, 19) - 이제 이 숫자들도 1-22 범위에 포함
        allNumbers.forEach((num, index) => {
            if ([13, 14, 16, 19].includes(num)) {
                specialEnergies.karmaNumbers.push({
                    number: num,
                    position: positionNames[index],
                    meaning: this.getPositionMeaning(positionNames[index])
                });
            }
        });

        // 반복되는 숫자 카운트 (1-22 범위)
        allNumbers.forEach(num => {
            if(num >= 1 && num <= 22) {
                specialEnergies.repeatingNumbers[num] = (specialEnergies.repeatingNumbers[num] || 0) + 1;
            }
        });

        // 지배적인 에너지 식별 (3회 이상 나타나는 숫자)
        Object.entries(specialEnergies.repeatingNumbers).forEach(([num, count]) => {
            if (count >= 3) {
                specialEnergies.dominantEnergies.push({
                    number: parseInt(num),
                    frequency: count,
                    percentage: Math.round((count / allNumbers.length) * 100)
                });
            }
        });

        return specialEnergies;
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
            'L1': '내면의 잠재력',
            'L2': '감정과 직관',
            'L3': '표현과 소통',
            'L4': '실현과 완성',
            'M1': '초기 관계 에너지',
            'M2': '변화와 도전',
            'M3': '성취와 결과',
            'M4': '새로운 시작',
            'V1': '상승 에너지',
            'V2': '내적 균형',
            'V3': '외적 표현',
            'V4': '완성 에너지',
            'H1': '좌측 흐름',
            'H2': '내적 조화',
            'H3': '외적 조화',
            'H4': '우측 흐름'
        };
        
        return meanings[position] || '알 수 없는 위치';
    }
    
    // 주요 라인 계산
    calculateMajorLines() {
        if (!this.matrixData) return {};

        return {
            skyEarthLine: {
                name: '하늘-땅 라인 (운명 라인)',
                points: [
                    this.matrixData.A1, this.matrixData.V1, this.matrixData.L1, 
                    this.matrixData.V2, this.matrixData.P_Core, this.matrixData.V3, 
                    this.matrixData.L4, this.matrixData.V4, this.matrixData.A4
                ],
                meaning: '개인의 운명과 영적 성장 경로'
            },
            maleFemale: {
                name: '남성-여성 라인 (관계 라인)',
                points: [
                    this.matrixData.A2, this.matrixData.H1, this.matrixData.L2, 
                    this.matrixData.H2, this.matrixData.P_Core, this.matrixData.H3, 
                    this.matrixData.L3, this.matrixData.H4, this.matrixData.A3
                ],
                meaning: '관계 역학과 소통 패턴'
            },
            relationshipLine: {
                name: '핵심 관계 라인',
                points: [
                    this.matrixData.A2, this.matrixData.L2, this.matrixData.P_Core, 
                    this.matrixData.L3, this.matrixData.A3
                ],
                meaning: '핵심 관계와 파트너십'
            },
            talentLine: {
                name: '재능 라인',
                points: [
                    this.matrixData.A1, this.matrixData.L1, this.matrixData.P_Core
                ],
                meaning: '타고난 재능과 강점'
            },
            spiritualLine: {
                name: '영적 라인',
                points: [
                    this.matrixData.A4, this.matrixData.L4, this.matrixData.P_Core, 
                    this.matrixData.KarmaTail
                ],
                meaning: '영적 과제와 카르마'
            }
        };
    }

    // GPT 분석용 데이터 준비
    prepareGPTAnalysisData() {
        if (!this.matrixData) return null;

        const specialEnergies = this.identifySpecialEnergies();
        const majorLines = this.calculateMajorLines();

        return {
            user_info: {
                birthdate: this.matrixData.birthdate,
                year: this.matrixData.year,
                month: this.matrixData.month,
                day: this.matrixData.day
            },
            matrix_positions: {
                P_Core: this.matrixData.P_Core,
                A1: this.matrixData.A1,  
                A2: this.matrixData.A2,  
                A3: this.matrixData.A3,  
                A4: this.matrixData.A4,  
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
    }

    // 매트릭스 데이터 가져오기
    getMatrixData() {
        return this.matrixData;
    }

    // 간단한 문제 해결 제안
    getSuggestedActions() {
        if (!this.matrixData) return [];

        const suggestions = [];
        const specialEnergies = this.identifySpecialEnergies();

        // 마스터 넘버 조언
        if (specialEnergies.masterNumbers.length > 0) {
            suggestions.push({
                category: '마스터 넘버 활용',
                action: '높은 직감력과 영적 민감성을 일상에 통합하고, 명상이나 창의적 활동을 통해 에너지를 균형있게 사용하세요.',
                priority: 'high'
            });
        }

        // 지배적 에너지 조언
        if (specialEnergies.dominantEnergies.length > 0) {
            const dominantNumber = specialEnergies.dominantEnergies[0].number;
            suggestions.push({
                category: '지배적 에너지 관리',
                action: `숫자 ${dominantNumber}의 에너지가 강하게 나타납니다. 이 에너지의 긍정적 측면을 강화하고 과도함을 조절하는 것이 중요합니다.`,
                priority: 'medium'
            });
        }

        return suggestions;
    }
}

// 전역으로 내보내기
window.CompleteDestinyMatrixCalculator = CompleteDestinyMatrixCalculator;
