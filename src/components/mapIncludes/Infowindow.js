// Template infowindow dla punktów wskazanych na mapie

export function getInfoWindowCar(marker) {
    
    let carsImage;
    let imageNissanLeaf = { url: require('../../assets/nissan_leaf_small.jpg')};
    let imageNissanENV = { url: require('../../assets/nissan_e-nv200_small.jpg')};
    

    if (marker.parameters.name == 'NISSAN Leaf') {
        carsImage = imageNissanLeaf.url
    } else {
        carsImage = imageNissanENV.url
    };

    return (`
        <div class="card" style="width: 235px">
            <img class="card-img-top" src='${carsImage}' alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${marker.parameters.name}</h5>
            </div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Numer rejestracyjny: </span>
                    <span><strong>${marker.parameters.platesNumber}</strong></span>
                </li>
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Zasięg: </span>
                    <span><strong>${marker.parameters.rangeKm}km</strong></span>
                </li>
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Poziom naładowania baterii: </span>
                    <span><strong>${marker.parameters.batteryLevelPct} %</strong></span>
                </li>
            </ul>
        </div>
    `);
};

export function getInfoWindowContentParking(marker) {
    
    return (`
        <div class="card" style="width: 235px">
            <div class="card-body">
                <h5 class="card-title">Nazwa: ${marker.parameters.name}</h5>
            </div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Ogółem miejsc: </span>
                    <span><strong>${marker.parameters.spacesCount}</strong></span>
                </li>
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Dostępne miejsca: </span>
                    <span><strong>${marker.parameters.availableSpacesCount}</strong></span>
                </li>
            </ul>
        </div>
    `);
};

export function getInfoWindowContentPOI(marker) {
    
    return (`
        <div class="card" style="width: 235px">
            <div class="card-body">
                <h5 class="card-title">${marker.parameters.name}</h5>
            </div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span><strong>${marker.parameters.description}</strong></span>
                </li>
                <li class="list-group-item d-flex flex-row justify-content-between">
                    <span>Kategoria: </span>
                    <span><strong>${marker.parameters.category}</strong></span>
                </li>
            </ul>
        </div>
    `);
}