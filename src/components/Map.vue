<template>
  <div>

      <div class="container bg-dark text-white">
          <div class="row">
              <div class="col-lg-10 col-md-12 toolbar-options mx-auto d-flex flex-row justify-content-around align-items-center">

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="defaultCheck1" @click="addCar" :checked="carsOnMap" :disabled="vehicles.length == 0">
                    <label class="form-check-label" for="defaultCheck1">Auta</label>
                    <span class="checkmark" @click="checkInput"></span>
                    
                    <!-- Po otrzymaniu/zapisaniu obiektu z pojazdami, nastepuje wywolanie funkcji dodajacej samochody na mape -->
                    <span v-if="initCars" class="hidden"></span>

                    <template v-if="carsOnMap">
                        <select v-model="selectedCars" @change="filterByAvailable" @click="toggleArrow">
                            <option v-for="(status, index) in statusCars" :key="index" :value="status.name" :selected="status.name">{{ status.translate }}</option>
                        </select>
                        <span class="select-arrow"></span>
                    </template>
                    
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="defaultCheck2" :checked="zoneOnMap" @click="zoneOnMap = !zoneOnMap">
                    <label class="form-check-label" for="defaultCheck2">Strefa</label>
                    <span class="checkmark" @click="checkInput"></span>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="defaultCheck3" @click="parkingZone">
                    <label class="form-check-label" for="defaultCheck3">Parking</label>
                    <span class="checkmark" @click="checkInput"></span>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="defaultCheck4" @click="poiZone">
                    <label class="form-check-label" for="defaultCheck4">POI</label>
                    <span class="checkmark" @click="checkInput"></span>
                </div>

            </div>
          </div>
      </div>    
    
    <gmap-map :center="configMap.center" :zoom="configMap.zoom" style="width:100%;  height: 750px;" >

      <gmap-info-window :options="detailWindow.infoOptions" :position="detailWindow.infoWindowPos" :opened="detailWindow.infoWinOpen" @closeclick="detailWindow.infoWinOpen=false">
        <div v-html="detailWindow.infoContent"></div>
      </gmap-info-window>

      <template v-if="carsOnMap">
        <gmap-cluster id="clusterCar" :minimumClusterSize="3" :zoomOnClick="true" :styles="checkStatusVehicleAndSetCorrectCluster">
          <gmap-marker :key="index" v-for="(m, index) in cars" :position="m.position" @click="toggleInfoWindow(m,index)" :icon="(m.parameters.status == 'AVAILABLE') ? icons.iconAvaiable : icons.iconUnavailable"></gmap-marker>
        </gmap-cluster>
      </template>

      <template v-if="parkingOnMap">
        <gmap-cluster :minimumClusterSize="2" :zoomOnClick="true" :styles="clusters.clusterStylesParking">
          <gmap-marker :key="index" v-for="(p, index) in parking" :position="p.position" @click="toggleInfoWindow(p,index)" :label="{text: String(p.parameters.availableSpacesCount)}" :icon="icons.iconParking" ></gmap-marker>
        </gmap-cluster>
      </template>

      <template v-if="poiOnMap">
        <gmap-cluster :minimumClusterSize="2" :zoomOnClick="true" :styles="clusters.clusterStylesPOI">
          <gmap-marker :key="index" v-for="(p, index) in poi" :position="p.position" @click="toggleInfoWindow(p,index)" :icon="icons.iconPOI" ></gmap-marker>
        </gmap-cluster>
      </template>

      <AreaPolygon :zoneOnMap="zoneOnMap" />
      
    </gmap-map>
    
  </div>
</template>

<script>
    import axios from 'axios'
    import * as fetch from '../map_request.js'
    import AreaPolygon from './mapIncludes/AreaPolygon.vue'

    import { ICONS, CLUSTER_CONFIG } from '../config/map_config'
    import * as informationWindow from './mapIncludes/infowindow'

    
    export default {
        data() {
            return {
                configMap: {
                    center: { 
                        lat: 51.125,
                        lng: 17.0
                    },
                    zoom: 12
                },

                vehicles: [],
                cars: [],
                parking: [],
                poi: [],
                initCarClick: false,
                
                carsOnMap: false,
                zoneOnMap: true,
                parkingOnMap: false,
                poiOnMap: false,
                
                statusCars: [
                    { name: 'empty', translate: 'wszystkie' },
                    { name: 'available', translate: 'Dostępne' },
                    { name: 'unavailable', translate: 'Niedostępne' }
                ],
                selectedCars: 'empty',

                detailWindow: informationWindow.INFOWINDOW_CONFIG,
                icons: ICONS,
                clusters: CLUSTER_CONFIG
            }
        },

        created() {
            // Request do API po samochody, bezpośrednio przy uruchomieniu komponentu
            fetch.carsData().then(data => this.vehicles = data.objects);            
        },

        computed: {
            // Po wykonaniu request'a i zapisaniu stanu, nastepuje wywolanie funkcji dodajacej pojazdy na mape 
            initCars() {
                const vehiclesObjectUpdated = (this.vehicles.length > 0 && !this.initCarClick) ? this.addCar() : false;
            },

            // W zależności od statusu pojazdu, podlaczany zostaje odpowiedni obiekt Cluster
            checkStatusVehicleAndSetCorrectCluster() {
                
                switch (this.selectedCars) {
                    case 'unavailable':
                        return this.clusters.clusterStylesCarReserved;
                        break;
                    default:
                        return this.clusters.clusterStylesCar;
                        break;
                }
            }
        },

        methods: {

            addCar() {
            /*  Dodanie pojazdów na mape
                Funkcja zostanie wywolana tylko raz, nastepnie wyswietlanie obiektow dziala na zasadzie toggle */

                this.carsOnMap = !this.carsOnMap;
                const addedMarker = false;

                if (this.addedMarker || this.initCarClick) return

                this.vehicles.map(car => this.cars.push({ position: {lat: car.location.latitude, lng: car.location.longitude}, parameters: car}));
                this.addedMarker = true;
                this.initCarClick = true;
            },            

            // Filtrowanie po statusie pojazdu
            filterByAvailable() {

                switch(this.selectedCars) {

                    case 'available':
                        this.resetMarkersAndGetFilteredCar('available');                       
                        break;

                    case 'unavailable':
                        this.resetMarkersAndGetFilteredCar('reserved');
                        break;

                    default:
                        this.resetMarkersAndGetFilteredCar();
                }

                // Po wybraniu opcji w polu select, usuwana jest klasa rotate ze strzalki 
                const arrow = document.querySelector('.select-arrow');

                for (let cl in Object.values(arrow.classList)) {
                    
                    Object.values(arrow.classList)[cl] -= 'rotate';
                    return false;                  
                }
                
            },

            // Usunięcie pojazdów z mapy i request po wybrane pojazdy (dostepne / niedostepne / wszystkie)
            resetMarkersAndGetFilteredCar(status) {
                this.cars = [];

                fetch.carsData(status ? status.toUpperCase() : 'ALL').then(data => {
                    data.objects.map(car => this.cars.push({ position: {lat: car.location.latitude, lng: car.location.longitude}, parameters: car }))
                })
            },

            // Rotacja dla strzalki - toggle
            toggleArrow() {
                const arrow = document.querySelector('.select-arrow');
                arrow.classList.toggle('rotate');
            },

            parkingZone() {
            /*  Dodanie miejsc parkingowych na mape
                Funkcja zostanie wywolana tylko raz, nastepnie wyswietlanie obiektow dziala na zasadzie toggle */

                this.parkingOnMap = !this.parkingOnMap;
                const initParking = false;

                if (this.initParking) return;

                this.storeData(fetch.parkingData(), this.parking);
                this.initParking = true;
            },

            poiZone() {
            /*  Dodanie POI na mape
                Funkcja zostanie wywolana tylko raz, nastepnie wyswietlanie obiektow dziala na zasadzie toggle */
                
                this.poiOnMap = !this.poiOnMap;
                const initPOI = false;

                if (this.initPOI) return;
                
                this.storeData(fetch.poiData(), this.poi);
                this.initPOI = true;

            },

            // Zapisanie obiektu po wykonaniu request'a. Jako pierwszy argument przekazywana jest funkcja, drugi to tablica
            storeData(type, array) {
                type.then(data => {
                    data.objects.map(point => array.push({ position: {lat: point.location.latitude, lng: point.location.longitude}, parameters: point }));
                })
            },

            toggleInfoWindow: function(marker, idx) {
                this.detailWindow.infoWindowPos = marker.position;

                switch (marker.parameters.discriminator) {
                    case 'vehicle':
                        this.detailWindow.infoContent = informationWindow.getInfoWindowCar(marker);
                        break;
                    case 'parking':
                        this.detailWindow.infoContent = informationWindow.getInfoWindowContentParking(marker);
                        break;
                    case 'poi':
                        this.detailWindow.infoContent = informationWindow.getInfoWindowContentPOI(marker);
                }

                // wyswietlanie infowindow tego samego markera - toggle
                if (this.currentMidx == idx) {
                    this.detailWindow.infoWinOpen = !this.detailWindow.infoWinOpen;
                }
                // klikniecie w inny marker, powoduje zamkniecie obecnego infowindow
                else {
                    this.detailWindow.infoWinOpen = true;
                    this.detailWindow.currentMidx = idx;
                }
            },

            // Delegowanie zdarzenia 'klik' na customowym checkboxie
            checkInput(event) {
                event.target.previousElementSibling.previousElementSibling.click();
            }
        },

        // Zadeklarowanie strefy jako komponentu
        components: {
            AreaPolygon
        }
    }
</script>

<style lang="scss">
    @import '../styles/variable.scss';

    .toolbar-options {
        height: 60px;
    }

    .form-check {
        position: relative;
        display: flex;
        flex-direction: row;
        padding-left: 25px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;

        &:hover {

            input ~ .checkmark {
                background-color: #ccc;
            }

        } 

        .checkmark {
            position: absolute;
            top: 4px;
            left: 3px;
            height: 15px;
            width: 15px;
            background-color: #eee;
            border-radius: 3px;

            &:after {
                content: "";
                position: absolute;
                display: none;
                left: 5px;
                top: 1px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                transform: rotate(45deg);
            }
        }

        input {

            &:checked ~ .checkmark {
                background-color: $vozillaColor;
            }

            &:checked ~ .checkmark:after {
                display: block;
            }
        }

        label {
            cursor: pointer;
        }

        select {
            position: relative;
            width: 200px;
            margin-left: 20px;
            padding-left: 10px;
            background: none;
            border: none;
            border-bottom: 2px solid $vozillaColor;
            outline: none;
            font-size: 14px;
            color: $vozillaColor;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;

            option {
                color: $vozillaColor;
                cursor: pointer;
            }
        }

        .select-arrow {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            top: 0;
            right: 0;
            border-right: 2px solid $vozillaColor;
            border-bottom: 2px solid $vozillaColor;
            transform-origin: 50% 50%;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        .rotate {
            transform: rotate(225deg);
            top: 5px;
        }
    }

    @media screen and (max-width: 576px) {

        .toolbar-options {
            flex-direction: column !important;
            height: inherit;

            .form-check {
                margin: 10px 0;
            }
        }

    }


</style>