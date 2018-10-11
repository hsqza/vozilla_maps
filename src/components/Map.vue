<template>
  <div>

    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="defaultCheck1" @click="addMarker" :checked="carsOnMap">
      <label class="form-check-label" for="defaultCheck1">Cars</label>

      <select style="width:300px; display: flex; margin: 0 auto 30px" v-model="selectedCars" @change="filterByAvailable">
        <option v-for="(status, index) in statusCars" :key="index" :value="status.name" :selected="status.name">{{ status.translate }}</option>
      </select>

    </div>

    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="defaultCheck2" :checked="carsZone" @click="carsZone = !carsZone">
      <label class="form-check-label" for="defaultCheck2">Zone</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="defaultCheck3" @click="parkingZone">
      <label class="form-check-label" for="defaultCheck3">Parking</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="defaultCheck4" @click="poiZone">
      <label class="form-check-label" for="defaultCheck4">POI</label>
    </div>
   
    <div v-if="initCars && !initCar ? addMarker : false"></div>

    
    <gmap-map :center="configMap.center" :zoom="configMap.zoom" style="width:100%;  height: 600px;" >

      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        <div v-html="infoContent"></div>
      </gmap-info-window>

      <template v-if="carsOnMap">
        <gmap-cluster :minimumClusterSize="3" :zoomOnClick="true">
          <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" @click="toggleInfoWindow(m,index)" :icon="(m.parameters.status == 'AVAILABLE') ? iconAvaiable : iconUnavailable"></gmap-marker>
        </gmap-cluster>
      </template>

      <template v-if="parkingOnMap">
        <gmap-cluster :minimumClusterSize="2" :zoomOnClick="true" :styles="clusterStyles">
          <gmap-marker :key="index" v-for="(p, index) in parking" :position="p.position" @click="toggleInfoWindow(p,index)" :label="{text: String(p.parameters.availableSpacesCount)}" :icon="iconParking" ></gmap-marker>
        </gmap-cluster>
      </template>

      <template v-if="poiOnMap">
        <gmap-cluster :minimumClusterSize="2" :zoomOnClick="true">
          <gmap-marker :key="index" v-for="(p, index) in poi" :position="p.position" @click="toggleInfoWindow(p,index)" :icon="iconPOI" ></gmap-marker>
        </gmap-cluster>
      </template>

      <AreaPolygon :carsZone="carsZone" />
      
    </gmap-map>
    
  </div>
</template>

<script>
    import axios from 'axios'
    import * as fetch from '../axios_request.js'
    import * as informationWindow from './mapIncludes/Infowindow'
    import AreaPolygon from './mapIncludes/AreaPolygon.vue'
    
    export default {
        data() {
            return {
                clusterStyles: [{
                    url: require('../assets/marker_cluster_ico.png'),
                    gridSize: 200,
                    height: 63,
                    width: 49,
                    anchorText: [-20, 14]
                }],
                configMap: {
                    center: { 
                        lat: 51.10, 
                        lng: 17.197
                    },
                    zoom: 11
                },
                markers: [],
                vehicles: [],
                iconAvaiable: { url: require('../assets/auto-ico.png')},
                iconUnavailable: { url: require('../assets/auto-zajete-ico.png')},
                iconParking: {
                    url: require('../assets/parking-ico-2.png'),
                    labelOrigin: { x: 39, y: 11 }
                },
                iconPOI: { url: require('../assets/poi-ico.png') },
                dataLocations: [],
                parking: [],
                poi: [],
                currentPlace: null,

                infoContent: null,
                infoWindowPos: null,
                infoWinOpen: false,
                currentMidx: null,
                //optional: offset infowindow so it visually sits nicely on top of our marker
                infoOptions: {
                    pixelOffset: {
                    width: 0,
                    height: -35
                    }
                },
                statusCars: [
                    { name: 'empty', translate: 'wszystkie' },
                    { name: 'available', translate: 'Dostępne' },
                    { name: 'unavailable', translate: 'Niedostępne' }
                ],
                selectedCars: 'empty',
                carsOnMap: false,
                parkingOnMap: false,
                poiOnMap: false,
                initCar: false,
                carsZone: true,
            }
        },

        created() {
            // Wywołanie request'ow przy uruchomieniu komponentu
            fetch.carsData().then(data => this.vehicles = data.objects);
        },

        computed: {

            initCars() {
                if (this.vehicles.length > 0 && this.initCar == false) {
                    this.addMarker();
                    this.initCar = true;
                }
                return this.vehicles;
            }

        },

        mounted() {
            this.geolocate();
        },

        methods: {

            // Dodanie markerów do mapy
            addMarker() {
                this.carsOnMap = !this.carsOnMap;
                const addedMarker = false;

                // Dodanie markerów do mapy
                if (this.addedMarker) return
                    this.vehicles.map(el => this.markers.push({ position: {lat: el.location.latitude, lng: el.location.longitude}, parameters: el}));
                    this.addedMarker = true;

            },            

            geolocate: function() {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
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
                
            },

            // Usunięcie markerów z mapy i request po wybrane pojazdy (dostepne / niedostepne / wszystkie)
            resetMarkersAndGetFilteredCar(status) {
                this.markers = [];

                fetch.carsData(status ? status.toUpperCase() : 'ALL').then(data => {
                    data.objects.map(car => this.markers.push({ position: {lat: car.location.latitude, lng: car.location.longitude}, parameters: car }))
                })
            },

            parkingZone() {
                
                this.parkingOnMap = !this.parkingOnMap;
                const initParking = false;

                if (this.initParking) return;

                fetch.parkingData().then(data => {
                    data.objects.map(place => this.parking.push({ position: {lat: place.location.latitude, lng: place.location.longitude}, parameters: place }));
                    console.log(data.objects)
                    this.initParking = true;
                })
            },

            poiZone() {
                
                this.poiOnMap = !this.poiOnMap;
                const initPOI = false;

                if (this.initPOI) return;

                fetch.poiData().then(data => {
                    data.objects.map(item => this.poi.push({ position: {lat: item.location.latitude, lng: item.location.longitude}, parameters: item }));
                    console.log(this.poi);
                    this.initPOI = true;
                })
            },

            toggleInfoWindow: function(marker, idx) {
                this.infoWindowPos = marker.position;

                switch (marker.parameters.discriminator) {
                    case 'vehicle':
                        this.infoContent = informationWindow.getInfoWindowCar(marker);
                        break;
                    case 'parking':
                        this.infoContent = informationWindow.getInfoWindowContentParking(marker);
                        break;
                    case 'poi':
                        this.infoContent = informationWindow.getInfoWindowContentPOI(marker);
                }

                //check if its the same marker that was selected if yes toggle
                if (this.currentMidx == idx) {
                    this.infoWinOpen = !this.infoWinOpen;
                }
                //if different marker set infowindow to open and reset current marker index
                else {
                    this.infoWinOpen = true;
                    this.currentMidx = idx;
                }
            },
        },

        components: {
            AreaPolygon
        }
    }
</script>

<style lang="scss">

    .availableSpace {
        border: 2px solid pink;
    }    

</style>