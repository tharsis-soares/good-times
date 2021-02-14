import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Container, Typography } from '@material-ui/core'
import { GoogleLogin } from 'react-google-login'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Icon from './icon'

import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import useStyles from './styles'
import Input from './Input'
import { signin, signup } from '../../actions/auth'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}
const Auth = () => {
    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const dispatch = useDispatch()
    const history = useHistory()
    
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        setShowPassword(false)
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj
        const token = res?.tokenId

        try {
            dispatch({ type: 'AUTH', data: { result, token }})
            history.push('/')
            
        } catch (error) {
            console.log(error)
        }
    } 
    
    const googleFailure = (error) => {
        console.log(error)
        console.log('conexao com o google nao realizada')
    }
    
    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />               
                </Avatar>
                <Typography variant='h5'>{isSignup ? 'Cadastro' : 'Login'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name='firstName' label='Nome' handleChange={handleChange} autofocus half />
                                    <Input name='lastName' label='Sobrenome' handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name='email' label='endereço de email' handleChange={handleChange} type='email' />
                        <Input name='password' label='senha' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name='confirmPassword' label='Repita a senha' handleChange={handleChange} type='password' />}
                    </Grid>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Cadastre-se' : 'Login'}
                    </Button>
                    <GoogleLogin
                        clientId='963547011297-b5ade5i3kn18a9l4op8u2juc4mhcjpii.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button 
                            className={classes.googleButton}
                            color='primary'
                            fullWidth
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            startIcon={<Icon />}
                            variant='contained'
                            >
                                Google Login
                            </Button>
                        )}
                        
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy='single_host_origin'

                    />
                    <Grid container justify='flex-end'>
                        <Grid>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Já tem cadastro? Login' : 'Não tem cadastro? Registre-se'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth 