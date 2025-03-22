// Collectible and powerup sprite data using canvas drawing commands
const itemSprites = {
    // Collectible coin
    coin: function(ctx, x, y, width, height, frameCount) {
        // Base coin shape
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        
        // Animate coin rotation by changing the ellipse width based on frame count
        const wobble = Math.abs(Math.sin(frameCount * 0.05));
        ctx.ellipse(
            x + width/2, 
            y + height/2, 
            width/2 * (0.5 + wobble * 0.5), 
            height/2, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Coin highlight
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.ellipse(
            x + width/2, 
            y + height/2, 
            width/4 * (0.5 + wobble * 0.5), 
            height/4, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Shine effect
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + width*0.3, y + height*0.3, width*0.1, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Shield powerup
    shield: function(ctx, x, y, width, height, frameCount) {
        // Base shape
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield icon
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.3, y + height * 0.7);
        ctx.lineTo(x + width * 0.3, y + height * 0.4);
        ctx.lineTo(x + width * 0.5, y + height * 0.3);
        ctx.lineTo(x + width * 0.7, y + height * 0.4);
        ctx.lineTo(x + width * 0.7, y + height * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // Pulsing effect
        const pulse = 1 + Math.sin(frameCount * 0.1) * 0.1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, (width/2) * pulse, 0, Math.PI * 2);
        ctx.stroke();
    },
    
    // Jetpack powerup
    jetpack: function(ctx, x, y, width, height, frameCount) {
        // Base shape
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Jetpack icon
        ctx.fillStyle = 'white';
        ctx.fillRect(x + width * 0.35, y + height * 0.25, width * 0.3, height * 0.5);
        
        // Flames
        const flameHeight = 0.2 + Math.sin(frameCount * 0.2) * 0.1;
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.35, y + height * 0.75);
        ctx.lineTo(x + width * 0.25, y + height * (0.75 + flameHeight));
        ctx.lineTo(x + width * 0.45, y + height * 0.75);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + width * 0.65, y + height * 0.75);
        ctx.lineTo(x + width * 0.75, y + height * (0.75 + flameHeight));
        ctx.lineTo(x + width * 0.55, y + height * 0.75);
        ctx.fill();
    },
    
    // Magnet powerup
    magnet: function(ctx, x, y, width, height, frameCount) {
        // Base shape
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Magnet icon
        ctx.fillStyle = 'white';
        ctx.fillRect(x + width * 0.3, y + height * 0.3, width * 0.4, height * 0.15);
        
        // Magnet poles
        ctx.fillRect(x + width * 0.2, y + height * 0.3, width * 0.1, height * 0.4);
        ctx.fillRect(x + width * 0.7, y + height * 0.3, width * 0.1, height * 0.4);
        
        // Magnetic field lines (animated)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        
        const offset = frameCount * 0.05 % (Math.PI * 2);
        
        for (let i = 0; i < 3; i++) {
            const arcOffset = i * 0.2 + offset;
            ctx.beginPath();
            ctx.arc(x + width/2, y + height * 0.5, width * (0.3 + i * 0.15), Math.PI * 0.8 + arcOffset, Math.PI * 2.2 + arcOffset);
            ctx.stroke();
        }
    },
    
    // Time slow powerup
    timeSlow: function(ctx, x, y, width, height, frameCount) {
        // Base shape
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Clock face
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width * 0.35, 0, Math.PI * 2);
        ctx.fill();
        
        // Clock center
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Clock hands (animated)
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 2;
        
        // Hour hand
        const hourAngle = (frameCount * 0.01) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(x + width/2, y + height/2);
        ctx.lineTo(
            x + width/2 + Math.cos(hourAngle) * width * 0.2,
            y + height/2 + Math.sin(hourAngle) * width * 0.2
        );
        ctx.stroke();
        
        // Minute hand
        const minuteAngle = (frameCount * 0.05) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(x + width/2, y + height/2);
        ctx.lineTo(
            x + width/2 + Math.cos(minuteAngle) * width * 0.3,
            y + height/2 + Math.sin(minuteAngle) * width * 0.3
        );
        ctx.stroke();
    },
    
    // Score multiplier powerup
    multiplier: function(ctx, x, y, width, height, frameCount) {
        // Base shape
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Multiplier text
        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + (width * 0.5) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Pulsing effect for text
        const pulse = 1 + Math.sin(frameCount * 0.1) * 0.2;
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        ctx.scale(pulse, pulse);
        ctx.fillText('x2', 0, 0);
        ctx.restore();
        
        // Sparkle effects
        if (frameCount % 15 < 5) {
            const sparkleSize = width * 0.1;
            ctx.fillStyle = 'white';
            
            // Top sparkle
            ctx.beginPath();
            ctx.arc(x + width/2, y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Right sparkle
            ctx.beginPath();
            ctx.arc(x + width, y + height/2, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Bottom sparkle
            ctx.beginPath();
            ctx.arc(x + width/2, y + height, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Left sparkle
            ctx.beginPath();
            ctx.arc(x, y + height/2, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
