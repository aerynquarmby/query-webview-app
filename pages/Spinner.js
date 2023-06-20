import React from 'react';
import styles from './Spinner.module.css'; // Import CSS styles for the spinner

const Spinner = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinnerContainer}>
        <img 
          src="https://media.giphy.com/media/XH8aAiiVNuTaPVBLKd/giphy.gif" // Replace with your preferred spinner gif
          alt="Loading..."
          className={styles.spinner}
        />
      </div>
    </div>
  );
};

export default Spinner;
