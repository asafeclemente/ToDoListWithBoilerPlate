import userprofile from '../userprofile/config';
import pages from '../ui/config/index';
import toDos from './toDos/config';
import example from './example/config';
import { IAppMenu, IModules, IRoute } from './modulesTypings';

class Modules implements IModules {
    modulesRouterList: (IRoute | null)[] = [null];
    modulesAppMenuItemList: (IAppMenu | null)[] = [null];

    constructor() {
        // Create modules router list
        this.modulesRouterList = [
            ...pages.pagesRouterList,
            ...userprofile.userProfileRouterList,
            ...example.exampleRouterList,
            ...toDos.toDosRouterList
        ];

        // Create modules App Menu Item list
        this.modulesAppMenuItemList = [
            ...pages.pagesMenuItemList,
            ...userprofile.userProfileMenuItemList,
            ...example.exampleMenuItemList,
            ...toDos.toDosMenuItemList
        ];
    }

    /**
     * Retonar a rota de todos os módulos
     * registrados na pasta modules
     * @returns {Array}
     */
    getListOfRouterModules = () => {
        return this.modulesRouterList;
    };

    /**
     * Retorna todos os items de menu lateral para os módulos
     * retistrados na pasta modules
     * @returns {Array}
     */
    getAppMenuItemList = () => {
        return this.modulesAppMenuItemList;
    };


    /**
     * Retorna o items de menu lateral para o módulo ToDo
     * retistrados na pasta modules
     * @returns {module}
     */
    getModuleToDo = () => {
        return toDos.toDosMenuItemList[0];
    };


}

export default new Modules();
