// script.js

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
// We need the chatbot toggler to handle the chat visibility logic
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".chatbot header span");


let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    // Scroll to the latest message
    chatbox.scrollTo(0, chatbox.scrollHeight);
    return chatLi;
}

const generateResponse = (incomingLi) => {
    const messageElement = incomingLi.querySelector("p");

    // Use puter.ai.chat() for text generation with gpt-5-nano
    puter.ai.chat(userMessage, { model: "gpt-5-nano" })
        .then(response => {
            // The response contains the generated text
            messageElement.textContent = response;
        })
        .catch((error) => {
            console.error("Puter.js Chat Error:", error);
            messageElement.textContent = "Oops! I ran into an issue. Please try again.";
        })
        .finally(() => {
            // Re-enable the input and button after the response
            chatInput.removeAttribute('disabled');
            sendChatBtn.removeAttribute('disabled');
            chatInput.focus();
            // Scroll to the latest message again after the full response is loaded
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear input and disable elements while waiting
    chatInput.value = "";
    chatInput.setAttribute('disabled', true);
    sendChatBtn.setAttribute('disabled', true);
    
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    // Use a small delay for a "thinking" effect before calling the API
    setTimeout(() => {
        const incomingLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingLi);
        
        // Ensure puter is initialized before calling the API
        if (typeof puter === 'undefined') {
            incomingLi.querySelector("p").textContent = "Error: puter.js script not loaded.";
            chatInput.removeAttribute('disabled');
            sendChatBtn.removeAttribute('disabled');
            return;
        }

        generateResponse(incomingLi);
    }, 600);
}

// Event listeners
// Toggle chatbot visibility (if you had this functionality in a separate script, it's good to consolidate here)
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Add event listener for 'Enter' key press on the textarea for convenience
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents a new line
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);