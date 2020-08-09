import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function TeacherList() {

	const [teachers, setTeachers] = useState([]);
	const [isFilterVisible, setIsFilterVisible] = useState(false);
	const [favorites, setFavorites] = useState<number[]>([]);

	function handlerToggleFiltersVisible() {
		setIsFilterVisible(!isFilterVisible);
	}

	const [subject, setSubject] = useState('');
	const [week_day, setWeekday] = useState('');
	const [time, setTime] = useState('');

	function loadFavorites(){
		AsyncStorage.getItem('favorites').then(response => {
			if(response) {
				const favoritedTeachers = JSON.parse(response);
				const favoritedTeachersIds = favoritedTeachers.map((teacher : Teacher) => {
					return teacher.id;
				});

				setFavorites(favoritedTeachersIds);
			}
		});
	};

	async function handleFiltersSubmit() {
		loadFavorites();
		const response = await api.get('classes', {
			params : {
				subject,
				week_day,
				time
			}
		});
		setIsFilterVisible(false);
		
		setTeachers(response.data);
	}

	return (
		<View >
			<PageHeader 
				title='Proffys disponíveis' 
				headerRight={( 
					<BorderlessButton onPress={handlerToggleFiltersVisible} >
						<Feather name='filter' size={20} color='#FFF' />
					</BorderlessButton> 
				)}
			>
				{ isFilterVisible && (
					<View style={ styles.searchForm } >
						<Text style={ styles.label }>Matéria</Text>
						<TextInput 
							style={ styles.input }
							placeholder="Qual a matéria?"
							value={ subject }
							onChangeText={text => setSubject(text)}
							placeholderTextColor='#C1BCCC'
						/>

						<View style={ styles.inputGroup }>
							<View style={ styles.inputBlock }>
								<Text style={ styles.label }>Dia da semana</Text>
								<TextInput 
									style={ styles.input }
									placeholder="Qual o dia?"
									value={ week_day }
									onChangeText={text => setWeekday(text)}
									placeholderTextColor='#C1BCCC'
								/>	
							</View>

							<View style={ styles.inputBlock }>
								<Text style={ styles.label }>Horário</Text>
								<TextInput 
									style={ styles.input }
									placeholder="Qual o horário?"
									value={ time }
									onChangeText={text => setTime(text)}
									placeholderTextColor='#C1BCCC'
								/>	
							</View>
						</View>
						<RectButton style={ styles.submitButton } onPress={ handleFiltersSubmit }>
							<Text style={ styles.submitButtonText }>Filtrar</Text>
						</RectButton>
					</View>
				)}
			</PageHeader>

			<ScrollView 
				style={ styles.teacherList }
				contentContainerStyle={{
					paddingHorizontal : 16,
					paddingBottom : 16
				}}
			>
				{teachers.map((teacher : Teacher) => {
					return (
						<TeacherItem 
							key={teacher.id} 
							teacher={teacher} 
							favorited={favorites.includes(teacher.id)}
						/>
					);
				})}
			</ScrollView>
		</View>
	);
}

export default TeacherList;