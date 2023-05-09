import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Stock Data</Link>
        </li>
        <li>
          <Link to="/close-price-chart">Close Price Chart</Link>
        </li>
        <li>
          <Link to="/volume-chart">Volume Chart</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
