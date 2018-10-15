<template>
    <div>
        <gmap-polygon v-if="zoneOnMap" :path="initZones" :options="{ strokeColor: 'green', strokeWeight: 2, fillColor: 'lightgreen' }"></gmap-polygon>
    </div>
</template>

<script>
    import axios from 'axios'
    import * as fetch from '../../map_request'

    export default {
        props: ['zoneOnMap'],
        data() {
                        
            return {
                zones: [],
                points: [],
                WROCLAW_ZONE: 1,
                AREA_POINTS: 0
            }
        },

        created() {

            // Request do API po dostepna strefe, bezposrednio przy uruchomieniu komponentu
            fetch.zonesData().then(zone => this.zones.push(zone.objects[this.WROCLAW_ZONE].allowedAreas[this.AREA_POINTS].points));
        },
        
        computed: {
            // Zapisanie nowego obiektu z odpowiednim parametrem wspolrzednych 'lat' / 'lng'
            initZones() { 
                if (this.zones.length > 0) {
                    this.zones[this.AREA_POINTS].map(coord => {
                        this.points.push({
                            lat: coord.latitude,
                            lng: coord.longitude
                        })
                    });
                    return this.points;
                }
            }
        }
        
    }

</script>