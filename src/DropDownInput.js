import React from 'react';

const DropdownInput = ({
  label,
  value,
  onChange,
  options, // Expected to be an array of objects with 'value' and 'label' properties
  fullWidth = false,
}) => {
  const styles = {
    container: {
      marginBottom: '20px',
      width: fullWidth ? '100%' : 'auto',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '12px',
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      <select value={value} onChange={onChange} style={styles.select}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownInput;
