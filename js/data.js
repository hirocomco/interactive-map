// Processed outdoor activity data from CSV
const stateData = {
    "Alabama": {
        "fishing": 368, "backpacking": 43, "biking": 163, "birdwatching": 13, "camping": 425, 
        "hiking": 205, "hunting": 250, "kayaking": 488, "mountaineering": 31, "rv_camping": 96, 
        "skiing": 129, "snowboarding": 68, "surfing": 46, "swimming": 184, "total": 2510
    },
    "Alaska": {
        "fishing": 481, "backpacking": 187, "biking": 316, "birdwatching": 42, "camping": 1176, 
        "hiking": 690, "hunting": 243, "kayaking": 874, "mountaineering": 132, "rv_camping": 290, 
        "skiing": 493, "snowboarding": 401, "surfing": 134, "swimming": 187, "total": 5648
    },
    "Arizona": {
        "fishing": 394, "backpacking": 62, "biking": 258, "birdwatching": 17, "camping": 772, 
        "hiking": 572, "hunting": 106, "kayaking": 641, "mountaineering": 55, "rv_camping": 170, 
        "skiing": 202, "snowboarding": 197, "surfing": 65, "swimming": 240, "total": 3751
    },
    "Arkansas": {
        "fishing": 392, "backpacking": 55, "biking": 204, "birdwatching": 16, "camping": 487, 
        "hiking": 268, "hunting": 284, "kayaking": 468, "mountaineering": 41, "rv_camping": 104, 
        "skiing": 121, "snowboarding": 76, "surfing": 40, "swimming": 281, "total": 2836
    },
    "California": {
        "fishing": 456, "backpacking": 76, "biking": 343, "birdwatching": 15, "camping": 893, 
        "hiking": 596, "hunting": 82, "kayaking": 873, "mountaineering": 43, "rv_camping": 137, 
        "skiing": 275, "snowboarding": 283, "surfing": 251, "swimming": 313, "total": 4637
    },
    "Colorado": {
        "fishing": 541, "backpacking": 155, "biking": 475, "birdwatching": 23, "camping": 1544, 
        "hiking": 956, "hunting": 246, "kayaking": 976, "mountaineering": 123, "rv_camping": 213, 
        "skiing": 979, "snowboarding": 591, "surfing": 83, "swimming": 368, "total": 7272
    },
    "Connecticut": {
        "fishing": 363, "backpacking": 59, "biking": 395, "birdwatching": 24, "camping": 476, 
        "hiking": 425, "hunting": 91, "kayaking": 1043, "mountaineering": 44, "rv_camping": 57, 
        "skiing": 566, "snowboarding": 300, "surfing": 75, "swimming": 267, "total": 4185
    },
    "Delaware": {
        "fishing": 430, "backpacking": 86, "biking": 636, "birdwatching": 38, "camping": 543, 
        "hiking": 279, "hunting": 159, "kayaking": 709, "mountaineering": 60, "rv_camping": 119, 
        "skiing": 267, "snowboarding": 227, "surfing": 202, "swimming": 230, "total": 3987
    },
    "Florida": {
        "fishing": 453, "backpacking": 29, "biking": 307, "birdwatching": 15, "camping": 474, 
        "hiking": 195, "hunting": 107, "kayaking": 1101, "mountaineering": 21, "rv_camping": 136, 
        "skiing": 184, "snowboarding": 93, "surfing": 192, "swimming": 222, "total": 3529
    },
    "Georgia": {
        "fishing": 462, "backpacking": 47, "biking": 240, "birdwatching": 14, "camping": 473, 
        "hiking": 352, "hunting": 185, "kayaking": 671, "mountaineering": 47, "rv_camping": 97, 
        "skiing": 207, "snowboarding": 115, "surfing": 48, "swimming": 265, "total": 3221
    },
    "Hawaii": {
        "fishing": 553, "backpacking": 91, "biking": 279, "birdwatching": 30, "camping": 428, 
        "hiking": 1476, "hunting": 135, "kayaking": 1675, "mountaineering": 54, "rv_camping": 50, 
        "skiing": 230, "snowboarding": 172, "surfing": 2314, "swimming": 309, "total": 7796
    },
    "Idaho": {
        "fishing": 471, "backpacking": 146, "biking": 293, "birdwatching": 22, "camping": 1310, 
        "hiking": 503, "hunting": 235, "kayaking": 667, "mountaineering": 63, "rv_camping": 226, 
        "skiing": 500, "snowboarding": 418, "surfing": 71, "swimming": 277, "total": 5203
    },
    "Illinois": {
        "fishing": 404, "backpacking": 44, "biking": 303, "birdwatching": 17, "camping": 616, 
        "hiking": 287, "hunting": 148, "kayaking": 849, "mountaineering": 28, "rv_camping": 70, 
        "skiing": 313, "snowboarding": 173, "surfing": 46, "swimming": 300, "total": 3597
    },
    "Indiana": {
        "fishing": 391, "backpacking": 45, "biking": 232, "birdwatching": 15, "camping": 641, 
        "hiking": 252, "hunting": 194, "kayaking": 645, "mountaineering": 53, "rv_camping": 86, 
        "skiing": 193, "snowboarding": 123, "surfing": 41, "swimming": 215, "total": 3126
    },
    "Iowa": {
        "fishing": 376, "backpacking": 55, "biking": 263, "birdwatching": 18, "camping": 756, 
        "hiking": 240, "hunting": 244, "kayaking": 578, "mountaineering": 111, "rv_camping": 89, 
        "skiing": 183, "snowboarding": 150, "surfing": 44, "swimming": 209, "total": 3316
    },
    "Kansas": {
        "fishing": 382, "backpacking": 56, "biking": 213, "birdwatching": 18, "camping": 487, 
        "hiking": 224, "hunting": 228, "kayaking": 504, "mountaineering": 35, "rv_camping": 99, 
        "skiing": 170, "snowboarding": 122, "surfing": 50, "swimming": 209, "total": 2796
    },
    "Kentucky": {
        "fishing": 355, "backpacking": 49, "biking": 173, "birdwatching": 18, "camping": 495, 
        "hiking": 264, "hunting": 236, "kayaking": 559, "mountaineering": 32, "rv_camping": 93, 
        "skiing": 143, "snowboarding": 101, "surfing": 36, "swimming": 218, "total": 2771
    },
    "Louisiana": {
        "fishing": 331, "backpacking": 45, "biking": 157, "birdwatching": 13, "camping": 360, 
        "hiking": 142, "hunting": 234, "kayaking": 416, "mountaineering": 25, "rv_camping": 86, 
        "skiing": 122, "snowboarding": 67, "surfing": 38, "swimming": 162, "total": 2199
    },
    "Maine": {
        "fishing": 401, "backpacking": 109, "biking": 352, "birdwatching": 40, "camping": 1239, 
        "hiking": 723, "hunting": 330, "kayaking": 1054, "mountaineering": 109, "rv_camping": 140, 
        "skiing": 712, "snowboarding": 323, "surfing": 167, "swimming": 343, "total": 6040
    },
    "Maryland": {
        "fishing": 409, "backpacking": 50, "biking": 497, "birdwatching": 20, "camping": 540, 
        "hiking": 368, "hunting": 113, "kayaking": 923, "mountaineering": 44, "rv_camping": 80, 
        "skiing": 342, "snowboarding": 215, "surfing": 103, "swimming": 334, "total": 4038
    },
    "Massachusetts": {
        "fishing": 366, "backpacking": 59, "biking": 424, "birdwatching": 27, "camping": 591, 
        "hiking": 453, "hunting": 99, "kayaking": 1216, "mountaineering": 62, "rv_camping": 54, 
        "skiing": 818, "snowboarding": 335, "surfing": 119, "swimming": 331, "total": 4954
    },
    "Michigan": {
        "fishing": 417, "backpacking": 53, "biking": 311, "birdwatching": 13, "camping": 927, 
        "hiking": 307, "hunting": 231, "kayaking": 716, "mountaineering": 25, "rv_camping": 82, 
        "skiing": 321, "snowboarding": 215, "surfing": 39, "swimming": 229, "total": 3885
    },
    "Minnesota": {
        "fishing": 455, "backpacking": 64, "biking": 376, "birdwatching": 7, "camping": 1081, 
        "hiking": 411, "hunting": 288, "kayaking": 860, "mountaineering": 31, "rv_camping": 107, 
        "skiing": 379, "snowboarding": 271, "surfing": 55, "swimming": 280, "total": 4667
    },
    "Mississippi": {
        "fishing": 326, "backpacking": 42, "biking": 133, "birdwatching": 33, "camping": 329, 
        "hiking": 128, "hunting": 292, "kayaking": 328, "mountaineering": 30, "rv_camping": 75, 
        "skiing": 91, "snowboarding": 61, "surfing": 43, "swimming": 127, "total": 2036
    },
    "Missouri": {
        "fishing": 427, "backpacking": 49, "biking": 230, "birdwatching": 6, "camping": 602, 
        "hiking": 279, "hunting": 239, "kayaking": 569, "mountaineering": 30, "rv_camping": 104, 
        "skiing": 154, "snowboarding": 103, "surfing": 39, "swimming": 262, "total": 3093
    },
    "Montana": {
        "fishing": 476, "backpacking": 200, "biking": 331, "birdwatching": 39, "camping": 1905, 
        "hiking": 761, "hunting": 376, "kayaking": 809, "mountaineering": 157, "rv_camping": 413, 
        "skiing": 865, "snowboarding": 433, "surfing": 99, "swimming": 204, "total": 7069
    },
    "Nebraska": {
        "fishing": 380, "backpacking": 68, "biking": 214, "birdwatching": 27, "camping": 621, 
        "hiking": 225, "hunting": 220, "kayaking": 503, "mountaineering": 45, "rv_camping": 112, 
        "skiing": 193, "snowboarding": 159, "surfing": 59, "swimming": 221, "total": 3046
    },
    "Nevada": {
        "fishing": 486, "backpacking": 71, "biking": 271, "birdwatching": 17, "camping": 841, 
        "hiking": 385, "hunting": 99, "kayaking": 788, "mountaineering": 48, "rv_camping": 174, 
        "skiing": 391, "snowboarding": 383, "surfing": 71, "swimming": 235, "total": 4260
    },
    "New Hampshire": {
        "fishing": 397, "backpacking": 110, "biking": 408, "birdwatching": 40, "camping": 1007, 
        "hiking": 737, "hunting": 189, "kayaking": 968, "mountaineering": 149, "rv_camping": 129, 
        "skiing": 1100, "snowboarding": 487, "surfing": 222, "swimming": 367, "total": 6309
    },
    "New Jersey": {
        "fishing": 367, "backpacking": 37, "biking": 312, "birdwatching": 18, "camping": 376, 
        "hiking": 388, "hunting": 86, "kayaking": 1078, "mountaineering": 37, "rv_camping": 45, 
        "skiing": 408, "snowboarding": 252, "surfing": 110, "swimming": 294, "total": 3808
    },
    "New Mexico": {
        "fishing": 345, "backpacking": 83, "biking": 235, "birdwatching": 21, "camping": 910, 
        "hiking": 428, "hunting": 149, "kayaking": 461, "mountaineering": 60, "rv_camping": 163, 
        "skiing": 278, "snowboarding": 292, "surfing": 57, "swimming": 235, "total": 3716
    },
    "New York": {
        "fishing": 393, "backpacking": 51, "biking": 443, "birdwatching": 20, "camping": 464, 
        "hiking": 411, "hunting": 132, "kayaking": 1151, "mountaineering": 40, "rv_camping": 52, 
        "skiing": 579, "snowboarding": 270, "surfing": 96, "swimming": 347, "total": 4449
    },
    "North Carolina": {
        "fishing": 475, "backpacking": 52, "biking": 251, "birdwatching": 16, "camping": 595, 
        "hiking": 454, "hunting": 184, "kayaking": 716, "mountaineering": 84, "rv_camping": 115, 
        "skiing": 249, "snowboarding": 176, "surfing": 119, "swimming": 283, "total": 3767
    },
    "North Dakota": {
        "fishing": 425, "backpacking": 121, "biking": 234, "birdwatching": 35, "camping": 771, 
        "hiking": 269, "hunting": 326, "kayaking": 514, "mountaineering": 70, "rv_camping": 154, 
        "skiing": 333, "snowboarding": 267, "surfing": 112, "swimming": 186, "total": 3816
    },
    "Ohio": {
        "fishing": 416, "backpacking": 48, "biking": 246, "birdwatching": 17, "camping": 636, 
        "hiking": 289, "hunting": 180, "kayaking": 729, "mountaineering": 24, "rv_camping": 66, 
        "skiing": 223, "snowboarding": 152, "surfing": 31, "swimming": 259, "total": 3315
    },
    "Oklahoma": {
        "fishing": 368, "backpacking": 47, "biking": 176, "birdwatching": 14, "camping": 392, 
        "hiking": 197, "hunting": 227, "kayaking": 408, "mountaineering": 34, "rv_camping": 100, 
        "skiing": 131, "snowboarding": 92, "surfing": 37, "swimming": 218, "total": 2438
    },
    "Oregon": {
        "fishing": 652, "backpacking": 144, "biking": 372, "birdwatching": 30, "camping": 1888, 
        "hiking": 1030, "hunting": 166, "kayaking": 997, "mountaineering": 91, "rv_camping": 302, 
        "skiing": 388, "snowboarding": 373, "surfing": 166, "swimming": 436, "total": 7035
    },
    "Pennsylvania": {
        "fishing": 247, "backpacking": 15, "biking": 136, "birdwatching": 4, "camping": 247, 
        "hiking": 143, "hunting": 39, "kayaking": 677, "mountaineering": 9, "rv_camping": 52, 
        "skiing": 50, "snowboarding": 78, "surfing": 21, "swimming": 56, "total": 1774
    },
    "Rhode Island": {
        "fishing": 393, "backpacking": 97, "biking": 326, "birdwatching": 37, "camping": 587, 
        "hiking": 407, "hunting": 118, "kayaking": 931, "mountaineering": 65, "rv_camping": 87, 
        "skiing": 580, "snowboarding": 285, "surfing": 203, "swimming": 226, "total": 4342
    },
    "South Carolina": {
        "fishing": 451, "backpacking": 45, "biking": 218, "birdwatching": 17, "camping": 528, 
        "hiking": 278, "hunting": 183, "kayaking": 632, "mountaineering": 55, "rv_camping": 100, 
        "skiing": 175, "snowboarding": 119, "surfing": 120, "swimming": 189, "total": 3109
    },
    "South Dakota": {
        "fishing": 372, "backpacking": 114, "biking": 237, "birdwatching": 30, "camping": 960, 
        "hiking": 361, "hunting": 303, "kayaking": 531, "mountaineering": 62, "rv_camping": 200, 
        "skiing": 242, "snowboarding": 223, "surfing": 104, "swimming": 190, "total": 3929
    },
    "Tennessee": {
        "fishing": 383, "backpacking": 56, "biking": 205, "birdwatching": 15, "camping": 651, 
        "hiking": 471, "hunting": 228, "kayaking": 637, "mountaineering": 40, "rv_camping": 148, 
        "skiing": 174, "snowboarding": 130, "surfing": 37, "swimming": 254, "total": 3429
    },
    "Texas": {
        "fishing": 424, "backpacking": 33, "biking": 235, "birdwatching": 13, "camping": 427, 
        "hiking": 255, "hunting": 150, "kayaking": 612, "mountaineering": 25, "rv_camping": 92, 
        "skiing": 183, "snowboarding": 93, "surfing": 51, "swimming": 281, "total": 2875
    },
    "Utah": {
        "fishing": 513, "backpacking": 170, "biking": 399, "birdwatching": 22, "camping": 1466, 
        "hiking": 905, "hunting": 194, "kayaking": 648, "mountaineering": 79, "rv_camping": 225, 
        "skiing": 835, "snowboarding": 588, "surfing": 88, "swimming": 404, "total": 6535
    },
    "Vermont": {
        "fishing": 400, "backpacking": 182, "biking": 623, "birdwatching": 59, "camping": 1234, 
        "hiking": 986, "hunting": 336, "kayaking": 1146, "mountaineering": 182, "rv_camping": 208, 
        "skiing": 1711, "snowboarding": 779, "surfing": 165, "swimming": 505, "total": 8515
    },
    "Virginia": {
        "fishing": 463, "backpacking": 57, "biking": 315, "birdwatching": 21, "camping": 714, 
        "hiking": 509, "hunting": 197, "kayaking": 995, "mountaineering": 58, "rv_camping": 100, 
        "skiing": 368, "snowboarding": 214, "surfing": 98, "swimming": 314, "total": 4422
    },
    "Washington": {
        "fishing": 623, "backpacking": 134, "biking": 389, "birdwatching": 26, "camping": 1549, 
        "hiking": 948, "hunting": 149, "kayaking": 999, "mountaineering": 192, "rv_camping": 237, 
        "skiing": 541, "snowboarding": 394, "surfing": 110, "swimming": 417, "total": 6706
    },
    "West Virginia": {
        "fishing": 419, "backpacking": 77, "biking": 210, "birdwatching": 22, "camping": 643, 
        "hiking": 324, "hunting": 372, "kayaking": 463, "mountaineering": 67, "rv_camping": 108, 
        "skiing": 218, "snowboarding": 184, "surfing": 60, "swimming": 210, "total": 3377
    },
    "Wisconsin": {
        "fishing": 458, "backpacking": 59, "biking": 337, "birdwatching": 20, "camping": 1075, 
        "hiking": 445, "hunting": 325, "kayaking": 881, "mountaineering": 28, "rv_camping": 84, 
        "skiing": 304, "snowboarding": 217, "surfing": 41, "swimming": 254, "total": 4528
    },
    "Wyoming": {
        "fishing": 456, "backpacking": 259, "biking": 298, "birdwatching": 44, "camping": 1823, 
        "hiking": 590, "hunting": 400, "kayaking": 720, "mountaineering": 244, "rv_camping": 451, 
        "skiing": 635, "snowboarding": 476, "surfing": 158, "swimming": 224, "total": 6778
    }
};

// Activity metadata for better UX
const activityMeta = {
    "fishing": { name: "Fishing", color: "#2E5BBA" },
    "backpacking": { name: "Backpacking", color: "#8B4513" },
    "biking": { name: "Biking", color: "#FF6B35" },
    "birdwatching": { name: "Birdwatching", color: "#32CD32" },
    "camping": { name: "Camping", color: "#228B22" },
    "hiking": { name: "Hiking", color: "#8FBC8F" },
    "hunting": { name: "Hunting", color: "#A0522D" },
    "kayaking": { name: "Kayaking", color: "#4682B4" },
    "mountaineering": { name: "Mountaineering", color: "#696969" },
    "rv_camping": { name: "RV Camping", color: "#CD853F" },
    "skiing": { name: "Skiing", color: "#87CEEB" },
    "snowboarding": { name: "Snowboarding", color: "#6495ED" },
    "surfing": { name: "Surfing", color: "#00CED1" },
    "swimming": { name: "Swimming", color: "#1E90FF" },
    "total": { name: "Total Activity", color: "#4A4A4A" }
};

// Helper functions
function getStateRanking(activity) {
    const states = Object.keys(stateData);
    return states.sort((a, b) => stateData[b][activity] - stateData[a][activity]);
}

function getTopActivitiesForState(stateName) {
    const state = stateData[stateName];
    if (!state) return [];
    
    const activities = Object.keys(state).filter(key => key !== 'total');
    return activities
        .map(activity => ({ 
            activity, 
            value: state[activity], 
            name: activityMeta[activity].name 
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
}

function getMinMaxForActivity(activity) {
    const values = Object.values(stateData).map(state => state[activity]);
    return {
        min: Math.min(...values),
        max: Math.max(...values)
    };
}