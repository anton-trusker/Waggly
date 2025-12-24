import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.desktop}>
      <div className={styles.logo}>
        <img src="../image/mj8b7au4-n1evaay.svg" className={styles.union} />
        <img src="../image/mj8b7au4-nwbxlxg.svg" className={styles.text} />
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.text2}>
            <p className={styles.welcomeBack}>Welcome back</p>
            <p className={styles.signInToContinueMana}>
              Sign in to continue managing your pets
            </p>
          </div>
          <div className={styles.list}>
            <div className={styles.input}>
              <p className={styles.email}>Email</p>
              <div className={styles.frame2131329763}>
                <div className={styles.mail}>
                  <img src="../image/mj8b7au4-62lvtsk.svg" className={styles.box} />
                </div>
                <p className={styles.hiPawzlyCom}>hi@pawzly.com</p>
              </div>
            </div>
            <div className={styles.input2}>
              <div className={styles.frame2131329797}>
                <p className={styles.password}>Password</p>
                <p className={styles.forgot}>Forgot?</p>
              </div>
              <div className={styles.frame2131329796}>
                <div className={styles.frame21313297632}>
                  <div className={styles.mail}>
                    <img
                      src="../image/mj8b7au4-0jrzgac.svg"
                      className={styles.box}
                    />
                  </div>
                  <p className={styles.hiPawzlyCom}>••••••</p>
                </div>
                <div className={styles.mail}>
                  <img src="../image/mj8b7au4-d4hk4ls.svg" className={styles.box} />
                </div>
              </div>
            </div>
            <div className={styles.frame2131329798}>
              <div className={styles.frame98}>
                <p className={styles.continue}>Continue&nbsp;</p>
                <img src="../image/mj8b7au4-4zd3530.svg" className={styles.box} />
              </div>
              <p className={styles.byContinuingYouAgree3}>
                <span className={styles.byContinuingYouAgree}>
                  By continuing, you agree to our&nbsp;
                </span>
                <span className={styles.byContinuingYouAgree2}>Terms</span>
                <span className={styles.byContinuingYouAgree}>&nbsp;and&nbsp;</span>
                <span className={styles.byContinuingYouAgree2}>Privacy Policy</span>
                <span className={styles.byContinuingYouAgree}>.</span>
              </p>
              <p className={styles.byContinuingYouAgree3}>
                <span className={styles.byContinuingYouAgree}>
                  Don't have an account?&nbsp;
                </span>
                <span className={styles.byContinuingYouAgree2}>Sign up</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.img}>
          <div className={styles.image6}>
            <div className={styles.logo2}>
              <img src="../image/mj8b7au4-8o70xu1.svg" className={styles.union} />
              <img src="../image/mj8b7au4-6t57zj4.svg" className={styles.text} />
            </div>
            <div className={styles.text3}>
              <p className={styles.yourPetSWorldMadeSim}>
                Your pet’s world,
                <br />
                made simple and caring
              </p>
              <p className={styles.createAFreeAccountTo}>
                Create a free account to keep health records in one place, find
                trusted services, and enjoy life with your furry friend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
