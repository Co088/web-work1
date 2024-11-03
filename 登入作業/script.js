let captchaText = '';

// 生成隨機驗證碼
function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 50;

    // 清空畫布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 生成5位隨機數字
    captchaText = '';
    for (let i = 0; i < 5; i++) {
        captchaText += Math.floor(Math.random() * 10).toString();
    }

    // 繪製文字
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 添加干擾線
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
        ctx.stroke();
    }

    // 繪製驗證碼文字
    for (let i = 0; i < captchaText.length; i++) {
        const x = (i + 1) * (canvas.width / (captchaText.length + 1));
        const y = canvas.height / 2;
        // 隨機旋轉每個數字
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.2);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }
}

// 頁面加載時生成驗證碼
window.onload = generateCaptcha;

// 刷新驗證碼按鈕事件
document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);

// 清除所有輸入資料的函數
function clearAllInputs() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('captchaInput').value = '';
    generateCaptcha();
}

// 表單提交處理部分的修改
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captchaInput = document.getElementById('captchaInput').value;

    // 檢查帳號格式
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!usernameRegex.test(username)) {
        alert('登入失敗\n帳號或密碼錯誤，請重新輸入');
        clearAllInputs();
        return;
    }

    // 檢查密碼格式
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('登入失敗\n帳號或密碼錯誤，請重新輸入');
        clearAllInputs();
        return;
    }

    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
        alert('登入失敗\n驗證碼錯誤，請重新輸入');
        clearAllInputs();
        return;
    }

    // 登入成功，設置登入狀態並跳轉到資料頁
    sessionStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'data.html';
});

// 清除按鈕事件處理
document.getElementById('clearBtn').addEventListener('click', clearAllInputs); 