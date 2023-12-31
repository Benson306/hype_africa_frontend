import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../utils/AuthContext';

function Login() {
    const [email,setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const { id, addCompanyId, addBrandId } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();

        if(email === null || password === null){
            toast.error('All Fields Must Be Filled', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/company_login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(response => response.json())
        .then((response)=>{

            if(response.status === "success"){
                toast.success('Success!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                    });

                    fetch(`${process.env.REACT_APP_API_URL}/all_brands/${response.uid}`)
                    .then((newResponse)=> newResponse.json())
                    .then(newResponse => {

                        if(newResponse.length < 1){
                            setTimeout(() => {
                                navigate('/complete_profile');
                                addCompanyId(response.uid);
                              }, 1500);
                        }else{
                            addBrandId(newResponse[0]._id) 
                            addCompanyId(response.uid);

                            if(!response.isComplete){
                                setTimeout(() => {
                                    navigate('/complete_profile');
                                  }, 2000);
                            }else if(response.isComplete && response.isApproved == 0){ //pending approval
                                setTimeout(() => {
                                    navigate('/approval_pending');
                                  }, 2000);
                            }else if(response.isComplete && response.isApproved == 1){ //approved
                                setTimeout(() => {
                                    navigate('/all_campaigns');
                                  }, 2000);
                            }else if(response.isComplete && response.isApproved == 2){ //rejected approval
                                setTimeout(() => {
                                    navigate('/rejected_application');
                                  }, 2000);
                            }
                        }
                       
                    })
                    .catch(err => {
                        console.log(err)
                    })

            }else if(response === "Failed"){
                toast.error('Failed. Check Your Credentials!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            }
            
        })
        .catch(err =>{
            toast.error('Failed. Server Error!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        })

    }

  return (
    <div className='w-full min-h-screen bg-neutral-300'>
        <ToastContainer />
        <div class="flex flex-col items-center justify-center px-2 py-8 mx-auto md:h-screen lg:py-0">
            <div class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                Hype Africa    
            </div>
            <div class="rounded-lg shadow dark:border md:mt-0  xl:p-0 bg-gray-800 border-gray-700 w-5/6 lg:w-2/6">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
                            <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" 
                            onChange={(e)=> setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" 
                            onChange={(e)=> setPassword(e.target.value)}
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium text-sky-600 hover:underline dark:text-sky-500">Forgot password?</a>
                        </div>

                        <button  onClick={(e)=>handleSubmit(e)} className="w-full text-white bg-sky-700 hover:bg-sky-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 focus:ring-primary-800 mt-5"
                            >Sign in
                        </button>
                        <p class="text-sm  text-gray-100">
                            Don’t have an account yet? <Link to="/company_signup" className="font-medium hover:underline text-sky-500"> Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </div>
          )
}

export default Login
