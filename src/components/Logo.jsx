// import React from 'react'

// function Logo({width = '100px'}) {
//   return (
//     <div>Logo</div> 
//   )
// }

// export default Logo;


import React from 'react';

function Logo({ width = '20px', logoUrl = 'https://www.shutterstock.com/image-vector/vector-black-lotus-icon-on-260nw-406984156.jpg' }) {
  return (
    <div>
      <img src={logoUrl}  style={{ width }} />
    </div>
  );
}

export default Logo;



