// 檢查是否已登入
window.onload = function() {
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }
    
    // 初始化 checkbox 事件處理
    initializeCheckboxes();
    // 初始化儲存按鈕事件
    initializeSaveButtons();
    // 初始化刪除按鈕事件
    initializeDeleteButtons();
}

// 初始化刪除按鈕事件
function initializeDeleteButtons() {
    const tbody = document.querySelector('tbody');
    tbody.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            const row = e.target.closest('tr');
            // 如果是輸入列，只清空輸入欄位
            if (row.classList.contains('input-row')) {
                const inputs = row.querySelectorAll('.input-field');
                inputs.forEach(input => input.value = '');
                return;
            }
            
            // 確認是否要刪除
            const confirmDelete = confirm('確定要刪除此筆資料嗎？');
            if (confirmDelete) {
                row.remove();
                // 重新計算項次
                updateIndexNumbers();
            }
        }
    });
}

// 更新所有項次序號
function updateIndexNumbers() {
    const rows = document.querySelectorAll('tbody tr');
    let index = 1;
    
    rows.forEach(row => {
        const indexCell = row.querySelector('td:nth-child(2)');
        if (row.classList.contains('input-row')) {
            // 輸入列的項次永遠是最後一個數字
            indexCell.textContent = index;
        } else {
            indexCell.textContent = index++;
        }
    });
}

// 初始化 checkbox 功能
function initializeCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const contactCheckboxes = document.getElementsByClassName('contact-checkbox');

    // 全選/取消全選的處理
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        Array.from(contactCheckboxes).forEach(checkbox => {
            if (!checkbox.disabled) {  // 只處理未禁用的checkbox
                checkbox.checked = isChecked;
            }
        });
    });

    // 當個別 checkbox 改變時，檢查是否需要更新全選狀態
    Array.from(contactCheckboxes).forEach(checkbox => {
        if (!checkbox.disabled) {  // 只處理未禁用的checkbox
            checkbox.addEventListener('change', function() {
                const allChecked = Array.from(contactCheckboxes)
                    .filter(cb => !cb.disabled)  // 只檢查未禁用的checkbox
                    .every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            });
        }
    });
}

// 初始化儲存按鈕事件
function initializeSaveButtons() {
    const inputRow = document.querySelector('.input-row');
    const saveButton = inputRow.querySelector('.btn-save');

    // 儲存按鈕點擊事件
    saveButton.addEventListener('click', function() {
        const nameInput = inputRow.querySelector('input[placeholder="請輸入姓名"]');
        const addressInput = inputRow.querySelector('input[placeholder="請輸入住址"]');
        const phoneInput = inputRow.querySelector('input[placeholder="請輸入電話"]');

        // 檢查是否所有欄位都有填寫
        if (!nameInput.value || !addressInput.value || !phoneInput.value) {
            alert('請填寫所有欄位');
            return;
        }

        // 檢查姓名格式（只允許中文和英文）
        const nameRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
        if (!nameRegex.test(nameInput.value)) {
            alert('請確認內容正確並重新輸入');
            return;
        }

        // 檢查住址格式（只允許中文、英文、數字和常用符號）
        const addressRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s,.#-]+$/;
        if (!addressRegex.test(addressInput.value)) {
            alert('請確認內容正確並重新輸入');
            return;
        }

        // 檢查電話格式（只允許數字和連字符）
        const phoneRegex = /^[\d-]+$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert('請確認內容正確並重新輸入');
            return;
        }

        // 創建新的資料列
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <input type="checkbox" class="contact-checkbox">
            </td>
            <td>0</td>
            <td>${nameInput.value}</td>
            <td>${addressInput.value}</td>
            <td>${phoneInput.value}</td>
            <td class="action-buttons">
                <button class="btn-save">儲存</button>
                <button class="btn-delete">刪除</button>
            </td>
        `;

        // 將新列插入到輸入列之前
        inputRow.parentNode.insertBefore(newRow, inputRow);

        // 清空輸入欄位
        nameInput.value = '';
        addressInput.value = '';
        phoneInput.value = '';

        // 更新所有項次序號
        updateIndexNumbers();

        // 重新初始化 checkbox 事件
        initializeCheckboxes();
    });
}

// 登出按鈕事件處理
document.getElementById('logoutBtn').addEventListener('click', function() {
    const confirmLogout = confirm('確定要登出嗎？');
    if (confirmLogout) {
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    }
}); 