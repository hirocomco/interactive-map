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
                
                // Store the path mapping for future color updates
                if (event.target) {
                    const svg = $('#map svg');
                    const pathIndex = svg.find('path').index(event.target);
                    if (pathIndex >= 0) {
                        window.pathToStateMapping[pathIndex] = data.name;
                        console.log('Stored mapping:', pathIndex, '->', data.name);
                    }
                }
                
                // Apply the correct color immediately and ensure it persists
                if (event.target && stateName && stateData[stateName]) {
                    const stateInfo = stateData[stateName];
                    const value = stateInfo[currentActivity];
                    const color = value > 0 ? colorScale(value) : '#f0f0f0';
                    
                    // Apply color directly
                    event.target.setAttribute('fill', color);
                    event.target.style.fill = color;
                    
                    // Store the color for later reference
                    $(event.target).data('correctColor', color);
                    
                    console.log('Applied color to', stateName, '(' + data.name + '):', color, 'value:', value);
                    
                    // Special debug for Delaware
                    if (stateName === 'Delaware') {
                        console.log('DELAWARE DEBUG:', {
                            stateName,
                            abbr: data.name,
                            value,
                            color,
                            currentActivity,
                            allData: stateInfo,
                            elementFill: event.target.getAttribute('fill'),
                            elementStyle: event.target.style.fill
                        });
                    }
                }
                
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
        
        // Apply initial colors after a short delay to ensure map is fully rendered
        setTimeout(() => {
            applyInitialColors();
        }, 200);
        
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

// Apply initial colors by triggering hover events
function applyInitialColors() {
    console.log('Applying initial colors...');
    
    // Trigger hover for each state to build mapping and apply colors
    Object.keys(stateNameToAbbr).forEach((stateName, index) => {
        const abbr = stateNameToAbbr[stateName];
        
        setTimeout(() => {
            try {
                // Try to trigger events manually
                $('#map').usmap('trigger', abbr, 'mouseover', {});
                
                // Immediately trigger mouseout to not leave it highlighted
                setTimeout(() => {
                    $('#map').usmap('trigger', abbr, 'mouseout', {});
                }, 10);
                
            } catch (e) {
                console.log('Could not trigger for', abbr, ':', e.message);
            }
        }, index * 20); // Stagger the triggers
    });
}

// Get state styles based on current activity
function getStateStyles(activity) {
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
        console.log(`Value ${value} normalized to ${normalized} (min=${min}, max=${max})`);
        
        // Use a blue color scale: light blue to dark blue
        const intensity = Math.round(255 * (1 - normalized * 0.9)); // Light to dark
        const blue = Math.round(255 * (0.4 + normalized * 0.6)); // Medium to full blue
        const color = `rgb(${intensity}, ${intensity}, ${blue})`;
        
        console.log(`Color for value ${value}: ${color}`);
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

// Store path-to-state mapping when hovering
window.pathToStateMapping = {};

// Update map colors and styles
function updateMapColors(activity, isRetry = false) {
    console.log('Updating map colors for activity:', activity, isRetry ? '(retry)' : '(initial)');
    console.log('Current colorScale min/max should be for:', activity);
    
    const stateStyles = getStateStyles(activity);
    const svg = $('#map svg');
    
    if (svg.length > 0) {
        console.log('Updating colors for', Object.keys(stateStyles).length, 'states');
        
        // Use the stored mapping if available
        if (Object.keys(window.pathToStateMapping).length > 0) {
            console.log('Using stored path mapping');
            
            Object.keys(window.pathToStateMapping).forEach(pathIndex => {
                const stateAbbr = window.pathToStateMapping[pathIndex];
                const stateName = abbrToStateName[stateAbbr];
                const path = svg.find('path').eq(parseInt(pathIndex))[0];
                
                if (path && stateName && stateData[stateName]) {
                    const stateInfo = stateData[stateName];
                    const value = stateInfo[activity]; // Use the activity parameter, not currentActivity
                    const color = value > 0 ? colorScale(value) : '#f0f0f0';
                    
                    path.setAttribute('fill', color);
                    path.style.fill = color;
                    console.log('Updated', stateName, '(' + stateAbbr + ') to', color, 'value:', value, 'for activity:', activity);
                }
            });
        } else {
            console.log('No path mapping available, using fallback method...');
            
            // Fallback: try to apply colors directly to all path elements
            const svg = $('#map svg');
            const paths = svg.find('path');
            
            paths.each(function(index, path) {
                // Try to determine state from path attributes
                const title = path.getAttribute('title');
                const dataState = path.getAttribute('data-state');
                
                if (title || dataState) {
                    const stateAbbr = title || dataState;
                    const stateName = abbrToStateName[stateAbbr];
                    
                    if (stateName && stateData[stateName]) {
                        const stateInfo = stateData[stateName];
                        const value = stateInfo[activity];
                        const color = value > 0 ? colorScale(value) : '#f0f0f0';
                        
                        path.setAttribute('fill', color);
                        path.style.fill = color;
                        console.log('Fallback: Updated', stateName, '(' + stateAbbr + ') to', color);
                    }
                }
            });
        }
    }
    
    console.log('Color update completed');
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

// Add control listeners
function addControlListeners() {
    const activitySelect = document.getElementById('activity-select');
    
    activitySelect.addEventListener('change', function() {
        console.log('Activity changed to:', this.value);
        
        currentActivity = this.value;
        updateColorScale(currentActivity);
        updateMapColors(currentActivity);
        
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

// Manual color update function for testing
function forceColorUpdate() {
    console.log('Force updating colors...');
    const svg = $('#map svg');
    if (svg.length > 0) {
        svg.find('path').each(function(index) {
            const path = this;
            // Force a test color on first few states
            if (index < 5) {
                path.setAttribute('fill', index === 0 ? '#ff0000' : index === 1 ? '#00ff00' : '#0000ff');
                path.style.fill = index === 0 ? '#ff0000' : index === 1 ? '#00ff00' : '#0000ff';
                console.log('Set path', index, 'to test color');
            }
        });
    }
}

// Test Delaware specifically
function testDelaware() {
    console.log('Testing Delaware color calculation...');
    const delawareData = stateData['Delaware'];
    if (delawareData) {
        console.log('Delaware data:', delawareData);
        console.log('Current activity:', currentActivity);
        console.log('Delaware value for', currentActivity + ':', delawareData[currentActivity]);
        
        const { min, max } = getMinMaxForActivity(currentActivity);
        console.log('Min/Max for', currentActivity + ':', min, max);
        
        const color = colorScale(delawareData[currentActivity]);
        console.log('Calculated color for Delaware:', color);
        
        // Get Delaware's ranking
        const ranking = getStateRanking(currentActivity);
        console.log('Top 5 states for', currentActivity + ':', ranking.slice(0, 5));
        console.log('Delaware rank:', ranking.indexOf('Delaware') + 1);
    }
}

// Initialize all colors by triggering hover events
function initAllColors() {
    console.log('Initializing all colors...');
    
    // Trigger a quick hover over all states to learn the mapping and apply colors
    Object.keys(stateNameToAbbr).forEach((stateName, index) => {
        const abbr = stateNameToAbbr[stateName];
        setTimeout(() => {
            try {
                // Create a fake event to trigger the hover
                $('#map').usmap('trigger', abbr, 'mouseover', {});
                setTimeout(() => {
                    $('#map').usmap('trigger', abbr, 'mouseout', {});
                }, 10);
            } catch (e) {
                console.log('Could not trigger for', abbr);
            }
        }, index * 20); // Stagger the triggers
    });
    
    // After all triggers, force-apply colors with CSS override
    setTimeout(() => {
        forceApplyCorrectColors();
    }, Object.keys(stateNameToAbbr).length * 20 + 500);
}

// Force apply correct colors using CSS
function forceApplyCorrectColors() {
    console.log('Force applying correct colors...');
    
    const svg = $('#map svg');
    if (svg.length > 0) {
        svg.find('path').each(function() {
            const path = $(this);
            const correctColor = path.data('correctColor');
            
            if (correctColor) {
                // Apply color normally
                this.style.fill = correctColor;
                this.setAttribute('fill', correctColor);
                
                console.log('Force applied color:', correctColor, 'to path');
            }
        });
    }
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
    updateMapColors,
    showTooltip,
    updateTooltipPosition,
    forceColorUpdate,
    initAllColors,
    testDelaware,
    forceApplyCorrectColors
};