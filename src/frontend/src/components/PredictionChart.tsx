import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PredictionChartProps {
  historicalDates: string[];
  historicalPrices: number[];
  predictionDates: string[];
  predictionPrices: number[];
  ticker: string;
}

// 3D Chart component using Three.js
const Chart3D: React.FC<{
  historicalPrices: number[];
  predictionPrices: number[];
  ticker: string;
}> = ({ historicalPrices, predictionPrices, ticker }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Normalize prices for 3D visualization
  const allPrices = [...historicalPrices, ...predictionPrices];
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // Create points for historical data
  const historicalPoints = useMemo(() => {
    return historicalPrices.map((price, i) => {
      const normalizedY = ((price - minPrice) / priceRange) * 5;
      const x = (i / historicalPrices.length) * 8 - 4;
      return new THREE.Vector3(x, normalizedY, 0);
    });
  }, [historicalPrices, minPrice, priceRange]);

  // Create points for prediction data
  const predictionPoints = useMemo(() => {
    const start = predictionPrices.map((price, i) => {
      const normalizedY = ((price - minPrice) / priceRange) * 5;
      const x = ((historicalPrices.length + i) / (historicalPrices.length + predictionPrices.length)) * 8 - 4;
      return new THREE.Vector3(x, normalizedY, 0);
    });
    return start;
  }, [predictionPrices, historicalPrices.length, minPrice, priceRange]);

  // Animated particles
  const Particles: React.FC<{ count: number }> = ({ count }) => {
    const particlesRef = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 10;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      }
      return pos;
    }, [count]);

    useFrame((state) => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      }
    });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#90caf9"
          transparent
          opacity={0.6}
        />
      </points>
    );
  };

  return (
    <Canvas camera={{ position: [0, 2.5, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <group ref={groupRef}>
        {/* Historical price line */}
        {historicalPoints.length > 1 && (
          <Line
            points={historicalPoints}
            color="#90caf9"
            lineWidth={2}
          />
        )}

        {/* Prediction price line */}
        {predictionPoints.length > 1 && (
          <Line
            points={predictionPoints}
            color="#ce93d8"
            lineWidth={2}
          />
        )}

        {/* End point marker */}
        {predictionPoints.length > 0 && (
          <mesh position={[predictionPoints[predictionPoints.length - 1].x, predictionPoints[predictionPoints.length - 1].y, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ce93d8" emissive="#ce93d8" emissiveIntensity={0.5} />
          </mesh>
        )}

        {/* Ticker label */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            position={[0, 4, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {ticker}
          </Text>
        </Float>
      </group>

      <Particles count={200} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={15}
      />
    </Canvas>
  );
};

export const PredictionChart: React.FC<PredictionChartProps> = ({
  historicalDates,
  historicalPrices,
  predictionDates,
  predictionPrices,
  ticker,
}) => {
  // Prepare data for 2D fallback chart
  const chartData = useMemo(() => {
    const data = [];

    // Historical data
    historicalDates.forEach((date, i) => {
      data.push({
        date: date.slice(5), // Show only MM-DD
        historical: historicalPrices[i],
        predicted: null,
      });
    });

    // Prediction data
    predictionDates.forEach((date, i) => {
      data.push({
        date: date.slice(5),
        historical: null,
        predicted: predictionPrices[i],
      });
    });

    return data;
  }, [historicalDates, historicalPrices, predictionDates, predictionPrices]);

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 3,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #333',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#90caf9', mb: 2 }}>
        Price Prediction Chart
      </Typography>

      {/* 3D Chart */}
      <Box sx={{ height: 300, mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <Chart3D
          historicalPrices={historicalPrices}
          predictionPrices={predictionPrices}
          ticker={ticker}
        />
      </Box>

      {/* 2D Chart as detailed view */}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} tickFormatter={formatPrice} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: 8,
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Legend />
            <RechartsLine
              type="monotone"
              dataKey="historical"
              stroke="#90caf9"
              strokeWidth={2}
              dot={false}
              name="Historical"
            />
            <RechartsLine
              type="monotone"
              dataKey="predicted"
              stroke="#ce93d8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};