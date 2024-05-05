import React from 'react'
import { Link } from 'react-router-dom'
import './Navigation.css'
import { useSelector,useDispatch } from 'react-redux'

import {resetState} from '../redux/slices/userLoginSlice'

export default function Navigation() {

  let {isPending,currentUser,errStatus,errMessage,loginStatus}=useSelector(state=>state.userLogin)
  const dispatch=useDispatch();
  function logout(){
    sessionStorage.removeItem('token');
    //reset the state
    let actionObj=resetState();
    //dispatch this action object
    dispatch(actionObj);
  }


  return (
    <ul className="nav bg-dark justify-content-end">
      {
        loginStatus==false?<>(
          <li className="nav-item">
        <Link className="nav-link text-info" to=" ">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-info" to="Login">
          Signin
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-info" to="Register">
          Signup
        </Link>
      </li>
      ) </>:(
        <li className="nav-item">
            <Link className='nav-link' to="login" onClick={logout}>
        <span className="lead  fs-4 me-3 fw-1"  style={{ color: "#994570" ,fontWeight:'bold',fontSize:'1.3rem',textTransform:'capitalize',fontFamily:'fantasy'}}>{currentUser.username}
          <sup style={{color:'var(--dark-green)',fontSize:'1rem'}}>({currentUser.userType})</sup>
        </span>
        LOG OUT</Link>
      </li>
      )
      }
    </ul>
  );
}
