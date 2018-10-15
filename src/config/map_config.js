// Plik konfiguracyjny dla mapy Vozilla

// Ikony
export const ICONS = {

    iconAvaiable: { url: require('../assets/auto-ico.png')},
    iconUnavailable: { url: require('../assets/auto-zajete-ico.png')},
    iconParking: {
        url: require('../assets/parking-ico.png'),
        labelOrigin: { x: 39, y: 11 }
    },
    iconPOI: { url: require('../assets/poi-ico.png') },
    imageNissanLeaf: { url: require('../assets/nissan_leaf_small.jpg')},
    imageNissanENV: { url: require('../assets/nissan_e-nv200_small.jpg')},

}

// Klastrowanie - konfiguracja
const clusterSize = {
    gridSize: 200,
    height: 63,
    width: 49
}

export const CLUSTER_CONFIG = {

    clusterStylesCar: [ {
            url: require('../assets/auto-ico_m1.png'),
            anchorText: [14, -1],
            ...clusterSize
        }, {
            url: require('../assets/auto-ico_m2.png'),
            anchorText: [-21, 14],
            ...clusterSize
        }
    ],

    clusterStylesCarReserved: [ {
        url: require('../assets/auto-zajete-ico_m1.png'),
        anchorText: [14, -1],
        ...clusterSize
    }],

    clusterStylesParking: [{
            url: require('../assets/parking-ico-m1.png'),
            anchorText: [-20, 14],
            ...clusterSize
        }, {
            url: require('../assets/parking-ico-m2.png'),
            anchorText: [-20, 14],
            ...clusterSize
        } 
    ],

    clusterStylesPOI: [{
        url: require('../assets/poi-ico-m1.png'),
        anchorText: [14, -2],
        ...clusterSize
    }],

}