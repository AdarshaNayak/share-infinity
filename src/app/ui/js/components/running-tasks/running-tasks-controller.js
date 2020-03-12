export default class runningTasksController {
    static get $inject() {
        return ["authService", "taskService", "$location", "$timeout"];
    }

    constructor(authService, taskService, $location, $timeout) {
        this.authService = authService;
        this.taskService = taskService;
        this.$location = $location;
        this.$timeout = $timeout;

        this.error = false;
        this.success = false;
        this.message = "";

        this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        this.tasks = [];
        this.getTasks();
    }

    getTasks() {
        const ctrl = this;
        this.taskService.getRunningTasks(this.currentUser.userId).then(
            function(response) {
                ctrl.tasks = response.data.results;
                console.log(ctrl.tasks);
            },
            function(err) {
                console.log(err);
            }
        );
    }
}
