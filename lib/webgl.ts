/**
 * Détection de WebGL, partagée par les scènes 3D.
 *
 * Sans ce garde, monter un `<Canvas>` react-three-fiber sur un appareil ou un
 * navigateur sans WebGL lève une erreur non capturée. Chaque scène doit donc
 * vérifier la disponibilité AVANT de monter le canvas, et prévoir un repli.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}
