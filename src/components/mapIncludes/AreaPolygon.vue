<template>
    <div>
        <gmap-polygon v-if="carsZone" :path="initZones" :options="{ strokeColor: 'green', strokeWeight: 1, fillColor: 'lightgreen' }"></gmap-polygon>
    </div>
</template>

<script>
    import axios from 'axios'
    import * as fetch from '../../axios_request'

    export default {
        
        props: ['carsZone'],
        data() {
            return {
                zones: [],
                points: [],
            }
        },

        created() {
            fetch.zonesData().then(zone => this.zones.push(zone.objects[1].allowedAreas[0].points));
        },
        
        computed: {

            initZones() { 
                if (this.zones.length > 0) {
                    this.zones[0].map(coord => {
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