import { IDoc } from '/imports/typings/IDoc';

export const toDosSch = {
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    isPrivate: {
        type: Boolean,
        label: 'Tarefa privada',
        defaultValue: true,
        optional: false,
    },

    statusRadio: {
        type: String,
        label: 'Status',
        defaultValue: 'todo',
        optional: true,
        radiosList: ['Todo', 'Done'],
    },
};

export interface IToDos extends IDoc {
    title: string;
    description: string;
    statusRadio: object;
}
