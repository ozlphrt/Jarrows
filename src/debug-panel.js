import * as THREE from 'three';

/**
 * Create a DAT.GUI-style debug panel for light controls
 */
export function createDebugPanel(lights, blocks = null) {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 260px;
        background: #1e1e1e;
        color: #fff;
        font-family: 'Lucida Grande', sans-serif;
        font-size: 11px;
        border: 1px solid #333;
        border-radius: 4px;
        z-index: 10000;
        max-height: calc(100vh - 20px);
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
    `;
    
    // Panel header
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 8px 12px;
        background: #2d2d2d;
        border-bottom: 1px solid #333;
        font-weight: bold;
        cursor: move;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const headerText = document.createElement('span');
    headerText.textContent = 'DEBUG PANEL';
    header.appendChild(headerText);
    
    // Hide/Show toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '+'; // Start with + since panel is hidden by default
    toggleButton.style.cssText = `
        background: #444;
        border: 1px solid #666;
        color: #fff;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 2px;
        font-size: 14px;
        font-weight: bold;
        margin-left: 8px;
    `;
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const contentArea = panel._contentArea;
        if (contentArea) {
            const isHidden = contentArea.style.display === 'none';
            contentArea.style.display = isHidden ? 'flex' : 'none';
            toggleButton.textContent = isHidden ? '−' : '+';
        }
    });
    
    // Prevent toggle button from triggering drag
    toggleButton.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
    header.appendChild(toggleButton);
    
    panel.appendChild(header);
    
    // Make panel draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffset.x = e.clientX - panel.offsetLeft;
        dragOffset.y = e.clientY - panel.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
            panel.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Helper function to create a folder
    function createFolder(title, startCollapsed = false) {
        const folder = document.createElement('div');
        folder.style.cssText = `
            border-bottom: 1px solid #333;
        `;
        
        const folderHeader = document.createElement('div');
        folderHeader.textContent = (startCollapsed ? '▶' : '▼') + ' ' + title;
        folderHeader.style.cssText = `
            padding: 4px 8px;
            background: #252525;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            font-size: 11px;
        `;
        
        const folderContent = document.createElement('div');
        folderContent.style.cssText = `
            display: ${startCollapsed ? 'none' : 'block'};
        `;
        
        let isOpen = !startCollapsed;
        folderHeader.addEventListener('click', () => {
            isOpen = !isOpen;
            folderContent.style.display = isOpen ? 'block' : 'none';
            folderHeader.textContent = (isOpen ? '▼' : '▶') + ' ' + title;
        });
        
        folder.appendChild(folderHeader);
        folder.appendChild(folderContent);
        
        return { folder, content: folderContent };
    }
    
    // Helper function to create a compact DAT.GUI-style slider control
    function createSlider(label, value, min, max, step, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 2px 6px;
            border-bottom: 1px solid #2d2d2d;
            display: flex;
            align-items: center;
            height: 20px;
        `;
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.cssText = `
            min-width: 80px;
            color: #fff;
            font-size: 11px;
            text-align: left;
            margin-right: 8px;
        `;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        slider.className = 'debug-slider';
        slider.style.cssText = `
            flex: 1;
            height: 2px;
            background: #333;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            margin: 0 8px;
        `;
        
        // Add custom slider styles via a style element if not already added
        if (!document.getElementById('debug-panel-styles')) {
            const style = document.createElement('style');
            style.id = 'debug-panel-styles';
            style.textContent = `
                .debug-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #4ecdc4;
                    cursor: pointer;
                    border: 1px solid #2d2d2d;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }
                .debug-slider::-webkit-slider-thumb:hover {
                    background: #5dddd4;
                }
                .debug-slider::-moz-range-thumb {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #4ecdc4;
                    cursor: pointer;
                    border: 1px solid #2d2d2d;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }
                .debug-slider::-moz-range-thumb:hover {
                    background: #5dddd4;
                }
            `;
            document.head.appendChild(style);
        }
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = value.toFixed(2);
        valueDisplay.style.cssText = `
            min-width: 40px;
            text-align: right;
            color: #4ecdc4;
            font-size: 10px;
            font-family: 'Courier New', monospace;
        `;
        
        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            valueDisplay.textContent = newValue.toFixed(2);
            onChange(newValue);
        });
        
        container.appendChild(labelSpan);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        
        return container;
    }
    
    // Helper function to create a compact DAT.GUI-style color picker
    function createColorPicker(label, color, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 2px 6px;
            border-bottom: 1px solid #2d2d2d;
            display: flex;
            align-items: center;
            height: 20px;
        `;
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.cssText = `
            min-width: 70px;
            color: #fff;
            font-size: 10px;
            text-align: left;
            margin-right: 6px;
        `;
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#' + color.getHexString();
        colorInput.style.cssText = `
            width: 28px;
            height: 18px;
            border: 1px solid #555;
            border-radius: 2px;
            cursor: pointer;
            background: none;
            margin-right: 6px;
        `;
        
        const rgbDisplay = document.createElement('span');
        rgbDisplay.textContent = `${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)}`;
        rgbDisplay.style.cssText = `
            flex: 1;
            color: #4ecdc4;
            font-size: 10px;
            font-family: 'Courier New', monospace;
            text-align: right;
        `;
        
        colorInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            color.setHex(parseInt(hex.substring(1), 16));
            rgbDisplay.textContent = `${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)}`;
            onChange(color);
        });
        
        container.appendChild(labelSpan);
        container.appendChild(colorInput);
        container.appendChild(rgbDisplay);
        
        return container;
    }
    
    // Create scrollable content area
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: none;
        flex-direction: column;
    `;
    panel.appendChild(contentArea);
    
    // Store reference for toggle button
    panel._contentArea = contentArea;
    
    // Helper function to add light controls to a folder
    function addLightControls(folder, light) {
        // Position controls
        folder.content.appendChild(createSlider('Position X', light.position.x, -50, 50, 0.1, (value) => {
            light.position.x = value;
        }));
        folder.content.appendChild(createSlider('Position Y', light.position.y, -50, 50, 0.1, (value) => {
            light.position.y = value;
        }));
        folder.content.appendChild(createSlider('Position Z', light.position.z, -50, 50, 0.1, (value) => {
            light.position.z = value;
        }));
        
        // Intensity
        folder.content.appendChild(createSlider('Intensity', light.intensity, 0, 2, 0.01, (value) => {
            light.intensity = value;
        }));
        
        // Color
        folder.content.appendChild(createColorPicker('Color', light.color, (color) => {
            light.color.copy(color);
        }));
    }
    
    // GROUP 1: Primary Lighting (3-point setup)
    const primaryGroup = createFolder('Primary Lighting', true);
    contentArea.appendChild(primaryGroup.folder);
    
    // Key Light
    const keyLightFolder = createFolder('Key Light', true);
    primaryGroup.content.appendChild(keyLightFolder.folder);
    addLightControls(keyLightFolder, lights.keyLight);
    
    // Fill Light
    const fillLightFolder = createFolder('Fill Light', true);
    primaryGroup.content.appendChild(fillLightFolder.folder);
    addLightControls(fillLightFolder, lights.fillLight);
    
    // Rim Light
    const rimLightFolder = createFolder('Rim Light', true);
    primaryGroup.content.appendChild(rimLightFolder.folder);
    addLightControls(rimLightFolder, lights.rimLight);
    
    // GROUP 2: Additional Lighting
    const additionalGroup = createFolder('Additional Lighting', true);
    contentArea.appendChild(additionalGroup.folder);
    
    // Top Light
    const topLightFolder = createFolder('Top Light', true);
    additionalGroup.content.appendChild(topLightFolder.folder);
    addLightControls(topLightFolder, lights.topLight);
    
    // Ambient Light (no position controls)
    const ambientLightFolder = createFolder('Ambient Light', true);
    additionalGroup.content.appendChild(ambientLightFolder.folder);
    ambientLightFolder.content.appendChild(createSlider('Intensity', lights.ambientLight.intensity, 0, 2, 0.01, (value) => {
        lights.ambientLight.intensity = value;
    }));
    ambientLightFolder.content.appendChild(createColorPicker('Color', lights.ambientLight.color, (color) => {
        lights.ambientLight.color.copy(color);
    }));
    
    // GROUP 3: Color Palettes
    const paletteFolder = createFolder('Color Palettes', false);
    contentArea.appendChild(paletteFolder.folder);
    
    // Define 10 professional color palettes
    const colorPalettes = [
        {
            name: 'Natural Daylight',
            key: { r: 1.0, g: 0.98, b: 0.95 },
            fill: { r: 0.9, g: 0.95, b: 1.0 },
            rim: { r: 0.8, g: 0.85, b: 0.9 },
            ambient: { r: 0.9, g: 0.9, b: 0.95 }
        },
        {
            name: 'Warm Sunset',
            key: { r: 1.0, g: 0.85, b: 0.7 },
            fill: { r: 0.95, g: 0.75, b: 0.6 },
            rim: { r: 1.0, g: 0.6, b: 0.4 },
            ambient: { r: 0.95, g: 0.85, b: 0.75 }
        },
        {
            name: 'Cool Moonlight',
            key: { r: 0.7, g: 0.8, b: 1.0 },
            fill: { r: 0.6, g: 0.7, b: 0.9 },
            rim: { r: 0.5, g: 0.6, b: 0.85 },
            ambient: { r: 0.7, g: 0.75, b: 0.85 }
        },
        {
            name: 'Golden Hour',
            key: { r: 1.0, g: 0.95, b: 0.8 },
            fill: { r: 0.9, g: 0.85, b: 0.7 },
            rim: { r: 1.0, g: 0.9, b: 0.6 },
            ambient: { r: 0.95, g: 0.9, b: 0.8 }
        },
        {
            name: 'Neon Cyberpunk',
            key: { r: 0.2, g: 1.0, b: 1.0 },
            fill: { r: 1.0, g: 0.2, b: 0.8 },
            rim: { r: 0.8, g: 0.2, b: 1.0 },
            ambient: { r: 0.3, g: 0.3, b: 0.4 }
        },
        {
            name: 'Forest Green',
            key: { r: 0.7, g: 0.9, b: 0.7 },
            fill: { r: 0.6, g: 0.8, b: 0.6 },
            rim: { r: 0.5, g: 0.7, b: 0.5 },
            ambient: { r: 0.65, g: 0.75, b: 0.65 }
        },
        {
            name: 'Fire Orange',
            key: { r: 1.0, g: 0.6, b: 0.3 },
            fill: { r: 0.9, g: 0.5, b: 0.2 },
            rim: { r: 1.0, g: 0.4, b: 0.1 },
            ambient: { r: 0.9, g: 0.7, b: 0.5 }
        },
        {
            name: 'Ice Blue',
            key: { r: 0.6, g: 0.8, b: 1.0 },
            fill: { r: 0.5, g: 0.7, b: 0.95 },
            rim: { r: 0.4, g: 0.6, b: 0.9 },
            ambient: { r: 0.65, g: 0.75, b: 0.9 }
        },
        {
            name: 'Purple Dream',
            key: { r: 0.8, g: 0.6, b: 1.0 },
            fill: { r: 0.7, g: 0.5, b: 0.9 },
            rim: { r: 0.9, g: 0.5, b: 0.8 },
            ambient: { r: 0.75, g: 0.65, b: 0.85 }
        },
        {
            name: 'Monochrome',
            key: { r: 1.0, g: 1.0, b: 1.0 },
            fill: { r: 0.9, g: 0.9, b: 0.9 },
            rim: { r: 0.8, g: 0.8, b: 0.8 },
            ambient: { r: 0.85, g: 0.85, b: 0.85 }
        }
    ];
    
    // Create palette buttons in a compact grid
    const paletteGrid = document.createElement('div');
    paletteGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2px;
        padding: 4px;
    `;
    
    colorPalettes.forEach((palette, index) => {
        const paletteButton = document.createElement('div');
        paletteButton.textContent = palette.name;
        paletteButton.style.cssText = `
            padding: 4px 6px;
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 2px;
            cursor: pointer;
            font-size: 9px;
            color: #fff;
            text-align: center;
            transition: all 0.2s;
        `;
        
        paletteButton.addEventListener('mouseenter', () => {
            paletteButton.style.background = '#3d3d3d';
            paletteButton.style.borderColor = '#4ecdc4';
        });
        
        paletteButton.addEventListener('mouseleave', () => {
            paletteButton.style.background = '#2d2d2d';
            paletteButton.style.borderColor = '#444';
        });
        
        paletteButton.addEventListener('click', () => {
            // Apply palette to all lights
            lights.keyLight.color.setRGB(palette.key.r, palette.key.g, palette.key.b);
            lights.fillLight.color.setRGB(palette.fill.r, palette.fill.g, palette.fill.b);
            lights.rimLight.color.setRGB(palette.rim.r, palette.rim.g, palette.rim.b);
            lights.ambientLight.color.setRGB(palette.ambient.r, palette.ambient.g, palette.ambient.b);
            
            // Update color pickers in the panel (trigger refresh)
            const colorInputs = panel.querySelectorAll('input[type="color"]');
            colorInputs.forEach((input, i) => {
                if (i === 0) input.value = '#' + lights.keyLight.color.getHexString();
                else if (i === 1) input.value = '#' + lights.fillLight.color.getHexString();
                else if (i === 2) input.value = '#' + lights.rimLight.color.getHexString();
                else if (i === 3) input.value = '#' + lights.topLight.color.getHexString();
                else if (i === 4) input.value = '#' + lights.ambientLight.color.getHexString();
            });
            
            // Update RGB displays
            const rgbDisplays = panel.querySelectorAll('span');
            let displayIndex = 0;
            rgbDisplays.forEach((span) => {
                if (span.textContent.includes(',')) {
                    const colors = [
                        lights.keyLight.color,
                        lights.fillLight.color,
                        lights.rimLight.color,
                        lights.topLight.color,
                        lights.ambientLight.color
                    ];
                    if (displayIndex < colors.length) {
                        const c = colors[displayIndex];
                        span.textContent = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
                        displayIndex++;
                    }
                }
            });
            
            console.log(`Applied palette: ${palette.name}`);
        });
        
        paletteGrid.appendChild(paletteButton);
    });
    
    paletteFolder.content.appendChild(paletteGrid);
    
    // Block Color Palettes folder - open by default (only if blocks array is provided)
    if (blocks !== null && Array.isArray(blocks)) {
        const blockPaletteFolder = createFolder('Block Color Palettes', false);
        contentArea.appendChild(blockPaletteFolder.folder);
        
        // Define block color palettes (colors for blocks of length 1, 2, 3)
        // Colors are chosen for good contrast while being easy on the eyes
        // If arrowColors is provided, blocks use blockColor and arrows use arrowColors
        const blockColorPalettes = [
            {
                name: 'Classic',
                colors: [0xff6b6b, 0x4ecdc4, 0xffe66d] // Red, Teal, Yellow - good contrast
            },
            {
                name: 'Ocean',
                colors: [0x2c5aa0, 0x4ecdc4, 0xffd93d] // Deep Blue, Teal, Golden Yellow
            },
            {
                name: 'Forest',
                colors: [0x2d5016, 0x6b9f3d, 0xffd93d] // Dark Green, Light Green, Yellow
            },
            {
                name: 'Sunset',
                colors: [0xff6b35, 0xffa07a, 0xffe66d] // Orange, Peach, Yellow
            },
            {
                name: 'Purple',
                colors: [0x6c5ce7, 0xa29bfe, 0xffd93d] // Purple, Light Purple, Yellow
            },
            {
                name: 'Pink',
                colors: [0xff6b9d, 0xffb3c1, 0x4ecdc4] // Pink, Light Pink, Teal
            },
            {
                name: 'Vibrant',
                colors: [0xe74c3c, 0x3498db, 0xf39c12] // Red, Blue, Orange - high contrast
            },
            {
                name: 'Pastel',
                colors: [0xff9ff3, 0x54a0ff, 0x5f27cd] // Pink, Blue, Purple - soft contrast
            },
            {
                name: 'Fire',
                colors: [0xc0392b, 0xe67e22, 0xf39c12] // Dark Red, Orange, Yellow
            },
            {
                name: 'Cool',
                colors: [0x2980b9, 0x16a085, 0x27ae60] // Blue, Teal, Green
            },
            {
                name: 'Dark',
                blockColor: 0x808080, // Light grey for all blocks (less dark)
                arrowColors: [0x8b3a3a, 0x2d6d6d, 0x8b7d3a] // Dark Red, Dark Teal, Dark Yellow arrows
            },
            {
                name: 'Light',
                blockColor: 0xf5f5f5, // White/light grey for all blocks
                arrowColors: [0xa0281f, 0x1f5a7a, 0xb8730d] // Dimmed Red, Blue, Orange arrows
            }
        ];
        
        // Create palette buttons in a compact grid
        const blockPaletteGrid = document.createElement('div');
        blockPaletteGrid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px;
            padding: 4px;
        `;
        
        blockColorPalettes.forEach((palette, index) => {
            const paletteButton = document.createElement('div');
            paletteButton.textContent = palette.name;
            paletteButton.style.cssText = `
                padding: 4px 6px;
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
                color: #fff;
                text-align: center;
                transition: all 0.2s;
            `;
            
            paletteButton.addEventListener('mouseenter', () => {
                paletteButton.style.background = '#3d3d3d';
                paletteButton.style.borderColor = '#4ecdc4';
            });
            
            paletteButton.addEventListener('mouseleave', () => {
                paletteButton.style.background = '#2d2d2d';
                paletteButton.style.borderColor = '#444';
            });
            
            paletteButton.addEventListener('click', () => {
                // Update all blocks' colors based on their length
                blocks.forEach(block => {
                    if (block && block.length >= 1 && block.length <= 3) {
                        if (palette.blockColor !== undefined) {
                            // Special palettes (Dark/Light): same block color, different arrow colors
                            const colorIndex = block.length - 1;
                            const arrowColor = palette.arrowColors[colorIndex];
                            block.updateBlockColor(palette.blockColor, arrowColor);
                        } else {
                            // Standard palettes: same color for block and arrow
                            const colorIndex = block.length - 1;
                            const newColor = palette.colors[colorIndex];
                            block.updateBlockColor(newColor);
                        }
                    }
                });
                
                console.log(`Applied block color palette: ${palette.name}`);
            });
            
            blockPaletteGrid.appendChild(paletteButton);
        });
        
        blockPaletteFolder.content.appendChild(blockPaletteGrid);
        
        // Block Statistics Section
        const statsFolder = createFolder('Block Statistics', false);
        contentArea.appendChild(statsFolder.folder);
        
        // Create stats display elements
        const statsContainer = document.createElement('div');
        statsContainer.style.cssText = `
            padding: 8px;
            font-size: 11px;
            line-height: 1.6;
        `;
        
        const totalBlocksLabel = document.createElement('div');
        totalBlocksLabel.style.cssText = `margin-bottom: 4px; font-weight: bold; color: #4ecdc4;`;
        totalBlocksLabel.textContent = 'Total Blocks: 0';
        
        const length1Label = document.createElement('div');
        length1Label.style.cssText = `margin-left: 12px; color: #ff6b6b;`;
        length1Label.textContent = 'Length 1: 0';
        
        const length2Label = document.createElement('div');
        length2Label.style.cssText = `margin-left: 12px; color: #4ecdc4;`;
        length2Label.textContent = 'Length 2: 0';
        
        const length3Label = document.createElement('div');
        length3Label.style.cssText = `margin-left: 12px; color: #ffe66d;`;
        length3Label.textContent = 'Length 3: 0';
        
        const length2StatsLabel = document.createElement('div');
        length2StatsLabel.style.cssText = `margin-top: 8px; margin-left: 12px; color: #4ecdc4; font-size: 10px;`;
        length2StatsLabel.textContent = 'Length 2: Vertical 0% | Horizontal 0%';
        
        const length3StatsLabel = document.createElement('div');
        length3StatsLabel.style.cssText = `margin-left: 12px; color: #ffe66d; font-size: 10px;`;
        length3StatsLabel.textContent = 'Length 3: Vertical 0% | Horizontal 0%';
        
        statsContainer.appendChild(totalBlocksLabel);
        statsContainer.appendChild(length1Label);
        statsContainer.appendChild(length2Label);
        statsContainer.appendChild(length3Label);
        statsContainer.appendChild(length2StatsLabel);
        statsContainer.appendChild(length3StatsLabel);
        
        statsFolder.content.appendChild(statsContainer);
        
        // Function to update statistics
        function updateStats() {
            if (!blocks || !Array.isArray(blocks)) return;
            
            // Filter out removed/falling blocks
            const activeBlocks = blocks.filter(b => !b.isRemoved && !b.isFalling);
            
            // Count by length
            const length1 = activeBlocks.filter(b => b.length === 1).length;
            const length2 = activeBlocks.filter(b => b.length === 2).length;
            const length3 = activeBlocks.filter(b => b.length === 3).length;
            
            // Count length 2 by orientation
            const length2Vertical = activeBlocks.filter(b => b.length === 2 && b.isVertical).length;
            const length2Horizontal = activeBlocks.filter(b => b.length === 2 && !b.isVertical).length;
            const length2Total = length2Vertical + length2Horizontal;
            const length2VerticalPct = length2Total > 0 ? ((length2Vertical / length2Total) * 100).toFixed(1) : '0.0';
            const length2HorizontalPct = length2Total > 0 ? ((length2Horizontal / length2Total) * 100).toFixed(1) : '0.0';
            
            // Count length 3 by orientation
            const length3Vertical = activeBlocks.filter(b => b.length === 3 && b.isVertical).length;
            const length3Horizontal = activeBlocks.filter(b => b.length === 3 && !b.isVertical).length;
            const length3Total = length3Vertical + length3Horizontal;
            const length3VerticalPct = length3Total > 0 ? ((length3Vertical / length3Total) * 100).toFixed(1) : '0.0';
            const length3HorizontalPct = length3Total > 0 ? ((length3Horizontal / length3Total) * 100).toFixed(1) : '0.0';
            
            // Update display
            totalBlocksLabel.textContent = `Total Blocks: ${activeBlocks.length}`;
            length1Label.textContent = `Length 1: ${length1}`;
            length2Label.textContent = `Length 2: ${length2}`;
            length3Label.textContent = `Length 3: ${length3}`;
            length2StatsLabel.textContent = `Length 2: Vertical ${length2VerticalPct}% | Horizontal ${length2HorizontalPct}%`;
            length3StatsLabel.textContent = `Length 3: Vertical ${length3VerticalPct}% | Horizontal ${length3HorizontalPct}%`;
        }
        
        // Update stats initially
        updateStats();
        
        // Update stats periodically (every 500ms)
        const statsInterval = setInterval(() => {
            updateStats();
        }, 500);
        
        // Store interval ID on panel for cleanup if needed
        panel._statsInterval = statsInterval;
    }
    
    document.body.appendChild(panel);
    
    return panel;
}

