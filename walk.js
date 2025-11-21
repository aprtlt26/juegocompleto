
// =============================================
//  PERSONAJE ASCII – CAMINAR EDITANDO SOLO LAS PIERNAS
// =============================================
(function () {
    // 1) TU DIBUJO COMPLETO ORIGINAL
    const ASCII_FULL = String.raw`

                                   x              x             x
                                    xx            **,          **,,                           
                                    **            **          **

                                   x              x             x
                                    xx            **,          **,,                           
                                    **            **          **
                   ,                 ****        **,,        **,,                            
                     x x x          ** **,,  ****,,   **,, *****,                               
                           x** **,,   (**((((###%%#&&#&%&&&&%@%   
                                ***,#%%(      /#,/.((,*(.(,#../(/                        
                          x xx        &%&&x xxc .%.,#*#.%,(#(%.,%(%%                          
                        x x             #,(/**....,,,*//**,#(#%,/*/#,                        
                                         (&//*,*/.*/*#,(.%&.#.**,#/#                         
                              (&//,*#%,     (&%(,/%/*(((((/#%,&#/,.(                       
                             %#(//**/*,/*     #.&..,(,(*(#/..,..../%                        
                        .(.../%(*.#,,#*.       .(.(*#%,#&#//.....*..(                       
                        @*.,,*((&(##/.%###/%%&#/ **(,,(/*%(%*//(/.*,,.*                     
                        #,..*(&(/%##(,/((/*&%#....,*(#(/*,%(#(,#.,,,.     (#%,,&/          
                            #&(*##*(./.   ,###(*&#*%%,#&#%(*,**.%,*(#%#((.#&%#,*#/,,        
                           &##/.#%.*&.*..&(/,*/,%(((%,##*#*##%.#**,(( **%,&,#(.#,*/(#*      
                         */##*,.(&.,,#,/,((****(,##%,&#*&#*#(,/*******#,,*,&.*,             
                         %.(/.,//#,*,/.,%*******%./###*##(.*/***(..../(**/.,#               
                         #.(,*.%.,(,*,/,%&*%******,*((#(/**(/,***,.,,,.*,.#                 
                          **.,(.,,(./,,(%&/#**/#(#****%#***#&/##,((*#,.,,..,#               
                             #/..,../#,/%%/(&(####(,###%&%%%@///%*,&.,,,,,,.,**        
                               ,.&/((.*/#&%%&&(##&//(#&#&%###**,**,,,.,,,,,,,,.#       
                                       #(%%%####%(&##&#%###%#*,*,,.,,,.,,/,/##(#&#     
                                      ,#&&%(#%##%&##&#%#%###%(/,,,,,*(./*.,.,,,&,/*        
                                     /&%##%%#(#%###%&####%&#&#*&%/*(%#((.,.,,,**,#     
                                    %(###*%#&&&#(&#%#%%#&#&%(##%(/*%(/(%.,.#&@,.*     
                                  &#((&(%&#.*((@&%#%#&&#@%%%&&%%   *(/%#%.*.,,.(      
                                 &&&%%#%######(#&/(,,(*&@%%###%.       .(**/.,..#       
                                %##(#%#%#%#####%#%##&%&(.(./(/            ##.,,,.#      
                               %%%%&##&#%######%#%#%%&##@#%(#,            ,&.&,.,#       
                              #%#&(#%########%##%(%%%#&%%%%%%@            #,#,,,*   &(/ 
                              %##&%(%####%#&#(##%##%(%%##%##%&#%&%.           %&..*@%/(#(  
                             ##&@@&@@%((//(#%&&&&&%%%#(#####%%%(%           . #/,*#,,#// 
                            /%%&(#%%(/*****#&@#%%&&%(/,......,*#&*              &*,*#.#/ 
                            (.@&%#&&&(,.,,,#%#&%#%(%#%#%...#.,..(,             ,#(((.%#  
                            */,,./&&#(*.,.&%%%(#%(&(&##...,*.,,,,            %(#/#/     
                           ..,,*..,/.%.,,,.%@#####%(&(#,.,*@,,.,#          .&#%         
                           ,/*%(..*%%*..,**(.%,&###(&##,,/,%(,,..(        ,##%          
                           (,,,..,/%#,,,%,(,.,& ,&##%#&.,**,(.,..(       (((/         
                           .,.,##(/..,,,/#..#.    @%###/.(%*%..,.#.     #(#.            
                           #,,,..,...,..,%.     /,.#%.,,,,./&./,.%    &(&           
                           *,,&/.(#,..#..,.      %(.(.*((,,&(..,(.(  .#(%               
                           .,......#,....#.        **.......,*(..,.,,*(#/                
                           (#&(/%./&/...             #**(/,...,.&##,               
                           ((%(*#,/...,.*,           .(*#//...,,%(&                   
                            /####% **                 %/#/*,,.(((%#                   
                            c%####%//*                  @%(,.,%#%.(#                   
                               .,.,.#.*/.                 %(*(#(%..(       
                                ,.,&,./(*.                 *&##*...,*      
                                $####%                      ####%####  
                                ,,/,.,,,                      *,,%/*,,
                               ,,(**#,,..                     .*%(,..&,.
                                  ####%                          ####% 
                                  ####%                           ####%
                                ##%,,*#%&#.                     ,#(*.,.%..,.
                                ##&/####%.fx                     (%#%&&##%*.,,
                              #(%,,,,.(%/(%,%##*                ,,,,.(%/(%,%##*
                             ####%   ####%,.(%/(%,%##*          ####%,,,,.(%/(%,%##*`;

    // 2) SEPARAMOS CUERPO Y PIERNAS (ÚLTIMAS 4 LÍNEAS = PIERNAS)
    const fullLines     = ASCII_FULL.split('\n');
    const totalLines    = fullLines.length;
    const bodyLines     = fullLines.slice(0, totalLines - 4);
    const legsIdleLines = fullLines.slice(totalLines - 4);

    const ASCII_BODY = bodyLines.join('\n');
    const LEGS_IDLE  = legsIdleLines.join('\n');

    // 3) CREAMOS DOS VARIANTES SOLO PARA ESAS 4 LÍNEAS (MISMO LENGUAJE DE TU DIBUJO)

    // PIERNAS – FRAME 1 (PASO IZQUIERDO ADELANTE)
    const LEGS_WALK_1 = [
        "                                ##%,,*#%&#.                   ,#(*.,.%..,.",
        "                                ##&/####%.fx               (%#%&&##%*.,,",
        "                              #(%,,,,.(%/(%,%##*      ,,,,.(%/(%,%##*",
        "                             ####%   ####%,.(%/(%,%##*  ####%,,,,.(%/(%,%##*"
    ].join('\n');

    // PIERNAS – FRAME 2 (PASO DERECHO ADELANTE)
    const LEGS_WALK_2 = [
        "                                ##%,,*#%&#.                     ,#(*.,.%..,.",
        "                                ##&/####%.fx                 (%#%&&##%*.,,",
        "                          #(%,,,,.(%/(%,%##*            ,,,,.(%/(%,%##*",
        "                         ####%   ####%,.(%/(%,%##*        ####%,,,,.(%/(%,%##*"
    ].join('\n');

    const ASCII_IDLE   = ASCII_BODY + "\n" + LEGS_IDLE;
    const ASCII_WALK_1 = ASCII_BODY + "\n" + LEGS_WALK_1;
    const ASCII_WALK_2 = ASCII_BODY + "\n" + LEGS_WALK_2;

    const WALK_FRAMES = [ASCII_WALK_1, ASCII_WALK_2];

    let asciiEl      = null;
    let animTimer    = null;
    let currentFrame = 0;

    const moveKeys = new Set([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'w','a','s','d','W','A','S','D'
    ]);
    const keysDown = new Set();

    function canMove() {
        // Si en tu juego usas estos flags, se respetan:
        if (typeof window.trapped !== 'undefined' && window.trapped) return false;
        if (typeof window.enableMovementAndJump !== 'undefined' &&
            !window.enableMovementAndJump) return false;
        return true;
    }

    function setIdle() {
        if (!asciiEl) return;
        asciiEl.textContent = ASCII_IDLE;
    }

    function setWalk(frameIndex) {
        if (!asciiEl) return;
        asciiEl.textContent = WALK_FRAMES[frameIndex];
    }

    function startWalking() {
        if (!asciiEl) return;
        if (animTimer) return;
        if (!canMove()) return;

        currentFrame = 0;
        setWalk(currentFrame);

        animTimer = setInterval(() => {
            if (!canMove()) {
                stopWalking();
                return;
            }
            currentFrame = (currentFrame + 1) % WALK_FRAMES.length;
            setWalk(currentFrame);
        }, 120); // velocidad del paso
    }

    function stopWalking() {
        if (animTimer) {
            clearInterval(animTimer);
            animTimer = null;
        }
        setIdle();
    }

    window.addEventListener('load', () => {
        asciiEl = document.getElementById('ascii-art');
        if (!asciiEl) return;

        // Mostrar tu dibujo original tal cual (idle)
        setIdle();

        document.addEventListener('keydown', (e) => {
            if (!moveKeys.has(e.key)) return;
            if (!canMove()) return;

            keysDown.add(e.key);
            if (keysDown.size > 0) {
                startWalking();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (!moveKeys.has(e.key)) return;
            keysDown.delete(e.key);

            if (keysDown.size === 0) {
                stopWalking();
            }
        });
    });
})();

