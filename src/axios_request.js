import axios from 'axios'

// Get object cars from api_server
export function carsData() {
    return axios.get('map?objectType=VEHICLE&vehicleStatus=AVAILABLE&vehicleStatus=RESERVED')
        .then(response => response.data)
        .catch(error => console.error(error))
}

// Get object zones from api_server
export function zonesData() {
    return axios.get('map?objectType=ZONE')
        .then(response => response.data)
        .catch(error => console.error(error))
}