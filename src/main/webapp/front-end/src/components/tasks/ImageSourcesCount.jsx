import React from 'react';

const ImageSourcesCount = ({ data, match }) => {
  return (
    <div>
        <b>Image Sources: </b> {data.get('imageSources').size}
    </div>)
  ;
};

export default ImageSourcesCount;
