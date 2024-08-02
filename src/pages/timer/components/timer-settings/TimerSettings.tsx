import { FC, useEffect, useState } from 'react';

import classes from './TimerSettings.module.scss';

import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import backButton from '../../../../assets/icons/back-btn.svg';

const TimerSettings: FC = () => {
  const [flowDuration, setFlowDuration] = useState<number>(0);
  const [breakDuration, setBreakDuration] = useState<number>(0);
  const [numSessions, setNumSessions] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const firestore = getFirestore();

  // useEffect(() => {
  // 	const fetchTimerSettings = async () => {
  // 		try {
  // 			const timerSettingsCollectionRef = collection(
  // 				firestore,
  // 				'timer-settings'
  // 			)
  // 			const timerSettingsSnapshot = await getDocs(timerSettingsCollectionRef)
  // 			const timerSettingsData = timerSettingsSnapshot.docs[0].data()
  // 			setFlowDuration(timerSettingsData.flowDuration)
  // 			setBreakDuration(timerSettingsData.breakDuration)
  // 			setNumSessions(timerSettingsData.numSessions)
  // 		} catch (error) {
  // 			console.error(
  // 				'Something went wrong while fetching timer settings:',
  // 				error
  // 			)
  // 		}
  // 	}

  // 	fetchTimerSettings()
  // }, []) эффект изначальный для получения настроек таймера в форму

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTimerSettings = async () => {
      if (userId) {
        try {
          const timerSettingsDocRef = doc(firestore, 'timer-settings', `settings-for-${userId}`);
          const timerSettingsDocSnap = await getDoc(timerSettingsDocRef);
          if (timerSettingsDocSnap.exists()) {
            const timerSettingsData = timerSettingsDocSnap.data();
            setFlowDuration(timerSettingsData.flowDuration);
            setBreakDuration(timerSettingsData.breakDuration);
            setNumSessions(timerSettingsData.numSessions);
          }
        } catch (error) {
          console.error('Something went wrong while fetching timer settings:', error);
        }
      }
    };

    fetchTimerSettings();
  }, [userId]);

  // const updateTimerSettings = async () => {
  // 	try {
  // 		const timerSettingsDocRef = doc(firestore, 'timer-settings', 'settings')
  // 		await setDoc(timerSettingsDocRef, {
  // 			flowDuration,
  // 			breakDuration,
  // 			numSessions,
  // 		})
  // 		console.log('Timer settings updated successfully')
  // 	} catch (error) {
  // 		console.error('Error updating timer settings:', error)
  // 	}
  // }

  const updateTimerSettings = async () => {
    try {
      if (userId) {
        const timerSettingsDocRef = doc(firestore, 'timer-settings', `settings-for-${userId}`);
        await setDoc(timerSettingsDocRef, {
          flowDuration,
          breakDuration,
          numSessions,
        });
        console.log('Timer settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating timer settings:', error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Link to={'/timer'} className={classes.backButton}>
        <img src={backButton} alt='back' />
      </Link>
      <div className={classes.inner}>
        <form className={classes.settingsForm} onBlur={updateTimerSettings}>
          <label>
            <span className={classes.inputLabel}>Flow duration</span>
            <input
              className={classes.input}
              type='number'
              value={flowDuration}
              onChange={(e) => setFlowDuration(parseInt(e.target.value))}
            />
          </label>
          <label>
            <span className={classes.inputLabel}>Break duration</span>
            <input
              className={classes.input}
              type='number'
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
            />
          </label>
          <label>
            <span className={classes.inputLabel}>Number of sessions</span>
            <input className={classes.input} type='number' value={numSessions} onChange={(e) => setNumSessions(parseInt(e.target.value))} />
          </label>
        </form>
      </div>
    </div>
  );
};

export default TimerSettings;
