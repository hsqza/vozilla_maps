import axios from 'axios'

// Get object cars from api_server
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

// Get object parking from api_server
export function parkingData() {
    return axios.get('map?objectType=PARKING&vehicleStatus=AVAILABLE&vehicleStatus=RESERVED')
        .then(response => response.data)
        .catch(error => console.error(error));
}


// Get object zones from api_server
export function zonesData() {
    return axios.get('map?objectType=ZONE')
        .then(response => response.data)
        .catch(error => console.error(error))
}

// Get object parking from api_server
export function poiData() {
    return axios.get('map?objectType=POI&vehicleStatus=AVAILABLE&vehicleStatus=RESERVED')
        .then(response => response.data)
        .catch(error => console.error(error));
}