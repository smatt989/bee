import React from 'react';
import text from '../../constants/text';

const EmptyTableMessage = (props) => {
  const message = props.message || text.empty_table_none_found;
  return (
      <div >
        <h4 className='text-muted text-center'>{message}</h4>
      </div>
  );
}
 export default EmptyTableMessage;
