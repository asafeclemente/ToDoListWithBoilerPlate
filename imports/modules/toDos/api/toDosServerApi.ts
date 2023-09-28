// region Imports
import { Recurso } from '../config/Recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { getUser } from '/imports/libs/getUser';
// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
    constructor() {
        super('toDos', toDosSch, {
            resources: Recurso,
        });

        const self = this;

        this.addTransformedPublication(
            'toDosList',
            (filter = {}, pagination = {}) => {
                return this.defaultListCollectionPublication({
                    $or: [
                      { isPrivate: false, ...filter},   // Tarefas não privadas (private não igual a 1)
                      { createdby: getUser()._id, ...filter} // Tarefas do usuário atual
                    ]
                  }, {
                    projection: { image: 1, title: 1, description: 1, createdby: 1 },
                    ...pagination
                });
            },
            (doc: IToDos & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addTransformedPublication(
            'toDosListRecent',
            (filter = {}) => {
                return this.defaultListCollectionPublication(filter, {
                    projection: { title: 1, description: 1, createdby: 1, statusRadio: 1 },
                    sort: { createdAt: -1, lastupdate: -1 },
                    limit: 5,
                });
            },
            (doc: IToDos & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addPublication('toDosDetail', (filter = {}) => {
            return this.defaultDetailCollectionPublication(filter, {});
        });

        this.addRestEndpoint(
            'view',
            (params, options) => {
                console.log('Params', params);
                console.log('options.headers', options.headers);
                return { status: 'ok' };
            },
            ['post']
        );

        this.addRestEndpoint(
            'view/:toDosId',
            (params, options) => {
                console.log('Rest', params);
                if (params.toDosId) {
                    return self
                        .defaultCollectionPublication({
                            _id: params.toDosId,
                        })
                        .fetch();
                } else {
                    return { ...params };
                }
            },
            ['get'],
            {
                //authFunction: (_h, _p) => _p.toDosId === 'flkdsajflkasdjflsa',
            }
        );
    }
}

export const toDosServerApi = new ToDosServerApi();
