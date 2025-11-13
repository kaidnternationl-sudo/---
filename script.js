document.addEventListener('DOMContentLoaded', function() {
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
    
    // تغيير اللغة
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', function() {
        // في التطبيق الحقيقي، سيتم تغيير اللغة باستخدام مكتبة الترجمة
        alert('سيتم تغيير اللغة إلى: ' + (this.value === 'ar' ? 'العربية' : 'English'));
    });
    
    // التحقق من صحة النموذج قبل الإرسال
    const insuranceForm = document.getElementById('insurance-form');
    insuranceForm.addEventListener('submit', function(e) {
        // التحقق من أن تاريخ البدء والانتهاء صالحان
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (endDate <= startDate) {
                e.preventDefault();
                alert('يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء');
                return;
            }
            
            const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - startDate.getMonth());
            
            if (diffMonths > 12) {
                e.preventDefault();
                alert('لا يمكن أن تتجاوز مدة التغطية 12 شهرًا');
                return;
            }
        }
        
        // إظهار رسالة نجاح
        alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريبًا عبر البريد الإلكتروني.');
    });
    
    // دالة مساعدة لتنسيق التاريخ بصيغة YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
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
});
