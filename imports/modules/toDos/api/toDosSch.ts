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
    // check: {
    //     type: Object,
    //     label: 'check box',
    //     defaultValue: {},
    //     optional: true,
    //     options: ['Todo', 'Doing', 'Done'],
    // },
    type: {
        type: String,
        label: 'Tipo',
        defaultValue: '',
        optional: false,
        options: [
            { value: 'privada', label: 'Privada' },
            { value: 'publica', label: 'Pública' },
        ],
    },
    statusRadio: {
        type: String,
        label: 'Status RadioButton',
        defaultValue: '',
        optional: true,
        radiosList: ['Todo', 'Doing', 'Done'],
    },
};

export interface IToDos extends IDoc {
    title: string;
    description: string;
    statusRadio: object;
}
