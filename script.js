document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.getElementById('terminal-content');
    let currentLine = document.getElementById('current-line');
    let placeholder = currentLine.nextElementSibling;
    
    currentLine.focus();

    let commandHistory = [];
    let historyIndex = -1;
    let currentCommand = '';
    // commands! what others should i add (stop looking at my code!) its bad, ik
    const commands = {
        'help': () => {
            return `Available commands:
projects   - see my projects
filehost   - visit my file host
email      - contact me with your email
discord    - my discord profile
pgp        - my pgp key
github     - my github profile
whoami     - show current user
clear      - clear terminal 
cats       - shows my 2 cats`;
        },
        'projects': () => {
            return `Current Projects:
  - Personal Website (This site!!)
  - Discord Bot (Does many things)
  - calculator with ai (JS)
  - Unenrollment Toolkit (Dead)
  - game rules for domination (Site)`;
        },
        'filehost': () => {
            window.open('https://files.antimatter137.dev', '_blank');
            return 'Opening file host...';
        },
        'clear': () => {
            terminalContent.innerHTML = `
                <div class="line">
                    <span class="prompt">antimqtter@antimatter137.dev:/$ </span>
                    <span class="command" id="current-line" contenteditable="true"></span>
                    <span class="placeholder">type help for commands</span>
                </div>
            `;
            currentLine = terminalContent.querySelector('#current-line');
            placeholder = currentLine.nextElementSibling;
            currentLine.focus();
            return null;
        },
        'email': () => {
            window.open('mailto:antimatter137@gmail.com', '_blank');
            return 'Opening email client...';
        },
        'discord': () => {
            window.open('https://discord.com/users/1202358603940634688', '_blank');
            return 'Opening Discord profile...';
        },
         'pgp': () => {
            window.open('https://antimatter137.dev/pgp.txt', '_blank');
            return 'Opening my pgp key...';
        },
        'fuck': () => {
            return 'FUCK YOU!';
        },
        'github': () => { 
            window.open('https://github.com/antimqtter', '_blank');
            return 'Opening GitHub profile...';
        },
        'whoami': () => {
            return 'antimqtter';
        },
        'cats': () => {
            window.open('https://antimatter137.dev/cats', '_blank');
            return 'Opening cat pics...';
        },
    };

    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        currentLine.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (!terminalContent.contains(document.activeElement)) return;

        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                processCommand();
                break;
            case 'Backspace':
                if (currentCommand.length > 0) {
                    currentCommand = currentCommand.slice(0, -1);
                    updateCurrentLine();
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                navigateHistory('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                navigateHistory('down');
                e.preventDefault();
                break;  
            default:
                if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    currentCommand += e.key;
                    updateCurrentLine();
                    e.preventDefault();
                }
        }
    });

    function processCommand() {
        const cmd = currentCommand.trim().toLowerCase();
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        if (cmd === 'clear') {
            commands['clear']();
        } else {
            const commandDiv = document.createElement('div');
            commandDiv.className = 'line';
            commandDiv.innerHTML = `<span class="prompt">antimatter@antimatter137.dev:/$ </span><span class="command-text">${currentCommand}</span>`;
            
            const lastLine = terminalContent.lastElementChild;
            terminalContent.removeChild(lastLine);
            
            terminalContent.appendChild(commandDiv);

            if (currentCommand.trim()) {
                const output = document.createElement('div');
                output.className = 'output';

                if (commands[cmd]) {
                    const result = commands[cmd]();
                    if (result !== null) {
                        output.textContent = result;
                        terminalContent.appendChild(output);
                    }
                } else {
                    output.textContent = `'${currentCommand}' is not recognized as a command :(`;
                    terminalContent.appendChild(output);
                }
            }
// should i keep the windows C: or switch to linux, hmmmmm...
            const newLine = document.createElement('div');
            newLine.className = 'line';
            newLine.innerHTML = `
                <span class="prompt">antimatter@antimatter137.dev:/$ </span>
                <span class="command" id="current-line" contenteditable="true"></span>
                <span class="placeholder">type help for commands</span>
            `;
            terminalContent.appendChild(newLine);
        }

        if (currentCommand.trim()) {
            commandHistory.push(currentCommand);
            historyIndex = commandHistory.length;
        }

        currentCommand = '';
        currentLine = terminalContent.querySelector('#current-line');
        placeholder = currentLine.nextElementSibling; 
        currentLine.focus();
        
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    function updateCurrentLine() {
        if (currentLine) {
            currentLine.textContent = currentCommand;

            if (placeholder) {
                if (currentCommand.length > 0) {
                    placeholder.style.display = 'none';
                } else {
                    placeholder.style.display = 'inline';
                }
            }
        }
    }

    function navigateHistory(direction) {
        if (commandHistory.length === 0) return;

        if (direction === 'up') {
            historyIndex = Math.max(0, historyIndex - 1);
        } else {
            historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        }

        currentCommand = historyIndex < commandHistory.length ? commandHistory[historyIndex] : '';
        updateCurrentLine();
    }

    placeholder = currentLine.nextElementSibling;
});

// goofy ahhh discord api code down there

const DISCORD_USER_ID = '1202358603940634688';

const statusIndicator = document.getElementById('discord-status');
const profileImageBorder = document.getElementById('profile-image-border');

function updateDiscordStatus(status) {
    
    let newStatus = 'offline'; 

    if (status === 'online' || status === 'idle' || status === 'dnd') {
        newStatus = status;
    }

    const statusClassName = 'status-' + newStatus;

    if (statusIndicator) {
        statusIndicator.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
        statusIndicator.classList.add(statusClassName);
    }

    if (profileImageBorder) {
        profileImageBorder.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
        profileImageBorder.classList.add(statusClassName);
    }
}


function connectLanyard() {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

    socket.onopen = () => {
        console.log('Lanyard WebSocket connected.');
        socket.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: DISCORD_USER_ID
            }
        }));
    };

    socket.onclose = () => {
        console.log('Lanyard WebSocket disconnected. Reconnecting in 5s...');
        setTimeout(connectLanyard, 5000);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.op === 1) {
            socket.send(JSON.stringify({ op: 3 }));
            return;
        }

        if (data.op === 0) {
            const status = data.d.discord_status;
            console.log('Discord Status Update:', status);
            updateDiscordStatus(status);
        }
    };

    socket.onerror = (error) => {
        console.error('Lanyard WebSocket error:', error);
        socket.close();
    };
}


connectLanyard();



