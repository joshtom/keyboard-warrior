import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Group } from "three";

import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";
import { useSoundEngine } from "@/hooks/useSoundEngine";

type SplashScreenProps = {
  onDismiss: () => void;
};

function readThemeColor(variableName: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

function FloatingKeyboard() {
  const modelRef = useRef<Group>(null);
  const { scene } = useGLTF("/assets/keyboard.glb");

  useFrame(({ clock }) => {
    if (!modelRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    modelRef.current.rotation.y = elapsed * 0.24;
    modelRef.current.position.y = Math.sin(elapsed * 1.4) * 0.12;
  });

  return (
    <group
      ref={modelRef}
      rotation={[0.1, -0.42, 0]}
      scale={8}
    >
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function SplashScene() {
  const colors = useMemo(() => {
    return {
      accent: readThemeColor("--color-accent"),
      text: readThemeColor("--color-text-primary"),
    };
  }, []);

  return (
    <Canvas
      camera={{
        fov: 36,
        position: [0, 1.1, 3.6],
      }}
      className="h-full w-full"
      dpr={[1, 1.6]}
      style={{ height: "100%", width: "100%" }}
    >
      <ambientLight color={colors.text} intensity={1.15} />
      <directionalLight
        color={colors.accent}
        intensity={2.4}
        position={[2.8, 4, 3]}
      />
      <pointLight color={colors.accent} intensity={18} position={[-2.2, 1.2, 1.6]} />
      <Suspense fallback={null}>
        <FloatingKeyboard />
      </Suspense>
    </Canvas>
  );
}

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const isCoarsePointer = useIsCoarsePointer();
  const sound = useSoundEngine();
  const [isLeaving, setIsLeaving] = useState(false);

  const dismiss = useCallback(() => {
    if (isLeaving) {
      return;
    }

    sound.playSplashDismiss();
    setIsLeaving(true);
    window.setTimeout(onDismiss, 360);
  }, [isLeaving, onDismiss, sound]);

  useEffect(() => {
    const handleKeyDown = () => dismiss();

    window.addEventListener("keydown", handleKeyDown, { once: true });

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dismiss]);

  return (
    <main
      className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-(--color-bg) px-6 text-center transition-[opacity,transform] duration-300 ease-out data-[leaving=true]:scale-[1.02] data-[leaving=true]:opacity-0"
      data-leaving={isLeaving ? "true" : "false"}
      onPointerDown={dismiss}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-(--color-accent) opacity-70 shadow-[0_0_34px_var(--color-glow)]"
      />

      <section className="relative flex w-full max-w-5xl flex-col items-center">
        <div className="h-[46vh] min-h-72 w-full max-w-4xl sm:h-[54vh]">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.22em] text-(--color-text-muted) uppercase">
                Loading keyboard
              </div>
            }
          >
            <div className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full">
              <SplashScene />
            </div>
          </Suspense>
        </div>

        <div className="animate-[kw-fade-up_560ms_120ms_ease-out_both]">
          <p className="text-xs font-semibold tracking-[0.22em] text-(--color-accent) uppercase">
            Keyboard reaction arena
          </p>
          <h1 className="mt-4 text-4xl leading-none font-black tracking-normal text-(--color-text-primary) sm:text-6xl lg:text-7xl">
            Keyboard Warrior
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-(--color-text-secondary) sm:text-base">
            {isCoarsePointer ? "Tap to begin" : "Press any key"}
          </p>
          <p className="mt-5 animate-[kw-pulse_1.8s_ease-in-out_infinite] text-xs font-bold tracking-[0.18em] text-(--color-text-muted) uppercase">
            {isCoarsePointer ? "Tap anywhere" : "Keyboard ready"}
          </p>
        </div>
      </section>
    </main>
  );
}

useGLTF.preload("/assets/keyboard.glb");
