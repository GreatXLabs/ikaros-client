import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Logo } from "../components/Logo"
import './Login.css'
import { Input } from '@chakra-ui/react'

export function Login() {
  return (
    <>
      <Background />
      <div className="login-wrapper">
            <div className="login-panel">
                <div className="logo-container">
                    <Logo />
                </div>

                <form action="">
                    <p>Usuario</p>
                    <Input placeholder='ingrese aqui' size='md' />
                    <p>Contraseña</p>
                    <Input placeholder='ingrese aqui' size='md' />

                    <button id='login-button' type="submit">Iniciar sesión</button>


                </form>
                

            </div>

      </div>
      

    </>
  )
}