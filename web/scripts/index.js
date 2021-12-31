/*
GLOBAL VARIABLES
*/
var map;
var bikeMarkers = new Array();
var showLargeIcons = false;


/*
MAP
*/
map = L.map('map', {
        zoomControl: false,
        minZoom: 14,
    })
    .setView(StartPos, 14);
    
// tile provider (look of the map)
// -> https://leaflet-extras.github.io/leaflet-providers/preview/index.html
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);



/*
ICONS
*/
// avatar
L.marker(AvatarPos, { icon: new AvatarIcon() }).addTo(map);

// bikes
for (let i = 0; i < BikesPos.length; i++)
{
    // pick a random battery value from low, medium & full
    let batteryClass = BatteryClasses[Math.floor(Math.random() * BatteryClasses.length)];
    let classList = `bikeIcon bikeIconSmall ${batteryClass}`;
    // create marker with the determined classlist
    let marker = L.marker(BikesPos[i], { icon: new BikeIconSmall({ className: classList }) });
    
    // save markers for later changes
    bikeMarkers.push(marker);

    // add markers to map
    marker
        .addTo(map)
        .on('click', showBikeDetails);
}



/*
EVENTS
*/
// update icons depending on zoom level
map.on('zoomend', updateBikeIcons);

map.on('click', updateUi);



/*
HELPER FUNCTIONS
*/
function updateBikeIcons()
{
    // determine if icon update is needed
    let iconUpdateNeeded = (map.getZoom() > 16) != showLargeIcons;

    if (iconUpdateNeeded)
    {
        showLargeIcons = !showLargeIcons;

        // change icon for every bike
        bikeMarkers.forEach(marker =>
        { 
            // hold current classlist because 'setIcon' clears it
            let classList = marker._icon.classList;

            if (showLargeIcons)
            {
                marker.setIcon(new BikeIconLarge({ className: classList }));
                marker._icon.classList.remove('bikeIconSmall');
            }
            else
            {
                marker.setIcon(new BikeIconSmall({ className: classList }));
                marker._icon.classList.add('bikeIconSmall');
            }
        });
    }
}

function showBikeDetails(e)
{
    // make details panel visible
    document.getElementById("details").style.display = "block";

    // zoom in on detailed bike if too far out
    if (map.getZoom() <= 16)
    {
        map.flyTo([49.44495, 11.8577], 18, {
            animate: true,
            duration: 1
        });
    }

}

function updateUi()
{
    document.getElementById("details").style.display = "none";
}