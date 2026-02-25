// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('pdpCustomizableForm');
//   if (!form) return;

//   const hiddenBody = form.querySelector('#contactBody');
//   const successMessage = document.getElementById('pdpFormSuccessMessage');

//   let autoEmail = form.querySelector('#autoEmail');
//   if (!autoEmail) {
//     autoEmail = document.createElement('input');
//     autoEmail.type = 'hidden';
//     autoEmail.name = 'contact[email]';
//     autoEmail.id = 'autoEmail';
//     form.appendChild(autoEmail);
//   }

//   // Build email body before submit
//   form.addEventListener('submit', () => {
//     const phone = form.querySelector('#phoneNumber');
//     autoEmail.value = phone && phone.value
//       ? `${phone.value}@noemail.yourstore.com`
//       : 'noemail@yourstore.com';

//     let emailBody = 'New Customization Request:\n\n';

//     // Text inputs
//     form.querySelectorAll('.form-text-with-input-container').forEach((wrap) => {
//       const label = wrap.querySelector('label')?.innerText.trim();
//       const input = wrap.querySelector('input');

//       if (label && input && input.value.trim()) {
//         emailBody += `${label}\n${input.value.trim()}\n\n`;
//       }
//     });

//     // Checkbox groups
//     form.querySelectorAll(
//       '.room-types-options-container, .color-preferences-container, .room-spaces-container'
//     ).forEach((group) => {
//       const question = group.dataset.question;
//       const checkedValues = Array.from(
//         group.querySelectorAll('input[type="checkbox"]:checked')
//       ).map((c) => c.value);

//       if (question && checkedValues.length) {
//         emailBody += `${question}\n${checkedValues.join(', ')}\n\n`;
//       }
//     });

//     if (hiddenBody) {
//       hiddenBody.value = emailBody.trim();
//     }
//   });

//   // After successful submit
//   if (window.location.search.includes('contact_posted=true')) {
//     if (successMessage) {
//       successMessage.style.display = 'block';
//     }

//     // Reset form fields
//     form.reset();
//   }
// });


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pdpCustomizableForm');
    if (!form) return;

    const hiddenBody = form.querySelector('#contactBody');
    const successMessage = document.getElementById('pdpFormSuccessMessage');

    form.addEventListener('submit', () => {
        const locationInput = form.querySelector('#locationText');

        let emailBody = 'New Customization Request:\n\n';

        /* ---------------------------------
           TEXT INPUTS (Name, Phone, Email, Help, Others)
        --------------------------------- */
        form.querySelectorAll('.form-text-with-input-container').forEach((wrap) => {
            const label = wrap.querySelector('label')?.innerText.trim();
            const input = wrap.querySelector('input');

            if (label && input && input.value.trim()) {
                emailBody += `${label}\n${input.value.trim()}\n\n`;
            }
        });

        /* ---------------------------------
           CITY / LOCATION
        --------------------------------- */
        if (locationInput && locationInput.value.trim()) {
            emailBody += `City / Location\n${locationInput.value.trim()}\n\n`;
        }

        /* ---------------------------------
           CHECKBOX GROUPS
        --------------------------------- */
        form.querySelectorAll(
            '.room-types-options-container, .color-preferences-container, .room-spaces-container'
        ).forEach((group) => {
            const question = group.dataset.question;
            const checkedValues = Array.from(
                group.querySelectorAll('input[type="checkbox"]:checked')
            ).map((c) => c.value);

            if (question && checkedValues.length) {
                emailBody += `${question}\n${checkedValues.join(', ')}\n\n`;
            }
        });

        if (hiddenBody) {
            hiddenBody.value = emailBody.trim();
        }
    });

    /* ---------------------------------
       SUCCESS HANDLING
    --------------------------------- */
    if (window.location.search.includes('contact_posted=true')) {
        if (successMessage) {
            successMessage.style.display = 'block';
        }
        form.reset();
    }
});