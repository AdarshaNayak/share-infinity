import logoutController from "./logout-controller";
import logoutButton from "./logout.html";

export const logoutComponent = {
	template: logoutButton,
	controller: logoutController,
	controllerAs: "$ctrl"
};
