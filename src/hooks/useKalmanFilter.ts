import { LatLng, haversineDistanceMeters } from "../utils/geoMath";

type KalmanConfig = {
  processNoise: number;
  measurementNoise: number;
  initialError: number;
};

type KalmanState1D = {
  value: number;
  error: number;
};

export type KalmanFilterConfig = {
  lat: KalmanConfig;
  lng: KalmanConfig;
};

export type FilteredPosition = {
  position: LatLng;
  velocityMetersPerSecond: number;
  timestamp: number;
};

class Kalman1D {
  private state: KalmanState1D | null = null;

  constructor(
    private readonly processNoise: number,
    private readonly measurementNoise: number,
    private readonly initialError: number
  ) {}

  update(measurement: number): KalmanState1D {
    if (!this.state) {
      this.state = {
        value: measurement,
        error: this.initialError,
      };
      return this.state;
    }

    // Predict
    const predictedValue = this.state.value;
    const predictedError = this.state.error + this.processNoise;

    // Update
    const gain =
      predictedError / (predictedError + this.measurementNoise);
    const value =
      predictedValue + gain * (measurement - predictedValue);
    const error = (1 - gain) * predictedError;

    this.state = { value, error };
    return this.state;
  }
}

export const defaultKalmanConfig: KalmanFilterConfig = {
  lat: {
    processNoise: 1e-5,
    measurementNoise: 1e-3,
    initialError: 1,
  },
  lng: {
    processNoise: 1e-5,
    measurementNoise: 1e-3,
    initialError: 1,
  },
};

export function createKalmanFilter(config?: Partial<KalmanFilterConfig>) {
  const merged: KalmanFilterConfig = {
    lat: { ...defaultKalmanConfig.lat, ...(config?.lat ?? {}) },
    lng: { ...defaultKalmanConfig.lng, ...(config?.lng ?? {}) },
  };

  const latFilter = new Kalman1D(
    merged.lat.processNoise,
    merged.lat.measurementNoise,
    merged.lat.initialError
  );
  const lngFilter = new Kalman1D(
    merged.lng.processNoise,
    merged.lng.measurementNoise,
    merged.lng.initialError
  );

  let lastOutput: FilteredPosition | null = null;

  function update(
    rawPosition: LatLng,
    timestamp: number
  ): FilteredPosition {
    const latState = latFilter.update(rawPosition.lat);
    const lngState = lngFilter.update(rawPosition.lng);

    let velocityMetersPerSecond = 0;

    if (lastOutput) {
      const dt = (timestamp - lastOutput.timestamp) / 1000;
      if (dt > 0) {
        const distanceMeters = haversineDistanceMeters(
          lastOutput.position,
          {
            lat: latState.value,
            lng: lngState.value,
          }
        );
        velocityMetersPerSecond = distanceMeters / dt;
      }
    }

    lastOutput = {
      position: { lat: latState.value, lng: lngState.value },
      velocityMetersPerSecond,
      timestamp,
    };

    return lastOutput;
  }

  return {
    update,
    getLastOutput: () => lastOutput,
  };
}

