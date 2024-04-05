import React from 'react';

const TextInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  fullWidth = false,
  margin = 'normal',
  variant = 'filled',
  endAdornment = null,
}) => {
  // Styles can be adapted or extended as needed
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: margin === 'normal' ? '20px' : '10px',
      width: fullWidth ? '56.3%' : undefined,
      position: 'absolute',
      left: -1600,
      overflow: 'hidden',
      marginLeft: 10,
      
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      border: variant === 'outlined' ? '1px solid #ced4da' : undefined,
      borderRadius: '4px',
      padding: '10px',
      borderWidth: 1,
      borderColor: '#ced4da',
      borderStyle: 'solid',
    },
    input: {
      border: 'none',
      outline: 'none',
      flex: 1,
      fontSize: '16px',
      padding: variant === 'outlined' ? '10px' : '0',
    },
    label: {
      marginBottom: '5px',
      fontSize: '12px',
      marginTop: '20px'
    },
    adornment: {
      marginLeft: '8px',
    },
  };

  return (
    <div className='capture-section' style={styles.container}>
      {label && <label style={styles.label}><strong>{label}</strong></label>}
      <div style={styles.inputContainer}>
        <input
          readOnly
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
        />
        {endAdornment && <div style={styles.adornment}>{endAdornment}</div>}
      </div>
    </div>
  );
};

export default TextInput;