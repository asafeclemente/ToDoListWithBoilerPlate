import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';
import { PageLayout } from '../../../../ui/layouts/PageLayout';
import { IToDos } from '../../api/toDosSch';
import { IDefaultContainerProps, IDefaultDetailProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';

interface IToDosDetail extends IDefaultDetailProps {
	toDosDoc: IToDos;
	save: (doc: IToDos, _callback?: any) => void;
}

const ToDosDetail = (props: IToDosDetail) => {
	const { isPrintView, screenState, loading, toDosDoc, save, navigate } = props;

	const theme = useTheme();

	const handleSubmit = (doc: IToDos) => {
		save(doc);
	};

	return (
		<PageLayout
			key={'TaskPageLayoutDetailKEY'}
			title={
				screenState === 'view' ? 'Visualizar exemplo' : screenState === 'edit' ? 'Editar Exemplo' : 'Criar exemplo'
			}
			onBack={() => navigate('/toDos')}
			actions={[
				!isPrintView ? (
					<span
						key={'TaskDetail-spanPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/toDos/printview/${toDosDoc._id}`);
						}}>
						<Print key={'TaskDetail-spanPrintKEY'} />
					</span>
				) : (
					<span
						key={'TaskDetail-spanNotPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/toDos/view/${toDosDoc._id}`);
						}}>
						<Close key={'TaskDetail-spanCloseKEY'} />
					</span>
				)
			]}>
			<SimpleForm
				key={'TaskDetail-SimpleFormKEY'}
				mode={screenState}
				schema={toDosApi.getSchema()}
				doc={toDosDoc}
				onSubmit={handleSubmit}
				loading={loading}>

				<FormGroup key={'fieldsOne'}>
					<TextField key={'f1-tituloKEY'} placeholder="Titulo" name="title" />
					<TextField key={'f1-descricaoKEY'} placeholder="Descrição" name="description" />
				</FormGroup>
				<FormGroup key={'fieldsTwo'}>
					<SelectField key={'f2-tipoKEY'} placeholder="Selecione um tipo" name="type" />
				</FormGroup>


				{screenState !== 'create' &&
				<RadioButtonField
					key={'TaskDetail-RadioKEY'}
					placeholder="Opções da Tarefa"
					name="statusRadio"
					options={[
						{ value: 'todo', label: 'Não concluída' },
						{ value: 'done', label: 'Concluída' }
					]}
				/>
				}

				<div
					key={'Buttons'}
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'left',
						paddingTop: 20,
						paddingBottom: 20
					}}>
					{!isPrintView ? (
						<Button
							key={'b1'}
							style={{ marginRight: 10 }}
							onClick={
								screenState === 'edit'
									? () => navigate(`/toDos/view/${toDosDoc._id}`)
									: () => navigate(`/toDos/list`)
							}
							color={'secondary'}
							variant="contained">
							{screenState === 'view' ? 'Voltar' : 'Cancelar'}
						</Button>
					) : null}

					{!isPrintView && screenState === 'view' ? (
						<Button
							key={'b2'}
							onClick={() => {
								navigate(`/toDos/edit/${toDosDoc._id}`);
							}}
							color={'primary'}
							variant="contained">
							{'Editar'}
						</Button>
					) : null}
					{!isPrintView && screenState !== 'view' ? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit">
							{'Salvar'}
						</Button>
					) : null}
				</div>
			</SimpleForm>
		</PageLayout>
	);
};

interface IToDosDetailContainer extends IDefaultContainerProps {}

export const ToDosDetailContainer = withTracker((props: IToDosDetailContainer) => {
	const { screenState, id, navigate, showNotification } = props;

	const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
	let toDosDoc = id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};

	return {
		screenState,
		toDosDoc,
		save: (doc: IToDos, _callback: () => void) => {
			const selectedAction = screenState === 'create' ? 'insert' : 'update';
			toDosApi[selectedAction](doc, (e: IMeteorError, r: string) => {
				if (!e) {
					navigate(`/toDos`);
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
						});
				} else {
					console.log('Error:', e);
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Operação não realizada!',
							description: `Erro ao realizar a operação: ${e.reason}`
						});
				}
			});
		}
	};
})(showLoading(ToDosDetail));
