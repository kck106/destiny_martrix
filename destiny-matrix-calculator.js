// 완전한 데스티니 매트릭스 차트 계산 클래스
class CompleteDestinyMatrixCalculator {
    constructor() {
        this.matrixData = null;
    }

    // 숫자 축소 함수 (마스터 넘버 11, 22 유지)
    reduceNumber(num) {
        // 이미 마스터 넘버인 경우
        if (num === 11 || num === 22) {
            return num;
        }
        
        // 1-9 범위인 경우
        if (num >= 1 && num <= 9) {
            return num;
        }
        
        // 0이거나 음수인 경우 (예외 처리)
        if (num <= 0) {
            console.warn(`Invalid number for reduction: ${num}`);
            return 1; // 기본값으로 1 반환
        }
        
        // 10 이상인 경우 자릿수 합산
        let result = num;
        while (result > 9 && result !== 11 && result !== 22) {
            let sum = 0;
            const numStr = String(result);
            for (let i = 0; i < numStr.length; i++) {
                const digit = parseInt(numStr[i], 10);
                if (isNaN(digit)) {
                    console.warn(`Invalid digit in number: ${result}`);
                    continue;
                }
                sum += digit;
            }
            result = sum;
            
            // 무한 루프 방지
            if (result === 0) {
                result = 1;
                break;
            }
        }
        
        return result;
    }

    // 자릿수 합산 함수
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
        // 입력 유효성 검사
        if (!birthdateString || typeof birthdateString !== 'string') {
            throw new Error('생년월일이 올바르지 않습니다.');
        }

        // 날짜 형식 확인 (YYYY-MM-DD)
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(birthdateString)) {
            throw new Error('날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)');
        }

        try {
            // 생년월일 파싱
            const [year, month, day] = birthdateString.split('-').map(Number);
            
            // 날짜 유효성 추가 검증
            if (year < 1900 || year > new Date().getFullYear()) {
                throw new Error('연도가 유효하지 않습니다.');
            }
            if (month < 1 || month > 12) {
                throw new Error('월이 유효하지 않습니다.');
            }
            if (day < 1 || day > 31) {
                throw new Error('일이 유효하지 않습니다.');
            }
            
            // 각 요소의 자릿수 합산
            const yearDigitsSum = this.sumDigits(year);
            const monthDigitsSum = this.sumDigits(month);
            const dayDigitsSum = this.sumDigits(day);
            
            // 전체 자릿수 합산
            const fullSumOriginal = yearDigitsSum + monthDigitsSum + dayDigitsSum;
            
            // 핵심 포인트들 계산 (A1-A4)
            const A1 = this.reduceNumber(dayDigitsSum);           // 생일 (상단 꼭지점)
            const A2 = this.reduceNumber(monthDigitsSum);         // 생월 (좌측 꼭지점)
            const A3 = this.reduceNumber(yearDigitsSum);          // 생년 (우측 꼭지점)
            const A4 = this.reduceNumber(A1 + A2 + A3);           // 하단 꼭지점
            
            // 중앙 포인트 (P_Core) - 전체 합산 축소
            const P_Core = this.reduceNumber(fullSumOriginal);
            
            // 카르마 테일 - 생일 자릿수 합 + 전체 합의 축소 값
            const KarmaTail = this.reduceNumber(dayDigitsSum + fullSumOriginal);
            
            // 내부 라인 포인트들 (L1-L4) - 이미 축소된 값들 사용
            const L1 = this.reduceNumber(A1 + P_Core);
            const L2 = this.reduceNumber(A2 + P_Core);
            const L3 = this.reduceNumber(A3 + P_Core);
            const L4 = this.reduceNumber(A4 + P_Core);
            
            // 중간 포인트들 (M1-M4) - 인접한 주요 포인트들 합산
            const M1 = this.reduceNumber(A1 + A2);
            const M2 = this.reduceNumber(A2 + A4);
            const M3 = this.reduceNumber(A4 + A3);
            const M4 = this.reduceNumber(A3 + A1);
            
            // 세로 라인 포인트들 (V1-V4)
            const V1 = this.reduceNumber(A1 + L1);
            const V2 = this.reduceNumber(L1 + P_Core);
            const V3 = this.reduceNumber(P_Core + L4);
            const V4 = this.reduceNumber(L4 + A4);
            
            // 가로 라인 포인트들 (H1-H4)
            const H1 = this.reduceNumber(A2 + L2);
            const H2 = this.reduceNumber(L2 + P_Core);
            const H3 = this.reduceNumber(P_Core + L3);
            const H4 = this.reduceNumber(L3 + A3);

            // 매트릭스 데이터 구성 및 검증
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
                // 계산 중간값들
                yearDigitsSum,
                monthDigitsSum,
                dayDigitsSum,
                fullSumOriginal
            };

            // 계산 결과 검증
            if (!this.validateMatrixData(matrixData)) {
                throw new Error('매트릭스 계산 결과에 오류가 있습니다.');
            }

            this.matrixData = matrixData;
            return this.matrixData;
            
        } catch (error) {
            console.error('Matrix calculation error:', error);
            throw new Error(`매트릭스 계산 중 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 계산 결과 유효성 검증
    validateMatrixData(data) {
        // 모든 처리된 숫자가 올바른 범위에 있는지 확인
        const numbersToCheck = [
            'P_Core', 'A1', 'A2', 'A3', 'A4', 'KarmaTail',
            'L1', 'L2', 'L3', 'L4', 'M1', 'M2', 'M3', 'M4',
            'V1', 'V2', 'V3', 'V4', 'H1', 'H2', 'H3', 'H4'
        ];

        for (const numberKey of numbersToCheck) {
            const value = data[numberKey];
            // 유효 범위: 1-9, 11, 22
            if (!((value >= 1 && value <= 9) || value === 11 || value === 22)) {
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

    // 특별한 에너지 식별 (개선)
    identifySpecialEnergies() {
        if (!this.matrixData) return {};

        const specialEnergies = {
            masterNumbers: [],
            karmaNumbers: [],
            repeatingNumbers: {},
            dominantEnergies: []
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

        // 카르마 넘버 식별 (13, 14, 16, 19)
        allNumbers.forEach((num, index) => {
            if ([13, 14, 16, 19].includes(num)) {
                specialEnergies.karmaNumbers.push({
                    number: num,
                    position: positionNames[index],
                    meaning: this.getPositionMeaning(positionNames[index])
                });
            }
        });

        // 반복되는 숫자 카운트
        allNumbers.forEach(num => {
            specialEnergies.repeatingNumbers[num] = (specialEnergies.repeatingNumbers[num] || 0) + 1;
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

    // 포지션 의미 매핑 (확장)
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

    // 주요 라인 계산 (개선)
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

    // GPT 분석용 데이터 준비 (확장)
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
