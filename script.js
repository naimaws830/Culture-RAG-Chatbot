// Main application state
let isLoading = false;
let conversations = [];

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const chatInterface = document.getElementById('chat-interface');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');
const sendButton = document.getElementById('send-button');
const loadingToast = document.getElementById('loading-toast');

// Welcome screen elements
const welcomeForm = document.getElementById('welcome-form');
const welcomeMessageInput = document.getElementById('welcome-message-input');
const welcomeSendButton = document.getElementById('welcome-send-button');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadConversationHistory();
});

// Event Listeners
function setupEventListeners() {
    chatForm.addEventListener('submit', handleFormSubmit);
    messageInput.addEventListener('input', adjustTextareaHeight);
    messageInput.addEventListener('keydown', handleKeydown);
    
    // Welcome form listeners
    welcomeForm.addEventListener('submit', handleWelcomeFormSubmit);
    welcomeMessageInput.addEventListener('input', adjustWelcomeTextareaHeight);
    welcomeMessageInput.addEventListener('keydown', handleWelcomeKeydown);
}

// Handle welcome form submission
function handleWelcomeFormSubmit(e) {
    e.preventDefault();
    const message = welcomeMessageInput.value.trim();
    if (message && !isLoading) {
        showChatInterface();
        sendMessage(message);
        welcomeMessageInput.value = '';
        adjustWelcomeTextareaHeight();
    }
}

// Handle welcome form keyboard shortcuts
function handleWelcomeKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleWelcomeFormSubmit(e);
    }
}

// Adjust welcome textarea height dynamically
function adjustWelcomeTextareaHeight() {
    welcomeMessageInput.style.height = 'auto';
    welcomeMessageInput.style.height = Math.min(welcomeMessageInput.scrollHeight, 120) + 'px';
    
    // Update send button state
    welcomeSendButton.disabled = !welcomeMessageInput.value.trim() || isLoading;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && !isLoading) {
        sendMessage(message);
        messageInput.value = '';
        adjustTextareaHeight();
    }
}

// Handle keyboard shortcuts
function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleFormSubmit(e);
    }
}

// Adjust textarea height dynamically
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    
    // Update send button state
    sendButton.disabled = !messageInput.value.trim() || isLoading;
}

// Example question handler
function askExample(question) {
    showChatInterface();
    sendMessage(question);
}

// Show chat interface
function showChatInterface() {
    welcomeScreen.classList.add('hidden');
    chatInterface.classList.remove('hidden');
    messageInput.focus();
}

// Send message and get response
async function sendMessage(message) {
    if (isLoading) return;
    
    const conversation = {
        id: Date.now().toString(),
        question: message,
        answer: '',
        timestamp: new Date()
    };
    
    conversations.push(conversation);
    
    // Show user message immediately
    addMessageToUI(message, true, conversation.timestamp);
    
    // Show loading state
    showLoadingMessage();
    setLoadingState(true);
    
    try {
        const response = await generateRAGResponse(message);
        conversation.answer = response;
        
        // Hide loading and show response
        hideLoadingMessage();
        addMessageToUI(response, false, conversation.timestamp);
        
        // Save to local storage
        saveConversationHistory();
        
    } catch (error) {
        console.error('Error generating response:', error);
        hideLoadingMessage();
        addMessageToUI('Sorry, I encountered an error while generating a response. Please try again.', false, conversation.timestamp);
    } finally {
        setLoadingState(false);
    }
}

// Generate RAG response using OpenRouter API
async function generateRAGResponse(query) {
    try {
        // First, retrieve relevant content
        const relevantContent = retrieveRelevantContent(query);
        
        if (!relevantContent) {
            return "Sorry, I can only answer based on my knowledge file about the local setup guide.";
        }
        
        // Prepare the prompt with context
        const contextPrompt = `Context from the setup guide:\n\n${relevantContent}\n\nUser question: ${query}`;
        
        // Call OpenRouter API
        const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Setup Guide RAG Chatbot'
            },
            body: JSON.stringify({
                model: OPENROUTER_CONFIG.model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: contextPrompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            console.log('API error, using fallback response');
            return getFallbackResponse(query);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('OpenRouter API error:', error);
        return getFallbackResponse(query);
    }
}

// Fallback response generation
function getFallbackResponse(query) {
    const queryLower = query.toLowerCase();
    
    // Check for specific keywords and return appropriate mock responses
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
        if (queryLower.includes(keyword)) {
            return response;
        }
    }
    
    // Sarawakian folklore contextual responses
    if (queryLower.includes('malay') && (queryLower.includes('legend') || queryLower.includes('story') || queryLower.includes('tale'))) {
        return 'Sarawakian Malay legends include **Bujang Senang** (the legendary giant crocodile), **Puteri Santubong** (the weaving princess cursed into a mountain), and **Nakhoda Ragam** (the brave warrior prince). These stories carry important moral lessons about courage, humility, and respect.';
    }
    
    if (queryLower.includes('bidayuh') && (queryLower.includes('tale') || queryLower.includes('story') || queryLower.includes('legend'))) {
        return 'Bidayuh tales include **Dayang Isah** (the kind maiden rewarded for her patience), **Dang Nyadung** (the brave maiden who sacrificed herself), and the **Semenggok Stone** story about respecting traditions and avoiding greed.';
    }
    
    if (queryLower.includes('iban') && (queryLower.includes('hero') || queryLower.includes('legend') || queryLower.includes('story'))) {
        return 'Iban folklore features **Keling of Panggau Libau** (the supernatural warrior hero), **Kumang** (the wise and beautiful heroine), and **Menjaya Raja Manang** (the great shaman who taught healing arts). These figures represent courage, wisdom, and spiritual guidance.';
    }
    
    if (queryLower.includes('medicine') || queryLower.includes('healing') || queryLower.includes('remedy') || queryLower.includes('treatment')) {
        return 'Sarawak\'s indigenous communities have rich traditional medicine practices. Each community uses local plants: **Malay** use daun belalai gajah for fever, **Bidayuh** use daun tampoi for cough, and **Iban** use akar engkerabai for fever. These remedies have been passed down through generations.';
    }

    return 'I can help you learn about Sarawakian folklore and traditional medicine. You can ask about Malay legends like Bujang Senang, Bidayuh tales like Dayang Isah, Iban heroes like Keling and Kumang, or traditional healing practices from these communities.';
}

// UI Helper Functions
function addMessageToUI(message, isUser, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `message-avatar ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
        avatarDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>`;
    } else {
        avatarDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
            </svg>`;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${isUser ? 'user' : 'bot'}`;
    bubbleDiv.innerHTML = formatMessage(message);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(timestamp);
    
    contentDiv.appendChild(bubbleDiv);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.id = 'current-loading';
    
    loadingDiv.innerHTML = `
        <div class="message-avatar bot">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
            </svg>
        </div>
        <div class="loading-bubble">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('current-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function setLoadingState(loading) {
    isLoading = loading;
    sendButton.disabled = loading || !messageInput.value.trim();
    messageInput.disabled = loading;
    
    if (loading) {
        loadingToast.classList.remove('hidden');
    } else {
        loadingToast.classList.add('hidden');
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
}

function formatMessage(message) {
    // Basic markdown-style formatting
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background-color: #f1f5f9; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.8em;">$1</code>')
        .replace(/\n/g, '<br>');
}

// Local Storage Functions
function saveConversationHistory() {
    try {
        localStorage.setItem('chatbot-conversations', JSON.stringify(conversations));
    } catch (error) {
        console.error('Error saving conversation history:', error);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('chatbot-conversations');
        if (saved) {
            conversations = JSON.parse(saved);
            
            // If there are previous conversations, show chat interface
            if (conversations.length > 0) {
                showChatInterface();
                
                // Restore messages to UI
                conversations.forEach(conv => {
                    addMessageToUI(conv.question, true, new Date(conv.timestamp));
                    if (conv.answer) {
                        addMessageToUI(conv.answer, false, new Date(conv.timestamp));
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading conversation history:', error);
        conversations = [];
    }
}