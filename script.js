// ==========================================
// CloudContact - Frontend Logic
// ==========================================

const API_URL = "https://qyvdjginwh.execute-api.us-east-1.amazonaws.com/contact";


// ==========================================
// DOM Elements
// ==========================================

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const characterCount = document.getElementById("characterCount");

const submitBtn = document.getElementById("submitBtn");
const buttonText = document.getElementById("buttonText");

const responseMessage = document.getElementById("responseMessage");


// ==========================================
// Character Counter
// ==========================================

messageInput.addEventListener("input", () => {

  const currentLength = messageInput.value.length;

  characterCount.textContent = `${currentLength} / 500`;

});


// ==========================================
// Helper Functions
// ==========================================

function showError(input, errorElement, message) {

  input.classList.add("invalid");
  errorElement.textContent = message;

}


function clearError(input, errorElement) {

  input.classList.remove("invalid");
  errorElement.textContent = "";

}


function clearAllErrors() {

  clearError(nameInput, nameError);
  clearError(emailInput, emailError);
  clearError(messageInput, messageError);

}


function showResponse(message, type) {

  responseMessage.textContent = message;

  responseMessage.className = `response-message ${type}`;

}


function clearResponse() {

  responseMessage.textContent = "";
  responseMessage.className = "response-message";

}


// ==========================================
// Email Validation
// ==========================================

function isValidEmail(email) {

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);

}


// ==========================================
// Form Validation
// ==========================================

function validateForm() {

  let isValid = true;

  clearAllErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();


  // -------------------------
  // Name validation
  // -------------------------

  if (name.length === 0) {

    showError(
      nameInput,
      nameError,
      "Please enter your name."
    );

    isValid = false;

  } else if (name.length < 2) {

    showError(
      nameInput,
      nameError,
      "Name must contain at least 2 characters."
    );

    isValid = false;

  } else if (name.length > 50) {

    showError(
      nameInput,
      nameError,
      "Name cannot exceed 50 characters."
    );

    isValid = false;

  }


  // -------------------------
  // Email validation
  // -------------------------

  if (email.length === 0) {

    showError(
      emailInput,
      emailError,
      "Please enter your email address."
    );

    isValid = false;

  } else if (!isValidEmail(email)) {

    showError(
      emailInput,
      emailError,
      "Please enter a valid email address."
    );

    isValid = false;

  }


  // -------------------------
  // Message validation
  // -------------------------

  if (message.length === 0) {

    showError(
      messageInput,
      messageError,
      "Please enter a message."
    );

    isValid = false;

  } else if (message.length < 10) {

    showError(
      messageInput,
      messageError,
      "Message must contain at least 10 characters."
    );

    isValid = false;

  } else if (message.length > 500) {

    showError(
      messageInput,
      messageError,
      "Message cannot exceed 500 characters."
    );

    isValid = false;

  }


  return isValid;

}


// ==========================================
// Remove errors while typing
// ==========================================

nameInput.addEventListener("input", () => {

  clearError(nameInput, nameError);

});


emailInput.addEventListener("input", () => {

  clearError(emailInput, emailError);

});


messageInput.addEventListener("input", () => {

  clearError(messageInput, messageError);

});


// ==========================================
// Submit Form
// ==========================================

contactForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  clearResponse();


  // --------------------------------------
  // Step 1: Validate the form
  // --------------------------------------

  if (!validateForm()) {

    showResponse(
      "Please correct the highlighted fields.",
      "error"
    );

    return;

  }


  // --------------------------------------
  // Step 2: Collect form data
  // --------------------------------------

  const formData = {

    name: nameInput.value.trim(),

    email: emailInput.value.trim(),

    message: messageInput.value.trim()

  };


  // --------------------------------------
  // Step 3: Check API configuration
  // --------------------------------------

  if (!API_URL) {

    showResponse(
      "The form is ready, but the AWS backend has not been connected yet.",
      "error"
    );

    return;

  }


  // --------------------------------------
  // Step 4: Loading state
  // --------------------------------------

  submitBtn.disabled = true;

  buttonText.textContent = "Sending...";


  try {

    // ----------------------------------
    // Step 5: Send request to API Gateway
    // ----------------------------------

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(formData)

    });


    // ----------------------------------
    // Step 6: Read Lambda response
    // ----------------------------------

    const data = await response.json();


    // ----------------------------------
    // Step 7: Handle response
    // ----------------------------------

    if (response.ok) {

      showResponse(
        data.message || "Message submitted successfully!",
        "success"
      );

      contactForm.reset();

      characterCount.textContent = "0 / 500";

    } else {

      showResponse(
        data.message || "Something went wrong. Please try again.",
        "error"
      );

    }


  } catch (error) {

    console.error("Request failed:", error);

    showResponse(
      "Unable to connect to the server. Please try again later.",
      "error"
    );

  } finally {

    // ----------------------------------
    // Restore button
    // ----------------------------------

    submitBtn.disabled = false;

    buttonText.textContent = "Send message";

  }

});