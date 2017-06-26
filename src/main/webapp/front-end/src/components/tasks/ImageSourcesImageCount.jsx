import React from 'react';

const ImageSourcesImageCount = ({ data, match }) => {
  return (
    <div>
        <b>Images: </b> {data.getIn(['details', 'imageCount'])}
    </div>)
  ;
};

export default ImageSourcesImageCount;
