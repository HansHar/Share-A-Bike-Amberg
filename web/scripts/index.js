/*
GLOBAL VARIABLES
*/
var map;
var bikes = new Array();
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
    let bike = new Bike(i);

    // pick a random battery value from low, medium & full
    let batteryClass = BatteryClasses[Math.floor(Math.random() * BatteryClasses.length)];
    bike.classList.push(batteryClass);

    bike.generate();
    bikes.push(bike);
}



/*
EVENTS
*/
// update icons depending on zoom level
map.on('zoomend', updateBikeIcons);

map.on('click', closeDetailpanel);



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

        // change icon for every bike except focus
        bikes.filter(bike => bike.iconStyle != IconStyle.focus).forEach(bike =>
        { 
            bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small)
            bike.updateIcon();
        });
    }
}

function openDetailpanel()
{
    // make details panel visible
    setClassVisibility("bottombar", true)

    // zoom in on detailed bike if too far out
    if (map.getZoom() <= 16)
    {
        map.flyTo([49.44495, 11.8577], 18, {
            animate: true,
            duration: 1
        });
    }

}

function closeDetailpanel()
{
    setClassVisibility("bottombar", false)
}

function openUserpanel()
{
    setClassVisibility("sidebar", true);
    setClassVisibility("map-blur", true);
}

function closeUserpanel()
{
    setClassVisibility("sidebar", false);
    setClassVisibility("map-blur", false);
}

function setClassVisibility(className, visible)
{
    let classToAdd = visible ? `${className}-visible` : `${className}-hidden`;
    let classToRemove = !visible ? `${className}-visible` : `${className}-hidden`;
    
    Array.from(document.getElementsByClassName(className)).forEach((element) => {
        element.classList.add(classToAdd);
        element.classList.remove(classToRemove);
    });
}