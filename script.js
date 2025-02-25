//**
// Based on supersplat export
// edited by Kadek Satriadi
//  */
import * as pc from "playcanvas";

document.addEventListener("DOMContentLoaded", async () => {
  const appElement = await document.querySelector("pc-app").ready();
  const app = await appElement.app;
  const backgroundColor = new pc.Color(1, 1, 1, 1);
  const entityElement = await document
    .querySelector('pc-entity[name="camera"]')
    .ready();
  const entity = entityElement.entity;

  let panelParent = null;
  let bbox = null;

  const resetPosition = null;
  const resetTarget = null;
  const templeInfoAsset = app.assets.find("temple-info");
  const logoAsset = app.assets.find("texture-logo");
  const panelAsset = app.assets.find("texture-panel");
  const audioAsset = app.assets.find("pftk");
  const splatEntity = app.root.findByName("splat");
  const mainRenderer = app.root.findByName("mainrenderer");
  const panelParentEntity = app.root.findByName("panelparent");
  const audioEntity = new pc.Entity("audioSource");
  const audioId = "pftkaudio";
  if (audioEntity) {
    // Add sound component
    audioEntity.addComponent("sound", {
      volume: 1,
      pitch: 1,
      loop: true,
    });

    // Add the audio asset
    audioEntity.sound.addSlot(audioId, {
      asset: audioAsset,
      volume: 1,
      pitch: 1,
      loop: true,
    });

   // audioEntity.sound.play('pftk');

  }

  // Add to parent entity
  splatEntity.addChild(audioEntity);

  mainRenderer.setLocalPosition(0, 1.4, -0.6);
  splatEntity.addComponent("script");
  splatEntity.script.create("rotateEntity");

  function createInformationPanel(bbox, templeInfo) {
    // Create text
    console.log(app);
    // During asset preloading
    app.assets.loadFromUrl(
      "./assets/Roboto-Black.json",
      "font",
      function (err, asset) {
        const fontAssetId = asset.id;
        //Parameters
        const panelScale = 0.001;
        const mainTextFontSize = 16;
        const secondaryTextFontSize = 8;
        const bodyTextFontSize = 6;
        const footerTextFontSize = 3;
        const mainSecSpace = -10;
        const secTerSpace = mainSecSpace - 8;
        const bspace = 7;

        const logoConfig = {
          width: 468,
          height: 276,
          scale: 0.2,
          localPosition: {
            x: -100,
            y: -35,
            z: 0,
          },
        };

        const panelBgConfig = {
          width: 2584,
          height: 835,
          scale: 0.11,
          color: new pc.Color(0, 0, 0),
          localPosition: {
            x: -112,
            y: -56,
            z: 0,
          },
        };

        const textConfig = {
          type: pc.ELEMENTTYPE_TEXT,
          color: new pc.Color(1, 1, 1),
          opacity: 1,
          outlineColor: new pc.Color(0.3, 0.3, 0.3),
          outlineThickness: 0.1,
          fontAsset: fontAssetId,
          wrapLines: true,
          anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5), // centered anchor
        };

        function createTextEntity(config, name, text, fontSize) {
          const entity = new pc.Entity(name);
          const elm = entity.addComponent("element", config);
          elm.text = text;
          elm.fontSize = fontSize;
          return {
            entity: entity,
            elm: elm,
          };
        }

        // Create Logo
        const logoEntity = new pc.Entity("logo");
        logoEntity.addComponent("element", {
          type: pc.ELEMENTTYPE_IMAGE,
          textureAsset: logoAsset.id,
          width: logoConfig.width * logoConfig.scale,
          height: logoConfig.height * logoConfig.scale,
        });

        // Create Panel Background
        const panelBackgroundEntity = new pc.Entity("panelBackground");
        panelBackgroundEntity.addComponent("element", {
          type: pc.ELEMENTTYPE_IMAGE,
          textureAsset: panelAsset.id,
          width: panelBgConfig.width * panelBgConfig.scale,
          height: panelBgConfig.height * panelBgConfig.scale,
          opacity: 0.7,
          color: panelBgConfig.color,
        });

        // Create Parent
        panelParent = new pc.Entity("InfoPanel");
        const mainTextEntity = createTextEntity(
          textConfig,
          "main",
          templeInfo.name,
          mainTextFontSize
        ).entity;
        const secondaryTextEntity = createTextEntity(
          textConfig,
          "second",
          templeInfo.type,
          secondaryTextFontSize
        ).entity;
        const body1 = createTextEntity(
          textConfig,
          "body1",
          templeInfo.description,
          bodyTextFontSize
        ).entity;
        const body2 = createTextEntity(
          textConfig,
          "body2",
          `Dikontribusikan oleh ${templeInfo.contributor}`,
          bodyTextFontSize
        ).entity;
        const body3 = createTextEntity(
          textConfig,
          "body3",
          `Pada tanggal ${templeInfo.contributiondate}`,
          bodyTextFontSize
        ).entity;
        const body4 = createTextEntity(
          textConfig,
          "body4",
          `Pura terletak di ${templeInfo.address}`,
          bodyTextFontSize
        ).entity;

        const footer = createTextEntity(
          textConfig,
          "body4",
          `PID: ${templeInfo.PID}`,
          footerTextFontSize
        ).entity;

        // Add to parent
        panelParent.setLocalScale(panelScale, panelScale, panelScale);
        panelParent.setEulerAngles(0, 0, 0);
        panelParent.addChild(panelBackgroundEntity);
        panelParent.addChild(logoEntity);
        panelParent.addChild(mainTextEntity);
        panelParent.addChild(secondaryTextEntity);
        panelParent.addChild(body1);
        panelParent.addChild(body2);
        panelParent.addChild(body3);
        panelParent.addChild(body4);
        panelParent.addChild(footer);

        // Set scale and pos
        mainTextEntity.setLocalPosition(0, 0, 0);
        secondaryTextEntity.setLocalPosition(0, mainSecSpace, 0);
        body1.setLocalPosition(0, secTerSpace, 0);
        body2.setLocalPosition(0, secTerSpace - bspace * 1, 0);
        body3.setLocalPosition(0, secTerSpace - bspace * 2, 0);
        body4.setLocalPosition(0, secTerSpace - bspace * 3, 0);
        footer.setLocalPosition(0, secTerSpace - bspace * 4, 0);
        logoEntity.setLocalPosition(
          logoConfig.localPosition.x,
          logoConfig.localPosition.y,
          logoConfig.localPosition.z
        );
        panelBackgroundEntity.setLocalPosition(
          panelBgConfig.localPosition.x,
          panelBgConfig.localPosition.y,
          panelBgConfig.localPosition.z
        );

        // Position the cube slightly in front of the panel
        panelParentEntity.setLocalPosition(
          0,
          bbox.halfExtents.y * -0.15,
          bbox.halfExtents.z
        );

        panelParentEntity.addChild(panelParent);
      }
    );
    //end create text
  }

  var rotationSpeed = 1;
  class RotateEntity extends pc.Script {
    initialize() {
      this.rotationSpeed = rotationSpeed;
    }

    update(dt) {
      this.entity.rotate(0, this.rotationSpeed * dt, 0);
    }
  }
  pc.registerScript(RotateEntity, "rotateEntity");

  class FrameScene extends pc.Script {
    frameScene(bbox) {
      const sceneSize = bbox.halfExtents.length();
      const distance =
        sceneSize / Math.sin((this.entity.camera.fov / 180) * Math.PI * 0.5);
      this.entity.script.cameraControls.sceneSize = sceneSize;
      const c = new pc.Vec3(bbox.center.x + 0.2, bbox.center.y, bbox.center.z);
      this.entity.script.cameraControls.focus(
        c,
        new pc.Vec3(0.5, 0.2, 2)
          .normalize()
          .mulScalar(distance)
          .add(bbox.center)
      );
    }

    resetCamera(bbox) {
      const sceneSize = bbox.halfExtents.length();
      this.entity.script.cameraControls.sceneSize = sceneSize * 0.2;
      this.entity.script.cameraControls.focus(
        resetTarget ?? pc.Vec3.ZERO,
        resetPosition ?? new pc.Vec3(0, 0.1, 2)
      );
    }

    calcBound() {
      const gsplatComponents = this.app.root.findComponents("gsplat");
      return (
        gsplatComponents?.[0]?.instance?.meshInstance?.aabb ??
        new pc.BoundingBox()
      );
    }

    initCamera() {
      document.getElementById("loadingIndicator").classList.add("hidden");

      bbox = this.calcBound();

      // configure camera
      this.entity.camera.clearColor = backgroundColor;
      this.entity.camera.horizontalFov = true;
      this.entity.camera.farClip = bbox.halfExtents.length() * 20;
      this.entity.camera.nearClip = this.entity.camera.farClip * 0.0001;
      this.entity.camera.toneMapping = 6;

      if (bbox.halfExtents.length() > 100 || resetPosition || resetTarget) {
        this.resetCamera(bbox);
      } else {
        this.frameScene(bbox);
      }

      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "f":
            this.frameScene(bbox);
            break;
          case "r":
            this.resetCamera(bbox);
            break;
        }
      });
    }

    postInitialize() {
      const assets = this.app.assets.filter((asset) => asset.type === "gsplat");
      if (assets.length > 0) {
        const asset = assets[0];
        if (asset.loaded) {
          this.initCamera();
        } else {
          asset.on("load", () => {
            this.initCamera();
          });
        }
      }
    }
  }

  entity.script.create(FrameScene);

  // Create container for buttons
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute",
    bottom: "max(16px, env(safe-area-inset-bottom))",
    right: "max(16px, env(safe-area-inset-right))",
    display: "flex",
    gap: "8px",
  });

  function createButton({ icon, title, onClick }) {
    const button = document.createElement("button");
    button.innerHTML = icon;
    button.title = title;

    Object.assign(button.style, {
      display: "flex",
      position: "relative",
      width: "40px",
      height: "40px",
      background: "rgba(255, 255, 255, 0.9)",
      border: "1px solid #ddd",
      borderRadius: "8px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      margin: "0",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      transition: "background-color 0.2s",
      color: "#2c3e50",
    });

    const svg = button.querySelector("svg");
    if (svg) {
      svg.style.display = "block";
      svg.style.margin = "auto";
    }

    button.onmouseenter = () => {
      button.style.background = "rgba(255, 255, 255, 1)";
    };

    button.onmouseleave = () => {
      button.style.background = "rgba(255, 255, 255, 0.9)";
    };

    if (onClick) button.onclick = onClick;

    return button;
  }

  // Add VR button if available
  /** if (app.xr.isAvailable("immersive-vr")) {
    const vrButton = createButton({
      icon: `VR`,
      title: "Enter VR",
      onClick: () =>{
        if(panelParent == null) createInformationPanel(bbox, templeInfoAsset.resources[0]);
        entity.camera.clearColor = new pc.Color(1,1,1,1);

        app.xr.start(
          app.root.findComponent("camera"),
          "immersive-vr",
          "local-floor"
        )
      },
    });
    container.appendChild(vrButton);
  }
     */

  // Add AR button if available
  if (app.xr.isAvailable("immersive-ar")) {
    const arButton = createButton({
      icon: `AR`,
      title: "Enter AR",
      onClick: async () => {
        try {
          if (panelParent == null)
            createInformationPanel(bbox, templeInfoAsset.resources[0]);
          audioEntity.sound.play(audioId);
          entity.camera.clearColor = new pc.Color(0, 0, 0, 0);
          app.xr.start(
            app.root.findComponent("camera"),
            "immersive-ar",
            "local-floor"
          );
        } catch (err) {
          alert("AR session request failed:", err);
        }
      },
    });
    container.appendChild(arButton);
  }

  // Add exit XR handler
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      app.xr.end();
      entity.camera.clearColor = backgroundColor;
    }
  });

  // Add fullscreen button if supported
  if (document.documentElement.requestFullscreen && document.exitFullscreen) {
    const enterFullscreenIcon = `<svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
        </svg>`;
    const exitFullscreenIcon = `<svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
        </svg>`;

    const fullscreenButton = createButton({
      icon: enterFullscreenIcon,
      title: "Toggle Fullscreen",
      onClick: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      },
    });

    document.addEventListener("fullscreenchange", () => {
      fullscreenButton.innerHTML = document.fullscreenElement
        ? exitFullscreenIcon
        : enterFullscreenIcon;
      fullscreenButton.title = document.fullscreenElement
        ? "Exit Fullscreen"
        : "Enter Fullscreen";
    });

    container.appendChild(fullscreenButton);
  }

  // Add info button
  const infoButton = createButton({
    icon: `<svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
        </svg>`,
    title: "Show Controls",
    onClick: () => {
      const infoPanel = document.getElementById("infoPanel");
      infoPanel.classList.toggle("hidden");
    },
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("infoPanel").classList.add("hidden");
    }
  });

  container.appendChild(infoButton);
  document.body.appendChild(container);
});
