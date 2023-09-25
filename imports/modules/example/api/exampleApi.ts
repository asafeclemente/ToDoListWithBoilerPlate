// region Imports
import { ProductBase } from '../../../api/productBase';
import { exampleSch, IExample } from './exampleSch';

class ExampleApi extends ProductBase<IExample> {
    constructor() {
        super('example', exampleSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });
    }

    mudarTituloEDescricao = (id, callback=()=>{}) => {
        console.log(id)
		this.callMethod('MudarTituloEDescricao', id, callback);
	}
}

export const exampleApi = new ExampleApi();
