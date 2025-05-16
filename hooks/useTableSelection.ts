// import { useEffect, useRef, useState } from 'react';
// import { Animated } from 'react-native';

// export const useTableSelection = () => {
//   const [current, setCurrent] = useState<any>(null);
//   const glowAnim = useRef(new Animated.Value(0)).current;

//   return { current, setCurrent, glowAnim };
// };

// export const useAnimatedGlow = (tables: any[]) => {
//   const glowAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (tables.some(t => t.enabled)) {
//       const loop = Animated.loop(
//         Animated.sequence([
//           Animated.timing(glowAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(glowAnim, {
//             toValue: 0,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ])
//       );
//       loop.start();
//       return () => loop.stop();
//     }
//   }, [tables, glowAnim]);

//   return glowAnim;
// };
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Table } from '../types';

export const useTableSelection = () => {
  const [current, setCurrent] = useState<Table | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  return { current, setCurrent, glowAnim };
};

export const useAnimatedGlow = (tables: Table[]) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (tables.some(t => t.enabled)) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [tables, glowAnim]);

  return glowAnim;
};