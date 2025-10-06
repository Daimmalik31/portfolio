  const chatButton = document.getElementById('chatButton');
        const chatPopup = document.getElementById('chatPopup');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('closeBtn');
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        const chatBody = document.getElementById('chatBody');
        const clearBtn = document.getElementById('clearBtn');

        const STORAGE_KEY = 'portfolio_chat_history';

        const responses = {
            "Who is Daim Malik?": "Daim Malik is a passionate Web Developer skilled in front-end and back-end technologies. He loves building responsive and creative websites with modern UI and smooth animations.",
            "What skills does Daim have?": "HTML5, CSS3, JavaScript, Bootstrap, PHP, and Laravel — plus experience with responsive layouts and animations.",
            "Show Daim’s projects": "Here are a few of Daim’s projects 👇<br><a href='http://picturetimes.42web.io/' target='_blank'><h4 style='color:white'>🔗PictureTime</h4></a><br><a href='https://sfcwebnova.bitwisecloud.com/' target='_blank'><h4 style='color:white'>🔗EventSphere</h4></a>",
            "How can I contact Daim?": "You can contact Daim via email 📧 <a href='mailto:daimmalik602@gmail.com'><h4 style='color:white'>daimmalik602@gmail.com</h4></a> or DM him on Instagram 💬 <a href='https://www.instagram.com/shewon_69/' target='_blank'><h4 style='color:white'>@Daim_Malik</h4></a>",
            "Tell me about Daim’s experience": "Daim has worked on multiple personal and live projects using Laravel, PHP, and Bootstrap — focusing on clean design and user-friendly interfaces.",
            "What technologies does Daim use?": "Daim is proficient in HTML5, CSS3, JavaScript, Bootstrap, PHP, and Laravel, with a knack for creating responsive and dynamic web applications.",
            "Show me live project links": "Check out Daim’s live projects: <br><a href='http://picturetimes.42web.io/' target='_blank'><h4 style='color:white'>🔗PictureTime</h4></a><br><a href='https://sfcwebnova.bitwisecloud.com/' target='_blank'><h4 style='color:white'>🔗EventSphere</h4></a>",
            "Where did Daim study?": "Daim is currently studying at Aptech Shahrah-e-Faisal, Karachi, specializing in Web Development."
        };

        // Toggle popup
        chatButton.addEventListener('click', () => {
            chatPopup.style.display = 'flex';
            overlay.style.display = 'block';
            loadHistory();
            messageInput.focus();
        });

        closeBtn.addEventListener('click', closeChat);
        overlay.addEventListener('click', closeChat);

        function closeChat() {
            chatPopup.style.display = 'none';
            overlay.style.display = 'none';
            messageInput.value = '';
        }

        // ESC to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatPopup.style.display === 'flex') {
                closeChat();
            }
        });

        // Send message
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            messageInput.value = '';
            sendBtn.disabled = true;

            // Simulate bot response delay
            showTyping();
            setTimeout(() => {
                const response = getBotResponse(message.toLowerCase());
                hideTyping();
                addMessage(response, 'bot');
                sendBtn.disabled = false;
            }, 800);
        }

        function addMessage(text, sender, timestampMs) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);

            const textNode = document.createElement('div');
            textNode.innerHTML = text;
            messageDiv.appendChild(textNode);

            const meta = document.createElement('div');
            meta.className = 'meta';
            const ts = typeof timestampMs === 'number' ? new Date(timestampMs) : new Date();
            meta.textContent = formatTime(ts);
            messageDiv.appendChild(meta);

            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Persist message
            persistMessage({ text, sender, timestamp: ts.getTime() });
        }

        function formatTime(date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const hh = (hours % 12) || 12;
            const mm = minutes < 10 ? '0' + minutes : minutes;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            return `${hh}:${mm} ${ampm}`;
        }

        function showTyping() {
            hideTyping();
            const typing = document.createElement('div');
            typing.className = 'message bot typing';
            const dots = document.createElement('div');
            dots.className = 'dots';
            dots.innerHTML = '<span></span><span></span><span></span>';
            typing.appendChild(dots);
            chatBody.appendChild(typing);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function hideTyping() {
            const el = chatBody.querySelector('.message.bot.typing');
            if (el) el.remove();
        }

        function persistMessage(entry) {
            try {
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                existing.push(entry);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            } catch (_) {
                // Ignore storage errors
            }
        }

        function loadHistory() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    // Initialize with greeting
                    chatBody.innerHTML = '';
                    addMessage('👋 Hi there! I’m Codex — Daim Malik’s virtual assistant. Would you like to know more about him?', 'bot');
                    return;
                }
                const items = JSON.parse(raw);
                chatBody.innerHTML = '';
                items.forEach(m => addMessage(m.text, m.sender, m.timestamp));
            } catch (_) {
                // Fallback: ensure greeting is shown
                chatBody.innerHTML = '';
                addMessage('👋 Hi there! I’m Codex — Daim Malik’s virtual assistant. Would you like to know more about him?', 'bot');
            }
        }

        clearBtn.addEventListener('click', () => {
            try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
            chatBody.innerHTML = '';
            addMessage('👋 Hi there! I’m Codex — Daim Malik’s virtual assistant. Would you like to know more about him?', 'bot');
            messageInput.focus();
        });

        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            if (["yes", "sure", "okay"].includes(lowerMessage)) {
                return "Great! Try one of the options below to learn more about Daim!";
            }
            for (let question in responses) {
                if (lowerMessage.includes(question.toLowerCase().replace("?", "").trim()) ||
                    question.toLowerCase().includes(lowerMessage.replace("?", "").trim())) {
                    return responses[question];
                }
            }
            return "Hmm, I didn’t quite get that. Try one of these questions below!";
        }

        // Quick reply buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                messageInput.value = btn.textContent;
                sendMessage();
            });
        });