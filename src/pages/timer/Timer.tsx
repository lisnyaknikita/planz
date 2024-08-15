// import { FC, useEffect, useState } from 'react';

// import classes from './Timer.module.scss';

// import { getAuth } from 'firebase/auth';
// import { doc, getDoc, getFirestore } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import pauseButton from '../../assets/icons/pause.svg';
// import playButton from '../../assets/icons/play.svg';
// import timerButton from '../../assets/icons/timer.svg';
// import timerSound from '../../assets/timer-sound.mp3';

// const TimerPage: FC = () => {
//   const [flowDuration, setFlowDuration] = useState<number>(0);
//   const [breakDuration, setBreakDuration] = useState<number>(0);
//   const [numSessions, setNumSessions] = useState<number>(0);
//   const [timerRunning, setTimerRunning] = useState<boolean>(false);
//   const [timerSeconds, setTimerSeconds] = useState<number>(0);
//   const [currentPhase, setCurrentPhase] = useState<'flow' | 'break'>('flow');
//   const [completedSessions, setCompletedSessions] = useState<number>(0);
//   const [userId, setUserId] = useState<string | null>(null);

//   const firestore = getFirestore();
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUserId(user.uid);
//       } else {
//         setUserId(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchTimerSettings = async () => {
//       if (userId) {
//         try {
//           const timerSettingsDocRef = doc(firestore, 'timer-settings', `settings-for-${userId}`);
//           const timerSettingsDoc = await getDoc(timerSettingsDocRef);
//           if (timerSettingsDoc.exists()) {
//             const {
//               flowDuration: flow,
//               breakDuration: breakDur,
//               numSessions: sessions,
//             } = timerSettingsDoc.data() as {
//               flowDuration: number;
//               breakDuration: number;
//               numSessions: number;
//             };
//             setFlowDuration(flow);
//             setBreakDuration(breakDur);
//             setNumSessions(sessions);
//             setTimerSeconds(flow * 60); // Convert flow duration to seconds
//           }
//         } catch (error) {
//           console.error('Error fetching timer settings:', error);
//         }
//       }
//     };
//     fetchTimerSettings();
//   }, [userId]);

//   const startTimer = () => {
//     setTimerRunning(true);
//   };

//   const stopTimer = () => {
//     setTimerRunning(false);
//     document.title = 'Planz | Timer';
//   };

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout | null = null;
//     if (timerRunning) {
//       intervalId = setInterval(() => {
//         setTimerSeconds((prevSeconds) => {
//           if (prevSeconds === 0) {
//             const audio = new Audio(timerSound);
//             audio.play();
//             if (currentPhase === 'flow') {
//               setCurrentPhase('break');
//               return breakDuration * 60;
//             } else {
//               const newCompletedSessions = completedSessions + 1;
//               setCompletedSessions(newCompletedSessions);
//               if (newCompletedSessions >= numSessions) {
//                 setTimerRunning(false);
//                 document.title = 'Planz | Timer';
//                 return 0;
//               } else {
//                 setCurrentPhase('flow');
//                 return flowDuration * 60;
//               }
//             }
//           }
//           const newTime = prevSeconds - 1;
//           document.title = `${currentPhase}: ${Math.floor(newTime / 60)}:${newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60}`;
//           return newTime;
//         });
//       }, 1000);
//     } else if (intervalId) {
//       clearInterval(intervalId);
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [timerRunning, timerSound, flowDuration, breakDuration, currentPhase, completedSessions, numSessions]);

//   return (
//     <div className={classes.wrapper}>
//       <Link to={'/timer/settings'} className={classes.timerSettingsButton}>
//         <img src={timerButton} alt='add new project' />
//       </Link>
//       <div className={classes.inner}>
//         <h6 className={classes.timerLabel}>{currentPhase === 'flow' ? 'Flow' : 'Break'}</h6>
//         <div className={classes.timer}>
//           {Math.floor(timerSeconds / 60)}:{timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
//         </div>
//         <ul className={classes.circles}>
//           {Array.from({ length: numSessions }, (_, index) => (
//             <li key={index} className={`${classes.circle} ${index < completedSessions ? 'completed' : ''}`}></li>
//           ))}
//         </ul>
//         <button className={classes.timerButton} onClick={timerRunning ? stopTimer : startTimer}>
//           {timerRunning ? <img src={pauseButton} alt='pause' /> : <img src={playButton} alt='play' />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimerPage;

import { FC, useEffect, useRef, useState } from 'react';

import classes from './Timer.module.scss';

import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import pauseButton from '../../assets/icons/pause.svg';
import playButton from '../../assets/icons/play.svg';
import timerButton from '../../assets/icons/timer.svg';
import timerSound from '../../assets/timer-sound.mp3';

const TimerPage: FC = () => {
  const [flowDuration, setFlowDuration] = useState<number>(0);
  const [breakDuration, setBreakDuration] = useState<number>(0);
  const [numSessions, setNumSessions] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<'flow' | 'break'>('flow');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    document.title = 'Planz | Timer';
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTimerSettings = async () => {
      if (userId) {
        try {
          const timerSettingsDocRef = doc(firestore, 'timer-settings', `settings-for-${userId}`);
          const timerSettingsDoc = await getDoc(timerSettingsDocRef);
          if (timerSettingsDoc.exists()) {
            const {
              flowDuration: flow,
              breakDuration: breakDur,
              numSessions: sessions,
            } = timerSettingsDoc.data() as {
              flowDuration: number;
              breakDuration: number;
              numSessions: number;
            };
            setFlowDuration(flow);
            setBreakDuration(breakDur);
            setNumSessions(sessions);
            setTimerSeconds(flow * 60); // Convert flow duration to seconds
          }
        } catch (error) {
          console.error('Error fetching timer settings:', error);
        }
      }
    };
    fetchTimerSettings();
  }, [userId]);

  const startTimer = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        action: 'start',
        duration: timerSeconds,
        phase: currentPhase,
      });
    }
    setTimerRunning(true);
  };

  const stopTimer = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'stop' });
    }
    setTimerRunning(false);
    document.title = 'Planz | Timer';
  };

  // useEffect(() => {
  //   workerRef.current = new Worker(new URL('./timerWorker.ts', import.meta.url), { type: 'module' });

  //   workerRef.current.onmessage = (e: MessageEvent<{ duration?: number; phase?: 'flow' | 'break'; action?: 'complete' }>) => {
  //     console.log('Message from worker:', e.data);
  //     const { duration, phase, action } = e.data;

  //     if (action === 'complete') {
  //       const audio = new Audio(timerSound);
  //       audio.play();

  //       if (phase === 'flow') {
  //         setCurrentPhase('break');
  //         setTimerSeconds(breakDuration * 60);
  //       } else {
  //         const newCompletedSessions = completedSessions + 1;
  //         setCompletedSessions(newCompletedSessions);
  //         if (newCompletedSessions >= numSessions) {
  //           setTimerRunning(false);
  //           document.title = 'Planz | Timer';
  //           setTimerSeconds(0);
  //         } else {
  //           setCurrentPhase('flow');
  //           setTimerSeconds(flowDuration * 60);
  //         }
  //       }
  //     } else if (duration !== undefined) {
  //       setTimerSeconds(duration);
  //       document.title = `${phase}: ${Math.floor(duration / 60)}:${duration % 60 < 10 ? `0${duration % 60}` : duration % 60}`;
  //     }
  //   };

  //   return () => {
  //     if (workerRef.current) {
  //       workerRef.current.terminate();
  //       workerRef.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./timerWorker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const { duration, phase, action } = e.data;

      if (action === 'complete') {
        const audio = new Audio(timerSound);
        audio.play();

        if (phase === 'flow') {
          setCurrentPhase('break');
          const breakTime = breakDuration * 60;
          setTimerSeconds(breakTime);

          workerRef.current?.postMessage({
            action: 'start',
            duration: breakTime,
            phase: 'break',
          });
        } else {
          const newCompletedSessions = completedSessions + 1;
          setCompletedSessions(newCompletedSessions);

          if (newCompletedSessions >= numSessions) {
            setTimerRunning(false);
            document.title = 'Planz | Timer';
            setTimerSeconds(0);
          } else {
            setCurrentPhase('flow');
            const flowTime = flowDuration * 60;
            setTimerSeconds(flowTime);

            workerRef.current?.postMessage({
              action: 'start',
              duration: flowTime,
              phase: 'flow',
            });
          }
        }
      } else if (duration !== undefined) {
        setTimerSeconds(duration);
        document.title = `${capitalizePhase(phase)}: ${Math.floor(duration / 60)}:${duration % 60 < 10 ? `0${duration % 60}` : duration % 60}`;

        function capitalizePhase(phase: 'flow' | 'break'): string {
          return phase.charAt(0).toUpperCase() + phase.slice(1);
        }
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={classes.wrapper}>
      <Link to={'/timer/settings'} className={classes.timerSettingsButton}>
        <img src={timerButton} alt='add new project' />
      </Link>
      <div className={classes.inner}>
        <h6 className={classes.timerLabel}>{currentPhase === 'flow' ? 'Flow' : 'Break'}</h6>
        <div className={classes.timer}>
          {Math.floor(timerSeconds / 60)}:{timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
        </div>
        <ul className={classes.circles}>
          {Array.from({ length: numSessions }, (_, index) => (
            <li key={index} className={`${classes.circle} ${index < completedSessions ? 'completed' : ''}`}></li>
          ))}
        </ul>
        <button className={classes.timerButton} onClick={timerRunning ? stopTimer : startTimer}>
          {timerRunning ? <img src={pauseButton} alt='pause' /> : <img src={playButton} alt='play' />}
        </button>
      </div>
    </div>
  );
};

export default TimerPage;
