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
        
        // Clear any existing map
        $('#map').empty();
        
        // Ensure container has proper dimensions
        const mapContainer = $('#map');
        console.log('Map container dimensions before init:', mapContainer.width(), 'x', mapContainer.height());
        
        // Force container dimensions if they're 0 or undefined
        if (mapContainer.width() === 0 || !mapContainer.width()) {
            mapContainer.css({
                'width': '975px',
                'height': '500px',
                'display': 'block'
            });
            console.log('Forced container dimensions to:', mapContainer.width(), 'x', mapContainer.height());
        }
        
        // Set up color scale for initial activity
        updateColorScale(currentActivity);
        
        // Generate state-specific styles for current activity
        const stateSpecificStyles = getStateSpecificStyles(currentActivity);
        
        // Initialize the US Map with explicit dimensions
        const mapInstance = $('#map').usmap({
            width: 975,
            height: 500,
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
        
        // Add control listeners
        addControlListeners();
        
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

// Update color scale based on activity
function updateColorScale(activity) {
    const { min, max } = getMinMaxForActivity(activity);
    
    console.log(`Color scale for ${activity}: min=${min}, max=${max}`);
    
    // Create a color scale function that returns hex colors
    colorScale = function(value) {
        if (value <= 0) return '#f0f0f0'; // Light gray for no data
        
        const normalized = (value - min) / (max - min);
        
        // Use a blue color scale: light blue to dark blue (hex colors)
        const intensity = Math.round(255 * (1 - normalized * 0.8)); // Light to dark
        const blue = Math.round(255 * (0.4 + normalized * 0.6)); // Medium to full blue
        
        // Convert to hex
        const intensityHex = intensity.toString(16).padStart(2, '0');
        const blueHex = blue.toString(16).padStart(2, '0');
        const color = `#${intensityHex}${intensityHex}${blueHex}`;
        
        console.log(`Color for value ${value}: ${color} (normalized: ${normalized})`);
        return color;
    };
    
    // Update legend
    updateLegend(min, max);
}

// Update legend with current scale
function updateLegend(min, max) {
    const legendItems = document.querySelectorAll('.legend-item');
    const quartiles = [
        min,
        min + (max - min) * 0.33,
        min + (max - min) * 0.66,
        max
    ];
    
    legendItems.forEach((item, index) => {
        const colorEl = item.querySelector('.legend-color');
        const textEl = item.querySelector('.legend-text');
        
        if (colorEl && textEl) {
        colorEl.style.backgroundColor = colorScale(quartiles[index]);
        textEl.textContent = Math.round(quartiles[index]).toLocaleString();
        }
    });
}


// Show detailed state information
function showStateDetails(stateName) {
    const stateInfo = stateData[stateName];
    if (!stateInfo) return;
    
    const detailsTitle = document.getElementById('details-title');
    const detailsBody = document.getElementById('details-body');
    
    detailsTitle.textContent = stateName;
    
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

// Store path-to-state mapping
let pathStateMapping = {};

// Update map colors only (without reinitialization)
function updateMapColorsOnly(activity) {
    console.log('Updating map colors for activity:', activity);
    
    // If we don't have the mapping yet, build it using event triggering
    if (Object.keys(pathStateMapping).length === 0) {
        console.log('Building path-to-state mapping...');
        buildPathStateMapping(() => {
            // After mapping is built, call this function again
            updateMapColorsOnly(activity);
        });
        return;
    }
    
    try {
        // Get the current stateSpecificStyles for the new activity
        const newStateStyles = getStateSpecificStyles(activity);
        console.log(`Generated styles for ${Object.keys(newStateStyles).length} states`);
        
        // Use our built mapping to update colors
        const svg = $('#map svg');
        const paths = svg.find('path');
        let updateCount = 0;
        
        Object.keys(newStateStyles).forEach(abbr => {
            const style = newStateStyles[abbr];
            
            // Find the path index for this state
            const pathIndex = pathStateMapping[abbr];
            if (pathIndex !== undefined) {
                const path = paths.eq(pathIndex)[0];
                if (path) {
                    path.setAttribute('fill', style.fill);
                    path.style.fill = style.fill;
                    console.log(`✓ Updated ${abbr} (path ${pathIndex}) to ${style.fill}`);
                    updateCount++;
                }
            } else {
                console.log(`✗ No mapping found for state ${abbr}`);
            }
        });
        
        console.log(`Map color update completed. Updated ${updateCount} states.`);
        
    } catch (error) {
        console.error('Error updating map colors:', error);
    }
}

// Build mapping between path elements and states using event triggering
function buildPathStateMapping(callback) {
    console.log('Building path-to-state mapping using event triggers...');
    pathStateMapping = {};
    const stateList = Object.keys(stateNameToAbbr);
    let processedCount = 0;
    
    // Create a temporary event handler to capture path elements
    const originalMouseover = $('#map').data('plugin-usmap').mouseover;
    
    // Override the mouseover handler temporarily
    $('#map').usmap('option', 'mouseover', function(event, data) {
        const svg = $('#map svg');
        const paths = svg.find('path');
        
        if (event.target) {
            const pathIndex = paths.index(event.target);
            if (pathIndex >= 0) {
                pathStateMapping[data.name] = pathIndex;
                console.log(`Mapped ${data.name} to path ${pathIndex}`);
            }
        }
        
        // Call original handler if it exists
        if (originalMouseover && typeof originalMouseover === 'function') {
            originalMouseover.call(this, event, data);
        }
    });
    
    // Trigger mouseover for each state to build the mapping
    stateList.forEach((stateName, index) => {
        const abbr = stateNameToAbbr[stateName];
        
        setTimeout(() => {
            try {
                $('#map').usmap('trigger', abbr, 'mouseover', {});
                
                // Trigger mouseout to clear hover effects
                setTimeout(() => {
                    $('#map').usmap('trigger', abbr, 'mouseout', {});
                    
                    processedCount++;
                    if (processedCount === stateList.length) {
                        // Restore original mouseover handler
                        $('#map').usmap('option', 'mouseover', originalMouseover);
                        
                        console.log(`Mapping completed. Found ${Object.keys(pathStateMapping).length} states.`);
                        if (callback) callback();
                    }
                }, 10);
                
            } catch (error) {
                console.log(`Could not trigger events for ${abbr}:`, error.message);
                processedCount++;
                if (processedCount === stateList.length) {
                    $('#map').usmap('option', 'mouseover', originalMouseover);
                    if (callback) callback();
                }
            }
        }, index * 20); // Stagger the triggers
    });
}

// Initialize map with new colors (proper plugin destruction and recreation)
function initMapWithNewColors() {
    try {
        console.log('Recreating map with new colors for:', currentActivity);
        
        const mapContainer = $('#map');
        
        // Step 1: Completely destroy the existing plugin instance
        console.log('Destroying existing plugin instance...');
        
        // Remove all jQuery data and event handlers associated with the plugin
        mapContainer.removeData();
        mapContainer.off();
        
        // Clear all content
        mapContainer.empty();
        
        // Step 2: Completely recreate the map container element to ensure clean state
        const mapContainerParent = mapContainer.parent();
        const newMapContainer = $('<div id="map" style="width: 100%; height: 500px;"></div>');
        
        mapContainer.remove();
        mapContainerParent.append(newMapContainer);
        
        console.log('Created fresh map container');
        
        // Step 3: Generate state-specific styles for current activity
        const stateSpecificStyles = getStateSpecificStyles(currentActivity);
        
        // Step 4: Initialize fresh map instance with delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Initializing fresh map instance...');
            
            const mapInstance = newMapContainer.usmap({
                width: 975,
                height: 500,
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
        
        // Use simple reinitialization approach - it works reliably
        initMapWithNewColors();
        
        // Clear state details when switching activities
        document.getElementById('details-title').textContent = 'Click a state to see details';
        document.getElementById('details-body').innerHTML = `
            <p>Select any state on the map above to view detailed outdoor activity data and rankings.</p>
        `;
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
    buildPathStateMapping,
    initMapWithNewColors,
    debugMapElements,
    pathStateMapping: () => pathStateMapping
};