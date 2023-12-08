import { Image } from 'expo-image';
import { useState, useEffect, useMemo, useReducer } from 'react';
import { View, Image as RNImage } from 'react-native';

type Benchmark = {
  component: (props: { onComplete: () => void; step: number }) => JSX.Element;
  name: string;
};

function ExpoImageBenchmarkComponent(props: { onComplete: () => void; step: number }) {
  return (
    <Image
      source={{ uri: `https://picsum.photos/id/${3 + (props.step % 3)}/200/300/` }}
      style={{ width: 200, height: 200 }}
      onLoad={props.onComplete}
    />
  );
}

function RNImageBenchmarkComponent(props: { onComplete: () => void; step: number }) {
  return (
    <RNImage
      source={{ uri: `https://picsum.photos/id/${3 + (props.step % 3)}/200/300/` }}
      style={{ width: 200, height: 200 }}
      onLoad={props.onComplete}
    />
  );
}

function BenchmarkRunner({
  benchmark,
  count,
  delay,
  onCompleted,
}: {
  benchmark: Benchmark;
  count: number;
  delay: number;
  onCompleted: () => void;
}) {
  const [start, setStart] = useState(Date.now());

  const [step, setStep] = useState(delay > 0 ? -1 : 1);
  useEffect(() => {
    if (delay > 0) {
      setTimeout(() => {
        setStep(1);
        setStart(Date.now());
      }, delay * 1000);
    }
  }, [delay]);
  if (step < 0) return <>{benchmark.name} - delay</>;
  return (
    <>
      {benchmark.name} - running
      <benchmark.component
        key={step}
        step={step}
        onComplete={() => {
          // console.log(`Benchmark ${benchmark.name} step ${step} of ${count}`);

          if (step === count) {
            const end = Date.now();
            const time = end - start;
            console.log(`Benchmark ${benchmark.name} took ${time}ms`);
            onCompleted();
          } else {
            setStep((prev) => prev + 1);
          }
        }}
      />
    </>
  );
}

const benchmarks: Benchmark[] = [
  { component: ExpoImageBenchmarkComponent, name: 'ExpoImage' },
  { component: RNImageBenchmarkComponent, name: 'RNImage' },
];

export default () => {
  const [benchmarkNumber, nextBenchmark] = useReducer(
    (prev: number) => (prev + 1 >= benchmarks.length ? prev : prev + 1),
    0
  );

  return (
    <View>
      <BenchmarkRunner
        benchmark={benchmarks[benchmarkNumber]}
        count={500}
        key={benchmarkNumber}
        delay={2}
        onCompleted={() => nextBenchmark()}
      />
    </View>
  );
};
