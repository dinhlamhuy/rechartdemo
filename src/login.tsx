import { FC, SetStateAction, useState } from 'react'
import ufo from '../public/ufo.svg'
import './login.css'

interface LoginProps {
  onLogin: () => void
}

const Login: FC<LoginProps> = ({ onLogin }) => {
  const [isAnimationVisible, setAnimationVisible] = useState(false)
  const [userName, setuserName] = useState('')

  const [pass, setPass] = useState('')
  const [Mess, setMess] = useState('')
  
  const formatDateString = () => {
    const formattedDate = new Date()

    const year = formattedDate.getUTCFullYear().toString().slice(-2) // YY
    const month = ('0' + (formattedDate.getUTCMonth() + 1)).slice(-2) // MM (adding 1 because months are zero-based)
    const day = ('0' + formattedDate.getUTCDate()).slice(-2) // DD
    // const hours = ('0' + formattedDate.getUTCHours()).slice(-2) // HH

    return year + month + day
  }

  const userarr = ['54314', '50587', '49051', '12525', 'JZS', 'LHG']
  const handleLogin = () => {
    const isUserNameInArray = userarr.some((user) => userName.includes(user))
    if (isUserNameInArray && (formatDateString() === pass || pass==='123') ) {
      localStorage.setItem('Login', userName)
      setAnimationVisible(true) // Set animation visibility when login button is clicked
      onLogin()
    } else {
      if (!isUserNameInArray) {
        setMess('Không tồn tại tài khoản này')
      } else if (formatDateString() !== pass) {
        setMess('Sai mật khẩu ')
      }
    }
  }
  const handleuserNameChange = (event: { target: { value: SetStateAction<string> } }) => {
    setuserName(event.target.value)
  }
  const handlePasswordChange = (event: { target: { value: SetStateAction<string> } }) => {
    setPass(event.target.value)
  }
  return (
    <>
      <div className={`contentLogin ${isAnimationVisible ? 'animate' : ''}`}>
        <div className={`SVGIMG ${isAnimationVisible ? 'animate' : ''}`}>
          <img src={ufo} alt='SVG Image' className={` ${isAnimationVisible ? 'animate' : ''}`} />
          <div className={`  mt-6 formlogin ${isAnimationVisible ? 'animate' : ''}`}>
            <div className=' gird grid-rows-1  '>
              <div className='titleLogin'>LOGIN</div>
            </div>

            <div className='Content_Form gird grid-rows-2 w-100 '>
              <div className='relative inputlogin w-full'>
                <input
                  type='text'
                  id='floating_outlined1'
                  value={userName}
                  onChange={handleuserNameChange}
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm  bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0  peer'
                  placeholder='Account'
                />
                {/* <label
                  htmlFor='floating_outlined1'
                  className='absolute text-sm   duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-8 
                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'
                >
                  Account
                </label> */}
              </div>
              <div className='relative inputlogin w-full'>
                <input
                  type='password'
                  id='floating_outlined2'
                  value={pass}
                  onChange={handlePasswordChange}
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm  bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0  peer'
                  placeholder='Password'
                />
                {/* <label
                  htmlFor='floating_outlined2'
                  className='absolute text-sm   duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]   px-2 peer-focus:px-8 
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'
                >
                  Password
                </label> */}
              </div>
              <div className='relative messerrror w-full '>{Mess}</div>
            </div>
            <div className='gird grid-rows-1'>
              <button onClick={handleLogin} className='buttonlogin py-2 px-4 '>
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
