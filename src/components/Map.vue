<template>
  <div>

    <div>
      <h2>Search and add a pin</h2>
      <label>
        <button @click="addMarker">Add</button>
      </label>
      <br/>
    </div>

    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="defaultCheck1" @click="addMarker" :checked="carsOnMap">
      <label class="form-check-label" for="defaultCheck1">Cars</label>
    </div>
    
    <div v-if="initCars && !initCar ? addMarker : false"></div>
    
    <gmap-map :center="configMap.center" :zoom="configMap.zoom" style="width:100%;  height: 600px;" >
      <template v-if="carsOnMap">
        <gmap-cluster :minimumClusterSize="3" :zoomOnClick="true">
          <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
            <div v-html="infoContent"></div>
          </gmap-info-window>
          <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" @click="configMap.center=m.position, toggleInfoWindow(m,index)" :icon="(m.parameters.status == 'AVAILABLE') ? iconAvaiable : iconUnavailable"></gmap-marker>
        </gmap-cluster>
      </template>
    </gmap-map>
    
  </div>
</template>

<script>
    import axios from 'axios'
    import * as fetch from '../axios_request.js'
    
    export default {
        data() {
            return {
                configMap: {
                    center: { 
                        lat: 51.10, 
                        lng: 17.197 
                    },
                    zoom: 11
                },
                markers: [],
                vehicles: [],
                zones: [],
                iconAvaiable: { url: require('../assets/auto-ico.png')},
                iconUnavailable: { url: require('../assets/auto-zajete-ico.png')},
                dataLocations: [],
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
                carsOnMap: false,
                initCar: false
            };
        },

        created() {
            // Wywołanie request'ow przy uruchomieniu komponentu
            fetch.carsData().then(data => this.vehicles = data.objects);
            fetch.zonesData().then(data => this.zones = data.objects);
            console.log(this.vehicles);
        },

        computed: {
            initCars() {
                if (this.vehicles.length > 0 && this.initCar == false) {
                    this.addMarker();
                    console.log('Computed Vehicles: ', this.vehicles);
                    this.initCar = true;
                }
                return this.vehicles;
            }
        },

        mounted() {
            this.geolocate();
        },

        methods: {
            
            addMarker() {
                this.carsOnMap = !this.carsOnMap;
                const addedMarker = false;

                // Dodanie markerów do mapy
                if (this.addedMarker) return
                    this.vehicles.map(el => this.markers.push({ position: {lat: el.location.latitude, lng: el.location.longitude}, parameters: el}));
                    this.addedMarker = true;

                    this.markers.map(el => console.log(el.parameters.name))

            },
            

            geolocate: function() {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            },

            toggleInfoWindow: function(marker, idx) {
                this.infoWindowPos = marker.position;
                this.infoContent = this.getInfoWindowContent(marker);

                // console.log(marker.parameters)

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

            getInfoWindowContent: function (marker) {

                console.log(marker.parameters)
                
                let carsImage;
                let imageNissanLeaf = { url: require('../assets/nissan_leaf_small.jpg')};
                let imageNissanENV = { url: require('../assets/nissan_e-nv200_small.jpg')};

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
                        </ul>
                    </div>
                `);
            }
        }
    }
</script>

<style lang="scss">
    

</style>