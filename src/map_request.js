import axios from 'axios'

/*  Request - pojazdy :
    W argumencie przekazywany jest status pojazdow (dostepne/niedostepne);
    Domyślnie zwracane sa wszystkie pojazdy */

export function carsData(status) {

    switch (arguments.length) {
        
        case 1: 
            return axios.get(`map?objectType=VEHICLE&vehicleStatus=${status}`)
                .then(response => response.data)
                .catch(error => console.error(error));
            break;
            
        default:
            return axios.get('map?objectType=VEHICLE&vehicleStatus=AVAILABLE&vehicleStatus=RESERVED')
                .then(response => response.data)
                .catch(error => console.error(error));
            break;
    }

}

// Request - parking
export function parkingData() {
    return axios.get('map?objectType=PARKING')
        .then(response => response.data)
        .catch(error => console.error(error));
}


// Request - strefa
export function zonesData() {
    return axios.get('map?objectType=ZONE')
        .then(response => response.data)
        .catch(error => console.error(error))
}

// Request - POI
export function poiData() {
    return axios.get('map?objectType=POI')
        .then(response => response.data)
        .catch(error => console.error(error));
}