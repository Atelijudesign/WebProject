/**
 * Staircase Structural Design & Ergonomic Utilities
 */

/**
 * Calculates staircase parameters given total height and desired tread (huella).
 * @param {number} totalHeight - Total elevation in mm (e.g. 2800)
 * @param {number} tread - Desired tread width in mm (huella, e.g. 280)
 * @param {number} [targetRiser=175] - Target riser height in mm (contrahuella, e.g. 175)
 */
export function calculateStaircase(totalHeight, tread, targetRiser = 175) {
  if (!totalHeight || totalHeight <= 0) {
    throw new Error("Total height must be greater than zero");
  }
  if (!tread || tread <= 0) {
    throw new Error("Tread width must be greater than zero");
  }

  // Calculate required number of steps (round to nearest integer)
  const stepCount = Math.max(1, Math.round(totalHeight / targetRiser));
  const calculatedRiser = totalHeight / stepCount;

  // Blondel's Rule (2 * Contrahuella + Huella): ideal range is 600mm to 640mm (630mm optimum)
  const blondelValue = 2 * calculatedRiser + tread;
  const isBlondelCompliant = blondelValue >= 600 && blondelValue <= 640;

  // Angle of inclination in degrees: atan(riser / tread)
  const angleRad = Math.atan(calculatedRiser / tread);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Total horizontal run length in mm
  const totalRun = (stepCount - 1) * tread;

  // Total diagonal stringer length in mm
  const stringerLength = Math.sqrt(Math.pow(totalHeight, 2) + Math.pow(totalRun, 2));

  return {
    stepCount,
    calculatedRiser: parseFloat(calculatedRiser.toFixed(2)),
    tread,
    totalHeight,
    totalRun,
    stringerLength: parseFloat(stringerLength.toFixed(2)),
    blondelValue: parseFloat(blondelValue.toFixed(2)),
    isBlondelCompliant,
    angleDeg: parseFloat(angleDeg.toFixed(2)),
  };
}
