document.addEventListener('DOMContentLoaded', function() {
    // التحكم في القائمة الجانبية
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    
    function openSideMenu() {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    hamburgerMenu.addEventListener('click', openSideMenu);
    closeMenu.addEventListener('click', closeSideMenu);
    overlay.addEventListener('click', closeSideMenu);
    
    // إغلاق القائمة عند النقر على رابط
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            closeSideMenu();
            
            // محاكاة الانتقال للصفحات الأخرى
            const linkText = this.querySelector('.nav-text').textContent;
            simulatePageTransition(linkText);
        });
    });

    // التحكم في قائمة التابعين
    const dependentCheckbox = document.getElementById('dependent-coverage');
    const dependentTypeGroup = document.getElementById('dependentTypeGroup');
    
    dependentCheckbox.addEventListener('change', function() {
        if (this.checked) {
            dependentTypeGroup.style.display = 'block';
            // إضافة أنيميشن
            dependentTypeGroup.style.animation = 'slideDown 0.3s ease-out';
        } else {
            dependentTypeGroup.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                dependentTypeGroup.style.display = 'none';
            }, 250);
        }
    });

    // تحديد تواريخ البدء والانتهاء
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    // تعيين الحد الأدنى والأقصى لتاريخ البدء
    const today = new Date();
    const maxStartDate = new Date();
    maxStartDate.setMonth(today.getMonth() + 6);
    
    startDateInput.min = formatDate(today);
    startDateInput.max = formatDate(maxStartDate);
    
    // تحديث الحد الأدنى والأقصى لتاريخ الانتهاء عند تغيير تاريخ البدء
    startDateInput.addEventListener('change', function() {
        if (this.value) {
            const startDate = new Date(this.value);
            const minEndDate = new Date(startDate);
            const maxEndDate = new Date(startDate);
            maxEndDate.setMonth(startDate.getMonth() + 12);
            
            endDateInput.min = formatDate(minEndDate);
            endDateInput.max = formatDate(maxEndDate);
            endDateInput.disabled = false;
            
            // تحديث الملخص في صفحة الدفع
            updateCoveragePeriod(startDate, maxEndDate);
        } else {
            endDateInput.disabled = true;
        }
    });

    // تحديث تاريخ الانتهاء عند تغيير تاريخ البدء
    endDateInput.addEventListener('change', function() {
        if (startDateInput.value && this.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(this.value);
            updateCoveragePeriod(startDate, endDate);
        }
    });

    // زر الحصول على عرض السعر
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    getQuoteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showLoadingAnimation();
            
            // محاكاة تحميل البيانات
            setTimeout(() => {
                navigateToCheckout();
            }, 1500);
        }
    });

    // تحديث بيانات الملخص عند تغيير الحقول
    document.getElementById('destination').addEventListener('change', function() {
        document.getElementById('summary-destination').textContent = this.options[this.selectedIndex].text;
    });

    document.querySelectorAll('input[name="visa-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('summary-visa').textContent = this.nextElementSibling.textContent;
        });
    });

    document.querySelectorAll('input[name="program-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('summary-plan').textContent = this.nextElementSibling.textContent;
        });
    });

    // زر العودة للنموذج
    document.getElementById('backToForm').addEventListener('click', function() {
        navigateToForm();
    });

    // زر إكمال الشراء
    document.getElementById('completePurchase').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validatePaymentForm()) {
            processPayment();
        }
    });

    // التحقق من صحة النموذج الرئيسي
    function validateForm() {
        const requiredFields = [
            'email', 'full-name', 'birth-date', 'destination', 
            'start-date', 'end-date', 'adventure-sports', 'additional-coverage'
        ];

        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                markFieldInvalid(field);
                isValid = false;
            } else {
                markFieldValid(field);
            }
        });

        // تحقق إضافي من التواريخ
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (endDate <= startDate) {
                showError('End date must be after start date');
                isValid = false;
            }
            
            const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - startDate.getMonth());
            
            if (diffMonths > 12) {
                showError('Coverage period cannot exceed 12 months');
                isValid = false;
            }
        }

        if (!isValid) {
            showError('Please fill all required fields correctly');
        }

        return isValid;
    }

    // التحقق من صحة نموذج الدفع
    function validatePaymentForm() {
        const cardNumber = document.getElementById('card-number');
        const expiryDate = document.getElementById('expiry-date');
        const cvv = document.getElementById('cvv');
        const cardholderName = document.getElementById('cardholder-name');

        let isValid = true;

        // تحقق من رقم البطاقة
        if (!validateCardNumber(cardNumber.value)) {
            markFieldInvalid(cardNumber);
            isValid = false;
        } else {
            markFieldValid(cardNumber);
        }

        // تحقق من تاريخ الانتهاء
        if (!validateExpiryDate(expiryDate.value)) {
            markFieldInvalid(expiryDate);
            isValid = false;
        } else {
            markFieldValid(expiryDate);
        }

        // تحقق من CVV
        if (!validateCVV(cvv.value)) {
            markFieldInvalid(cvv);
            isValid = false;
        } else {
            markFieldValid(cvv);
        }

        // تحقق من اسم حامل البطاقة
        if (!cardholderName.value.trim()) {
            markFieldInvalid(cardholderName);
            isValid = false;
        } else {
            markFieldValid(cardholderName);
        }

        return isValid;
    }

    // وظائف التحقق من البطاقة
    function validateCardNumber(number) {
        const cleaned = number.replace(/\s+/g, '');
        return /^\d{16}$/.test(cleaned);
    }

    function validateExpiryDate(date) {
        return /^\d{2}\/\d{2}$/.test(date);
    }

    function validateCVV(cvv) {
        return /^\d{3}$/.test(cvv);
    }

    // التنقل بين الصفحات
    function navigateToCheckout() {
        document.getElementById('mainForm').style.display = 'none';
        document.getElementById('checkoutPage').style.display = 'block';
        
        // تحديث شريط التقدم
        document.querySelector('.progress-fill').style.width = '100%';
        
        // إضافة أنيميشن للصفحة الجديدة
        document.getElementById('checkoutPage').style.animation = 'fadeIn 0.5s ease-in';
    }

    function navigateToForm() {
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('mainForm').style.display = 'block';
        
        // إضافة أنيميشن للصفحة الجديدة
        document.getElementById('mainForm').style.animation = 'fadeIn 0.5s ease-in';
    }

    // محاكاة الانتقال للصفحات الأخرى
    function simulatePageTransition(pageName) {
        showLoadingAnimation();
        
        setTimeout(() => {
            showInfo(`Navigating to ${pageName} page...`);
        }, 1000);
    }

    // معالجة الدفع
    function processPayment() {
        const paymentBtn = document.getElementById('completePurchase');
        const originalText = paymentBtn.innerHTML;
        
        paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        paymentBtn.disabled = true;
        
        // محاكاة معالجة الدفع
        setTimeout(() => {
            showSuccessMessage();
            paymentBtn.innerHTML = originalText;
            paymentBtn.disabled = false;
        }, 3000);
    }

    // تحديث فترة التغطية في الملخص
    function updateCoveragePeriod(startDate, endDate) {
        const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          (endDate.getMonth() - startDate.getMonth());
        document.getElementById('summary-period').textContent = `${diffMonths} Months`;
    }

    // وظائف المساعدة
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function markFieldInvalid(field) {
        field.style.borderColor = 'var(--error)';
        field.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
    }

    function markFieldValid(field) {
        field.style.borderColor = 'var(--success)';
        field.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showInfo(message) {
        showNotification(message, 'info');
    }

    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // إضافة أنيميشن
        setTimeout(() => notification.classList.add('show'), 100);
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    function getNotificationIcon(type) {
        const icons = {
            'error': 'exclamation-circle',
            'success': 'check-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    function showLoadingAnimation() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Processing your request...</p>
            </div>
        `;
        
        document.body.appendChild(loading);
        
        setTimeout(() => {
            loading.remove();
        }, 1500);
    }

    // عرض رسالة النجاح
    function showSuccessMessage() {
        const successHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Payment Successful!</h3>
                <p>Your insurance plan has been activated. You will receive confirmation email shortly.</p>
                <div class="success-details">
                    <p><strong>Plan:</strong> <span id="success-plan">Basic Coverage</span></p>
                    <p><strong>Reference ID:</strong> PE${Date.now().toString().slice(-8)}</p>
                </div>
                <button class="success-btn" onclick="closeSuccessMessage()">
                    <i class="fas fa-download"></i>
                    Download Confirmation
                </button>
                <button class="success-btn secondary" onclick="closeSuccessMessage()">
                    Back to Dashboard
                </button>
            </div>
            <div class="success-overlay"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
        
        setTimeout(() => {
            document.querySelector('.success-message').classList.add('show');
            document.querySelector('.success-overlay').classList.add('show');
        }, 100);
    }

    // إغلاق رسالة النجاح
    window.closeSuccessMessage = function() {
        const successMessage = document.querySelector('.success-message');
        const successOverlay = document.querySelector('.success-overlay');
        
        if (successMessage) {
            successMessage.classList.remove('show');
            successOverlay.classList.remove('show');
            
            setTimeout(() => {
                successMessage.remove();
                successOverlay.remove();
                navigateToForm();
            }, 300);
        }
    };

    // تهيئة تنسيق حقل رقم البطاقة
    document.getElementById('card-number').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });

    // تهيئة تنسيق تاريخ الانتهاء
    document.getElementById('expiry-date').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        
        e.target.value = value;
    });

    // إضافة أنيميشن لشريط التقدم
    function animateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        let width = 30;
        const interval = setInterval(() => {
            if (width >= 80) {
                clearInterval(interval);
            } else {
                width += Math.random() * 5;
                progressFill.style.width = Math.min(width, 80) + '%';
            }
        }, 200);
    }

    // بدء أنيميشن شريط التقدم بعد تحميل الصفحة
    setTimeout(animateProgressBar, 1000);

    // إضافة تأثيرات إضافية للتحسينات البصرية
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // فتح الدردشة
    window.openChat = function() {
        showInfo('Chat service will open in a new window');
        // محاكاة فتح نافذة الدردشة
        setTimeout(() => {
            window.open('https://patriotexchange.com/chat', '_blank');
        }, 1000);
    };
});

// إضافة أنيميشن CSS ديناميكي
const dynamicStyles = `
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 200px;
    }
}

@keyframes slideUp {
    from {
        opacity: 1;
        transform: translateY(0);
        max-height: 200px;
    }
    to {
        opacity: 0;
        transform: translateY(-10px);
        max-height: 0;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-dark);
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}

.notification.show {
    transform: translateX(0);
}

.notification.error {
    border-left: 4px solid var(--error);
}

.notification.success {
    border-left: 4px solid var(--success);
}

.notification.info {
    border-left: 4px solid var(--accent-blue);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    color: var(--text-light);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(13, 27, 42, 0.9);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}

.loading-spinner {
    text-align: center;
    color: var(--text-lighter);
}

.loading-spinner i {
    font-size: 3rem;
    margin-bottom: 15px;
    color: var(--accent-blue);
}

.loading-spinner p {
    font-size: 1.1rem;
    margin: 0;
}

.success-details {
    background: rgba(42, 60, 90, 0.5);
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    text-align: left;
}

.success-details p {
    margin: 8px 0;
    font-size: 0.95rem;
}

.success-btn.secondary {
    background: var(--input-bg);
    color: var(--text-light);
    margin-top: 10px;
}

.success-btn.secondary:hover {
    background: var(--border-dark);
}

.form-group.focused label {
    color: var(--accent-blue);
}

.form-group.focused .form-note {
    color: var(--accent-blue);
}
`;

// إضافة الأنماط إلى head
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
