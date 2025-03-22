// Background elements and effects
const backgroundElements = {
    // Space station theme
    spaceStation: {
        // Draw the space station background
        draw: function(ctx, canvas, frameCount) {
            // Deep space background with gradient
            const spaceGradient = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_HEIGHT);
            spaceGradient.addColorStop(0, '#0c2461');
            spaceGradient.addColorStop(0.5, '#1e3c72');
            spaceGradient.addColorStop(1, '#2c3e50');
            
            ctx.fillStyle = spaceGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
            
            // Distant nebula effect
            ctx.save();
            ctx.globalAlpha = 0.2;
            for (let i = 0; i < 3; i++) {
                const nebulaGradient = ctx.createRadialGradient(
                    canvas.width * (0.2 + i * 0.3), 
                    canvas.height * 0.3, 
                    10,
                    canvas.width * (0.2 + i * 0.3), 
                    canvas.height * 0.3, 
                    canvas.height * 0.4
                );
                
                // Different colors for each nebula
                if (i === 0) {
                    nebulaGradient.addColorStop(0, 'rgba(155, 89, 182, 0.5)');
                    nebulaGradient.addColorStop(1, 'rgba(155, 89, 182, 0)');
                } else if (i === 1) {
                    nebulaGradient.addColorStop(0, 'rgba(52, 152, 219, 0.5)');
                    nebulaGradient.addColorStop(1, 'rgba(52, 152, 219, 0)');
                } else {
                    nebulaGradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
                    nebulaGradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
                }
                
                ctx.fillStyle = nebulaGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
            }
            ctx.restore();
            
            // Stars with twinkling effect
            ctx.fillStyle = 'white';
            for (let i = 0; i < 100; i++) {
                const x = (i * 17 + frameCount * 0.05) % canvas.width;
                const y = (Math.sin(i * 0.1 + frameCount * 0.01) * 15) + (i * 7) % (canvas.height - GROUND_HEIGHT);
                // Twinkling effect - stars pulse in size
                const twinkle = Math.sin(frameCount * 0.05 + i) * 0.5 + 0.5;
                const size = (Math.random() * 1.5 + 0.5) * (1 + twinkle * 0.5);
                
                // Some stars are brighter
                if (i % 11 === 0) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.beginPath();
                    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add glow to some stars
                    ctx.save();
                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + twinkle * 0.5})`;
                    ctx.fillRect(x, y, size, size);
                }
            }
            
            // Distant planets with details and shadows
            // Planet 1
            const planet1X = canvas.width * 0.8 - (frameCount * 0.01) % canvas.width;
            const planet1Y = canvas.height * 0.2;
            const planet1Radius = 40;
            
            // Planet base
            const planet1Gradient = ctx.createRadialGradient(
                planet1X - 10, planet1Y - 10, 5,
                planet1X, planet1Y, planet1Radius
            );
            planet1Gradient.addColorStop(0, '#3498db');
            planet1Gradient.addColorStop(0.6, '#2980b9');
            planet1Gradient.addColorStop(1, '#1a5276');
            
            ctx.fillStyle = planet1Gradient;
            ctx.beginPath();
            ctx.arc(planet1X, planet1Y, planet1Radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Planet atmosphere glow
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#85c1e9';
            ctx.beginPath();
            ctx.arc(planet1X, planet1Y, planet1Radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Planet details - surface features
            ctx.fillStyle = '#2980b9';
            for (let i = 0; i < 5; i++) {
                const angle = Math.PI * 2 * i / 5 + frameCount * 0.001;
                const distFromCenter = planet1Radius * 0.6;
                const featureX = planet1X + Math.cos(angle) * distFromCenter;
                const featureY = planet1Y + Math.sin(angle) * distFromCenter;
                
                ctx.beginPath();
                ctx.arc(featureX, featureY, planet1Radius * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Planet 2 (smaller, in background)
            const planet2X = canvas.width * 0.2 - (frameCount * 0.005) % canvas.width;
            const planet2Y = canvas.height * 0.4;
            const planet2Radius = 20;
            
            const planet2Gradient = ctx.createRadialGradient(
                planet2X, planet2Y, 5,
                planet2X, planet2Y, planet2Radius
            );
            planet2Gradient.addColorStop(0, '#e67e22');
            planet2Gradient.addColorStop(0.7, '#d35400');
            planet2Gradient.addColorStop(1, '#a04000');
            
            ctx.fillStyle = planet2Gradient;
            ctx.beginPath();
            ctx.arc(planet2X, planet2Y, planet2Radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Ring system for planet 2
            ctx.save();
            ctx.translate(planet2X, planet2Y);
            ctx.rotate(Math.PI / 6);
            ctx.scale(1, 0.3);
            
            const ringGradient = ctx.createRadialGradient(0, 0, planet2Radius, 0, 0, planet2Radius * 2);
            ringGradient.addColorStop(0, 'rgba(243, 156, 18, 0)');
            ringGradient.addColorStop(0.6, 'rgba(243, 156, 18, 0.4)');
            ringGradient.addColorStop(0.7, 'rgba(243, 156, 18, 0.5)');
            ringGradient.addColorStop(0.8, 'rgba(243, 156, 18, 0.3)');
            ringGradient.addColorStop(1, 'rgba(243, 156, 18, 0)');
            
            ctx.fillStyle = ringGradient;
            ctx.beginPath();
            ctx.arc(0, 0, planet2Radius * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Space station elements - enhanced with details and lighting
            this.drawSpaceStation(ctx, canvas, frameCount);
            
            // Ground with gradient and details
            const groundGradient = ctx.createLinearGradient(0, canvas.height - GROUND_HEIGHT, 0, canvas.height);
            groundGradient.addColorStop(0, '#2a5298');
            groundGradient.addColorStop(0.7, '#1e3c72');
            groundGradient.addColorStop(1, '#153567');
            
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
            
            // Ground details - metallic plates
            ctx.fillStyle = '#4a69bd';
            for (let i = 0; i < canvas.width / 100; i++) {
                ctx.fillRect(i * 100, canvas.height - GROUND_HEIGHT, 80, 5);
                ctx.fillRect(i * 100 + 20, canvas.height - GROUND_HEIGHT + 20, 60, 5);
                ctx.fillRect(i * 100 + 40, canvas.height - GROUND_HEIGHT + 40, 40, 5);
            }
            
            // Ground lighting - subtle glow
            for (let i = 0; i < canvas.width / 200; i++) {
                const glowX = i * 200 + 100;
                const glowGradient = ctx.createRadialGradient(
                    glowX, canvas.height - GROUND_HEIGHT + 5, 0,
                    glowX, canvas.height - GROUND_HEIGHT + 5, 40
                );
                glowGradient.addColorStop(0, 'rgba(52, 152, 219, 0.4)');
                glowGradient.addColorStop(1, 'rgba(52, 152, 219, 0)');
                
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(glowX, canvas.height - GROUND_HEIGHT + 5, 40, 0, Math.PI * 2);
                ctx.fill();
            }
        },
        
        // Draw space station elements
        drawSpaceStation: function(ctx, canvas, frameCount) {
            // Main space station in the distance
            const stationX = canvas.width * 0.6;
            const stationY = canvas.height * 0.3;
            
            // Central hub
            const hubGradient = ctx.createLinearGradient(
                stationX - 60, stationY, 
                stationX + 60, stationY
            );
            hubGradient.addColorStop(0, '#7f8c8d');
            hubGradient.addColorStop(0.5, '#bdc3c7');
            hubGradient.addColorStop(1, '#7f8c8d');
            
            ctx.fillStyle = hubGradient;
            ctx.beginPath();
            ctx.roundRect(stationX - 60, stationY - 30, 120, 60, 10);
            ctx.fill();
            
            // Shadow on the hub
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.roundRect(stationX - 60, stationY - 30, 120, 15, [10, 10, 0, 0]);
            ctx.fill();
            
            // Hub windows
            ctx.fillStyle = '#3498db';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.roundRect(stationX - 50 + i * 30, stationY - 15, 20, 30, 3);
                ctx.fill();
                
                // Window reflection
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.roundRect(stationX - 48 + i * 30, stationY - 13, 5, 25, 1);
                ctx.fill();
                ctx.fillStyle = '#3498db';
            }
            
            // Solar panel arrays
            ctx.save();
            // Left array
            ctx.translate(stationX - 70, stationY);
            ctx.rotate(Math.sin(frameCount * 0.005) * 0.05); // subtle movement
            
            // Panel mount
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(-10, -5, 20, 10);
            
            // Main panel
            const panelGradient = ctx.createLinearGradient(-80, 0, 0, 0);
            panelGradient.addColorStop(0, '#3498db');
            panelGradient.addColorStop(1, '#2980b9');
            ctx.fillStyle = panelGradient;
            ctx.fillRect(-80, -40, 70, 80);
            
            // Panel details
            ctx.strokeStyle = '#1f618d';
            ctx.lineWidth = 1;
            for (let i = 0; i < 7; i++) {
                ctx.beginPath();
                ctx.moveTo(-80, -40 + i * 20);
                ctx.lineTo(-10, -40 + i * 20);
                ctx.stroke();
            }
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(-80 + i * 23, -40);
                ctx.lineTo(-80 + i * 23, 40);
                ctx.stroke();
            }
            
            // Panel shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(-80, -40);
            ctx.lineTo(-60, -40);
            ctx.lineTo(-80, -20);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Right array
            ctx.save();
            ctx.translate(stationX + 70, stationY);
            ctx.rotate(-Math.sin(frameCount * 0.005) * 0.05); // opposite movement
            
            // Panel mount
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(-10, -5, 20, 10);
            
            // Main panel
            ctx.fillStyle = panelGradient;
            ctx.fillRect(10, -40, 70, 80);
            
            // Panel details
            ctx.strokeStyle = '#1f618d';
            ctx.lineWidth = 1;
            for (let i = 0; i < 7; i++) {
                ctx.beginPath();
                ctx.moveTo(10, -40 + i * 20);
                ctx.lineTo(80, -40 + i * 20);
                ctx.stroke();
            }
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(10 + i * 23, -40);
                ctx.lineTo(10 + i * 23, 40);
                ctx.stroke();
            }
            
            // Panel shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(80, -40);
            ctx.lineTo(60, -40);
            ctx.lineTo(80, -20);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Communication dish
            ctx.save();
            ctx.translate(stationX, stationY - 40);
            ctx.rotate(frameCount * 0.005); // rotation animation
            
            // Dish base
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Dish
            ctx.fillStyle = '#bdc3c7';
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 15, 0, Math.PI * 0.9, Math.PI * 0.1, true);
            ctx.fill();
            
            // Dish detail
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, 0, 15, 10, 0, Math.PI * 0.9, Math.PI * 0.1, true);
            ctx.stroke();
            
            // Antenna
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -15);
            ctx.stroke();
            ctx.restore();
            
            // Space station lights
            for (let i = 0; i < 3; i++) {
                const lightX = stationX - 40 + i * 40;
                const lightY = stationY - 35;
                const blinking = Math.floor(frameCount / 30) % 6 === i ? 1 : 0.3;
                
                // Light glow
                const lightGradient = ctx.createRadialGradient(
                    lightX, lightY, 0,
                    lightX, lightY, 10
                );
                lightGradient.addColorStop(0, `rgba(231, 76, 60, ${blinking})`);
                lightGradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
                
                ctx.fillStyle = lightGradient;
                ctx.beginPath();
                ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Light center
                ctx.fillStyle = `rgba(255, 255, 255, ${blinking})`;
                ctx.beginPath();
                ctx.arc(lightX, lightY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Distant flying spacecrafts
            for (let i = 0; i < 2; i++) {
                const craftX = (canvas.width + 200 + i * 300 - (frameCount * 0.3)) % (canvas.width + 400) - 200;
                const craftY = canvas.height * 0.2 + i * 0.1;
                
                // Spacecraft body
                ctx.fillStyle = '#95a5a6';
                ctx.beginPath();
                ctx.roundRect(craftX, craftY, 30, 10, 5);
                ctx.fill();
                
                // Engines glow
                ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
                ctx.beginPath();
                ctx.arc(craftX, craftY + 5, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Contrail effect
                const trailGradient = ctx.createLinearGradient(craftX - 50, 0, craftX, 0);
                trailGradient.addColorStop(0, 'rgba(231, 76, 60, 0)');
                trailGradient.addColorStop(1, 'rgba(231, 76, 60, 0.3)');
                
                ctx.fillStyle = trailGradient;
                ctx.beginPath();
                ctx.moveTo(craftX, craftY + 2);
                ctx.lineTo(craftX - 50, craftY);
                ctx.lineTo(craftX, craftY + 8);
                ctx.closePath();
                ctx.fill();
            }
        }
    },
    
    // Alien planet theme
    alienPlanet: {
        // Draw the alien planet background
        draw: function(ctx, canvas, frameCount) {
            // Sky gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_HEIGHT);
            gradient.addColorStop(0, '#134e5e');
            gradient.addColorStop(1, '#1a6c78');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
            
            // Distant mountains
            this.drawMountains(ctx, canvas, frameCount, 0.1);
            
            // Closer mountains
            this.drawMountains(ctx, canvas, frameCount, 0.3);
            
            // Alien vegetation
            this.drawVegetation(ctx, canvas, frameCount);
            
            // Ground
            ctx.fillStyle = '#71b280';
            ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
            
            // Ground details
            ctx.fillStyle = '#134e5e';
            for (let i = 0; i < canvas.width; i += 30) {
                const offset = (i + frameCount) % 30;
                ctx.fillRect(i - offset, canvas.height - GROUND_HEIGHT, 15, 5);
            }
        },
        
        // Draw mountains with parallax effect
        drawMountains: function(ctx, canvas, frameCount, speed) {
            ctx.fillStyle = speed === 0.1 ? '#0e3b48' : '#0a2a33';
            
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
            
            const amplitude = speed === 0.1 ? 100 : 150;
            const period = speed === 0.1 ? 500 : 300;
            const offset = frameCount * speed;
            
            for (let x = 0; x <= canvas.width; x += 10) {
                const y = canvas.height - GROUND_HEIGHT - Math.abs(Math.sin((x + offset) / period) * amplitude);
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
            ctx.closePath();
            ctx.fill();
        },
        
        // Draw alien vegetation
        drawVegetation: function(ctx, canvas, frameCount) {
            // Strange plants
            for (let i = 0; i < 5; i++) {
                const plantX = (i * 200 - (frameCount * 0.7) % 1000);
                if (plantX < -50 || plantX > canvas.width) continue;
                
                const plantHeight = 70 + i * 10;
                const plantY = canvas.height - GROUND_HEIGHT - plantHeight;
                
                // Plant stem
                ctx.fillStyle = '#16a085';
                ctx.fillRect(plantX, plantY, 10, plantHeight);
                
                // Plant bulb
                ctx.fillStyle = '#1abc9c';
                ctx.beginPath();
                ctx.ellipse(plantX + 5, plantY, 20, 30, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Glowing effect (pulsating)
                const glowSize = 5 + Math.sin(frameCount * 0.05 + i) * 2;
                ctx.fillStyle = 'rgba(46, 204, 113, 0.7)';
                ctx.beginPath();
                ctx.arc(plantX + 5, plantY, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },
    
    // Asteroid field theme
    asteroidField: {
        // Draw the asteroid field background
        draw: function(ctx, canvas, frameCount) {
            // Space background
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
            
            // Stars
            ctx.fillStyle = 'white';
            for (let i = 0; i < 70; i++) {
                const x = (i * 15 + frameCount * 0.05) % canvas.width;
                const y = (i * 7) % (canvas.height - GROUND_HEIGHT);
                const size = Math.random() * 2 + 1;
                ctx.fillRect(x, y, size, size);
            }
            
            // Distant asteroids (slow parallax)
            this.drawAsteroids(ctx, canvas, frameCount, 0.2, 10, 30, '#555555');
            
            // Mid-distance asteroids
            this.drawAsteroids(ctx, canvas, frameCount, 0.4, 20, 50, '#444444');
            
            // Close asteroids (fast parallax)
            this.drawAsteroids(ctx, canvas, frameCount, 0.7, 30, 70, '#666666');
            
            // Ground (asteroid surface)
            ctx.fillStyle = '#666666';
            ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
            
            // Ground details
            ctx.fillStyle = '#333333';
            for (let i = 0; i < canvas.width; i += 30) {
                const offset = (i + frameCount) % 30;
                ctx.fillRect(i - offset, canvas.height - GROUND_HEIGHT, 15, 5);
            }
        },
        
        // Draw asteroids with parallax effect
        drawAsteroids: function(ctx, canvas, frameCount, speed, minSize, maxSize, color) {
            ctx.fillStyle = color;
            
            for (let i = 0; i < 5; i++) {
                const x = (i * 200 - (frameCount * speed) % 1000);
                if (x < -maxSize || x > canvas.width) continue;
                
                const y = 50 + (i * 70) % (canvas.height - GROUND_HEIGHT - maxSize);
                const size = minSize + Math.random() * (maxSize - minSize);
                
                // Draw irregular asteroid shape
                ctx.beginPath();
                ctx.moveTo(x + size/2, y);
                
                for (let angle = 0; angle < Math.PI * 2; angle += Math.PI/8) {
                    const radius = size/2 * (0.8 + Math.random() * 0.4);
                    const asteroidX = x + size/2 + Math.cos(angle) * radius;
                    const asteroidY = y + size/2 + Math.sin(angle) * radius;
                    ctx.lineTo(asteroidX, asteroidY);
                }
                
                ctx.closePath();
                ctx.fill();
                
                // Asteroid craters
                ctx.fillStyle = '#222222';
                const craterCount = Math.floor(size / 10);
                for (let j = 0; j < craterCount; j++) {
                    const craterX = x + Math.random() * size;
                    const craterY = y + Math.random() * size;
                    const craterSize = 2 + Math.random() * 5;
                    
                    ctx.beginPath();
                    ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.fillStyle = color;
            }
        }
    },
    
    // Black hole theme
    blackHole: {
        // Draw the black hole background
        draw: function(ctx, canvas, frameCount) {
            // Space background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
            
            // Stars with distortion effect
            this.drawDistortedStars(ctx, canvas, frameCount);
            
            // Black hole
            this.drawBlackHole(ctx, canvas, frameCount);
            
            // Ground
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
            
            // Ground details
            ctx.fillStyle = '#000000';
            for (let i = 0; i < canvas.width; i += 30) {
                const offset = (i + frameCount) % 30;
                ctx.fillRect(i - offset, canvas.height - GROUND_HEIGHT, 15, 5);
            }
        },
        
        // Draw stars with distortion effect
        drawDistortedStars: function(ctx, canvas, frameCount) {
            const centerX = canvas.width * 0.7;
            const centerY = canvas.height * 0.4;
            
            ctx.fillStyle = 'white';
            for (let i = 0; i < 100; i++) {
                let x = (i * 10) % canvas.width;
                let y = (i * 8) % (canvas.height - GROUND_HEIGHT);
                
                // Calculate distance from black hole center
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                // Apply distortion based on distance
                if (distance < 200) {
                    const distortionFactor = 1 - distance/200;
                    const angle = Math.atan2(dy, dx);
                    
                    // Stars get pulled toward the black hole
                    x = centerX + Math.cos(angle + frameCount * 0.001) * distance * (1 - distortionFactor * 0.5);
                    y = centerY + Math.sin(angle + frameCount * 0.001) * distance * (1 - distortionFactor * 0.5);
                    
                    // Stars closer to the black hole are dimmer
                    ctx.globalAlpha = distance / 200;
                } else {
                    ctx.globalAlpha = 1;
                }
                
                const size = Math.random() * 2 + 1;
                ctx.fillRect(x, y, size, size);
            }
            
            ctx.globalAlpha = 1;
        },
        
        // Draw the black hole
        drawBlackHole: function(ctx, canvas, frameCount) {
            const centerX = canvas.width * 0.7;
            const centerY = canvas.height * 0.4;
            
            // Accretion disk
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 20,
                centerX, centerY, 100
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.4, 'rgba(148, 0, 211, 0.4)');
            gradient.addColorStop(0.6, 'rgba(75, 0, 130, 0.6)');
            gradient.addColorStop(0.8, 'rgba(0, 0, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // Rotating accretion disk
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(frameCount * 0.001);
            ctx.translate(-centerX, -centerY);
            
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, 100, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
            
            // Black hole center
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Event horizon glow
            ctx.beginPath();
            ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};
