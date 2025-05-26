// share-image-generator.js: 데스티니 매트릭스 결과 이미지 생성 클래스

class ShareImageGenerator {
    constructor() {
        console.log('ShareImageGenerator initialized.');
    }

    /**
     * 매트릭스 데이터를 바탕으로 공유 가능한 이미지 (Data URL)를 생성합니다.
     * Canvas API를 사용하여 이미지를 그립니다.
     * @param {object} matrixData - CompleteDestinyMatrixCalculator에서 계산된 매트릭스 데이터 객체.
     *                              최소한 birthdate, P_Core, KarmaTail 속성을 포함해야 합니다.
     * @returns {Promise<string>} - 생성된 이미지의 Data URL (PNG 형식). Canvas API 오류 시 Promise rejection.
     */
    async generateShareImage(matrixData) {
        console.log('Attempting to generate share image using Canvas...');

        // 매트릭스 데이터 유효성 기본 검사
        if (!matrixData || typeof matrixData !== 'object' || !matrixData.birthdate || !matrixData.P_Core) {
            console.error('generateShareImage: Invalid or incomplete matrixData provided.', matrixData);
            // 사용자에게 보여줄 오류 메시지를 포함하여 오류 발생
            throw new Error('이미지 생성을 위한 필수 데이터(생년월일, 핵심 숫자)가 누락되었습니다.');
        }

        // 1. 메모리 상에 Canvas 요소 생성
        const canvas = document.createElement('canvas');
        // Canvas 요소가 생성되었는지 확인
        if (!canvas) {
             console.error('generateShareImage: Failed to create canvas element.');
             throw new Error('결과 이미지 생성 실패: 내부적으로 Canvas 요소를 생성할 수 없습니다.');
        }

        // 2. Canvas 크기 설정 (생성될 이미지의 크기)
        // 이미지 내용을 고려하여 적절한 크기 설정
        const width = 600;
        const height = 450; // 텍스트 내용을 고려하여 높이 약간 증가
        canvas.width = width;
        canvas.height = height;

        console.log(`Canvas created with dimensions: ${width}x${height}`);

        // 3. 2D 렌더링 컨텍스트 가져오기
        const ctx = canvas.getContext('2d');

        // Canvas 2D Context 지원 여부 및 가져오기 성공 여부 확인
        if (!ctx) {
            console.error('generateShareImage: Canvas 2D context is not available in this environment.');
            // 문제 보고된 오류 메시지와 유사하게 처리
            throw new Error('결과 이미지 생성 실패: Canvas API가 지원되지 않거나, 브라우저 호환성 문제일 수 있습니다.');
        }
        console.log('Canvas 2D context obtained successfully.');


        // 4. 이미지 내용 그리기
        try {
            // 배경 그라데이션
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#4a0e7d'); // 보라색
            gradient.addColorStop(1, '#8b5cf6'); // 연보라색
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            console.log('Background gradient drawn.');

            // 텍스트 스타일 기본 설정
            ctx.fillStyle = '#ffffff'; // 기본 텍스트 색상 흰색
            ctx.textAlign = 'center'; // 중앙 정렬
            ctx.textBaseline = 'middle'; // 수직 가운데 정렬

            const centerX = width / 2;
            let currentY = 60; // 상단 여백 설정

            // 제목
            ctx.font = 'bold 28px "Arial", sans-serif';
            ctx.fillText('나의 데스티니 매트릭스 결과', centerX, currentY);
            currentY += 50; // 제목 아래 간격

            // 생년월일 정보
            ctx.font = '20px "Arial", sans-serif';
            ctx.fillStyle = '#e2e8f0'; // 밝은 회색
            ctx.fillText(`생년월일: ${matrixData.birthdate}`, centerX, currentY);
            currentY += 60; // 생년월일 아래 간격

            // 핵심 숫자 (P_Core) 강조 표시
            ctx.font = 'bold 80px "Arial", sans-serif';
            ctx.fillStyle = '#facc15'; // 노란색
            ctx.fillText(`${matrixData.P_Core}`, centerX, currentY);
            currentY += 80; // 핵심 숫자 아래 간격

            // 핵심 숫자 설명
            ctx.font = 'italic 20px "Arial", sans-serif';
            ctx.fillStyle = '#cbd5e1'; // 회색
            ctx.fillText(`(핵심 자아 에너지)`, centerX, currentY);
            currentY += 50;

            // 카르마 테일 (데이터에 포함되어 있으면 표시)
            if (matrixData.KarmaTail !== undefined) { // KarmaTail이 계산 결과에 있는지 확인
                 ctx.font = '20px "Arial", sans-serif';
                 ctx.fillStyle = '#f87171'; // 붉은색
                 ctx.fillText(`카르마 테일: ${matrixData.KarmaTail}`, centerX, currentY);
                 currentY += 50;
            } else {
                 console.warn('KarmaTail data not available for image generation.');
            }

            // 웹사이트 출처 또는 로고 공간 (하단 여백)
             ctx.font = '16px "Arial", sans-serif';
             ctx.fillStyle = '#a78bfa'; // 연보라색
             // 하단에 고정 위치
             ctx.fillText(window.location.origin, centerX, height - 30);


            console.log('Image content drawn successfully.');

        } catch (e) {
            console.error('generateShareImage: Error during drawing on canvas:', e);
            // 그리기 중 오류 발생 시 사용자에게 알림
            // 컨텍스트 획득 오류만큼 치명적이지 않을 수 있지만, 이미지 내용이 이상할 수 있음.
            // 일단 오류로 처리하여 script.js의 catch 블록에서 처리되도록 함.
             throw new Error(`결과 이미지 그리기 중 오류 발생: ${e.message}`);
        }


        // 5. Canvas 내용을 Data URL로 변환
        let imageDataUrl = '';
        try {
            imageDataUrl = canvas.toDataURL('image/png');
            console.log('Canvas content converted to Data URL (PNG).');

            // 생성된 Data URL의 유효성 간단 검사
            if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/png;base64,')) {
                 console.error('generateShareImage: Generated Data URL is invalid.');
                 throw new Error('결과 이미지 데이터 변환 결과가 유효하지 않습니다.');
            }

        } catch (e) {
            console.error('generateShareImage: Failed to convert canvas to Data URL:', e);
            // 변환 실패 시 사용자에게 알림
            throw new Error(`결과 이미지 데이터 변환 실패: 브라우저 기능 제한 또는 메모리 문제일 수 있습니다.`);
        }

        // 생성된 Canvas 요소는 DOM에 추가되지 않았으므로 별도의 제거 절차는 필요 없습니다.
        // 가비지 컬렉터에 의해 자동 관리됩니다.

        console.log('Share image generation completed.');
        return imageDataUrl; // Data URL 반환
    }
}

// 전역 스코프에 클래스를 노출하여 script.js 등 다른 스크립트에서 인스턴스 생성 가능하게 함
window.ShareImageGenerator = ShareImageGenerator;
