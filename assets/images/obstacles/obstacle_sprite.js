// Obstacle sprite data using canvas drawing commands
const obstacleSprites = {
    // Standard obstacle (rock/debris)
    standard: function(ctx, x, y, width, height) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/2, height/8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Base rock shape with gradient
        const rockGradient = ctx.createLinearGradient(x, y, x + width, y + height);
        rockGradient.addColorStop(0, '#e74c3c');
        rockGradient.addColorStop(1, '#c0392b');
        
        ctx.fillStyle = rockGradient;
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y + height * 0.4);
        ctx.lineTo(x + width * 0.3, y + height * 0.2);
        ctx.lineTo(x + width * 0.7, y + height * 0.3);
        ctx.lineTo(x + width, y + height * 0.5);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Add rock texture with lines
        ctx.strokeStyle = 'rgba(192, 57, 43, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x + width * (0.2 + 0.2 * Math.random()), y + height * 0.3);
            ctx.lineTo(x + width * (0.4 + 0.2 * Math.random()), y + height * 0.8);
            ctx.stroke();
        }
        
        // Rock details
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.5);
        ctx.lineTo(x + width * 0.4, y + height * 0.4);
        ctx.lineTo(x + width * 0.5, y + height * 0.6);
        ctx.lineTo(x + width * 0.3, y + height * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // Highlights and reflections
        ctx.fillStyle = 'rgba(236, 240, 241, 0.3)';
        ctx.beginPath();
        ctx.arc(x + width * 0.7, y + height * 0.4, width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.05, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Low obstacle (log/barrier)
    low: function(ctx, x, y, width, height) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/2, height/6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wood grain texture background
        const woodGradient = ctx.createLinearGradient(x, y, x, y + height);
        woodGradient.addColorStop(0, '#e67e22');
        woodGradient.addColorStop(0.5, '#d35400');
        woodGradient.addColorStop(1, '#a04000');
        
        ctx.fillStyle = woodGradient;
        ctx.fillRect(x, y, width, height);
        
        // Wood grain details
        ctx.strokeStyle = 'rgba(165, 105, 0, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + height * (i/6));
            ctx.bezierCurveTo(
                x + width * 0.3, y + height * (i/6) + (Math.random() * 5 - 2.5),
                x + width * 0.7, y + height * (i/6) + (Math.random() * 5 - 2.5),
                x + width, y + height * (i/6)
            );
            ctx.stroke();
        }
        
        // Vertical wood grain
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = 'rgba(165, 105, 0, 0.7)';
            ctx.fillRect(x + width * (0.2 + 0.2 * i), y, width * 0.1, height);
        }
        
        // Wood knots
        ctx.fillStyle = '#a04000';
        ctx.beginPath();
        ctx.arc(x + width * 0.3, y + height * 0.4, width * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + width * 0.7, y + height * 0.7, width * 0.07, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight on top edge
        ctx.fillStyle = 'rgba(243, 156, 18, 0.7)';
        ctx.fillRect(x, y, width, height * 0.15);
    },
    
    // Tall obstacle (pillar/column)
    tall: function(ctx, x, y, width, height) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/2, height/10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Base column shape with gradient
        const columnGradient = ctx.createLinearGradient(x, y, x + width, y);
        columnGradient.addColorStop(0, '#9b59b6');
        columnGradient.addColorStop(0.5, '#8e44ad');
        columnGradient.addColorStop(1, '#703688');
        
        ctx.fillStyle = columnGradient;
        ctx.fillRect(x, y, width, height);
        
        // Column cap at top
        ctx.fillStyle = '#a569bd';
        ctx.beginPath();
        ctx.moveTo(x - width * 0.1, y);
        ctx.lineTo(x + width * 1.1, y);
        ctx.lineTo(x + width, y + height * 0.05);
        ctx.lineTo(x, y + height * 0.05);
        ctx.closePath();
        ctx.fill();
        
        // Column base at bottom
        ctx.fillStyle = '#a569bd';
        ctx.beginPath();
        ctx.moveTo(x - width * 0.1, y + height);
        ctx.lineTo(x + width * 1.1, y + height);
        ctx.lineTo(x + width, y + height - height * 0.05);
        ctx.lineTo(x, y + height - height * 0.05);
        ctx.closePath();
        ctx.fill();
        
        // Column details - horizontal ridges
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(x, y + height * 0.2, width, height * 0.05);
        ctx.fillRect(x, y + height * 0.5, width, height * 0.05);
        ctx.fillRect(x, y + height * 0.8, width, height * 0.05);
        
        // Side highlight/reflection
        const sideGradient = ctx.createLinearGradient(x + width * 0.8, y, x + width, y);
        sideGradient.addColorStop(0, 'rgba(165, 105, 189, 0.5)');
        sideGradient.addColorStop(1, 'rgba(165, 105, 189, 0.8)');
        
        ctx.fillStyle = sideGradient;
        ctx.fillRect(x + width * 0.8, y, width * 0.2, height);
        
        // Add some ancient symbols/glyphs
        ctx.fillStyle = 'rgba(236, 240, 241, 0.3)';
        
        // Symbol 1
        ctx.beginPath();
        ctx.arc(x + width * 0.5, y + height * 0.35, width * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Symbol 2
        ctx.fillRect(x + width * 0.3, y + height * 0.65, width * 0.4, width * 0.1);
    },
    
    // Moving obstacle (alien/enemy)
    moving: function(ctx, x, y, width, height) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/2, height/10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body with gradient
        const bodyGradient = ctx.createRadialGradient(
            x + width/2, y + height/2, width/10,
            x + width/2, y + height/2, width/1.5
        );
        bodyGradient.addColorStop(0, '#1abc9c');
        bodyGradient.addColorStop(0.7, '#16a085');
        bodyGradient.addColorStop(1, '#0e6251');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer glow effect
        ctx.strokeStyle = 'rgba(26, 188, 156, 0.3)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2 + 3, height/2 + 3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Eye sockets
        ctx.fillStyle = '#0e6251';
        ctx.beginPath();
        ctx.ellipse(x + width * 0.3, y + height * 0.3, width * 0.18, height * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + width * 0.7, y + height * 0.3, width * 0.18, height * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes with gradient
        const eyeGradient = ctx.createRadialGradient(
            x + width * 0.3, y + height * 0.3, 0,
            x + width * 0.3, y + height * 0.3, width * 0.15
        );
        eyeGradient.addColorStop(0, '#ffffff');
        eyeGradient.addColorStop(0.8, '#ecf0f1');
        eyeGradient.addColorStop(1, '#bdc3c7');
        
        ctx.fillStyle = eyeGradient;
        ctx.beginPath();
        ctx.ellipse(x + width * 0.3, y + height * 0.3, width * 0.15, height * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        const eyeGradient2 = ctx.createRadialGradient(
            x + width * 0.7, y + height * 0.3, 0,
            x + width * 0.7, y + height * 0.3, width * 0.15
        );
        eyeGradient2.addColorStop(0, '#ffffff');
        eyeGradient2.addColorStop(0.8, '#ecf0f1');
        eyeGradient2.addColorStop(1, '#bdc3c7');
        
        ctx.fillStyle = eyeGradient2;
        ctx.beginPath();
        ctx.ellipse(x + width * 0.7, y + height * 0.3, width * 0.15, height * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils with reflection
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(x + width * 0.3, y + height * 0.3, width * 0.06, height * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + width * 0.7, y + height * 0.3, width * 0.06, height * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye reflection
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x + width * 0.32, y + height * 0.28, width * 0.02, height * 0.02, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + width * 0.72, y + height * 0.28, width * 0.02, height * 0.02, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = '#0e6251';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width * 0.3, y + height * 0.6);
        ctx.quadraticCurveTo(x + width * 0.5, y + height * 0.7, x + width * 0.7, y + height * 0.6);
        ctx.stroke();
        
        // Tentacles with gradient
        const tentacleGradient = ctx.createLinearGradient(x, y + height * 0.8, x, y + height);
        tentacleGradient.addColorStop(0, '#16a085');
        tentacleGradient.addColorStop(1, '#0e6251');
        
        ctx.strokeStyle = tentacleGradient;
        ctx.lineWidth = 4;
        
        // Tentacle 1
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.8);
        ctx.quadraticCurveTo(x - width * 0.2, y + height, x, y + height);
        ctx.stroke();
        
        // Tentacle 2
        ctx.beginPath();
        ctx.moveTo(x + width * 0.8, y + height * 0.8);
        ctx.quadraticCurveTo(x + width * 1.2, y + height, x + width, y + height);
        ctx.stroke();
        
        // Tentacle 3
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, y + height * 0.8);
        ctx.quadraticCurveTo(x + width * 0.5, y + height * 1.1, x + width * 0.5, y + height);
        ctx.stroke();
    },
    
    // Floating obstacle (space debris)
    floating: function(ctx, x, y, width, height) {
        // Shadow (subtle since it's floating)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 10, width/2, height/15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Metal sheen gradient
        const metalGradient = ctx.createLinearGradient(x, y, x + width, y + height);
        metalGradient.addColorStop(0, '#95a5a6');
        metalGradient.addColorStop(0.5, '#7f8c8d');
        metalGradient.addColorStop(1, '#34495e');
        
        // Main body
        ctx.fillStyle = metalGradient;
        ctx.beginPath();
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width/3, y);
        ctx.lineTo(x + width*2/3, y);
        ctx.lineTo(x + width, y + height/2);
        ctx.lineTo(x + width*2/3, y + height);
        ctx.lineTo(x + width/3, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Add edge highlight
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Central port/window with glow
        const portGradient = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, width/4
        );
        portGradient.addColorStop(0, '#3498db');
        portGradient.addColorStop(0.7, '#2980b9');
        portGradient.addColorStop(1, '#1a5276');
        
        ctx.fillStyle = portGradient;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Port/window rim
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/4, 0, Math.PI * 2);
        ctx.stroke();
        
        // Metal rivets with highlights
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const dotX = x + width/2 + Math.cos(angle) * (width/3);
            const dotY = y + height/2 + Math.sin(angle) * (width/3);
            
            // Rivet base
            ctx.fillStyle = '#34495e';
            ctx.beginPath();
            ctx.arc(dotX, dotY, width/12, 0, Math.PI * 2);
            ctx.fill();
            
            // Rivet highlight
            ctx.fillStyle = '#95a5a6';
            ctx.beginPath();
            ctx.arc(dotX, dotY, width/20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add subtle glow around the object
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width/3, y);
        ctx.lineTo(x + width*2/3, y);
        ctx.lineTo(x + width, y + height/2);
        ctx.lineTo(x + width*2/3, y + height);
        ctx.lineTo(x + width/3, y + height);
        ctx.closePath();
        ctx.stroke();
    },
    
    // Laser gate obstacle
    laser: function(ctx, x, y, width, height) {
        // Shadow (for base units)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/10, y + height + 5, width/10, height/15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + width*9/10, y + height + 5, width/10, height/15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Laser source unit with gradient
        const unitGradient = ctx.createLinearGradient(x, y, x + width/5, y);
        unitGradient.addColorStop(0, '#2c3e50');
        unitGradient.addColorStop(1, '#34495e');
        
        ctx.fillStyle = unitGradient;
        ctx.fillRect(x, y, width/5, height);
        
        // Metal details on source
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(x, y + height/4, width/5, height/10);
        ctx.fillRect(x, y + height*3/5, width/5, height/10);
        
        // Laser beam with animated gradient and glow
        const beamGradient = ctx.createLinearGradient(x, 0, x + width, 0);
        beamGradient.addColorStop(0, 'rgba(231, 76, 60, 0.9)');
        beamGradient.addColorStop(0.5, 'rgba(231, 76, 60, 0.4)');
        beamGradient.addColorStop(1, 'rgba(231, 76, 60, 0.9)');
        
        ctx.fillStyle = beamGradient;
        ctx.fillRect(x + width/5, y + height/3, width*3/5, height/3);
        
        // Beam glow effect
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fillRect(x + width/5, y + height/3 - 2, width*3/5, height/3 + 4);
        ctx.shadowBlur = 0;
        
        // Laser target unit
        const targetGradient = ctx.createLinearGradient(x + width*4/5, y, x + width, y);
        targetGradient.addColorStop(0, '#34495e');
        targetGradient.addColorStop(1, '#2c3e50');
        
        ctx.fillStyle = targetGradient;
        ctx.fillRect(x + width*4/5, y, width/5, height);
        
        // Metal details on target
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(x + width*4/5, y + height/4, width/5, height/10);
        ctx.fillRect(x + width*4/5, y + height*3/5, width/5, height/10);
        
        // Warning lights with glow
        const warningLight = Math.random() > 0.5 ? '#e74c3c' : '#f1c40f';
        
        // Left top light
        ctx.shadowColor = warningLight;
        ctx.shadowBlur = 10;
        ctx.fillStyle = warningLight;
        ctx.beginPath();
        ctx.arc(x + width/10, y + height/5, width/15, 0, Math.PI * 2);
        ctx.fill();
        
        // Left bottom light
        ctx.beginPath();
        ctx.arc(x + width/10, y + height*4/5, width/15, 0, Math.PI * 2);
        ctx.fill();
        
        // Right top light
        ctx.beginPath();
        ctx.arc(x + width*9/10, y + height/5, width/15, 0, Math.PI * 2);
        ctx.fill();
        
        // Right bottom light
        ctx.beginPath();
        ctx.arc(x + width*9/10, y + height*4/5, width/15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Light reflections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x + width/10 - width/50, y + height/5 - height/50, width/50, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + width*9/10 - width/50, y + height/5 - height/50, width/50, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Spike obstacle
    spikes: function(ctx, x, y, width, height) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/2, height/10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Base with gradient
        const baseGradient = ctx.createLinearGradient(x, y + height*3/4, x, y + height);
        baseGradient.addColorStop(0, '#9b59b6');
        baseGradient.addColorStop(1, '#8e44ad');
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(x, y + height*3/4, width, height/4);
        
        // Add metal texture to base
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + height*(3/4 + i/16));
            ctx.lineTo(x + width, y + height*(3/4 + i/16));
            ctx.stroke();
        }
        
        // Spikes with gradient
        const spikeGradient = ctx.createLinearGradient(x, y, x, y + height*3/4);
        spikeGradient.addColorStop(0, '#bdc3c7');
        spikeGradient.addColorStop(1, '#9b59b6');
        
        ctx.fillStyle = spikeGradient;
        const spikeCount = 5;
        const spikeWidth = width / spikeCount;
        
        for (let i = 0; i < spikeCount; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * spikeWidth, y + height*3/4);
            ctx.lineTo(x + (i + 0.5) * spikeWidth, y);
            ctx.lineTo(x + (i + 1) * spikeWidth, y + height*3/4);
            ctx.closePath();
            ctx.fill();
        }
        
        // Add metallic shine to spikes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < spikeCount; i++) {
            ctx.beginPath();
            ctx.moveTo(x + (i + 0.2) * spikeWidth, y + height*0.65);
            ctx.lineTo(x + (i + 0.5) * spikeWidth, y + height*0.1);
            ctx.stroke();
        }
        
        // Highlights on the spikes
        ctx.fillStyle = 'rgba(236, 240, 241, 0.5)';
        for (let i = 0; i < spikeCount; i += 2) {
            ctx.beginPath();
            ctx.moveTo(x + i * spikeWidth + spikeWidth/4, y + height*3/4 - height/8);
            ctx.lineTo(x + (i + 0.5) * spikeWidth, y + height/4);
            ctx.lineTo(x + (i + 1) * spikeWidth - spikeWidth/4, y + height*3/4 - height/8);
            ctx.closePath();
            ctx.fill();
        }
        
        // Spike tips with extra sharpness
        ctx.fillStyle = '#ecf0f1';
        for (let i = 0; i < spikeCount; i++) {
            ctx.beginPath();
            ctx.arc(x + (i + 0.5) * spikeWidth, y + 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // Ceiling obstacle (hanging stalactite that players must crouch under)
    ceiling: function(ctx, x, y, width, height) {
        // This is a ceiling obstacle that hangs down from above
        // The y parameter represents the bottom of the stalactite
        
        // Calculate dimensions
        const stalactiteHeight = height;
        const topY = 0; // Start from top of screen
        
        // Shadow beneath stalactite
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + 5, width/2, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Main stalactite body with gradient
        const rockGradient = ctx.createLinearGradient(x, topY, x, y);
        rockGradient.addColorStop(0, '#7f8c8d'); // Light gray at top
        rockGradient.addColorStop(0.3, '#95a5a6');
        rockGradient.addColorStop(0.7, '#7f8c8d');
        rockGradient.addColorStop(1, '#2c3e50'); // Darker at tip
        
        ctx.fillStyle = rockGradient;
        
        // Draw stalactite shape (wider at top, narrower at bottom)
        ctx.beginPath();
        ctx.moveTo(x - 10, topY); // Extended past left edge at top
        ctx.lineTo(x + width + 10, topY); // Extended past right edge at top
        ctx.lineTo(x + width - 10, y); // Narrower at bottom
        ctx.lineTo(x + 10, y); // Narrower at bottom
        ctx.closePath();
        ctx.fill();
        
        // Add texture lines to give depth
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 1; i < 5; i++) {
            // Horizontal ridges
            ctx.beginPath();
            ctx.moveTo(x - 10 + (i * 5), topY + stalactiteHeight * 0.2);
            ctx.lineTo(x + width + 10 - (i * 5), topY + stalactiteHeight * 0.2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x - 5 + (i * 5), topY + stalactiteHeight * 0.4);
            ctx.lineTo(x + width + 5 - (i * 5), topY + stalactiteHeight * 0.4);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + (i * 5), topY + stalactiteHeight * 0.6);
            ctx.lineTo(x + width - (i * 5), topY + stalactiteHeight * 0.6);
            ctx.stroke();
        }
        
        // Add some vertical cracks
        for (let i = 0; i < 3; i++) {
            const startX = x + width * (0.3 + i * 0.2);
            ctx.beginPath();
            ctx.moveTo(startX, topY + 10);
            ctx.bezierCurveTo(
                startX - 5, topY + stalactiteHeight * 0.3,
                startX + 5, topY + stalactiteHeight * 0.6,
                startX - 3, y - 5
            );
            ctx.stroke();
        }
        
        // Add warning indicator at the bottom
        const stripeWidth = 10;
        ctx.fillStyle = '#e74c3c'; // Red warning color
        
        for (let i = 0; i < width / (stripeWidth * 2); i++) {
            ctx.fillRect(
                x + 10 + (i * stripeWidth * 2), 
                y - 8, 
                stripeWidth, 
                8
            );
        }
        
        // Alternate warning stripes
        ctx.fillStyle = '#f1c40f'; // Yellow warning color
        for (let i = 0; i < width / (stripeWidth * 2); i++) {
            ctx.fillRect(
                x + 10 + stripeWidth + (i * stripeWidth * 2), 
                y - 8, 
                stripeWidth, 
                8
            );
        }
        
        // Add highlights on edges
        ctx.fillStyle = 'rgba(236, 240, 241, 0.2)';
        ctx.beginPath();
        ctx.moveTo(x - 5, topY + 10);
        ctx.lineTo(x + 15, topY + 10);
        ctx.lineTo(x + 5, topY + stalactiteHeight * 0.3);
        ctx.closePath();
        ctx.fill();
    },
    
    // Gate obstacle (requires crouching to pass through)
    gate: function(ctx, x, y, width, height) {
        // This is a gate with a low opening that the player must crouch under
        
        // Gate posts
        const postWidth = 20;
        const gateHeight = 110; // Increased from 70 to 110 to match game.js
        const openingHeight = 40; // Height of the opening - lower than player height
        const baseY = y + height - gateHeight; // Bottom of the gate aligns with ground
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height, width/2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Left post gradient
        const postGradient = ctx.createLinearGradient(x, baseY, x + postWidth, baseY);
        postGradient.addColorStop(0, '#7f8c8d');
        postGradient.addColorStop(0.4, '#95a5a6');
        postGradient.addColorStop(1, '#7f8c8d');
        
        // Draw left post
        ctx.fillStyle = postGradient;
        ctx.fillRect(x, baseY, postWidth, gateHeight);
        
        // Draw right post
        ctx.fillRect(x + width - postWidth, baseY, postWidth, gateHeight);
        
        // Draw top beam with gradient
        const beamGradient = ctx.createLinearGradient(x, baseY, x, baseY + openingHeight);
        beamGradient.addColorStop(0, '#e74c3c'); // Red at top
        beamGradient.addColorStop(0.5, '#c0392b'); // Darker red in middle
        beamGradient.addColorStop(1, '#e74c3c'); // Red at bottom
        
        ctx.fillStyle = beamGradient;
        ctx.fillRect(x, baseY, width, openingHeight);
        
        // Draw cross beam at top of gate
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(x, baseY + openingHeight + 20, width, 10);
        
        // Draw additional cross beam higher up
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(x, baseY + openingHeight + 60, width, 10);
        
        // Draw warning stripes on the beam
        const stripeWidth = 15;
        ctx.fillStyle = '#f1c40f'; // Yellow warning stripes
        
        for (let i = 0; i < width / (stripeWidth * 2); i++) {
            ctx.fillRect(
                x + (i * stripeWidth * 2), 
                baseY, 
                stripeWidth, 
                openingHeight
            );
        }
        
        // Draw metallic details and rivets
        ctx.fillStyle = '#bdc3c7'; // Light silver color
        
        // Top beam rivets
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(x + 10 + i * (width - 20) / 3, baseY + openingHeight / 2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Post rivets - increased to 4 for taller gate
        for (let i = 0; i < 4; i++) {
            // Left post
            ctx.beginPath();
            ctx.arc(x + postWidth / 2, baseY + openingHeight + 15 + i * 20, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Right post
            ctx.beginPath();
            ctx.arc(x + width - postWidth / 2, baseY + openingHeight + 15 + i * 20, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add some wear and tear details
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        
        // Left post scratch
        ctx.beginPath();
        ctx.moveTo(x + 5, baseY + openingHeight + 10);
        ctx.lineTo(x + 15, baseY + openingHeight + 25);
        ctx.stroke();
        
        // Right post scratch
        ctx.beginPath();
        ctx.moveTo(x + width - 5, baseY + openingHeight + 20);
        ctx.lineTo(x + width - 15, baseY + openingHeight + 35);
        ctx.stroke();
        
        // Add a small blinking light
        if (Math.random() > 0.5) {
            ctx.fillStyle = '#e74c3c'; // Red warning light
        } else {
            ctx.fillStyle = '#f39c12'; // Yellow warning light
        }
        
        ctx.beginPath();
        ctx.arc(x + width / 2, baseY + openingHeight / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Light glow
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.beginPath();
        ctx.arc(x + width / 2, baseY + openingHeight / 2, 7, 0, Math.PI * 2);
        ctx.fill();
    }
};
