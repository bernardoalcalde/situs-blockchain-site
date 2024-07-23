import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

const NavigationBar = () => {
  return (
    <header id="page-topbar">
      {(
        <>
          <div className="navbar-header">
            <div className="d-flex justify-content-between p-3 align-items-center" style={{boxShadow: "1px 1px 3px 1px grey"}}>
              <div className="navbar-brand-box">
                <Link to="/" className="">
                  <span className="logo-lg">
                    <img src={logo} alt="" height="36" />
                  </span>
                </Link>
              </div>
              <Button
                color="none"
                type="button"
                size="sm"
                onClick={() => console.log(`clicou`)}
                className="px-3 font-size-24 d-lg-none header-item hamburguer-menu-icon"
                data-toggle="collapse"
                data-target="#topnav-menu-content"
              >
                <i className="ri-menu-2-line align-middle" />
              </Button>
              <Link className="d-flex align-items-center justify-content-center p-3 d-xs-none header-item font-size-22" to="/">
                Login
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default NavigationBar;
