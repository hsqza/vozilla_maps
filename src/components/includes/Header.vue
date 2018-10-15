<template>
    <header>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <router-link to="/" class="navbar-brand" tag="a"><img class="logo" src="../../assets/logo.png" alt="Vozilla"></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" @click="menuOpen">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup" refs="menuContent">
                <div class="navbar-nav ml-auto">
                    <router-link to="/" class="nav-item nav-link" activeClass="active" exact>Home</router-link>
                    <router-link to="/map" class="nav-item nav-link" activeClass="active">Mapa</router-link>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
    export default {

        watch: {
            '$route'() {
                this.menuOpen()
            }
        },

        methods: {

            // Menu dla widoku mobilnego - toggle
            menuOpen() {
                const menu = document.getElementById('navbarNavAltMarkup');
                menu.classList.toggle('show');
            }
            
        }
    }
</script>

<style lang="scss" scoped>

    .navbar {

        .logo {
            max-width: 200px;
        }

        .active {
            color: #5eb45f !important;
            font-weight: bold;
        }

    }  

</style>