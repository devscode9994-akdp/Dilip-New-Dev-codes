document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.quiz-step'));
    const nextButtons = Array.from(form.querySelectorAll('.next'));
    const prevButtons = Array.from(form.querySelectorAll('.prev'));
    const hiddenBody =
        form.querySelector('textarea[name="contact[body]"]') ||
        form.querySelector('#quizBody');
    const emailInput =
        form.querySelector('input[type="email"][name="contact[email]"]') ||
        form.querySelector('input[type="email"]');
    const phoneInput =
        form.querySelector('input[type="tel"][name="contact[phone]"]') ||
        form.querySelector('input[type="tel"]');

    const previewContainer = document.getElementById('quizPreview');

    function buildPreview() {
        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        steps.forEach((step, index) => {
            const questionEl = step.querySelector('h3');
            if (!questionEl) return;

            const questionText = questionEl.innerText;
            let answerText = '';

            const radioSelected = step.querySelector('input[type="radio"]:checked');
            const otherInput = step.querySelector('.other-input');
            const emailField = step.querySelector('input[type="email"]');
            const phoneField = step.querySelector('input[type="tel"]');

            if (radioSelected) {
                answerText =
                    radioSelected.value === '__other__'
                        ? otherInput?.value || ''
                        : radioSelected.value;
            } else if (emailField) {
                answerText = emailField.value;
            } else if (phoneField) {
                answerText = phoneField.value;
            }

            if (!answerText) return;

            const row = document.createElement('div');
            row.className = 'preview-row';
            row.innerHTML = `
        <div class="each-question-details">
        <strong>${questionText}</strong>
        <p>${answerText}</p>
        </div>
        <button type="button" class="edit-answer" data-step-index="${index}">
          Edit
        </button>
      `;

            previewContainer.appendChild(row);
        });
    }

    // Helper: show inline error on the step
    function showError(stepEl, message) {
        removeError(stepEl);
        const p = document.createElement('p');
        p.className = 'error-message';
        p.style.color = 'red';
        p.style.marginTop = '8px';
        p.textContent = message;
        stepEl.appendChild(p);
        const firstField = Array.from(
            stepEl.querySelectorAll('input, textarea, select')
        ).find((f) => f.offsetParent !== null);
        if (firstField) firstField.focus();
    }

    function removeError(stepEl) {
        if (!stepEl) return;
        const err = stepEl.querySelector('.error-message');
        if (err) err.remove();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhoneExact10(phone) {
        const digits = (phone || '').replace(/\D/g, '');
        return digits.length === 10;
    }

    // Validate a single step
    function validateStep(stepEl) {
        removeError(stepEl);

        // radios
        const radios = Array.from(stepEl.querySelectorAll('input[type="radio"]'));
        if (radios.length > 0) {
            const selected = stepEl.querySelector('input[type="radio"]:checked');
            const otherInput = stepEl.querySelector('.other-input');

            if (!selected) {
                showError(stepEl, 'Please select an option to continue.');
                return false;
            }

            if (selected.value === '__other__') {
                if (!otherInput || !otherInput.value.trim()) {
                    showError(stepEl, 'Please fill out the "Other" field.');
                    return false;
                }
            }

            return true;
        }

        // email step
        const email = stepEl.querySelector('input[type="email"]');
        if (email) {
            const val = (email.value || '').trim();
            if (!val) {
                showError(stepEl, 'Please enter your email.');
                return false;
            }
            if (!isValidEmail(val)) {
                showError(stepEl, 'Please enter a valid email address.');
                return false;
            }
            return true;
        }

        // phone step
        const phone = stepEl.querySelector('input[type="tel"]');
        if (phone) {
            const val = (phone.value || '').trim();
            if (!val) {
                showError(stepEl, 'Please enter your phone number.');
                return false;
            }
            if (!isValidPhoneExact10(val)) {
                showError(
                    stepEl,
                    'Please enter a 10-digit phone number (digits only).'
                );
                return false;
            }
            return true;
        }

        return true;
    }

    // Show/hide "Other" input and toggle required
    document.addEventListener('change', (e) => {
        const t = e.target;
        if (!t.matches('input[type="radio"].quiz-radio')) return;

        const step = t.closest('.quiz-step');
        const stepId = t.dataset.step;
        const otherInput = document.querySelector(
            `.other-input[data-step="${stepId}"]`
        );
        const otherRadio = step.querySelector(
            'input[type="radio"][value="__other__"]'
        );

        if (otherInput) {
            if (otherRadio && otherRadio.checked) {
                otherInput.style.display = '';
                otherInput.required = true;
                otherInput.focus();
            } else {
                otherInput.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
        }

        removeError(step);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('edit-answer')) return;

        const stepIndex = parseInt(e.target.dataset.stepIndex, 10);
        if (isNaN(stepIndex)) return;

        steps.forEach((s) => s.classList.remove('active'));
        steps[stepIndex].classList.add('active');
    });


    // Enforce phone digits-only and max 10
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
            e.target.value = val;
        });

        phoneInput.addEventListener('paste', (e) => {
            const paste =
                (e.clipboardData || window.clipboardData).getData('text') || '';
            if (!/^\d+$/.test(paste)) e.preventDefault();
        });
    }

    // Next buttons
    nextButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const currentStep = e.target.closest('.quiz-step');
            if (!currentStep) return;

            if (!validateStep(currentStep)) return;

            const idx = steps.indexOf(currentStep);
            // if (idx >= 0 && idx < steps.length - 1) {
            //   currentStep.classList.remove('active');
            //   steps[idx + 1].classList.add('active');
            // }

            if (idx >= 0 && idx < steps.length - 1) {
                currentStep.classList.remove('active');

                const nextStep = steps[idx + 1];
                nextStep.classList.add('active');

                if (nextStep.classList.contains('preview')) {
                    buildPreview();
                }
            }

        });
    });

    // Prev buttons
    prevButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const currentStep = e.target.closest('.quiz-step');
            if (!currentStep) return;
            const idx = steps.indexOf(currentStep);
            if (idx > 0) {
                currentStep.classList.remove('active');
                steps[idx - 1].classList.add('active');
            }
        });
    });

    // Submit handler
    form.addEventListener('submit', (e) => {
        // validate all steps. if any invalid, stop submit
        for (const step of steps) {
            if (!validateStep(step)) {
                steps.forEach((s) => s.classList.remove('active'));
                step.classList.add('active');
                e.preventDefault();
                return;
            }
        }

        // Build formatted email body
        const sectionEl = form.closest('section');
        const pageDetails =
            (form.dataset.pageDetails ||
                (sectionEl && sectionEl.dataset.pageDetails) ||
                'Kitchen');
        let emailBody = `Hi,\nYou have received a new response for ${pageDetails} Query:\n\n`;

        steps.forEach((step) => {
            const qIndex = step.dataset.step;
            const questionText =
                (step.querySelector('h3, h4, .question-label')?.innerText ||
                    `Question ${qIndex}`).trim();
            const radioSelected = step.querySelector('input[type="radio"]:checked');
            const emailField = step.querySelector('input[type="email"]');
            const phoneField = step.querySelector('input[type="tel"]');
            const otherField = step.querySelector('.other-input');

            if (radioSelected) {
                if (radioSelected.value === '__other__' && otherField?.value.trim()) {
                    emailBody += `${questionText}\n${otherField.value.trim()}\n\n`;
                } else {
                    emailBody += `${questionText}\n${radioSelected.value}\n\n`;
                }
            } else if (emailField) {
                emailBody += `What's your email ID?\n${emailField.value.trim()}\n\n`;
            } else if (phoneField) {
                emailBody += `What's your phone number?\n${phoneField.value.trim()}\n\n`;
            }
        });

        if (hiddenBody) {
            hiddenBody.value = emailBody.trim();
        }

        // Final phone validation
        if (phoneInput && !isValidPhoneExact10(phoneInput.value.trim())) {
            const phoneStep =
                phoneInput.closest('.quiz-step') ||
                steps.find((s) => s.contains(phoneInput));
            if (phoneStep) {
                showError(phoneStep, 'Please enter a valid 10-digit phone number.');
                steps.forEach((s) => s.classList.remove('active'));
                phoneStep.classList.add('active');
            }
            e.preventDefault();
            return;
        }

        const url = window.location.href;

        // Redirect ONLY when BOTH are present:
        // ?contact_posted=true AND #quizForm
        if (url.includes("contact_posted=true") && url.includes("#quizForm")) {
            window.location.href = "https://magari.in/pages/thank-you";
        }

        // Do not inject form_type or utf8 here.
        // Do not manually call form.submit().
        // Do not redirect here.
        // Let Shopify handle submission and success/error.
    });

    // Initialize first step
    steps.forEach((s, i) => s.classList.toggle('active', i === 0));

    /* ===============================
      SUCCESS POPUP AFTER SUBMIT
    =============================== */

    const successPopup = document.getElementById('successPopup');
    const submitAnotherBtn = document.getElementById('submitAnotherRequest');

    // Shopify success flag appears after successful contact submit
    const params = new URLSearchParams(window.location.search);

    if (params.get('contact_posted') === 'true' && successPopup) {
        successPopup.style.display = 'flex';

        // Optional: prevent background scroll
        document.body.style.overflow = 'hidden';
    }

    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', () => {
            // Remove contact_posted flag from URL
            // const url = new URL(window.location.href);
            // url.searchParams.delete('contact_posted');

            // // Reset URL without reloading with params
            // window.history.replaceState({}, '', url.pathname);

            // // Reload page fresh for new submission
            // window.location.reload();

            window.location.href = '/';
        });
    }

});