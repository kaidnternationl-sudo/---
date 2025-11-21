document.addEventListener('DOMContentLoaded', function() {
    // ---------------------------------------
    // 1. إعدادات القوائم والتنقل
    // ---------------------------------------
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    
    function toggleMenu(show) {
        if(show) {
            sideMenu.classList.add('active');
            overlay.classList.add('active');
        } else {
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
    
    hamburgerMenu.addEventListener('click', () => toggleMenu(true));
    closeMenu.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => toggleMenu(false));

    // ---------------------------------------
    // 2. إعدادات التواريخ (Date Logic)
    // ---------------------------------------
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const today = new Date();
    
    // تعيين الحد الأدنى لتاريخ البدء هو اليوم
    startDateInput.min = today.toISOString().split('T')[0];

    startDateInput.addEventListener('change', function() {
        if(this.value) {
            const start = new Date(this.value);
            // الحد الأدنى للانتهاء هو بعد يوم واحد
            const minEnd = new Date(start);
            minEnd.setDate(minEnd.getDate() + 1); 
            
            endDateInput.min = minEnd.toISOString().split('T')[0];
            endDateInput.disabled = false;
        } else {
            endDateInput.disabled = true;
        }
    });

    // ---------------------------------------
    // 3. منطق "Dependent" (المرافقين)
    // ---------------------------------------
    const depCheckbox = document.getElementById('dependent-coverage');
    const depGroup = document.getElementById('dependentTypeGroup');
    
    depCheckbox.addEventListener('change', function() {
        depGroup.style.display = this.checked ? 'block' : 'none';
    });

    // ---------------------------------------
    // 4. نظام التسعير الذكي (CORE PRICING LOGIC)
    // ---------------------------------------
    
    function calculateQuote() {
        // 1. الحصول على القيم من النموذج
        const startStr = document.getElementById('start-date').value;
        const endStr = document.getElementById('end-date').value;
        
        // تحديد نوع البرنامج لحساب السعر الأساسي
        let programType = "Study Abroad";
        let baseRate = 100; // الافتراضي $100 شهرياً

        const programRadios = document.getElementsByName('program-type');
        for(let r of programRadios) {
            if(r.checked) {
                programType = r.value; // القيمة تأتي من HTML value
                if(programType === "Study Abroad") baseRate = 100;
                else if(programType === "High School") baseRate = 80;
                else if(programType === "Dependent Only") baseRate = 150;
                break;
            }
        }

        // 2. الإضافات (Add-ons)
        let addonsCost = 0;
        let addonsText = [];

        // Adventure Sports
        const adventure = document.getElementById('adventure-sports').value;
        if(adventure === 'premium') {
            addonsCost += 50;
            addonsText.push("Premium Sports (+$50)");
        }

        // Additional Coverage
        const additional = document.getElementById('additional-coverage').value;
        if(additional === 'baggage') { addonsCost += 20; addonsText.push("Baggage (+$20)"); }
        else if(additional === 'legal') { addonsCost += 30; addonsText.push("Legal (+$30)"); }
        else if(additional === 'sports') { addonsCost += 40; addonsText.push("School Sports (+$40)"); }

        // Dependent Coverage checkbox
        if(depCheckbox.checked) {
            addonsCost += 150;
            addonsText.push("Dependent (+$150)");
        }

        // 3. حساب المدة (بالشهور)
        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        
        // حساب الفرق بالأيام وتحويله لشهور (بالتقريب للأعلى)
        let diffTime = Math.abs(endDate - startDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        let months = Math.ceil(diffDays / 30); 
        
        if(months < 1) months = 1; // أقل مدة شهر واحد

        // 4. الحساب النهائي
        let monthlyTotal = baseRate + addonsCost;
        let grandTotal = monthlyTotal * months;

        // 5. تحديث واجهة المستخدم (UI)
        document.getElementById('summary-plan').textContent = programType;
        
        const destinationSelect = document.getElementById('destination');
        document.getElementById('summary-destination').textContent = destinationSelect.options[destinationSelect.selectedIndex].text;
        
        document.getElementById('summary-period').textContent = `${months} Month(s)`;
        
        const visaRadios = document.getElementsByName('visa-type');
        for(let r of visaRadios) if(r.checked) document.getElementById('summary-visa').textContent = r.nextElementSibling.textContent;

        document.getElementById('summary-addons').textContent = addonsText.length > 0 ? addonsText.join(", ") : "None";

        // *** تحديث السعر أخيراً ***
        const formattedPrice = `$${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('total-price').textContent = formattedPrice;
        document.getElementById('pay-amount-text').textContent = formattedPrice; 
    }

    // ---------------------------------------
    // 5. زر الانتقال وعملية الدفع
    // ---------------------------------------
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    const mainForm = document.getElementById('mainForm');
    const checkoutPage = document.getElementById('checkoutPage');
    const insuranceForm = document.getElementById('insuranceForm');


    getQuoteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // تحقق بسيط من الحقول
        const requiredIds = ['email', 'full-name', 'birth-date', 'destination', 'start-date', 'end-date'];
        let isValid = true;
        requiredIds.forEach(id => {
            const el = document.getElementById(id);
            if(!el.value) {
                el.style.borderColor = 'red';
                isValid = false;
            } else {
                el.style.borderColor = '#415a77';
            }
        });

        if(isValid) {
            // تنفيذ الحسابات قبل الانتقال
            calculateQuote();
            
            // تأثير تحميل بسيط
            getQuoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            setTimeout(() => {
                mainForm.style.display = 'none';
                checkoutPage.style.display = 'block';
                checkoutPage.scrollIntoView();
                getQuoteBtn.innerHTML = '<span class="btn-text">GET A QUOTE</span><i class="fas fa-arrow-right btn-arrow"></i>';
            }, 1000);
        } else {
            showNotification("Please fill all required fields", "error");
        }
    });

    document.getElementById('backToForm').addEventListener('click', function() {
        checkoutPage.style.display = 'none';
        mainForm.style.display = 'block';
    });


    // 🔥 منطق إرسال البيانات (Formspree)
    function sendDataToFormspree(data) {
        // تم تحديث المعرّف (Endpoint) بناءً على الصورة التي أرسلتها!
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xldadgze'; 

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log('Data successfully sent to Formspree/Gmail!');
            } else {
                console.error('Formspree submission failed.');
            }
        })
        .catch(error => console.error('Error sending data:', error));
    }


    // 🔥 منطق التحقق من الإيصال (10 ثواني)
    document.getElementById('completePurchase').addEventListener('click', function() {
        const btn = this;
        const originalText = btn.innerHTML;
        const receiptInput = document.getElementById('payment-receipt'); 

        // 🛑 1. التحقق من وجود الإيصال (البوابة الجديدة)
        if (receiptInput.files.length === 0) {
            showNotification("يرجى تحميل إيصال الدفع أولاً للتحقق من العملية.", "error");
            return; 
        }
        
        // 2. إذا تم تحميل الإيصال (الآن نبدأ المحاكاة)
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying Receipt...';

        // محاكاة انتظار التحقق من الإيصال (10 ثواني)
        setTimeout(() => {
            
            // 🚀 الخطوة الجديدة: تجميع وإرسال البيانات
            const form = document.getElementById('insuranceForm');
            const formData = new FormData(form);
            const data = {};
            
            // تجميع بيانات النموذج (المدخلات الأساسية)
            formData.forEach((value, key) => {
                if (key !== 'payment-receipt') { // استثناء حقل الإيصال من الإرسال الفعلي
                    data[key] = value;
                }
            });
            
            // إضافة المبلغ الكلي المحسوب يدوياً إلى البيانات
            data['Total_Amount_Paid'] = document.getElementById('total-price').textContent;
            data['Coverage_Months'] = document.getElementById('summary-period').textContent;
            data['Payment_Method'] = 'Bank QR Code';

            sendDataToFormspree(data); // إرسال البيانات

            // 3. عرض رسالة النجاح
            showSuccessMessage();
            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 10000); 
    });


    // ---------------------------------------
    // 6. رسائل النجاح والتنبيهات
    // ---------------------------------------
    function showNotification(msg, type) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas fa-info-circle"></i> ${msg}`;
        document.body.appendChild(notif);
        
        setTimeout(() => notif.classList.add('show'), 100);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    function showSuccessMessage() {
        const amount = document.getElementById('total-price').textContent;
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="success-overlay show"></div>
            <div class="success-message show">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>Payment Received!</h3>
                <p>We successfully received your transfer of <strong>${amount}</strong>.</p>
                <p style="margin-top:10px; font-size:0.9rem; color:#8d99ae;">Ref: TR-${Math.floor(Math.random()*10000000)}</p>
                <button class="success-btn" onclick="location.reload()">Return to Home</button>
            </div>
        `;
        document.body.appendChild(div);
    }
});
