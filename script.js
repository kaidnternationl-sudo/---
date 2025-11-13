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
        link.addEventListener('click', closeSideMenu);
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
        } else {
            endDateInput.disabled = true;
        }
    });
    
    // تغيير اللغة في القائمة
    const languageSelectMenu = document.getElementById('language-select-menu');
    languageSelectMenu.addEventListener('change', function() {
        const languages = {
            'ar': 'العربية',
            'en': 'English',
            'es': 'Español'
        };
        alert(`تم تغيير اللغة إلى: ${languages[this.value]}`);
    });
    
    // التحقق من صحة النموذج قبل الإرسال
    const insuranceForm = document.querySelector('.form-container');
    insuranceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من أن تاريخ البدء والانتهاء صالحان
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (endDate <= startDate) {
                alert('يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء');
                return;
            }
            
            const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - startDate.getMonth());
            
            if (diffMonths > 12) {
                alert('لا يمكن أن تتجاوز مدة التغطية 12 شهرًا');
                return;
            }
        }
        
        // إظهار رسالة نجاح
        showSuccessMessage();
    });
    
    // إضافة تفاعلية لأزرار المساعدة
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', function() {
            const type = this.querySelector('span').textContent.trim();
            handleContactClick(type);
        });
    });
    
    const helpButtons = document.querySelectorAll('.help-btn');
    helpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.textContent.trim();
            handleHelpClick(type);
        });
    });
    
    // دالة مساعدة لتنسيق التاريخ بصيغة YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // معالجة نقرات التواصل
    function handleContactClick(type) {
        switch(type) {
            case 'مباشر: +1 (904) 758-4391':
                window.open('tel:+19047584391');
                break;
            case 'بريد إلكتروني':
                window.location.href = 'mailto:info@patriotexchange.com';
                break;
            case 'واتساب':
                window.open('https://wa.me/966580422371');
                break;
            case 'محادثة':
                // افتح نافذة الدردشة
                alert('سيتم فتح نافذة الدردشة قريباً');
                break;
        }
    }
    
    // معالجة نقرات المساعدة
    function handleHelpClick(type) {
        switch(type) {
            case 'اتصل للتقديم':
                window.open('tel:+19047584391');
                break;
            case 'راسلنا عبر البريد الإلكتروني':
                window.location.href = 'mailto:info@patriotexchange.com';
                break;
        }
    }
    
    // عرض رسالة النجاح
    function showSuccessMessage() {
        const successHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>تم إرسال طلبك بنجاح!</h3>
                <p>سيتم التواصل معك قريبًا عبر البريد الإلكتروني</p>
                <button class="success-btn" onclick="closeSuccessMessage()">موافق</button>
            </div>
            <div class="success-overlay"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
        
        // إضافة الأنيميشن
        setTimeout(() => {
            document.querySelector('.success-message').classList.add('show');
            document.querySelector('.success-overlay').classList.add('show');
        }, 100);
    }
    
    // إغلاق رسالة النجاح (يتم تعريفها بشكل عام للوصول من HTML)
    window.closeSuccessMessage = function() {
        const successMessage = document.querySelector('.success-message');
        const successOverlay = document.querySelector('.success-overlay');
        
        if (successMessage) {
            successMessage.classList.remove('show');
            successOverlay.classList.remove('show');
            
            setTimeout(() => {
                successMessage.remove();
                successOverlay.remove();
            }, 300);
        }
    };
    
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
});
