/**
 * BIM AI Assistant - Interaction Logic
 * Handles UI events and communication with the (mock) API.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inject HTML structure if not present
  if (!document.getElementById("agentBubble")) {
    const assistantHTML = `
            <div class="agent-bubble" id="agentBubble" title="Asistente BIM AI">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="agent-window" id="agentWindow">
                <div class="agent-header">
                    <div class="agent-title">
                        <span class="agent-status"></span>
                        BIM AI Assistant
                    </div>
                    <button id="closeAgent" style="background:none; border:none; color:white; cursor:pointer; opacity:0.5;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="agent-messages" id="agentMessages">
                    <div class="message bot">
                        Hola Andrés, soy tu asistente especializado en BIM. ¿En qué puedo ayudarte hoy con tus herramientas o proyectos?
                    </div>
                </div>
                <div class="agent-input-container">
                    <input type="text" class="agent-input" id="agentInput" placeholder="Haz una consulta técnica...">
                    <button class="agent-send" id="agentSend">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", assistantHTML);
  }

  const bubble = document.getElementById("agentBubble");
  const window = document.getElementById("agentWindow");
  const closeBtn = document.getElementById("closeAgent");
  const input = document.getElementById("agentInput");
  const sendBtn = document.getElementById("agentSend");
  const messagesContainer = document.getElementById("agentMessages");

  // Toggle window visibility
  bubble.addEventListener("click", () => {
    window.style.display = "flex";
    bubble.style.display = "none";
    input.focus();
  });

  closeBtn.addEventListener("click", () => {
    window.style.display = "none";
    bubble.style.display = "flex";
  });

  const addMessage = (text, sender) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerHTML = text; // Use innerHTML to allow basic formatting if needed
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  };

  const showTypingIndicator = () => {
    const typingDiv = addMessage(
      '<span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span>',
      "bot",
    );
    typingDiv.id = "typingIndicator";
    return typingDiv;
  };

  const removeTypingIndicator = () => {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
  };

  const getAIResponse = async (userText) => {
    // Here we would call the real /api/chat endpoint
    // For now, we simulate the logic based on keywords

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Realism delay

    const lowerText = userText.toLowerCase();

    if (lowerText.includes("perfil") || lowerText.includes("icha")) {
      return "Puedo acceder a la base de datos de 710 perfiles ICHA que tienes en `icha_data.js`. ¿Buscas un perfil HN, HEB o quizás una canal o ángulo?";
    }

    if (lowerText.includes("revit") || lowerText.includes("api")) {
      return "Andrés es experto en la Revit API. Ha desarrollado plugins en C# y scripts en Python para automatizar el modelado de estructuras y la generación de planos.";
    }

    if (lowerText.includes("hola") || lowerText.includes("quien")) {
      return "¡Hola! Soy un agente inteligente diseñado para trabajar en este portafolio BIM. Mi misión es ayudar a los visitantes a entender las capacidades técnicas de Andrés Gallo.";
    }

    return "Esa es una consulta interesante. Actualmente estoy operando como un 'esqueleto inteligente'. Si conectamos mi lógica a un modelo como GPT-4 o Gemini, podré realizar cálculos complejos y análisis de modelos BIM directamente aquí.";
  };

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTypingIndicator();

    try {
      const response = await getAIResponse(text);
      removeTypingIndicator();
      addMessage(response, "bot");
    } catch (error) {
      removeTypingIndicator();
      addMessage("Lo siento, hubo un error al procesar tu consulta.", "bot");
    }
  };

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });
});
