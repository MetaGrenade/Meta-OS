import { defineAsyncComponent, markRaw } from 'vue'

export const apps = [
    { 
        id: 'appstore',
        name: 'App Store',
        icon: '/img/icons/apps/shop.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/AppStore.vue')
        ))
    },
    { 
        id: 'files',
        name: 'Files',
        icon: '/img/icons/apps/files.png',
        defaultWidth: 400,
        defaultHeight: 450,
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/FileExplorer.vue')
        ))
    },
    {
        id: 'email',
        name: 'M@iler',
        icon: '/img/icons/apps/email.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Mailer.vue')
        ))
    },
    {
        id: 'browser',
        name: 'Web Browser',
        icon: '/img/icons/apps/browser2.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Browser.vue')
        )), 
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: '/img/icons/apps/calculator.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Calculator.vue')
        )), defaultWidth: 300, defaultHeight: 550 
    },
    {
        id: 'notes',
        name: 'Notepad',
        icon: '/img/icons/apps/notepad.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Notepad.vue')
        )), 
        defaultWidth: 400, 
        defaultHeight: 450
    },
    {
        id: 'lifeinvader',
        name: 'LifeInvader',
        icon: '/img/icons/apps/lifeinvader.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/LifeInvader.vue')
        )), defaultWidth: 400, defaultHeight: 800 
    },
    {
        id: 'dynasty8',
        name: 'Dynasty 8',
        icon: '/img/icons/apps/dynasty8.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Dynasty8.vue')
        )) 
    },
    {
        id: 'vpn',
        name: 'Turd VPN',
        icon: '/img/icons/apps/vpn.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Vpn.vue')
        )), 
        defaultWidth: 800, 
        defaultHeight: 450 
    },
    {
        id: 'taxi',
        name: 'Goober Taxi',
        icon: '/img/icons/apps/taxi.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Taxi.vue')
        ))
    },
    {
        id: 'bank',
        name: 'Maze Bank',
        icon: '/img/icons/apps/bank.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Bank.vue')
        ))
    },
    {
        id: 'crypto',
        name: 'Crypto Miner',
        icon: '/img/icons/apps/crypto.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/CryptoMiner.vue')
        ))
    },
    {
        id: 'clicker',
        name: 'Donut Dash',
        icon: '/img/icons/apps/games/clicker.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/clicker/DonutDash.vue')
        ))
    },
    {
        id: 'garage',
        name: 'Garage',
        icon: '/img/icons/apps/garage.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Garage.vue')
        )),
        defaultWidth: 600,
        defaultHeight: 400 
    },
    {
        id: 'market',
        name: 'Market',
        icon: '/img/icons/apps/market.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Market.vue')
        ))
    },
    {
        id: 'events',
        name: 'Events',
        icon: '/img/icons/apps/events.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/Events.vue')
        ))
    },
    {
        id: 'reaction',
        name: 'Reaction Test',
        icon: '/img/icons/apps/games/reaction.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/reaction/ReactionTester.vue')
        )),
        defaultWidth: 450,
        defaultHeight: 450
    },
    {
        id: 'memory',
        name: 'Memory Match',
        icon: '/img/icons/apps/games/memory.png', 
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/memory/MemoryMatch.vue')
        )), 
        defaultWidth: 800, 
        defaultHeight: 850
    },
    {
        id: 'slots',
        name: 'Slot Machine',
        icon: '/img/icons/apps/games/slots.png', 
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/gamba/SlotMachine.vue')
        )), 
        defaultWidth: 450, 
        defaultHeight: 450
    },
    {
        id: 'tictactoe',
        name: 'Tick Tac Toe',
        icon: '/img/icons/apps/games/tictactoe.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/skill/TicTacToe.vue')
        )),
        defaultWidth: 450,
        defaultHeight: 450
    },
    {
        id: '2048game',
        name: '2048 Game',
        icon: '/img/icons/apps/games/2048game.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/puzzle/Game2048.vue')
        )),
        defaultWidth: 450,
        defaultHeight: 475
    },
    {
        id: 'whackamole',
        name: 'Whack-A-Mole',
        icon: '/img/icons/apps/games/whackamole.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/games/skill/WhackAMole.vue')
        )),
        defaultWidth: 650,
        defaultHeight: 800
    },
    {
        id: 'wifibreach',
        name: 'Wifi Breacher',
        icon: '/img/icons/apps/hacks/wifibreach.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/hacks/WiFiBreach.vue')
        ))
    },
    {
        id: 'bruteforcepin',
        name: 'Pin Cracker',
        icon: '/img/icons/apps/hacks/bruteforcepin.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/hacks/BruteForcePin.vue')
        )),
        defaultWidth: 600,
        defaultHeight: 600
    },
    {
        id: 'encryptionpuzzle',
        name: 'Encrypt',
        icon: '/img/icons/apps/hacks/encryptionpuzzle.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/hacks/EncryptionPuzzle.vue')
        )),
        defaultWidth: 800,
        defaultHeight: 450
    },
    {
        id: 'signaljammer',
        name: 'Signal Jammer',
        icon: '/img/icons/apps/hacks/signaljammer.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/hacks/SignalJammer.vue')
        ))
    },
    {
        id: 'portscanner',
        name: 'Port Scanner',
        icon: '/img/icons/apps/hacks/portscanner.png',
        component: markRaw(defineAsyncComponent(() =>
            import('./components/apps/hacks/PortScanner.vue')
        ))
    },
]
