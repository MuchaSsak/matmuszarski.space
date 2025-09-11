import { useLingui } from "@lingui/react/macro";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSound from "use-sound";

import musicSound from "@/assets/music/music.ogg";
import airPressureReleaseSfx from "@/assets/sfx/air_pressure_release.ogg";
import sciFiDoorOpenSfx from "@/assets/sfx/sci_fi_door_close.ogg";
import AudioSettingButton from "@/components/AudioSettingButton";
import GraphicsSettingButton from "@/components/GraphicsSettingButton";
import LanguageSettingButton from "@/components/LanguageSettingButton";
import { Button } from "@/components/ui/button";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

function StartupScreen() {
  const { t } = useLingui();
  const { dispatch, hasStartedExperience, isAudioEnabled, audioVolume } =
    useSettingsContext();
  const [playSciFiDoorOpenSfx] = useSound(sciFiDoorOpenSfx, {
    volume: isAudioEnabled ? audioVolume : 0,
  });
  const [playAirPressureReleaseSfx] = useSound(airPressureReleaseSfx, {
    volume: isAudioEnabled ? audioVolume : 0,
  });
  const [playMusicSound] = useSound(musicSound, {
    volume: isAudioEnabled ? audioVolume : 0,
  });
  const startupScreenContainerRef = useRef<HTMLDivElement>(null);
  const settingsButtonsContainerRef = useRef<HTMLDivElement>(null);
  const loadingTextContainerRef = useRef<HTMLHeadingElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const leftOverlayPanelRef = useRef<HTMLImageElement>(null);
  const rightOverlayPanelRef = useRef<HTMLImageElement>(null);
  const [hasLoadedBackgroundImage, setHasLoadedBackgroundImage] =
    useState(false);

  function handlePlayStartExperienceSounds() {
    gsap.delayedCall(0, playSciFiDoorOpenSfx);
    gsap.delayedCall(3.75, playAirPressureReleaseSfx);

    gsap.delayedCall(5, playMusicSound);
  }

  function handleStartExperience() {
    dispatch({ type: "experience/start" });
    handlePlayStartExperienceSounds();
  }

  // GSAP animations
  useEffect(() => {
    /**
     * On entry animations
     */
    // Fade in loading text
    if (!hasLoadedBackgroundImage) {
      gsap.fromTo(
        loadingTextContainerRef.current,
        { opacity: 0 },
        { opacity: 1 }
      );
    }

    // Fade in background image
    if (hasLoadedBackgroundImage)
      gsap.to(backgroundImageRef.current, {
        filter: "brightness(100%)",
        duration: 4,
        ease: "sine.inOut",
      });

    if (hasLoadedBackgroundImage)
      gsap.to(settingsButtonsContainerRef.current, {
        opacity: 1,
        duration: 4,
        delay: 1.5,
      });

    /**
     * On start experience animations
     */
    if (!hasStartedExperience) return;

    // Startup screen disappear when side panels are closed in
    gsap.to(startupScreenContainerRef.current, {
      display: "none",
      duration: 0.01,
      delay: 2.8,
    });

    // Left panel slide in
    gsap
      .timeline()
      .to(leftOverlayPanelRef.current, {
        x: 0,
        delay: 0.25,
        duration: 2.5,
        ease: "bounce.out",
      })
      .to(leftOverlayPanelRef.current, {
        x: "-100%",
        ease: "sine.inOut",
        boxShadow: "0 0 0 transparent",
        delay: 1,
        duration: 2,
      })
      .to(leftOverlayPanelRef.current, { display: "none" });

    // Right panel slide in
    gsap
      .timeline()
      .to(rightOverlayPanelRef.current, {
        x: 0,
        delay: 0.25,
        duration: 2.5,
        ease: "bounce.out",
      })
      .to(rightOverlayPanelRef.current, {
        x: "100%",
        ease: "sine.inOut",
        boxShadow: "0 0 0 transparent",
        delay: 1,
        duration: 2,
      })
      .to(rightOverlayPanelRef.current, { display: "none" });
  }, [
    hasStartedExperience,
    hasLoadedBackgroundImage,
    playSciFiDoorOpenSfx,
    playAirPressureReleaseSfx,
  ]);

  // Set hasLoadedBackgroundImage on image load
  useEffect(() => {
    backgroundImageRef.current.addEventListener("load", () =>
      setHasLoadedBackgroundImage(true)
    );
  }, []);

  return (
    <div
      ref={startupScreenContainerRef}
      className="w-screen h-screen left-0 top-0 z-50 absolute flex justify-center items-center"
    >
      {/* Loading text */}
      <div ref={loadingTextContainerRef}>
        <h1
          className={cn(
            "text-2xl transition-opacity duration-500 ease-in-out select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            hasLoadedBackgroundImage ? "opacity-0!" : "opacity-100!"
          )}
        >
          {t`Deploying...`}
        </h1>
      </div>

      <div className="opacity-0" ref={settingsButtonsContainerRef}>
        {/* Settings buttons */}
        <LanguageSettingButton
          sideOffset={32}
          buttonText={t`Language`}
          buttonVariant="ghost"
          buttonClassName="bg-transparent! w-[14%] h-[4.5%] left-[24.25%] top-[78%] fixed [transform:perspective(35vw)_rotateY(-10deg)_rotateX(20deg)_skewX(-5deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-[1.5vw] focus-visible:[box-shadow:0_0_5vw_var(--foreground)] hover:[box-shadow:0_0_5vw_var(--foreground)]"
        />
        <GraphicsSettingButton
          sideOffset={32}
          buttonText={t`Graphics`}
          buttonVariant="ghost"
          buttonClassName="bg-transparent! w-[14%] h-[4.5%] top-[78%] left-1/2 -translate-x-1/2 fixed [transform:perspective(35vw)_rotateX(20deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-[1.5vw] focus-visible:[box-shadow:0_0_5vw_var(--foreground)] hover:[box-shadow:0_0_5vw_var(--foreground)]"
        />
        <AudioSettingButton
          sideOffset={32}
          buttonText={t`Sounds`}
          buttonVariant="ghost"
          buttonClassName="bg-transparent! w-[14%] h-[4.5%] top-[78%] right-[25%] fixed [transform:perspective(35vw)_rotateY(10deg)_rotateX(20deg)_skewX(5deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-[1.5vw] focus-visible:[box-shadow:0_0_5vw_var(--foreground)] hover:[box-shadow:0_0_5vw_var(--foreground)]"
        />

        {/* Start button */}
        <Button
          onClick={handleStartExperience}
          disabled={hasStartedExperience}
          variant="ghost"
          className="text-[5vw] left-1/2 -translate-x-1/2 top-[53%] fixed bg-transparent! focus-visible:[box-shadow:0_0_10rem_var(--foreground)] hover:[box-shadow:0_0_10rem_var(--foreground)] text-[#084000] focus-visible:text-[#117D00] focus-visible:border-2 focus-visible:border-[#084000] hover:text-[#117D00] font-black tracking-[0.15em] h-[15%] w-[38%] rounded-full [transform:perspective(35vw)_rotateX(20deg)]"
        >{t`START`}</Button>
      </div>

      {/* Background image */}
      <img
        ref={backgroundImageRef}
        className={cn(
          "w-screen h-screen object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 brightness-0"
        )}
        src="/assets/pictures/startup_screen_background.jpg"
        alt="The control panel of your spaceship which will take you to a tour of Mateusz Muszarski's portfolio"
      />

      {/* Start animation side panels */}
      {createPortal(
        <>
          <img
            src="/assets/pictures/startup_screen_door.jpg"
            alt="The door side panels of your spaceship which will take you to a tour of Mateusz Muszarski's portfolio"
            ref={leftOverlayPanelRef}
            className="h-screen w-[50vw] -scale-x-100 absolute [box-shadow:0_0_1rem_rgba(0,0,0,0.75)] object-cover left-0 -translate-x-full top-0 z-50"
          />
          <img
            src="/assets/pictures/startup_screen_door.jpg"
            alt="The door side panels of your spaceship which will take you to a tour of Mateusz Muszarski's portfolio"
            ref={rightOverlayPanelRef}
            className="h-screen w-[50vw] absolute object-cover [box-shadow:0_0_1rem_rgba(0,0,0,0.75)] right-0 translate-x-full top-0 z-50"
          />
        </>,
        document.body
      )}
    </div>
  );
}

export default StartupScreen;
