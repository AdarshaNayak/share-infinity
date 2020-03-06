export default class providerController {
    static get $inject() {
        return ["authService", "$location", "$timeout"];
    }

    constructor(authService, $location, $timeout) {
        this.authService = authService;
        this.$location = $location;
        this.$timeout = $timeout;
        this.state = "ONLINE";
    }
    changeStateTo(state){
        this.state = state;
        console.log(state);
    }

}
