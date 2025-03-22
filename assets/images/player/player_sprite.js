// Player sprite data using canvas drawing commands
const playerSprites = {
    // Running animation frames
    run: [
        function(ctx, x, y, width, height) {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height + 5, width/2, height/10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Body with gradient
            const bodyGradient = ctx.createLinearGradient(x, y, x + width, y);
            bodyGradient.addColorStop(0, '#3498db');
            bodyGradient.addColorStop(1, '#2980b9');
            ctx.fillStyle = bodyGradient;
            
            // Torso
            ctx.beginPath();
            ctx.roundRect(x + width*0.1, y, width*0.8, height*0.7, 5);
            ctx.fill();
            
            // Helmet base
            ctx.beginPath();
            ctx.arc(x + width*0.5, y + height*0.2, width*0.3, Math.PI, 0, false);
            ctx.fill();
            
            // Helmet visor with reflection
            const visorGradient = ctx.createLinearGradient(
                x + width*0.6, y + height*0.1, 
                x + width*0.8, y + height*0.3
            );
            visorGradient.addColorStop(0, '#34495e');
            visorGradient.addColorStop(0.7, '#2c3e50');
            visorGradient.addColorStop(1, '#1c2833');
            
            ctx.fillStyle = visorGradient;
            ctx.beginPath();
            ctx.roundRect(x + width*0.3, y + height*0.15, width*0.4, height*0.2, [0, 0, 10, 10]);
            ctx.fill();
            
            // Visor reflection
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(x + width*0.4, y + height*0.17);
            ctx.lineTo(x + width*0.55, y + height*0.17);
            ctx.lineTo(x + width*0.5, y + height*0.25);
            ctx.closePath();
            ctx.fill();
            
            // Backpack with gradient
            const backpackGradient = ctx.createLinearGradient(
                x - width*0.1, y + height*0.3, 
                x + width*0.1, y + height*0.3
            );
            backpackGradient.addColorStop(0, '#2c3e50');
            backpackGradient.addColorStop(1, '#2980b9');
            
            ctx.fillStyle = backpackGradient;
            ctx.beginPath();
            ctx.roundRect(x - width*0.1, y + height*0.3, width*0.2, height*0.4, 3);
            ctx.fill();
            
            // Backpack details
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x - width*0.05, y + height*0.35, width*0.1, height*0.05);
            ctx.fillRect(x - width*0.05, y + height*0.5, width*0.1, height*0.05);
            
            // Leg forward
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath();
            ctx.roundRect(x + width*0.3, y + height*0.7, width*0.2, height*0.3, 3);
            ctx.fill();
            
            // Boot highlight
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x + width*0.3, y + height*0.9, width*0.2, height*0.1);
            
            // Leg back
            ctx.fillStyle = '#1a5276';
            ctx.beginPath();
            ctx.roundRect(x + width*0.5, y + height*0.8, width*0.2, height*0.2, 3);
            ctx.fill();
            
            // Arm
            ctx.fillStyle = '#2980b9';
            ctx.beginPath();
            ctx.roundRect(x + width*0.1, y + height*0.3, width*0.15, height*0.4, 3);
            ctx.fill();
            
            // Spacesuit details/seams
            ctx.strokeStyle = '#1a5276';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + width*0.1, y + height*0.4);
            ctx.lineTo(x + width*0.9, y + height*0.4);
            ctx.stroke();
            
            // Oxygen tank valve
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(x, y + height*0.4, width*0.04, 0, Math.PI * 2);
            ctx.fill();
            
            // Spacesuit shoulder patch
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(x + width*0.75, y + height*0.2, width*0.06, 0, Math.PI * 2);
            ctx.fill();
        },
        function(ctx, x, y, width, height) {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height + 5, width/2, height/10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Body with gradient
            const bodyGradient = ctx.createLinearGradient(x, y, x + width, y);
            bodyGradient.addColorStop(0, '#3498db');
            bodyGradient.addColorStop(1, '#2980b9');
            ctx.fillStyle = bodyGradient;
            
            // Torso
            ctx.beginPath();
            ctx.roundRect(x + width*0.1, y, width*0.8, height*0.7, 5);
            ctx.fill();
            
            // Helmet base
            ctx.beginPath();
            ctx.arc(x + width*0.5, y + height*0.2, width*0.3, Math.PI, 0, false);
            ctx.fill();
            
            // Helmet visor with reflection
            const visorGradient = ctx.createLinearGradient(
                x + width*0.6, y + height*0.1, 
                x + width*0.8, y + height*0.3
            );
            visorGradient.addColorStop(0, '#34495e');
            visorGradient.addColorStop(0.7, '#2c3e50');
            visorGradient.addColorStop(1, '#1c2833');
            
            ctx.fillStyle = visorGradient;
            ctx.beginPath();
            ctx.roundRect(x + width*0.3, y + height*0.15, width*0.4, height*0.2, [0, 0, 10, 10]);
            ctx.fill();
            
            // Visor reflection
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(x + width*0.4, y + height*0.17);
            ctx.lineTo(x + width*0.55, y + height*0.17);
            ctx.lineTo(x + width*0.5, y + height*0.25);
            ctx.closePath();
            ctx.fill();
            
            // Backpack with gradient
            const backpackGradient = ctx.createLinearGradient(
                x - width*0.1, y + height*0.3, 
                x + width*0.1, y + height*0.3
            );
            backpackGradient.addColorStop(0, '#2c3e50');
            backpackGradient.addColorStop(1, '#2980b9');
            
            ctx.fillStyle = backpackGradient;
            ctx.beginPath();
            ctx.roundRect(x - width*0.1, y + height*0.3, width*0.2, height*0.4, 3);
            ctx.fill();
            
            // Backpack details
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x - width*0.05, y + height*0.35, width*0.1, height*0.05);
            ctx.fillRect(x - width*0.05, y + height*0.5, width*0.1, height*0.05);
            
            // Leg forward (different position for this frame)
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath();
            ctx.roundRect(x + width*0.5, y + height*0.7, width*0.2, height*0.3, 3);
            ctx.fill();
            
            // Boot highlight
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x + width*0.5, y + height*0.9, width*0.2, height*0.1);
            
            // Leg back (different position for this frame)
            ctx.fillStyle = '#1a5276';
            ctx.beginPath();
            ctx.roundRect(x + width*0.3, y + height*0.8, width*0.2, height*0.2, 3);
            ctx.fill();
            
            // Arm
            ctx.fillStyle = '#2980b9';
            ctx.beginPath();
            ctx.roundRect(x + width*0.1, y + height*0.4, width*0.15, height*0.3, 3);
            ctx.fill();
            
            // Spacesuit details/seams
            ctx.strokeStyle = '#1a5276';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + width*0.1, y + height*0.4);
            ctx.lineTo(x + width*0.9, y + height*0.4);
            ctx.stroke();
            
            // Oxygen tank valve
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(x, y + height*0.4, width*0.04, 0, Math.PI * 2);
            ctx.fill();
            
            // Spacesuit shoulder patch
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(x + width*0.75, y + height*0.2, width*0.06, 0, Math.PI * 2);
            ctx.fill();
        }
    ],
    
    // Jumping animation
    jump: function(ctx, x, y, width, height) {
        // Shadow (smaller since player is in the air)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 10, width/3, height/15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body with gradient
        const bodyGradient = ctx.createLinearGradient(x, y, x + width, y);
        bodyGradient.addColorStop(0, '#3498db');
        bodyGradient.addColorStop(1, '#2980b9');
        ctx.fillStyle = bodyGradient;
        
        // Torso
        ctx.beginPath();
        ctx.roundRect(x + width*0.1, y, width*0.8, height*0.6, 5);
        ctx.fill();
        
        // Helmet base
        ctx.beginPath();
        ctx.arc(x + width*0.5, y + height*0.2, width*0.3, Math.PI, 0, false);
        ctx.fill();
        
        // Helmet visor with reflection
        const visorGradient = ctx.createLinearGradient(
            x + width*0.6, y + height*0.1, 
            x + width*0.8, y + height*0.3
        );
        visorGradient.addColorStop(0, '#34495e');
        visorGradient.addColorStop(0.7, '#2c3e50');
        visorGradient.addColorStop(1, '#1c2833');
        
        ctx.fillStyle = visorGradient;
        ctx.beginPath();
        ctx.roundRect(x + width*0.3, y + height*0.15, width*0.4, height*0.2, [0, 0, 10, 10]);
        ctx.fill();
        
        // Visor reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(x + width*0.4, y + height*0.17);
        ctx.lineTo(x + width*0.55, y + height*0.17);
        ctx.lineTo(x + width*0.5, y + height*0.25);
        ctx.closePath();
        ctx.fill();
        
        // Backpack with gradient - slightly tilted for jumping
        const backpackGradient = ctx.createLinearGradient(
            x - width*0.15, y + height*0.3, 
            x + width*0.05, y + height*0.3
        );
        backpackGradient.addColorStop(0, '#2c3e50');
        backpackGradient.addColorStop(1, '#2980b9');
        
        ctx.fillStyle = backpackGradient;
        ctx.beginPath();
        ctx.roundRect(x - width*0.15, y + height*0.3, width*0.25, height*0.4, 3);
        ctx.fill();
        
        // Backpack details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(x - width*0.1, y + height*0.35, width*0.15, height*0.05);
        ctx.fillRect(x - width*0.1, y + height*0.5, width*0.15, height*0.05);
        
        // Legs spread for jump
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.roundRect(x + width*0.2, y + height*0.6, width*0.15, height*0.4, 3);
        ctx.fill();
        
        ctx.beginPath();
        ctx.roundRect(x + width*0.65, y + height*0.6, width*0.15, height*0.4, 3);
        ctx.fill();
        
        // Boot highlights
        ctx.fillStyle = '#34495e';
        ctx.fillRect(x + width*0.2, y + height*0.9, width*0.15, height*0.1);
        ctx.fillRect(x + width*0.65, y + height*0.9, width*0.15, height*0.1);
        
        // Arms up
        ctx.fillStyle = '#2980b9';
        ctx.beginPath();
        ctx.roundRect(x + width*0.05, y + height*0.2, width*0.15, height*0.3, 3);
        ctx.fill();
        
        ctx.beginPath();
        ctx.roundRect(x + width*0.8, y + height*0.2, width*0.15, height*0.3, 3);
        ctx.fill();
        
        // Spacesuit details/seams
        ctx.strokeStyle = '#1a5276';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + width*0.1, y + height*0.4);
        ctx.lineTo(x + width*0.9, y + height*0.4);
        ctx.stroke();
        
        // Oxygen tank valve
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x - width*0.05, y + height*0.4, width*0.04, 0, Math.PI * 2);
        ctx.fill();
        
        // Spacesuit shoulder patch
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(x + width*0.75, y + height*0.2, width*0.06, 0, Math.PI * 2);
        ctx.fill();
        
        // Motion lines for jump
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + width * (0.3 + i * 0.2), y + height * 1.1);
            ctx.lineTo(x + width * (0.2 + i * 0.2), y + height * 1.3);
            ctx.stroke();
        }
    },
    
    // Sliding animation
    slide: function(ctx, x, y, width, height, slideHeight) {
        // Body (lower when sliding)
        ctx.fillStyle = '#3498db';
        ctx.fillRect(x, y, width, slideHeight);
        
        // Helmet visor
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + width*0.6, y + slideHeight*0.2, width*0.3, slideHeight*0.2);
        
        // Backpack
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(x - width*0.1, y + slideHeight*0.3, width*0.2, slideHeight*0.4);
        
        // Extended leg
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + width*0.3, y + slideHeight*0.7, width*0.6, slideHeight*0.3);
    },
    
    // Shield effect
    shield: function(ctx, x, y, width, height) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/1.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add glow effect
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/1.5 + 3, 0, Math.PI * 2);
        ctx.stroke();
    },
    
    // Jetpack effect
    jetpack: function(ctx, x, y, width, height) {
        // Jetpack flames
        const flameHeight = 20 + Math.random() * 10; // Random flame height for animation
        
        // Main flame
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x - 15, y + height + flameHeight);
        ctx.lineTo(x, y + height - 10);
        ctx.fill();
        
        // Inner flame
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x - 10, y + height + flameHeight * 0.7);
        ctx.lineTo(x, y + height - 5);
        ctx.fill();
        
        // Core flame
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x - 5, y + height + flameHeight * 0.4);
        ctx.lineTo(x, y + height - 2);
        ctx.fill();
    },
    
    // Crouching animation
    crouch: function(ctx, x, y, width, height, crouchHeight) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + crouchHeight + 5, width/2, crouchHeight/8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body with gradient - squashed for crouching
        const bodyGradient = ctx.createLinearGradient(x, y, x + width, y);
        bodyGradient.addColorStop(0, '#3498db');
        bodyGradient.addColorStop(1, '#2980b9');
        ctx.fillStyle = bodyGradient;
        
        // Torso - squashed
        ctx.beginPath();
        ctx.roundRect(x + width*0.1, y, width*0.8, crouchHeight*0.5, 5);
        ctx.fill();
        
        // Helmet base - lowered
        ctx.beginPath();
        ctx.arc(x + width*0.5, y + crouchHeight*0.25, width*0.3, Math.PI, 0, false);
        ctx.fill();
        
        // Helmet visor with reflection
        const visorGradient = ctx.createLinearGradient(
            x + width*0.6, y + crouchHeight*0.15, 
            x + width*0.8, y + crouchHeight*0.35
        );
        visorGradient.addColorStop(0, '#34495e');
        visorGradient.addColorStop(0.7, '#2c3e50');
        visorGradient.addColorStop(1, '#1c2833');
        
        ctx.fillStyle = visorGradient;
        ctx.beginPath();
        ctx.roundRect(x + width*0.3, y + crouchHeight*0.2, width*0.4, crouchHeight*0.2, [0, 0, 10, 10]);
        ctx.fill();
        
        // Visor reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(x + width*0.4, y + crouchHeight*0.22);
        ctx.lineTo(x + width*0.55, y + crouchHeight*0.22);
        ctx.lineTo(x + width*0.5, y + crouchHeight*0.3);
        ctx.closePath();
        ctx.fill();
        
        // Backpack with gradient
        const backpackGradient = ctx.createLinearGradient(
            x - width*0.1, y + crouchHeight*0.3, 
            x + width*0.1, y + crouchHeight*0.3
        );
        backpackGradient.addColorStop(0, '#2c3e50');
        backpackGradient.addColorStop(1, '#2980b9');
        
        ctx.fillStyle = backpackGradient;
        ctx.beginPath();
        ctx.roundRect(x - width*0.05, y + crouchHeight*0.3, width*0.15, crouchHeight*0.6, 3);
        ctx.fill();
        
        // Backpack details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(x - width*0.03, y + crouchHeight*0.35, width*0.1, crouchHeight*0.05);
        ctx.fillRect(x - width*0.03, y + crouchHeight*0.6, width*0.1, crouchHeight*0.05);
        
        // Legs - bent for crouching
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.roundRect(x + width*0.3, y + crouchHeight*0.5, width*0.5, crouchHeight*0.4, 3);
        ctx.fill();
        
        // Boot details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(x + width*0.65, y + crouchHeight*0.75, width*0.15, crouchHeight*0.15);
        
        // Arms - positioned for crouching stance
        ctx.fillStyle = '#2980b9';
        ctx.beginPath();
        ctx.roundRect(x + width*0.15, y + crouchHeight*0.3, width*0.2, crouchHeight*0.25, 3);
        ctx.fill();
        
        // Spacesuit details/seams
        ctx.strokeStyle = '#1a5276';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + width*0.1, y + crouchHeight*0.45);
        ctx.lineTo(x + width*0.9, y + crouchHeight*0.45);
        ctx.stroke();
        
        // Oxygen tank valve
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x + width*0.05, y + crouchHeight*0.45, width*0.04, 0, Math.PI * 2);
        ctx.fill();
        
        // Spacesuit shoulder patch
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(x + width*0.7, y + crouchHeight*0.25, width*0.06, 0, Math.PI * 2);
        ctx.fill();
    }
};
