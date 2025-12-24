import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.profileAbout}>
      <div className={styles.statusBarNavHeader}>
        <div className={styles.aIos}>
          <p className={styles.a941}>9:41</p>
          <div className={styles.pinRight}>
            <img
              src="../image/mjathr52-9tkuq8w.svg"
              className={styles.mobileSignal}
            />
            <img src="../image/mjathr52-iioy8ws.svg" className={styles.wifi} />
            <img src="../image/mjathr52-5cnbhtn.svg" className={styles.battery} />
          </div>
        </div>
        <div className={styles.iconDividerText}>
          <div className={styles.chevronLeft}>
            <img src="../image/mjathr52-go5eas3.svg" className={styles.box} />
          </div>
          <div className={styles.text}>
            <p className={styles.title}>Pet Profile</p>
            <p className={styles.body}>Maxi</p>
          </div>
        </div>
      </div>
      <div className={styles.content2}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.layout}>
              <div className={styles.contentTabsButton}>
                <p className={styles.text2}>About</p>
              </div>
              <p className={styles.text3}>Health</p>
              <p className={styles.text3}>Nutrition</p>
              <p className={styles.text3}>Activities</p>
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.profileImage}>
                <div className={styles.imageFrame}>
                  <div className={styles.ellipseOutline} />
                  <img
                    src="../image/mjathr59-agzl6h4.png"
                    className={styles.photoPlaceimageinsid}
                  />
                </div>
                <div className={styles.textContainer}>
                  <div className={styles.titleButton}>
                    <p className={styles.title2}>Maxi</p>
                    <div className={styles.primaryButton}>
                      <img
                        src="../image/mjathr52-gg43cav.svg"
                        className={styles.edit}
                      />
                    </div>
                  </div>
                  <div className={styles.body3}>
                    <p className={styles.body1}>Dog</p>
                    <div className={styles.body2Divider}>
                      <div className={styles.autoWrapper}>
                        <div className={styles.divider} />
                      </div>
                      <p className={styles.body2}>Border Collie</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.sectionContainer}>
                <div className={styles.textContainer2}>
                  <p className={styles.title3}>Appearance and distinctive signs</p>
                  <p className={styles.body4}>
                    Brown-Dark-White mix, with light eyebrows shape and a heart
                    shaped patch on left paw.
                  </p>
                </div>
                <div className={styles.infoContainer}>
                  <div className={styles.text4}>
                    <p className={styles.body5}>Gender</p>
                    <p className={styles.valueUnit}>Male</p>
                  </div>
                  <div className={styles.lineDivider} />
                  <div className={styles.text4}>
                    <p className={styles.body5}>Size</p>
                    <p className={styles.valueUnit}>Medium</p>
                  </div>
                  <div className={styles.lineDivider} />
                  <div className={styles.text4}>
                    <p className={styles.body5}>Weight</p>
                    <p className={styles.valueUnit}>22,2 kg</p>
                  </div>
                </div>
              </div>
              <div className={styles.cardsContainer}>
                <div className={styles.cardHorizontalV2}>
                  <div className={styles.icon52X5224X24}>
                    <div className={styles.icon}>
                      <img
                        src="../image/mjathr52-jog0uc0.svg"
                        className={styles.box}
                      />
                    </div>
                    <img
                      src="../image/mjathr53-19uhgcv.svg"
                      className={styles.bg}
                    />
                  </div>
                  <div className={styles.titleSubtitle}>
                    <p className={styles.text5}>3 nov 2019</p>
                    <p className={styles.text6}>Birthday</p>
                  </div>
                  <div className={styles.textUnitsFrame}>
                    <img
                      src="https://via.placeholder.com/1x24"
                      className={styles.lineDivider2}
                    />
                    <div className={styles.details}>
                      <p className={styles.title4}>3</p>
                      <p className={styles.body6}>y.o</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <div className={styles.bt}>
              <div className={styles.button2}>
                <p className={styles.button}>Edit</p>
              </div>
            </div>
            <div className={styles.homeIndicator2}>
              <div className={styles.homeIndicator} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
