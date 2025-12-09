const form = document.getElementById('payment-form');

if (form) {
    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expMonth = document.getElementById('exp-month').value;
    const expYear = document.getElementById('exp-year').value;
    const securityCode = document.getElementById('security-code').value;

    if (!validateCard(cardNumber, expMonth, expYear, securityCode)) return;

    processPayment(cardNumber);
}

function validateCard(cardNumber, expMonth, expYear, securityCode) {

    if (!/^\d+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
        alert("Invalid card number");
        return false;
    }

    if (!expMonth || !expYear) {
        alert("Please select expiration date");
        return false;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (parseInt(expYear) < currentYear || 
       (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)) {
        alert("Card expired");
        return false;
    }

    if (!/^\d{3,4}$/.test(securityCode)) {
        alert("Invalid CVV");
        return false;
    }

    return true;
}

function processPayment(cardNumber) {

    const button = document.getElementById('continue-button');
    button.textContent = "Processing...";
    button.disabled = true;

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: "demo-payment",
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        const last4 = cardNumber.slice(-4);
        localStorage.setItem("cardLast4", last4);
        window.location.href = "success.html";
    })
    .catch(error => {
        console.error(error);
        alert("Unable to contact demo server.");
        resetButton();
    });
}

function resetButton() {
    const button = document.getElementById('continue-button');
    button.textContent = "Continue";
    button.disabled = false;
}