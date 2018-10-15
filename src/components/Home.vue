<template>
    <div class="jumbotron">
        <h1>Vozilla</h1>
        <p>Do poprawnego wyświetlenia mapy należy dodać rozszerzenie 'Allow-Control-Allow-Origin' w Chromie.</p>
        <router-link tag="button" to="/map" class="btn btn-outline-success">Mapa</router-link>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    @import '../styles/variable.scss';
    
    .jumbotron {
        padding: 14rem 2rem;

        .btn {
            border: 1px solid $vozillaColor;
            color: $vozillaColor;

            &:hover {
                color: white;
            }
        }
    }

</style>