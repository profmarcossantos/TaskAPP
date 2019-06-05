import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import firebase from 'firebase'
import { Alert, CheckBox, AsyncStorage } from 'react-native';


export default class Login extends Component {
    static navigationOptions = {
        title: 'Tasks do Prof. Marcos',
        headerTintColor: '#fff',
    };

    async componentDidMount() {
        let login = await AsyncStorage.getItem('login')
        let senha = await AsyncStorage.getItem('senha')
        if (login == null) {
            await this.setState({ carregando: false })
        } else if (login != null && senha == null) {
            await this.setState({ lembreme: true })
            await this.setState({ login })
            await this.setState({ carregando: false })
        } else if (login != null && senha != null) {
            await this.setState({ manterme: true })
            await this.setState({ login, senha })
            this.validarLogin()
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            senha: '',
            erro: '',
            loading: false,
            lembreme: false,
            manterme: false,
            carregando: true
        };
        var firebaseConfig = {
            apiKey: "*************************",
            authDomain: "*************************",
            databaseURL: "*************************",
            projectId: "*************************",
            storageBucket: "*************************",
            messagingSenderId: "*************************",
            appId: "*************************"
        };
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    renderLoading() {
        let { loading } = this.state
        if (loading == true) {
            return <ActivityIndicator size="small" color="#0000ff" />
        } else {
            return null
        }

    }

    validarLogin() {
        this.setState({ loading: true })
        firebase
            .auth()
            .signInWithEmailAndPassword(
                this.state.login, this.state.senha
            )
            .then(
                async retorno => {
                    let { lembreme } = this.state
                    let { manterme } = this.state
                    if (lembreme == true) {
                        await AsyncStorage.setItem('login', this.state.login);
                    } else {
                        await AsyncStorage.removeItem('login')
                    }
                    if (manterme == true) {
                        await AsyncStorage.setItem('login', this.state.login);
                        await AsyncStorage.setItem('senha', this.state.senha);
                    } else {
                        await AsyncStorage.removeItem('senha')
                    }


                    this.props.navigation.replace('Menu')
                }
            )
            .catch(
                erro => {
                    this.setState({ erro: erro.message })
                    this.setState({ loading: false })
                    this.setState({ carregando: false })
                }
            )
    }

    render() {
        if (this.state.carregando == true) {
            return (
                <View style={styles.container}>
                    <View style={styles.msgLoading}>
                        <Text> carregando... </Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </View>
            )
        } else {
            return (

                <View style={styles.container}>

                    <View style={styles.msg}>
                        <Text> Informe suas credenciais abaixo: </Text>
                        {this.renderLoading()}
                        <Text style={styles.msgError}> {this.state.erro} </Text>
                    </View>

                    <View style={styles.caixaTexto}>
                        <TextInput
                            value={this.state.login}
                            onChangeText={login => {
                                this.setState({ login })
                            }}
                            placeholder="Informe seu e-mail"
                        />

                    </View>
                    <View style={styles.caixaTexto}>
                        <TextInput
                            value={this.state.senha}
                            onChangeText={senha => {
                                this.setState({ senha })
                            }}
                            placeholder="Password"
                            secureTextEntry
                        />

                    </View>
                    <View style={styles.caixaBotoes}>
                        <CheckBox
                            value={this.state.lembreme}
                            onValueChange={async () => {
                                await this.setState({ lembreme: !this.state.lembreme })
                                let { lembreme } = this.state
                                if (lembreme == false) {
                                    await AsyncStorage.removeItem('login')
                                }
                            }}
                        />
                        <Text>Lembre-me</Text>
                        <CheckBox
                            value={this.state.manterme}
                            onValueChange={async () => {
                                await this.setState({ manterme: !this.state.manterme })
                                let { manterme } = this.state
                                if (manterme == false) {
                                    await AsyncStorage.removeItem('login')
                                    await AsyncStorage.removeItem('senha')
                                }
                            }}
                        />
                        <Text>Manter-me Conectado</Text>
                    </View>
                    <View style={styles.caixaBotoes}>
                        <View style={styles.botoes}>
                            <Button
                                title="Entrar"
                                onPress={() => this.validarLogin()}
                                color="blue"
                            />
                        </View>
                        <View style={styles.botoes}>
                            <Button
                                title="Novo Registro"
                                onPress={() => {
                                    Alert.alert(
                                        'Novo Usuário!',
                                        'Deseja criar um cadastro conosco?',
                                        [{
                                            text: 'Não',
                                            style: 'cancel',
                                            onPress: () => {},
                                        }, {
                                            text: 'Sim',
                                            onPress: () => {
                                                firebase.auth().createUserWithEmailAndPassword(
                                                    this.state.login, this.state.senha)
                                                    .then(() => {
                                                        this.setState({
                                                            erro: 'Registro Efetuado com Sucesso. Clique em Entrar.'
                                                        })
                                                    })
                                                    .catch(erro => {
                                                        this.setState({ erro: erro.message })
                                                    })
                                            }
                                        }],
                                        { cancelable: false }
                                    )
                                }}
                                color="blue"
                            />
                        </View>
                        <View style={styles.botoes}>
                            <Button
                                title="Cancelar"
                                onPress={() => {

                                }}
                                color="blue"
                            />
                        </View>
                    </View>
                </View>
            );
        }


    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    msg: {
        alignItems: 'center',
        marginTop: 100,
    },
    msgLoading: {
        alignItems: 'center',
        marginTop: 250,
    },
    caixaTexto: {
        marginLeft: 30,
        marginTop: 30,
        alignItems: 'center',
        borderWidth: 1,
        width: "80%",
        borderBottomColor: "gray",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderTopColor: "white",
    },
    caixaBotoes: {
        marginTop: 10,
        marginLeft: 30,
        alignItems: "center",
        flexDirection: "row",
    },
    botoes: {
        alignItems: "center",
        marginLeft: 3
    },
    msgError: {
        width: "70%",
        color: 'red'
    }


});