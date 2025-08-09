let keyPressTimes = {};
        let totalKeys = 0;
        let totalPressTime = 0;
        let startTime = null;
        let wordCount = 0;

        let keystrokeCount = parseInt(localStorage.getItem("keystrokeCount")) || 0;

        document.getElementById("counter").textContent = keystrokeCount;
        document.addEventListener("keydown", function () {
            keystrokeCount++;
            localStorage.setItem("keystrokeCount", keystrokeCount);
            document.getElementById("counter").textContent = keystrokeCount;
         });

        function playRandomSound(sounds) {
            let soundId = sounds[Math.floor(Math.random() * sounds.length)];
            let audio = document.getElementById(soundId);
            if (audio) {
                audio.currentTime = 0; 
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        }

        function updateStats() {
            document.getElementById('totalKeys').textContent = totalKeys;
            document.getElementById('avgTime').textContent = totalKeys > 0 ? Math.round(totalPressTime / totalKeys) : 0;
            
            // Calculate WPM
            if (startTime) {
                const minutesPassed = (Date.now() - startTime) / 60000;
                const wpm = Math.round(wordCount / minutesPassed) || 0;
                document.getElementById('wpm').textContent = wpm;
            }
        }

        function countWords(text) {
            return text.trim().split(/\s+/).filter(word => word.length > 0).length;
        }

        function getTypingStyle(duration) {
            if (duration < 100) return { type: 'lightning', emoji: '⚡', color: '#ffd700', description: 'Lightning Fast!', sounds: ['soft1', 'soft2'] };
            if (duration < 150) return { type: 'soft', emoji: '🍼', color: '#c2f0c2', description: 'Soft Baby Typing', sounds: ['soft1', 'soft2'] };
            if (duration < 250) return { type: 'normal', emoji: '😊', color: '#cce0ff', description: 'Perfect Rhythm', sounds: ['normal'] };
            if (duration < 350) return { type: 'heavy', emoji: '🔨', color: '#ffcc99', description: 'Heavy Handed', sounds: ['normal'] };
            return { type: 'smash', emoji: '💥', color: '#ffb3b3', description: 'Keyboard Destroyer!', sounds: ['smash1', 'smash2'] };
        }

        document.addEventListener("keydown", function(event) {
            keyPressTimes[event.key] = Date.now();
            
            if (!startTime) {
                startTime = Date.now();
            }
        });

        document.addEventListener("keyup", function(event) {
            if (!keyPressTimes[event.key]) return;
            
            const pressDuration = Date.now() - keyPressTimes[event.key];
            const resultDiv = document.getElementById("result");
            const lastKeyDiv = document.getElementById("lastKey");
            
            // Update statistics
            totalKeys++;
            totalPressTime += pressDuration;
            
            // Count words from typing area
            const typingArea = document.querySelector('.typing-area');
            if (typingArea) {
                wordCount = countWords(typingArea.value);
            }
            
            updateStats();
            
            // Display last key
            const keyDisplay = event.key === ' ' ? 'Space' : event.key.length === 1 ? event.key.toUpperCase() : event.key;
            lastKeyDiv.innerHTML = `Last key: <b>${keyDisplay}</b> (${pressDuration}ms)`;
            
            // Get typing style
            const style = getTypingStyle(pressDuration);
            
            // Update result display
            resultDiv.innerHTML = `
                <span class="emoji">${style.emoji}</span>
                <div>${style.description}</div>
                <div style="font-size: 1rem; opacity: 0.8;">${pressDuration}ms</div>
            `;
            
            // Visual feedback
            document.body.style.background = `linear-gradient(135deg, ${style.color}, #764ba2)`;
            
            // Add animation classes
            if (style.type === 'smash') {
                resultDiv.classList.add('shake');
                setTimeout(() => resultDiv.classList.remove('shake'), 500);
            } else if (style.type === 'lightning') {
                resultDiv.classList.add('glow');
                setTimeout(() => resultDiv.classList.remove('glow'), 500);
            }
            
            // Play sound
            playRandomSound(style.sounds);
            
            // Reset background after animation
            setTimeout(() => {
                document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 600);
            
            delete keyPressTimes[event.key];
        });

        // Focus the typing area when page loads
        window.addEventListener('load', function() {
            document.querySelector('.typing-area').focus();
        });