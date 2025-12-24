import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.img}>
      <div className={styles.image6}>
        <div className={styles.logo}>
          <img src="../image/mj8br9e4-ljkqd99.svg" className={styles.union} />
          <img src="../image/mj8br9e4-vf7s7i1.svg" className={styles.text} />
        </div>
        <div className={styles.text2}>
          <p className={styles.yourPetSWorldMadeSim}>
            Your pet’s world,
            <br />
            made simple and caring
          </p>
          <p className={styles.createAFreeAccountTo}>
            Create a free account to keep health records in one place, find trusted
            services, and enjoy life with your furry friend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Component;
