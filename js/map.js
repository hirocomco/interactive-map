// Interactive US Map Implementation using jQuery US Map Plugin
let currentActivity = 'total';
let colorScale;

// State name to abbreviation mapping
const stateNameToAbbr = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

// Abbreviation to state name mapping
const abbrToStateName = Object.fromEntries(
    Object.entries(stateNameToAbbr).map(([name, abbr]) => [abbr, name])
);

// Map dimensions
const width = 975;
const height = 610;

// Initialize the map
function initMap() {
    try {
        console.log("Initializing US Map...");
        
        // Clear any existing map and hide it during initialization
        $('#map').empty().removeClass('map-ready');
        
        // Ensure container has proper dimensions
        const mapContainer = $('#map');
        console.log('Map container dimensions before init:', mapContainer.width(), 'x', mapContainer.height());
        
        // Force container dimensions if they're 0 or undefined
        if (mapContainer.width() === 0 || !mapContainer.width()) {
            mapContainer.css({
                'width': '100%',
                'height': 'auto',
                'min-height': '500px',
                'display': 'block'
            });
            console.log('Forced container dimensions to full width');
        }
        
        // Set up color scale for initial activity
        updateColorScale(currentActivity);
        
        // Generate state-specific styles for current activity
        const stateSpecificStyles = getStateSpecificStyles(currentActivity);
        
        // Set container dimensions before plugin initialization so it uses them
        const containerWidth = mapContainer.parent().width();
        const mapWidth = containerWidth > 0 ? containerWidth - 40 : 935; // Account for padding
        const mapHeight = Math.round(mapWidth * 0.6); // Maintain aspect ratio
        
        console.log(`Setting container dimensions: ${mapWidth}x${mapHeight}`);
        
        // Set the container dimensions BEFORE initializing the plugin
        mapContainer.css({
            'width': '100%',
            'height': 'auto'
        });
        
        const mapInstance = $('#map').usmap({
            stateStyles: {
                fill: '#f0f0f0',
                stroke: '#fff',
                'stroke-width': 1,
                'stroke-linejoin': 'round'
            },
            stateSpecificStyles: stateSpecificStyles,
            stateHoverStyles: {
                fill: '#333',
                stroke: '#333',
                'stroke-width': 2
            },
            showLabels: false, // Disable state labels to prevent rendering issues
            
            // Click handler
            click: function(event, data) {
                const stateName = abbrToStateName[data.name];
                if (stateName) {
                    showStateDetails(stateName);
                    
                    // Scroll to details section on mobile
                    if (window.innerWidth < 768) {
                        document.getElementById('state-details').scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }
                }
            },
            
            // Mouseover handler
            mouseover: function(event, data) {
                const stateName = abbrToStateName[data.name];
                
                if (!stateName || !stateData[stateName]) {
                    return;
                }
                
                const stateInfo = stateData[stateName];
                const value = stateInfo[currentActivity];
                const ranking = getStateRanking(currentActivity).indexOf(stateName) + 1;
                
                // Show tooltip
                showTooltip(event, `
                    <strong>${stateName}</strong><br/>
                    ${activityMeta[currentActivity].name}: ${value.toLocaleString()}<br/>
                    Rank: #${ranking} of ${Object.keys(stateData).length}
                `);
            },
            
            // Mousemove handler
            mousemove: function(event, data) {
                updateTooltipPosition(event);
            },
            
            // Mouseout handler
            mouseout: function(event, data) {
                $('#tooltip').css('opacity', 0);
            }
                });
        
        // Store map reference for updates
        window.mapInstance = mapInstance;
        
        // Try to get Raphael paper reference
        setTimeout(() => {
            const svg = $('#map svg');
            if (svg.length && svg[0].raphaelPaper) {
                window.mapPaper = svg[0].raphaelPaper;
                console.log('Raphael paper reference stored');
            }
        }, 100);
        
        // Apply responsive styling immediately and show map
        setTimeout(() => {
            const svg = $('#map svg');
            if (svg.length) {
                // Remove hardcoded width and height attributes
                svg.removeAttr('width').removeAttr('height');
                // Apply CSS
                svg.css({
                    'width': '100%',
                    'height': 'auto'
                });
                console.log('Applied responsive styling - showing map');
                // Show the map now that it's properly sized
                $('#map').addClass('map-ready');
            }
        }, 50); // Reduced delay
        
        // Add control listeners
        addControlListeners();
        
        // Show the #1 state for total activity by default
        setTimeout(() => {
            const topStates = getStateRanking('total');
            if (topStates && topStates.length > 0) {
                const topState = topStates[0];
                console.log(`Showing default state details for #1 state: ${topState}`);
                showStateDetails(topState);
            }
        }, 500);
        
        console.log("Map initialized successfully");
        
        console.log("Map colors applied via stateSpecificStyles");
        
    } catch (error) {
        console.error('Error initializing map:', error);
        
        // Show error message
        $('#map').html(`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; text-align: center; color: #d32f2f;">
                <h3>Error loading map</h3>
                <p>Please ensure you're running this from a web server</p>
                <p style="font-size: 12px; color: #666;">Try: python3 -m http.server 8000</p>
            </div>
        `);
    }
}


// Get state-specific styles for jQuery US Map plugin
function getStateSpecificStyles(activity) {
    const styles = {};
    
    Object.keys(stateData).forEach(stateName => {
        const abbr = stateNameToAbbr[stateName];
        if (abbr && stateData[stateName]) {
            const value = stateData[stateName][activity];
            const color = value > 0 ? colorScale(value) : '#f0f0f0';
            styles[abbr] = {
                fill: color
            };
            
            // Debug first few states
            if (Object.keys(styles).length <= 5) {
                console.log(`State ${stateName} (${abbr}): value=${value}, color=${color}`);
            }
        }
    });
    
    console.log(`Generated ${Object.keys(styles).length} state styles for ${activity}`);
    return styles;
}

// Get state styles based on current activity (kept for compatibility)
function getStateStyles(activity) {
    return getStateSpecificStyles(activity);
}

// Get hover styles (darker version of current color)
function getStateHoverStyles() {
    const styles = {};
    
    Object.keys(stateData).forEach(stateName => {
        const abbr = stateNameToAbbr[stateName];
        if (abbr && stateData[stateName]) {
            const value = stateData[stateName][currentActivity];
            if (value > 0) {
                // Create a darker version of the current color
                const baseColor = colorScale(value);
                styles[abbr] = {
                    fill: darkenColor(baseColor, 0.2),
                    stroke: '#333',
                    'stroke-width': 2
                };
            }
        }
    });
    
    return styles;
}

// Darken a color by a factor
function darkenColor(color, factor) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken
    const newR = Math.round(r * (1 - factor));
    const newG = Math.round(g * (1 - factor));
    const newB = Math.round(b * (1 - factor));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Helper function to make SVG responsive
function makeMapResponsive() {
    setTimeout(() => {
        const svg = $('#map svg');
        if (svg.length > 0) {
            console.log('Making SVG responsive - current dimensions:', svg.attr('width'), 'x', svg.attr('height'));
            
            // Remove hardcoded width/height attributes
            svg.removeAttr('width').removeAttr('height');
            // Apply responsive CSS
            svg.css({
                'width': '100%',
                'height': 'auto',
                'max-width': '100%'
            });
            
            // Also ensure the parent container is set correctly
            $('#map').css({
                'width': '100%',
                'height': 'auto'
            });
            
            console.log('Applied responsive styling to map SVG');
        } else {
            console.log('SVG not found, retrying...');
            // Retry if SVG not found yet
            setTimeout(() => makeMapResponsive(), 100);
        }
    }, 200); // Increased delay
}

// Update color scale based on activity
function updateColorScale(activity) {
    const { min, max } = getMinMaxForActivity(activity);
    
    console.log(`Color scale for ${activity}: min=${min}, max=${max}`);
    
    // Create a color scale function that uses smooth interpolation
    colorScale = function(value) {
        if (value <= 0) return '#f0f0f0'; // Light gray for no data
        
        const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
        
        // Use continuous color interpolation instead of discrete tiers
        return interpolateColor(normalized);
    };
    
    // Update legend
    updateLegend(min, max);
}

// Continuous color interpolation function
function interpolateColor(normalized) {
    // Define color stops for smooth gradient
    const colorStops = [
        { position: 0.0, color: [0, 39, 61] },     // #00273D (darkest blue)
        { position: 0.33, color: [0, 54, 84] },   // #003654 (dark blue)
        { position: 0.66, color: [0, 92, 143] },  // #005C8F (medium blue)
        { position: 1.0, color: [0, 130, 202] }   // #0082CA (bright blue)
    ];
    
    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];
    
    for (let i = 0; i < colorStops.length - 1; i++) {
        if (normalized >= colorStops[i].position && normalized <= colorStops[i + 1].position) {
            lowerStop = colorStops[i];
            upperStop = colorStops[i + 1];
            break;
        }
    }
    
    // Calculate interpolation factor between the two stops
    const range = upperStop.position - lowerStop.position;
    const factor = range === 0 ? 0 : (normalized - lowerStop.position) / range;
    
    // Interpolate RGB values
    const r = Math.round(lowerStop.color[0] + (upperStop.color[0] - lowerStop.color[0]) * factor);
    const g = Math.round(lowerStop.color[1] + (upperStop.color[1] - lowerStop.color[1]) * factor);
    const b = Math.round(lowerStop.color[2] + (upperStop.color[2] - lowerStop.color[2]) * factor);
    
    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Update legend with current scale
function updateLegend(min, max) {
    // Get the legend container
    const legendScale = document.querySelector('.legend-scale');
    if (!legendScale) return;
    
    // Clear existing legend items
    legendScale.innerHTML = '';
    
    // Create a gradient bar container
    const gradientContainer = document.createElement('div');
    gradientContainer.className = 'legend-gradient-container';
    
    // Create the gradient bar
    const gradientBar = document.createElement('div');
    gradientBar.className = 'legend-gradient-bar';
    
    // Create gradient background using CSS linear-gradient
    const gradientColors = [
        '#00273D',   // 0%
        '#003654',   // 33%
        '#005C8F',   // 66%
        '#0082CA'    // 100%
    ];
    
    gradientBar.style.background = `linear-gradient(to right, ${gradientColors.join(', ')})`;
    
    // Create value labels container
    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'legend-labels';
    
    // Create min, mid, and max labels
    const minLabel = document.createElement('span');
    minLabel.className = 'legend-value min';
    minLabel.textContent = Math.round(min).toLocaleString();
    
    const midLabel = document.createElement('span');
    midLabel.className = 'legend-value mid';
    midLabel.textContent = Math.round((min + max) / 2).toLocaleString();
    
    const maxLabel = document.createElement('span');
    maxLabel.className = 'legend-value max';
    maxLabel.textContent = Math.round(max).toLocaleString();
    
    // Assemble the legend
    labelsContainer.appendChild(minLabel);
    labelsContainer.appendChild(midLabel);
    labelsContainer.appendChild(maxLabel);
    
    gradientContainer.appendChild(gradientBar);
    gradientContainer.appendChild(labelsContainer);
    
    legendScale.appendChild(gradientContainer);
}


// Show detailed state information
function showStateDetails(stateName) {
    const stateInfo = stateData[stateName];
    if (!stateInfo) return;
    
    const detailsTitle = document.getElementById('details-title');
    const detailsBody = document.getElementById('details-body');
    
    detailsTitle.innerHTML = `
        <span class="state-name">${stateName}</span>
        <span class="click-instruction">(Click a state to see details)</span>
    `;
    
    // Get top 3 activities for this state
    const topActivities = getTopActivitiesForState(stateName);
    
    // Get current activity ranking
    const currentRanking = getStateRanking(currentActivity).indexOf(stateName) + 1;
    const currentValue = stateInfo[currentActivity];
    
    detailsBody.innerHTML = `
        <div class="state-overview">
            <div class="stat-card">
                <h4>${activityMeta[currentActivity].name}</h4>
                <p class="stat-value">${currentValue.toLocaleString()}</p>
                <p class="stat-label">searches per 100k</p>
                <p class="ranking">Rank #${currentRanking} of ${Object.keys(stateData).length}</p>
            </div>
            
            <div class="stat-card">
                <h4>Total Activity</h4>
                <p class="stat-value">${stateInfo.total.toLocaleString()}</p>
                <p class="stat-label">searches per 100k</p>
                <p class="ranking">Rank #${getStateRanking('total').indexOf(stateName) + 1} of ${Object.keys(stateData).length}</p>
            </div>
        </div>
        
        <div class="top-activities">
            <h4>Top 3 Activities in ${stateName}</h4>
            <ol class="activity-list">
                ${topActivities.map(activity => `
                    <li>
                        <span class="activity-name">${activity.name}</span>
                        <span class="activity-value">${activity.value.toLocaleString()}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
        
        <div class="all-activities">
            <h4>All Activities</h4>
            <div class="activity-grid">
                ${Object.keys(stateInfo).filter(key => key !== 'total').map(activity => `
                    <div class="activity-item">
                        <span class="activity-name">${activityMeta[activity].name}</span>
                        <span class="activity-value">${stateInfo[activity].toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Removed: Complex path-to-state mapping approach - no longer needed

// Update map colors efficiently without reinitialization
function updateMapColorsOnly(activity) {
    console.log('Updating map colors for activity:', activity);
    
    try {
        // Get the plugin instance
        const mapInstance = $('#map').data('plugin-usmap');
        if (!mapInstance) {
            console.error('Map plugin instance not found');
            return false;
        }
        
        // Get the new state styles for the current activity
        const newStateStyles = getStateSpecificStyles(activity);
        console.log(`Generated styles for ${Object.keys(newStateStyles).length} states`);
        
        let updateCount = 0;
        
        // Method 1: Try to update through plugin's internal state references
        if (mapInstance.stateShapes) {
            Object.keys(newStateStyles).forEach(abbr => {
                const style = newStateStyles[abbr];
                const stateShape = mapInstance.stateShapes[abbr];
                
                if (stateShape && stateShape.attr) {
                    // Update Raphael element directly
                    stateShape.attr({ fill: style.fill });
                    updateCount++;
                    console.log(`✓ Updated ${abbr} via Raphael to ${style.fill}`);
                }
            });
        }
        
        // Method 2: Fallback to direct SVG manipulation if Method 1 didn't work
        if (updateCount === 0) {
            console.log('Fallback to direct SVG manipulation');
            const svg = $('#map svg');
            const paths = svg.find('path');
            
            // Try to match paths by triggering mouseover events to identify them
            Object.keys(newStateStyles).forEach(abbr => {
                const style = newStateStyles[abbr];
                
                // Use a simple approach: find the path by triggering events
                try {
                    const originalHandler = mapInstance.mouseover;
                    let targetPath = null;
                    
                    // Temporarily override mouseover to capture the path
                    mapInstance.mouseover = function(event, data) {
                        if (data && data.name === abbr) {
                            targetPath = event.target;
                        }
                        if (originalHandler) originalHandler.call(this, event, data);
                    };
                    
                    // Trigger the event to find the path
                    $('#map').usmap('trigger', abbr, 'mouseover', {});
                    
                    // Restore original handler
                    mapInstance.mouseover = originalHandler;
                    
                    // Update the found path
                    if (targetPath) {
                        targetPath.setAttribute('fill', style.fill);
                        targetPath.style.fill = style.fill;
                        updateCount++;
                        console.log(`✓ Updated ${abbr} via DOM to ${style.fill}`);
                    }
                } catch (e) {
                    console.log(`Could not update ${abbr}:`, e.message);
                }
            });
        }
        
        // Method 3: Last resort - update all paths by position (less reliable)
        if (updateCount === 0) {
            console.log('Last resort: updating by path inspection');
            const svg = $('#map svg');
            const paths = svg.find('path');
            
            paths.each(function(index) {
                const path = $(this);
                // Try to find a data attribute or use the Raphael data
                const raphaelElement = this.raphaelObject || this.raphaelid;
                if (raphaelElement && raphaelElement.data) {
                    const stateData = raphaelElement.data();
                    if (stateData && stateData.name && newStateStyles[stateData.name]) {
                        const style = newStateStyles[stateData.name];
                        this.setAttribute('fill', style.fill);
                        this.style.fill = style.fill;
                        updateCount++;
                    }
                }
            });
        }
        
        console.log(`Map color update completed. Updated ${updateCount} states.`);
        return updateCount > 0;
        
    } catch (error) {
        console.error('Error updating map colors:', error);
        return false;
    }
}

// Removed: buildPathStateMapping function - no longer needed with new efficient approach

// Initialize map with new colors (proper plugin destruction and recreation)
function initMapWithNewColors() {
    try {
        console.log('Recreating map with new colors for:', currentActivity);
        
        const mapContainer = $('#map');
        
        // Hide map during recreation
        mapContainer.removeClass('map-ready');
        
        // Step 1: Completely destroy the existing plugin instance
        console.log('Destroying existing plugin instance...');
        
        // Remove all jQuery data and event handlers associated with the plugin
        mapContainer.removeData();
        mapContainer.off();
        
        // Clear all content
        mapContainer.empty();
        
        // Step 2: Completely recreate the map container element to ensure clean state
        const mapContainerParent = mapContainer.parent();
        const newMapContainer = $('<div id="map"></div>');
        
        mapContainer.remove();
        mapContainerParent.append(newMapContainer);
        
        console.log('Created fresh map container');
        
        // Step 3: Generate state-specific styles for current activity
        const stateSpecificStyles = getStateSpecificStyles(currentActivity);
        
        // Step 4: Initialize fresh map instance with delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Initializing fresh map instance...');
            
            // Set container dimensions before plugin initialization
            const containerWidth = newMapContainer.parent().width();
            const mapWidth = containerWidth > 0 ? containerWidth - 40 : 935;
            const mapHeight = Math.round(mapWidth * 0.6);
            
            console.log(`Setting fresh container dimensions: ${mapWidth}x${mapHeight}`);
            
            // Set the container dimensions BEFORE initializing the plugin
            newMapContainer.css({
                'width': '100%',
                'height': 'auto'
            });
            
            const mapInstance = newMapContainer.usmap({
                stateStyles: {
                    fill: '#f0f0f0',
                    stroke: '#fff',
                    'stroke-width': 1,
                    'stroke-linejoin': 'round'
                },
                stateSpecificStyles: stateSpecificStyles,
                stateHoverStyles: {
                    fill: '#333',
                    stroke: '#333',
                    'stroke-width': 2
                },
                showLabels: false,
                
                // Click handler
                click: function(event, data) {
                    const stateName = abbrToStateName[data.name];
                    if (stateName) {
                        showStateDetails(stateName);
                        
                        if (window.innerWidth < 768) {
                            document.getElementById('state-details').scrollIntoView({ 
                                behavior: 'smooth' 
                            });
                        }
                    }
                },
                
                // Mouseover handler
                mouseover: function(event, data) {
                    const stateName = abbrToStateName[data.name];
                    
                    if (!stateName || !stateData[stateName]) {
                        return;
                    }
                    
                    const stateInfo = stateData[stateName];
                    const value = stateInfo[currentActivity];
                    const ranking = getStateRanking(currentActivity).indexOf(stateName) + 1;
                    
                    showTooltip(event, `
                        <strong>${stateName}</strong><br/>
                        ${activityMeta[currentActivity].name}: ${value.toLocaleString()}<br/>
                        Rank: #${ranking} of ${Object.keys(stateData).length}
                    `);
                },
                
                // Mousemove handler
                mousemove: function(event, data) {
                    updateTooltipPosition(event);
                },
                
                // Mouseout handler
                mouseout: function(event, data) {
                    $('#tooltip').css('opacity', 0);
                }
            });
            
            // Store map reference
            window.mapInstance = mapInstance;
            
            console.log(`Fresh map created successfully with colors for ${currentActivity}`);
            
            // Verify SVG creation
            setTimeout(() => {
                const svg = newMapContainer.find('svg');
                if (svg.length > 0) {
                    const pathCount = svg.find('path').length;
                    console.log(`✅ Map SVG created successfully with ${pathCount} paths`);
                } else {
                    console.error('❌ SVG creation failed - this should not happen with fresh container');
                    
                    // Last resort fallback
                    console.log('Attempting emergency fallback...');
                    initMap();
                }
            }, 100);
            
            // Apply responsive styling and show recreated map
            setTimeout(() => {
                const svg = $('#map svg');
                if (svg.length) {
                    // Remove hardcoded width and height attributes
                    svg.removeAttr('width').removeAttr('height');
                    // Apply CSS
                    svg.css({
                        'width': '100%',
                        'height': 'auto'
                    });
                    console.log('Applied responsive styling to recreated map - showing');
                    // Show the recreated map
                    $('#map').addClass('map-ready');
                }
            }, 50); // Reduced delay
            
        }, 100);
        
    } catch (error) {
        console.error('Error recreating map:', error);
        
        // Emergency fallback
        console.log('Emergency fallback to full initialization');
        setTimeout(() => {
            initMap();
        }, 200);
    }
}

// Add control listeners
function addControlListeners() {
    const activitySelect = document.getElementById('activity-select');
    
    activitySelect.addEventListener('change', function() {
        console.log('Activity changed to:', this.value);
        
        currentActivity = this.value;
        updateColorScale(currentActivity);
        
        // Try efficient color update first
        const updateSuccess = updateMapColorsOnly(currentActivity);
        
        if (!updateSuccess) {
            console.log('Color update failed, falling back to map recreation');
            // Fallback to map recreation only if color update fails
            initMapWithNewColors();
        } else {
            console.log('Map colors updated successfully without recreation');
        }
        
        // Show the #1 state for the new activity (reduced delay since no recreation)
        const delay = updateSuccess ? 100 : 600; // Shorter delay for color-only updates
        setTimeout(() => {
            const topStates = getStateRanking(currentActivity);
            if (topStates && topStates.length > 0) {
                const topState = topStates[0];
                console.log(`Showing state details for #1 state in ${currentActivity}: ${topState}`);
                showStateDetails(topState);
            }
        }, delay);
    });
}

// Initialize everything when DOM is loaded
$(document).ready(function() {
    console.log("DOM loaded, initializing map...");
    
    // Check if required libraries are loaded
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded');
        return;
    }
    
    if (typeof Raphael === 'undefined') {
        console.error('Raphael is not loaded');
        return;
    }
    
    if (typeof $.fn.usmap === 'undefined') {
        console.error('US Map plugin is not loaded');
        return;
    }
    
    if (typeof stateData === 'undefined') {
        console.error('State data is not loaded');
        return;
    }
    
    // Add a delay to ensure CSS is fully loaded and applied
    setTimeout(() => {
        try {
            initMap();
        } catch (error) {
            console.error('Error initializing map:', error);
            $('#map').html(`
                <div style="padding: 2rem; text-align: center; color: #d32f2f;">
                    <h3>Error loading map</h3>
                    <p>Please refresh the page or check the console for details.</p>
                </div>
            `);
        }
    }, 200);
});

// Tooltip helper functions
function showTooltip(event, content) {
    const tooltip = $('#tooltip');
    const mapContainer = $('.map-container');
    const containerRect = mapContainer[0].getBoundingClientRect();
    
    // Position relative to the map container
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    tooltip
        .html(content)
        .css({
            'opacity': 1,
            'position': 'absolute',
            'left': (x + 15) + 'px',
            'top': (y - 10) + 'px',
            'z-index': 1000
        });
}

function updateTooltipPosition(event) {
    const tooltip = $('#tooltip');
    const mapContainer = $('.map-container');
    const containerRect = mapContainer[0].getBoundingClientRect();
    
    // Position relative to the map container
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    tooltip.css({
        'left': (x + 15) + 'px',
        'top': (y - 10) + 'px'
    });
}

// Debug function to inspect map elements
function debugMapElements() {
    const svg = $('#map svg');
    const paths = svg.find('path');
    
    console.log('=== MAP DEBUG INFO ===');
    console.log(`SVG found: ${svg.length > 0}`);
    console.log(`Total paths: ${paths.length}`);
    
    // Show first few paths with all attributes
    paths.each(function(index) {
        const path = $(this);
        const allAttrs = {};
        
        // Get all attributes
        if (this.attributes) {
            for (let i = 0; i < this.attributes.length; i++) {
                const attr = this.attributes[i];
                allAttrs[attr.name] = attr.value;
            }
        }
        
        console.log(`Path ${index}:`, {
            allAttributes: allAttrs,
            'data-state': path.data('state'),
            'data-abbr': path.data('abbr'),
            'jquery-data': path.data(),
            currentFill: path.attr('fill') || path.css('fill')
        });
        
        // Only log first 3 to avoid spam
        if (index >= 2) return false;
    });
    
    const mapInstance = $('#map').data('plugin-usmap');
    console.log(`Map instance found: ${!!mapInstance}`);
    if (mapInstance) {
        console.log(`Raphael paper found: ${!!mapInstance.paper}`);
        console.log('Map instance keys:', Object.keys(mapInstance));
        
        // Try to inspect the Raphael paper
        if (mapInstance.paper && mapInstance.paper.set) {
            console.log('Raphael paper type:', typeof mapInstance.paper);
            console.log('Raphael paper length:', mapInstance.paper.length);
            
            // Look at Raphael elements
            try {
                for (let i = 0; i < Math.min(3, mapInstance.paper.length || 0); i++) {
                    const element = mapInstance.paper[i];
                    if (element) {
                        console.log(`Raphael element ${i}:`, {
                            type: element.type,
                            id: element.id,
                            data: element.data ? element.data() : 'no data method',
                            attrs: element.attrs || 'no attrs'
                        });
                    }
                }
            } catch (e) {
                console.log('Error inspecting Raphael elements:', e.message);
            }
        }
        
        // Check if there are states stored differently
        if (mapInstance.stateElements) {
            console.log('State elements found:', Object.keys(mapInstance.stateElements));
        }
        if (mapInstance.paths) {
            console.log('Paths found:', Object.keys(mapInstance.paths));
        }
    }
    
    console.log('=== END DEBUG ===');
}

// Export for debugging
window.mapDebug = {
    stateData,
    stateNameToAbbr,
    abbrToStateName,
    getStateRanking,
    getTopActivitiesForState,
    getMinMaxForActivity,
    currentActivity,
    showTooltip,
    updateTooltipPosition,
    updateMapColorsOnly,
    initMapWithNewColors,
    debugMapElements
};