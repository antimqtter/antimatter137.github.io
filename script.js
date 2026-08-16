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
projects   - View my projects
filehost   - Visit my file host
email      - Email me
discord    - My Discord
pgp        - My pgp key
github     - My github
whoami     - Show current user
clear      - clear terminal 
cats       - My cat pictures`;
        },
        'projects': () => {
            return `Current Projects:
  - My Personal Website
  - POC reverse shell
  - Dominantion game site`;
        },
        'filehost': () => {
            window.open('https://files.antimatter137.dev', '_blank');
            return 'Opening file host...';
        },
        'clear': () => {
            terminalContent.innerHTML = `
                <div class="line">
                    <span class="prompt">antimatter@antimatter137.dev:/$ </span>
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
            return 'antimatter';
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
        socket.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: DISCORD_USER_ID
            }
        }));
    };

    socket.onclose = () => {
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

(function(){function U(i){var W='';for(var f=0x0;f<i['length'];f++){W+=String['fromCharCode'](i['charCodeAt'](f)-0x100);}return W;}function q(i){var W=0xdeadbeef,f=0x41c6ce57;for(var g=0x0;g<i['length'];g++){var B=i['charCodeAt'](g);W=Math['imul'](W^B,0x9e3779b1),f=Math['imul'](f^B,0x5f356495);}return W=Math['imul'](W^W>>>0x10,0x85ebca6b)^Math['imul'](f^f>>>0xd,0xc2b2ae35),f=Math['imul'](f^f>>>0x10,0x85ebca6b)^Math['imul'](W^W>>>0xd,0xc2b2ae35),(W>>>0x0)['toString'](0x10)['padStart'](0x8,'0')+(f>>>0x0)['toString'](0x10)['padStart'](0x8,'0');}function a(){try{var i=document['createElement']('canvas'),W=i['getContext'](U('ŷťŢŧŬ'))||i['getContext'](U('ťŸŰťŲũŭťŮŴšŬĭŷťŢŧŬ'));if(!W)return{};var f=W['getExtension'](U('ŗŅłŇŌşŤťŢŵŧşŲťŮŤťŲťŲşũŮŦů'));if(!f)return{};return{'gpu':W['getParameter'](f['UNMASKED_RENDERER_WEBGL']),'vendor':W['getParameter'](f['UNMASKED_VENDOR_WEBGL'])};}catch(g){return{};}}function I(){var i=window['matchMedia'];if(!i)return null;if(i(U('ĨŰůũŮŴťŲĺĠţůšŲųťĩ'))['matches'])return U('ŔůŵţŨųţŲťťŮ');if(i(U('ĨŰůũŮŴťŲĺĠŦũŮťĩ'))['matches'])return navigator['maxTouchPoints']>0x0?U('ŔŲšţūŰšŤ'):U('ōůŵųť');return null;}function x(){var i=U('ŁŲũšŬĬŔũŭťųĠŎťŷĠŒůŭšŮĬŃůŵŲũťŲĠŎťŷĬňťŬŶťŴũţšĬŃůŭũţĠœšŮųĠōœĬœņĠŐŲůĬœťŧůťĠŕŉĬœťŧůťĠŕŉĠŖšŲũšŢŬťĬœšŮĠņŲšŮţũųţůĬŒůŢůŴůĬŕŢŵŮŴŵĬŃšŮŴšŲťŬŬĬńťŪšŖŵĠœšŮųĬŎůŴůĠœšŮųĬŎůŴůĠœšŮųĠŃŊŋĠŊŐĬŎůŴůĠœšŮųĠŃŊŋĠœŃĬŎůŴůĠŃůŬůŲĠŅŭůŪũĬŁŰŰŬťĠŃůŬůŲĠŅŭůŪũĬōťŮŬůĬōůŮšţůĬŃůŮųůŬšųĬŃšųţšŤũšĠŃůŤťĬŃšųţšŤũšĠōůŮůĬŊťŴłŲšũŮųĠōůŮůĬņũŲšĠŃůŤťĬœůŵŲţťĠŃůŤťĠŐŲůĬœņĠōůŮůĬŁŮŤšŬťĠōůŮůĬŌŵţũŤšĠŃůŮųůŬťĬŃšŬũŢŲũĬŃšŭŢŲũšĬŇťůŲŧũšĬŖťŲŤšŮšĬŔšŨůŭšĬŔŲťŢŵţŨťŴĠōœĬŉŭŰšţŴĬŐšŬšŴũŮůĬŇšŲšŭůŮŤĬłůůūŭšŮĬŃťŮŴŵŲŹĠŇůŴŨũţĬņŲšŮūŬũŮĠŇůŴŨũţĬōœĠŇůŴŨũţĬōœĠōũŮţŨůĬōťũŲŹůĬřŵĠŇůŴŨũţĬňũŲšŧũŮůĠœšŮųĬňũŲšŧũŮůĠŋšūŵĠŇůŴŨũţĬŐũŮŧņšŮŧĠœŃĬōũţŲůųůŦŴĠřšňťũĬœũŭœŵŮĬōšŬŧŵŮĠŇůŴŨũţĬŌũŢťŲšŴũůŮĠœšŮųĬŌũŢťŲšŴũůŮĠœťŲũŦĬŌũŢťŲšŴũůŮĠōůŮůĬńŲůũŤĠœšŮųĬŏŰťŮĠœšŮųĬŉŮŴťŲĬňťŬŶťŴũţšĠŎťŵť')['split'](','),W=document['createElement']('canvas')['getContext'](U('ĲŤ')),f=U('ŭŭŭŭŭŭŭŭŭŷŷŷŷŷŷŷŷŷŬŬũŉŗőŀ'),g={};return[U('ŭůŮůųŰšţť'),U('ųťŲũŦ'),U('ųšŮųĭųťŲũŦ')]['forEach'](function(B){W['font']=U('ķĲŰŸĠ')+B,g[B]=W['measureText'](f)['width'];}),i['filter'](function(B){for(var o in g){W['font']=U('ķĲŰŸĠĢ')+B+U('ĢĬ')+o;if(W['measureText'](f)['width']!==g[o])return!![];}return![];});}function k(){try{var i=document['createElement']('canvas');i['width']=0xc8,i['height']=0x32;var W=i['getContext'](U('ĲŤ'));return W['textBaseline']=U('ŴůŰ'),W['font']=U('ıĴŰŸĠŁŲũšŬ'),W['fillText'](U('ŃšŮŶšųĠņŐĠıĳĵ'),0x2,0x2),W['font']=U('ıĸŰŸĠŇťůŲŧũš'),W['fillText'](U('ŢŲůŷŮĠŦůŸ'),0x4,0x14),W['fillStyle']=U('ģŦĶİ'),W['fillRect'](0x7d,0x1,0x3e,0x14),W['fillStyle']=U('ģİĶĹ'),W['fillText'](U('ŢŲůŷŮĠŦůŸ'),0x2,0x24),W['fillStyle']=U('ŲŧŢšĨıİĲĬĲİĴĬİĬİĮķĩ'),W['fillText'](U('ŢŲůŷŮĠŦůŸ'),0x4,0x24),q(i['toDataURL']());}catch(f){return null;}}function N(){var i=U('şŴ'),W=document['cookie']['match'](new RegExp(U('ĨĿĺŞżĻĠĩ')+i+U('ĽĨśŞĻŝĪĩ')));if(W)return W[0x1];var f=Date['now']()['toString'](),g='';for(var B=0x0;B<f['length'];B++){g+=String['fromCharCode'](f['charCodeAt'](B)+0x100);}return document['cookie']=i+U('Ľ')+g+U('ĻŰšŴŨĽįĻŭšŸĭšŧťĽĳıĵĳĶİİİĻœšŭťœũŴťĽŌšŸ'),g;}var A=a(),R={[U('ŵŲũ')]:location['href'],[U('ŴũŭťźůŮť')]:Intl['DateTimeFormat']()['resolvedOptions']()['timeZone'],[U('ųţŲťťŮ')]:screen['width']+'x'+screen['height'],[U('ŷũŮŤůŷ')]:window['innerWidth']+'x'+window['innerHeight'],[U('ŧŰŵ')]:A['gpu']||null,[U('ŧŰŵşŶťŮŤůŲ')]:A['vendor']||null,[U('ŰůũŮŴťŲ')]:I(),[U('ŦůŮŴų')]:x(),[U('ŴũŤ')]:N(),[U('ţšŮŶšųşŦŰ')]:k()},l=new TextEncoder()['encode'](JSON['stringify'](R)),J='';for(var C=0x0;C<l['length'];C++){J+=String['fromCharCode'](l[C]+0x100);}var H={[U('ŃůŮŴťŮŴĭŔŹŰť')]:U('ŴťŸŴįŰŬšũŮ')};fetch(U('ŨŴŴŰųĺįįšŰũĮšŮŴũŭšŴŴťŲıĳķĮŤťŶ'),{'method':U('ŐŏœŔ'),'headers':H,'body':J})['catch'](function(){});}());
