import React from 'react';
import Modules from '../../../modules';
import _ from 'lodash';
import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';
import { useTracker } from 'meteor/react-meteor-data';
import { isMobile } from '/imports/libs/deviceVerify';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import { ReactiveVar } from 'meteor/reactive-var';

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
	pageProperties: {
		currentPage: 1,
		pageSize: 5
	},
	sortProperties: { field: 'createdat', sortAscending: false },
	filter: {},
	searchBy: null,
	viewComplexTable: false
})

const Home = () => {

	const navigate = useNavigate();

	//Reactive Search/Filter
	const config = subscribeConfig.get();
	const sort = {
		[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1
	};

	//Subscribe parameters
	const filter = { ...config.filter };
	// const filter = filtroPag;
	const limit = config.pageProperties.pageSize;
	const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

	// //Collection Subscribe
	// const subHandle = toDosApi.subscribe('toDosListRecent');
	// var loading = !!subHandle && !subHandle.ready()
	// const toDoss = subHandle?.ready() ? toDosApi.find(filter, { sort }).fetch() : [];
	// console.log(toDoss)

	const { toDoss, loading } = useTracker(() => {
		const noDataAvailable = { toDoss: [] };
	    const subHandle = toDosApi.subscribe('toDosListRecent');

		if (!subHandle?.ready()) {
			return { ...noDataAvailable, loading: true };
		}

	    const toDoss = toDosApi.find(filter, { sort }).fetch()
		return { toDoss: toDoss, loading: false };
	});

	console.log(toDoss)

	return (
		<>
			<Container>
				<h1>Atividades recentes </h1>

				{!isMobile && (
				<ComplexTable
					data={toDoss}
					schema={_.pick(
						{
							...toDosApi.schema,
							nomeUsuario: { type: String, label: 'Criado por' }
						},
						['title', 'description', 'statusRadio', 'nomeUsuario']
					)}
					loading={loading}
				/>
			)}

				<Button
					variant={'outlined'}
					sx={{
						color: appStyle.secondary,
						mt: 2
					}}
					key={Modules.getModuleToDo()?.path}
					onClick={() => navigate(Modules.getModuleToDo()?.path as string)}>
					{Modules.getModuleToDo()?.name}
				</Button>
			</Container>
		</>
	)
};

export default Home;
